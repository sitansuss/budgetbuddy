// src/components/Nav.jsx

// rrd imports
import { Form, NavLink } from "react-router-dom";

// library
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

// assets
import logomark from "../assets/logomark.svg";

// The Nav now receives both userName and email props from the Main layout component.
const Nav = ({ userName, email }) => {
  return (
    <nav>
      <NavLink to="/" aria-label="Go to home">
        <img src={logomark} alt="" height={30} />
        <span>BudgetBuddy</span>
      </NavLink>
      {
        // The logic is updated to show the button if EITHER a name or email exists.
        // This ensures a newly signed-up user (who only has an email) sees the logout button.
        (userName || email) && (
        <Form
          method="post"
          action="/logout"
          onSubmit={(event) => {
            if (!confirm("Are you sure you want to log out?")) {
              event.preventDefault();
            }
          }}
        >
          <button type="submit" className="btn btn--warning">
            <span>Logout</span>
            <ArrowRightOnRectangleIcon width={20} />
          </button>
        </Form>
      )}
    </nav>
  );
};
export default Nav;