const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatPrice(cents: number): string {
  return priceFormatter.format(cents / 100);
}

export function parseDollars(input: string): number | null {
  const text = input.trim().replace(',', '.');
  if (text === '') {
    return null;
  }

  const dollars = Number(text);
  if (!Number.isFinite(dollars) || dollars < 0) {
    return null;
  }

  return Math.round(dollars * 100);
}

export function pluralize(count: number, forms: [string, string, string]): string {
  const lastTwo = Math.abs(count) % 100;
  const last = lastTwo % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return forms[2];
  }
  if (last === 1) {
    return forms[0];
  }
  if (last >= 2 && last <= 4) {
    return forms[1];
  }
  return forms[2];
}
