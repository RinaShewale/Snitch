import React, { useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { 
    MapPin, Phone, User, Globe, 
    Navigation, ArrowRight, Sparkles, Home 
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const AddressPage = () => {
    const navigate = useNavigate();
    const { handleAddAddress } = useAuth();
    const containerRef = useRef(null);
    const cardRef = useRef(null);

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // GSAP Entrance Animation
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
            
            gsap.set(".form-element", { y: 20, opacity: 0 });
            
            tl.fromTo(cardRef.current, 
                { scale: 0.98, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 1.2 }
            )
            .to(".form-element", {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 1
            }, "-=0.8");
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await handleAddAddress(form);
            if (res && res.success === true) {
                localStorage.setItem("shippingAddress", JSON.stringify(form));
                navigate("/cart");
            } else {
                setError(res?.message || "Failed to save address");
            }
        } catch (err) {
            setError(err?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full bg-[#fcfaf8] border border-neutral-100 rounded-2xl px-5 py-4 text-sm focus:border-black focus:ring-0 transition-all duration-300 placeholder:text-neutral-300 outline-none";
    const labelClasses = "text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2 ml-1 block";

    return (
        <div className="min-h-screen bg-[#f3f1ef] text-[#111111] selection:bg-black selection:text-white py-20 px-6 relative overflow-hidden" ref={containerRef}>
            {/* Grainy Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <main className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                
                {/* Left Side: Aesthetic Branding */}
                <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
                    <div className="form-element">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-[1px] w-12 bg-black" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Secure Checkout</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif italic tracking-tight leading-tight">
                            Where should we <br /> send your <span className="text-neutral-400">order?</span>
                        </h1>
                    </div>

                    <div className="form-element space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-neutral-100 flex items-center justify-center shrink-0 shadow-sm">
                                <TruckIcon size={16} />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest">Global Atelier Shipping</h3>
                                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Your artisanal pieces are handled with utmost care and delivered via our premium carbon-neutral partners.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: The Form */}
                <div className="lg:col-span-7">
                    <div ref={cardRef} className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-neutral-100 relative overflow-hidden">
                        
                        {error && (
                            <div className="form-element mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-2xl flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name & Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-element">
                                    <label className={labelClasses}>Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={14} />
                                        <input
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            className={`${inputClasses} pl-12`}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-element">
                                    <label className={labelClasses}>Contact Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={14} />
                                        <input
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className={`${inputClasses} pl-12`}
                                            placeholder="+91 00000 00000"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Line */}
                            <div className="form-element">
                                <label className={labelClasses}>Shipping Address</label>
                                <div className="relative">
                                    <Home className="absolute left-5 top-5 text-neutral-300" size={14} />
                                    <textarea
                                        name="addressLine1"
                                        value={form.addressLine1}
                                        onChange={handleChange}
                                        className={`${inputClasses} pl-12 h-32 resize-none`}
                                        placeholder="Flat, House no, Building, Company, Apartment"
                                        required
                                    />
                                </div>
                            </div>

                            {/* City & State */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-element">
                                    <label className={labelClasses}>City</label>
                                    <div className="relative">
                                        <Navigation className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={14} />
                                        <input
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            className={`${inputClasses} pl-12`}
                                            placeholder="Mumbai"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-element">
                                    <label className={labelClasses}>State / Province</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={14} />
                                        <input
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            className={`${inputClasses} pl-12`}
                                            placeholder="Maharashtra"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pincode & Country */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-element">
                                    <label className={labelClasses}>Postal Code</label>
                                    <input
                                        name="postalCode"
                                        value={form.postalCode}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="400001"
                                        required
                                    />
                                </div>
                                <div className="form-element">
                                    <label className={labelClasses}>Country</label>
                                    <div className="relative">
                                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={14} />
                                        <select
                                            name="country"
                                            value={form.country}
                                            onChange={handleChange}
                                            className={`${inputClasses} pl-12 appearance-none`}
                                            required
                                        >
                                            <option value="India">India</option>
                                            <option value="USA">United States</option>
                                            <option value="UK">United Kingdom</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="form-element pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full relative group overflow-hidden bg-[#111] text-white rounded-2xl py-6 transition-all duration-500 hover:bg-black hover:-translate-y-1 disabled:opacity-50"
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-4">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.5em]">
                                            {loading ? "Processing..." : "Continue to Payment"}
                                        </span>
                                        {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                                        {loading && <Sparkles size={16} className="animate-pulse" />}
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                body { font-family: 'Plus Jakarta Sans', sans-serif; }
                .font-serif { font-family: 'Instrument Serif', serif; }
            `}</style>
        </div>
    );
};

// Internal icon component for the truck (matching product page style)
const TruckIcon = ({ size }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-emerald-500"
    >
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

export default AddressPage;