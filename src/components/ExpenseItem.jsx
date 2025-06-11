// src/components/ExpenseItem.jsx

// rrd imports
import { Link, Form } from "react-router-dom";

// library
import { TrashIcon } from "@heroicons/react/24/solid";

// helpers
import { formatCurrency, formatDateToLocaleString } from "../helpers";

// This component now expects the 'expense' object to have a 'budget' property nested inside.
const ExpenseItem = ({ expense, showBudget = true }) => {
  const { budget } = expense;

  return (
    <>
      <td>{expense.name}</td>
      <td>{formatCurrency(expense.amount)}</td>
      <td>{formatDateToLocaleString(expense.created_at)}</td>
      {showBudget && (
        <td>
          {/* Check if budget exists before trying to access its properties */}
          {budget ? (
            <Link
              to={`/budget/${budget.id}`}
              style={{
                // Use HSL color stored in the budget
                "--accent": `hsl(${budget.color})`,
              }}
            >
              {budget.name}
            </Link>
          ) : (
            // Display a dash if for some reason the budget isn't found
            <span>-</span>
          )}
        </td>
      )}
      <td>
        <Form method="post">
          <input type="hidden" name="_action" value="deleteExpense" />
          <input type="hidden" name="expenseId" value={expense.id} />
          <button
            type="submit"
            className="btn btn--warning"
            aria-label={`Delete ${expense.name} expense`}
          >
            <TrashIcon width={20} />
          </button>
        </Form>
      </td>
    </>
  );
};
export default ExpenseItem;