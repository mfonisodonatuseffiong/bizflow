// Simple UTC month boundaries. Business timezones can refine this later.
export function startOfMonthUtc(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function monthLabel(date = new Date()) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function todayIso(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
