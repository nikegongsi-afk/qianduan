const US_TIMEZONE = 'America/New_York';

/** YYYY-MM-DD only */
const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
/** UTC midnight ISO often produced from date-only inputs */
const UTC_MIDNIGHT_RE = /^(\d{4}-\d{2}-\d{2})T00:00:00(?:\.\d+)?Z$/;

/**
 * Keep calendar day stable across US Eastern display.
 * Noon EDT = 16:00Z; noon EST = 17:00Z — 16:00Z is still the same Eastern calendar day either way.
 */
export function dateInputToApiIso(dateInput: string | Date | null | undefined): string | null {
  const value = String(dateInput || '').trim();
  if (!value) return null;

  if (DATE_ONLY_RE.test(value)) {
    return `${value}T16:00:00.000Z`;
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  const date = parseUsDate(value);
  if (!date) return null;
  return date.toISOString();
}

export function parseUsDate(dateString: string | Date | null | undefined): Date | null {
  if (!dateString) return null;
  if (dateString instanceof Date) {
    return Number.isNaN(dateString.getTime()) ? null : dateString;
  }

  const value = String(dateString).trim();
  if (!value) return null;

  // Date-only / UTC-midnight: treat as a calendar day, not a timezone shift.
  const midnightMatch = value.match(UTC_MIDNIGHT_RE);
  if (DATE_ONLY_RE.test(value) || midnightMatch) {
    const day = midnightMatch ? midnightMatch[1] : value;
    const [y, m, d] = day.split('-').map(Number);
    // Noon UTC keeps the same calendar day in America/New_York year-round.
    return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  }

  let normalized = value;

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(value)) {
    normalized = value.replace(' ', 'T');
    if (!/[zZ]|[+-]\d{2}:\d{2}$|[+-]\d{4}$/.test(normalized)) {
      normalized += 'Z';
    }
  } else if (
    value.includes('T') &&
    !/[zZ]|[+-]\d{2}:\d{2}$|[+-]\d{4}$/.test(value)
  ) {
    normalized = `${value}Z`;
  }

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** US Eastern date only, e.g. May 27, 2026 */
export function formatUSDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';

  const raw = String(dateString).trim();
  const midnightMatch = raw.match(UTC_MIDNIGHT_RE);
  if (DATE_ONLY_RE.test(raw) || midnightMatch) {
    const day = midnightMatch ? midnightMatch[1] : raw;
    const [y, m, d] = day.split('-').map(Number);
    // Format from local calendar parts so the selected day never shifts.
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  const date = parseUsDate(dateString);
  if (!date) return String(dateString);

  return date.toLocaleDateString('en-US', {
    timeZone: US_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Alias for date-only US display (no time/minutes). */
export const formatUSTime = formatUSDate;

/** 表单 datetime-local 控件用，格式 YYYY-MM-DDTHH:mm */
export function formatDateTimeLocalInput(dateString: string | Date | null | undefined): string {
  const date = parseUsDate(dateString);
  if (!date) return '';

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: US_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value || '';

  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

/** 提交 API 时使用 ISO 时间 */
export function toApiDateTime(dateString: string | Date | null | undefined): string | null {
  return dateInputToApiIso(dateString);
}

/** Format timestamp fields on a row for table display. */
export function formatDatesForDisplay<T extends Record<string, unknown>>(
  row: T,
  fields: string[]
): T {
  const next = { ...row } as T & Record<string, unknown>;

  for (const field of fields) {
    const value = next[field];
    if (value != null && value !== '') {
      next[field] = formatUSDate(String(value));
    }
  }

  return next as T;
}
