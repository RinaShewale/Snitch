import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AppRouter from "./AppRouter";

import { setUser } from "../Features/auth/redux/auth.slice";
import { getProfile } from "../Features/auth/services/auth.api";

const App = () => {
  const dispatch = useDispatch();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getProfile();

        if (res.user) {
          dispatch(setUser(res.user));
        }
      } catch (error) {
        console.log(error);
      } finally {
        // Adding a slight delay for a smoother transition if the API is too fast
        setTimeout(() => {
          setCheckingAuth(false);
        }, 800);
      }
    };

    loadUser();
  }, [dispatch]);

  if (checkingAuth) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f5f1ec]">
        {/* Elegant Logo or Brand Name */}
        <div className="overflow-hidden">
          <h1 className="font-serif text-4xl md:text-5xl tracking-luxe text-[#1a1714] animate-pulse">
            SNITCH
          </h1>
        </div>
        
        {/* Minimalist Progress Bar */}
        <div className="mt-8 w-48 h-[1px] bg-[#ded7d0] relative overflow-hidden">
          <div className="absolute inset-0 bg-[#1a1714] origin-left animate-loading-bar"></div>
        </div>
        
        <span className="mt-4 font-sans text-[10px] uppercase tracking-wider-2 text-[#2a2724]/60">
          Luxury Fashion Experience
        </span>
      </div>
    );
  }

  return <AppRouter />;
};

export default App;