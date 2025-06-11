// src/layouts/Main.jsx

import { useEffect } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import wave from "../assets/wave.svg";
import Nav from "../components/Nav";

// loader
export async function mainLoader() {
  const { data: { session } } = await supabase.auth.getSession();

  // Fetch both userName and email for the Nav component
  const userName = session?.user?.user_metadata?.userName;
  const email = session?.user?.email;

  return { userName, email };
}

const Main = () => {
  const { userName, email } = useLoaderData(); // Get email here
  const navigate = useNavigate();

  useEffect(() => {
    // ... (no changes to useEffect)
  }, [navigate]);

  return (
    <div className="layout">
      {/* Pass both down to the Nav component */}
      <Nav userName={userName} email={email} />
      <main>
        <Outlet />
      </main>
      <img src={wave} alt="" />
    </div>
  );
};
export default Main;