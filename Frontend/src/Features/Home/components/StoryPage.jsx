import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StoryPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Reset scroll to top on mount
    window.scrollTo(0, 0);

    let ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.reveal-section');

      sections.forEach((section) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            // Adjust start point for mobile: 85% is safer for smaller viewports
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.from(section.querySelectorAll('.img-reveal-wrapper'), {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 1.6,
          ease: 'power4.inOut',
          stagger: 0.25,
        })
          .from(
            section.querySelectorAll('.story-img'),
            {
              scale: 1.25,
              yPercent: 15,
              duration: 1.8,
              ease: 'power3.out',
            },
            '-=1.3'
          )
          .from(
            section.querySelectorAll('.text-reveal'),
            {
              y: 30,
              opacity: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: 'power3.out',
            },
            '-=1.2'
          );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="min-h-screen w-full bg-[#F9F8F6] text-[#1A1714] pb-20 md:pb-32 selection:bg-[#c2b8ae] overflow-x-hidden"
    >
      {/* Floating Vertical Label - Hidden on tablets/mobile to avoid overlap */}
      <div className="fixed right-4 xl:right-8 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none z-50">
        <span className="text-[10px] uppercase tracking-[1em] rotate-90 inline-block origin-right text-[#1A1714]/20 font-medium whitespace-nowrap">
          Snitch — Est. 2024 — Atelier
        </span>
      </div>

      {/* Hero Section */}
      <div className="reveal-section max-w-7xl mx-auto px-6 pt-24 md:pt-44">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-reveal block text-[11px] uppercase tracking-[0.5em] text-[#c2b8ae] font-serif mb-4 md:mb-6">
              I — GENESIS
            </span>
            <h1 className="text-reveal font-serif text-5xl sm:text-6xl md:text-8xl lg:text-[100px] xl:text-[115px] leading-[0.85] tracking-tight text-[#1A1714]">
              The Art <br />
              <span className="italic font-light text-[#c2b8ae] ml-6 md:ml-18 block mt-2">
                of Silence.
              </span>
            </h1>
          </div>

          <div className="lg:col-span-5 w-full flex justify-end">
            <div className="img-reveal-wrapper group relative aspect-[3/4] sm:aspect-[3/4.5] lg:aspect-[3/4] w-full max-w-[300px] md:max-w-[400px] lg:max-w-full overflow-hidden bg-[#efeeea]">
              <img
                src="https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?q=80&w=1170&auto=format&fit=crop"
                className="story-img absolute inset-0 w-full h-[120%] object-cover object-top grayscale-[15%] transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.04]"
                alt="Craft"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Section */}
      <div className="reveal-section max-w-7xl mx-auto px-6 mt-24 md:mt-56">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Order changes: Text first on mobile, Image first on desktop */}
          <div className="lg:col-span-7 lg:col-start-6 order-1 lg:order-2 space-y-8 md:space-y-12">
            <div className="space-y-6 max-w-xl">
              <span className="text-reveal block text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-[#1A1714]/40">
                II — Process
              </span>
              <h2 className="text-reveal text-3xl md:text-5xl lg:text-6xl font-serif leading-tight">
                Curated Imperfection.
              </h2>
              <div className="text-reveal h-[1px] w-16 md:w-20 bg-[#c2b8ae]"></div>
              <p className="text-reveal text-base md:text-xl text-[#1A1714]/80 leading-relaxed font-light">
                Our atelier doesn't aim for factory precision. We aim for
                human soul. Using heritage techniques from the 19th century,
                we ensure no two pieces react to the body the same way.
              </p>
              <p className="text-reveal text-sm text-[#1A1714]/60 leading-relaxed max-w-md">
                Each garment is numbered and signed by the master tailor. We
                use only natural fibers that breathe and age with you.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="img-reveal-wrapper group relative aspect-video lg:aspect-[4/5] w-full overflow-hidden bg-[#efeeea]">
              <img
                src="https://i.pinimg.com/736x/1e/07/7a/1e077ac62c6032d3b19f5ada41bbecf1.jpg"
                className="story-img absolute inset-0 w-full h-[120%] object-cover grayscale-[15%] transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.04]"
                alt="Detail"
              />
            </div>
            <p className="mt-6 md:mt-8 text-[10px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-widest text-[#1A1714]/40">
              Fig. 01 — Hand Finished Lapels
            </p>
          </div>
        </div>
      </div>

      {/* Material Study Section */}
      <div className="reveal-section max-w-7xl mx-auto px-6 mt-24 md:mt-56">
        <span className="text-reveal block text-[10px] uppercase tracking-[0.5em] text-[#1A1714]/40 mb-8 md:mb-12">
          III — Material
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-end">
          <div className="lg:col-span-7">
            <div className="img-reveal-wrapper group relative aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden bg-[#efeeea]">
              <img
                src="https://images.unsplash.com/photo-1649546786116-c10c6d4be27e?q=80&w=687&auto=format&fit=crop"
                className="story-img absolute inset-0 w-full h-[120%] object-cover grayscale-[15%] transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.04]"
                alt="Fabric weave"
              />
            </div>
            <p className="mt-4 md:mt-6 text-[10px] md:text-[11px] uppercase tracking-widest text-[#1A1714]/40">
              Fig. 02 — Raw Selvedge Weave
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col md:flex-row lg:flex-col gap-8 items-start lg:items-end">
            <div className="img-reveal-wrapper group relative aspect-[4/5] w-full max-w-[280px] md:max-w-[320px] overflow-hidden bg-[#efeeea]">
              <img
                src="https://i.pinimg.com/736x/b1/01/05/b10105d70a93459cf790938c5b3a0215.jpg"
                className="story-img absolute inset-0 w-full h-[120%] object-cover grayscale-[15%] transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.04]"
                alt="Tailoring tools"
              />
            </div>
            <p className="text-reveal text-sm text-[#1A1714]/60 leading-relaxed max-w-xs lg:text-right">
              Undyed cotton and slow-spun wool, chosen for how they wear, not
              just how they arrive. <br className="hidden lg:block" /> Fig. 03 — Tools of the Bench.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="reveal-section mt-40 md:mt-60 text-center px-6">
        <div className="text-reveal text-[10px] uppercase tracking-[0.8em] md:tracking-[1em] mb-6 md:mb-8 opacity-40">
          Snitch Atelier
        </div>
        <h3 className="text-reveal font-serif text-4xl sm:text-5xl md:text-7xl italic text-[#c2b8ae]">
          Built to endure.
        </h3>
      </div>
    </section>
  );
}