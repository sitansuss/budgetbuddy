// src/pages/Error.jsx

import { useRouteError, Link, useNavigate } from "react-router-dom";

// library imports
import { HomeIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

const Error = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  // Check if this is the specific authentication error
  const isAuthError = error.message === "You must be logged in to perform this action.";

  return (
    <div className="error">
      <h1>Uh oh! We’ve got a problem.</h1>
      <p>{error.message || error.statusText}</p>
      <div className="flex-md">
        
        {isAuthError ? (
          // --- SOLUTION FOR AUTH ERROR ---
          // Provide a direct link to the login page. This clears the error state.
          <a
            href="/login"
            className="btn btn--dark"
          >
            <HomeIcon width={20} />
            <span>Go to Login</span>
          </a>
        ) : (
          // --- SOLUTION FOR ALL OTHER ERRORS ---
          <>
            <button
              className="btn btn--dark"
              onClick={() => navigate(-1)} // Go back one step
            >
              <ArrowUturnLeftIcon width={20} />
              <span>Go Back</span>
            </button>
            <Link
              to="/"
              className="btn btn--dark"
            >
              <HomeIcon width={20} />
              <span>Go home</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Error;