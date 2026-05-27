export interface ParsedStockPick {
  symbol: string;
  price: string;
}

export interface ParsedTradingFocus {
  notices: string[];
  purchaseDate: string | null;
  stocks: ParsedStockPick[];
  others: string[];
}

export function normalizeTradingFocus(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item ?? '').trim()).filter(Boolean);
  }

  if (typeof raw === 'string') {
    const text = raw.trim();
    if (!text) return [];

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item ?? '').trim()).filter(Boolean);
      }
    } catch {
      return [text];
    }
  }

  return [];
}

export function parseTradingFocus(items: string[]): ParsedTradingFocus {
  const result: ParsedTradingFocus = {
    notices: [],
    purchaseDate: null,
    stocks: [],
    others: [],
  };

  let pendingSymbol: string | null = null;

  for (const text of items) {
    const value = text.trim();
    if (!value) continue;

    if (/购买须知|purchase notice/i.test(value)) {
      const notice = value
        .replace(/^[\s✅⏰🔔]+/u, '')
        .replace(/购买须知[：:]?\s*/i, '')
        .replace(/purchase notice[：:]?\s*/i, '')
        .trim();
      result.notices.push(notice || value);
      continue;
    }

    const dateMatch =
      value.match(/(?:购买日期|purchase date)[：:]\s*(.+)$/i) ||
      value.match(/^⏰\s*(.+)$/u);
    if (dateMatch) {
      result.purchaseDate = dateMatch[1].replace(/^(?:购买日期|purchase date)[：:]\s*/i, '').trim();
      continue;
    }

    const symbolMatch =
      value.match(/(?:股票昵称|stock nickname|symbol|ticker)[：:]\s*(.+)$/i) ||
      value.match(/^✅\s*([A-Z0-9.]{1,10})$/i);
    if (symbolMatch) {
      pendingSymbol = symbolMatch[1].trim();
      continue;
    }

    const priceMatch = value.match(/(?:购买价格|purchase price|entry price|price)[：:]\s*(.+)$/i);
    if (priceMatch) {
      if (pendingSymbol) {
        result.stocks.push({
          symbol: pendingSymbol,
          price: priceMatch[1].trim(),
        });
        pendingSymbol = null;
      } else {
        result.others.push(value);
      }
      continue;
    }

    if (pendingSymbol) {
      result.stocks.push({
        symbol: pendingSymbol,
        price: value.replace(/^[\s✅⏰🔔]+/u, '').trim(),
      });
      pendingSymbol = null;
      continue;
    }

    result.others.push(value);
  }

  if (pendingSymbol) {
    result.stocks.push({ symbol: pendingSymbol, price: '-' });
  }

  return result;
}
