import { Link } from "react-router-dom";
import { chainSlug, explorerChains, explorerCopy } from "../content";
import styles from "./SiteFooter.module.css";

type SocialId = (typeof explorerCopy.footer.socials)[number]["id"];

/** Inline marks for the footer social row. currentColor so hover can recolor them. */
function SocialIcon({ id }: { id: SocialId }) {
  const common = {
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    className: styles.icon,
  };

  if (id === "x") {
    return (
      <svg {...common}>
        <path
          fill="currentColor"
          d="M14.7 10.4 21.4 3h-1.6l-5.8 6.4L9.2 3H3.4l7 9.9L3.4 21h1.6l6.2-6.8L14.8 21h5.8l-7.3-10.6Zm-2.2 2.4-.7-1-5.7-7.9h2.4l4.6 6.4.7 1 6 8.3h-2.4l-4.9-6.8Z"
        />
      </svg>
    );
  }

  if (id === "instagram") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (id === "threads") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          d="M9.2 11.2c.5-2.6 2.2-4 4.2-4 2.6 0 4.1 1.8 4.1 4.4 0 4.2-3.2 6.6-6.6 6.6-3.6 0-5.9-2.4-5.9-5.6 0-4.6 3.4-8.1 8.6-8.1 4.4 0 7.4 2.6 7.4 6.4"
        />
        <path
          strokeLinecap="round"
          d="M12.6 14.6c-1.5.7-3.2-.1-3.2-1.7 0-1.1.9-1.9 2.2-1.9 2.2 0 3.3 1.5 3.4 3.6"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        fill="currentColor"
        d="M12 2.2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.6s.8-.3 2.8 1a9.6 9.6 0 0 1 5.1 0c2-.1 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.6 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2.2Z"
      />
    </svg>
  );
}

/** Product footer: brand, site links, networks, and social buttons. */
export default function SiteFooter() {
  const year = new Date().getFullYear();
  const { summary, rights, status, columns, socials } = explorerCopy.footer;

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brandBlock}>
          <span className={styles.brand}>{explorerCopy.brand}</span>
          <p className={styles.product}>{explorerCopy.product}</p>
          <p className={styles.summary}>{summary}</p>
          <nav className={styles.socials} aria-label="Social">
            {socials.map((social) => {
              const icon = <SocialIcon id={social.id} />;
              if (!social.href) {
                return (
                  <button
                    key={social.id}
                    type="button"
                    className={styles.social}
                    data-network={social.id}
                    title={`${social.label} — add your link in content.ts`}
                    aria-label={social.label}
                  >
                    {icon}
                  </button>
                );
              }
              return (
                <a
                  key={social.id}
                  className={styles.social}
                  data-network={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                >
                  {icon}
                </a>
              );
            })}
          </nav>
        </div>

        {columns.map((column) => (
          <nav
            key={column.title}
            className={styles.column}
            aria-label={column.title}
          >
            <h2 className={styles.columnTitle}>{column.title}</h2>
            <ul className={styles.links}>
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link className={styles.link} to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <nav className={styles.column} aria-label="Networks">
          <h2 className={styles.columnTitle}>Networks</h2>
          <div className={styles.networksRow}>
            <ul className={styles.links}>
              {explorerChains.slice(0, 4).map((chain) => (
                <li key={chain.name}>
                  <Link
                    className={styles.networkLink}
                    to={`/chain/${chainSlug(chain.name)}`}
                  >
                    <img
                      className={styles.chainIcon}
                      src={chain.iconSrc}
                      alt=""
                      width={22}
                      height={22}
                    />
                    <span>{chain.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className={styles.links}>
              {explorerChains.slice(4).map((chain) => (
                <li key={chain.name}>
                  <Link
                    className={styles.networkLink}
                    to={`/chain/${chainSlug(chain.name)}`}
                  >
                    <img
                      className={styles.chainIcon}
                      src={chain.iconSrc}
                      alt=""
                      width={22}
                      height={22}
                    />
                    <span>{chain.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className={styles.bar}>
        <p className={styles.credit}>
          © {year} {explorerCopy.brand}. {rights}
        </p>
        <p className={styles.status}>
          {explorerChains.length} networks · {status}
        </p>
      </div>
    </footer>
  );
}
