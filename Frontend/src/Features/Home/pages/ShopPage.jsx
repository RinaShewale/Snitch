import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Search, X, SlidersHorizontal, ArrowUp } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useProduct } from "../../products/hooks/useProduct";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  const { handleGetAllProducts } = useProduct();
  const { scrollY } = useScroll();

  // Show floating search after scrolling 300px
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 300) setShowFloatingNav(true);
    else setShowFloatingNav(false);
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await handleGetAllProducts("all");
        setProducts(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const processedProducts = useMemo(() => {
    let items = [...products];
    if (searchQuery) {
      items = items.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortBy === "low-high") items.sort((a, b) => (a.price?.amount || a.price) - (b.price?.amount || b.price));
    if (sortBy === "high-low") items.sort((a, b) => (b.price?.amount || b.price) - (a.price?.amount || a.price));
    return items;
  }, [products, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1a1714] selection:bg-black selection:text-white transition-colors duration-500">
      
      {/* --- 1. DYNAMIC FLOATING SEARCH BAR --- */}
      <AnimatePresence>
        {(showFloatingNav || isSearchFocused || searchQuery) && (
          <motion.div 
            initial={{ y: -100, x: "-50%", opacity: 0 }}
            animate={{ y: 24, x: "-50%", opacity: 1 }}
            exit={{ y: -100, x: "-50%", opacity: 0 }}
            className="fixed left-1/2 z-[1000] w-[90%] max-w-[500px]"
          >
            <div className={`relative flex items-center bg-white/70 backdrop-blur-2xl border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-full px-5 py-3 transition-all duration-500 ${isSearchFocused ? 'ring-4 ring-black/5 max-w-[600px]' : ''}`}>
              <Search size={16} className={`${isSearchFocused ? 'text-black' : 'text-neutral-400'} transition-colors`} />
              <input 
                type="text"
                placeholder="Search pieces..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none px-3 text-[13px] font-medium tracking-tight placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="p-1 hover:bg-neutral-100 rounded-full transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 2. HERO SECTION --- */}
      <header className="pt-40 pb-20 px-6 md:px-16 max-w-[1800px] mx-auto">
        <div className="overflow-hidden">
            <motion.span 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-block text-[10px] font-black uppercase tracking-[0.5em] text-neutral-400 mb-4"
            >
              Curated Selection 01
            </motion.span>
        </div>
        <motion.h1 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[12vw] md:text-[8vw] font-serif leading-[0.8] tracking-tighter"
        >
         The Collection<span className="text-neutral-200">.</span>
        </motion.h1>

        {/* Inline Controls (visible only at top) */}
        <div className="mt-16 flex flex-wrap items-end justify-between gap-8 border-b border-neutral-100 pb-8">
           <div className="flex gap-10">
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Filter By</p>
                <div className="flex items-center gap-2 cursor-pointer group">
                  <SlidersHorizontal size={14} />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-[11px] font-bold uppercase tracking-[0.1em] outline-none appearance-none cursor-pointer"
                  >
                    <option value="newest">Sort: Newest</option>
                    <option value="low-high">Price: Low - High</option>
                    <option value="high-low">Price: High - Low</option>
                  </select>
                </div>
              </div>
           </div>

           {!isSearchFocused && !searchQuery && (
             <div className="hidden md:block">
                <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2 rounded-full border border-neutral-100">
                  <Search size={14} className="text-neutral-400" />
                  <input 
                    type="text" 
                    placeholder="Search collection..." 
                    className="bg-transparent text-[11px] font-medium outline-none w-40"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
             </div>
           )}
        </div>
      </header>

      {/* --- 3. PRODUCT GRID --- */}
      <main className="px-6 md:px-16 max-w-[1800px] mx-auto pb-40">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[3/4] bg-neutral-100 rounded-sm" />
                <div className="h-3 w-2/3 bg-neutral-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Counter */}
            <div className="mb-12 flex items-center justify-between">
               <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                 Showing {processedProducts.length} of {products.length} Results
               </p>
            </div>

            <AnimatePresence mode="popLayout">
              {processedProducts.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-12 gap-y-16 md:gap-y-24"
                >
                  {processedProducts.map((product, idx) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (idx % 4) * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-40 text-center"
                >
                  <p className="font-serif text-3xl italic text-neutral-300">Nothing matched your criteria.</p>
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:text-neutral-500 transition-colors"
                  >
                    Reset Filter
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </main>

      {/* --- 4. BACK TO TOP BUTTON --- */}
      <footer className="py-20 flex flex-col items-center justify-center border-t border-neutral-100">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
            <ArrowUp size={18} strokeWidth={1.5} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">To the top</span>
        </button>
      </footer>
    </div>
  );
};

export default ShopPage;