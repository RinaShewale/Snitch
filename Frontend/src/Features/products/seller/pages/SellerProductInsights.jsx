import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import {
    ArrowLeft, Trash2,
    Maximize, Minimize, Plus,
    Download, Zap, Sparkles, Layers, History,
    ArrowUpRight, X, Eye, MousePointerClick, 
    TrendingUp, DollarSign, Package, Activity, 
    ShieldCheck, Globe
} from "lucide-react";
import { useProduct } from "../../hooks/useProduct";

const SellerProductInsights = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const [variantPreviews, setVariantPreviews] = useState({});
    const [variantFiles, setVariantFiles] = useState({});

    const containerRef = useRef(null);
    const mainImageRef = useRef(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await handleGetProductById(id);
                if (data) setProduct(data);
            } catch (err) {
                console.error("Error fetching product", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleVariantImages = (index, e) => {
        const files = Array.from(e.target.files || []);
        const newPreviews = files.map(file => URL.createObjectURL(file));

        setVariantFiles(prev => ({
            ...prev,
            [index]: [...(prev[index] || []), ...files]
        }));

        setVariantPreviews(prev => ({
            ...prev,
            [index]: [...(prev[index] || []), ...newPreviews]
        }));
    };

    const removeVariantImage = (vIndex, imgIndex) => {
        setVariantPreviews(prev => {
            const updated = [...(prev[vIndex] || [])];
            URL.revokeObjectURL(updated[imgIndex]);
            updated.splice(imgIndex, 1);
            return { ...prev, [vIndex]: updated };
        });
    };

    useEffect(() => {
        if (!loading && product) {
            const ctx = gsap.context(() => {
                const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

                tl.from(".nav-reveal", { y: -20, opacity: 0, duration: 0.8 })
                    .from(".image-stage", { x: -50, opacity: 0, duration: 1.2 }, "-=0.4")
                    .from(".content-reveal", { y: 30, opacity: 0, stagger: 0.1, duration: 1 }, "-=0.8")
                    .from(".stat-card", { scale: 0.9, opacity: 0, stagger: 0.05, duration: 0.8 }, "-=1");

                const handleMouseMove = (e) => {
                    const { clientX, clientY } = e;
                    const xPos = (clientX / window.innerWidth - 0.5) * 15;
                    const yPos = (clientY / window.innerHeight - 0.5) * 15;
                    gsap.to(".parallax-img", { x: xPos, y: yPos, duration: 1 });
                };
                window.addEventListener("mousemove", handleMouseMove);
                return () => window.removeEventListener("mousemove", handleMouseMove);
            }, containerRef);
            return () => ctx.revert();
        }
    }, [loading, product]);

    if (loading) return (
        <div className="h-screen bg-[#FAFAFA] flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-[1px] border-black/10 rounded-full" />
                <div className="absolute inset-0 border-[1px] border-black border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] uppercase tracking-[0.3em] font-bold">Loading</span>
                </div>
            </div>
        </div>
    );

    const productImages = product?.images || (product?.image ? [product.image] : []);

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#111111] selection:bg-black selection:text-white pb-32" ref={containerRef}>
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <nav className="nav-reveal sticky top-0 z-[60] px-8 py-6 flex justify-between items-center bg-[#FAFAFA]/80 backdrop-blur-md">
                <button onClick={() => navigate(-1)} className="group flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 group-hover:text-black transition-colors">Return to Vault</span>
                </button>

                <div className="flex items-center gap-3">
                    <Link to={`/seller/edit/${id}`} className="px-6 py-2.5 bg-white border border-neutral-200 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-black transition-all">
                        Edit Details
                    </Link>
                    <button className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                </div>
            </nav>

            <main className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">

                {/* LEFT COLUMN */}
                <div className="lg:col-span-7 space-y-6">
                    {/* BIG IMAGE DIV */}
                    <div className="image-stage relative aspect-[4/5] lg:aspect-square bg-white rounded-[2rem] overflow-hidden border border-neutral-100 shadow-sm group">
                        <div className="absolute inset-0 p-12 flex items-center justify-center">
                            <img
                                ref={mainImageRef}
                                src={productImages[activeIndex]?.url || productImages[activeIndex]}
                                className={`parallax-img w-full h-full transition-transform duration-700 ease-out ${isZoomed ? 'scale-150 object-cover' : 'object-contain'}`}
                                alt={product?.title}
                            />
                        </div>

                        <div className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur rounded-full border border-neutral-100">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Listing Active</span>
                        </div>

                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 p-2 bg-white/50 backdrop-blur-md rounded-2xl border border-white/20">
                            {productImages.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all duration-500 ${activeIndex === i ? 'border-black scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img.url || img} className="w-full h-full object-cover" alt="" />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setIsZoomed(!isZoomed)}
                            className="absolute bottom-8 left-8 w-12 h-12 bg-black text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                        >
                            {isZoomed ? <Minimize size={18} /> : <Maximize size={18} />}
                        </button>
                    </div>

                    {/* STAT CARDS */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Views', value: '1,284', icon: Eye, color: 'text-blue-500' },
                            { label: 'Saves', value: '84', icon: Sparkles, color: 'text-orange-500' },
                            { label: 'Clicks', value: '312', icon: MousePointerClick, color: 'text-emerald-500' },
                        ].map((stat, i) => (
                            <div key={i} className="stat-card bg-white p-6 rounded-3xl border border-neutral-100 hover:border-neutral-300 transition-all">
                                <stat.icon size={16} className={`${stat.color} mb-4`} />
                                <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">{stat.label}</p>
                                <p className="text-xl font-serif italic">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* NEW SECTION ADDED BELOW BIG IMAGE DIV */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 content-reveal">
                        {/* Listing Quality */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">Listing Integrity</p>
                                    <h4 className="text-2xl font-serif italic">Exceptional</h4>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <ShieldCheck size={20} />
                                </div>
                            </div>
                            <div className="space-y-5">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-neutral-400">SEO Score</span>
                                    <span>98%</span>
                                </div>
                                <div className="h-1.5 w-full bg-neutral-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[98%] transition-all duration-1000" />
                                </div>
                                <p className="text-[10px] text-neutral-400 leading-relaxed italic">
                                    Your listing ranks in the top 5% for the "{product?.category}" category.
                                </p>
                            </div>
                        </div>

                        {/* Market Reach */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6">Global Reach</p>
                            <div className="space-y-4">
                                {[
                                    { region: 'North America', percent: '45%', color: 'bg-black' },
                                    { region: 'Europe', percent: '32%', color: 'bg-neutral-400' },
                                    { region: 'Asia Pacific', percent: '23%', color: 'bg-neutral-200' }
                                ].map((reach, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${reach.color}`} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest flex-1">{reach.region}</span>
                                        <span className="text-[10px] font-serif italic text-neutral-500">{reach.percent}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-neutral-50 flex items-center justify-between">
                                <span className="text-[9px] font-bold uppercase tracking-widest">Active Ads</span>
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Logs */}
                        <div className="md:col-span-2 bg-white rounded-[2.5rem] border border-neutral-100 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Activity size={16} className="text-neutral-400" />
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em]">Operational Timeline</h4>
                                </div>
                                <button className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors flex items-center gap-2">
                                    Export Logs <ArrowUpRight size={12} />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { action: "Stock levels adjusted", time: "2h ago", icon: Package },
                                    { action: "Price revised", time: "Yesterday", icon: History },
                                    { action: "Variant assets added", time: "3 days ago", icon: Layers },
                                ].map((log, i) => (
                                    <div key={i} className="flex items-center gap-4 group/log border-r border-neutral-50 last:border-0 pr-4">
                                        <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center group-hover/log:bg-black group-hover/log:text-white transition-all duration-300">
                                            <log.icon size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-neutral-800">{log.action}</p>
                                            <p className="text-[9px] text-neutral-400 uppercase tracking-tight mt-0.5">{log.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-5 space-y-10">
                    <section className="content-reveal">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">{product?.category || "Unclassified"}</span>
                            <div className="h-[1px] flex-1 bg-neutral-100" />
                        </div>
                        <h1 className="text-5xl font-serif tracking-tight mb-4 leading-tight">
                            {product?.title || product?.name}
                        </h1>
                        <p className="text-sm text-neutral-500 leading-relaxed max-w-md">
                            {product?.description || "No description provided for this entry."}
                        </p>
                    </section>

                    {/* REPLACED BLACK FINANCE CARD WITH WHITE DESIGN */}
                    <section className="content-reveal bg-white border border-neutral-100 rounded-[2.5rem] p-10 relative overflow-hidden shadow-sm">
                        <div className="relative z-10">
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-8">Financial Valuation</p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-6xl font-light tracking-tighter italic">
                                        ₹{Number(product?.price?.amount ?? 0).toLocaleString()}
                                    </h2>
                                    <p className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest mt-6">
                                        <TrendingUp size={14} /> +12.5% Performance
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="w-14 h-14 border border-neutral-100 rounded-2xl flex items-center justify-center ml-auto mb-4 bg-neutral-50">
                                        <DollarSign size={24} className="text-neutral-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* VARIANTS & INVENTORY */}
                    <section className="content-reveal space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Inventory Units</h3>
                            <div className="flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full text-[9px] font-bold uppercase">
                                <Layers size={12} /> {product?.variants?.length || 0} Variants
                            </div>
                        </div>

                        <div className="space-y-4">
                            {product?.variants?.map((variant, idx) => (
                                <div key={idx} className="flex flex-col p-8 bg-white border border-neutral-100 rounded-[2.5rem] hover:shadow-xl transition-all duration-500 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="w-1.5 h-12 bg-black rounded-full" />
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-tight">{variant.attributes?.color || 'Standard'}</p>
                                                <p className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] mt-1">{variant.attributes?.size || 'OS'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-serif italic leading-none">{variant.stock}</p>
                                            <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mt-1">Available</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-300">Variant Visual Assets</p>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            {variant.images?.map((img, imgIdx) => (
                                                <div key={`existing-${imgIdx}`} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-neutral-100 group/img">
                                                    <img src={img.url || img} className="w-full h-full object-cover" alt="asset" />
                                                </div>
                                            ))}
                                            {variantPreviews[idx]?.map((img, pIdx) => (
                                                <div key={`new-${pIdx}`} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-black/5 group/new">
                                                    <img src={img} className="w-full h-full object-cover" alt="preview" />
                                                    <button onClick={() => removeVariantImage(idx, pIdx)} className="absolute inset-0 bg-black/60 opacity-0 group-hover/new:opacity-100 text-white flex items-center justify-center transition-all">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-neutral-200 rounded-2xl cursor-pointer hover:border-black hover:bg-neutral-50 transition-all group/btn">
                                                <Plus size={20} className="text-neutral-300 group-hover/btn:text-black transition-colors" />
                                                <input type="file" multiple hidden onChange={(e) => handleVariantImages(idx, e)} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="content-reveal pt-6">
                        <button className="w-full py-5 border-2 border-black text-black rounded-full text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-black hover:text-white transition-all">
                            Generate Insights PDF <Download size={16} />
                        </button>
                    </section>
                </div>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #FAFAFA; }
                .font-serif { font-family: 'Instrument Serif', serif; }
            `}</style>
        </div>
    );
};

export default SellerProductInsights;