import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { LayoutDashboard, PlusCircle, PieChart, History, LogOut, Wallet } from 'lucide-react';
import { cn } from '../ui';
import { useExpenseStore } from '../../store/ExpenseContext';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useExpenseStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/add', label: 'Add Expense', icon: PlusCircle },
    { to: '/budget', label: 'Budget', icon: PieChart },
    { to: '/history', label: 'History', icon: History },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Smart Expense
            </span>
          </div>

          <nav className="hidden md:flex flex-1 justify-center gap-1 px-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium leading-none text-gray-900">
                  {user?.displayName ?? 'Account'}
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate max-w-[140px]" title={user?.email}>
                  {user?.email ?? ''}
                </p>
              </div>
              <div
                className="h-10 w-10 rounded-full bg-gray-200 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600"
                aria-hidden
              >
                {user ? initials(user.displayName) : ''}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center rounded-xl p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
