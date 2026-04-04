import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Select } from '../components/ui';
import { PlusCircle, Wallet, Calendar, FileText } from 'lucide-react';
import { useExpenseStore } from '../store/ExpenseContext';

export function AddExpense() {
  const navigate = useNavigate();
  const { addExpense } = useExpenseStore();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0) return;
    addExpense({
      amount: num,
      category,
      date,
      note: note.trim(),
    });
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
    navigate('/');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="w-full max-w-lg bg-white shadow-xl shadow-gray-200/50 border-gray-100">
        <CardHeader className="text-center pb-8 border-b border-gray-100">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm shadow-blue-100">
            <PlusCircle className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">Add New Expense</CardTitle>
          <p className="mt-2 text-sm text-gray-500 font-medium">Record a new transaction instantly.</p>
        </CardHeader>
        
        <CardContent className="p-8 pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Amount Field - Prominent */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-700 font-semibold">Amount</Label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-xl font-bold text-gray-400">₱</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="h-16 pl-10 text-2xl font-bold placeholder:text-gray-300 transition-all focus:ring-4 focus:ring-blue-500/20"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Category Field */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700 font-semibold flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-gray-400" /> Category
                </Label>
                <div className="relative">
                  <Select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="h-12 bg-gray-50/50"
                  >
                    <option value="" disabled>Select category</option>
                    <option value="Food">🍔 Food</option>
                    <option value="Transport">🚌 Transport</option>
                    <option value="School">📚 School</option>
                    <option value="Others">✨ Others</option>
                  </Select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Date Field */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-gray-700 font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" /> Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="h-12 bg-gray-50/50 block w-full text-gray-700"
                />
              </div>
            </div>

            {/* Note Field */}
            <div className="space-y-2">
              <Label htmlFor="note" className="text-gray-700 font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" /> Note (Optional)
              </Label>
              <textarea
                id="note"
                placeholder="What was this expense for?"
                className="flex w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-shadow min-h-[100px] resize-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full text-base font-semibold shadow-md shadow-blue-500/20" size="lg">
                Save Expense
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
