import React, { useState, useEffect } from 'react';

// --- Custom Minimalist SVG Icons ---
const Icons = {
  ArrowUpRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
  ),
  ArrowUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
  ),
  Instagram: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
  ),
  Twitter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-1 2.17-2 2.51c-.97 2.16-2.17 4.54-4.83 4.83a6 6 0 0 1-5-1c1.92 3.14-.55 7.22-5.13 7.82 2.16.82 4.41.35 5.86-1.07a4.5 4.5 0 0 1-3.34-3.12c.51.1 1.01.08 1.5-.06a4.5 4.5 0 0 1-3.61-4.41c.46.25.99.41 1.56.43a4.5 4.5 0 0 1-1.39-6.01c2.42 2.97 6.05 4.93 10.12 5.14a4.5 4.5 0 0 1 7.72-4.12z"></path></svg>
  ),
  Facebook: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
  ),
  LinkedIn: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
  )
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { 
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' 
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#0a0a0a] text-[#fafafa] pt-32 pb-10 font-sans selection:bg-white selection:text-black">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* SECTION 1: THE STATEMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start border-b border-white/10 pb-24">
          <div className="lg:col-span-7">
            <h2 className="text-5xl md:text-7xl font-light tracking-tight leading-[1.1] max-w-3xl">
              Elevating the everyday through <span className="italic font-serif">intentional</span> design.
            </h2>
          </div>
          
          <div className="lg:col-span-5 flex flex-col lg:items-end justify-between h-full space-y-12">
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                <span className="text-[10px] tracking-[0.2em] font-mono text-white/70">BLR // {time} IST</span>
              </div>
            </div>

            <div className="w-full max-w-sm group">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4">Newsletter Subscription</p>
              <div className="relative flex items-center border-b border-white/20 pb-2 group-focus-within:border-white transition-all duration-700">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER EMAIL"
                  className="bg-transparent w-full text-xs tracking-[0.3em] focus:outline-none placeholder:text-white/10 uppercase"
                />
                <button className={`transition-all duration-500 ${email.includes('@') ? 'opacity-100' : 'opacity-20'}`}>
                  <Icons.ArrowUpRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: NAVIGATION */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 py-24">
          <NavColumn title="Sitemap" links={["Collections", "Atelier", "Archive", "The Journal"]} />
          <NavColumn title="Assistance" links={["Shipping", "Returns", "Sizing", "Contact"]} />
          <NavColumn title="Legal" links={["Privacy", "Terms", "Accessibility", "Cookies"]} />
          
          <div className="hidden lg:block lg:col-span-1"></div>

          <div className="flex flex-col justify-between items-end">
            <div className="flex gap-4">
              <SocialCircle icon={<Icons.Instagram />} />
              <SocialCircle icon={<Icons.Twitter />} />
              <SocialCircle icon={<Icons.Facebook />} />
            </div>
            
            <button 
              onClick={scrollToTop}
              className="group flex items-center gap-4 text-[10px] tracking-[0.4em] uppercase text-white/30 hover:text-white transition-all"
            >
              <span>To Top</span>
              <div className="p-2 border border-white/10 rounded-full group-hover:bg-white group-hover:text-black transition-all">
                <Icons.ArrowUp />
              </div>
            </button>
          </div>
        </div>

        {/* SECTION 3: THE BRAND MARK */}
        <div className="pt-8 border-t border-white/5">
          <div className="overflow-hidden mb-12">
            <h1 className="text-[18vw] leading-[0.75] font-bold tracking-tighter text-white/[0.02] text-center select-none uppercase">
              Snitch
            </h1>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] tracking-[0.3em] text-white/20 uppercase">
            <p>© 2024 Snitch Atelier — Bengaluru, India</p>
            <div className="flex gap-8">
              <p>Designed by Atelier Labs</p>
              <p className="hidden md:block">Built for the Modern Era</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function NavColumn({ title, links }) {
  return (
    <div className="flex flex-col space-y-8">
      <h5 className="text-[10px] tracking-[0.4em] uppercase text-white/30 font-medium italic">{title}</h5>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link} className="group overflow-hidden">
            <a href="#" className="inline-block text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-transform duration-500 hover:-translate-y-px">
              {link}
            </a>
            <div className="h-px w-0 bg-white/40 transition-all duration-500 group-hover:w-full"></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialCircle({ icon }) {
  return (
    <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:border-white hover:text-white hover:bg-white/5 transition-all duration-500">
      {icon}
    </a>
  );
}