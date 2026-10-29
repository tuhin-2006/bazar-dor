const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Converts every ASCII digit in a string/number to Bengali digits. */
export function toBanglaDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => BANGLA_DIGITS[Number(digit)]);
}

/**
 * Formats a number with Indian-style grouping and Bengali digits.
 * 1850 -> ১,৮৫০ ; 2.1 -> ২.১
 */
export function formatBanglaNumber(
  value: number,
  options: { maximumFractionDigits?: number; minimumFractionDigits?: number } = {},
): string {
  const { maximumFractionDigits = 0, minimumFractionDigits = 0 } = options;

  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value);

  return toBanglaDigits(formatted);
}

export function formatPrice(value: number): string {
  return formatBanglaNumber(value, { maximumFractionDigits: 0 });
}

export function formatPercent(value: number): string {
  return formatBanglaNumber(Math.abs(value), {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  });
}

export function formatBanglaDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatShortBanglaDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

const UNIT_LABELS: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

const UNIT_SHORT: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

export function unitLabel(unit: string): string {
  return UNIT_LABELS[unit] ?? `প্রতি ${unit}`;
}

export function unitShort(unit: string): string {
  return UNIT_SHORT[unit] ?? unit;
}

export function changePrefix(dir: "up" | "down" | "flat"): string {
  if (dir === "up") return "▲";
  if (dir === "down") return "▼";
  return "—";
}

export function changeText(pct: number, dir: "up" | "down" | "flat"): string {
  return `${changePrefix(dir)} ${formatPercent(pct)}%`;
}
