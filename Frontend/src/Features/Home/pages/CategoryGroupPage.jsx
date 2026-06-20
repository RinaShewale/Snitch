import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, LayoutGrid } from "lucide-react";
import { useProduct } from "../../products/hooks/useProduct";

const GROUP_MAP = {
  apparel: ["topwear", "bottomwear", "co-ords", "kurtas", "ethnic", "western", "outerwear"],
  collections: ["new", "best-sellers", "trending", "sale"],
  lifestyle: ["comfort", "occasion", "party-wear", "office-wear"],
  bags: ["handbags", "tote-bags", "crossbody-bags", "backpacks", "clutches"],
  footwear: ["sneakers", "sandals", "heels", "flats", "boots"],
  accessories: ["jewellery", "watches", "hair-accessories", "belts", "sunglasses"],
};

export default function CategoryGroupPage() {
  const { group } = useParams();
  const navigate = useNavigate();
  const { handleGetCategories } = useProduct();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const decodedGroup = useMemo(() => group?.toLowerCase(), [group]);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await handleGetCategories();
        if (!isMounted) return;
        const allowed = GROUP_MAP[decodedGroup] || [];
        const filtered = (data || []).filter((cat) => allowed.includes(cat.id));
        setCategories(filtered);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, [decodedGroup]);

  if (loading) return (
    <div className="h-screen bg-[#f8f5f2] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-neutral-900">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-6 md:py-10">
        
        {/* ONE-LINE NAVIGATION HEADER */}
        <header className="relative flex items-center justify-between mb-12 md:mb-20">
          
          {/* LEFT: BACK BUTTON */}
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors z-10"
          >
            <ChevronLeft size={14} strokeWidth={2.5} /> 
            Back
          </button>

          {/* CENTER: TITLE (Absolute center for perfect alignment) */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic capitalize leading-none">
              {decodedGroup}
            </h1>
            <p className="hidden md:block text-[9px] text-neutral-400 tracking-[0.3em] uppercase mt-3 font-medium opacity-70">
              Curated selection for your style
            </p>
          </div>

          {/* RIGHT: EXPLORE TAG */}
          <div className="flex items-center gap-3 text-neutral-400 z-10">
             <LayoutGrid size={14} className="opacity-50" />
             <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
               Explore <span className="mx-1 text-neutral-300">/</span> <span className="text-neutral-900">{decodedGroup}</span>
             </span>
          </div>
        </header>

        {/* CATEGORY GRID */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12">
            {categories.map((cat) => (
              <div
                key={cat._id || cat.id}
                onClick={() => navigate(`/products/${cat.id || cat._id}`)}
                className="group cursor-pointer flex flex-col items-center"
              >
                {/* IMAGE CARD */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.8rem] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>

                {/* CENTERED TEXT */}
                <div className="mt-5 text-center px-2">
                  <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-800 transition-colors group-hover:text-black">
                    {cat.label}
                  </h3>
                  <div className="mt-2 flex justify-center">
                    <div className="w-0 h-[1.2px] bg-black transition-all duration-500 group-hover:w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/50 rounded-[2.5rem] border border-neutral-200/50">
             <p className="text-neutral-400 text-[10px] uppercase tracking-widest">No categories found</p>
             <Link to="/" className="inline-block mt-6 text-[10px] font-bold border-b border-black pb-1">Return Home</Link>
          </div>
        )}

      </div>
    </div>
  );
}