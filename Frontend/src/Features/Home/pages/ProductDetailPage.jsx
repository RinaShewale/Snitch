import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
    Maximize, Minimize, Plus, Minus,
    ShoppingBag, Heart, Sparkles, Globe, Truck, Loader2
} from "lucide-react";
import { useProduct } from "../../products/hooks/useProduct";
import { useDispatch } from "react-redux";
import { addToCart, fetchCart } from "../../products/cart/redux/cart.slice";
import { useWishlist } from "../../products/wishlist/hooks/useWishlist";

// --- NEW IMPORTS ---
import { useRazorpay } from "react-razorpay";
import { createOrderAPI, verifyPaymentAPI } from "../../products/cart/services/cart.api";

export const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();
    const dispatch = useDispatch();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { Razorpay } = useRazorpay();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [variantImageOverride, setVariantImageOverride] = useState("");

    const containerRef = useRef(null);
    const mainImageRef = useRef(null);
    const heartRef = useRef(null);

    const normalizeSize = (size) => {
        if (!size) return [];
        if (Array.isArray(size)) return size.map(s => s.trim());
        if (typeof size === "string") return size.split(",").map(s => s.trim());
        return [];
    };

    useEffect(() => {
        let isMounted = true;
        const fetchProduct = async () => {
            try {
                const data = await handleGetProductById(id);
                if (data && isMounted) {
                    setProduct(data);
                    if (data.variants && data.variants.length > 0) {
                        const firstVariant = data.variants[0];
                        setSelectedColor(firstVariant.attributes?.color || firstVariant.color || "");
                        const variantSizes = normalizeSize(firstVariant.attributes?.size);
                        setSelectedSize(variantSizes.length > 0 ? variantSizes[0] : "");
                    }
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching product", err);
                setLoading(false);
            }
        };
        fetchProduct();
        return () => { isMounted = false; };
    }, [id]);

    useEffect(() => {
        if (selectedColor && product) {
            const variant = product.variants?.find(v =>
                (v.color === selectedColor || v.attributes?.color === selectedColor)
            );
            if (variant && variant.images?.length > 0) {
                setVariantImageOverride(variant.images[0].url || variant.images[0]);
            }
        }
    }, [selectedColor, product]);

    useLayoutEffect(() => {
        if (loading || !product) return;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
            gsap.set(".content-reveal, .image-stage, .stat-card", { opacity: 0 });
            tl.fromTo(".nav-reveal", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
                .fromTo(".image-stage", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2 }, "-=0.4")
                .fromTo(".content-reveal", { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 1 }, "-=0.8")
                .fromTo(".stat-card", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.05, duration: 0.8 }, "-=1");
        }, containerRef);
        return () => ctx.revert();
    }, [loading, product]);

    const colors = [...new Set((product?.variants || []).map(v => v.attributes?.color || v.color).filter(Boolean))];
    const sizes = [...new Set(product?.variants?.filter(v => !selectedColor || (v.attributes?.color || v.color) === selectedColor).flatMap(v => normalizeSize(v.attributes?.size)))];

    const currentVariant = product?.variants?.find(v => {
        const vColor = v.attributes?.color || v.color;
        const vSizes = normalizeSize(v.attributes?.size);
        const colorMatches = colors.length > 0 ? vColor === selectedColor : true;
        const sizeMatches = sizes.length > 0 ? vSizes.includes(selectedSize) : true;
        return colorMatches && sizeMatches;
    }) || (product?.variants?.length > 0 ? product.variants[0] : null);

    const handleAddToCart = async () => {
        if (colors.length > 0 && !selectedColor) { alert("Please select a color"); return; }
        if (sizes.length > 0 && !selectedSize) { alert("Please select a size"); return; }

        await dispatch(addToCart({
            productId: id,
            variantId: currentVariant?._id || null,
            quantity,
            selectedAttributes: {
                ...(selectedColor && { color: selectedColor }),
                ...(selectedSize && { size: selectedSize })
            },
        }));
        dispatch(fetchCart());
    };

    // --- UPDATED DIRECT CHECKOUT: ONLY THIS PRODUCT ---
    const handleDirectCheckout = async () => {
        if (colors.length > 0 && !selectedColor) { alert("Please select a color"); return; }
        if (sizes.length > 0 && !selectedSize) { alert("Please select a size"); return; }

        try {
            setPaymentLoading(true);

            const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress"));
            if (!shippingAddress) {
                navigate("/address");
                return;
            }

            /** 
             * Instead of relying on the global cart, we pass this specific item 
             * to the backend order creator. 
             */
            const directPurchasePayload = {
                shippingAddress,
                items: [
                    {
                        productId: id,
                        variantId: currentVariant?._id || null,
                        quantity,
                        selectedAttributes: {
                            ...(selectedColor ? { color: selectedColor } : {}),
                            ...(selectedSize ? { size: selectedSize } : {}),
                        },
                    },
                ],
                checkoutType: "DIRECT",
            };

            const res = await createOrderAPI(directPurchasePayload);
            const order = res.data.order;

            const options = {
                key: "rzp_test_SpkPh7sxRTTlGW",
                amount: order.amount,
                currency: order.currency,
                name: "snitch",
                description: `Direct Purchase: ${product.title}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await verifyPaymentAPI({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        dispatch(fetchCart());
                        navigate('/orders');
                    } catch (err) {
                        console.error("Payment verification failed", err);
                    }
                },
                prefill: { name: "Customer", email: "customer@example.com" },
                theme: { color: "#111111" },
            };

            const rzp = new Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Direct checkout failed:", err);
            alert("Failed to initiate checkout. Please try again.");
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleWishlistToggle = () => {
        toggleWishlist(id);
        gsap.fromTo(heartRef.current, { scale: 0.7 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    };

    if (loading) return (
        <div className="h-screen bg-[#FAFAFA] flex flex-col items-center justify-center">
            <div className="w-16 h-[1px] bg-black animate-pulse mb-4" />
            <span className="text-[8px] uppercase tracking-[0.4em] font-bold">Atelier Loading</span>
        </div>
    );

    const productImages = product?.images || [];
    const activeImageSrc = variantImageOverride || (productImages[activeIndex]?.url || productImages[activeIndex]) || "";
    const isFavorite = isInWishlist(id);

    return (
        <div className="min-h-screen bg-[#f3f1ef] text-[#111111] selection:bg-black selection:text-white pb-32 overflow-x-hidden" ref={containerRef}>
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <main className="max-w-[1300px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-[110px] relative z-10">
                {/* Left Column: Images */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="image-stage relative aspect-square max-h-[600px] bg-white rounded-[2.5rem] overflow-hidden border border-neutral-100 shadow-sm group mx-auto w-full">
                        <div className="absolute inset-0 p-8 flex items-center justify-center">
                            <img
                                ref={mainImageRef}
                                src={activeImageSrc}
                                className={`parallax-img w-full h-full transition-transform duration-700 ease-out ${isZoomed ? 'scale-150 object-cover' : 'object-contain'}`}
                                alt={product?.title}
                            />
                        </div>
                        {productImages.length > 1 && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-1.5 bg-white/50 backdrop-blur-md rounded-2xl border border-white/20">
                                {productImages.map((img, i) => (
                                    <button key={i} onClick={() => { setActiveIndex(i); setVariantImageOverride(""); }} className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all duration-500 ${!variantImageOverride && activeIndex === i ? 'border-black scale-105 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                                        <img src={img.url || img} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                        <button onClick={() => setIsZoomed(!isZoomed)} className="absolute bottom-6 left-6 w-10 h-10 bg-black text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500">
                            {isZoomed ? <Minimize size={16} /> : <Maximize size={16} />}
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[{ label: 'Craft', value: 'Artisanal', icon: Sparkles, color: 'text-orange-500' }, { label: 'Origin', value: 'Organic', icon: Globe, color: 'text-blue-500' }, { label: 'Ship', value: 'Express', icon: Truck, color: 'text-emerald-500' }].map((stat, i) => (
                            <div key={i} className="stat-card bg-white p-4 rounded-3xl border border-neutral-100">
                                <stat.icon size={14} className={`${stat.color} mb-2`} />
                                <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-0.5">{stat.label}</p>
                                <p className="text-sm font-serif italic">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Info */}
                <div className="lg:col-span-6 space-y-8">
                    <section className="content-reveal">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">{product?.category}</span>
                            <div className="h-[1px] flex-1 bg-neutral-100" />
                        </div>
                        <h1 className="text-4xl font-serif tracking-tight mb-4 leading-tight">{product?.title}</h1>
                        <p className="text-xs text-neutral-500 leading-relaxed max-w-md">{product?.description}</p>
                    </section>

                    <section className="content-reveal bg-white border border-neutral-100 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex justify-between items-baseline">
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-2">Purchase Value</p>
                                <h2 className="text-4xl font-light tracking-tighter italic">
                                    {Number(product?.price?.amount ?? 0).toLocaleString("en-IN")}
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest" > {product?.price?.currency}</span>
                                </h2>
                            </div>
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Inc. Taxes</span>
                        </div>
                    </section>

                    <section className="content-reveal space-y-6">
                        {colors.length > 0 && (
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-3">Color Palette</p>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map(color => (
                                        <button key={color} onClick={() => setSelectedColor(color)} className={`px-5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border ${selectedColor === color ? 'bg-black text-white border-black' : 'bg-white text-neutral-400 border-neutral-100 hover:border-black'}`}>{color}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {sizes.length > 0 && (
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-3">Dimensions</p>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map(size => (
                                        <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 rounded-xl text-[10px] font-bold transition-all border flex items-center justify-center ${selectedSize === size ? 'bg-black text-white border-black shadow-lg shadow-black/10' : 'bg-white text-neutral-400 border-neutral-100 hover:border-black'}`}>{size}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-6">
                            <div className="flex items-center bg-white border border-neutral-100 rounded-full px-1.5 py-1.5">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 rounded-full"><Minus size={12} /></button>
                                <span className="w-8 text-center text-[11px] font-bold">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 rounded-full"><Plus size={12} /></button>
                            </div>

                            <p className={`text-[9px] font-bold uppercase tracking-[0.2em] ${(currentVariant?.stock > 0 || currentVariant?.stock === undefined) ? 'text-emerald-500' : 'text-red-400'}`}>
                                {currentVariant?.stock === 0
                                    ? '• Out of Stock'
                                    : (currentVariant?.stock > 0 && currentVariant?.stock < 10)
                                        ? `• Limited (${currentVariant.stock} left)`
                                        : '• In Stock'}
                            </p>
                        </div>
                    </section>

                    <section className="content-reveal pt-6">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            {/* BUY NOW BUTTON - ONLY FOR THIS ITEM */}
                            <button
                                onClick={handleDirectCheckout}
                                disabled={paymentLoading || currentVariant?.stock === 0}
                                className="flex-1 relative group overflow-hidden bg-[#111] text-white rounded-2xl py-6 transition-all duration-500 hover:bg-black hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-4">
                                    {paymentLoading ? (
                                        <Loader2 className="animate-spin" size={16} />
                                    ) : (
                                        <>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Checkout Now</span>
                                            <Sparkles size={16} />
                                        </>
                                    )}
                                </div>
                            </button>

                            <div className="flex items-center gap-4 justify-center">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={currentVariant?.stock === 0}
                                    className={`w-16 h-16 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-black transition-all hover:border-black hover:scale-110 group relative ${currentVariant?.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <ShoppingBag size={20} />
                                    <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold uppercase tracking-widest text-neutral-400">Add</span>
                                </button>

                                <button
                                    onClick={handleWishlistToggle}
                                    className={`w-16 h-16 rounded-full border border-neutral-200 bg-white flex items-center justify-center transition-all hover:scale-110 group relative ${isFavorite ? 'text-red-500 border-red-100' : 'text-black hover:text-red-500'}`}
                                >
                                    <div ref={heartRef}>
                                        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} className="transition-colors duration-300" />
                                    </div>
                                    <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold uppercase tracking-widest text-neutral-400">
                                        {isFavorite ? 'Saved' : 'Wish'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #FAFAFA; }
                .font-serif { font-family: 'Instrument Serif', serif; }
                .image-stage, .content-reveal, .stat-card { opacity: 0; }
            `}</style>
        </div>
    );
};