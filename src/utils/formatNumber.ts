/** Parse share quantity, keeping up to 2 decimal places. */
export function parseShareSize(value: unknown): number {
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.round(num * 100) / 100;
}

/** Format share quantity with thousands separators and 2 decimal places. */
export function formatQuantity(quantity: number | string): string {
  if (quantity !== 0 && !quantity) return '0.00';

  const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
  if (!Number.isFinite(num)) return '0.00';

  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function decimalPlacesFromValue(num: number, cap = 8): number {
  const str = num.toFixed(cap);
  const trimmed = str.replace(/\.?0+$/, '');
  const dot = trimmed.indexOf('.');
  if (dot === -1) return 0;
  return trimmed.length - dot - 1;
}

/**
 * Format a per-share stock price using the precision returned by the quote API.
 * Penny stocks can show more decimals; large caps stay at 2–4 as needed.
 */
export function formatStockPrice(value: number | string): string {
  if (value !== 0 && !value) return '0.00';

  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (!Number.isFinite(num)) return '0.00';

  const abs = Math.abs(num);
  const fromApi = decimalPlacesFromValue(num);
  const cap = abs >= 1 ? 4 : 8;
  const maxDecimals = Math.min(cap, Math.max(fromApi, abs >= 1 ? 2 : 0));
  const minDecimals = abs >= 1 ? Math.min(2, maxDecimals) : 0;

  return num.toLocaleString('en-US', {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  });
}

/** Format dollar totals (amounts, P&L) with 2 decimal places. */
export function formatMoneyAmount(value: number | string): string {
  if (value !== 0 && !value) return '0.00';

  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (!Number.isFinite(num)) return '0.00';

  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
