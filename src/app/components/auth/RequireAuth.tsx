import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useExpenseStore } from '../../store/ExpenseContext';

export function RequireAuth() {
  const { user } = useExpenseStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
