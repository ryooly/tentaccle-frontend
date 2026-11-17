import { explorerCopy } from "../content";
import SiteFrame from "../components/SiteFrame";
import styles from "./DocsPage.module.css";

/** Reference page for search, the gas map, and a chain page. */
export default function DocsPage() {
  const { eyebrow, titleLead, titleAccent, lede, sections } = explorerCopy.docsPage;

  return (
    <SiteFrame>
      <article className={styles.article}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>
            {titleLead} <span>{titleAccent}</span>
          </h1>
          <p className={styles.lede}>{lede}</p>
        </header>

        <div className={styles.layout}>
          <nav className={styles.toc} aria-label="On this page">
            <p className={styles.tocLabel}>On this page</p>
            <ol>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className={styles.sections}>
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className={styles.section}>
                <p className={styles.index} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </article>
    </SiteFrame>
  );
}
