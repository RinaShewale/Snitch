import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Editorial() {
  const containerRef = useRef(null);
  const leftImageRef = useRef(null);
  const leftContainerRef = useRef(null);
  const rightImageRef = useRef(null);
  const rightContainerRef = useRef(null);
  const textGroupRef = useRef(null);
  const decoLinesRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // 1. Image Reveal (Clip Path Animation)
      gsap.fromTo([leftContainerRef.current, rightContainerRef.current], 
        { clipPath: "inset(100% 0% 0% 0%)" },
        { 
          clipPath: "inset(0% 0% 0% 0%)", 
          duration: 1.5, 
          ease: "power4.inOut",
          stagger: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );

      // 2. Parallax - Smooth Scrubbing
      gsap.to(leftImageRef.current, {
        yPercent: 15,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

      gsap.to(rightImageRef.current, {
        yPercent: -15,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

      // 3. Text Reveal Stagger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: textGroupRef.current,
          start: "top 85%",
        }
      });

      tl.from(".reveal-text", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.1
      }, 0.2);

      // 4. Decorative Corner Lines Animation
      gsap.from(".deco-line", {
        width: 0,
        height: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="py-16 md:py-24 lg:py-32 px-6 lg:px-12 bg-[#f5f1ec] relative overflow-hidden border-t border-[#1a1714]/5"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left Column: Large Model Image */}
        <div className="lg:col-span-5 relative order-2 lg:order-1">
          <div 
            ref={leftContainerRef} 
            className="relative aspect-[4/5] md:aspect-[3/4] w-full overflow-hidden border border-[#1a1714]/10"
          >
            <img 
              ref={leftImageRef}
              src="https://i.pinimg.com/736x/1e/07/7a/1e077ac62c6032d3b19f5ada41bbecf1.jpg" 
              className="absolute inset-0 w-full h-[130%] object-cover object-center will-change-transform" 
              alt="Editorial model" 
            />
            {/* Inner Grid Lines */}
            <div className="absolute inset-x-0 bottom-1/4 border-b border-white/20 pointer-events-none"></div>
            <div className="absolute inset-y-0 left-1/4 border-r border-white/20 pointer-events-none"></div>
          </div>
          
          {/* Corner details */}
          <div className="deco-line absolute -top-3 -left-3 w-10 h-10 border-t border-l border-[#1a1714]/30"></div>
          <div className="deco-line absolute -bottom-3 -right-3 w-10 h-10 border-b border-r border-[#1a1714]/30"></div>
        </div>

        {/* Right Column: Text & Detail Image */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-12 md:space-y-20 order-1 lg:order-2">
          
          {/* Text Group */}
          <div ref={textGroupRef} className="space-y-6 lg:max-w-[600px]">
            <p className="reveal-text text-[10px] tracking-[0.5em] uppercase text-[#1a1714]/50">
              Philosophy of Tailoring
            </p>
            
            <h2 className="reveal-text font-serif text-5xl sm:text-7xl lg:text-[84px] text-[#1a1714] font-medium leading-[0.9] tracking-tighter">
              SNITCH<span className="italic font-light text-[#c2b8ae] ml-2">Atelier</span>
            </h2>
            
            <p className="reveal-text font-serif text-xl sm:text-2xl italic text-[#1a1714]/80 leading-relaxed pt-4">
              “It is more than apparel. It is a dialogue between fabric, form, and character.”
            </p>
            
            <p className="reveal-text text-[14px] md:text-[15px] text-[#1a1714]/60 leading-relaxed font-light max-w-lg">
              At Snitch, we view fashion as a quiet study in texture and form. Every line is an intentional gesture, 
              every button placement a statement. We craft contemporary pieces tailored for individuals who command 
              their presence with minimal effort.
            </p>
            
            <div className="reveal-text pt-4">
              <button className="group relative text-[11px] uppercase tracking-[0.3em] font-bold text-[#1a1714] inline-block">
                <span className="relative z-10">Discover Our Story</span>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#1a1714] origin-right scale-x-100 transition-transform duration-500 group-hover:scale-x-0 group-hover:origin-left"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#1a1714] origin-left scale-x-0 transition-transform duration-500 delay-100 group-hover:scale-x-100"></div>
              </button>
            </div>
          </div>

          {/* Macro Image */}
          <div 
            ref={rightContainerRef}
            className="relative aspect-video w-full overflow-hidden border border-[#1a1714]/10 max-w-[580px] self-end lg:mr-12"
          >
            <img 
              ref={rightImageRef}
              src="https://i.pinimg.com/1200x/ef/a0/1f/efa01f88461b9d18d81adcedcc601f5e.jpg" 
              className="absolute inset-0 w-full h-[140%] object-cover object-center will-change-transform" 
              alt="Fabric detail" 
            />
            {/* Visual Tint */}
            <div className="absolute inset-0 bg-[#1a1714]/5"></div>
          </div>

        </div>
      </div>
    </section>
  );
}