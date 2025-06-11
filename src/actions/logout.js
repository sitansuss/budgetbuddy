// src/actions/logout.js

// library
import { toast } from "react-toastify";

/**
 * This action handles client-side cleanup after the user has been signed out
 * by Supabase.
 */
export function logoutAction() {
  // Clear any user-specific data from local storage.
  localStorage.removeItem("userName");
  
  // Provide positive feedback to the user.
  toast.success("You’ve successfully logged out!");
  
  // The redirect to the login page is handled by the onAuthStateChange
  // listener in Main.jsx, so we just need to return null here to complete
  // the action's contract with React Router.
  return null;
}