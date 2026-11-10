/**
 * Shared math for the octopus tentacle undulation. Both the tentacle (which sways by
 * rotating about its head base) and its chain card (wrapped in an element that applies
 * the SAME rotation) derive their motion from here, so the card rides the exact same
 * transform as the tentacle tip and they can never drift apart.
 *
 * Coordinates are in the SVG viewBox space (1344 × 2500). The map scales uniformly, so a
 * rotation by θ about the head base maps the tip identically in the SVG and in an HTML
 * overlay whose transform-origin sits at the same relative point.
 */

/** Y where every tentacle meets the head. */
export const HEAD_BASE_Y = 187;

/** X where a given tentacle meets the head (they fan out 16px apart, starting at 615). */
export function headBaseX(tip: number): number {
  return 615 + tip * 16;
}

export interface TentacleMotion {
  /** Pivot in viewBox px — used by the SVG tentacle group. */
  pivotX: string;
  pivotY: string;
  /** Same pivot expressed as a % of the map box — used by the card overlay. */
  originX: string;
  originY: string;
  amp: string;
  dur: string;
  delay: string;
}

export function undulateParams(tip: number): TentacleMotion {
  const ampDeg = 0.45 + (tip % 3) * 0.1;
  const durS = 6 + (tip % 4) * 1.1;
  const delayS = tip * 0.6;
  const baseX = headBaseX(tip);
  return {
    pivotX: `${baseX}px`,
    pivotY: `${HEAD_BASE_Y}px`,
    originX: `${((baseX / 1344) * 100).toFixed(4)}%`,
    originY: `${((HEAD_BASE_Y / 2500) * 100).toFixed(4)}%`,
    amp: `${ampDeg.toFixed(2)}deg`,
    dur: `${durS.toFixed(2)}s`,
    delay: `${delayS.toFixed(2)}s`,
  };
}

/**
 * Glides the viewport to an element with the same easeInOutCubic curve the
 * search bar uses, then focuses the element on arrival.
 */
export function scrollToElement(element: HTMLElement): void {
  let rafId: number | null = null;
  const start = window.scrollY;
  const rect = element.getBoundingClientRect();
  const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const target = Math.max(
    0,
    Math.min(maxY, start + rect.top + rect.height / 2 - window.innerHeight / 2),
  );
  const delta = target - start;
  const focus = () => element.focus({ preventScroll: true });
  if (
    Math.abs(delta) < 8 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    window.scrollTo({ top: target, behavior: "instant" });
    focus();
    return;
  }
  const duration = Math.min(1200, Math.max(550, Math.abs(delta) * 0.8));
  const t0 = performance.now();
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / duration);
    const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    window.scrollTo({ top: start + delta * e, behavior: "instant" });
    if (p < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
      focus();
    }
  };
  rafId = requestAnimationFrame(step);
}
