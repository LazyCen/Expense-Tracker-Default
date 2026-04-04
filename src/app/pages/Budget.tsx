import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Select, Badge, cn } from '../components/ui';
import { Settings, Save, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { useExpenseStore } from '../store/ExpenseContext';
import { parseMonthYearLabel, sumExpensesInMonth } from '../store/expenseUtils';

export function Budget() {
  const { expenses, monthlyBudgetLimit, setMonthlyBudgetLimit } = useExpenseStore();
  const [budget, setBudget] = useState(monthlyBudgetLimit.toString());
  const [month, setMonth] = useState('April 2026');

  useEffect(() => {
    setBudget(monthlyBudgetLimit.toString());
  }, [monthlyBudgetLimit]);

  const parsed = useMemo(() => parseMonthYearLabel(month), [month]);
  const spent = useMemo(() => {
    if (!parsed) return 0;
    return sumExpensesInMonth(expenses, parsed.year, parsed.monthIndex);
  }, [expenses, parsed]);

  const budgetNum = Number(budget) || 0;
  const percentUsed = budgetNum > 0 ? (spent / budgetNum) * 100 : 0;
  const remaining = budgetNum - spent;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(budget);
    if (!Number.isFinite(n) || n <= 0) return;
    setMonthlyBudgetLimit(n);
  };

  return (
    <div className="flex justify-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center md:text-left flex items-center gap-4 border-b border-gray-200 pb-6">
          <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Target className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Budget Settings</h1>
            <p className="text-gray-500 font-medium">Control your monthly financial limits securely.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-gray-100 shadow-xl shadow-gray-200/50">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-xl flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-400" /> Configure Limit
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="month" className="text-sm font-semibold text-gray-700">
                    Month (for spent total)
                  </Label>
                  <Select
                    id="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="h-12 text-base font-medium"
                  >
                    <option value="March 2026">March 2026</option>
                    <option value="April 2026">April 2026</option>
                    <option value="May 2026">May 2026</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-semibold text-gray-700">
                    Monthly Budget Limit (₱)
                  </Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400 font-bold">₱</span>
                    <Input
                      id="budget"
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="h-16 pl-10 text-xl font-bold shadow-sm"
                      placeholder="15000"
                      min={1}
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full shadow-md shadow-blue-500/20 gap-2">
                  <Save className="h-5 w-5" /> Save Limits
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-gray-100 bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Target className="w-48 h-48" />
            </div>

            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-blue-400" /> Current Utilization
              </CardTitle>
              <p className="text-gray-400 font-medium text-sm">
                Preview for {month}. Saved limit applies to your dashboard.
              </p>
            </CardHeader>
            <CardContent className="pt-6 relative z-10 space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-gray-300 font-medium">Spent in selected month</span>
                  <span className="text-3xl font-bold">₱{spent.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <span className="text-gray-300 font-medium">Budget Limit</span>
                  <span className="text-xl font-semibold text-gray-400">
                    ₱{budgetNum.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-700 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold flex items-center gap-2">
                    Utilization
                    {budgetNum <= 0 ? (
                      <Badge
                        variant="warning"
                        className="bg-orange-500/20 text-orange-200 border border-orange-500/50"
                      >
                        Set a limit
                      </Badge>
                    ) : percentUsed > 90 ? (
                      <Badge
                        variant="danger"
                        className="bg-red-500/20 text-red-200 border border-red-500/50"
                      >
                        Critical
                      </Badge>
                    ) : percentUsed > 75 ? (
                      <Badge
                        variant="warning"
                        className="bg-orange-500/20 text-orange-200 border border-orange-500/50"
                      >
                        Warning
                      </Badge>
                    ) : (
                      <Badge
                        variant="success"
                        className="bg-green-500/20 text-green-200 border border-green-500/50"
                      >
                        Healthy
                      </Badge>
                    )}
                  </span>
                  <span className="font-bold">
                    {budgetNum > 0 ? `${Math.min(percentUsed, 100).toFixed(1)}%` : '—'}
                  </span>
                </div>

                <div className="h-4 w-full rounded-full bg-gray-800 border border-gray-700 overflow-hidden relative shadow-inner">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-700 ease-out',
                      budgetNum <= 0
                        ? 'bg-gray-600'
                        : percentUsed > 90
                          ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                          : percentUsed > 75
                            ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]'
                            : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]',
                    )}
                    style={{
                      width: budgetNum > 0 ? `${Math.min(percentUsed, 100)}%` : '0%',
                    }}
                  />
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 flex items-start gap-3 border border-gray-700">
                {budgetNum <= 0 ? (
                  <>
                    <AlertTriangle className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Enter a monthly budget above and save to track utilization on your dashboard.
                    </p>
                  </>
                ) : percentUsed > 90 ? (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300 leading-relaxed">
                      You are very close to exceeding your budget. Consider reducing unnecessary
                      expenses.
                    </p>
                  </>
                ) : percentUsed > 75 ? (
                  <>
                    <AlertTriangle className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300 leading-relaxed">
                      You are nearing your budget limit. Watch your spending closely.
                    </p>
                  </>
                ) : (
                  <>
                    <Target className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300 leading-relaxed">
                      You have about ₱{Math.max(0, remaining).toLocaleString()} left for this month at
                      your entered limit. Adjust the month dropdown to review other periods.
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
