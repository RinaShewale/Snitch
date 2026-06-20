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

    // Filter Logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = activeFilter === "all" || order.status === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [orders, searchTerm, activeFilter]);

    // Entrance Animation
    useLayoutEffect(() => {
        if (!loading && filteredOrders.length > 0) {
            const ctx = gsap.context(() => {
                gsap.fromTo(".order-card",
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "expo.out" }
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
                    {/* Main Outer Spinner - Clean thin line */}
                    <div className="w-20 h-20 border-[1px] border-neutral-200 rounded-full" />
                    <div className="absolute inset-0 border-t-[1px] border-black rounded-full animate-spin" />

                    {/* Center Icon - Using the ShoppingBag or Package icon instead of "A" */}
                    <div className="absolute flex items-center justify-center">
                        <ShoppingBag size={24} strokeWidth={1} className="text-neutral-400 animate-pulse" />
                    </div>
                </div>

                {/* Loading Text */}
                <div className="mt-10 flex flex-col items-center gap-2">
                    <span className="text-[9px] uppercase tracking-[0.6em] font-bold text-black opacity-80">
                        Synchronizing
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.4em] text-neutral-400 animate-pulse">
                        Order Ledger
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f7f4] text-[#1a1a1a] pb-32" ref={containerRef}>
            {/* Subtle background texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            <header className="sticky top-0 z-30 bg-[#f8f7f4]/80 backdrop-blur-md border-b border-neutral-200/50 mb-12">
                <div className="max-w-[1440px] mx-auto px-6 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="h-[1px] w-6 bg-neutral-400" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">Merchant Portal</span>
                            </div>
                            <h1 className="text-4xl font-serif italic">Order <span className="text-neutral-400 italic">Management</span></h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            {/* Search Bar */}
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search Order ID or Customer..."
                                    className="bg-white border border-neutral-200 rounded-full py-3 pl-12 pr-6 text-xs w-[300px] outline-none focus:border-black transition-all shadow-sm"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Status Tabs */}
                            <div className="flex bg-neutral-100 p-1 rounded-full border border-neutral-200 shadow-inner">
                                {['all', 'confirmed', 'processing', 'shipped', 'delivered'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveFilter(tab)}
                                        className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${activeFilter === tab ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-neutral-600'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1440px] mx-auto px-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Gross Revenue", value: `₹${orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}`, icon: DollarSign },
                        { label: "Active Shipments", value: orders.filter(o => o.status === 'shipped').length, icon: Truck },
                        { label: "Awaiting Prep", value: orders.filter(o => o.status === 'confirmed').length, icon: Clock },
                        { label: "Total Orders", value: orders.length, icon: ShoppingBag },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-neutral-200/60 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">{stat.label}</p>
                                <p className="text-2xl font-serif italic">{stat.value}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                                <stat.icon size={20} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Cards */}
                <div className="space-y-8">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="order-card group bg-white rounded-[2rem] border border-neutral-200/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700">
                            <div className="grid grid-cols-1 lg:grid-cols-12">

                                {/* ID & Customer Info */}
                                <div className="lg:col-span-3 p-8 border-b lg:border-b-0 lg:border-r border-neutral-100 bg-[#fafafa]/50">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)} animate-pulse`} />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{order.status}</span>
                                    </div>

                                    <div className="mb-8">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Order Identifier</p>
                                        <h3 className="text-sm font-mono font-bold tracking-tight">#{order._id.slice(-8).toUpperCase()}</h3>
                                        <p className="text-[10px] text-neutral-400 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                                                <User size={14} className="text-neutral-400" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold uppercase">{order.user?.fullName || "Guest"}</p>
                                                <div className="flex items-center gap-1.5 text-neutral-400 mt-1">
                                                    <Mail size={10} />
                                                    <p className="text-[10px] truncate max-w-[120px]">{order.user?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                                                <MapPin size={14} className="text-neutral-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-medium text-neutral-600 leading-relaxed">
                                                    {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Manifest */}
                                <div className="lg:col-span-5 p-8 border-b lg:border-b-0 lg:border-r border-neutral-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Order Manifest</p>
                                        <span className="text-[10px] bg-neutral-100 px-2 py-1 rounded text-neutral-500 font-bold">{order.items?.length} Items</span>
                                    </div>
                                    <div className="space-y-4 max-h-[280px] overflow-y-auto pr-4 custom-scrollbar">
                                        {order.items?.map((item, i) => (
                                            <div key={i} className="flex gap-4 p-3 rounded-2xl border border-transparent hover:border-neutral-100 hover:bg-neutral-50/50 transition-all">
                                                <div className="relative w-16 h-20 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
                                                    <img
                                                        src={item.product?.images?.[0]?.url || "/placeholder.png"}
                                                        className="w-full h-full object-cover"
                                                        alt=""
                                                    />
                                                    <div className="absolute bottom-1 right-1 bg-black text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold">
                                                        x{item.quantity}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <p className="text-xs font-bold line-clamp-1">{item.product?.title}</p>
                                                    <p className="text-[10px] text-neutral-400 mt-1 italic uppercase tracking-wider">
                                                        {item.selectedAttributes?.size || 'OS'} / {item.selectedAttributes?.color || 'N/A'}
                                                    </p>
                                                    <p className="text-xs mt-2 font-serif italic">₹{item.price?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Logistics & Actions */}
                                <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-neutral-50/30">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6">Logistics Suite</p>
                                        <div className="space-y-3">
                                            <div className="group/input">
                                                <label className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 ml-2 mb-1 block">Carrier Name</label>
                                                <input
                                                    type="text"
                                                    value={shippingData[order._id]?.courierPartner ?? order.courierPartner ?? ""}
                                                    onChange={(e) => setShippingData(prev => ({ ...prev, [order._id]: { ...prev[order._id], courierPartner: e.target.value } }))}
                                                    placeholder="e.g. BlueDart, FedEx"
                                                    className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-[11px] focus:border-black transition-all outline-none"
                                                />
                                            </div>
                                            <div className="group/input">
                                                <label className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 ml-2 mb-1 block">Tracking Reference</label>
                                                <input
                                                    type="text"
                                                    value={shippingData[order._id]?.trackingNumber ?? order.trackingNumber ?? ""}
                                                    onChange={(e) => setShippingData(prev => ({ ...prev, [order._id]: { ...prev[order._id], trackingNumber: e.target.value } }))}
                                                    placeholder="Enter ID"
                                                    className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-[11px] focus:border-black transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-neutral-200/60">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-[9px] font-bold uppercase text-neutral-400">Total Settlement</p>
                                                <p className="text-2xl font-serif">₹{order.totalAmount?.toLocaleString()}</p>
                                            </div>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none border transition-all ${updating[order._id] ? 'opacity-50 pointer-events-none' : 'hover:border-black cursor-pointer'
                                                    }`}
                                            >
                                                <option value="confirmed">Confirm</option>
                                                <option value="processing">Atelier/Prep</option>
                                                <option value="shipped">Dispatch</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancel</option>
                                            </select>
                                        </div>

                                        <button
                                            disabled={updating[order._id]}
                                            onClick={() => updateStatus(order._id, order.status)}
                                            className="w-full bg-black text-white py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {updating[order._id] ? (
                                                <span className="animate-pulse">Saving Changes...</span>
                                            ) : (
                                                <>Update Shipping Info <ArrowRight size={14} /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Collapsible Tracker Detail */}
                            <div className="bg-white border-t border-neutral-100">
                                <SellerOrderTracker order={order} />
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; scroll-behavior: smooth; }
        .font-serif { font-family: 'Instrument Serif', serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 10px; }
      `}</style>
        </div>
    );
};

export default SellerOrders;