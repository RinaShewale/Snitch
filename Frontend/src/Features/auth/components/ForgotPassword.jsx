import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: null, msg: "" });
  const [loading, setLoading] = useState(false);

  const { handleForgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      const res = await handleForgotPassword(email);
      if (res) {
        setStatus({ type: "success", msg: "We sent a recovery link to your email." });
      } else {
        setStatus({ type: "error", msg: "Failed to send reset link. Please try again." });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "An error occurred. Please try again later." });
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
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          <span>Back to login</span>
        </Link>

        <div className="space-y-2 mb-8">
          <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-white">Reset Password</h2>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Enter the email associated with your account and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-neutral-500 w-4 h-4" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950/60 border border-neutral-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-all"
              />
            </div>
          </div>

          {/* STATUS MESSAGE BANNER */}
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
                <span>Sending...</span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;