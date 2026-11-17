import { Link, useLocation } from "react-router-dom";
import { explorerCopy } from "../content";
import { scrollToElement } from "../tentacleMotion";
import styles from "./SiteHeader.module.css";

/** Shared desktop bar: brand, Explore, Docs, and About Devs. */
export default function SiteHeader() {
  const { pathname } = useLocation();

  return (
    <>
      <header className={styles.header}>
        <Link className={styles.brand} to="/">
          <strong>{explorerCopy.brand}</strong>
          <span>{explorerCopy.product}</span>
        </Link>
        <nav className={styles.navigation} aria-label={explorerCopy.product}>
          <Link
            to="/#map"
            aria-current={pathname === "/" ? "page" : undefined}
            onClick={(event) => {
              if (pathname !== "/") return;
              const map = document.getElementById("map");
              if (!map) return;
              event.preventDefault();
              scrollToElement(map, { focus: false });
            }}
          >
            {explorerCopy.explore}
          </Link>
          <Link to="/docs" aria-current={pathname === "/docs" ? "page" : undefined}>
            {explorerCopy.docs}
          </Link>
          <Link
            className={`${styles.walletButton} ${styles.aboutDevsButton}`}
            to="/about"
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            <span className={styles.devsBadge} aria-hidden="true">
              ✦
            </span>
            {explorerCopy.aboutDevs}
          </Link>
        </nav>
      </header>
      <div className={styles.divider} />
    </>
  );
}
