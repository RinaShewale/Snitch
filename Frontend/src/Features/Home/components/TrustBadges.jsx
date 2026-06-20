import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Truck, RotateCcw, Shield, CreditCard } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const badges = [
  {
    icon: Truck,
    title: "Worldwide Shipping",
    desc: "Complementary shipping on orders over ₹5,000",
  },
  {
    icon: RotateCcw,
    title: "Atelier Returns",
    desc: "Returns accepted within 15 days of delivery",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    desc: "Sourced from the finest local and global mills",
  },
  {
    icon: CreditCard,
    title: "Secure Checkouts",
    desc: "Fully encrypted secure payment gateways",
  },
];

const TrustBadges = () => {
  const sectionRef = useRef(null);
  const badgesRef = useRef([]);

  useEffect(() => {
    const items = badgesRef.current.filter(Boolean);

    gsap.fromTo(
      items,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          toggleActions: "play none none none"
        },
      }
    );
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-16 bg-[#ffffff] border-y border-[#1a1714]/5 relative overflow-hidden"
    >
      {/* Decorative vertical lines simulating a grid layout */}
      <div className="absolute inset-y-0 left-12 w-[1px] bg-[#1a1714]/3 pointer-events-none hidden lg:block"></div>
      <div className="absolute inset-y-0 right-12 w-[1px] bg-[#1a1714]/3 pointer-events-none hidden lg:block"></div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                ref={(el) => (badgesRef.current[idx] = el)}
                className="flex items-start gap-4 group cursor-default border-b border-[#1a1714]/5 last:border-0 md:border-b-0 pb-6 md:pb-0"
              >
                {/* Minimalist circular icon box */}
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-[#1a1714]/15 rounded-full group-hover:border-[#1a1714] group-hover:bg-[#1a1714] transition-all duration-500">
                  <Icon
                    size={16}
                    strokeWidth={1.25}
                    className="text-[#1a1714] group-hover:text-[#f5f1ec] transition-colors duration-500"
                  />
                </div>

                {/* Editorial text labels */}
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-[11px] font-semibold text-[#1a1714] tracking-[0.2em] uppercase">
                    {badge.title}
                  </p>
                  <p className="text-[11px] text-[#1a1714]/50 font-light leading-relaxed">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
