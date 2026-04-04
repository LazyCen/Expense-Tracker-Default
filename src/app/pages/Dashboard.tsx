import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, cn } from '../components/ui';
import { ResponsiveContainer, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { Wallet, TrendingUp, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useExpenseStore } from '../store/ExpenseContext';
import { buildCumulativeTrendForMonth, sumExpensesInMonth } from '../store/expenseUtils';

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

export function Dashboard() {
  const navigate = useNavigate();
  const { expenses, monthlyBudgetLimit } = useExpenseStore();
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();

  const totalExpenses = useMemo(() => sumExpensesInMonth(expenses, y, m), [expenses, y, m]);
  const budgetLimit = monthlyBudgetLimit;
  const remaining = Math.max(0, budgetLimit - totalExpenses);
  const percentUsed = budgetLimit > 0 ? (totalExpenses / budgetLimit) * 100 : 0;

  const trendData = useMemo(
    () => buildCumulativeTrendForMonth(expenses, y, m),
    [expenses, y, m],
  );
  
  let statusBadge: React.ReactNode;
  if (percentUsed > 90) {
    statusBadge = <Badge variant="danger" className="ml-2 bg-red-100 text-red-700 hover:bg-red-100">Exceeded</Badge>;
  } else if (percentUsed > 75) {
    statusBadge = <Badge variant="warning" className="ml-2 bg-orange-100 text-orange-700 hover:bg-orange-100">Warning</Badge>;
  } else {
    statusBadge = <Badge variant="success" className="ml-2 bg-green-100 text-green-700 hover:bg-green-100">Safe</Badge>;
  }

  const categoryTotals = useMemo(() => {
    return expenses
      .filter((e) => {
        const d = new Date(e.date + 'T12:00:00');
        return d.getFullYear() === y && d.getMonth() === m;
      })
      .reduce(
        (acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
          return acc;
        },
        {} as Record<string, number>,
      );
  }, [expenses, y, m]);

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <Button size="sm" className="hidden sm:flex items-center gap-2">
           Download Report <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Total Expenses
            </CardTitle>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight text-gray-900">
              ₱{totalExpenses.toLocaleString()}
            </div>
            <p className="mt-1 text-sm text-gray-500 font-medium">
              This Month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Budget Remaining
            </CardTitle>
             <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Wallet className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight text-gray-900">
              ₱{remaining.toLocaleString()}
            </div>
             <p className="mt-1 text-sm text-gray-500 font-medium">
              of ₱{budgetLimit.toLocaleString()} total budget
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Spending Status
            </CardTitle>
            <div className={cn("h-10 w-10 flex items-center justify-center rounded-xl", 
              percentUsed > 90 ? "bg-red-50 text-red-600" : percentUsed > 75 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
            )}>
              {percentUsed > 75 ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-4xl font-bold tracking-tight text-gray-900">
                {percentUsed.toFixed(0)}%
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">used</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden flex-1">
                <div 
                  className={cn("h-full rounded-full transition-all duration-1000 ease-out", 
                    percentUsed > 90 ? "bg-red-500" : percentUsed > 75 ? "bg-orange-500" : "bg-green-500"
                  )}
                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                />
              </div>
               {statusBadge}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        
        {/* Line Chart (Trend) */}
        <Card className="lg:col-span-4 bg-white hover:shadow-md transition-shadow overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Spending Trend</CardTitle>
            <p className="text-sm text-gray-500 font-medium">Daily cumulative expenses</p>
          </CardHeader>
          <CardContent className="flex-1 p-0 pl-2 pb-6 min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }} dx={-10} tickFormatter={(val) => `₱${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', fontWeight: 500, color: '#111827' }} 
                  itemStyle={{ fontWeight: 600, color: '#3B82F6' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 6, strokeWidth: 0, fill: '#3B82F6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart (Breakdown) */}
        <Card className="lg:col-span-3 bg-white hover:shadow-md transition-shadow flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Category Breakdown</CardTitle>
             <p className="text-sm text-gray-500 font-medium">Where your money goes</p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center min-h-[300px]">
            {pieData.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[220px] text-center px-4">
                <p className="text-sm text-gray-500 font-medium">No spending this month yet.</p>
                <p className="text-xs text-gray-400 mt-2 max-w-xs">
                  Add an expense to see your category breakdown.
                </p>
              </div>
            ) : (
              <>
                <div className="h-[200px] w-full relative">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          fontWeight: 500,
                          color: '#111827',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      ₱{pieData.reduce((a, b) => a + b.value, 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 px-2">
                  {pieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                      />
                      <div className="flex-1 text-sm font-medium text-gray-700">{entry.name}</div>
                      <div className="text-sm font-semibold text-gray-900">₱{entry.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses List */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <CardTitle className="text-lg">Recent Expenses</CardTitle>
            <p className="text-sm text-gray-500 font-medium mt-1">Your latest transactions</p>
          </div>
          <Button variant="outline" size="sm" type="button" onClick={() => navigate('/history')}>
            View All
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">Category</th>
                  <th className="px-6 py-4">Note</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right rounded-tr-xl">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500 font-medium">
                      No expenses yet. Add one from the Add Expense page.
                    </td>
                  </tr>
                ) : (
                  expenses.slice(0, 5).map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg">
                          {expense.icon}
                        </div>
                        {expense.category}
                      </td>
                      <td className="px-6 py-4 max-w-[200px] truncate">{expense.note || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(expense.date + 'T12:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        ₱{expense.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
