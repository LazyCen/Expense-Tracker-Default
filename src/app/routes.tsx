import { createBrowserRouter } from "react-router";
import { RequireAuth } from "./components/auth/RequireAuth";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { AddExpense } from "./pages/AddExpense";
import { Budget } from "./pages/Budget";
import { History } from "./pages/History";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: RequireAuth,
    children: [
      {
        Component: DashboardLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: "add", Component: AddExpense },
          { path: "budget", Component: Budget },
          { path: "history", Component: History },
        ],
      },
    ],
  },
]);
