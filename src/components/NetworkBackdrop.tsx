import styles from "./NetworkBackdrop.module.css";

/**
 * Decorative blockchain-network field that fills the empty page space behind UI.
 * Two mirrored constellation panels sit in the side margins; a soft hex lattice
 * carries through the rest. Purely visual — hidden from AT and pointer-events off.
 */
export default function NetworkBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.glow} />
      <svg
        className={styles.lattice}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="hexLattice"
            width="72"
            height="62"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M36 2L58 15V41L36 54L14 41V15Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="latticeFade" cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="45%" stopColor="white" stopOpacity="0.35" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </radialGradient>
          <mask id="latticeMask">
            <rect width="100%" height="100%" fill="url(#latticeFade)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#hexLattice)"
          mask="url(#latticeMask)"
        />
      </svg>

      <svg
        className={`${styles.panel} ${styles.panelLeft}`}
        viewBox="0 0 420 980"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <NetworkConstellation />
      </svg>

      <svg
        className={`${styles.panel} ${styles.panelRight}`}
        viewBox="0 0 420 980"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <g transform="translate(420 0) scale(-1 1)">
          <NetworkConstellation offset />
        </g>
      </svg>
    </div>
  );
}

function NetworkConstellation({ offset = false }: { offset?: boolean }) {
  const pulseA = offset ? styles.pulseLate : styles.pulse;
  const pulseB = offset ? styles.pulse : styles.pulseLate;

  return (
    <g className={styles.constellation}>
      {/* Link web */}
      <g className={styles.links}>
        <path d="M48 120C92 168 118 210 156 248" />
        <path d="M156 248C210 286 248 318 292 372" />
        <path d="M156 248C132 310 118 360 96 418" />
        <path d="M292 372C318 430 338 486 360 548" />
        <path d="M292 372C248 410 210 452 176 508" />
        <path d="M96 418C148 448 198 478 248 520" />
        <path d="M176 508C210 560 238 612 268 670" />
        <path d="M248 520C292 568 318 620 348 682" />
        <path d="M268 670C232 720 198 768 164 820" />
        <path d="M348 682C318 740 286 792 250 850" />
        <path d="M96 418C70 470 58 530 52 590" />
        <path d="M52 590C78 640 110 690 148 742" />
        <path d="M164 820C128 860 96 890 72 920" />
        <path className={styles.linkSoft} d="M48 120C28 180 22 250 36 320" />
        <path className={styles.linkSoft} d="M360 548C380 600 392 660 400 720" />
        <path className={styles.linkSoft} d="M250 850C290 880 330 900 370 910" />
      </g>

      {/* Hex block nodes */}
      <g className={styles.blocks}>
        <Hex cx={156} cy={248} r={18} />
        <Hex cx={292} cy={372} r={22} />
        <Hex cx={96} cy={418} r={16} />
        <Hex cx={248} cy={520} r={20} />
        <Hex cx={176} cy={508} r={14} />
        <Hex cx={268} cy={670} r={18} />
        <Hex cx={348} cy={682} r={15} />
        <Hex cx={164} cy={820} r={17} />
      </g>

      {/* Round junction nodes */}
      <g className={styles.nodes}>
        <circle className={pulseA} cx="48" cy="120" r="5" />
        <circle cx="360" cy="548" r="4.5" />
        <circle className={pulseB} cx="52" cy="590" r="5" />
        <circle cx="148" cy="742" r="4" />
        <circle className={pulseA} cx="250" cy="850" r="5.5" />
        <circle cx="72" cy="920" r="4" />
        <circle className={pulseB} cx="400" cy="720" r="3.5" />
        <circle cx="36" cy="320" r="3.5" />
      </g>

      {/* Inner block marks — tiny chain hashes */}
      <g className={styles.marks}>
        <path d="M148 248h16M156 240v16" />
        <path d="M284 372h16M292 364v16" />
        <path d="M240 520h16M248 512v16" />
        <path d="M260 670h16M268 662v16" />
      </g>
    </g>
  );
}

function Hex({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = ((60 * i - 30) * Math.PI) / 180;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");

  return <polygon points={points} />;
}
