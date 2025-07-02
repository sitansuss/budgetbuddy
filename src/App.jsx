// App.jsx

import React, { useState, useEffect } from 'react';
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
  calculateSpentByBudget,
} from "./helpers";

// Layouts, Pages, and Actions
import Main, { mainLoader } from "./layouts/Main";
import { logoutAction } from "./actions/logout";
import { deleteBudget as deleteBudgetAction } from "./actions/deleteBudget";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/Error";
import BudgetPage, { budgetAction, budgetLoader } from "./pages/BudgetPage";
import ExpensesPage, { expensesAction, expensesLoader } from "./pages/ExpensesPage";
import LoginPage, { loginAction } from "./pages/LoginPage";
import SignupPage, { signupAction } from "./pages/SignupPage";

// =============================================================
// LOADER & ACTION DEFINITIONS
// =============================================================

// Auth Loaders
const protectedLoader = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
  return null;
};

const publicLoader = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    return redirect("/");
  }
  return null;
};

// Dashboard Loader
export async function dashboardLoader() {
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.userName;

  const budgetsRaw = await getBudgets();
  const expensesRaw = await getExpenses();

  const budgets = budgetsRaw.map(budget => {
    const spent = calculateSpentByBudget(budget.id, expensesRaw);
    return { ...budget, spent };
  });

  const expenses = expensesRaw
    .map(expense => {
      const budget = budgets.find(b => b.id === expense.budget_id);
      return { ...expense, budget };
    })
    .filter(expense => expense.budget);

  return { userName, budgets, expenses };
}

// Dashboard Action
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
        expenseDate: values.newExpenseDate,
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
          await protectedLoader();
          return dashboardLoader();
        },
        action: dashboardAction,
        errorElement: <ErrorPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
        action: loginAction,
        loader: publicLoader,
      },
      {
        path: "signup",
        element: <SignupPage />,
        action: signupAction,
        loader: publicLoader,
      },
      {
        path: "budget/:id",
        element: <BudgetPage />,
        loader: async ({ params }) => {
          await protectedLoader();
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
          await protectedLoader();
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
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Check the initial session state once when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthReady(true);
    });

    // Listen for subsequent auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // The `SIGNED_IN` event is now handled by the `loginAction` redirecting
      // and the `publicLoader` preventing access to the login page.
      // We no longer need a `window.location` reload here, which fixes the loop.

      // We only need to handle a clean sign-out.
      if (event === 'SIGNED_OUT') {
        // A full page navigation to the login page is the simplest and most
        // reliable way to clear all application state on logout.
        window.location.href = '/login';
      }
    });

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Do not render the router until the initial Supabase session check is complete.
  // This prevents loaders from running before the auth state is known.
  if (!authReady) {
    return null;
  }

  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;