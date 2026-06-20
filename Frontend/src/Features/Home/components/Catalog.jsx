import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from './ProductCard';
import { useProduct } from "../../products/hooks/useProduct"; // Path to your hook

gsap.registerPlugin(ScrollTrigger);

const categories = ["All", "Suits", "Dresses", "Shirts", "Pants", "Knitwear", "Accessories"];

export default function Catalog() {
  const container = useRef(null);
  const gridRef = useRef(null);
  const { handleGetAllProducts } = useProduct();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("All");

  // Fetch real data from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await handleGetAllProducts();
        if (data) setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter logic updated for backend schema: product.category
  const filteredProducts = activeCat === "All"
    ? products
    : products.filter(p => p.category?.toLowerCase() === activeCat.toLowerCase());

  useLayoutEffect(() => {
    if (loading || filteredProducts.length === 0) return;

    let ctx = gsap.context(() => {
      gsap.from(".catalog-header", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        }
      });

      gsap.fromTo(".product-card-wrapper", 
        { y: 60, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.1, 
          ease: "power4.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, [activeCat, loading, products]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8f5f2]">
        <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse">Loading Collection</div>
    </div>
  );

  return (
    <section ref={container} className="py-24 px-6 lg:px-12 bg-[#f8f5f2] relative min-h-screen">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

      <div className="catalog-header flex flex-col xl:flex-row justify-between items-start xl:items-end mb-20 gap-8 max-w-[1440px] mx-auto relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-[#1a1714]"></div>
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#1a1714]">The Collection</p>
          </div>
          <h2 className="font-serif text-5xl lg:text-7xl text-[#1a1714] leading-tight">
            Curated <span className="italic font-light text-[#c5b9ad]">Style.</span>
          </h2>
        </div>

        <div className="flex flex-wrap gap-6 border-b border-[#1a1714]/10 pb-2 w-full xl:w-auto">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCat(cat)}
              className={`pb-2 text-[11px] uppercase tracking-[0.2em] font-semibold transition-all relative group ${
                activeCat === cat ? "text-[#1a1714]" : "text-[#1a1714]/40 hover:text-[#1a1714]"
              }`}
            >
              {cat}
              {activeCat === cat && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1a1714]"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 max-w-[1440px] mx-auto relative z-10">
        {filteredProducts.map((p) => (
          <div key={p._id || p.id} className="product-card-wrapper">
             <ProductCard product={p} />
          </div>
        ))}
      </div>

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-40">
          <p className="font-serif text-2xl italic text-[#1a1714]/30">Arrivals coming soon...</p>
        </div>
      )}
    </section>
  );
}