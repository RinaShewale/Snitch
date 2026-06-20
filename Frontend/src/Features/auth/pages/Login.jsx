import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const Login = () => {
  const { handleLogin, handleGoogleLogin } = useAuth();
  const { error, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const imageRef = useRef(null);
  const brandName = "SNITCH";

  useEffect(() => {
    gsap.fromTo(
      imageRef.current,
      { scale: 1.3, filter: 'blur(20px) grayscale(100%)' },
      { scale: 1, filter: 'blur(0px) grayscale(100%)', duration: 2.5, ease: 'power2.out' }
    );
  }, []);

  // Updated Hover for Light Theme
  const handleLetterHover = (e) => {
    gsap.to(e.target, {
      y: -30,
      scale: 1.2,
      color: "#2A2724", // Charcoal highlight
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleLetterLeave = (e) => {
    gsap.to(e.target, {
      y: 0,
      scale: 1,
      color: "#ffffff", // Back to white over image
      duration: 0.6,
      ease: "elastic.out(1, 0.3)",
    });
  };

  const onLogin = async (e) => {
    e.preventDefault();

    const res = await handleLogin(email, password);

    if (!res) return;

    // Seller Login
    if (res.user?.role === "seller") {
      navigate("/seller/inventory", { replace: true });
      return;
    }

    // Buyer Login
    navigate("/", { replace: true });
  };

  
  return (
    <div className="h-screen w-full flex bg-[#DED7D0] overflow-hidden text-[#2A2724] font-sans">
      {/* LEFT: IMAGE SECTION (Original Image) */}
      <div className="hidden lg:block lg:w-[55%] h-full relative overflow-hidden bg-[#2A2724]">
        <div ref={imageRef} className="w-full h-full relative">
          <img
            src="https://images.unsplash.com/photo-1612215326956-c2bb6228c72d?w=800&auto=format&fit=crop&q=80"
            className="w-full h-full object-cover grayscale brightness-[0.8] contrast-[1.1]"
            alt="Fashion Model"
          />
          {/* Gradients blending into the Beige theme */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#e2e0a1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A2724]/60 via-transparent to-transparent opacity-80" />

          {/* MASSIVE BRAND NAME */}
          <div className="absolute bottom-12 left-12 z-20">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}>
              <h1 className="text-[10vw] font-serif font-bold tracking-tighter leading-none uppercase cursor-default flex text-white drop-shadow-2xl">
                {brandName.split("").map((char, i) => (
                  <span
                    key={i}
                    onMouseEnter={handleLetterHover}
                    onMouseLeave={handleLetterLeave}
                    className="inline-block transition-all"
                  >
                    {char}
                  </span>
                ))}
              </h1>
              <p className="mt-2 text-white/70 tracking-[0.6em] uppercase text-xs font-bold">
                Luxury Essentials • 2025
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* RIGHT: FORM SECTION (Light Theme) */}
      <div className="w-full lg:w-[45%] h-full flex flex-col justify-center px-8 md:px-20 bg-[#dedbdb] z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[420px] w-full mx-auto"
        >
          <div className="mb-12">
            <h2 className="text-5xl font-serif font-bold italic mb-3 tracking-tight">Welcome back</h2>
            <p className="text-[#2A2724]/60 text-sm font-medium">Please enter your details to sign in.</p>
          </div>

          <form className="space-y-10" onSubmit={onLogin}>
            <div className="group relative">
              <label className="text-[10px] uppercase tracking-[0.25em] text-[#2A2724]/50 group-focus-within:text-[#2A2724] transition-colors font-bold">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b thin-border py-3 text-sm outline-none focus:border-[#2A2724] placeholder:text-[#60605b] transition-all"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="group relative">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-[0.25em] text-[#2A2724]/50 group-focus-within:text-[#2A2724] transition-colors font-bold">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-[10px] uppercase tracking-widest text-[#2A2724]/40 hover:text-[#2A2724]"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b thin-border py-3 text-sm outline-none focus:border-[#2A2724] placeholder:text-[#60605b] transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-red-800 text-xs italic font-serif">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-xs font-bold uppercase tracking-[0.3em] transition-all active:scale-[0.98] catalog-shadow ${loading ? "bg-[#2A2724]/20" : "bg-[#2A2724] text-[#DED7D0] hover:bg-[#1a1816]"
                }`}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>

            {/* LIGHT THEME GOOGLE BUTTON */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3.5 border thin-border flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.1em] hover:bg-white/50 transition-all rounded-sm active:scale-[0.98]"
            >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </form>

          <p className="mt-12 text-center text-[12px] tracking-[0.2em] uppercase text-[#2A2724]/60">
            New Here? <a href="/register" className="text-[#2A2724] border-b border-[#2A2724] pb-0.5 font-black">Create Account</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;