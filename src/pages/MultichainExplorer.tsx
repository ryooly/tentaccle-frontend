import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  chainSlug,
  explorerCopy,
  type DiscoveryItem,
  type ExplorerCategory,
  type ExplorerChain,
} from "../content";
import DiscoveryCard from "../components/DiscoveryCard";
import ExplorerHero from "../components/ExplorerHero";
import NetworkBackdrop from "../components/NetworkBackdrop";
import SiteFooter from "../components/SiteFooter";
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
  // Discovery tiles jump back to search — same idea as diving from the hero field.
  const handleDiscoverySelect = useCallback((item: DiscoveryItem) => {
    setSearchJump({ query: item.title, nonce: Date.now() });
  }, []);
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
        searchJump={searchJump}
      />
      <section className={styles.discovery} id="discover" aria-label={explorerCopy.product}>
        {explorerCopy.discovery.map((item) => (
          <DiscoveryCard
            key={item.title}
            {...item}
            onSelect={() => handleDiscoverySelect(item)}
          />
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
