import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchFeeChart,
  fetchTokenPrice,
  fetchTransactions24h,
  fetchValidators24h,
  type ChainMetricResponse,
  type ChartTimeframe,
  type FeeChartPoint,
  type TokenPriceResponse,
} from "../api/chainTools";
import {
  chainTileValue,
  emptyChainStats,
  explorerCopy,
  findChainBySlug,
  type ChainTileStats,
} from "../content";
import SiteFooter from "../components/SiteFooter";
import styles from "./ChainDetail.module.css";

type NativeKeyboardEvent = globalThis.KeyboardEvent;

type UiTimeframe = "Hourly" | "Daily" | "Weekly";

const timeframeToApi: Record<UiTimeframe, ChartTimeframe> = {
  Hourly: "hour",
  Daily: "day",
  Weekly: "week",
};

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
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    );
  }
  if (range === "Daily") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
      </svg>
    );
  }
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

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: value < 1000 ? 2 : 1,
  }).format(value);
}

function formatTokenPrice(data: TokenPriceResponse): string {
  const price = data.price_usdt;
  const fractionDigits = price >= 1 ? (price >= 100 ? 2 : 4) : 6;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(price);
}

function formatMetric(data: ChainMetricResponse): string | null {
  if (data.value == null) return null;
  if (typeof data.value === "number" && Number.isFinite(data.value)) {
    return formatCompactNumber(data.value);
  }
  if (typeof data.value === "string" && data.value.trim() !== "") {
    return data.value;
  }
  return null;
}

function formatFeeValue(value: number): string {
  const abs = Math.abs(value);
  let maximumFractionDigits = 2;
  if (abs !== 0 && abs < 0.0001) maximumFractionDigits = 8;
  else if (abs < 0.01) maximumFractionDigits = 6;
  else if (abs < 1) maximumFractionDigits = 4;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

function formatChartTime(iso: string, timeframe: UiTimeframe): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  if (timeframe === "Hourly") {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: timeframe === "Weekly" ? "numeric" : undefined,
  }).format(date);
}

interface ChartPointData {
  x: number;
  y: number;
  value: number;
  raw: FeeChartPoint;
  index: number;
}

interface ChartModel {
  width: number;
  height: number;
  pts: ChartPointData[];
  visiblePts: ChartPointData[];
  line: string;
  area: string;
  last: ChartPointData;
  ticks: { value: string; y: number; topPct: number }[];
  sliceStart: number;
  sliceEnd: number;
  lastLabel: {
    value: string;
    time: string;
    topPct: number;
  };
}

interface TooltipData {
  point: ChartPointData;
  screenX: number;
  screenY: number;
}

/** The routed detail screen for a single blockchain, keyed by its slug in the URL. */
export default function ChainDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const chain = findChainBySlug(slug);
  const [stats, setStats] = useState<ChainTileStats>(emptyChainStats);
  const [loading, setLoading] = useState({
    tokenPrice: false,
    tx24h: false,
    validators: false,
  });
  const [chartPoints, setChartPoints] = useState<FeeChartPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);

  // Copy-to-clipboard for the "#" prefixed address, with brief inline confirmation.
  const [copied, setCopied] = useState(false);
  // Chart timeframe selector.
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
  const activeIndex = Math.max(0, ranges.indexOf(timeframe));
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

  // Resizable right-hand price/number column.
  const [axisWidth, setAxisWidth] = useState(112);
  const axisDrag = useRef<{ startX: number; startWidth: number } | null>(null);

  const onCutterDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    axisDrag.current = { startX: e.clientX, startWidth: axisWidth };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onCutterMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!axisDrag.current) return;
    const delta = axisDrag.current.startX - e.clientX;
    setAxisWidth(clamp(axisDrag.current.startWidth + delta, 96, 200));
  };
  const onCutterUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    axisDrag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Viewport-based navigation: zoom = narrower index range, pan = shift window.
  // Always render at 1× scale; no CSS transform distortion.
  const canvasRef = useRef<HTMLDivElement>(null);
  const [viewStart, setViewStart] = useState(0);
  const [viewEnd, setViewEnd] = useState<number | null>(null);

  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const drag = useRef<{
    startX: number;
    startViewStart: number;
  } | null>(null);
  const pinch = useRef<{ startDist: number; startStart: number; startEnd: number } | null>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 240 });

  // Tooltip state for interactive points.
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const totalPoints = chartPoints.length;
  const minViewSize = 2;
  const maxViewSize = totalPoints;

  const clampView = (start: number, end: number) => {
    const size = end - start;
    if (size < minViewSize) {
      end = start + minViewSize;
    }
    if (end > totalPoints) {
      end = totalPoints;
      start = Math.max(0, end - minViewSize);
    }
    if (start < 0) {
      start = 0;
      end = Math.min(totalPoints, start + minViewSize);
    }
    return { start, end };
  };

  // Update canvas size when layout changes + wheel zoom.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setCanvasSize({ width, height });
      }
    });
    ro.observe(el);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const currentSize = (viewEnd ?? totalPoints) - viewStart;
      if (currentSize <= minViewSize && e.deltaY < 0) return;
      const pxPerPoint = rect.width / Math.max(1, currentSize);
      const mouseIndex = Math.round((e.clientX - rect.left) / pxPerPoint) + viewStart;
      const factor = Math.exp(-e.deltaY * 0.002);
      const newSize = Math.round(currentSize * factor);
      const clampedSize = Math.max(minViewSize, Math.min(maxViewSize, newSize));
      let newStart = Math.round(mouseIndex - clampedSize / 2);
      let newEnd = newStart + clampedSize;
      const clamped = clampView(newStart, newEnd);
      setViewStart(clamped.start);
      setViewEnd(clamped.end);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      ro.disconnect();
      el.removeEventListener("wheel", onWheel);
    };
  }, [totalPoints, viewStart, viewEnd]);

  const resetView = () => {
    setViewStart(0);
    setViewEnd(null);
  };

  const zoomIn = () => {
    const end = viewEnd ?? totalPoints;
    const size = end - viewStart;
    if (size <= minViewSize) {
      resetView();
      return;
    }
    const newSize = Math.floor(size / 1.3);
    const center = viewStart + size / 2;
    let newStart = Math.round(center - newSize / 2);
    let newEnd = newStart + newSize;
    const clamped = clampView(newStart, newEnd);
    setViewStart(clamped.start);
    setViewEnd(clamped.end);
  };

  const zoomOut = () => {
    const end = viewEnd ?? totalPoints;
    const size = end - viewStart;
    if (size >= maxViewSize) {
      resetView();
      return;
    }
    const newSize = Math.ceil(size * 1.3);
    const center = viewStart + size / 2;
    let newStart = Math.round(center - newSize / 2);
    let newEnd = newStart + newSize;
    const clamped = clampView(newStart, newEnd);
    setViewStart(clamped.start);
    setViewEnd(clamped.end);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      pinch.current = {
        startDist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        startStart: viewStart,
        startEnd: viewEnd ?? totalPoints,
      };
      drag.current = null;
    } else if (pointers.current.size === 1) {
      drag.current = {
        startX: e.clientX,
        startViewStart: viewStart,
      };
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = Array.from(pointers.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const factor = dist / pinch.current.startDist;
      const startSize = pinch.current.startEnd - pinch.current.startStart;
      const newSize = Math.round(startSize / factor);
      const clampedSize = Math.max(minViewSize, Math.min(maxViewSize, newSize));
      const center = pinch.current.startStart + startSize / 2;
      let newStart = Math.round(center - clampedSize / 2);
      let newEnd = newStart + clampedSize;
      const clamped = clampView(newStart, newEnd);
      setViewStart(clamped.start);
      setViewEnd(clamped.end);
    } else if (drag.current) {
      const deltaPx = e.clientX - drag.current.startX;
      const currentSize = (viewEnd ?? totalPoints) - viewStart;
      const rect = canvasRef.current?.getBoundingClientRect();
      const pxPerPoint = (rect?.width ?? canvasSize.width) / Math.max(1, currentSize);
      const deltaIndex = Math.round(-deltaPx / pxPerPoint);
      const newStart = drag.current.startViewStart + deltaIndex;
      const clamped = clampView(newStart, newStart + currentSize);
      setViewStart(clamped.start);
      setViewEnd(clamped.end);
    }
  };

  const endPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) {
      drag.current = null;
    }
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  useEffect(() => {
    resetView();
  }, [timeframe, currentRange, chain?.name]);

  useEffect(() => {
    if (!chain) {
      setChartPoints([]);
      setChartLoading(false);
      setChartError(null);
      return;
    }

    let active = true;
    setChartLoading(true);
    setChartError(null);

    const tf = timeframeToApi[timeframe as UiTimeframe];
    const range = Number(currentRange);
    void fetchFeeChart(tf, chain.name, range)
      .then((data) => {
        if (!active) return;
        setChartPoints(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!active) return;
        setChartPoints([]);
        setChartError("No chart data available.");
      })
      .finally(() => {
        if (!active) return;
        setChartLoading(false);
      });

    return () => {
      active = false;
    };
  }, [chain, timeframe, currentRange]);

  useEffect(() => {
    if (!chain) {
      setStats(emptyChainStats);
      setLoading({ tokenPrice: false, tx24h: false, validators: false });
      return;
    }

    let active = true;
    setStats(emptyChainStats);
    setLoading({ tokenPrice: true, tx24h: true, validators: true });

    void fetchTokenPrice(chain.tokenSymbol)
      .then((data) => {
        if (!active) return;
        setStats((prev) => ({ ...prev, tokenPrice: formatTokenPrice(data) }))
      })
      .catch(() => {
        if (!active) return;
        setStats((prev) => ({ ...prev, tokenPrice: null }));
      })
      .finally(() => {
        if (!active) return;
        setLoading((prev) => ({ ...prev, tokenPrice: false }));
      });

    void fetchTransactions24h(chain.name)
      .then((data) => {
        if (!active) return;
        setStats((prev) => ({ ...prev, tx24h: formatMetric(data) }));
      })
      .catch(() => {
        if (!active) return;
        setStats((prev) => ({ ...prev, tx24h: null }));
      })
      .finally(() => {
        if (!active) return;
        setLoading((prev) => ({ ...prev, tx24h: false }));
      });

    void fetchValidators24h(chain.name)
      .then((data) => {
        if (!active) return;
        setStats((prev) => ({ ...prev, validators: formatMetric(data) }));
      })
      .catch(() => {
        if (!active) return;
        setStats((prev) => ({ ...prev, validators: null }));
      })
      .finally(() => {
        if (!active) return;
        setLoading((prev) => ({ ...prev, validators: false }));
      });

    return () => {
      active = false;
    };
  }, [chain]);

const chartModel = useMemo((): ChartModel | null => {
    if (!chartPoints.length) return null;
    const values = chartPoints
      .map((p) => Number(p.fee_value))
      .filter((v) => Number.isFinite(v));
    if (!values.length) return null;

    const width = Math.max(1, Math.round(canvasSize.width));
    const height = Math.max(1, Math.round(canvasSize.height));
    const padLeft = 0;
    const padRight = 0;
    const padTop = 16;
    const padBottom = 16;
    const innerW = width - padLeft - padRight;
    const innerH = height - padTop - padBottom;

    // Determine visible slice
    const sliceStart = viewStart;
    const sliceEnd = viewEnd ?? values.length;
    const sliceValues = values.slice(sliceStart, sliceEnd);
    const sliceLen = sliceValues.length;

    // Map the visible slice across the live plot width so the line fills the card.
    const toX = (i: number) =>
      padLeft + (sliceLen === 1 ? innerW / 2 : (i / (sliceLen - 1)) * innerW);

    const slicePts = sliceValues.map((v, i) => ({
      x: toX(i),
      y: 0,
      value: v,
      raw: chartPoints[sliceStart + i],
      index: sliceStart + i,
    }));

    // Y-scale based on visible slice only
    const min = Math.min(...sliceValues);
    const max = Math.max(...sliceValues);
    const span = max - min || Math.max(Math.abs(max), 1) * 0.1 || 1;
    const yMin = min - span * 0.1;
    const yMax = max + span * 0.1;
    const ySpan = yMax - yMin || 1;

    const toY = (v: number) => padTop + (1 - (v - yMin) / ySpan) * innerH;
    const ptsWithY = slicePts.map((p) => ({ ...p, y: toY(p.value) }));

    // Line/area for visible slice only
    const line = ptsWithY.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
    const area = `${padLeft},${padTop + innerH} ${line} ${padLeft + innerW},${padTop + innerH}`;
    const last = ptsWithY[ptsWithY.length - 1];

    // Ticks based on visible slice Y-range
    const ticks = Array.from({ length: 4 }, (_, i) => {
      const ratio = i / 3;
      const val = yMax - ratio * ySpan;
      const y = padTop + ratio * innerH;
      return { value: formatFeeValue(val), y, topPct: (y / height) * 100 };
    });

    return {
      width,
      height,
      pts: ptsWithY,
      visiblePts: ptsWithY,
      line,
      area,
      last,
      ticks,
      sliceStart,
      sliceEnd,
      lastLabel: {
        value: formatFeeValue(last.value),
        time: formatChartTime(last.raw.recorded_at, timeframe as UiTimeframe),
        topPct: clamp((last.y / height) * 100, 8, 92),
      },
    };
  }, [canvasSize.height, canvasSize.width, chartPoints, timeframe, viewStart, viewEnd]);

  const handlePointClick = useCallback((e: React.MouseEvent<SVGCircleElement>, point: ChartPointData) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    const svg = canvas?.querySelector("svg");
    if (!canvas || !svg) return;
    const canvasRect = canvas.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    if (!viewBox.width || !viewBox.height) return;
    setTooltip({
      point,
      screenX: svgRect.left - canvasRect.left + (point.x / viewBox.width) * svgRect.width,
      screenY: svgRect.top - canvasRect.top + (point.y / viewBox.height) * svgRect.height,
    });
  }, []);

  const handleCanvasClick = useCallback(() => {
    setTooltip(null);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      if ((e as KeyboardEvent).key === "Escape") setTooltip(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setTooltip]);

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
                  <span className={styles.addressHash} aria-hidden="true">#</span>
                  <span className={styles.addressText}>{shortAddress}</span>
                  <span className={styles.copyHint} aria-hidden="true">
                    {copied ? "✓" : "⧉"}
                  </span>
                </button>
                <p className={styles.status} role="status" aria-live="polite">
                  {copied ? explorerCopy.chainPage.copied : ""}
                </p>
              </div>
            </header>

            <div className={styles.tiles}>
              {explorerCopy.chainPage.tiles.map((tile) => {
                const chainWithStats = { ...chain, stats };
                const value = chainTileValue(chainWithStats, tile.id);
                const statKey =
                  tile.id === "tokens"
                    ? "tokenPrice"
                    : tile.id === "transactions"
                    ? "tx24h"
                    : "validators";
                const isLoading = loading[statKey as keyof typeof loading];
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
                      data-empty={!value ? "true" : undefined}
                      data-loading={isLoading && !value ? "true" : undefined}
                      data-ready={value ? "true" : undefined}
                    >
                      {value ?? "—"}
                    </strong>
                  </button>
                );
              })}
            </div>

            <section className={styles.chart} aria-label={explorerCopy.chainPage.chart.title}>
              <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}>{explorerCopy.chainPage.chart.title}</h2>
              </div>

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

                  <div className={styles.chartControls} role="group" aria-label="Chart zoom">
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
                    <span
                      className={styles.zoomLevel}
                      aria-live="polite"
                      aria-label={`Zoom: ${Math.round(((viewEnd ?? totalPoints) - viewStart) / totalPoints * 100)}% of data visible`}
                    >
                      {Math.round(((viewEnd ?? totalPoints) - viewStart) / totalPoints * 100)}%
                    </span>
                  </div>
                </div>

                <div className={styles.boardBody}>
                  <div
                    className={styles.plotCanvas}
                    ref={canvasRef}
                    role="img"
                    aria-label={
                      chartLoading
                        ? "Loading chart data"
                        : chartError || explorerCopy.chainPage.chart.empty
                    }
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endPointer}
                    onPointerCancel={endPointer}
                    onDoubleClick={resetView}
                    onClick={handleCanvasClick}
                  >
                    <div
                      className={styles.plotStage}
                      key={`${timeframe}-${currentRange}-${chain.name}`}
                      data-dir={slideDir}
                    >
                      <svg
                        className={styles.chartSvg}
                        viewBox={`0 0 ${chartModel?.width ?? Math.max(1, Math.round(canvasSize.width))} ${chartModel?.height ?? Math.max(1, Math.round(canvasSize.height))}`}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id="feeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(133, 72, 213, 0.32)" />
                            <stop offset="50%" stopColor="rgba(133, 72, 213, 0.12)" />
                            <stop offset="100%" stopColor="rgba(133, 72, 213, 0.02)" />
                          </linearGradient>
                          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                          <filter id="pointGlow" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <g className={styles.grid}>
                          {(chartModel?.ticks ?? [0.22, 0.42, 0.62, 0.82].map((ratio) => ({
                            y: ratio * Math.max(1, canvasSize.height),
                          }))).map((tick, idx) => (
                            <line
                              key={idx}
                              x1={0}
                              y1={tick.y}
                              x2={chartModel?.width ?? canvasSize.width}
                              y2={tick.y}
                            />
                          ))}
                        </g>
                        {chartModel && (
                          <>
                            <polygon className={styles.area} points={chartModel.area} />
                            <polyline className={styles.line} points={chartModel.line} />
                            <g className={styles.points} data-chart-points="">
                              {chartModel.visiblePts.map((p) => (
                                <circle
                                  key={p.raw.id ?? p.index}
                                  cx={p.x}
                                  cy={p.y}
                                  r="4"
                                  className={styles.point}
                                  data-active={tooltip?.point.index === p.index ? "true" : undefined}
                                  data-index={p.index}
                                  data-value={p.value.toFixed(8)}
                                  data-time={p.raw.recorded_at}
                                  onClick={(e) => handlePointClick(e, p)}
                                  onMouseEnter={(e) => handlePointClick(e, p)}
                                  onMouseLeave={() => setTooltip(null)}
                                  style={{
                                    filter: "url(#pointGlow)",
                                    transition: "r 0.15s ease, filter 0.15s ease",
                                  }}
                                />
                              ))}
                              <circle
                                className={styles.lastPoint}
                                cx={chartModel.last.x}
                                cy={chartModel.last.y}
                                r="6"
                              />
                            </g>
                          </>
                        )}
                      </svg>
                      {!chartModel && (
                        <p className={styles.chartEmpty}>
                          {chartLoading
                            ? "Loading chart data…"
                            : chartError || explorerCopy.chainPage.chart.empty}
                        </p>
                      )}
                    </div>

                    {tooltip && chartModel && (() => {
                      const plotW = canvasRef.current?.clientWidth ?? chartModel.width;
                      const plotH = canvasRef.current?.clientHeight ?? chartModel.height;
                      const tipW = 220;
                      const tipH = 118;
                      const gap = 16;
                      const openLeft = tooltip.screenX + gap + tipW > plotW - 8;
                      const left = openLeft
                        ? Math.max(8, tooltip.screenX - gap - tipW)
                        : Math.max(8, Math.min(tooltip.screenX + gap, plotW - tipW - 8));
                      const top = Math.max(8, Math.min(tooltip.screenY - tipH / 2, plotH - tipH - 8));
                      const visibleIndex = chartModel.visiblePts.findIndex(
                        (p) => p.index === tooltip.point.index,
                      );
                      const rangeUnit =
                        timeframe === "Hourly" ? "hours" : timeframe === "Weekly" ? "weeks" : "days";
                      return (
                      <div
                        ref={tooltipRef}
                        className={styles.tooltip}
                        data-side={openLeft ? "left" : "right"}
                        style={{ left: `${left}px`, top: `${top}px` }}
                        role="dialog"
                        aria-label="Data point details"
                      >
                        <div className={styles.tooltipArrow} />
                        <div className={styles.tooltipContent}>
                          <div className={styles.tooltipRow}>
                            <span className={styles.tooltipLabel}>Fee (USDT)</span>
                            <span className={styles.tooltipValue}>
                              {formatFeeValue(tooltip.point.value)}
                            </span>
                          </div>
                          <div className={styles.tooltipRow}>
                            <span className={styles.tooltipLabel}>Time</span>
                            <span className={styles.tooltipValue}>
                              {formatChartTime(tooltip.point.raw.recorded_at, timeframe as UiTimeframe)}
                            </span>
                          </div>
                          <div className={styles.tooltipRow}>
                            <span className={styles.tooltipLabel}>Range</span>
                            <span className={styles.tooltipValue}>
                              {currentRange} {rangeUnit}
                            </span>
                          </div>
                          <div className={styles.tooltipRow}>
                            <span className={styles.tooltipLabel}>Point</span>
                            <span className={styles.tooltipValue}>
                              {visibleIndex + 1} of {chartModel.visiblePts.length}
                            </span>
                          </div>
                        </div>
                      </div>
                      );
                    })()}
                  </div>

                  <div
                    className={styles.cutter}
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Resize price scale"
                    aria-valuenow={axisWidth}
                    aria-valuemin={96}
                    aria-valuemax={200}
                    tabIndex={0}
                    onPointerDown={onCutterDown}
                    onPointerMove={onCutterMove}
                    onPointerUp={onCutterUp}
                    onPointerCancel={onCutterUp}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowLeft") {
                        e.preventDefault();
                        setAxisWidth((w) => clamp(w + 8, 96, 200));
                      } else if (e.key === "ArrowRight") {
                        e.preventDefault();
                        setAxisWidth((w) => clamp(w - 8, 96, 200));
                      }
                    }}
                  />

                  <aside className={styles.axis} style={{ width: axisWidth }} aria-label="Value scale">
                    <div className={styles.axisTicks}>
                      {(chartModel?.ticks ?? []).length > 0 ? (
                        chartModel!.ticks.map((tick) => (
                          <span
                            key={tick.topPct}
                            className={styles.axisTick}
                            style={{ top: `${tick.topPct}%` }}
                          >
                            {tick.value}
                          </span>
                        ))
                      ) : (
                        Array.from({ length: 4 }).map((_, i) => (
                          <span key={i} className={styles.axisTickEmpty} aria-hidden="true" />
                        ))
                      )}
                    </div>
                    {chartModel?.lastLabel && (
                      <div
                        className={styles.axisLast}
                        style={{
                          top: `${chartModel.lastLabel.topPct}%`,
                        }}
                      >
                        <span className={styles.axisLastValue}>
                          {chartModel.lastLabel.value}
                        </span>
                        <span className={styles.axisLastTime}>
                          {chartModel.lastLabel.time}
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
