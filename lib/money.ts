// Amounts are stored in minor units (2500.50 -> 250050).
const MAX_MINOR = 2_000_000_000;

export function formatMoney(minor: number | bigint, currency: string) {
  return new Intl.NumberFormat("en", { style: "currency", currency }).format(
    Number(minor) / 100,
  );
}

export function parseMoneyToMinor(input: string): number | null {
  const cleaned = input.trim().replace(/,/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const minor = Math.round(Number(cleaned) * 100);
  if (minor <= 0 || minor > MAX_MINOR) return null;
  return minor;
}
