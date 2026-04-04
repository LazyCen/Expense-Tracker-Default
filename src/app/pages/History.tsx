import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select } from '../components/ui';
import { useExpenseStore } from '../store/ExpenseContext';
import { Search, Filter, Trash2, Download, History as HistoryIcon, ArrowUpDown } from 'lucide-react';

export function History() {
  const { expenses, deleteExpense } = useExpenseStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const handleDelete = (id: number) => {
    deleteExpense(id);
  };

  const filteredExpenses = useMemo(
    () =>
      expenses
        .filter(
          (e) =>
            (e.note.toLowerCase().includes(search.toLowerCase()) ||
              e.category.toLowerCase().includes(search.toLowerCase())) &&
            (categoryFilter === '' || e.category === categoryFilter),
        )
        .sort((a, b) => {
          const dateA = new Date(a.date + 'T12:00:00').getTime();
          const dateB = new Date(b.date + 'T12:00:00').getTime();
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        }),
    [expenses, search, categoryFilter, sortOrder],
  );

  const handleExportCsv = () => {
    const header = 'Date,Category,Note,Amount';
    const rows = filteredExpenses.map((e) =>
      [
        e.date,
        e.category,
        `"${(e.note || '').replace(/"/g, '""')}"`,
        e.amount.toFixed(2),
      ].join(','),
    );
    const blob = new Blob([[header, ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <HistoryIcon className="h-8 w-8 text-blue-600 bg-blue-50 p-1.5 rounded-xl shadow-sm" />
            Transaction History
          </h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">View, search, and manage all your past expenses.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="gap-2 self-start sm:self-auto shadow-sm"
          onClick={handleExportCsv}
          disabled={filteredExpenses.length === 0}
        >
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="bg-white shadow-xl shadow-gray-200/40 border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex flex-1 gap-4 w-full">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notes or categories..."
                className="pl-9 h-10 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative min-w-[160px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Select
                className="pl-9 h-10 shadow-sm font-medium text-gray-700"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="School">School</option>
                <option value="Others">Others</option>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium whitespace-nowrap">
            Showing {filteredExpenses.length} entries
          </div>
        </div>

        {/* Data Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-white sticky top-0 shadow-sm z-10">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900 w-[140px] border-b border-gray-100">
                    <button 
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                      onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    >
                      Date <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </button>
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 w-[200px] border-b border-gray-100">Category</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 border-b border-gray-100 min-w-[200px]">Note</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-right w-[150px] border-b border-gray-100">Amount</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-center w-[100px] border-b border-gray-100">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Search className="h-10 w-10 text-gray-300" />
                        <p className="font-medium">No expenses found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                        {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-base shadow-sm">
                            {expense.icon}
                          </span>
                          {expense.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-[300px] truncate text-gray-600">{expense.note || <span className="text-gray-400 italic">No note provided</span>}</td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900 text-base">
                        ₱{expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none focus:ring-2 focus:ring-red-500/20"
                          title="Delete expense"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
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
