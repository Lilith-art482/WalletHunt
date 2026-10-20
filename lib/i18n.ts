import type { Language, WalletTag, DevTag, DevPreset, Period } from "./types";

const ru = {
  wallets: "Кошельки",
  devs: "Девы",
  favorites: "Избранное",
  searchWallets: "Адрес или его начало",
  searchDevs: "Адрес дева или его начало",
  searchFavorites: "Найти в избранном",
  openGuide: "Открыть гайд",
  openGlossary: "Открыть справочник",
  switchLanguage: "Сменить язык",
  switchTheme: "Сменить тему",
  copyTraders: "Кого копировать",
  whoseLaunches: "Чьи запуски снайпить",
  base: "База",
  hotToday: "Горячие сегодня",
  closedDaysPlusToday: "закрытых дней + сегодня",
  glossary: "Справочник",
  period7: "7д",
  period14: "14д",
  period30: "30д",
  gridView: "Сетка",
  listView: "Список",
  pnl: "PnL",
  winRate: "Winrate",
  trades: "Сделки",
  avgHold: "Средний холд",
  lastSeen: "Активность",
  score: "Score",
  saved: "В избранном",
  save: "В избранное",
  copyAddress: "Скопировать адрес",
  addressCopied: "Адрес скопирован",
  openSolscan: "Открыть в Solscan",
  showMore: "Показать ещё",
  allResults: "Все результаты",
  found: "Найдено",
  walletsFound: "кошельков",
  devsFound: "девов",
  noWalletsTitle: "Ничего не найдено",
  noWalletsText: "Попробуй другой запрос или сбрось его, чтобы увидеть всю базу.",
  noDevsTitle: "Ничего не найдено",
  noDevsText: "Измени фильтры или поисковый запрос — подходящих девов пока нет.",
  resetSearch: "Сбросить поиск",
  justNow: "только что",
  minutesAgo: "{n} мин назад",
  hoursAgo: "{n} ч назад",
  today: "сегодня",
  yesterday: "вчера",
  daysAgoShort: "{n} дн. назад",
  afterUtc: "после 06:06 UTC",
  target: "Цель",
  filters: "Фильтры",
  choose: "Выбрать",
  done: "Готово",
  selected: "выбрано",
  clear: "Сбросить",
  addToFavorites: "В избранное",
  selectionHint: "Отметь девов, которых хочешь сохранить",
  launches: "Запуски",
  successRate: "Успешность",
  bestMultiple: "Лучший x",
  peakMc: "Пик MC",
  lastLaunch: "Запуск",
  starts: "запусков",
  todayAfterCutoff: "сегодня после 06:06",
  filterTitle: "Фильтры девов",
  filterSubtitle: "Оставь только тех, чьи запуски подходят под твою стратегию.",
  minLaunches: "Минимум запусков",
  minWinRate: "Минимальная успешность",
  maxRugRate: "Максимальный rug rate",
  any: "Любой",
  apply: "Применить",
  reset: "Сбросить",
  activeFilters: "Активно",
  saveHintMain: "Звёздочка сохраняет в папку «Основная».",
  favoritesTitle: "Избранное",
  favoritesSubtitle:
    "Сохранённые кошельки и девы по папкам. Хранятся на сервере и привязаны к твоему доступу.",
  favoritesSubtitleLocal:
    "Сохранённые кошельки и девы по папкам. Локальный режим: данные хранятся в этом браузере — подключи Firebase для синхронизации.",
  emptyTitle: "В избранном пока пусто",
  emptyDescription:
    "Нажми ☆ у кошелька или дева, и он попадёт в папку «Основная». В папках удобно держать отдельные списки, например под копирование и под проверку снайпа, и выгружать их в .txt для копитрейд-софта.",
  openWallets: "Открыть кошельки",
  openDevs: "Открыть девов",
  folders: "Папки",
  newFolder: "Новая папка",
  folderName: "Название папки",
  folderPlaceholder: "Например, «Для копитрейда»",
  createFolder: "Создать папку",
  renameFolder: "Переименовать папку",
  deleteFolder: "Удалить папку",
  create: "Создать",
  saveFolder: "Сохранить",
  cancel: "Отмена",
  delete: "Удалить",
  rename: "Переименовать",
  mainFolder: "Основная",
  savedWallets: "Кошельки",
  savedDevs: "Девы",
  exportTxt: "Экспорт .txt",
  folderEmptyTitle: "В этой папке пока пусто",
  folderEmptyText: "Добавляй кошельки и девов звёздочкой или переноси их между папками.",
  deleteFolderTitle: "Удалить папку?",
  deleteFolderText:
    "Сохранённые адреса не пропадут — они переместятся в папку «Основная».",
  folderCreated: "Папка создана",
  folderRenamed: "Папка переименована",
  folderDeleted: "Папка удалена, адреса перенесены в «Основную»",
  exported: "Файл .txt подготовлен",
  walletSaved: "Кошелёк добавлен в избранное",
  walletRemoved: "Кошелёк удалён из избранного",
  devSaved: "Дев добавлен в избранное",
  devRemoved: "Дев удалён из избранного",
  favoritesAdded: "Добавлено в избранное: {n}",
  moveToFolder: "Переместить в папку",
  removeFromFavorites: "Убрать из избранного",
  cloudSync: "Синхронизировано",
  cloudConnecting: "Подключение…",
  localMode: "Локально",
  localModeHint: "Подключи Firebase, чтобы хранить избранное на сервере.",
  totalSaved: "Сохранено",
  nothingFoundFavorites: "По этому запросу ничего не найдено",
  guideTitle: "Как пользоваться Wallet Hunt",
  guideIntro:
    "Wallet Hunt собирает кошельки и девов Solana в один рабочий список. Вот короткий маршрут.",
  guideStep1Title: "Выбери, что искать",
  guideStep1Text:
    "«Кошельки» — для копитрейдинга. Переключай базу и горячих за сегодня, меняй период 7/14/30 дней.",
  guideStep2Title: "Настрой девов",
  guideStep2Text:
    "Пресеты strict, апсайд 6, быстрый старт, после бандла и dev sell сужают список под твою стратегию снайпа.",
  guideStep3Title: "Сохрани в избранное",
  guideStep3Text:
    "Звёздочка отправляет адрес в папку «Основная». Создавай другие папки под разные сценарии и переноси записи между ними.",
  guideStep4Title: "Выгрузи список",
  guideStep4Text:
    "В избранном нажми «Экспорт .txt» — получишь адреса по одному в строке, готовые для копитрейд-софта.",
  guideFooter: "Поиск вызывается клавишей / в любом разделе.",
  gotIt: "Понятно",
  close: "Закрыть",
  glossaryTitle: "Справочник",
  glossarySubtitle: "Коротко о метриках и пресетах Wallet Hunt.",
  glossaryPnl:
    "Реализованная и нереализованная прибыль кошелька в долларах за выбранный период.",
  glossaryWinRate: "Доля прибыльных сделок от общего числа закрытых сделок.",
  glossaryScore:
    "Сводная оценка Wallet Hunt: PnL, winrate, активность и качество входов.",
  glossaryStrict: "Только девы с высокой успешностью и низкой долей rug-запусков.",
  glossaryUpside: "Запуски, которые уже показывали рост от 6x.",
  glossaryQuick: "Девы, которые быстро выводят токен на рынок и сайт.",
  glossaryBundle: "Запуски с бандлом — удобно снайпить после распределения.",
  glossaryDevSell: "Девы, которые продавали собственные токены; смотри риск и тайминг.",
  glossaryTarget: "Минимальный пик капитализации запусков за выбранный период.",
  glossaryTime: "Показываем запуски после 06:06 UTC — свежая дневная сессия.",
  walletTags: "Метки",
  tagSmart: "Smart money",
  tagEarly: "Ранний вход",
  tagHighWin: "Высокий winrate",
  tagMomentum: "Импульс",
  tagSwing: "Свинг",
  tagFresh: "Онлайн",
  tagStrict: "Strict",
  tagUpside: "Апсайд 6",
  tagQuick: "Быстрый старт",
  tagBundle: "Бандл",
  presetBundle: "После бандла",
  tagDevsell: "Dev sell",
  tagNew: "Свежий запуск",
  loadMore: "Показать ещё",
  showing: "Показано",
  of: "из",
  clearFilters: "Сбросить фильтры",
  active: "Активно",
  copy: "Копировать",
  buy: "Купить",
  minShort: "мин",
  hourShort: "ч",
  dayShort: "д",
  tooltipsScore: "Оценка качества кошелька",
  demoNote: "Демо-набор данных",
  settings: "Настройки",
  menu: "Меню",
  noResultsShort: "Нет результатов",
  folder: "Папка",
  move: "Переместить",
  todayUpper: "Сегодня",
  oneAddressPerLine: "Один адрес в строке",
};

type DictionaryShape = Record<keyof typeof ru, string>;

const en: DictionaryShape = {
  wallets: "Wallets",
  devs: "Devs",
  favorites: "Favorites",
  searchWallets: "Address or its start",
  searchDevs: "Dev address or its start",
  searchFavorites: "Search favorites",
  openGuide: "Open guide",
  openGlossary: "Open reference",
  switchLanguage: "Switch language",
  switchTheme: "Switch theme",
  copyTraders: "Who to copy",
  whoseLaunches: "Whose launches to snipe",
  base: "Base",
  hotToday: "Hot today",
  closedDaysPlusToday: "closed days + today",
  glossary: "Reference",
  period7: "7d",
  period14: "14d",
  period30: "30d",
  gridView: "Grid",
  listView: "List",
  pnl: "PnL",
  winRate: "Winrate",
  trades: "Trades",
  avgHold: "Avg. hold",
  lastSeen: "Activity",
  score: "Score",
  saved: "Saved",
  save: "Add to favorites",
  copyAddress: "Copy address",
  addressCopied: "Address copied",
  openSolscan: "Open in Solscan",
  showMore: "Show more",
  allResults: "All results",
  found: "Found",
  walletsFound: "wallets",
  devsFound: "devs",
  noWalletsTitle: "Nothing found",
  noWalletsText: "Try another query or clear it to see the full database.",
  noDevsTitle: "Nothing found",
  noDevsText: "Change filters or your search — no matching devs yet.",
  resetSearch: "Clear search",
  justNow: "just now",
  minutesAgo: "{n}m ago",
  hoursAgo: "{n}h ago",
  today: "today",
  yesterday: "yesterday",
  daysAgoShort: "{n}d ago",
  afterUtc: "after 06:06 UTC",
  target: "Target",
  filters: "Filters",
  choose: "Select",
  done: "Done",
  selected: "selected",
  clear: "Clear",
  addToFavorites: "Add to favorites",
  selectionHint: "Select the devs you want to keep",
  launches: "Launches",
  successRate: "Success rate",
  bestMultiple: "Best x",
  peakMc: "Peak MC",
  lastLaunch: "Launch",
  starts: "launches",
  todayAfterCutoff: "today after 06:06",
  filterTitle: "Dev filters",
  filterSubtitle: "Keep only the devs whose launches fit your strategy.",
  minLaunches: "Minimum launches",
  minWinRate: "Minimum success rate",
  maxRugRate: "Maximum rug rate",
  any: "Any",
  apply: "Apply",
  reset: "Reset",
  activeFilters: "Active",
  saveHintMain: "The star saves to the “Main” folder.",
  favoritesTitle: "Favorites",
  favoritesSubtitle:
    "Saved wallets and devs organized in folders. Stored on the server and linked to your access.",
  favoritesSubtitleLocal:
    "Saved wallets and devs organized in folders. Local mode: data stays in this browser — connect Firebase to sync.",
  emptyTitle: "Your favorites are empty",
  emptyDescription:
    "Click ☆ on a wallet or dev and it lands in the “Main” folder. Use folders for separate lists, such as copying and sniping checks, and export them to .txt for copy-trading software.",
  openWallets: "Open wallets",
  openDevs: "Open devs",
  folders: "Folders",
  newFolder: "New folder",
  folderName: "Folder name",
  folderPlaceholder: "For example, “Copy trading”",
  createFolder: "Create folder",
  renameFolder: "Rename folder",
  deleteFolder: "Delete folder",
  create: "Create",
  saveFolder: "Save",
  cancel: "Cancel",
  delete: "Delete",
  rename: "Rename",
  mainFolder: "Main",
  savedWallets: "Wallets",
  savedDevs: "Devs",
  exportTxt: "Export .txt",
  folderEmptyTitle: "This folder is empty",
  folderEmptyText: "Add wallets and devs with the star or move them between folders.",
  deleteFolderTitle: "Delete folder?",
  deleteFolderText:
    "Saved addresses won't be deleted — they'll be moved to the “Main” folder.",
  folderCreated: "Folder created",
  folderRenamed: "Folder renamed",
  folderDeleted: "Folder deleted, addresses moved to “Main”",
  exported: "The .txt file is ready",
  walletSaved: "Wallet added to favorites",
  walletRemoved: "Wallet removed from favorites",
  devSaved: "Dev added to favorites",
  devRemoved: "Dev removed from favorites",
  favoritesAdded: "Added to favorites: {n}",
  moveToFolder: "Move to folder",
  removeFromFavorites: "Remove from favorites",
  cloudSync: "Synced",
  cloudConnecting: "Connecting…",
  localMode: "Local only",
  localModeHint: "Connect Firebase to store favorites on the server.",
  totalSaved: "Saved",
  nothingFoundFavorites: "Nothing matches this search",
  guideTitle: "How to use Wallet Hunt",
  guideIntro:
    "Wallet Hunt brings Solana wallets and devs into one working list. Here is the short route.",
  guideStep1Title: "Choose what to find",
  guideStep1Text:
    "“Wallets” is for copy trading. Switch between the base and today's hot wallets, change the 7/14/30-day period.",
  guideStep2Title: "Tune the devs",
  guideStep2Text:
    "Strict, upside, quick start, after bundle and dev sell presets narrow the list to your sniping strategy.",
  guideStep3Title: "Save to favorites",
  guideStep3Text:
    "The star sends an address to the “Main” folder. Create more folders for different workflows and move entries between them.",
  guideStep4Title: "Export the list",
  guideStep4Text:
    "In Favorites, click “Export .txt” to get one address per line, ready for copy-trading software.",
  guideFooter: "Press / to focus search from any section.",
  gotIt: "Got it",
  close: "Close",
  glossaryTitle: "Reference",
  glossarySubtitle: "A quick look at Wallet Hunt metrics and presets.",
  glossaryPnl:
    "A wallet's realized and unrealized profit in USD for the selected period.",
  glossaryWinRate: "The share of profitable trades among all closed trades.",
  glossaryScore: "Wallet Hunt's combined score: PnL, winrate, activity and entry quality.",
  glossaryStrict: "Only devs with a high success rate and a low share of rug launches.",
  glossaryUpside: "Launches that have already shown at least 6x growth.",
  glossaryQuick: "Devs who get a token and website to market quickly.",
  glossaryBundle: "Bundled launches — useful to snipe after distribution.",
  glossaryDevSell: "Devs who sold their own tokens; watch the risk and timing.",
  glossaryTarget: "The minimum peak market cap of launches in the selected period.",
  glossaryTime: "Show launches after 06:06 UTC — the fresh daily session.",
  walletTags: "Tags",
  tagSmart: "Smart money",
  tagEarly: "Early entry",
  tagHighWin: "High winrate",
  tagMomentum: "Momentum",
  tagSwing: "Swing",
  tagFresh: "Online",
  tagStrict: "Strict",
  tagUpside: "Upside 6",
  tagQuick: "Quick start",
  tagBundle: "Bundle",
  presetBundle: "After bundle",
  tagDevsell: "Dev sell",
  tagNew: "Fresh launch",
  loadMore: "Show more",
  showing: "Showing",
  of: "of",
  clearFilters: "Reset filters",
  active: "Active",
  copy: "Copy",
  buy: "Buy",
  minShort: "min",
  hourShort: "h",
  dayShort: "d",
  tooltipsScore: "Wallet quality score",
  demoNote: "Demo dataset",
  settings: "Settings",
  menu: "Menu",
  noResultsShort: "No results",
  folder: "Folder",
  move: "Move",
  todayUpper: "Today",
  oneAddressPerLine: "One address per line",
};

export const translations = { ru, en };
export type Dictionary = DictionaryShape;

export function getDictionary(language: Language) {
  return translations[language];
}

export const walletTagKeys: Record<WalletTag, keyof Dictionary> = {
  smart: "tagSmart",
  early: "tagEarly",
  highWin: "tagHighWin",
  momentum: "tagMomentum",
  swing: "tagSwing",
  fresh: "tagFresh",
};

export const devTagKeys: Record<DevTag, keyof Dictionary> = {
  strict: "tagStrict",
  upside: "tagUpside",
  quick: "tagQuick",
  bundle: "tagBundle",
  devsell: "tagDevsell",
  new: "tagNew",
};

export const presetKeys: Record<DevPreset, keyof Dictionary> = {
  strict: "tagStrict",
  upside: "tagUpside",
  quick: "tagQuick",
  bundle: "presetBundle",
  devsell: "tagDevsell",
};

export function periodKey(period: Period): keyof Dictionary {
  if (period === 7) return "period7";
  if (period === 14) return "period14";
  return "period30";
}

export function formatMoney(value: number) {
  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);

  if (absolute >= 1_000_000) {
    return `${sign}$${(absolute / 1_000_000).toFixed(1).replace(".0", "")}M`;
  }

  if (absolute >= 1_000) {
    return `${sign}$${(absolute / 1_000).toFixed(1).replace(".0", "")}K`;
  }

  return `${sign}$${Math.round(absolute)}`;
}

export function formatCompactNumber(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(".0", "")}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(".0", "")}K`;
  }

  return String(value);
}

export function formatInteger(value: number, language: Language) {
  return new Intl.NumberFormat(language === "ru" ? "ru-RU" : "en-US").format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatMultiple(value: number) {
  return `${value.toFixed(1).replace(".0", "")}x`;
}

export function formatAddress(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function formatHold(minutes: number, dictionary: Dictionary) {
  if (minutes < 60) return `${minutes} ${dictionary.minShort}`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} ${dictionary.hourShort}`;
  return `${Math.round(minutes / 1440)} ${dictionary.dayShort}`;
}

export function formatLastSeen(minutes: number, dictionary: Dictionary) {
  if (minutes < 2) return dictionary.justNow;
  if (minutes < 60) return dictionary.minutesAgo.replace("{n}", String(minutes));
  if (minutes < 1440) {
    return dictionary.hoursAgo.replace("{n}", String(Math.round(minutes / 60)));
  }
  return dictionary.daysAgoShort.replace("{n}", String(Math.round(minutes / 1440)));
}

export function formatDevLaunch(days: number, dictionary: Dictionary) {
  if (days === 0) return dictionary.today;
  if (days === 1) return dictionary.yesterday;
  return dictionary.daysAgoShort.replace("{n}", String(days));
}

export function interpolate(value: string, variables: Record<string, string | number>) {
  return Object.entries(variables).reduce(
    (result, [key, replacement]) => result.replace(`{${key}}`, String(replacement)),
    value,
  );
}
