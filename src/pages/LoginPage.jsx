// src/pages/LoginPage.jsx

// FIX: Import 'redirect' from react-router-dom
import { Form, Link, useNavigation, useActionData, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient";

// Action for handling login
export async function loginAction({ request }) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    toast.error(error.message);
    // Keep this! Returning the error is great for displaying it in the UI.
    return { error: error.message };
  }
  
  // FIX: On success, redirect the user to the dashboard.
  toast.success("Logged in successfully!");
  return redirect("/");
}

const LoginPage = () => {
  const navigation = useNavigation();
  const actionData = useActionData(); // You can use this to display the error message
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

        {/* This is how you can display the error from the action */}
        {actionData?.error && <p style={{color: 'hsl(var(--warning))'}}>{actionData.error}</p>}
        
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