import styles from "./DiscoveryCard.module.css";

export interface DiscoveryCardProps {
  title: string;
  subtitle: string;
  onSelect?: () => void;
  className?: string;
}

/** A compact discovery destination presented at the base of the explorer. */
export default function DiscoveryCard({ title, subtitle, onSelect, className = "" }: DiscoveryCardProps) {
  return (
    <button className={[styles.card, className].filter(Boolean).join(" ")} type="button" onClick={onSelect}>
      <span className={styles.copy}>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
      <span className={styles.arrow} aria-hidden="true">↗</span>
    </button>
  );
}
