import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Newsletter = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          },
        }
      );
    }
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      
      // Success pop animation
      gsap.fromTo(".subscribe-success", 
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
      );

      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#ffffff] border-b border-[#1a1714]/5 relative overflow-hidden"
    >
      {/* Decorative vertical lines simulating a grid layout */}
      <div className="absolute inset-y-0 left-12 w-[1px] bg-[#1a1714]/3 pointer-events-none hidden lg:block"></div>
      <div className="absolute inset-y-0 right-12 w-[1px] bg-[#1a1714]/3 pointer-events-none hidden lg:block"></div>

      <div 
        ref={contentRef}
        className="max-w-[700px] mx-auto px-6 text-center space-y-8 relative z-10"
      >
        <p className="text-[10px] tracking-[0.45em] uppercase text-[#1a1714]/50">
          STAY INFORMED
        </p>
        
        <h2
          className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1a1714] italic font-light leading-none"
        >
          Join the Inner Circle.
        </h2>
        
        <p className="text-[#1a1714]/60 text-[11px] tracking-[0.2em] uppercase leading-relaxed max-w-lg mx-auto font-light">
          Enjoy <strong className="font-semibold text-[#1a1714]">10% off</strong> your first order. 
          Receive early access invites, lookbook launches, and editorial collections.
        </p>

        {/* Minimalist Form Layout (Inspired by Reference) */}
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-0 border border-[#1a1714]/15 mt-4 group focus-within:border-[#1a1714] transition-colors duration-300">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ENTER YOUR EMAIL ADDRESS"
            required
            className="flex-1 bg-[#f5f1ec]/20 py-4 px-6 text-[11px] tracking-[0.2em] placeholder:text-[#1a1714]/35 text-[#1a1714] focus:outline-none focus:bg-transparent transition-colors uppercase font-medium"
          />
          <button
            type="submit"
            className={`px-8 py-4 sm:py-0 text-[10px] tracking-[0.25em] uppercase font-bold flex items-center justify-center gap-2.5 transition-all duration-500 cursor-pointer ${
              subscribed
                ? "bg-[#2e7d32] text-white"
                : "bg-[#1a1714] text-[#f5f1ec] hover:bg-[#ded7d0] hover:text-[#1a1714]"
            }`}
          >
            {subscribed ? (
              <span className="subscribe-success">SUBSCRIBED ✓</span>
            ) : (
              <>
                SUBSCRIBE
                <Send size={11} strokeWidth={1.5} />
              </>
            )}
          </button>
        </form>

        <p className="text-[9px] tracking-widest text-[#1a1714]/40 font-light pt-2">
          You may unsubscribe at your convenience. Read our privacy charter.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
