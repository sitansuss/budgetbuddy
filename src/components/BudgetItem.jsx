// src/components/BudgetItem.jsx

import { Form, Link } from "react-router-dom";
import { BanknotesIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatCurrency, formatPercentage } from "../helpers";

const BudgetItem = ({ budget, showDelete = false }) => {
  const { id, name, amount, color, spent } = budget;
  const remaining = amount - spent;

  return (
    // FIX: A CSS variable `--accent` is set here. Its value is the unique HSL
    // color string for this specific budget. Any CSS rule for a child of
    // this div can now use var(--accent) to get this color.
    <div
      className="budget"
      style={{
        "--accent": `hsl(${color})`
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
        <small>{formatCurrency(remaining < 0 ? 0 : remaining)} remaining</small>
      </div>
      {showDelete ? (
        <div className="flex-sm">
          <Form
            method="post"
            action="delete"
            onSubmit={(event) => {
              if (!confirm("Are you sure you want to permanently delete this budget?")) {
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