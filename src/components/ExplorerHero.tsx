import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import {
  explorerChains,
  explorerCopy,
  type ExplorerCategory,
  type ExplorerChain,
} from "../content";
import ChainCard from "./ChainCard";
import TentacleMap from "./TentacleMap";
import { undulateParams, scrollToElement } from "../tentacleMotion";
import styles from "./ExplorerHero.module.css";

export interface ExplorerHeroProps {
  onConnectWallet?: () => void;
  onSearchChange?: (value: string) => void;
  onExplore?: () => void;
  onLearn?: () => void;
  onCategorySelect?: (category: ExplorerCategory) => void;
  onChainSelect?: (chain: ExplorerChain) => void;
  /** When set (new nonce), seeds the search field and scrolls it into view. */
  searchJump?: { query: string; nonce: number } | null;
}

/** The header, category shortcuts, and chain-map canvas of the explorer. */
export default function ExplorerHero({
  onConnectWallet,
  onSearchChange,
  onExplore,
  onLearn,
  onCategorySelect,
  onChainSelect,
  searchJump,
}: ExplorerHeroProps) {
  const [searchValue, setSearchValue] = useState("");
  const updateSearch = (value: string) => {
    setSearchValue(value);
    onSearchChange?.(value);
  };
  // Tip of the tentacle connected to whichever card is hovered/focused; null clears the highlight.
  const [activeTip, setActiveTip] = useState<number | null>(null);

  // --- Search-and-jump: submitting simply directs the user to the matching chain card. ---
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldRef = useRef<HTMLFormElement>(null);

  // Discovery cards (and similar) can hand a query up here — seed + focus the field.
  useEffect(() => {
    if (!searchJump) return;
    setSearchValue(searchJump.query);
    onSearchChange?.(searchJump.query);
    const input = inputRef.current;
    if (!input) return;
    input.focus({ preventScroll: true });
    input.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "center",
    });
  }, [searchJump, onSearchChange]);

  /** Glides the viewport down to the card on the shared eased curve, then focuses it. */
  const scrollToCard = (card: HTMLElement) => {
    scrollToElement(card);
  };

  const handleLaunch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchValue.trim().toLowerCase();
    if (!query) return;

    /** Scores how well a chain name matches the query (higher = better). */
    const score = (name: string): number => {
      const lName = name.toLowerCase();
      if (lName === query) return 100;
      if (lName.includes(query)) return 90;
      if (query.includes(lName)) return 85;

      // Bidirectional word overlap.
      const nameWords = lName.split(/\s+/);
      const queryWords = query.split(/\s+/);
      let common = 0;
      for (const qw of queryWords) {
        if (nameWords.some((nw) => nw.includes(qw) || qw.includes(nw))) {
          common += 1;
        }
      }
      if (common > 0) return 70 + common * 5;

      // Character overlap as a last resort (catches "binance" -> "BNB Chain").
      const nameChars = new Set(lName.replace(/\s/g, ""));
      const queryChars = Array.from(new Set(query.replace(/\s/g, "")));
      let shared = 0;
      for (let i = 0; i < queryChars.length; i += 1) {
        if (nameChars.has(queryChars[i])) shared += 1;
      }
      if (shared > 0) return 50 + shared;

      return 0;
    };

    let best: (typeof explorerChains)[number] | null = null;
    let bestScore = 0;
    for (const chain of explorerChains) {
      const s = score(chain.name);
      if (s > bestScore) {
        bestScore = s;
        best = chain;
      }
    }

    const chain = best;
    const card = chain
      ? document.querySelector<HTMLElement>(`[data-chain="${chain.name}"]`)
      : null;
    if (!card) return;
    // Bring the target button into view with an eased glide and focus it on arrival:
    // its own focus/press states (accent outline, lift, :active sink) handle the rest.
    scrollToCard(card);
  };

  return (
    <section className={styles.hero}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <strong>{explorerCopy.brand}</strong>
          <span>{explorerCopy.product}</span>
        </div>
        <nav className={styles.navigation} aria-label={explorerCopy.product}>
          <button type="button" onClick={onExplore}>
            {explorerCopy.explore}
          </button>
          <button type="button" onClick={onLearn}>
            {explorerCopy.learn}
          </button>
          <button
            className={`${styles.walletButton} ${styles.aboutDevsButton}`}
            type="button"
            onClick={onConnectWallet}
            aria-label="About the developers"
          >
            <span className={styles.devsBadge} aria-hidden="true">✦</span>
            {explorerCopy.connectWallet}
          </button>
        </nav>
      </header>
      <div className={styles.divider} />
      <div className={styles.searchBlock}>
        <div className={styles.headlineGroup}>
          <span className={styles.eyebrow}>{explorerCopy.heroEyebrow}</span>
          <h1>
            {explorerCopy.headingLead}{" "}
            <span className={styles.heroAccent}>{explorerCopy.headingAccent}</span>{" "}
            {explorerCopy.headingTail}
          </h1>
          <p className={styles.heroSub}>{explorerCopy.heroSub}</p>
        </div>
        <form
          ref={fieldRef}
          className={styles.searchField}
          onSubmit={handleLaunch}
          onClick={(event) => {
            // Clicking the field's dead space (padding) still focuses the input.
            if (event.target === fieldRef.current) inputRef.current?.focus();
          }}
        >
          <label className={styles.searchLabel}>
            <img src="/search-icon.svg" alt="" />
            <input
              ref={inputRef}
              aria-label={explorerCopy.searchLabel}
              placeholder={explorerCopy.searchPlaceholder}
              value={searchValue}
              onChange={(event) => updateSearch(event.target.value)}
            />
          </label>
          <button
            type="submit"
            className={styles.commandButton}
            aria-label={explorerCopy.searchGo}
          >
            {explorerCopy.searchGo}
            <span className={styles.commandArrow} aria-hidden="true">
              ↓
            </span>
          </button>
        </form>
      </div>
      <section className={styles.mapSection} id="map">
        <div className={styles.mapIntro}>
          <span className={styles.mapEyebrow}>
            <span className={styles.mapEyebrowRule} aria-hidden="true" />
            <span className={styles.mapEyebrowPulse} aria-hidden="true" />
            {explorerCopy.mapEyebrow}
            <span className={styles.mapEyebrowPulse} aria-hidden="true" />
            <span className={styles.mapEyebrowRule} aria-hidden="true" />
          </span>
          <h2 className={styles.mapTitle}>
            {explorerCopy.mapHeadingLead}{" "}
            <span className={styles.mapTitleAccent}>
              {explorerCopy.mapHeadingAccent}
            </span>{" "}
            {explorerCopy.mapHeadingTail}
          </h2>
        </div>
        <div className={styles.map}>
          <TentacleMap className={styles.tentacles} activeTip={activeTip} />
          {explorerChains.map((chain) => {
            // Wrap each card in a full-map layer that applies the SAME rotation the
            // tentacle uses (same pivot, angle, period) — so the card rides the tip exactly.
            const m = undulateParams(chain.tip);
            return (
              <div
                key={chain.name}
                className={styles.cardSway}
                style={
                  {
                    "--sway-origin-x": m.originX,
                    "--sway-origin-y": m.originY,
                    "--undulate-amp": m.amp,
                    "--undulate-dur": m.dur,
                    "--undulate-delay": m.delay,
                  } as CSSProperties
                }
              >
                <ChainCard
                  style={
                    {
                      "--chain-top": `${chain.yPct}%`,
                      "--chain-left": `${chain.xPct}%`,
                    } as CSSProperties
                  }
                  iconSrc={chain.iconSrc}
                  name={chain.name}
                  gas={chain.gas}
                  onSelect={() => onChainSelect?.(chain)}
                  onHover={(hovered) => setActiveTip(hovered ? chain.tip : null)}
                />
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
