import { toast } from "react-toastify";
import { redirect } from "react-router-dom";

// Import your new Supabase helper
import { deleteBudget as deleteBudgetFromDb } from "../helpers";

export async function deleteBudget({ params }) {
  try {
    // We only need to delete the budget. Supabase handles the expenses.
    await deleteBudgetFromDb(params.id);

    toast.success("Budget deleted successfully!");
  } catch (e) {
    throw new Error("There was a problem deleting your budget.");
  }

  // Redirect to the dashboard after deletion
  return redirect("/");
}