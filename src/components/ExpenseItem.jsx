// src/components/ExpenseItem.jsx

import { Link, Form } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/solid";
import { formatCurrency, formatDateToLocaleString } from "../helpers";

const ExpenseItem = ({ expense, showBudget = true }) => {
  const { budget } = expense;

  return (
    <>
      <td>{expense.name}</td>
      <td>{formatCurrency(expense.amount)}</td>
      <td>{formatDateToLocaleString(expense.expense_date)}</td>
      
      {showBudget && (
        <td>
          {budget ? (
            <Link
              to={`/budget/${budget.id}`}
              // FIX: We now directly set the text color to the budget's color,
              // making it clearly visible.
              style={{ color: `hsl(${budget.color})` }}
            >
              {budget.name}
            </Link>
          ) : (
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