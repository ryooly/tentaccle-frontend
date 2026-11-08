import type { CSSProperties, KeyboardEvent } from "react";
import { undulateParams } from "../tentacleMotion";
import styles from "./TentacleMap.module.css";

export interface TentacleMapProps {
  /** Tip index of the tentacle to keep in full color; all others fade to gray. Null = none hovered. */
  activeTip: number | null;
  /** Optional action fired when the octopus head is activated (click or Enter/Space). */
  onHeadPress?: () => void;
  className?: string;
}

/**
 * The octopus's eight downward tentacles plus its head, recreated as inline SVG so each
 * tentacle can be styled independently. Tip index matches the SVG source order (0-7).
 * tipX/tipY is the anchored endpoint (in viewBox px) that each card sits on. Undulation
 * instead pivots at the head (base), so nothing near the head moves outside its silhouette.
 */
const TENTACLES: {
  tip: number;
  outline: string;
  core: string;
  coreColor: string;
  tipX: number;
  tipY: number;
}[] = [
  {
    tip: 0,
    outline: "M615 187C615 358.72 76 482.74 76 664",
    core: "M615 180C615 351.72 76 475.74 76 657",
    coreColor: "#B378F4",
    tipX: 76,
    tipY: 657,
  },
  {
    tip: 1,
    outline: "M631 187C631 466.72 244 668.74 244 964",
    core: "M631 180C631 459.72 244 661.74 244 957",
    coreColor: "#A464EF",
    tipX: 244,
    tipY: 957,
  },
  {
    tip: 2,
    outline: "M647 187C647 592.72 412 885.74 412 1314",
    core: "M647 180C647 585.72 412 878.74 412 1307",
    coreColor: "#B378F4",
    tipX: 412,
    tipY: 1307,
  },
  {
    tip: 3,
    outline: "M663 187C663 859.12 580 1344.54 580 2054",
    core: "M663 180C663 852.12 580 1337.54 580 2047",
    coreColor: "#A464EF",
    tipX: 580,
    tipY: 2047,
  },
  {
    tip: 4,
    outline: "M679 187C679 664.72 748 1009.74 748 1514",
    core: "M679 180C679 657.72 748 1002.74 748 1507",
    coreColor: "#B378F4",
    tipX: 748,
    tipY: 1507,
  },
  {
    tip: 5,
    outline: "M695 187C695 754.72 916 1164.74 916 1764",
    core: "M695 180C695 747.72 916 1157.74 916 1757",
    coreColor: "#A464EF",
    tipX: 916,
    tipY: 1757,
  },
  {
    tip: 6,
    outline: "M711 187C711 934.72 1084 1474.74 1084 2264",
    core: "M711 180C711 927.72 1084 1467.74 1084 2257",
    coreColor: "#B378F4",
    tipX: 1084,
    tipY: 2257,
  },
  {
    tip: 7,
    outline: "M727 187C727 999.52 1252 1586.34 1252 2444",
    core: "M727 180C727 992.52 1252 1579.34 1252 2437",
    coreColor: "#A464EF",
    tipX: 1252,
    tipY: 2437,
  },
];

/** The eight-tentacle octopus canvas, kept in sync with /Octopus-Eight-downward-tentacles.svg. */
export default function TentacleMap({
  activeTip,
  onHeadPress,
  className = "",
}: TentacleMapProps) {
  // Keyboard parity for the head button: Enter and Space activate it like a real button.
  const handleHeadKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onHeadPress?.();
    }
  };
  return (
    <svg
      className={className}
      viewBox="0 0 1344 2500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      role="group"
      aria-label="Octopus with eight tentacles reaching the connected blockchains"
    >
      {TENTACLES.map((t) => {
        const dimmed = activeTip !== null && t.tip !== activeTip;
        const isActive = activeTip === t.tip;
        const groupClass = [
          styles.tentacle,
          dimmed && styles.dimmed,
          isActive && styles.active,
        ]
          .filter(Boolean)
          .join(" ");
        // Stagger each tentacle's pulse so the motion reads as organic, not synchronized.
        const pulseStyle = {
          "--pulse-delay": `${(t.tip * 0.32).toFixed(2)}s`,
          "--pulse-dur": `${(3 + (t.tip % 4) * 0.5).toFixed(2)}s`,
        } as CSSProperties;
        // Pivot at the head base and derive sway timing/amplitude from the shared motion
        // math, so the connected card (which applies the identical rotation) tracks exactly.
        const m = undulateParams(t.tip);
        const groupStyle = {
          "--pivot-x": m.pivotX,
          "--pivot-y": m.pivotY,
          "--undulate-delay": m.delay,
          "--undulate-dur": m.dur,
          "--undulate-amp": m.amp,
        } as CSSProperties;
        return (
          <g key={t.tip} className={groupClass} style={groupStyle}>
            <path
              d={t.outline}
              strokeWidth={39}
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="#6B36BC"
            />
            <path
              d={t.core}
              strokeWidth={33}
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke={t.coreColor}
            />
            <path
              className={styles.pulse}
              d={t.core}
              pathLength={100}
              strokeWidth={8}
              strokeLinecap="round"
              stroke="#E9D5FF"
              strokeOpacity={0.9}
              style={pulseStyle}
            />
          </g>
        );
      })}

      <g
        className={styles.head}
        role="button"
        tabIndex={0}
        aria-label="Octopus head"
        onClick={onHeadPress}
        onKeyDown={handleHeadKeyDown}
      >
        <path
          d="M580 134.4C580 63.6235 610.667 28.2353 672 28.2353C733.333 28.2353 764 63.6235 764 134.4L754 195.388C751.333 219.482 740 228.518 720 222.494L692 211.2C678.667 225.506 665.333 225.506 652 211.2L624 222.494C602.667 228.518 590.667 219.482 588 195.388L580 134.4Z"
          fill="#763BC8"
        />
        <path
          d="M580 124.235C580 53.4588 610.667 18.0706 672 18.0706C733.333 18.0706 764 53.4588 764 124.235L754 185.224C751.333 209.318 740 218.353 720 212.329L692 201.035C678.667 215.341 665.333 215.341 652 201.035L624 212.329C602.667 218.353 590.667 209.318 588 185.224L580 124.235Z"
          fill="#AC6BF3"
        />
        <path
          d="M610 63.247C626 43.6706 642.667 36.8941 660 42.9176"
          strokeWidth={13}
          strokeLinecap="round"
          stroke="#CFA3FC"
        />
        <path
          d="M635 159.247C650.464 159.247 663 141.043 663 118.588C663 96.133 650.464 77.9294 635 77.9294C619.536 77.9294 607 96.133 607 118.588C607 141.043 619.536 159.247 635 159.247Z"
          fill="white"
        />
        <path
          d="M705 159.247C720.464 159.247 733 141.043 733 118.588C733 96.133 720.464 77.9294 705 77.9294C689.536 77.9294 677 96.133 677 118.588C677 141.043 689.536 159.247 705 159.247Z"
          fill="white"
        />
        <path
          d="M643 149.082C650.18 149.082 656 138.464 656 125.365C656 112.266 650.18 101.647 643 101.647C635.82 101.647 630 112.266 630 125.365C630 138.464 635.82 149.082 643 149.082Z"
          fill="#352056"
        />
        <path
          d="M697 149.082C704.18 149.082 710 138.464 710 125.365C710 112.266 704.18 101.647 697 101.647C689.82 101.647 684 112.266 684 125.365C684 138.464 689.82 149.082 697 149.082Z"
          fill="#352056"
        />
        <path
          d="M647 120.847C649.761 120.847 652 118.319 652 115.2C652 112.081 649.761 109.553 647 109.553C644.239 109.553 642 112.081 642 115.2C642 118.319 644.239 120.847 647 120.847Z"
          fill="white"
        />
        <path
          d="M701 120.847C703.761 120.847 706 118.319 706 115.2C706 112.081 703.761 109.553 701 109.553C698.239 109.553 696 112.081 696 115.2C696 118.319 698.239 120.847 701 120.847Z"
          fill="white"
        />
        {/* Eyelids reuse the exact eye geometry (head-colored) and grow down from the top of
            each eye to blink. transform-origin is set per lid so it closes like a real eyelid. */}
        <path
          className={styles.eyelid}
          d="M635 159.247C650.464 159.247 663 141.043 663 118.588C663 96.133 650.464 77.9294 635 77.9294C619.536 77.9294 607 96.133 607 118.588C607 141.043 619.536 159.247 635 159.247Z"
          fill="#AC6BF3"
          style={{ "--lid-x": "635px", "--lid-y": "77.93px" } as CSSProperties}
        />
        <path
          className={styles.eyelid}
          d="M705 159.247C720.464 159.247 733 141.043 733 118.588C733 96.133 720.464 77.9294 705 77.9294C689.536 77.9294 677 96.133 677 118.588C677 141.043 689.536 159.247 705 159.247Z"
          fill="#AC6BF3"
          style={{ "--lid-x": "705px", "--lid-y": "77.93px" } as CSSProperties}
        />
        <path
          d="M611 170.541C619.284 170.541 626 166.496 626 161.506C626 156.516 619.284 152.471 611 152.471C602.716 152.471 596 156.516 596 161.506C596 166.496 602.716 170.541 611 170.541Z"
          fill="#D49AFA"
        />
        <path
          d="M732 170.541C740.284 170.541 747 166.496 747 161.506C747 156.516 740.284 152.471 732 152.471C723.716 152.471 717 156.516 717 161.506C717 166.496 723.716 170.541 732 170.541Z"
          fill="#D49AFA"
        />
        <g className={styles.mouth}>
          <path
            d="M650 168.282C664.667 189.365 679.333 189.365 694 168.282H650Z"
            fill="#48236B"
          />
          <path
            d="M661 181.835C668.333 175.812 676 176.188 684 182.965C676 188.988 668.333 188.612 661 181.835Z"
            fill="#F3A3CE"
          />
        </g>
      </g>
    </svg>
  );
}
