import type { Expense } from './types';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function parseMonthYearLabel(label: string): { year: number; monthIndex: number } | null {
  const parts = label.trim().split(/\s+/);
  if (parts.length !== 2) return null;
  const [monthName, yearStr] = parts;
  const monthIndex = MONTH_NAMES.indexOf(monthName);
  const year = Number(yearStr);
  if (monthIndex < 0 || !Number.isFinite(year)) return null;
  return { year, monthIndex };
}

export function formatMonthYearLabel(year: number, monthIndex: number): string {
  return `${MONTH_NAMES[monthIndex]} ${year}`;
}

export function expenseInMonth(
  e: Expense,
  year: number,
  monthIndex: number,
): boolean {
  const d = new Date(e.date + 'T12:00:00');
  return d.getFullYear() === year && d.getMonth() === monthIndex;
}

export function sumExpensesInMonth(
  expenses: Expense[],
  year: number,
  monthIndex: number,
): number {
  return expenses
    .filter((e) => expenseInMonth(e, year, monthIndex))
    .reduce((s, e) => s + e.amount, 0);
}

export type TrendPoint = { name: string; value: number };

export function buildCumulativeTrendForMonth(
  expenses: Expense[],
  year: number,
  monthIndex: number,
): TrendPoint[] {
  const inMonth = expenses.filter((e) => expenseInMonth(e, year, monthIndex));
  if (inMonth.length === 0) {
    return [{ name: 'No data', value: 0 }];
  }
  const byDay = new Map<string, number>();
  for (const e of inMonth) {
    byDay.set(e.date, (byDay.get(e.date) ?? 0) + e.amount);
  }
  const sortedDates = [...byDay.keys()].sort();
  let cumulative = 0;
  return sortedDates.map((dateStr) => {
    cumulative += byDay.get(dateStr) ?? 0;
    const d = new Date(dateStr + 'T12:00:00');
    const name = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { name, value: cumulative };
  });
}
