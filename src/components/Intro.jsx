// src/components/Intro.jsx

import { Form } from "react-router-dom"

// library
import { UserPlusIcon } from "@heroicons/react/24/solid"

const Intro = () => {
  return (
    <div className="intro">
      <div>
        <h1>
          Take Control of <span className="accent">Your Money</span>
        </h1>
        <p>
          Personal budgeting is the secret to financial freedom. Start your journey today.
        </p>
        {/*
          THE FORM THAT WAS HERE HAS BEEN DELETED.
          We no longer ask for the user's name on this screen.
          Authentication is handled on the /login page.
        */}
      </div>
    </div>
  )
}
export default Intro