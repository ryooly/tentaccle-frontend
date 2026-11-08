import styles from "./CategoryCard.module.css";

export type CategoryTone = "defi" | "tokens" | "bridges" | "docs";

export interface CategoryCardProps {
  title: string;
  subtitle: string;
  tone: CategoryTone;
  onSelect?: () => void;
}

/** A colored category destination in the explorer map. */
export default function CategoryCard({
  title,
  subtitle,
  tone,
  onSelect,
}: CategoryCardProps) {
  return (
    <button
      className={[styles.card, styles[tone]].join(" ")}
      type="button"
      onClick={onSelect}
    >
      <span className={styles.copy}>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
      <span className={styles.arrow} aria-hidden="true">
        ↗
      </span>
    </button>
  );
}
