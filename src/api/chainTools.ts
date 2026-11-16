export interface TokenPriceResponse {
  token: string;
  coin_id: string;
  price_usdt: number;
  source: string;
  fetched_at: string;
  cached?: boolean;
}

export interface ChainMetricResponse {
  blockchain: string;
  metric: string;
  value: number | string | null;
  unit: string | null;
  source: string;
  fetched_at: string;
  details?: Record<string, unknown> | null;
  cached?: boolean;
}

export interface FeeChartPoint {
  id: number;
  blockchain_name: string;
  time_unit: "hour" | "day" | "week";
  fee_value: string | number;
  recorded_at: string;
}

export type ChartTimeframe = "hour" | "day" | "week";

async function fetchJson<T>(url: string, timeoutMs = 12000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchTokenPrice(token: string): Promise<TokenPriceResponse> {
  const params = new URLSearchParams({ token });
  return fetchJson<TokenPriceResponse>(`/charts/tools/token-price?${params.toString()}`);
}

export async function fetchTransactions24h(blockchain: string): Promise<ChainMetricResponse> {
  const params = new URLSearchParams({ blockchain });
  return fetchJson<ChainMetricResponse>(`/charts/tools/transactions-24h?${params.toString()}`);
}

export async function fetchValidators24h(blockchain: string): Promise<ChainMetricResponse> {
  const params = new URLSearchParams({ blockchain });
  return fetchJson<ChainMetricResponse>(`/charts/tools/validators-24h?${params.toString()}`);
}

export async function fetchFeeChart(
  timeframe: ChartTimeframe,
  blockchain: string,
  range: number,
): Promise<FeeChartPoint[]> {
  const params = new URLSearchParams({ blockchain, range: String(range) });
  return fetchJson<FeeChartPoint[]>(`/charts/${timeframe}?${params.toString()}`);
}

/** Format a fee value as USDT (already converted by the backend). */
export function formatUsdtFee(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "—";
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

/** Fetch the latest fee point for a chain (backend already converts to USDT). */
export async function fetchLatestFee(blockchain: string): Promise<number | null> {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      // Hourly charts only allow 24, 48, or 72 points. range=1 is rejected
      // with 422, so take the newest point from the smallest allowed range.
      const points = await fetchFeeChart("hour", blockchain, 24);
      if (!points.length) return null;
      const last = points[points.length - 1];
      const value = Number(last.fee_value);
      return Number.isFinite(value) ? value : null;
    } catch (err) {
      lastError = err;
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }
  console.warn(`fetchLatestFee(${blockchain}) failed after retries:`, lastError);
  return null;
}
