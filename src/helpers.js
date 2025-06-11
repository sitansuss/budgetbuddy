// src/helpers.js

import { supabase } from "./supabaseClient";

// --- Auth Helper ---

/**
 * Gets the current authenticated user from Supabase.
 * Throws an error if no user is signed in.
 * @returns {Promise<import('@supabase/supabase-js').User>} The user object.
 */
const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error);
    throw new Error("Authentication error while getting session.");
  }

  if (!session) {
    throw new Error("You must be logged in to perform this action.");
  }

  return session.user;
};


// --- Data Fetching Functions ---

/**
 * Fetches all budgets for the currently logged-in user.
 */
export const getBudgets = async () => {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase getBudgets error:", error);
    throw new Error("Could not fetch budgets.");
  }
  return data;
};

/**
 * Fetches all expenses for the currently logged-in user.
 */
export const getExpenses = async () => {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Supabase getExpenses error:", error);
    throw new Error("Could not fetch expenses.");
  }
  return data;
};


// --- Data Creation Functions ---

const generateRandomColor = (count) => `${count * 34} 65% 50%`;

/**
 * Creates a new budget for the currently logged-in user.
 */
export const createBudget = async ({ name, amount, existingBudgetsCount }) => {
  const user = await getCurrentUser();
  const newItem = {
    name,
    amount: +amount,
    color: generateRandomColor(existingBudgetsCount),
    user_id: user.id,
  };

  const { error } = await supabase.from('budgets').insert([newItem]);
  if (error) {
    console.error("Supabase createBudget error:", error);
    throw new Error("Could not create budget.");
  }
};

/**
 * Creates a new expense for the currently logged-in user.
 */
export const createExpense = async ({ name, amount, budgetId }) => {
  const user = await getCurrentUser();
  const newItem = {
    name,
    amount: +amount,
    budget_id: budgetId, // Using snake_case to match the database column
    user_id: user.id,
  };

  // Insert the new item without asking for it to be returned
  const { error } = await supabase.from('expenses').insert([newItem]);

  if (error) {
    console.error("Supabase createExpense error:", error);
    throw new Error("Could not create expense.");
  }
};


// --- Data Deletion Functions ---

/**
 * Deletes an expense owned by the currently logged-in user.
 */
export const deleteExpense = async (id) => {
  const user = await getCurrentUser();
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  
  if (error) {
    console.error("Supabase deleteExpense error:", error);
    throw new Error("Could not delete expense.");
  }
};

/**
 * Deletes a budget owned by the currently logged-in user.
 */
export const deleteBudget = async (id) => {
  const user = await getCurrentUser();
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  
  if (error) {
    console.error("Supabase deleteBudget error:", error);
    throw new Error("Could not delete budget.");
  }
};


// --- Calculation & Formatting Functions ---

export const calculateSpentByBudget = (budgetId, allExpenses) => {
  return allExpenses?.reduce((acc, expense) => {
    // Check against the snake_case property
    if (expense.budget_id !== budgetId) return acc;
    return (acc += expense.amount);
  }, 0) ?? 0;
};

export const formatPercentage = (amt) => amt.toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 });

export const formatCurrency = (amt) => amt.toLocaleString("en-IN", { style: "currency", currency: "INR" });

export const formatDateToLocaleString = (epoch) => new Date(epoch).toLocaleDateString();

export const waait = () => new Promise((res) => setTimeout(res, Math.random() * 800));