import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';
import type { Expense, UserAccount, UserStoredData } from './types';
import {
  createNewUserData,
  loadSessionUserId,
  loadUserData,
  loadUsers,
  nextExpenseId,
  persistSessionUserId,
  persistUserData,
  saveUsers,
} from './localStorageStore';

const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍔',
  Transport: '🚌',
  School: '📚',
  Others: '✨',
};

type ExpenseContextValue = {
  user: UserAccount | null;
  expenses: Expense[];
  monthlyBudgetLimit: number;
  login: (email: string, password: string) => { ok: boolean; message?: string };
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => { ok: boolean; message?: string };
  logout: () => void;
  addExpense: (input: Omit<Expense, 'id' | 'icon'>) => void;
  deleteExpense: (id: number) => void;
  setMonthlyBudgetLimit: (limit: number) => void;
  refreshFromStorage: () => void;
};

const ExpenseContext = createContext<ExpenseContextValue | null>(null);

function findUserByEmail(email: string): UserAccount | undefined {
  const normalized = email.trim().toLowerCase();
  return loadUsers().find((u) => u.email.toLowerCase() === normalized);
}

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [data, setData] = useState<UserStoredData | null>(null);

  const refreshFromStorage = useCallback(() => {
    const sessionId = loadSessionUserId();
    if (!sessionId) {
      setUser(null);
      setData(null);
      return;
    }
    const accounts = loadUsers();
    const account = accounts.find((u) => u.id === sessionId) ?? null;
    if (!account) {
      persistSessionUserId(null);
      setUser(null);
      setData(null);
      return;
    }
    setUser(account);
    setData(loadUserData(account.id));
  }, []);

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  const persistData = useCallback(
    (accountId: string, next: UserStoredData) => {
      persistUserData(accountId, next);
      setData(next);
    },
    [],
  );

  const login = useCallback((email: string, password: string) => {
    const u = findUserByEmail(email);
    if (!u) return { ok: false, message: 'No account found for this email.' };
    if (u.password !== password) return { ok: false, message: 'Incorrect password.' };
    persistSessionUserId(u.id);
    setUser(u);
    setData(loadUserData(u.id));
    return { ok: true };
  }, []);

  const signUp = useCallback(
    (email: string, password: string, displayName: string) => {
      const trimmed = email.trim().toLowerCase();
      if (!trimmed) return { ok: false, message: 'Email is required.' };
      if (findUserByEmail(trimmed))
        return { ok: false, message: 'An account with this email already exists.' };
      if (password.length < 4)
        return { ok: false, message: 'Password must be at least 4 characters.' };

      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `u-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      const account: UserAccount = {
        id,
        email: trimmed,
        displayName: displayName.trim() || trimmed.split('@')[0] || 'User',
        password,
      };

      const users = loadUsers();
      users.push(account);
      saveUsers(users);

      const initial = createNewUserData();
      persistUserData(id, initial);
      persistSessionUserId(id);
      setUser(account);
      setData(initial);
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(() => {
    persistSessionUserId(null);
    setUser(null);
    setData(null);
  }, []);

  const addExpense = useCallback(
    (input: Omit<Expense, 'id' | 'icon'>) => {
      if (!user || !data) return;
      const icon = CATEGORY_ICONS[input.category] ?? '✨';
      const expense: Expense = {
        ...input,
        id: nextExpenseId(data.expenses),
        icon,
      };
      const next: UserStoredData = {
        ...data,
        expenses: [expense, ...data.expenses],
      };
      persistData(user.id, next);
      toast.success('Expense saved');
    },
    [user, data, persistData],
  );

  const deleteExpense = useCallback(
    (id: number) => {
      if (!user || !data) return;
      const next: UserStoredData = {
        ...data,
        expenses: data.expenses.filter((e) => e.id !== id),
      };
      persistData(user.id, next);
      toast.success('Expense removed');
    },
    [user, data, persistData],
  );

  const setMonthlyBudgetLimit = useCallback(
    (limit: number) => {
      if (!user || !data) return;
      const safe = Math.max(0, limit);
      const next: UserStoredData = { ...data, monthlyBudgetLimit: safe };
      persistData(user.id, next);
      toast.success('Budget updated');
    },
    [user, data, persistData],
  );

  const value = useMemo<ExpenseContextValue>(
    () => ({
      user,
      expenses: data?.expenses ?? [],
      monthlyBudgetLimit: data?.monthlyBudgetLimit ?? 15000,
      login,
      signUp,
      logout,
      addExpense,
      deleteExpense,
      setMonthlyBudgetLimit,
      refreshFromStorage,
    }),
    [
      user,
      data,
      login,
      signUp,
      logout,
      addExpense,
      deleteExpense,
      setMonthlyBudgetLimit,
      refreshFromStorage,
    ],
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export function useExpenseStore(): ExpenseContextValue {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenseStore must be used within ExpenseProvider');
  return ctx;
}
