import type { ReactNode } from "react";
import NetworkBackdrop from "./NetworkBackdrop";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import styles from "./SiteFrame.module.css";

/** Page chrome shared by Docs and About Devs: backdrop, bar, and footer. */
export default function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <main className={styles.page}>
      <NetworkBackdrop />
      <SiteHeader />
      <div className={styles.content}>{children}</div>
      <SiteFooter />
    </main>
  );
}
