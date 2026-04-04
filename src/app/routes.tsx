// Change the import to include createHashRouter
import { createHashRouter } from "react-router"; 
import { RequireAuth } from "./components/auth/RequireAuth";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { AddExpense } from "./pages/AddExpense";
import { Budget } from "./pages/Budget";
import { History } from "./pages/History";

// Change createBrowserRouter to createHashRouter
export const router = createHashRouter([
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