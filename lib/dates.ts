// Offset (in ms) between UTC and the given time zone at a specific moment.
function offsetMs(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

// Midnight of the given calendar day in the time zone, as a UTC Date.
function zonedMidnightUtc(y: number, m: number, d: number, timeZone: string) {
  const guess = Date.UTC(y, m - 1, d);
  const first = offsetMs(new Date(guess), timeZone);
  let utc = guess - first;
  const second = offsetMs(new Date(utc), timeZone);
  if (second !== first) utc = guess - second; // daylight-saving boundary
  return new Date(utc);
}

// Calendar year, month and day of a moment as seen in the time zone.
function ymdInZone(date: Date, timeZone: string) {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .split("-")
    .map(Number);
  return { y, m, d };
}

// Start of the current month in the business's time zone, as a UTC Date.
export function startOfMonth(timeZone: string, date = new Date()) {
  const { y, m } = ymdInZone(date, timeZone);
  return zonedMidnightUtc(y, m, 1, timeZone);
}

// Start of today in the business's time zone, as a UTC Date.
export function startOfToday(timeZone: string, date = new Date()) {
  const { y, m, d } = ymdInZone(date, timeZone);
  return zonedMidnightUtc(y, m, d, timeZone);
}

// "October 2026", in the business's time zone.
export function monthLabel(timeZone: string, date = new Date()) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone,
  }).format(date);
}

// Today's date as YYYY-MM-DD, in the business's time zone.
export function todayIso(timeZone: string, date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(date);
}