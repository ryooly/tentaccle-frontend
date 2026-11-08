import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Link, useParams } from "react-router-dom";
import { chainTileValue, explorerCopy, findChainBySlug } from "../content";
import SiteFooter from "../components/SiteFooter";
import styles from "./ChainDetail.module.css";

/** Small line icons for each timeframe, drawn with currentColor so they inherit state. */
function TimeframeIcon({ range }: { range: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (range === "Hourly") {
    // Clock face + hands.
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    );
  }
  if (range === "Daily") {
    // Sun: a day's cycle.
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
      </svg>
    );
  }
  // Weekly: a calendar with week grid.
  return (
    <svg {...common}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  );
}

/** Clamp a zoom level to a sane range so the chart never collapses or blows up. */
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** The routed detail screen for a single blockchain, keyed by its slug in the URL. */
export default function ChainDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const chain = findChainBySlug(slug);

  // Copy-to-clipboard for the "#" prefixed address, with brief inline confirmation.
  const [copied, setCopied] = useState(false);
  // Chart timeframe selector. Switching a range slides the plot in from the side the
  // new range sits on (later ranges slide in from the right, earlier from the left).
  const ranges = explorerCopy.chainPage.chart.timeframes as readonly string[];
  const [timeframe, setTimeframe] = useState<string>(ranges[1]);
  const [slideDir, setSlideDir] = useState<"left" | "right">("right");
  const selectTimeframe = (next: string) => {
    const from = ranges.indexOf(timeframe);
    const to = ranges.indexOf(next);
    if (from === to) return;
    setSlideDir(to > from ? "right" : "left");
    setTimeframe(next);
  };
  // Index of the active range drives the sliding thumb position.
  const activeIndex = Math.max(0, ranges.indexOf(timeframe));
  // Secondary selector: options depend on the active timeframe. Each timeframe keeps
  // its own chosen value, so switching back restores the previous selection.
  const rangeOptions = explorerCopy.chainPage.chart.rangeOptions as Record<
    string,
    readonly string[]
  >;
  const [selectedRange, setSelectedRange] = useState<Record<string, string>>(() => ({
    Hourly: rangeOptions.Hourly[0],
    Daily: rangeOptions.Daily[0],
    Weekly: rangeOptions.Weekly[0],
  }));
  const currentRangeOptions = rangeOptions[timeframe] ?? [];
  const currentRange = selectedRange[timeframe] ?? currentRangeOptions[0] ?? "";
  const selectRange = (next: string) =>
    setSelectedRange((prev) => ({ ...prev, [timeframe]: next }));

  // Resizable right-hand price/number column (TradingView-style cutter drag).
  const [axisWidth, setAxisWidth] = useState(88);
  const axisDrag = useRef<{ startX: number; startWidth: number } | null>(null);

  const onCutterDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    axisDrag.current = { startX: e.clientX, startWidth: axisWidth };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onCutterMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!axisDrag.current) return;
    // Dragging left widens the number column; dragging right narrows it.
    const delta = axisDrag.current.startX - e.clientX;
    setAxisWidth(clamp(axisDrag.current.startWidth + delta, 56, 200));
  };
  const onCutterUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    axisDrag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // TradingView-style chart interaction: wheel + pinch zoom, drag to pan on both
  // axes, double-click (or the reset button) to return to the default viewport.
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState({ x: 1, y: 1 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  // Zoom origin follows the cursor so wheel zoom feels anchored under the pointer.
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);

  // Live pointer positions drive two-finger pinch; the drag ref anchors panning.
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const drag = useRef<{
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
  } | null>(null);
  const pinch = useRef<{ startDist: number; startZoom: { x: number; y: number } } | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Anchor the zoom at the cursor position within the canvas.
      const rect = el.getBoundingClientRect();
      setOrigin({
        x: clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100),
        y: clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100),
      });
      const factor = Math.exp(-e.deltaY * 0.0015);
      if (e.shiftKey) {
        setZoom((z) => ({ ...z, y: clamp(z.y * factor, 0.5, 8) }));
      } else {
        setZoom((z) => ({ ...z, x: clamp(z.x * factor, 0.5, 12) }));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
    if (pointers.current.size === 2) {
      // Second finger down: hand off from panning to a pinch-zoom gesture.
      const [a, b] = Array.from(pointers.current.values());
      pinch.current = {
        startDist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        startZoom: { ...zoom },
      };
      drag.current = null;
      setDragging(false);
    } else if (pointers.current.size === 1) {
      drag.current = {
        startX: e.clientX,
        startY: e.clientY,
        startOffsetX: offset.x,
        startOffsetY: offset.y,
      };
      setDragging(true);
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinch.current) {
      // Pinch/stretch: scale both axes relative to where the gesture started.
      const [a, b] = Array.from(pointers.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const factor = dist / pinch.current.startDist;
      setZoom({
        x: clamp(pinch.current.startZoom.x * factor, 0.5, 12),
        y: clamp(pinch.current.startZoom.y * factor, 0.5, 8),
      });
    } else if (drag.current) {
      // Single-pointer drag: pan horizontally and vertically.
      setOffset({
        x: drag.current.startOffsetX + (e.clientX - drag.current.startX),
        y: drag.current.startOffsetY + (e.clientY - drag.current.startY),
      });
    }
  };

  const endPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) {
      drag.current = null;
      setDragging(false);
    }
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const resetView = () => {
    setZoom({ x: 1, y: 1 });
    setOffset({ x: 0, y: 0 });
    setOrigin({ x: 50, y: 50 });
  };
  const zoomIn = () =>
    setZoom((z) => ({ x: clamp(z.x * 1.3, 0.5, 12), y: clamp(z.y * 1.3, 0.5, 8) }));
  const zoomOut = () =>
    setZoom((z) => ({ x: clamp(z.x / 1.3, 0.5, 12), y: clamp(z.y / 1.3, 0.5, 8) }));
  const chartTransform: CSSProperties = {
    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom.x}, ${zoom.y})`,
    transformOrigin: `${origin.x}% ${origin.y}%`,
  };

  const clearTimer = useRef<number | null>(null);
  const copyAddress = useCallback(async () => {
    if (!chain) return;
    try {
      await navigator.clipboard.writeText(`#${chain.address}`);
      setCopied(true);
      if (clearTimer.current !== null) window.clearTimeout(clearTimer.current);
      clearTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [chain]);

  // Keep the chip compact: show only a head and tail slice, while the full value
  // stays available for copying and assistive tech.
  const shortAddress =
    chain && chain.address.length > 14
      ? `${chain.address.slice(0, 6)}…${chain.address.slice(-4)}`
      : chain?.address ?? "";

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        {chain ? (
          <>
            <header className={styles.identity}>
              {/* Back button sits inline, immediately beside the logo and name. */}
              <Link className={styles.back} to="/" aria-label={explorerCopy.chainPage.back}>
                <span aria-hidden="true">←</span>
              </Link>
              <img className={styles.icon} src={chain.iconSrc} alt="" />
              <div className={styles.meta}>
                <h1 className={styles.name}>{chain.name}</h1>
                <button
                  type="button"
                  className={styles.address}
                  onClick={copyAddress}
                  title={`#${chain.address}`}
                  aria-label={`${explorerCopy.chainPage.copyAddress}: #${chain.address}`}
                >
                  <span className={styles.addressHash} aria-hidden="true">
                    #
                  </span>
                  <span className={styles.addressText}>{shortAddress}</span>
                  <span className={styles.copyHint} aria-hidden="true">
                    {copied ? "✓" : "⧉"}
                  </span>
                </button>
                {/* Inline confirmation sits right beside the address it refers to. */}
                <p className={styles.status} role="status" aria-live="polite">
                  {copied ? explorerCopy.chainPage.copied : ""}
                </p>
              </div>
            </header>

            {/* Metric buttons — values stay open until the backend fills chain.stats. */}
            <div className={styles.tiles}>
              {explorerCopy.chainPage.tiles.map((tile) => {
                const value = chainTileValue(chain, tile.id);
                return (
                  <button
                    key={tile.id}
                    type="button"
                    className={styles.tile}
                    aria-label={
                      value ? `${tile.title}: ${value}` : `${tile.title}: awaiting data`
                    }
                  >
                    <span className={styles.tileTitle}>{tile.title}</span>
                    <strong
                      className={styles.tileValue}
                      data-empty={value ? undefined : "true"}
                    >
                      {value ?? "—"}
                    </strong>
                  </button>
                );
              })}
            </div>

            {/*
              CHART — BACKEND DATA SEAM
              ----------------------------------------------------------
              The connecting points (nodes + lines) will be plotted here from
              data pulled off the backend, e.g.:
                GET /api/chains/{chain.name}/chart  -> [{ x, y }, ...]
              Map each returned point to an SVG <circle> and connect them with a
              <polyline>/<path> inside <g data-chart-points>. Left empty on purpose.
            */}
            <section className={styles.chart} aria-label={explorerCopy.chainPage.chart.title}>
              <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}>{explorerCopy.chainPage.chart.title}</h2>
              </div>

              {/* TradingView-style board: toolbar header, plot, cutter, number column. */}
              <div className={styles.board} data-chart-integration={chain.name}>
                <div className={styles.boardToolbar}>
                  <div
                    className={styles.timeframes}
                    role="group"
                    aria-label={explorerCopy.chainPage.chart.timeframeLabel}
                    data-chart-timeframe={timeframe}
                  >
                    <span
                      className={styles.thumb}
                      style={{ "--i": activeIndex } as CSSProperties}
                      aria-hidden="true"
                    />
                    {ranges.map((range) => (
                      <button
                        key={range}
                        type="button"
                        className={styles.timeframe}
                        data-active={range === timeframe}
                        aria-pressed={range === timeframe}
                        aria-label={range}
                        title={range}
                        onClick={() => selectTimeframe(range)}
                      >
                        <TimeframeIcon range={range} />
                      </button>
                    ))}
                  </div>

                  <div
                    className={styles.rangeOptions}
                    role="group"
                    aria-label={`${explorerCopy.chainPage.chart.rangeLabel} — ${timeframe}`}
                  >
                    {currentRangeOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={styles.rangeOption}
                        data-active={opt === currentRange}
                        aria-pressed={opt === currentRange}
                        onClick={() => selectRange(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div
                    className={styles.chartControls}
                    role="group"
                    aria-label="Chart zoom"
                  >
                    <button
                      type="button"
                      className={styles.chartControl}
                      onClick={zoomIn}
                      aria-label="Zoom in"
                      title="Zoom in"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className={styles.chartControl}
                      onClick={zoomOut}
                      aria-label="Zoom out"
                      title="Zoom out"
                    >
                      {"\u2212"}
                    </button>
                    <button
                      type="button"
                      className={styles.chartControl}
                      onClick={resetView}
                      aria-label="Reset view"
                      title="Reset view"
                    >
                      {"\u21ba"}
                    </button>
                  </div>
                </div>

                <div className={styles.boardBody}>
                  <div
                    className={styles.plotCanvas}
                    ref={canvasRef}
                    role="img"
                    aria-label={explorerCopy.chainPage.chart.empty}
                    data-dragging={dragging}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endPointer}
                    onPointerCancel={endPointer}
                    onDoubleClick={resetView}
                  >
                    <div className={styles.plotStage} key={timeframe} data-dir={slideDir}>
                      <svg
                        className={styles.chartSvg}
                        viewBox="0 0 600 240"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        style={chartTransform}
                      >
                        <g className={styles.grid}>
                          {[40, 90, 140, 190].map((y) => (
                            <line key={y} x1={0} y1={y} x2={600} y2={y} />
                          ))}
                        </g>
                        <g className={styles.points} data-chart-points="" />
                      </svg>
                      <p className={styles.chartEmpty}>{explorerCopy.chainPage.chart.empty}</p>
                    </div>
                  </div>

                  {/* Vertical cutter — drag to resize the right-hand number column. */}
                  <div
                    className={styles.cutter}
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Resize price scale"
                    aria-valuenow={axisWidth}
                    aria-valuemin={56}
                    aria-valuemax={200}
                    tabIndex={0}
                    onPointerDown={onCutterDown}
                    onPointerMove={onCutterMove}
                    onPointerUp={onCutterUp}
                    onPointerCancel={onCutterUp}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowLeft") {
                        e.preventDefault();
                        setAxisWidth((w) => clamp(w + 8, 56, 200));
                      } else if (e.key === "ArrowRight") {
                        e.preventDefault();
                        setAxisWidth((w) => clamp(w - 8, 56, 200));
                      }
                    }}
                  />

                  <aside
                    className={styles.axis}
                    style={{ width: axisWidth }}
                    aria-label="Value scale"
                  >
                    <div className={styles.axisTicks}>
                      {explorerCopy.chainPage.chart.axis.scale.length > 0 ? (
                        explorerCopy.chainPage.chart.axis.scale.map((tick) => (
                          <span key={tick} className={styles.axisTick}>
                            {tick}
                          </span>
                        ))
                      ) : (
                        Array.from({ length: 4 }).map((_, i) => (
                          <span key={i} className={styles.axisTickEmpty} aria-hidden="true" />
                        ))
                      )}
                    </div>
                    {explorerCopy.chainPage.chart.axis.last && (
                      <div
                        className={styles.axisLast}
                        style={{
                          top: `${explorerCopy.chainPage.chart.axis.last.topPct}%`,
                        }}
                      >
                        <span className={styles.axisLastValue}>
                          {explorerCopy.chainPage.chart.axis.last.value}
                        </span>
                        <span className={styles.axisLastTime}>
                          {explorerCopy.chainPage.chart.axis.last.time}
                        </span>
                      </div>
                    )}
                    {explorerCopy.chainPage.chart.axis.volume && (
                      <span className={styles.axisVolume}>
                        {explorerCopy.chainPage.chart.axis.volume}
                      </span>
                    )}
                  </aside>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className={styles.notFound} aria-label={explorerCopy.chainPage.notFoundHeading}>
            <h1 className={styles.notFoundHeading}>{explorerCopy.chainPage.notFoundHeading}</h1>
            <p className={styles.notFoundBody}>{explorerCopy.chainPage.notFoundBody}</p>
            <Link className={styles.back} to="/">
              <span aria-hidden="true">←</span>
              {explorerCopy.chainPage.back}
            </Link>
          </section>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
