// src/components/Intro.jsx

import { Form, useNavigation } from "react-router-dom";
import { UserPlusIcon } from "@heroicons/react/24/solid";

// You can add an illustration if you have one, or remove this line.
// import illustration from "../assets/illustration.jpg"; 

const Intro = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="intro">
      <div>
        <h1>
          Take Control of <span className="accent">Your Money</span>
        </h1>
        <p>
          Personal budgeting is the secret to financial freedom. Start your
          journey today.
        </p>
        
        {/*
          This is the form that sets the user's name for the first time.
          It uses React Router's <Form> to submit data to the current route's action.
          The hidden input with name="_action" and value="newUser" is crucial.
          It tells our dashboardAction exactly what to do.
        */}
        <Form method="post">
          <input
            type="text"
            name="userName"
            required
            placeholder="What is your name?"
            aria-label="Your Name"
            autoComplete="given-name"
          />
          <input type="hidden" name="_action" value="newUser" />
          <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
            <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
            <UserPlusIcon width={20} />
          </button>
        </Form>
      </div>
      
      {/* 
        Optional: If you have an illustration image, uncomment this.
        Make sure the path to the image is correct.
        <img src={illustration} alt="Person with money" width={600} /> 
      */}
    </div>
  );
};

export default Intro;