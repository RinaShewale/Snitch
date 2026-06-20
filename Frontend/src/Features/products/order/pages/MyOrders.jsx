import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useOrder } from "../hooks/useOrder";
import gsap from "gsap";
import { ArrowRight, Box } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

const MyOrders = () => {
    const { orders, loading } = useOrder();
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        if (!loading && orders?.length) {
            const ctx = gsap.context(() => {
                // Animate the header elements
                gsap.to(".header-reveal", {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power4.out"
                });

                // Animate the rows from their CSS starting state
                gsap.to(".order-row", {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.08,
                    ease: "power4.out",
                    delay: 0.2
                });
            }, containerRef);
            return () => ctx.revert();
        }
    }, [loading, orders]);

    if (loading) return (
        <div className="h-screen bg-[#f5f1ec] flex flex-col items-center justify-center font-serif italic text-[#1a1714]">
            <div className="w-12 h-[1px] bg-[#1a1714] animate-grow-shrink mb-4" />
            <p className="animate-pulse tracking-widest text-[10px] uppercase">Accessing Archive</p>
        </div>
    );

    if (!orders?.length) return (
        <div className="h-screen bg-[#f5f1ec] flex flex-col items-center justify-center font-serif text-[#1a1714] gap-4">
            <Box size={32} strokeWidth={1} className="opacity-20" />
            <i className="text-2xl">No Orders Found</i>
            <Link to="/shop" className="text-[10px] uppercase tracking-widest border-b border-[#1a1714] pb-1">Return to Shop</Link>
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-[#f5f1ec] text-[#1a1714] pt-32 pb-20 px-4 md:px-10">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 md:mb-20 border-b border-[#1a1714]/10 pb-10">
                    {/* Added opacity-0 translate-y-4 to prevent blink */}
                    <h1 className="header-reveal opacity-0 translate-y-4 text-6xl md:text-8xl font-light tracking-tighter mb-6 italic font-serif">Purchases</h1>
                    <div className="header-reveal opacity-0 translate-y-4 flex justify-between items-end">
                        <p className="text-[10px] uppercase tracking-[0.4em] opacity-60">Historical Order Manifest</p>
                        <p className="text-[10px] opacity-40 font-mono">COUNT: {orders.length.toString().padStart(3, '0')}</p>
                    </div>
                </header>

                <div className="space-y-0">
                    {orders.map((order) => {
                        const firstProduct = order?.items?.[0]?.product || {};
                        return (
                            <Link 
                                key={order._id} 
                                to={`/orders/${order._id}`} 
                                // Critical: opacity-0 and translate-y-8 hides the element BEFORE GSAP starts
                                className="order-row opacity-0 translate-y-8 block group border-b border-[#1a1714]/10"
                            >
                                <div className="flex flex-col md:flex-row md:items-center py-8 gap-6 group-hover:bg-[#ede8e2] group-hover:px-4 transition-all duration-500 ease-out">
                                    
                                    <div className="flex items-center gap-6 md:flex-1">
                                        <div className="w-16 h-20 md:w-20 md:h-24 bg-[#ded7d0] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                            <img
                                                src={firstProduct?.images?.[0]?.url || firstProduct?.images?.[0] || "/placeholder.png"}
                                                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                                                alt="Product"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-mono opacity-40 mb-1 uppercase">Ref: {order._id.slice(-8)}</p>
                                            <h3 className="text-lg md:text-xl font-medium tracking-tight">
                                                {firstProduct?.title || "Bespoke Item"}
                                                {order.items.length > 1 && <span className="text-[10px] ml-2 opacity-40 italic">+{order.items.length - 1} others</span>}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start md:w-40 gap-2">
                                        <StatusBadge status={order.status} />
                                        <span className="text-[10px] opacity-50 font-mono italic">
                                            {new Date(order.createdAt).toLocaleDateString('en-GB')}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end md:w-48 gap-8">
                                        <p className="text-xl md:text-2xl font-light italic font-serif">
                                            ₹{(order.totalAmount || 0).toLocaleString()}
                                        </p>
                                        <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;