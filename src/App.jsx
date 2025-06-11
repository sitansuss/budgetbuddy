// App.jsx

import React from 'react';
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";

// Library
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Supabase and Helpers
import { supabase } from "./supabaseClient";
import {
  getBudgets,
  getExpenses,
  createBudget,
  createExpense,
  deleteExpense,
  waait,
} from "./helpers";

// Layouts, Pages, and Actions
import Main, { mainLoader } from "./layouts/Main";
import { logoutAction } from "./actions/logout";
import { deleteBudget as deleteBudgetAction } from "./actions/deleteBudget";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/Error";
import BudgetPage, { budgetAction, budgetLoader } from "./pages/BudgetPage";
import ExpensesPage, { expensesAction, expensesLoader } from "./pages/ExpensesPage";
import AuthPage, { authAction } from "./pages/AuthPage";

// Dashboard Loader & Action
export async function dashboardLoader() {
  const budgets = await getBudgets();
  const expenses = await getExpenses();
  const { data: { session } } = await supabase.auth.getSession();
  const userName = session?.user?.user_metadata?.userName;
  return { userName, budgets, expenses };
}

export async function dashboardAction({ request }) {
  await waait();
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "newUser") {
    try {
      const { error } = await supabase.auth.updateUser({ data: { userName: values.userName } });
      if (error) throw error;
      return toast.success(`Welcome, ${values.userName}`);
    } catch (e) { throw new Error("There was a problem saving your name."); }
  }
  if (_action === "createBudget") {
    try {
      const budgets = await getBudgets();
      await createBudget({
        name: values.newBudget,
        amount: values.newBudgetAmount,
        existingBudgetsCount: budgets.length,
      });
      return toast.success("Budget created!");
    } catch (e) { throw new Error("There was a problem creating your budget."); }
  }
  if (_action === "createExpense") {
    try {
      await createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
      });
      return toast.success(`Expense ${values.newExpense} created!`);
    } catch (e) { throw new Error("There was a problem creating your expense."); }
  }
  if (_action === "deleteExpense") {
    try {
      await deleteExpense(values.expenseId);
      return toast.success("Expense deleted!");
    } catch (e) { throw new Error("There was a problem deleting your expense."); }
  }
  return null;
}

// Auth Loaders
const protectedLoader = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return redirect("/login");
  return null;
};

const publicLoader = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) return redirect("/");
  return null;
};

// Router Definition
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    loader: mainLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: async () => {
          // FIX: Check the result of the protectedLoader
          const protection = await protectedLoader();
          if (protection) {
            return protection; // Return the redirect immediately if it exists
          }
          // Otherwise, continue to the normal loader
          return dashboardLoader();
        },
        action: dashboardAction,
        errorElement: <ErrorPage />,
      },
      {
        path: "login",
        element: <AuthPage />,
        action: authAction,
        loader: publicLoader,
      },
      {
        path: "budget/:id",
        element: <BudgetPage />,
        loader: async ({ params }) => {
          // FIX: Apply the same protection pattern here
          const protection = await protectedLoader();
          if (protection) return protection;
          return budgetLoader({ params });
        },
        action: budgetAction,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "delete",
            action: deleteBudgetAction,
          },
        ],
      },
      {
        path: "expenses",
        element: <ExpensesPage />,
        loader: async () => {
          // FIX: And here too
          const protection = await protectedLoader();
          if (protection) return protection;
          return expensesLoader();
        },
        action: expensesAction,
        errorElement: <ErrorPage />,
      },
      {
        path: "logout",
        action: async () => {
          await supabase.auth.signOut();
          return logoutAction();
        },
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;