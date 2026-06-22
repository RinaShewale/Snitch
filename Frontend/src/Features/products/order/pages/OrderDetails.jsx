import React, { useLayoutEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrder } from "../hooks/useOrder";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";

import OrderTracker from "../components/OrderTracker";
import ShippingPaymentInfo from "../components/ShippingPaymentInfo";
import OrderSummary from "../components/OrderSummary";

const OrderDetails = () => {
    const { orderId } = useParams();
    const { currentOrder, loading } = useOrder(orderId);
    const mainRef = useRef(null);

    useLayoutEffect(() => {
        if (!loading && currentOrder) {
            const ctx = gsap.context(() => {
                // Animate elements to opacity 1
                gsap.to(".reveal", {
                    y: 0,
                    opacity: 1,
                    stagger: 0.08,
                    duration: 1.2,
                    ease: "expo.out",
                });
            }, mainRef);
            return () => ctx.revert();
        }
    }, [loading, currentOrder]);

    if (loading) return <LoadingScreen />;
    if (!currentOrder) return <NotFoundScreen />;

    return (
        <div ref={mainRef} className="min-h-screen bg-[#f5f1ec] text-[#1a1714] pt-32 pb-24 px-4 md:px-8 lg:px-12 selection:bg-[#1a1714] selection:text-[#f5f1ec]">
            <div className="max-w-7xl mx-auto">
                <Link to="/my-orders" className="reveal opacity-0 translate-y-4 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] mb-12 hover:opacity-50 transition-all duration-300">
                    <ArrowLeft size={12} /> Back to Manifest
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-7">
                        <header className="reveal opacity-0 translate-y-4 mb-16 border-b border-[#1a1714]/10 pb-12">
                            <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 mb-4 font-mono italic">Order ID: {currentOrder?._id?.toUpperCase()}</p>
                            <h1 className="text-5xl md:text-7xl font-serif italic font-light mb-6 tracking-tighter">Manifest</h1>
                            <p className="text-xs uppercase tracking-widest opacity-60">
                                Recorded on {new Date(currentOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </header>

                        <section className="reveal opacity-0 translate-y-4 mb-20">
                            <OrderTracker status={currentOrder.status} />
                        </section>

                        <section className="space-y-12 mb-20">
                            <h2 className="reveal opacity-0 translate-y-4 text-[10px] uppercase tracking-[0.5em] opacity-30 border-b border-[#1a1714]/10 pb-4">Shipment Items</h2>
                            {currentOrder?.items?.map((item, idx) => (
                                <div key={item._id || idx} className="reveal opacity-0 translate-y-4 flex flex-col sm:flex-row gap-8 pb-12 border-b border-[#1a1714]/5 last:border-0">
                                    <div className="w-full sm:w-40 h-52 bg-[#ded7d0] overflow-hidden">
                                        <img
                                            src={item.product?.images?.[0]?.url || item.product?.images?.[0] || "/placeholder.png"}
                                            className="w-full h-full object-cover grayscale hover:grayscale-0 transform hover:scale-110 transition-all duration-1000"
                                            alt={item.product?.title}
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center flex-grow">
                                        <h3 className="text-2xl font-serif italic mb-6">{item.product?.title}</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[9px] uppercase tracking-[0.2em] opacity-80">
                                            <div><p className="mb-2 opacity-40">Size</p><p className="font-medium">{item.variant?.size || "Standard"}</p></div>
                                            <div><p className="mb-2 opacity-40">Qty</p><p className="font-medium">{item.quantity.toString().padStart(2, '0')}</p></div>
                                            <div><p className="mb-2 opacity-40">Total</p><p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>

                        <section className="reveal opacity-0 translate-y-4">
                            <ShippingPaymentInfo order={currentOrder} />
                        </section>
                    </div>

                    {/* Right Column: Sticky Summary */}
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-32 reveal opacity-0 translate-y-8">
                            <div className="bg-[#ede8e2] p-8 md:p-12">
                                <OrderSummary order={currentOrder} />
                            </div>
                            
                            <div className="mt-12 text-center">
                                <div className="w-px h-12 bg-[#1a1714]/20 mx-auto mb-6" />
                                <p className="font-serif italic text-xs opacity-40 leading-relaxed">
                                    Your selection is being processed <br />
                                    with artisanal care.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LoadingScreen = () => (
    <div className="h-screen bg-[#f5f1ec] flex flex-col items-center justify-center gap-6">
        <div className="flex gap-1">
            <div className="w-1 h-1 bg-[#1a1714] rounded-full animate-bounce" />
            <div className="w-1 h-1 bg-[#1a1714] rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-1 h-1 bg-[#1a1714] rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
        <p className="text-[9px] uppercase tracking-[0.6em] opacity-40 ml-2">Retrieving Archival Records</p>
    </div>
);

const NotFoundScreen = () => (
    <div className="h-screen bg-[#f5f1ec] flex flex-col items-center justify-center gap-6 p-6 text-center">
        <div className="w-px h-16 bg-[#1a1714]/10 mb-4" />
        <h2 className="font-serif italic text-3xl opacity-80">Entry missing from archives.</h2>
        <Link to="/orders" className="group flex items-center gap-3 text-[10px] uppercase tracking-widest border-b border-[#1a1714] pb-1 hover:opacity-60 transition-all">
            Return to index <ArrowRight size={12} />
        </Link>
    </div>
);

export default OrderDetails;