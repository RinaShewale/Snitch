import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const SkeletonCard = () => (
  <div className="bg-[#f5f1ec]/30 p-2 border border-[#1a1714]/5 animate-pulse">
    <div className="aspect-[3/4] bg-[#ded7d0]/30" />
    <div className="p-4 space-y-3">
      <div className="h-2 bg-[#ded7d0]/40 rounded w-16" />
      <div className="h-3 bg-[#ded7d0]/40 rounded w-4/5" />
      <div className="h-3 bg-[#ded7d0]/40 rounded w-2/5" />
    </div>
  </div>
);

const ProductGrid = ({ products = [], loading = false }) => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  // Filter to only show the first 12 products
  const displayedProducts = products.slice(0, 12);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Use displayedProducts.length for the check
      if (!loading && displayedProducts.length > 0) {
        // Header animation
        gsap.fromTo(
          headerRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none"
            },
          }
        );

        // Staggered card entrance
        const cards = gridRef.current?.querySelectorAll(".product-card-wrapper");
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 85%",
                toggleActions: "play none none none"
              },
            }
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, displayedProducts.length]); // Dependency on length of sliced items

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-20 lg:py-24 bg-[#ffffff] relative border-t border-[#1a1714]/5 overflow-hidden"
    >
      <div className="absolute inset-y-0 left-6 xl:left-12 w-[1px] bg-[#1a1714]/3 pointer-events-none hidden lg:block"></div>
      <div className="absolute inset-y-0 right-6 xl:right-12 w-[1px] bg-[#1a1714]/3 pointer-events-none hidden lg:block"></div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 relative z-10">

        <div
          ref={headerRef}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 space-y-6 md:space-y-0"
        >
          <div className="space-y-2 md:space-y-3">
            <p className="text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase text-[#1a1714]/50">
              CURATED SELECTION
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#1a1714] font-medium leading-tight">
              Best of SNITCH
              <span className="block sm:inline italic font-light text-[#ded7d0] sm:ml-3">Trending.</span>
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#1a1714] pb-1 border-b border-[#1a1714] hover:opacity-60 transition hidden sm:inline-block"
          >
            VIEW ALL PIECES
          </Link>
        </div>

        {loading ? (
          /* Loading State - Showing 12 Skeletons to match requirement */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          /* Data State - Using the sliced 12 products */
          <div
            ref={gridRef}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12 lg:gap-x-8"
          >
            {displayedProducts.map((product, idx) => (
              <div key={product._id || idx} className="product-card-wrapper">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-neutral-200 rounded-xl">
            <p className="font-serif text-xl md:text-2xl text-neutral-400 italic">No products found in this selection.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-[10px] font-bold uppercase tracking-widest underline"
            >
              Refresh Page
            </button>
          </div>
        )}

        {!loading && displayedProducts.length > 0 && (
          <div className="sm:hidden mt-10">
            <Link
              to="/shop"
              className="flex items-center justify-center w-full py-4 border border-[#1a1714] text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-[#1a1714] hover:text-[#f5f1ec] transition-all active:scale-[0.98]"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;