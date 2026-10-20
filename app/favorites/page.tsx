"use client";

import {
  ChevronDown,
  Cloud,
  Download,
  Folder,
  FolderPlus,
  HardDrive,
  Pencil,
  Plus,
  SearchX,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PeriodSelector, ReferenceButton } from "@/components/controls";
import { DevCard } from "@/components/dev-card";
import { MAIN_FOLDER_ID, useFavorites } from "@/components/favorites-provider";
import { Modal } from "@/components/modal";
import { usePreferences } from "@/components/preferences-provider";
import { useUI } from "@/components/ui-provider";
import { WalletCard } from "@/components/wallet-card";
import { devByAddress, walletByAddress } from "@/lib/data";
import type { Dev, Folder as FolderType, Period, SavedRef, Wallet } from "@/lib/types";

type FolderDialogMode = "create" | "rename" | null;

interface SavedWalletItem {
  ref: SavedRef;
  entity: Wallet;
}

interface SavedDevItem {
  ref: SavedRef;
  entity: Dev;
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё_-]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function downloadText(content: string, fileName: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function FavoritesPage() {
  const { dictionary: t, language } = usePreferences();
  const { showToast } = useUI();
  const {
    state,
    ready,
    cloudState,
    favoriteCount,
    getFolderCount,
    moveFavorite,
    createFolder,
    renameFolder,
    deleteFolder,
  } = useFavorites();
  const [period, setPeriod] = useState<Period>(30);
  const [activeFolderId, setActiveFolderId] = useState(MAIN_FOLDER_ID);
  const [folderDialogMode, setFolderDialogMode] = useState<FolderDialogMode>(null);
  const [folderName, setFolderName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { query, setQuery } = useUI();

  useEffect(() => {
    if (!state.folders.some((folder) => folder.id === activeFolderId)) {
      setActiveFolderId(MAIN_FOLDER_ID);
    }
  }, [activeFolderId, state.folders]);

  const activeFolder =
    state.folders.find((folder) => folder.id === activeFolderId) ??
    state.folders.find((folder) => folder.id === MAIN_FOLDER_ID) ??
    state.folders[0];

  const folderDisplayName = (folder: FolderType) =>
    folder.id === MAIN_FOLDER_ID ? t.mainFolder : folder.name;

  const savedWallets = useMemo<SavedWalletItem[]>(() => {
    return state.wallets
      .filter((ref) => ref.folderId === activeFolder?.id)
      .map((ref) => {
        const entity = walletByAddress.get(ref.id);
        return entity ? { ref, entity } : null;
      })
      .filter((item): item is SavedWalletItem => item !== null)
      .sort((first, second) => second.ref.addedAt - first.ref.addedAt);
  }, [activeFolder?.id, state.wallets]);

  const savedDevs = useMemo<SavedDevItem[]>(() => {
    return state.devs
      .filter((ref) => ref.folderId === activeFolder?.id)
      .map((ref) => {
        const entity = devByAddress.get(ref.id);
        return entity ? { ref, entity } : null;
      })
      .filter((item): item is SavedDevItem => item !== null)
      .sort((first, second) => second.ref.addedAt - first.ref.addedAt);
  }, [activeFolder?.id, state.devs]);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleWallets = savedWallets.filter(
    ({ entity }) =>
      !normalizedQuery ||
      entity.name.toLowerCase().includes(normalizedQuery) ||
      entity.address.toLowerCase().includes(normalizedQuery),
  );
  const visibleDevs = savedDevs.filter(
    ({ entity }) =>
      !normalizedQuery ||
      entity.name.toLowerCase().includes(normalizedQuery) ||
      entity.address.toLowerCase().includes(normalizedQuery),
  );
  const folderTotal = savedWallets.length + savedDevs.length;
  const filteredTotal = visibleWallets.length + visibleDevs.length;

  const exportFolder = () => {
    if (!activeFolder) return;
    const addresses = [
      ...savedWallets.map(({ entity }) => entity.address),
      ...savedDevs.map(({ entity }) => entity.address),
    ];
    const fileName = `wallet-hunt-${sanitizeFileName(folderDisplayName(activeFolder)) || "favorites"}.txt`;
    downloadText(addresses.join("\n"), fileName);
    showToast(t.exported);
  };

  const openCreateFolder = () => {
    setFolderName("");
    setFolderDialogMode("create");
  };

  const openRenameFolder = () => {
    if (!activeFolder || activeFolder.id === MAIN_FOLDER_ID) return;
    setFolderName(activeFolder.name);
    setFolderDialogMode("rename");
  };

  const submitFolderDialog = () => {
    const trimmed = folderName.trim();
    if (!trimmed) return;

    if (folderDialogMode === "create") {
      const folderId = createFolder(trimmed);
      if (folderId) setActiveFolderId(folderId);
      showToast(t.folderCreated);
    } else if (folderDialogMode === "rename" && activeFolder) {
      renameFolder(activeFolder.id, trimmed);
      showToast(t.folderRenamed);
    }

    setFolderDialogMode(null);
  };

  const folderControlFor = (kind: "wallet" | "dev", ref: SavedRef) => {
    if (state.folders.length < 2) return undefined;

    return (
      <label className="folder-select">
        <Folder size={12} strokeWidth={1.8} />
        <select
          aria-label={t.moveToFolder}
          onChange={(event) => moveFavorite(kind, ref.id, event.target.value)}
          value={ref.folderId}
        >
          {state.folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folderDisplayName(folder)}
            </option>
          ))}
        </select>
        <ChevronDown className="folder-select-chevron" size={12} />
      </label>
    );
  };

  const cloudLabel =
    cloudState === "cloud"
      ? t.cloudSync
      : cloudState === "connecting"
        ? t.cloudConnecting
        : t.localMode;
  const cloudIcon =
    cloudState === "cloud" ? <Cloud size={12} /> : <HardDrive size={12} />;

  return (
    <main className="page favorites-page">
      <section className="page-head favorites-head">
        <div className="favorites-title-group">
          <h1>{t.favoritesTitle}</h1>
          <p>{cloudState === "local" ? t.favoritesSubtitleLocal : t.favoritesSubtitle}</p>
        </div>
        <div className="toolbar-controls">
          <PeriodSelector onChange={setPeriod} value={period} />
          <ReferenceButton />
        </div>
      </section>

      {!ready ? (
        <div className="favorites-skeleton" aria-label={t.favoritesTitle}>
          <div className="skeleton skeleton-rail" />
          <div className="skeleton skeleton-content" />
        </div>
      ) : favoriteCount === 0 ? (
        <section className="favorites-empty">
          <div className="empty-star">
            <Star size={24} strokeWidth={1.4} />
          </div>
          <h2>{t.emptyTitle}</h2>
          <p>{t.emptyDescription}</p>
          <div className="empty-actions">
            <Link className="button button-primary" href="/wallets">
              {t.openWallets}
            </Link>
            <Link className="button button-secondary" href="/devs">
              {t.openDevs}
            </Link>
          </div>
          <span
            className={`cloud-badge cloud-${cloudState}`}
            title={cloudState === "local" ? t.localModeHint : undefined}
          >
            {cloudIcon}
            {cloudLabel}
          </span>
        </section>
      ) : (
        <div className="favorites-layout">
          <aside className="folder-rail">
            <div className="rail-heading">
              <span>{t.folders}</span>
              <button
                aria-label={t.newFolder}
                className="rail-add"
                onClick={openCreateFolder}
                title={t.newFolder}
                type="button"
              >
                <Plus size={14} strokeWidth={2} />
              </button>
            </div>
            <div className="folder-list">
              {state.folders.map((folder) => (
                <button
                  aria-pressed={folder.id === activeFolder?.id}
                  className={`folder-item ${
                    folder.id === activeFolder?.id ? "active" : ""
                  }`}
                  key={folder.id}
                  onClick={() => setActiveFolderId(folder.id)}
                  type="button"
                >
                  {folder.id === MAIN_FOLDER_ID ? (
                    <Star size={14} strokeWidth={1.7} />
                  ) : (
                    <Folder size={14} strokeWidth={1.7} />
                  )}
                  <span>{folderDisplayName(folder)}</span>
                  <span className="folder-count">{getFolderCount(folder.id)}</span>
                </button>
              ))}
            </div>
            <button
              className="new-folder-button"
              onClick={openCreateFolder}
              type="button"
            >
              <FolderPlus size={14} strokeWidth={1.7} />
              {t.newFolder}
            </button>
            <span
              className={`cloud-badge rail-cloud cloud-${cloudState}`}
              title={cloudState === "local" ? t.localModeHint : undefined}
            >
              {cloudIcon}
              {cloudLabel}
            </span>
          </aside>

          <section className="folder-panel">
            <div className="folder-panel-head">
              <div>
                <span className="eyebrow">{t.folder}</span>
                <h2>{activeFolder ? folderDisplayName(activeFolder) : t.mainFolder}</h2>
              </div>
              <div className="folder-panel-actions">
                {activeFolder && activeFolder.id !== MAIN_FOLDER_ID ? (
                  <>
                    <button
                      aria-label={t.renameFolder}
                      className="icon-button small"
                      onClick={openRenameFolder}
                      title={t.renameFolder}
                      type="button"
                    >
                      <Pencil size={14} strokeWidth={1.8} />
                    </button>
                    <button
                      aria-label={t.deleteFolder}
                      className="icon-button small danger"
                      onClick={() => setDeleteDialogOpen(true)}
                      title={t.deleteFolder}
                      type="button"
                    >
                      <Trash2 size={14} strokeWidth={1.8} />
                    </button>
                  </>
                ) : null}
                <button
                  className="button button-secondary compact"
                  disabled={folderTotal === 0}
                  onClick={exportFolder}
                  title={t.oneAddressPerLine}
                  type="button"
                >
                  <Download size={14} strokeWidth={1.8} />
                  {t.exportTxt}
                </button>
              </div>
            </div>

            {folderTotal > 0 && filteredTotal === 0 ? (
              <div className="empty-state search-empty">
                <div className="empty-icon">
                  <SearchX size={21} strokeWidth={1.6} />
                </div>
                <h2>{t.nothingFoundFavorites}</h2>
                <button
                  className="button button-secondary"
                  onClick={() => setQuery("")}
                  type="button"
                >
                  {t.resetSearch}
                </button>
              </div>
            ) : folderTotal === 0 ? (
              <div className="empty-state folder-empty">
                <div className="empty-icon">
                  <FolderPlus size={21} strokeWidth={1.6} />
                </div>
                <h2>{t.folderEmptyTitle}</h2>
                <p>{t.folderEmptyText}</p>
                <div className="empty-actions">
                  <Link className="button button-primary" href="/wallets">
                    {t.openWallets}
                  </Link>
                  <Link className="button button-secondary" href="/devs">
                    {t.openDevs}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="folder-content">
                {visibleWallets.length > 0 ? (
                  <div className="saved-section">
                    <div className="saved-section-head">
                      <h3>{t.savedWallets}</h3>
                      <span>{visibleWallets.length}</span>
                    </div>
                    <div className="collection collection-grid saved-collection">
                      {visibleWallets.map(({ ref, entity }) => (
                        <WalletCard
                          folderControl={folderControlFor("wallet", ref)}
                          key={entity.address}
                          period={period}
                          wallet={entity}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {visibleDevs.length > 0 ? (
                  <div className="saved-section">
                    <div className="saved-section-head">
                      <h3>{t.savedDevs}</h3>
                      <span>{visibleDevs.length}</span>
                    </div>
                    <div className="collection collection-grid saved-collection">
                      {visibleDevs.map(({ ref, entity }) => (
                        <DevCard
                          dev={entity}
                          folderControl={folderControlFor("dev", ref)}
                          key={entity.address}
                          period={period}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        </div>
      )}

      <Modal
        footer={
          <div className="modal-actions">
            <button
              className="button button-ghost"
              onClick={() => setFolderDialogMode(null)}
              type="button"
            >
              {t.cancel}
            </button>
            <button
              className="button button-primary"
              disabled={!folderName.trim()}
              onClick={submitFolderDialog}
              type="button"
            >
              {folderDialogMode === "rename" ? t.saveFolder : t.create}
            </button>
          </div>
        }
        onClose={() => setFolderDialogMode(null)}
        open={folderDialogMode !== null}
        size="small"
        subtitle={
          folderDialogMode === "rename" ? t.renameFolder : t.saveHintMain
        }
        title={
          folderDialogMode === "rename" ? t.renameFolder : t.newFolder
        }
      >
        <label className="form-field">
          <span>{t.folderName}</span>
          <input
            autoFocus
            maxLength={40}
            onChange={(event) => setFolderName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitFolderDialog();
            }}
            placeholder={t.folderPlaceholder}
            value={folderName}
          />
        </label>
      </Modal>

      <Modal
        footer={
          <div className="modal-actions">
            <button
              className="button button-ghost"
              onClick={() => setDeleteDialogOpen(false)}
              type="button"
            >
              {t.cancel}
            </button>
            <button
              className="button button-danger"
              onClick={() => {
                if (activeFolder) deleteFolder(activeFolder.id);
                setDeleteDialogOpen(false);
                showToast(t.folderDeleted);
              }}
              type="button"
            >
              {t.delete}
            </button>
          </div>
        }
        onClose={() => setDeleteDialogOpen(false)}
        open={deleteDialogOpen}
        size="small"
        subtitle={t.deleteFolderText}
        title={t.deleteFolderTitle}
      >
        <div className="confirm-folder">
          <Folder size={16} />
          <span>{activeFolder ? folderDisplayName(activeFolder) : ""}</span>
        </div>
      </Modal>
    </main>
  );
}
