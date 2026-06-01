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
