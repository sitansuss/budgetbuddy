import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY



 console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseAnonKey ? "Loaded" : "NOT LOADED");

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)