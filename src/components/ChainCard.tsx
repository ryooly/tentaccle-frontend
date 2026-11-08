import type { CSSProperties } from "react";
import styles from "./ChainCard.module.css";
import { explorerCopy } from "../content";

export interface ChainCardProps {
  iconSrc: string;
  name: string;
  gas: string;
  href?: string;
  onSelect?: () => void;
  /** Notified when the card gains (true) or loses (false) pointer/keyboard focus. */
  onHover?: (hovered: boolean) => void;
  className?: string;
  style?: CSSProperties;
}

/** A clickable blockchain entry point, showing its live gas, pinned to a tentacle tip. */
export default function ChainCard({
  iconSrc,
  name,
  gas,
  href,
  onSelect,
  onHover,
  className = "",
  style,
}: ChainCardProps) {
  const cardClassName = [styles.card, className].filter(Boolean).join(" ");
  const label = `${name} — ${explorerCopy.gasPrefix} ${gas}`;
  const content = (
    <>
      <img className={styles.icon} src={iconSrc} alt="" />
      <strong className={styles.name}>{name}</strong>
      <span className={styles.gas}>
        {explorerCopy.gasPrefix} {gas}
      </span>
      <span className={styles.cta} aria-hidden="true">
        ↗
      </span>
    </>
  );

  if (href) {
    return (
      <a
        className={cardClassName}
        href={href}
        style={style}
        aria-label={label}
        data-chain={name}
        onMouseEnter={() => onHover?.(true)}
        onMouseLeave={() => onHover?.(false)}
        onFocus={() => onHover?.(true)}
        onBlur={() => onHover?.(false)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={cardClassName}
      style={style}
      aria-label={label}
      data-chain={name}
      onClick={onSelect}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onFocus={() => onHover?.(true)}
      onBlur={() => onHover?.(false)}
    >
      {content}
    </button>
  );
}
