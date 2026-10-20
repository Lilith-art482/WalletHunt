"use client";

import { signInAnonymously } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc, type Firestore } from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getFirebaseServices, isFirebaseConfigured } from "@/lib/firebase";
import type {
  CloudState,
  FavoriteKind,
  FavoritesState,
  Folder,
  SavedRef,
} from "@/lib/types";

const STORAGE_KEY = "wallet-hunt:favorites:v1";
export const MAIN_FOLDER_ID = "main";

const initialFolder: Folder = {
  id: MAIN_FOLDER_ID,
  name: "Основная",
  createdAt: 0,
};

const initialState: FavoritesState = {
  folders: [initialFolder],
  wallets: [],
  devs: [],
  updatedAt: 0,
};

interface FavoritesContextValue {
  state: FavoritesState;
  ready: boolean;
  cloudState: CloudState;
  favoriteCount: number;
  getFolderCount: (folderId: string) => number;
  isFavorite: (kind: FavoriteKind, id: string) => boolean;
  addFavorite: (kind: FavoriteKind, id: string) => void;
  removeFavorite: (kind: FavoriteKind, id: string) => void;
  moveFavorite: (kind: FavoriteKind, id: string, folderId: string) => void;
  createFolder: (name: string) => string | null;
  renameFolder: (folderId: string, name: string) => void;
  deleteFolder: (folderId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function sanitizeFolders(value: unknown): Folder[] {
  if (!Array.isArray(value)) return [{ ...initialFolder }];

  const seen = new Set<string>();
  const folders: Folder[] = [];

  value.forEach((candidate) => {
    const folder = asRecord(candidate);
    if (!folder) return;

    const id = typeof folder.id === "string" ? folder.id.trim() : "";
    const name = typeof folder.name === "string" ? folder.name.trim() : "";
    if (!id || !name || seen.has(id)) return;

    seen.add(id);
    folders.push({
      id,
      name: id === MAIN_FOLDER_ID ? initialFolder.name : name,
      createdAt: typeof folder.createdAt === "number" ? folder.createdAt : Date.now(),
    });
  });

  if (!seen.has(MAIN_FOLDER_ID)) {
    folders.unshift({ ...initialFolder });
  } else {
    folders.sort((first, second) => {
      if (first.id === MAIN_FOLDER_ID) return -1;
      if (second.id === MAIN_FOLDER_ID) return 1;
      return first.createdAt - second.createdAt;
    });
  }

  return folders;
}

function sanitizeRefs(value: unknown, folderIds: Set<string>): SavedRef[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const refs: SavedRef[] = [];

  value.forEach((candidate) => {
    const ref = asRecord(candidate);
    if (!ref) return;

    const id = typeof ref.id === "string" ? ref.id.trim() : "";
    if (!id || seen.has(id)) return;

    const folderId =
      typeof ref.folderId === "string" && folderIds.has(ref.folderId)
        ? ref.folderId
        : MAIN_FOLDER_ID;

    seen.add(id);
    refs.push({
      id,
      folderId,
      addedAt: typeof ref.addedAt === "number" ? ref.addedAt : Date.now(),
    });
  });

  return refs;
}

function normalizeState(value: unknown): FavoritesState {
  const record = asRecord(value) ?? {};
  const folders = sanitizeFolders(record.folders);
  const folderIds = new Set(folders.map((folder) => folder.id));

  return {
    folders,
    wallets: sanitizeRefs(record.wallets, folderIds),
    devs: sanitizeRefs(record.devs, folderIds),
    updatedAt: typeof record.updatedAt === "number" ? record.updatedAt : 0,
  };
}

function mergeRefs(local: SavedRef[], remote: SavedRef[]) {
  const merged = new Map<string, SavedRef>();

  local.forEach((ref) => merged.set(ref.id, ref));
  remote.forEach((ref) => {
    const current = merged.get(ref.id);
    if (!current || ref.addedAt >= current.addedAt) {
      merged.set(ref.id, ref);
    }
  });

  return Array.from(merged.values());
}

function mergeStates(local: FavoritesState, remote: FavoritesState): FavoritesState {
  const folders = new Map<string, Folder>();

  local.folders.forEach((folder) => folders.set(folder.id, folder));
  remote.folders.forEach((folder) => {
    if (folder.id === MAIN_FOLDER_ID) {
      folders.set(folder.id, { ...initialFolder, createdAt: folder.createdAt });
      return;
    }
    folders.set(folder.id, folder);
  });

  const orderedFolders = Array.from(folders.values()).sort((first, second) => {
    if (first.id === MAIN_FOLDER_ID) return -1;
    if (second.id === MAIN_FOLDER_ID) return 1;
    return first.createdAt - second.createdAt;
  });
  const folderIds = new Set(orderedFolders.map((folder) => folder.id));

  const ensureFolders = (ref: SavedRef) =>
    folderIds.has(ref.folderId) ? ref : { ...ref, folderId: MAIN_FOLDER_ID };

  return {
    folders: orderedFolders,
    wallets: mergeRefs(local.wallets, remote.wallets).map(ensureFolders),
    devs: mergeRefs(local.devs, remote.devs).map(ensureFolders),
    updatedAt: Date.now(),
  };
}

function readLocalState() {
  if (typeof window === "undefined") return initialState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeState(JSON.parse(raw)) : initialState;
  } catch {
    return initialState;
  }
}

function writeLocalState(state: FavoritesState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    return;
  }
}

function sameState(first: FavoritesState, second: FavoritesState) {
  return (
    first.updatedAt === second.updatedAt &&
    JSON.stringify({ ...first, updatedAt: 0 }) === JSON.stringify({ ...second, updatedAt: 0 })
  );
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FavoritesState>(initialState);
  const [ready, setReady] = useState(false);
  const [cloudState, setCloudState] = useState<CloudState>(
    isFirebaseConfigured ? "connecting" : "local",
  );
  const stateRef = useRef(state);
  const cloudReadyRef = useRef(false);
  const cloudServicesRef = useRef<{
    db: Firestore;
    uid: string;
  } | null>(null);

  const commit = useCallback((nextState: FavoritesState) => {
    const stampedState = { ...nextState, updatedAt: Date.now() };
    stateRef.current = stampedState;
    setState(stampedState);
  }, []);

  useEffect(() => {
    const localState = readLocalState();
    stateRef.current = localState;
    setState(localState);
    setReady(true);

    if (!isFirebaseConfigured) {
      setCloudState("local");
      return;
    }

    let cancelled = false;
    let unsubscribe: () => void = () => undefined;

    const connect = async () => {
      try {
        const services = getFirebaseServices();
        if (!services) {
          setCloudState("local");
          return;
        }

        const credentials = await signInAnonymously(services.auth);
        if (cancelled) return;

        const uid = credentials.user.uid;
        const userRef = doc(services.db, "users", uid);
        const snapshot = await getDoc(userRef);
        if (cancelled) return;

        const remoteState = snapshot.exists()
          ? normalizeState(snapshot.data())
          : stateRef.current;
        const mergedState = snapshot.exists()
          ? mergeStates(stateRef.current, remoteState)
          : { ...stateRef.current, updatedAt: Date.now() };

        stateRef.current = mergedState;
        setState(mergedState);
        writeLocalState(mergedState);

        cloudServicesRef.current = { db: services.db, uid };
        cloudReadyRef.current = true;

        await setDoc(userRef, mergedState);
        if (cancelled) return;

        setCloudState("cloud");

        unsubscribe = onSnapshot(
          userRef,
          (nextSnapshot) => {
            if (!nextSnapshot.exists()) return;

            const nextRemote = normalizeState(nextSnapshot.data());
            if (sameState(nextRemote, stateRef.current)) return;
            if (nextRemote.updatedAt <= stateRef.current.updatedAt) return;

            stateRef.current = nextRemote;
            setState(nextRemote);
            writeLocalState(nextRemote);
          },
          () => {
            if (!cancelled) setCloudState("error");
          },
        );
      } catch {
        if (!cancelled) {
          setCloudState("error");
        }
      }
    };

    void connect();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    writeLocalState(state);

    if (!cloudReadyRef.current || !cloudServicesRef.current) return;

    const { db, uid } = cloudServicesRef.current;
    const timer = window.setTimeout(() => {
      void setDoc(doc(db, "users", uid), state).catch(() => {
        setCloudState("error");
      });
    }, 180);

    return () => window.clearTimeout(timer);
  }, [state, ready]);

  const isFavorite = useCallback((kind: FavoriteKind, id: string) => {
    return stateRef.current[kind === "wallet" ? "wallets" : "devs"].some(
      (ref) => ref.id === id,
    );
  }, []);

  const addFavorite = useCallback(
    (kind: FavoriteKind, id: string) => {
      const current = stateRef.current;
      const key = kind === "wallet" ? "wallets" : "devs";
      if (current[key].some((ref) => ref.id === id)) return;

      const hasMain = current.folders.some((folder) => folder.id === MAIN_FOLDER_ID);
      const folderId = hasMain ? MAIN_FOLDER_ID : current.folders[0]?.id;

      if (!folderId) return;

      commit({
        ...current,
        [key]: [{ id, folderId, addedAt: Date.now() }, ...current[key]],
      });
    },
    [commit],
  );

  const removeFavorite = useCallback(
    (kind: FavoriteKind, id: string) => {
      const current = stateRef.current;
      const key = kind === "wallet" ? "wallets" : "devs";

      commit({
        ...current,
        [key]: current[key].filter((ref) => ref.id !== id),
      });
    },
    [commit],
  );

  const moveFavorite = useCallback(
    (kind: FavoriteKind, id: string, folderId: string) => {
      const current = stateRef.current;
      const key = kind === "wallet" ? "wallets" : "devs";
      if (!current.folders.some((folder) => folder.id === folderId)) return;

      commit({
        ...current,
        [key]: current[key].map((ref) =>
          ref.id === id ? { ...ref, folderId } : ref,
        ),
      });
    },
    [commit],
  );

  const createFolder = useCallback(
    (name: string) => {
      const trimmedName = name.trim().slice(0, 40);
      if (!trimmedName) return null;

      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? `folder-${crypto.randomUUID()}`
          : `folder-${Date.now()}`;
      const current = stateRef.current;

      commit({
        ...current,
        folders: [
          ...current.folders,
          { id, name: trimmedName, createdAt: Date.now() },
        ],
      });

      return id;
    },
    [commit],
  );

  const renameFolder = useCallback(
    (folderId: string, name: string) => {
      const trimmedName = name.trim().slice(0, 40);
      if (!trimmedName || folderId === MAIN_FOLDER_ID) return;

      const current = stateRef.current;
      commit({
        ...current,
        folders: current.folders.map((folder) =>
          folder.id === folderId ? { ...folder, name: trimmedName } : folder,
        ),
      });
    },
    [commit],
  );

  const deleteFolder = useCallback(
    (folderId: string) => {
      if (folderId === MAIN_FOLDER_ID) return;

      const current = stateRef.current;
      const moveToMain = (ref: SavedRef) =>
        ref.folderId === folderId ? { ...ref, folderId: MAIN_FOLDER_ID } : ref;

      commit({
        ...current,
        folders: current.folders.filter((folder) => folder.id !== folderId),
        wallets: current.wallets.map(moveToMain),
        devs: current.devs.map(moveToMain),
      });
    },
    [commit],
  );

  const favoriteCount = state.wallets.length + state.devs.length;

  const getFolderCount = useCallback(
    (folderId: string) => {
      return (
        state.wallets.filter((ref) => ref.folderId === folderId).length +
        state.devs.filter((ref) => ref.folderId === folderId).length
      );
    },
    [state],
  );

  const value = useMemo(
    () => ({
      state,
      ready,
      cloudState,
      favoriteCount,
      getFolderCount,
      isFavorite,
      addFavorite,
      removeFavorite,
      moveFavorite,
      createFolder,
      renameFolder,
      deleteFolder,
    }),
    [
      addFavorite,
      cloudState,
      createFolder,
      deleteFolder,
      favoriteCount,
      getFolderCount,
      isFavorite,
      moveFavorite,
      ready,
      removeFavorite,
      renameFolder,
      state,
    ],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
}
