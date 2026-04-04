export type Expense = {
  id: number;
  amount: number;
  category: string;
  date: string;
  note: string;
  icon: string;
};

export type UserAccount = {
  id: string;
  email: string;
  displayName: string;
  password: string;
};

export type UserStoredData = {
  expenses: Expense[];
  monthlyBudgetLimit: number;
};
