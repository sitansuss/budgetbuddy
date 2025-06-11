// src/pages/ExpensesPage.jsx

// rrd imports
import { useLoaderData } from "react-router-dom";

// library
import { toast } from "react-toastify";

// components
import Table from "../components/Table";

// helpers
// Import the new async helpers
import { getBudgets, getExpenses, deleteExpense } from "../helpers";

// loader for the expenses page
export async function expensesLoader() {
  const expenses = await getExpenses();
  const budgets = await getBudgets();

  const expensesWithBudget = expenses.map((expense) => {
    const budget = budgets.find((b) => b.id === expense.budget_id);
    return { ...expense, budget: budget };
  });

  return { expenses: expensesWithBudget };
}

// =============================================================
// ACTION TO HANDLE DELETING AN EXPENSE FROM THIS PAGE
// =============================================================
export async function expensesAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "deleteExpense") {
    try {
      // Use the new async deleteExpense helper
      await deleteExpense(values.expenseId);
      return toast.success("Expense deleted!");
    } catch (e) {
      throw new Error("There was a problem deleting your expense.");
    }
  }
}

const ExpensesPage = () => {
  const { expenses } = useLoaderData();

  return (
    <div className="grid-lg">
      <h1>All Expenses</h1>
      {expenses && expenses.length > 0 ? (
        <div className="grid-md">
          <h2>
            Recent Expenses <small>({expenses.length} total)</small>
          </h2>
          <div className="table">
            <Table expenses={expenses} />
          </div>
        </div>
      ) : (
        <p>No expenses to show</p>
      )}
    </div>
  );
};

export default ExpensesPage;