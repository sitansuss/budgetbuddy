// src/components/BudgetItem.jsx

// rrd imports
import { Form, Link } from "react-router-dom";

// library imports
import { BanknotesIcon, TrashIcon } from "@heroicons/react/24/outline";

// helper functions
import {
  formatCurrency,
  formatPercentage,
} from "../helpers";

// NOTE: This component is now "dumb." It no longer calculates the spent amount.
// It expects the `spent` value to be provided in the `budget` prop.

const BudgetItem = ({ budget, showDelete = false }) => {
  const { id, name, amount, color } = budget;
  
  // The 'spent' value is now read directly from the prop.
  // We use `?? 0` as a safeguard in case `spent` is undefined.
  const spent = budget.spent ?? 0;

  return (
    <div
      className="budget"
      style={{
        // Use HSL color stored in the budget
        "--accent": `hsl(${color})`,
      }}
    >
      <div className="progress-text">
        <h3>{name}</h3>
        <p>{formatCurrency(amount)} Budgeted</p>
      </div>
      <progress max={amount} value={spent}>
        {formatPercentage(spent / amount)}
      </progress>
      <div className="progress-text">
        <small>{formatCurrency(spent)} spent</small>
        <small>{formatCurrency(amount - spent)} remaining</small>
      </div>
      {showDelete ? (
        <div className="flex-sm">
          <Form
            method="post"
            action={`/budget/${id}/delete`}
            onSubmit={(event) => {
              if (
                !confirm(
                  "Are you sure you want to permanently delete this budget?"
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit" className="btn">
              <span>Delete Budget</span>
              <TrashIcon width={20} />
            </button>
          </Form>
        </div>
      ) : (
        <div className="flex-sm">
          <Link to={`/budget/${id}`} className="btn">
            <span>View Details</span>
            <BanknotesIcon width={20} />
          </Link>
        </div>
      )}
    </div>
  );
};
export default BudgetItem;