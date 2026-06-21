import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  ShoppingBag, 
  ArrowRight, 
  PackageCheck, 
  ExternalLink 
} from "lucide-react";
import gsap from "gsap";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [secondsLeft, setSecondsLeft] = useState(60);

  // Animation and Redirect Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/my-orders", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animations
      gsap.from(".reveal", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
      });

      // Progress bar animation for the redirect
      gsap.fromTo(
        ".redirect-progress",
        { width: "100%" },
        { width: "0%", duration: 60, ease: "linear" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#f8f5f2] text-[#1a1714] font-light flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Visual Grain Overlay (Same as Cart) */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center">
        
        {/* Animated Icon */}
        <div className="reveal mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/10 blur-2xl rounded-full scale-150 animate-pulse"></div>
            <PackageCheck size={80} strokeWidth={1} className="relative text-[#1a1714]" />
          </div>
        </div>

        {/* Header Text */}
        <header className="mb-10">
          <h1 className="reveal text-4xl md:text-6xl font-serif italic tracking-tight mb-4">
            Order Confirmed.
          </h1>
          <p className="reveal text-[11px] uppercase tracking-[0.3em] font-bold opacity-60">
            Thank you for choosing Snitch. Your wardrobe is leveling up.
          </p>
        </header>

        {/* Status Card */}
        <div className="reveal w-full bg-white/40 backdrop-blur-sm border border-[#1a1714]/5 p-8 md:p-12 mb-12 relative overflow-hidden">
          <div className="flex flex-col items-center gap-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest opacity-50">Estimated Delivery</p>
              <p className="text-xl font-serif italic">3 — 5 Business Days</p>
            </div>
            
            <div className="w-full h-[1px] bg-[#1a1714]/10"></div>
            
            <div className="flex flex-col items-center gap-4">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black">
                Redirecting to your orders in {secondsLeft}s
              </p>
              
              {/* Progress Bar (Matching Cart Style) */}
              <div className="w-48 h-[2px] bg-[#1a1714]/5 relative">
                <div className="redirect-progress absolute top-0 right-0 h-full bg-[#1a1714]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="reveal flex flex-col md:flex-row gap-6 w-full items-center justify-center">
          <button
            onClick={() => navigate("/my-orders", { replace: true })}
            className="group w-full md:w-auto bg-[#1a1714] text-white px-10 py-5 uppercase text-[11px] tracking-[0.3em] font-black hover:bg-black transition-all flex items-center justify-center gap-4"
          >
            Track Order <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="w-full md:w-auto px-10 py-5 border border-[#1a1714]/20 uppercase text-[11px] tracking-[0.3em] font-bold hover:bg-[#1a1714]/5 transition-all flex items-center justify-center gap-4"
          >
            <ShoppingBag size={14} /> Keep Shopping
          </button>
        </div>

        {/* Footer Note */}
        <footer className="reveal mt-20 opacity-30">
          <p className="text-[9px] uppercase tracking-widest font-bold">
            A confirmation email has been sent to your inbox.
          </p>
        </footer>
      </div>

      {/* Decorative Side Text (Vertical) */}
      <div className="absolute left-10 bottom-10 hidden lg:block">
        <span className="text-[10px] uppercase tracking-[0.5em] font-black opacity-10 rotate-90 origin-left inline-block whitespace-nowrap">
          SNITCH COLLECTIVE © 2024
        </span>
      </div>
    </div>
  );
};

export default OrderSuccessPage;