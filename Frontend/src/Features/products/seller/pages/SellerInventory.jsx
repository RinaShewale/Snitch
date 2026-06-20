import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../../hooks/useProduct";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  Plus, Search, Edit3, Trash2,
  DollarSign, Layers, Loader2,
  ChevronRight, BarChart3, ArrowUpRight,
  Package
} from "lucide-react";

const SellerInventory = () => {
  const { handleGetSellerProduct, handleDeleteProduct } = useProduct();
  
  const { sellerProducts: products, loading } = useSelector(
    (state) => state.product
  );

  const containerRef = useRef(null);
  const hasAnimatedIn = useRef(false);
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeletingId, setIsDeletingId] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  // Format product data safely
  const safeProducts = useMemo(() => {
    return (products || []).map((p) => ({
      ...p,
      name: p.title || p.name || "Untitled Product",
      price: Number(p?.price?.amount || p?.priceAmount || 0),
      stock: Number(p?.stock) || p?.variants?.reduce((total, v) => total + (v.stock || 0), 0) || 0,
      sold: Number(p?.sold || 0),
      category: p?.category || "General",
    }));
  }, [products]);

  // Filter based on search
  const filteredProducts = useMemo(() => {
    return safeProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [safeProducts, searchTerm]);

  /**
   * GSAP Animation Logic
   * FIX: Removed 'safeProducts.length > 0' from the condition.
   * This ensures the Stats and Header show even if the user has 0 products.
   */
  useEffect(() => {
    if (!loading && !hasAnimatedIn.current) {
      const ctx = gsap.context(() => {
        gsap.from(".reveal-item", {
          y: 20,
          opacity: 0,
          stagger: 0.05,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.2,
          clearProps: "all" // Cleans up styles after animation
        });
      }, containerRef);
      
      hasAnimatedIn.current = true; 
      return () => ctx.revert();
    }
  }, [loading]); // Only depend on loading status

  // DELETE HANDLER
  const onDeleteClick = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from your collection?`)) {
      setIsDeletingId(id);
      try {
        await handleDeleteProduct(id);
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete product.");
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  // UPDATE HANDLER
  const onEditClick = (id) => {
    navigate(`/seller/create?edit=${id}`);
  };

  // Full screen loader
  if (loading && (!products || products.length === 0)) {
    return (
      <div className="min-h-screen bg-[#F8F8F7] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1A1A1A]" size={24} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F7] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-white pb-12" ref={containerRef}>
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 lg:py-12">
        
        {/* HEADER */}
        <header className="flex flex-col gap-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="reveal-item">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8E8E8C]">Management</span>
                <ChevronRight size={10} className="text-[#C2C2C0]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]">Inventory</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-[#1A1A1A]">
                Studio <span className="italic font-light text-[#717170]">Archive</span>
              </h1>
            </div>

            <button
              onClick={() => navigate("/seller/create")}
              className="reveal-item w-full md:w-auto bg-[#1A1A1A] text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:bg-[#333333] transition-all"
            >
              <Plus size={16} /> New Entry
            </button>
          </div>

          <div className="reveal-item relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A19F]" size={18} />
            <input
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E5E5E3] rounded-xl focus:border-[#1A1A1A] outline-none transition-all placeholder:text-[#A1A19F] text-sm"
              placeholder="Search collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* STATS - These will now always show/animate when loading is done */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-12">
          <StatCard 
            label="Total Sold" 
            value={safeProducts.reduce((a, b) => a + b.sold, 0)} 
            icon={<BarChart3 size={18} />} 
          />
          <StatCard 
            label="Estimated Value" 
            value={`$${safeProducts.reduce((a, b) => a + (b.price * b.stock), 0).toLocaleString()}`} 
            icon={<DollarSign size={18} />} 
          />
          <StatCard 
            label="Live Items" 
            value={safeProducts.length} 
            icon={<Layers size={18} />} 
            className="sm:col-span-2 lg:col-span-1" 
          />
        </div>

        {/* DESKTOP TABLE */}
        <div className="reveal-item hidden md:block bg-white border border-[#E5E5E3] rounded-2xl overflow-hidden shadow-[0_4px_20px_-12px_rgba(0,0,0,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1F1EF] text-[10px] uppercase tracking-[0.15em] text-[#717170] bg-[#FAFAFA]">
                  <th className="px-8 py-4 font-medium">Asset</th>
                  <th className="px-8 py-4 font-medium">Description</th>
                  <th className="px-8 py-4 font-medium">Retail</th>
                  <th className="px-8 py-4 font-medium">Availability</th>
                  <th className="px-8 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F1EF]">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="group hover:bg-[#F9F9F8] transition-colors">
                      <td className="px-8 py-5">
                        <div className="w-12 h-14 bg-[#F1F1EF] rounded-lg overflow-hidden border border-[#E5E5E3]">
                          <img
                            src={product?.images?.[0]?.url || product?.images?.[0]}
                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                            alt=""
                            onError={(e) => { e.target.src = "https://via.placeholder.com/100x120?text=No+Image" }}
                          />
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <h4 className="text-[14px] font-medium text-[#1A1A1A]">{product.name}</h4>
                        <p className="text-[11px] text-[#8E8E8C] mt-0.5 uppercase tracking-wide">{product.category}</p>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-[#1A1A1A]">
                       ${product.price.toLocaleString()}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-1 bg-[#F1F1EF] rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${product.stock < 10 ? 'bg-[#9B7C5C]' : 'bg-[#1A1A1A]'}`}
                              style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                            />
                          </div>
                          <span className={`text-[11px] font-medium ${product.stock < 10 ? 'text-[#9B7C5C]' : 'text-[#717170]'}`}>
                            {product.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-end gap-1">
                          <ActionButton 
                            icon={<Edit3 size={15} />} 
                            onClick={() => onEditClick(product._id)} 
                            tooltip="Edit"
                          />
                          <ActionButton 
                            icon={<ArrowUpRight size={15} />} 
                            onClick={() => navigate(`/seller/insights/${product._id}`)} 
                            tooltip="Insights"
                          />
                          <button
                            disabled={isDeletingId === product._id}
                            onClick={() => onDeleteClick(product._id, product.name)}
                            className="p-2 text-[#A1A19F] hover:text-[#B91C1C] hover:bg-[#FFF5F5] rounded-lg transition-all disabled:opacity-50"
                          >
                            {isDeletingId === product._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyState />
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE LIST */}
        <div className="md:hidden space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="reveal-item bg-white border border-[#E5E5E3] p-4 rounded-xl">
                <div className="flex gap-4 mb-4">
                  <img 
                    src={product?.images?.[0]?.url || product?.images?.[0]} 
                    className="w-16 h-20 object-cover bg-[#F1F1EF] rounded-lg border border-[#E5E5E3]" 
                    alt="" 
                  />
                  <div className="flex-1">
                    <p className="text-[10px] uppercase text-[#8E8E8C] tracking-widest">{product.category}</p>
                    <h4 className="font-medium text-[#1A1A1A]">{product.name}</h4>
                    <p className="text-sm font-bold mt-1">${product.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[#F1F1EF]">
                  <span className="text-[11px] text-[#717170]">Stock: {product.stock}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEditClick(product._id)} 
                      className="p-2 bg-[#F9F9F8] rounded-lg border border-[#E5E5E3]"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      disabled={isDeletingId === product._id}
                      onClick={() => onDeleteClick(product._id, product.name)} 
                      className="p-2 bg-[#FFF5F5] text-[#B91C1C] rounded-lg border border-[#FFE0E0] disabled:opacity-50"
                    >
                      {isDeletingId === product._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="reveal-item bg-white border border-[#E5E5E3] p-12 rounded-xl text-center">
                <Package size={32} className="mx-auto mb-4 text-[#C2C2C0]" strokeWidth={1} />
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8E8E8C]">Collection empty</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

// HELPER COMPONENTS
const StatCard = ({ label, value, icon, className = "" }) => (
  <div className={`reveal-item bg-white border border-[#E5E5E3] p-6 rounded-2xl transition-all duration-300 hover:border-[#1A1A1A] ${className}`}>
    <div className="flex justify-between items-start mb-6">
      <div className="p-2.5 bg-[#F9F9F8] border border-[#F1F1EF] rounded-xl text-[#1A1A1A]">
        {icon}
      </div>
      <div className="text-[10px] font-bold text-[#717170] px-2 py-1 bg-[#F1F1EF] rounded-md">
        +12%
      </div>
    </div>
    <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-[#8E8E8C] mb-1">{label}</p>
    <h3 className="text-2xl font-serif text-[#1A1A1A]">{value}</h3>
  </div>
);

const ActionButton = ({ icon, onClick, tooltip }) => (
  <button
    onClick={onClick}
    title={tooltip}
    className="p-2 text-[#A1A19F] hover:text-[#1A1A1A] hover:bg-[#F9F9F8] rounded-lg transition-all border border-transparent hover:border-[#E5E5E3]"
  >
    {icon}
  </button>
);

const EmptyState = () => (
  <tr>
    <td colSpan="5" className="py-32 text-center">
      <Package size={32} className="mx-auto mb-4 text-[#C2C2C0]" strokeWidth={1} />
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8E8E8C]">Collection empty</p>
    </td>
  </tr>
);

export default SellerInventory;