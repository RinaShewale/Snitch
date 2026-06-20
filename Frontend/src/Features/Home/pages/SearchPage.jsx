import React, { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Search as SearchIcon, 
  SlidersHorizontal, 
  ChevronDown, 
  X, 
  Check, 
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { CATEGORY_DATA } from "../../../Features/data/categoryData"; // Adjust path as needed

export default function SearchPage() {
  const location = useLocation();
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const reduxSearchProducts = useSelector((state) => state.product?.searchProducts || []);
  const stateResults = location.state?.results || [];
  const searchQuery = location.state?.query || "";

  const rawProducts = useMemo(() => {
    if (Array.isArray(stateResults) && stateResults.length > 0) return stateResults;
    return Array.isArray(reduxSearchProducts) ? reduxSearchProducts : [];
  }, [stateResults, reduxSearchProducts]);

  const processedProducts = useMemo(() => {
    let items = [...rawProducts];
    if (selectedCategory !== "all") {
      items = items.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (sortBy === "low-high") items.sort((a, b) => (a.price?.amount || a.price) - (b.price?.amount || b.price));
    if (sortBy === "high-low") items.sort((a, b) => (b.price?.amount || b.price) - (a.price?.amount || a.price));
    return items;
  }, [rawProducts, sortBy, selectedCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchQuery]);

  return (
    <div className="bg-white min-h-screen text-neutral-900 overflow-x-hidden">
      
      {/* --- RESPONSIVE FILTER DRAWER --- */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1000]"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[1001] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0">
                <h2 className="text-2xl font-serif">Refine Search</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
                {/* All Products Reset */}
                <button 
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left py-3 px-4 rounded-xl flex justify-between items-center transition-all ${selectedCategory === 'all' ? 'bg-black text-white' : 'hover:bg-neutral-100'}`}
                >
                  <span className="font-bold text-sm uppercase tracking-widest">All Collections</span>
                  {selectedCategory === 'all' && <Check size={16} />}
                </button>

                {CATEGORY_DATA.map((group) => (
                  <div key={group.group}>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">{group.group}</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {group.items.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setSelectedCategory(item.value)}
                          className={`group flex items-center justify-between p-3 rounded-xl transition-all ${
                            selectedCategory === item.value ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-neutral-50 text-neutral-600'
                          }`}
                        >
                          <span className="text-sm">{item.label}</span>
                          {selectedCategory === item.value ? <Check size={16} /> : <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t bg-neutral-50">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-transform"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-[1440px] bg-[#FAFAFA] mx-auto px-5 md:px-10 py-10">
        
        {/* --- HEADER --- */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-[1px] w-8 bg-black" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">Search Discovery</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight">
              {searchQuery ? `"${searchQuery}"` : "New Collection"}
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold uppercase text-neutral-400">
            <span>{processedProducts.length} Items</span>
            <span className="h-4 w-[1px] bg-neutral-200" />
            <span>Sorted by {sortBy.replace('-', ' ')}</span>
          </div>
        </header>

        {/* --- STICKY TOOLBAR --- */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-y border-neutral-100 -mx-5 md:-mx-10 px-5 md:px-10 py-4 mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-black transition-all text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/10"
            >
              <SlidersHorizontal size={14} /> 
              Filters
              {selectedCategory !== "all" && <span className="ml-1 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-neutral-100 pl-6 pr-10 py-3 rounded-full text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-neutral-200 transition-all"
              >
                <option value="newest">Sort: Newest</option>
                <option value="low-high">Price: Low - High</option>
                <option value="high-low">Price: High - Low</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {processedProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-16">
            <AnimatePresence mode='popLayout'>
              {processedProducts.map((product, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={product._id}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-neutral-100 mb-6 group-hover:shadow-2xl transition-all duration-500">
                    <Link to={`/product/${product._id}`}>
                      <img 
                        src={product.images?.[0]?.url || "https://via.placeholder.com/600x800"} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        alt={product.title} 
                      />
                    </Link>
                    
                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                       <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm">New Arrival</span>
                    </div>

                    <button className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white translate-y-2 group-hover:translate-y-0 shadow-lg">
                      <Heart size={18} />
                    </button>

                    <button className="absolute bottom-4 left-4 right-4 bg-black text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center justify-center gap-2">
                      <ShoppingBag size={14} /> Quick Add
                    </button>
                  </div>

                  <div className="px-2">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xs font-black uppercase tracking-widest truncate max-w-[70%]">{product.title}</h3>
                      <p className="text-sm font-serif font-bold italic">₹{(product.price?.amount || product.price).toLocaleString()}</p>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">{product.category}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-32 text-center max-w-sm mx-auto">
             <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon className="text-neutral-200" size={32} />
             </div>
             <h2 className="text-xl font-serif mb-2">No matches found</h2>
             <p className="text-neutral-500 text-sm mb-8">We couldn't find any products matching your specific selection. Try clearing filters.</p>
             <button 
                onClick={() => {setSelectedCategory("all"); setSortBy("newest")}}
                className="px-8 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full"
             >
                Reset All Filters
             </button>
          </div>
        )}
      </main>
    </div>
  );
}