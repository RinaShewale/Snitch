import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const slides = [
  {
    id: 1,
    tag: "New Season Drop",
    title: "Elegant",
    italic: "Style",
    img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1200&q=90",

    color: "#E6E0D4"
  },
  {
    id: 2,
    tag: "Seasonal Trend",
    title: "Fresh",
    italic: "Outfits",
    img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=90",
    color: "#D7CCC8"
  },
  {
    id: 3,
    tag: "Limited Edition",
    title: "Modern",
    italic: "Heritage",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90",
    color: "#F5F1EC"
  }
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const progressRef = useRef(null);
  const containerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    // Reset and restart progress bar
    gsap.fromTo(progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 5, ease: "none", onComplete: nextSlide }
    );

    const ctx = gsap.context(() => {
      // Smooth Text Animation
      gsap.fromTo(".hero-title",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1 }
      );

      // Smooth Image Reveal (The "Fix")
      // We target the current active image specifically
      gsap.fromTo(`.slide-img-${index}`,
        { clipPath: "inset(0 0 0 100%)", scale: 1.2 },
        {
          clipPath: "inset(0 0 0 0%)",
          scale: 1,
          duration: 1.8,
          ease: "expo.inOut"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [index, nextSlide]);

  return (
    <section ref={containerRef} className="relative w-full h-[100vh] bg-[#f5f1ec] overflow-hidden flex items-center">
      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
        <h2 className="text-[25vw] font-serif font-bold text-[#4a3728]/5 uppercase whitespace-nowrap">
          SNITCH
        </h2>
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-12">

        {/* Left: Text Content */}
        <div className="lg:col-span-5 z-20 order-2 lg:order-1">
          <div className="space-y-6">
            <span className="hero-title inline-block text-[10px] tracking-[0.5em] uppercase text-[#4a3728]/60 font-bold">
              {slides[index].tag}
            </span>
            <h1 className="font-serif text-[12vw] lg:text-[7vw] leading-[0.9] text-[#4a3728]">
              <span className="hero-title block">{slides[index].title}</span>
              <span className="hero-title block italic font-light pl-8 lg:pl-16">{slides[index].italic}.</span>
            </h1>
            <div className="hero-title flex items-center gap-8 pt-8">
              <button className="bg-[#4a3728] text-[#f5f1ec] px-10 py-4 text-[11px] uppercase tracking-widest hover:bg-[#2d241e] transition-colors">
                Shop Collection
              </button>
              <button className="text-[#4a3728] text-[11px] uppercase tracking-widest border-b border-[#4a3728] pb-1 hover:opacity-50 transition">
                Lookbook
              </button>
            </div>
          </div>
        </div>

        {/* Right: Image Frame (Fixed for Smoothness) */}
        <div className="lg:col-span-7 relative h-[50vh] lg:h-[80vh] w-full order-1 lg:order-2">
          <div className="relative w-full h-full overflow-hidden shadow-2xl bg-[#D7CCC8]">
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className={`slide-img-${i} absolute inset-0 w-full h-full transition-opacity duration-500 ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
              >
                <img
                  src={slide.img}
                  className="w-full h-full object-cover object-top"
                  alt="Model"
                />
                <div className="absolute inset-0 bg-[#4a3728]/5 mix-blend-multiply" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Progress */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#4a3728]/10">
        <div ref={progressRef} className="h-full bg-[#4a3728] origin-left" />
      </div>
    </section>
  );
}