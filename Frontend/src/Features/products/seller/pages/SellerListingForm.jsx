import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  X,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Trash2,
  UploadCloud,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useProduct } from "../../../products/hooks/useProduct";
import { CATEGORY_DATA } from "../../../data/categoryData";

const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
];

const SellerListingForm = () => {
  const { handleCreateProduct, handleGetProductById, handleUpdateProduct } = useProduct();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editProductId = searchParams.get("edit");
  const isEditMode = !!editProductId;

  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const currencyRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priceAmount, setPriceAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const [variants, setVariants] = useState([
    { color: "", size: "", material: "", stock: "", price: "", currency: "INR", images: [], previews: [] },
  ]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsCategoryOpen(false);
      if (currencyRef.current && !currencyRef.current.contains(e.target)) setIsCurrencyOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (editProductId) {
      const loadProduct = async () => {
        try {
          setLoading(true);
          const product = await handleGetProductById(editProductId);
          if (product) {
            setTitle(product.title || "");
            setDescription(product.description || "");
            setCategory(product.category || "");
            setPriceAmount(product.price?.amount || "");
            setCurrency(product.price?.currency || "INR");
            setImages(product.images || []);
            setPreviews((product.images || []).map(img => img.url || img));
            
            if (product.variants && product.variants.length > 0) {
              setVariants(product.variants.map(v => ({
                _id: v._id,
                color: v.color || "",
                size: v.size || "",
                material: v.material || "",
                stock: v.stock || 0,
                price: v.price?.amount || "",
                currency: v.price?.currency || product.price?.currency || "INR",
                images: v.images || [],
                previews: (v.images || []).map(img => img.url || img),
              })));
            }
          }
        } catch (error) { console.error(error); } finally { setLoading(false); }
      };
      loadProduct();
    }
  }, [editProductId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 7) return alert("Max 7 images");
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleVariantImages = (index, e) => {
    const files = Array.from(e.target.files || []);
    const updated = [...variants];
    updated[index].images = [...updated[index].images, ...files];
    updated[index].previews = [...updated[index].previews, ...files.map(f => URL.createObjectURL(f))];
    setVariants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("priceAmount", Number(priceAmount));
      formData.append("priceCurrency", currency);

      images.forEach(f => { if (f instanceof File) formData.append("productImages", f); });
      formData.append("images", JSON.stringify(images.filter(f => !(f instanceof File))));

      const formattedVariants = variants.map(v => {
        const finalPrice = (v.price === "" || v.price === undefined) ? priceAmount : v.price;
        const finalCurrency = v.currency || currency;
        return {
          _id: v._id,
          color: v.color,
          size: v.size,
          material: v.material,
          stock: Math.max(0, Number(v.stock) || 0), // Final check for non-negative stock
          price: { amount: Number(finalPrice), currency: finalCurrency },
          images: v.images.filter(img => !(img instanceof File))
        };
      });

      formData.append("variants", JSON.stringify(formattedVariants));
      variants.forEach((v, i) => {
        v.images.forEach(f => { if (f instanceof File) formData.append(`variantImages_${i}`, f); });
      });

      if (isEditMode) await handleUpdateProduct(editProductId, formData);
      else await handleCreateProduct(formData);

      setSuccess(true);
      setTimeout(() => navigate("/seller/inventory"), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center">
      <CheckCircle2 size={60} className="mb-6 text-black" strokeWidth={1} />
      <h2 className="text-3xl font-serif">Listing <span className="italic text-neutral-400">Published</span></h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] pb-24 font-sans" ref={containerRef}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <main className="max-w-[1200px] mx-auto px-6 pt-12 relative">
        <div className="flex items-center justify-between mb-16 reveal">
          <Link to="/seller/inventory" className="group flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center group-hover:border-black transition-all">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 group-hover:text-black">Inventory</span>
          </Link>
          <div className="px-4 py-1.5 rounded-full border border-neutral-200 bg-white text-[9px] font-bold uppercase tracking-[0.2em]">Listing Studio</div>
        </div>

        <header className="mb-20 reveal">
          <h1 className="text-6xl md:text-8xl font-serif tracking-tighter leading-tight">
            {isEditMode ? "Edit" : "New"} <span className="italic font-light text-neutral-300">Listing</span>
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-20">
          {/* LEFT COLUMN: IMAGES */}
          <div className="lg:col-span-5 space-y-8 reveal">
            <div className="group relative aspect-[3/4] bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm transition-all hover:border-neutral-400 cursor-pointer">
              {previews[0] ? <img src={previews[0]} className="w-full h-full object-cover" alt="Primary" /> : (
                <div className="h-full flex flex-col items-center justify-center">
                  <UploadCloud size={28} className="text-neutral-300 mb-4" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold">Primary Visuals</p>
                </div>
              )}
              <input type="file" multiple onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {previews.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-200 group">
                  <img src={url} className="w-full h-full object-cover" alt={`Preview ${i}`} />
                  <button type="button" onClick={() => { setPreviews(previews.filter((_, idx) => idx !== i)); setImages(images.filter((_, idx) => idx !== i)); }} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILS */}
          <div className="lg:col-span-7 space-y-16 reveal">
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">Nomenclature</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Oversized Cashmere Overcoat" className="w-full bg-transparent text-4xl font-serif italic outline-none border-b border-neutral-200 pb-4 focus:border-black transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-12">
                {/* CLASSIFICATION */}
                <div className="space-y-4 relative" ref={dropdownRef}>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">Classification</label>
                  <div
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="group flex items-center justify-between w-full cursor-pointer border-b border-neutral-200 pb-2 hover:border-black transition-all"
                  >
                    <span className={`text-sm uppercase tracking-wider ${category ? 'text-black font-medium' : 'text-neutral-400'}`}>
                      {category ? category.replace(/-/g, ' ') : "Select Category"}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180 text-black' : 'text-neutral-300'}`} />
                  </div>

                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute z-[60] left-0 right-0 top-full mt-2 max-h-[300px] overflow-y-auto bg-white border border-neutral-100 shadow-2xl rounded-2xl p-2 scrollbar-hide"
                      >
                        {CATEGORY_DATA.map((group) => (
                          <div key={group.group}>
                            <div className="px-3 pt-4 pb-1 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-300 border-b border-neutral-50 mb-1">
                              {group.group}
                            </div>
                            {group.items.map((item) => (
                              <button
                                key={item.value} type="button"
                                onClick={() => { setCategory(item.value); setIsCategoryOpen(false); }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all mb-0.5 ${category === item.value ? 'bg-black text-white' : 'hover:bg-neutral-50 text-neutral-600'}`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4 relative" ref={currencyRef}>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">Currency</label>
                    <div
                      onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                      className="group flex items-center justify-between w-full cursor-pointer border-b border-neutral-200 pb-2 hover:border-black transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-black">{currency}</span>
                      </div>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${isCurrencyOpen ? 'rotate-180 text-black' : 'text-neutral-300'}`} />
                    </div>

                    <AnimatePresence>
                      {isCurrencyOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                          className="absolute z-[60] left-0 w-[180px] top-full mt-2 bg-white border border-neutral-100 shadow-2xl rounded-2xl p-2"
                        >
                          {CURRENCIES.map((c) => (
                            <button
                              key={c.code} type="button"
                              onClick={() => { setCurrency(c.code); setIsCurrencyOpen(false); }}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[11px] transition-all mb-0.5 ${currency === c.code ? 'bg-black text-white' : 'hover:bg-neutral-50 text-neutral-600'}`}
                            >
                              <span className="font-bold">{c.code}</span>
                              <span className="text-lg italic font-serif">{c.symbol}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">Base Price</label>
                    <input
                      required
                      type="number"
                      value={priceAmount}
                      onChange={(e) => setPriceAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-transparent text-sm font-medium border-b border-neutral-200 pb-2 focus:border-black outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* VARIANTS */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <label className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">Options (Variants)</label>
                <button
                  type="button"
                  onClick={() => setVariants([...variants, { color: "", size: "", material: "", stock: "", price: "", currency: currency, images: [], previews: [] }])}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-5 py-2 bg-black text-white rounded-full hover:bg-neutral-800 transition-all"
                >
                  <Plus size={14} /> Add Variant
                </button>
              </div>
              
              <div className="space-y-6">
                {variants.map((v, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-white border border-neutral-100 shadow-sm space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                      <div className="space-y-2">
                        <p className="text-[9px] text-neutral-400 uppercase font-bold ml-1">Color</p>
                        <input placeholder="e.g. Noir" value={v.color} onChange={(e) => updateVariant(i, "color", e.target.value)} className="w-full bg-neutral-50 p-3 rounded-xl outline-none focus:bg-white border border-transparent focus:border-neutral-200" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] text-neutral-400 uppercase font-bold ml-1">Size</p>
                        <input placeholder="e.g. M, 42" value={v.size} onChange={(e) => updateVariant(i, "size", e.target.value)} className="w-full bg-neutral-50 p-3 rounded-xl outline-none focus:bg-white border border-transparent focus:border-neutral-200" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] text-neutral-400 uppercase font-bold ml-1">Material</p>
                        <input placeholder="e.g. Leather" value={v.material} onChange={(e) => updateVariant(i, "material", e.target.value)} className="w-full bg-neutral-50 p-3 rounded-xl outline-none focus:bg-white border border-transparent focus:border-neutral-200" />
                      </div>
                      
                      {/* FIXED STOCK INPUT: Prevents -1 */}
                      <div className="space-y-2">
                        <p className="text-[9px] text-neutral-400 uppercase font-bold ml-1">Stock</p>
                        <input 
                          placeholder="0" 
                          type="number" 
                          min="0"
                          value={v.stock} 
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            updateVariant(i, "stock", val < 0 ? 0 : val || "");
                          }} 
                          className="w-full bg-neutral-50 p-3 rounded-xl outline-none focus:bg-white border border-transparent focus:border-neutral-200" 
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-[9px] text-neutral-400 uppercase font-bold ml-1">Price (Opt)</p>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-[10px] text-neutral-400 font-bold">{currency}</span>
                          <input
                            placeholder={priceAmount || "0.00"}
                            type="number"
                            value={v.price}
                            onChange={(e) => updateVariant(i, "price", e.target.value)}
                            className="w-full bg-neutral-50 p-3 pl-10 rounded-xl outline-none focus:bg-white border border-transparent focus:border-neutral-200"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 overflow-x-auto pb-2">
                      <div className="relative w-12 h-12 shrink-0 rounded-xl border-2 border-dashed border-neutral-200 flex items-center justify-center text-neutral-300 hover:border-black hover:text-black transition-all cursor-pointer">
                        <Plus size={16} /><input type="file" multiple onChange={(e) => handleVariantImages(i, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      {v.previews.map((p, pIdx) => (
                        <div key={pIdx} className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden group">
                          <img src={p} className="w-full h-full object-cover" alt="Variant" />
                          <button type="button" onClick={() => { const upd = [...variants]; upd[i].images.splice(pIdx, 1); upd[i].previews.splice(pIdx, 1); setVariants(upd); }} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"><X size={10} /></button>
                        </div>
                      ))}
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                          className="ml-auto text-neutral-200 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">Narrative</label>
              <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the silhouette, fabric, and design intent..." className="w-full bg-white border border-neutral-200 rounded-3xl p-6 text-sm outline-none focus:border-black transition-all resize-none shadow-sm" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-black text-white py-6 rounded-full font-bold text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:shadow-2xl transition-all disabled:opacity-20">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Commit Listing <ChevronRight size={16} /></>}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SellerListingForm;