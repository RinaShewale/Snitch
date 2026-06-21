import React, { useEffect, useState, useRef, useLayoutEffect, useMemo } from "react";
import { gsap } from "gsap";
import {
    Package, Truck, CheckCircle, Clock,
    User, Search, Filter, Calendar,
    ArrowRight, ExternalLink, Hash, Info,
    ChevronDown, DollarSign, ShoppingBag,
    MapPin, Phone, Mail
} from "lucide-react";
import {
    getAllOrdersAPI,
    updateOrderStatusAPI,
} from "../../order/services/order.api";
import SellerOrderTracker from "./SellerOrderTracker";

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});
    const [shippingData, setShippingData] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    const containerRef = useRef(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await getAllOrdersAPI();
            setOrders(res.data.orders || []);
        } catch (err) {
            console.error("Fetch Orders Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = activeFilter === "all" || order.status === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [orders, searchTerm, activeFilter]);

    useLayoutEffect(() => {
        if (!loading && filteredOrders.length > 0) {
            const ctx = gsap.context(() => {
                gsap.fromTo(".order-card",
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" }
                );
            }, containerRef);
            return () => ctx.revert();
        }
    }, [loading, filteredOrders]);

    const updateStatus = async (orderId, status) => {
        try {
            setUpdating((prev) => ({ ...prev, [orderId]: true }));
            const shipping = shippingData[orderId] || {};
            const payload = {
                status,
                courierPartner: shipping.courierPartner?.trim() || undefined,
                trackingNumber: shipping.trackingNumber?.trim() || undefined,
                estimatedDeliveryDate: shipping.estimatedDeliveryDate ? new Date(shipping.estimatedDeliveryDate) : undefined,
                note: `Status updated to ${status} by Seller`,
            };
            await updateOrderStatusAPI(orderId, payload);
            await fetchOrders();
        } catch (err) {
            console.error("Update Error", err);
        } finally {
            setUpdating((prev) => ({ ...prev, [orderId]: false }));
        }
    };

    const getStatusColor = (status) => {
        const map = {
            delivered: 'bg-emerald-500',
            shipped: 'bg-blue-500',
            processing: 'bg-amber-500',
            cancelled: 'bg-rose-500',
            confirmed: 'bg-indigo-500'
        };
        return map[status] || 'bg-neutral-400';
    };

    if (loading) {
        return (
            <div className="h-screen bg-[#f8f7f4] flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 border-[1px] border-neutral-200 rounded-full" />
                    <div className="absolute inset-0 border-t-[1px] border-black rounded-full animate-spin" />
                    <ShoppingBag size={20} strokeWidth={1.5} className="absolute text-neutral-400 animate-pulse" />
                </div>
                <div className="mt-8 flex flex-col items-center gap-1">
                    <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-black">Synchronizing</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f7f4] text-[#1a1a1a] pb-20 md:pb-32" ref={containerRef}>
            <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            <header className="sticky top-0 z-30 bg-[#f8f7f4]/90 backdrop-blur-md border-b border-neutral-200/50 mb-6 md:mb-12">
                <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 md:py-6">
                    <div className="flex flex-col gap-6">
                        {/* Title Section */}
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-[1px] w-4 bg-neutral-400" />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">Merchant Portal</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-serif italic">Order <span className="text-neutral-400">Management</span></h1>
                            </div>
                        </div>

                        {/* Search & Filters Row */}
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="relative w-full md:w-[320px] group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Order ID or Customer..."
                                    className="bg-white border border-neutral-200 rounded-full py-2.5 pl-10 pr-4 text-[11px] w-full outline-none focus:border-black transition-all shadow-sm"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Horizontal Scrollable Tabs on Mobile */}
                            <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-1">
                                <div className="flex bg-neutral-100 p-1 rounded-full border border-neutral-200 w-max md:w-auto">
                                    {['all', 'confirmed', 'processing', 'shipped', 'delivered'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveFilter(tab)}
                                            className={`px-4 md:px-5 py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeFilter === tab ? 'bg-white text-black shadow-sm' : 'text-neutral-400'
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1440px] mx-auto px-4 md:px-8">
                {/* Responsive Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
                    {[
                        { label: "Revenue", value: `₹${orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}`, icon: DollarSign },
                        { label: "Shipments", value: orders.filter(o => o.status === 'shipped').length, icon: Truck },
                        { label: "Awaiting", value: orders.filter(o => o.status === 'confirmed').length, icon: Clock },
                        { label: "Total", value: orders.length, icon: ShoppingBag },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-neutral-200/60 shadow-sm flex items-center justify-between">
                            <div className="overflow-hidden">
                                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-0.5 truncate">{stat.label}</p>
                                <p className="text-lg md:text-2xl font-serif italic truncate">{stat.value}</p>
                            </div>
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 shrink-0 ml-2">
                                <stat.icon size={16} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Cards */}
                <div className="space-y-6 md:space-y-10">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="order-card group bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-neutral-200/60 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500">
                            <div className="grid grid-cols-1 lg:grid-cols-12">

                                {/* Section 1: Customer & Status */}
                                <div className="lg:col-span-3 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-neutral-100 bg-[#fafafa]/50">
                                    <div className="flex items-center justify-between lg:block">
                                        <div className="flex items-center gap-2 mb-0 lg:mb-6">
                                            <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)} animate-pulse`} />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">{order.status}</span>
                                        </div>
                                        <h3 className="text-xs md:text-sm font-mono font-bold">#{order._id.slice(-8).toUpperCase()}</h3>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                                                <User size={13} className="text-neutral-400" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] font-bold uppercase truncate">{order.user?.fullName || "Guest"}</p>
                                                <p className="text-[9px] text-neutral-400 truncate">{order.user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin size={13} className="text-neutral-400 shrink-0 mt-0.5" />
                                            <p className="text-[9px] font-medium text-neutral-500 leading-relaxed line-clamp-2">
                                                {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Items Manifest */}
                                <div className="lg:col-span-5 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-neutral-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">Manifest</p>
                                        <span className="text-[8px] bg-neutral-100 px-2 py-0.5 rounded text-neutral-500 font-bold">{order.items?.length} Items</span>
                                    </div>
                                    <div className="space-y-4 max-h-[220px] lg:max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                                        {order.items?.map((item, i) => (
                                            <div key={i} className="flex gap-4 p-2 rounded-xl hover:bg-neutral-50/50 transition-all">
                                                <div className="relative w-12 h-16 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                                                    <img src={item.product?.images?.[0]?.url} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div className="flex flex-col justify-center overflow-hidden">
                                                    <p className="text-[11px] font-bold truncate">{item.product?.title}</p>
                                                    <p className="text-[9px] text-neutral-400 mt-0.5 uppercase tracking-tighter truncate">
                                                        {item.selectedAttributes?.size} / {item.selectedAttributes?.color} • Qty {item.quantity}
                                                    </p>
                                                    <p className="text-[11px] mt-1 font-serif italic">₹{item.price?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 3: Logistics & Status Select */}
                                <div className="lg:col-span-4 p-6 md:p-8 flex flex-col justify-between bg-neutral-50/30">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-bold uppercase text-neutral-400 ml-1">Carrier</label>
                                            <input
                                                type="text"
                                                value={shippingData[order._id]?.courierPartner ?? order.courierPartner ?? ""}
                                                onChange={(e) => setShippingData(prev => ({ ...prev, [order._id]: { ...prev[order._id], courierPartner: e.target.value } }))}
                                                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-[10px] focus:border-black outline-none"
                                                placeholder="Carrier Name"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-bold uppercase text-neutral-400 ml-1">Tracking ID</label>
                                            <input
                                                type="text"
                                                value={shippingData[order._id]?.trackingNumber ?? order.trackingNumber ?? ""}
                                                onChange={(e) => setShippingData(prev => ({ ...prev, [order._id]: { ...prev[order._id], trackingNumber: e.target.value } }))}
                                                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-[10px] focus:border-black outline-none"
                                                placeholder="ID"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-neutral-200/60">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-bold uppercase text-neutral-400">Total</span>
                                                <span className="text-xl md:text-2xl font-serif">₹{order.totalAmount?.toLocaleString()}</span>
                                            </div>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                className="bg-white px-3 py-2 rounded-lg text-[10px] font-bold uppercase border border-neutral-200 focus:border-black outline-none"
                                            >
                                                <option value="confirmed">Confirm</option>
                                                <option value="processing">Prep</option>
                                                <option value="shipped">Dispatch</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancel</option>
                                            </select>
                                        </div>

                                        <button
                                            disabled={updating[order._id]}
                                            onClick={() => updateStatus(order._id, order.status)}
                                            className="w-full bg-black text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                                        >
                                            {updating[order._id] ? <span className="animate-pulse">Saving...</span> : <>Save Logistics <ArrowRight size={12} /></>}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Details */}
                            <div className="bg-white border-t border-neutral-100 overflow-x-auto">
                                <SellerOrderTracker order={order} />
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                body { font-family: 'Plus Jakarta Sans', sans-serif; scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
                .font-serif { font-family: 'Instrument Serif', serif; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default SellerOrders;