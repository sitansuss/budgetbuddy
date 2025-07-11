// src/pages/SignupPage.jsx

// FIX: Import 'redirect' from react-router-dom
import { Form, Link, useNavigation, useActionData, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient";

// Action for handling signup
export async function signupAction({ request }) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    toast.error(error.message);
    // Keep this! It's great for UI feedback.
    return { error: error.message };
  }
  
  toast.success("Success! Check your email for a confirmation link.");
  // FIX: Redirect to the login page so the user can sign in.
  return redirect("/login");
}

const SignupPage = () => {
  const navigation = useNavigation();
  const actionData = useActionData();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="intro" style={{ flexDirection: "column", gap: "2rem" }}>
      <h1>Create an Account</h1>
      <p>Start your journey to financial freedom today.</p>
      
      <Form method="post" className="form-wrapper">
        <div className="grid-xs">
          <label htmlFor="email">Email Address</label>
          <input type="email" name="email" id="email" required placeholder="e.g., your@email.com" />
        </div>
        <div className="grid-xs">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" required minLength="6" placeholder="At least 6 characters" />
        </div>

        {/* This is how you can display the error from the action */}
        {actionData?.error && <p style={{color: 'hsl(var(--warning))'}}>{actionData.error}</p>}
        
        <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
      </Form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;