// src/pages/BudgetPage.jsx

import { useLoaderData } from "react-router-dom";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
import { createExpense, deleteExpense, getBudgets, getExpenses, calculateSpentByBudget } from "../helpers";
import { toast } from "react-toastify";

// loader for the budget page
export async function budgetLoader({ params }) {
  const allBudgets = await getBudgets();
  const allExpenses = await getExpenses();

  const budgetRaw = allBudgets.find((b) => b.id === params.id);

  if (!budgetRaw) {
    throw new Error("The budget you’re trying to find doesn’t exist");
  }

  // UPDATE: Calculate the spent amount for this specific budget
  const spent = calculateSpentByBudget(budgetRaw.id, allExpenses);
  const budget = { ...budgetRaw, spent };

  // Filter expenses for this page and attach budget info
  const expenses = allExpenses
    .filter((expense) => expense.budget_id === params.id)
    .map(expense => ({ ...expense, budget: budgetRaw })); // Add budget info for consistency

  return { budget, expenses };
}

// action for the budget page
export async function budgetAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "createExpense") {
    try {
      await createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
        expenseDate: values.newExpenseDate,
      });
      return toast.success(`Expense ${values.newExpense} created!`);
    } catch (e) {
      throw new Error("There was a problem creating your expense.");
    }
  }

  if (_action === "deleteExpense") {
    try {
      await deleteExpense(values.expenseId);
      return toast.success("Expense deleted!");
    } catch (e) {
      throw new Error("There was a problem deleting your expense.");
    }
  }
}

const BudgetPage = () => {
  const { budget, expenses } = useLoaderData();

  return (
    <div
      className="grid-lg"
      style={{
        "--accent": `hsl(${budget.color})`,
      }}
    >
      <h1 className="h2">
        <span className="accent">{budget.name}</span> Overview
      </h1>
      <div className="flex-lg">
        <BudgetItem budget={budget} showDelete={true} />
        <AddExpenseForm budgets={[budget]} />
      </div>
      {expenses && expenses.length > 0 && (
        <div className="grid-md">
          <h2>
            <span className="accent">{budget.name}</span> Expenses
          </h2>
          <Table expenses={expenses} showBudget={false} />
        </div>
      )}
    </div>
  );
};

export default BudgetPage;