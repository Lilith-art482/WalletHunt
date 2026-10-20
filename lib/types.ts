export type Period = 7 | 14 | 30;
export type Language = "ru" | "en";
export type Theme = "dark" | "light";
export type FavoriteKind = "wallet" | "dev";

export type WalletTag =
  | "smart"
  | "early"
  | "highWin"
  | "momentum"
  | "swing"
  | "fresh";

export type DevTag =
  | "strict"
  | "upside"
  | "quick"
  | "bundle"
  | "devsell"
  | "new";

export type DevPreset = "strict" | "upside" | "quick" | "bundle" | "devsell";

export interface WalletStats {
  pnl: number;
  winRate: number;
  trades: number;
  avgHoldMinutes: number;
  volume: number;
}

export interface Wallet {
  address: string;
  name: string;
  tags: WalletTag[];
  hot: boolean;
  score: number;
  lastActiveMinutes: number;
  periods: Record<Period, WalletStats>;
  sparkline: number[];
  hue: number;
}

export interface DevStats {
  launches: number;
  wins: number;
  winRate: number;
  bestMultiple: number;
  peakMc: number;
  rugged: number;
}

export interface Dev {
  address: string;
  name: string;
  tags: DevTag[];
  presets: DevPreset[];
  periods: Record<Period, DevStats>;
  lastLaunchDaysAgo: number;
  afterCutoff: boolean;
  quickSite: boolean;
  bundled: boolean;
  devSold: boolean;
  score: number;
  hue: number;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface SavedRef {
  id: string;
  folderId: string;
  addedAt: number;
}

export interface FavoritesState {
  folders: Folder[];
  wallets: SavedRef[];
  devs: SavedRef[];
  updatedAt: number;
}

export interface DevFilters {
  minLaunches: number;
  minWinRate: number;
  maxRugRate: number;
}

export type CloudState = "local" | "connecting" | "cloud" | "error";
