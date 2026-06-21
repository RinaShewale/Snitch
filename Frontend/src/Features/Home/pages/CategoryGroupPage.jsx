import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
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
  const decodedGroup = useMemo(() => group?.toLowerCase() || "collections", [group]);

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
    <div className="min-h-screen bg-[#f8f5f2] text-neutral-900 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-4 md:py-10">
        
        {/* HEADER SECTION - Matches Image */}
        <header className="flex items-center justify-between mb-6 md:mb-12 relative h-16">
          {/* LEFT: BACK */}
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-600 hover:text-black transition-colors"
          >
            <ChevronLeft size={14} strokeWidth={3} /> 
            Back
          </button>

          {/* CENTER: TITLE (Serif Italic) */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif italic capitalize">
              {decodedGroup}
            </h1>
          </div>

          {/* RIGHT: BREADCRUMB */}
          <div className="hidden xs:flex items-center text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
            <span className="hidden md:inline">Explore</span>
            <span className="mx-1 hidden md:inline">/</span>
            <span className="text-neutral-900">{decodedGroup}</span>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="bg-white/40 rounded-[2.5rem] md:rounded-[4rem] border border-white/20 min-h-[50vh] flex flex-col items-center justify-center px-6">
          {categories.length > 0 ? (
            /* CATEGORY GRID (Responsive 2 to 6 columns) */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8 w-full py-10">
              {categories.map((cat) => (
                <div
                  key={cat._id || cat.id}
                  onClick={() => navigate(`/products/${cat.id || cat._id}`)}
                  className="group cursor-pointer flex flex-col items-center"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-white shadow-sm transition-transform duration-500 hover:-translate-y-1">
                    <img
                      src={cat.img}
                      alt={cat.label}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-4 text-[10px] font-bold uppercase tracking-widest text-center">
                    {cat.label}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            /* EMPTY STATE - Matches Image exactly */
            <div className="text-center py-20">
              <p className="text-neutral-400 text-[11px] font-medium uppercase tracking-[0.15em] mb-4">
                No categories found
              </p>
              <Link 
                to="/" 
                className="inline-block text-[11px] font-bold border-b-2 border-black pb-0.5 uppercase tracking-wider hover:opacity-70 transition-opacity"
              >
                Return Home
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}