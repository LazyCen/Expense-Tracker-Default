import type { Expense, UserAccount, UserStoredData } from './types';

const PREFIX = 'smart-expense:v1';

const keys = {
  users: `${PREFIX}:users`,
  session: `${PREFIX}:session`,
  userData: (userId: string) => `${PREFIX}:data:${userId}`,
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadUsers(): UserAccount[] {
  return readJson<UserAccount[]>(keys.users, []);
}

export function saveUsers(users: UserAccount[]): void {
  localStorage.setItem(keys.users, JSON.stringify(users));
}

export function loadSessionUserId(): string | null {
  const s = readJson<{ userId: string } | null>(keys.session, null);
  return s?.userId ?? null;
}

export function persistSessionUserId(userId: string | null): void {
  if (userId) localStorage.setItem(keys.session, JSON.stringify({ userId }));
  else localStorage.removeItem(keys.session);
}

export function loadUserData(userId: string): UserStoredData {
  const empty: UserStoredData = { expenses: [], monthlyBudgetLimit: 15000 };
  const data = readJson<UserStoredData | null>(keys.userData(userId), null);
  if (!data) return empty;
  return {
    expenses: Array.isArray(data.expenses) ? data.expenses : [],
    monthlyBudgetLimit:
      typeof data.monthlyBudgetLimit === 'number' ? data.monthlyBudgetLimit : 0,
  };
}

export function persistUserData(userId: string, data: UserStoredData): void {
  localStorage.setItem(keys.userData(userId), JSON.stringify(data));
}

export function createNewUserData(): UserStoredData {
  return { expenses: [], monthlyBudgetLimit: 15000 };
}

export function nextExpenseId(expenses: Expense[]): number {
  const max = expenses.reduce((m, e) => Math.max(m, e.id), 0);
  return max + 1;
}
