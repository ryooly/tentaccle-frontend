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
