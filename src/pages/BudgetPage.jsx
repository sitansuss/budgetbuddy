// rrd imports
import { useLoaderData, Form } from "react-router-dom";

// library
import { toast } from "react-toastify";

// components
import BudgetItem from "../components/BudgetItem";
import AddExpenseForm from "../components/AddExpenseForm";
import Table from "../components/Table";

// helpers
// =============================================================
// UPDATED IMPORTS: Use the new async helpers
// =============================================================
import {
  createExpense,
  deleteExpense,
  getBudgets,
  getExpenses,
  calculateSpentByBudget,
} from "../helpers";

// loader for the budget page
export async function budgetLoader({ params }) {
  // Fetch all data required for this page
  const allBudgets = await getBudgets();
  const allExpenses = await getExpenses();

  // Find the specific budget for this page
  const budget = allBudgets.find((b) => b.id === params.id);

  if (!budget) {
    throw new Error("The budget you’re trying to find doesn’t exist");
  }

  // Filter expenses to only those that belong to this budget
  const expenses = allExpenses.filter((expense) => expense.budget_id === params.id);

  return { budget, expenses, allExpenses }; // Pass allExpenses for calculations
}

// action for the budget page
export async function budgetAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  // =============================================================
  // UPDATED ACTION LOGIC
  // =============================================================

  if (_action === "createExpense") {
    try {
      // Use the new async createExpense helper
      await createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
      });
      return toast.success(`Expense ${values.newExpense} created!`);
    } catch (e) {
      throw new Error("There was a problem creating your expense.");
    }
  }

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

const BudgetPage = () => {
  const { budget, expenses, allExpenses } = useLoaderData();

  // We need to pass the full list of expenses to the budget item for correct calculation
  const spent = calculateSpentByBudget(budget.id, allExpenses);

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
        {/* Pass the calculated spent amount to the BudgetItem */}
        <BudgetItem budget={{ ...budget, spent }} showDelete={true} />
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