import type {
  Dev,
  DevPreset,
  DevStats,
  DevTag,
  Period,
  Wallet,
  WalletStats,
  WalletTag,
} from "./types";

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const PERIODS: Period[] = [7, 14, 30];

function mulberry32(seed: number) {
  let value = seed;

  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let result = Math.imul(value ^ (value >>> 15), 1 | value);
    result = (result + Math.imul(result ^ (result >>> 7), 61 | result)) ^ result;
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(random: () => number, min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick<T>(random: () => number, values: T[]) {
  return values[Math.floor(random() * values.length)];
}

function createAddress(random: () => number) {
  let address = "";

  for (let index = 0; index < 44; index += 1) {
    address += BASE58[Math.floor(random() * BASE58.length)];
  }

  return address;
}

function makeSparkline(random: () => number, positive: boolean) {
  const values: number[] = [];
  let value = 30 + random() * 18;

  for (let index = 0; index < 18; index += 1) {
    const drift = positive ? 1.5 : -0.8;
    value += (random() - 0.45) * 9 + drift;
    values.push(Math.max(4, Math.round(value)));
  }

  return values;
}

const WALLET_PREFIXES = [
  "Ape",
  "Sol",
  "Jito",
  "Degen",
  "Ghost",
  "Alpha",
  "Based",
  "Turbo",
  "Pixel",
  "Lunar",
  "Cope",
  "Mint",
  "Nova",
  "Sneaky",
  "Diamond",
  "Rocket",
];

const WALLET_SUFFIXES = [
  "Hunter",
  "Whale",
  "Pilot",
  "Sensei",
  "Baron",
  "Rider",
  "Frog",
  "Mamba",
  "Nomad",
  "Quant",
  "Sniper",
  "Monk",
  "Wolf",
  "Fox",
  "Goblin",
  "Prophet",
  "Scout",
  "Shark",
  "Wizard",
  "Yeti",
  "Banker",
  "Captain",
  "Guru",
];

function buildWalletNames(count: number) {
  const names: string[] = [];

  for (let index = 0; index < count; index += 1) {
    names.push(
      WALLET_PREFIXES[index % WALLET_PREFIXES.length] +
        WALLET_SUFFIXES[(index * 3 + 1) % WALLET_SUFFIXES.length],
    );
  }

  return names;
}

function buildWallets(): Wallet[] {
  const names = buildWalletNames(74);
  const wallets = names.map((name, index) => {
    const random = mulberry32(4100 + index * 97);
    const score = randomInt(random, 63, 99);
    const pnl30 = Math.round(6200 + Math.pow(random(), 1.55) * 465000);
    const winRate30 = Math.round(51 + random() * 39);
    const trades30 = randomInt(random, 46, 468);
    const avgHold30 = randomInt(random, 8, 390);
    const volume30 = Math.round(pnl30 * (4.4 + random() * 7));
    const pnl14 = Math.round(pnl30 * (0.47 + random() * 0.18));
    const pnl7 = Math.round(pnl14 * (0.42 + random() * 0.2));

    const periods: Record<Period, WalletStats> = {
      7: {
        pnl: pnl7,
        winRate: Math.max(37, winRate30 - randomInt(random, 1, 8)),
        trades: Math.max(8, Math.round(trades30 * 0.29)),
        avgHoldMinutes: Math.max(4, Math.round(avgHold30 * (0.8 + random() * 0.3))),
        volume: Math.round(volume30 * 0.27),
      },
      14: {
        pnl: pnl14,
        winRate: Math.max(40, winRate30 - randomInt(random, 0, 5)),
        trades: Math.max(14, Math.round(trades30 * 0.54)),
        avgHoldMinutes: Math.max(4, Math.round(avgHold30 * (0.88 + random() * 0.24))),
        volume: Math.round(volume30 * 0.51),
      },
      30: {
        pnl: pnl30,
        winRate: winRate30,
        trades: trades30,
        avgHoldMinutes: avgHold30,
        volume: volume30,
      },
    };

    const tags = new Set<WalletTag>();

    if (winRate30 >= 72) tags.add("highWin");
    if (score >= 86) tags.add("smart");
    if (pnl30 > 240000 || score > 92) tags.add("early");
    if (pnl7 / pnl30 > 0.42) tags.add("momentum");
    if (avgHold30 >= 150) tags.add("swing");

    const lastActiveMinutes = pick(random, [4, 9, 17, 28, 43, 61, 88, 127, 214, 362, 614]);
    if (lastActiveMinutes <= 60) tags.add("fresh");

    const finalTags = Array.from(tags).slice(0, 3);
    if (finalTags.length === 0) finalTags.push("smart");

    return {
      address: createAddress(random),
      name,
      tags: finalTags,
      hot: false,
      score,
      lastActiveMinutes,
      periods,
      sparkline: makeSparkline(random, pnl30 > 0),
      hue: Math.round(random() * 360),
    };
  });

  wallets.sort((first, second) => second.score - first.score);
  wallets.slice(0, 28).forEach((wallet) => {
    wallet.hot = true;
  });

  return wallets;
}

const DEV_PREFIXES = [
  "nova",
  "sol",
  "pump",
  "mint",
  "ape",
  "degen",
  "lunar",
  "based",
  "pixel",
  "ghost",
  "turbo",
  "raw",
  "meta",
  "hyper",
  "dark",
  "neon",
  "prime",
  "orbit",
];

const DEV_SUFFIXES = [
  "labs",
  "works",
  "studio",
  "dev",
  "factory",
  "forge",
  "club",
  "capital",
  "dao",
  "team",
  "hq",
  "node",
  "pool",
];

function buildDevNames(count: number) {
  const names: string[] = [];

  for (let index = 0; index < count; index += 1) {
    names.push(
      DEV_PREFIXES[index % DEV_PREFIXES.length] +
        "_" +
        DEV_SUFFIXES[(index * 5 + 2) % DEV_SUFFIXES.length],
    );
  }

  return names;
}

function buildDevs(): Dev[] {
  const names = buildDevNames(92);
  const devs = names.map((name, index) => {
    const random = mulberry32(9200 + index * 131);
    const winRate30 = randomInt(random, 29, 83);
    const launches30 = randomInt(random, 4, 19);
    const bestMultiple30 = Number((1.6 + Math.pow(random(), 1.7) * 15.4).toFixed(1));
    const peakMc30 = randomInt(random, 28, 1190) * 1000;
    const rugRate = randomInt(random, 4, 54);
    const quickSite = random() > 0.59;
    const bundled = random() > 0.53;
    const devSold = random() > 0.56;
    const afterCutoff = random() > 0.34;
    const lastLaunchDaysAgo = afterCutoff ? 0 : randomInt(random, 1, 17);
    const rugged30 = Math.round((launches30 * rugRate) / 100);

    const statsFor = (period: Period): DevStats => {
      const factor = period === 30 ? 1 : period === 14 ? 0.55 : 0.29;
      const launches = Math.max(1, Math.round(launches30 * factor));
      const winRate = Math.max(
        18,
        Math.min(94, winRate30 + (period === 7 ? -4 : period === 14 ? -2 : 0)),
      );

      return {
        launches,
        wins: Math.round((launches * winRate) / 100),
        winRate,
        bestMultiple:
          period === 7
            ? Number((bestMultiple30 * 0.72).toFixed(1))
            : period === 14
              ? Number((bestMultiple30 * 0.88).toFixed(1))
              : bestMultiple30,
        peakMc: Math.round(peakMc30 * (period === 7 ? 0.7 : period === 14 ? 0.84 : 1)),
        rugged: Math.max(0, Math.round((launches * rugRate) / 100)),
      };
    };

    const strict = winRate30 >= 60 && rugRate <= 22;
    const upside = bestMultiple30 >= 6;
    const presets: DevPreset[] = [];

    if (strict) presets.push("strict");
    if (upside) presets.push("upside");
    if (quickSite) presets.push("quick");
    if (bundled) presets.push("bundle");
    if (devSold) presets.push("devsell");

    const tags: DevTag[] = [...presets];
    if (lastLaunchDaysAgo <= 2) tags.push("new");

    const score = Math.min(
      99,
      Math.max(
        47,
        Math.round(
          winRate30 +
            Math.min(38, bestMultiple30 * 2.9) -
            rugRate * 0.28 +
            launches30 * 0.22,
        ),
      ),
    );

    return {
      address: createAddress(random),
      name,
      tags: tags.slice(0, 4),
      presets,
      periods: {
        7: statsFor(7),
        14: statsFor(14),
        30: statsFor(30),
      },
      lastLaunchDaysAgo,
      afterCutoff,
      quickSite,
      bundled,
      devSold,
      score,
      hue: Math.round(random() * 360),
    };
  });

  devs.sort((first, second) => second.score - first.score);
  return devs;
}

export const wallets = buildWallets();
export const devs = buildDevs();

export const walletByAddress = new Map(wallets.map((wallet) => [wallet.address, wallet]));
export const devByAddress = new Map(devs.map((dev) => [dev.address, dev]));

export const periods = PERIODS;

export const presetTags: DevPreset[] = ["strict", "upside", "quick", "bundle", "devsell"];
