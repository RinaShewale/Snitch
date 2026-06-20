import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NewSeasonBanner = () => {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const textContainerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // 1. IMAGE REVEAL (Clip-path mask)
      // This makes the image "slide" open from the right
      gsap.fromTo(
        imageContainerRef.current,
        { clipPath: "inset(0% 0% 0% 100%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%", 
          },
        }
      );

      // 2. IMAGE ZOOM & PARALLAX
      // As you scroll, the image scales and moves
      gsap.to(imageRef.current, {
        scale: 1.2,
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // 3. TEXT ENTRANCE TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
        },
      });

      tl.from(".reveal-item", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#f8f7f5] overflow-hidden"
    >
      <div className="flex flex-col md:flex-row min-h-[80vh] md:h-[90vh]">
        
        {/* TEXT SIDE */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-16 md:px-16 lg:px-24 order-2 md:order-1">
          <div ref={textContainerRef} className="max-w-md">
            <span className="reveal-item inline-block text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-4">
              Summer / Autumn 2024
            </span>
            
            <h2 className="reveal-item text-5xl lg:text-7xl font-serif text-[#1a1714] leading-[1.1] mb-6">
              New Season <br /> 
              <span className="italic font-light opacity-70">Arrivals</span>
            </h2>
            
            <p className="reveal-item text-gray-600 text-base leading-relaxed mb-8">
              A curated selection of minimalist essentials designed for the modern transition. 
              Quality fabrics meet timeless silhouettes.
            </p>
            
            <div className="reveal-item">
              <button className="group relative border-b border-[#1a1714] pb-1 text-[11px] tracking-widest uppercase font-bold transition-all">
                Shop the collection
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all group-hover:w-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* IMAGE SIDE */}
        <div 
          ref={imageContainerRef}
          className="w-full md:w-1/2 h-[60vh] md:h-full overflow-hidden order-1 md:order-2 bg-gray-200"
        >
          <img
            ref={imageRef}
            src="https://i.pinimg.com/736x/96/d1/99/96d1991f2cf1041ca2567e80e1582e0d.jpg"
            alt="New Season"
            className="w-full h-[120%] object-cover object-bottom will-change-transform"
          />
        </div>

      </div>
    </section>
  );
};

export default NewSeasonBanner;