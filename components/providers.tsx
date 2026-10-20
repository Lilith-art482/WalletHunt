"use client";

import type { ReactNode } from "react";
import { FavoritesProvider } from "./favorites-provider";
import { PreferencesProvider } from "./preferences-provider";
import { UIProvider } from "./ui-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      <FavoritesProvider>
        <UIProvider>{children}</UIProvider>
      </FavoritesProvider>
    </PreferencesProvider>
  );
}
