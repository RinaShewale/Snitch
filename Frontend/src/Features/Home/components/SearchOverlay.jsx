import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../products/hooks/useProduct";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Search, 
  Sparkles, 
  Zap, 
  History, 
  ShoppingBag,
  Trash2,
  TrendingUp,
  ChevronRight
} from "lucide-react";

const MOODS = [
  { name: "Minimalist", color: "from-slate-50 to-slate-100", border: "border-slate-200", icon: "☁️" },
  { name: "Streetwear", color: "from-orange-50 to-orange-100", border: "border-orange-200", icon: "🔥" },
  { name: "Eco-Friendly", color: "from-emerald-50 to-emerald-100", border: "border-emerald-200", icon: "🌿" },
  { name: "Luxury", color: "from-purple-50 to-purple-100", border: "border-purple-200", icon: "💎" },
];

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(["Vintage Tees", "Leather Boots", "Winter 24"]);

  const navigate = useNavigate();
  const { handleSearchSimilarProducts } = useProduct();
  const searchProducts = useSelector((state) => state.product.searchProducts || []);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [onClose, isOpen]);

  const handleSearch = async (searchTerm) => {
    const term = searchTerm || query;
    if (!term.trim()) return;

    setLoading(true);
    const results = await handleSearchSimilarProducts(term);
    setLoading(false);

    if (!history.includes(term)) {
      setHistory([term, ...history].slice(0, 5));
    }

    onClose();
    navigate("/search", { state: { results: results || [], query: term } });
  };

  const handleClickProduct = (item) => {
    onClose();
    navigate(`/product/${item._id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/40 backdrop-blur-md p-0 md:p-4"
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-[#FAFAFA] w-full h-full md:h-auto md:max-w-3xl md:rounded-[2.5rem] md:shadow-2xl flex flex-col overflow-hidden"
          >
            {/* --- HEADER --- */}
            <div className="pt-8 px-6 pb-6 md:p-8 border-b border-neutral-100 bg-white">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    {loading ? (
                      <Zap size={20} className="text-indigo-500 animate-pulse fill-indigo-500" />
                    ) : (
                      <Search size={20} className="text-neutral-400 group-focus-within:text-indigo-500 transition-colors" />
                    )}
                  </div>
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search styles, trends..."
                    className="w-full bg-[#FAFAFA] border-none py-4 pl-12 pr-4 rounded-2xl text-base md:text-lg font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <button 
                  onClick={onClose} 
                  className="p-3 hover:bg-neutral-100 rounded-2xl transition-colors"
                >
                  <X size={24} className="text-neutral-500" />
                </button>
              </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:max-h-[60vh] custom-scrollbar">
              {!query ? (
                <div className="space-y-12">
                  {/* Shop By Mood */}
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles size={16} className="text-amber-500 fill-amber-500" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">Curated Moods</h3>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {MOODS.map((mood) => (
                        <button
                          key={mood.name}
                          onClick={() => handleSearch(mood.name)}
                          className={`bg-gradient-to-br ${mood.color} ${mood.border} border p-5 md:p-7 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:shadow-xl hover:-translate-y-1 transition-all group`}
                        >
                          <span className="text-3xl group-hover:scale-125 transition-transform">{mood.icon}</span>
                          <span className="text-[10px] font-bold text-neutral-800 uppercase tracking-widest">{mood.name}</span>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* History & Trending */}
                  <div className="grid md:grid-cols-2 gap-12">
                    {history.length > 0 && (
                      <section>
                        <div className="flex justify-between items-center mb-5">
                          <div className="flex items-center gap-2">
                            <History size={14} className="text-neutral-400" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Recent Searches</h3>
                          </div>
                          <button onClick={() => setHistory([])} className="p-1 text-neutral-300 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {history.map((item) => (
                            <button
                              key={item}
                              onClick={() => handleSearch(item)}
                              className="px-5 py-2.5 bg-white border border-neutral-200 rounded-full text-xs font-semibold hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </section>
                    )}

                    <section>
                      <div className="flex items-center gap-2 mb-5">
                        <TrendingUp size={14} className="text-neutral-400" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Trending Now</h3>
                      </div>
                      <div className="space-y-4">
                        {["Oversized Blazers", "Metallic Finish", "Eco-Leather Bag"].map(item => (
                          <div 
                            key={item} 
                            onClick={() => handleSearch(item)} 
                            className="flex items-center justify-between text-sm font-semibold text-neutral-600 hover:text-indigo-600 cursor-pointer group"
                          >
                            {item}
                            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-500" />
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              ) : (
                /* Search Results */
                <div className="space-y-6">
                   <div className="flex justify-between items-end px-2">
                    <p className="text-sm text-neutral-500">Results for <span className="text-neutral-900 font-bold italic">"{query}"</span></p>
                    {searchProducts.length > 0 && (
                      <button onClick={() => handleSearch()} className="text-[10px] font-black text-indigo-600 tracking-widest uppercase hover:underline">View All {searchProducts.length}</button>
                    )}
                  </div>

                  {searchProducts.length > 0 ? (
                    <div className="grid gap-4">
                      {searchProducts.slice(0, 5).map((item, i) => (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={item._id}
                          onClick={() => handleClickProduct(item)}
                          className="group flex items-center gap-5 p-3.5 rounded-[1.5rem] bg-white border border-neutral-100 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 cursor-pointer transition-all"
                        >
                          <div className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-50">
                            <img
                              src={item.images?.[0]?.url || "https://via.placeholder.com/100"}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              alt=""
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">{item.category}</p>
                            <h4 className="font-bold text-sm md:text-base text-neutral-800 truncate group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                            <p className="font-bold text-neutral-900 text-sm mt-1">₹{item.price?.amount || item.price}</p>
                          </div>
                          <div className="mr-2 p-3 rounded-full bg-[#FAFAFA] text-neutral-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <ShoppingBag size={18} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : !loading && (
                    <div className="text-center py-20">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm border border-neutral-100">🏜️</div>
                      <h4 className="text-xl font-bold text-neutral-800">No matches found</h4>
                      <p className="text-neutral-400 text-sm mt-2 max-w-xs mx-auto">We couldn't find anything for that. Try searching for something else like "Summer Dress".</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* --- FOOTER (DESKTOP) --- */}
            <div className="hidden md:flex items-center justify-between p-6 px-10 bg-white border-t border-neutral-100">
               <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    <span className="px-2 py-1 rounded-md border border-neutral-200 bg-[#FAFAFA] text-neutral-500 font-mono">ESC</span> Close
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    <span className="px-2 py-1 rounded-md border border-neutral-200 bg-[#FAFAFA] text-neutral-500 font-mono">ENTER</span> Search
                  </div>
               </div>
               <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> AI Discovery Mode
               </div>
            </div>

            {/* --- FOOTER (MOBILE) --- */}
            <div className="md:hidden p-6 bg-white border-t border-neutral-100">
              <button 
                onClick={() => handleSearch()}
                disabled={!query}
                className="w-full h-14 bg-neutral-900 disabled:bg-neutral-200 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-neutral-200"
              >
                <Search size={18} /> View Results
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}