"use client";

import { Check } from "lucide-react";
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
import { usePathname } from "next/navigation";

interface Toast {
  id: number;
  message: string;
}

interface UIContextValue {
  query: string;
  setQuery: (value: string) => void;
  guideOpen: boolean;
  setGuideOpen: (open: boolean) => void;
  glossaryOpen: boolean;
  setGlossaryOpen: (open: boolean) => void;
  showToast: (message: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerIds = useRef<number[]>([]);

  useEffect(() => {
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    return () => {
      timerIds.current.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, []);

  const showToast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current.slice(-2), { id, message }]);
    const timerId = window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2600);
    timerIds.current.push(timerId);
  }, []);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      guideOpen,
      setGuideOpen,
      glossaryOpen,
      setGlossaryOpen,
      showToast,
    }),
    [glossaryOpen, guideOpen, query, showToast],
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div className="toast" key={toast.id}>
            <span className="toast-icon">
              <Check size={13} strokeWidth={2.6} />
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUI must be used inside UIProvider");
  }

  return context;
}
