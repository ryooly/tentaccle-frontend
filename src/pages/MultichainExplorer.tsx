import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  chainSlug,
  explorerCopy,
  type ExplorerCategory,
  type ExplorerChain,
} from "../content";
import ExplorerHero from "../components/ExplorerHero";
import NetworkBackdrop from "../components/NetworkBackdrop";
import SiteFooter from "../components/SiteFooter";
import { scrollToElement } from "../tentacleMotion";
import styles from "./MultichainExplorer.module.css";

interface MultichainExplorerProps {}

/** The routed landing screen for the multichain explorer — a natural, scrollable document. */
export default function MultichainExplorer(_: MultichainExplorerProps) {
  const navigate = useNavigate();
  const [searchJump, setSearchJump] = useState<{
    query: string;
    nonce: number;
  } | null>(null);

  const handleCategorySelect = useCallback(
    (_: ExplorerCategory) => undefined,
    [],
  );
  // Tapping a chain card routes to that chain's dedicated detail page (with its cart).
  const handleChainSelect = useCallback(
    (chain: ExplorerChain) => navigate(`/chain/${chainSlug(chain.name)}`),
    [navigate],
  );

  return (
    <main className={styles.page}>
      <NetworkBackdrop />
      <p className={styles.desktopNotice} role="note">
        <span className={styles.noticeIcon} aria-hidden="true">
          ⚠️
        </span>
        <span>{explorerCopy.desktopWarning}</span>
      </p>
      <ExplorerHero
        onCategorySelect={handleCategorySelect}
        onChainSelect={handleChainSelect}
        onExplore={() => {
          const map = document.getElementById("map");
          if (map) {
            scrollToElement(map);
          }
        }}
        searchJump={searchJump}
      />
      <SiteFooter />
    </main>
  );
}
