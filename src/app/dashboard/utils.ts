export function parseNow(nowIso?: string) {
  return nowIso ? new Date(nowIso) : new Date();
}

export function nextMonthlyDue(lastPayment: Date) {
  const d = new Date(lastPayment);
  d.setMonth(d.getMonth() + 1);
  return d;
}

// Returns the number of days in a given month
function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
// Return a date with the given year, month, and day of month,
function dateWithDOM(y: number, m: number, d: number) {
  return new Date(y, m, Math.min(d, daysInMonth(y, m)));
}
export function getCycleBoundsFromDueDay(dueDay: number, now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();
  const currentDue = dateWithDOM(y, m, dueDay);
  if (now >= currentDue) {
    // In or after current cycle start; next due is next month’s dueDay
    return {
      cycleStart: currentDue,
      nextDue: dateWithDOM(y, m + 1, dueDay),
    };
  }
  // Before this month’s due day; current cycle started last month’s dueDay
  return {
    cycleStart: dateWithDOM(y, m - 1, dueDay),
    nextDue: currentDue,
  };
}
