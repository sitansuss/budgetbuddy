// src/pages/Dashboard.jsx

import { Link, useLoaderData } from "react-router-dom";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
import Intro from "../components/Intro"; // We keep the import in case of a true empty state

const Dashboard = () => {
  // Get both userName and email from the loader
  const { userName, email, budgets, expenses } = useLoaderData();

  // The new logic: We assume the user is logged in because of the protectedLoader.
  // We no longer need the `userName ? ... : <Intro />` check to decide what to show.

  return (
    <div className="dashboard">
      <h1>
        Welcome back,{" "}
        {/* Display name if it exists, otherwise fall back to email */}
        <span className="accent">{userName || email}</span>
      </h1>
      <div className="grid-sm">
        {budgets && budgets.length > 0 ? (
          <div className="grid-lg">
            <div className="flex-lg">
              <AddBudgetForm />
              <AddExpenseForm budgets={budgets} />
            </div>
            <h2>Existing Budgets</h2>
            <div className="budgets">
              {budgets.map((budget) => (
                <BudgetItem key={budget.id} budget={budget} />
              ))}
            </div>
            {expenses && expenses.length > 0 && (
              <div className="grid-md">
                <h2>Recent Expenses</h2>
                <Table
                  expenses={expenses
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 8)}
                />
                {expenses.length > 8 && (
                  <Link to="expenses" className="btn btn--dark">
                    View all expenses
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          // This is the view for a user with no budgets yet
          <div className="grid-sm">
            <p>Personal budgeting is the secret to financial freedom.</p>
            <p>Create a budget to get started!</p>
            <AddBudgetForm />
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;