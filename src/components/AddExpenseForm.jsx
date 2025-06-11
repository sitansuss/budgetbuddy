// src/components/AddExpenseForm.jsx

import { Form } from "react-router-dom";

const AddExpenseForm = ({ budgets }) => {
  // This helper function is perfectly implemented. It gets the current date and time
  // in the exact format needed for the datetime-local input's default value.
  const getCurrentDateTime = () => {
    const now = new Date();
    // This timezone adjustment is a great touch for user experience.
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  
  return (
    <div className="form-wrapper">
      <h2 className="h3">
        Add New <span className="accent">{budgets.length === 1 && `${budgets[0].name}`}</span> Expense
      </h2>
      <Form method="post" className="grid-sm">
        <div className="expense-inputs">
          <div className="grid-xs">
            <label htmlFor="newExpense">Expense Name</label>
            <input type="text" name="newExpense" id="newExpense" placeholder="e.g., Coffee" required />
          </div>
          <div className="grid-xs">
            <label htmlFor="newExpenseAmount">Amount</label>
            <input type="number" step="0.01" name="newExpenseAmount" id="newExpenseAmount" placeholder="e.g., 3.50" required inputMode="decimal" />
          </div>
        </div>
        
        <div className="expense-inputs">
          <div className="grid-xs" hidden={budgets.length === 1}>
            <label htmlFor="newExpenseBudget">Budget Category</label>
            <select name="newExpenseBudget" id="newExpenseBudget" required>
              {budgets
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                .map((budget) => (
                  <option key={budget.id} value={budget.id}>
                    {budget.name}
                  </option>
                ))}
            </select>
          </div>

          {/* This is the new, correctly implemented Date & Time input field. */}
          <div className="grid-xs">
            <label htmlFor="newExpenseDate">Date of Expense</label>
            <input
              type="datetime-local"
              name="newExpenseDate"
              id="newExpenseDate"
              required
              defaultValue={getCurrentDateTime()}
            />
          </div>
        </div>

        <input type="hidden" name="_action" value="createExpense" />
        <button type="submit" className="btn btn--dark">
          Add Expense
        </button>
      </Form>
    </div>
  );
};

export default AddExpenseForm;