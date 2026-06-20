import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: null, msg: "" });
  const [loading, setLoading] = useState(false);

  const { handleResetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (password.length < 8) {
      setStatus({ type: "error", msg: "Password must be at least 8 characters long." });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ type: "error", msg: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      const res = await handleResetPassword(token, password);
      if (res) {
        setStatus({ type: "success", msg: "Password successfully reset. Redirecting..." });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatus({ type: "error", msg: "Invalid or expired token. Please try again." });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 px-4 selection:bg-white selection:text-black">
      {/* Subtle Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-neutral-900/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/80 p-8 md:p-10 rounded-3xl shadow-2xl z-10"
      >
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-white">Create New Password</h2>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Please enter your new password below. Make sure it's secure.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NEW PASSWORD */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
              New Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-neutral-500 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950/60 border border-neutral-800 rounded-2xl py-3.5 pl-11 pr-12 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-neutral-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-neutral-500 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-neutral-950/60 border border-neutral-800 rounded-2xl py-3.5 pl-11 pr-12 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-all"
              />
            </div>
          </div>

          {/* STATUS BANNER */}
          <AnimatePresence>
            {status.msg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`overflow-hidden rounded-xl text-xs flex items-start gap-3 p-3.5 border ${
                  status.type === "success" 
                    ? "bg-emerald-950/30 border-emerald-800/50 text-emerald-300" 
                    : "bg-rose-950/30 border-rose-800/50 text-rose-300"
                }`}
              >
                {status.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                <p className="leading-relaxed">{status.msg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-neutral-950 hover:bg-neutral-200 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none font-medium text-xs uppercase tracking-[0.2em] py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-white/5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              "Save New Password"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;