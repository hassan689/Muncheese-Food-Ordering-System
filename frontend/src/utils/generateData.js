// Generate Dummy data for making Admin Graph

/* ---------- helper: generate 12 months x 30 days sample data ---------- */
export function generateYearDailyData({ year = new Date().getFullYear(), daysPerMonth = 30 } = {}) {
  const result = [];
  const monthBase = [1.0, 0.9, 1.1, 1.15, 1.25, 1.35, 1.3, 1.2, 1.15, 1.05, 0.95, 1.1];

  let idx = 0;
  for (let m = 0; m < 12; m++) {
    for (let d = 1; d <= daysPerMonth; d++) {
      const dayOfYear = idx++;
      const baseSales = 3000 + Math.sin(dayOfYear) * 700 + monthBase[m] * 400; // 3000 + (-1 <-> 1) * 700 (Sin Curve) + (0.9 <-> 1.35) * 400 (Monthly Increase or Decrease in Sales)
      const sales = Math.round(Math.max(0, baseSales + (Math.random() - 0.5) * 600)); // adds random noise ±300 to baseSales but never let it go below 0
      const date = new Date(year, m, d).toISOString().slice(0, 10); // converts it to "YYYY-MM-DD" format
      result.push({ date, sales });
    }
  }
  return result;
}

/* ---------- aggregation helpers ---------- */
export function aggregateMonthly(data, daysPerMonth = 30) {
  // assume ordered daily data starting month 0
  const months = [];
  for (let m = 0; m < 12; m++) {
    const start = m * daysPerMonth;
    const slice = data.slice(start, start + daysPerMonth);
    if (slice.length === 0) continue;
    const sales = Math.round(slice.reduce((s, x) => s + x.sales, 0) / slice.length); // average
    const label = new Date(slice[0].date).toLocaleString(undefined, { month: "short" });
    months.push({ label, sales });
  }
  return months;
}

export function aggregateWeekly(data, daysPerWeek = 7) {
  const weeks = [];
  for (let i = 0; i < data.length; i += daysPerWeek) {
    const slice = data.slice(i, i + daysPerWeek);
    if (slice.length === 0) continue;
    const label = slice[0].date; // start date
    const sales = Math.round(slice.reduce((s, x) => s + x.sales, 0) / slice.length);
    weeks.push({ label, sales });
  }
  return weeks;
}
