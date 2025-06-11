// src/pages/LoginPage.jsx

import { Form, Link, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient";

// Action for handling login
export async function loginAction({ request }) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    toast.error(error.message);
    return { error: error.message };
  }
  
  // A successful login is handled by the onAuthStateChange listener
  return toast.success("Logged in successfully!");
}

const LoginPage = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="intro" style={{ flexDirection: "column", gap: "2rem" }}>
      <h1>Welcome Back!</h1>
      <p>Log in to continue managing your budget.</p>
      
      <Form method="post" className="form-wrapper">
        <div className="grid-xs">
          <label htmlFor="email">Email Address</label>
          <input type="email" name="email" id="email" required placeholder="e.g., your@email.com" />
        </div>
        <div className="grid-xs">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" required />
        </div>
        
        <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </Form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;