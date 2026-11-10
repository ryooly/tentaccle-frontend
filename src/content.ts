export const explorerCopy = {
  brand: "octo",
  product: "MULTICHAIN EXPLORER",
  explore: "Explore",
  learn: "Learn",
  connectWallet: "About Devs",
  heading: "Search the pulse of every chain",
  heroEyebrow: "Multichain Gas Explorer",
  headingLead: "Search the",
  headingAccent: "pulse",
  headingTail: "of every chain",
  heroSub:
    "Real-time fees and live activity across every major network — one dive away.",
  searchPlaceholder: "Search across the ecosystem...",
  searchLabel: "Search the multichain explorer",
  searchGo: "Dive",
  desktopWarning:
    "This explorer is designed for desktop — please open it on a larger screen for the full multichain map.",
  gasPrefix: "Gas:",
  mapEyebrow: "Gas Pulse Map",
  mapHeading: "Every chain, one living view",
  mapHeadingLead: "Every chain, one",
  mapHeadingAccent: "living",
  mapHeadingTail: "view",
  footerTagline: "GasPulse — feel the pulse of every chain.",
  footer: {
    summary:
      "Real-time fees and live activity across every major network, gathered in one multichain explorer.",
    rights: "All rights reserved.",
    status: "Live gas across connected networks.",
    columns: [
      {
        title: "Product",
        links: [
          { label: "Network map", to: "/#map" },
          { label: "Discover", to: "/#discover" },
        ],
      },
      ],
    // Paste profile URLs here. An empty href still shows the button, ready for a link.
    socials: [
      { id: "x", label: "X", href: "" },
      { id: "instagram", label: "Instagram", href: "" },
      { id: "threads", label: "Threads", href: "" },
      { id: "github", label: "GitHub", href: "" },
    ],
  },
  categories: [
    { title: "DeFi", subtitle: "Discover new protocols", tone: "defi" },
    { title: "Tokens", subtitle: "Find your next token", tone: "tokens" },
    { title: "Bridges", subtitle: "Explore across chains", tone: "bridges" },
    { title: "Docs", subtitle: "Read the documentation", tone: "docs" },
  ],
  discovery: [],
  chainPage: {
    back: "Back to network map",
    copyAddress: "Copy address",
    copied: "Address copied to clipboard",
    notFoundHeading: "Chain not found",
    notFoundBody: "We couldn't find that network on the map.",
    tiles: [
      { id: "tokens" as const, title: "Tokens" },
      { id: "transactions" as const, title: "Transactions" },
      { id: "validators" as const, title: "Validators" },
    ],
    chart: {
      title: "Network activity",
      empty: "Awaiting data — chart points are streamed from the backend.",
      timeframeLabel: "Timeframe",
      timeframes: ["Hourly", "Daily", "Weekly"],
      rangeLabel: "Range",
      // Options shown in the white selector bar, varying by the active timeframe.
      rangeOptions: {
        Hourly: ["24", "48", "72"],
        Daily: ["1", "3", "5"],
        Weekly: ["1", "2", "3"],
      },
      // Right-side value scale. Left empty on purpose — tick labels, the highlighted
      // last value, and the volume are all supplied by the backend in production.
      axis: {
        scale: [] as string[],
        last: null as null | { value: string; time: string; topPct: number },
        volume: "",
      },
    },
  },
} as const;

/**
 * Detail-page tile metrics. Left null so the backend can fill them later:
 *   GET /api/chains/{slug}/stats -> { fee, tx24h, validators }
 */
export interface ChainTileStats {
  /** Current fee within its observed range, e.g. "18 Gwei · 12–24". */
  fee: string | null;
  /** Transaction count over the last 24 hours. */
  tx24h: string | null;
  /** Active validator / miner set size. */
  validators: string | null;
}

/** Empty stats shell — swap in API values when the backend is wired. */
export const emptyChainStats: ChainTileStats = {
  fee: null,
  tx24h: null,
  validators: null,
};

/** A chain pinned to the tip of one of the octopus's eight tentacles. */
export interface ExplorerChain {
  name: string;
  iconSrc: string;
  gas: string;
  /** Public address/identifier for the chain, shown "#"-prefixed and copyable on its page. */
  address: string;
  /** Detail-page tile metrics: fee range, 24h txs, validators. */
  stats: ChainTileStats;
  /** Index of the tentacle this card connects to (0-7, matching the SVG tip order). */
  tip: number;
  /** Horizontal anchor as a % of the map width, tracking the tentacle tip. */
  xPct: number;
  /** Vertical anchor as a % of the map height, tracking the tentacle tip. */
  yPct: number;
}

/**
 * Live-ish gas readouts anchored to each tentacle tip.
 * Coordinates are derived from the SVG's eight tentacle endpoints (viewBox 1344×2500)
 * so the cards stay locked to the tips as the map scales responsively.
 */
export const explorerChains: ExplorerChain[] = [
  {
    name: "Bitcoin",
    iconSrc: "/Bitcoin-logo-tile.svg",
    gas: "12 sat/vB",
    address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    stats: emptyChainStats,
    tip: 0,
    xPct: 5.65,
    yPct: 26.28,
  },
  {
    name: "Ethereum",
    iconSrc: "/Ethereum-logo-tile.svg",
    gas: "18 Gwei",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    stats: emptyChainStats,
    tip: 1,
    xPct: 18.15,
    yPct: 38.28,
  },
  {
    name: "Solana",
    iconSrc: "/Solana-logo-tile.svg",
    gas: "0.01 SOL",
    address: "DUngTtbU3nUTmuLQhMFP3wPkTXJdKvSGnBnddMMye7U1",
    stats: emptyChainStats,
    tip: 2,
    xPct: 30.65,
    yPct: 52.28,
  },
  {
    name: "BNB Chain",
    iconSrc: "/BNB-Chain-logo-tile.svg",
    gas: "3 Gwei",
    address: "0x8b3F09f4c1F0b3dE2a17C9bA6dE5f0C1B2a3D4e5",
    stats: emptyChainStats,
    tip: 4,
    xPct: 55.65,
    yPct: 60.28,
  },
  {
    name: "Avalanche",
    iconSrc: "/Avalanche-logo-tile.svg",
    gas: "25 nAVAX",
    address: "X-avalanche1qzsfq4q0pq9s7rfxyvmtw2j9p4c2gmn8k3v7hs",
    stats: emptyChainStats,
    tip: 5,
    xPct: 68.15,
    yPct: 70.28,
  },
  {
    name: "Polygon",
    iconSrc: "/Polygon-logo-tile.svg",
    gas: "42 Gwei",
    address: "0x4a1c3E5F2b8D7e6A9c0B1d2E3f4A5b6C7d8E9f0A",
    stats: emptyChainStats,
    tip: 3,
    xPct: 43.15,
    yPct: 81.88,
  },
  {
    name: "Chainlink",
    iconSrc: "/Chainlink-logo-tile.svg",
    gas: "15 Gwei",
    address: "0x514910771AF9Ca656af840dff83E864EcF986CA1",
    stats: emptyChainStats,
    tip: 6,
    xPct: 80.65,
    yPct: 90.28,
  },
  {
    name: "Polkadot",
    iconSrc: "/Polkadot-logo-tile.svg",
    gas: "0.05 DOT",
    address: "1670n3YbhPRKLLJlwrYwjhQshxJ21hyYBe7Sj98gDZAsAiXG",
    stats: emptyChainStats,
    tip: 7,
    xPct: 93.15,
    yPct: 97.48,
  },
];

/** Resolves a tile metric, or null while the backend has not filled it yet. */
export function chainTileValue(
  chain: ExplorerChain,
  tileId: (typeof explorerCopy.chainPage.tiles)[number]["id"],
): string | null {
  if (tileId === "tokens") return chain.stats.fee;
  if (tileId === "transactions") return chain.stats.tx24h;
  return chain.stats.validators;
}

export type ExplorerCategory = (typeof explorerCopy.categories)[number];
export type DiscoveryItem = (typeof explorerCopy.discovery)[number];

/** URL-safe identifier for a chain, used as its detail-page route segment. */
export function chainSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

/** Resolves a route slug back to its chain, or undefined for an unknown network. */
export function findChainBySlug(slug: string): ExplorerChain | undefined {
  return explorerChains.find((chain) => chainSlug(chain.name) === slug);
}
