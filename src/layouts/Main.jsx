// src/layouts/Main.jsx

import { Outlet, useLoaderData } from "react-router-dom";
import { supabase } from "../supabaseClient";
import wave from "../assets/wave.svg";
import Nav from "../components/Nav";

// The loader is still responsible for getting data for the Nav bar
export async function mainLoader() {
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.userName;
  return { userName };
}

const Main = () => {
  const { userName } = useLoaderData();
  
  // THE USEEFFECT HOOK FOR AUTH CHANGES HAS BEEN REMOVED FROM THIS FILE.

  return (
    <div className="layout">
      <Nav userName={userName} />
      <main>
        <Outlet />
      </main>
      <img src={wave} alt="" />
    </div>
  );
};
export default Main;