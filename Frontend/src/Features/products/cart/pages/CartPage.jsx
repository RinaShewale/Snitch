import React, { useLayoutEffect, useRef, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRazorpay } from "react-razorpay";
import { useNavigate } from "react-router-dom";
import { createOrderAPI, verifyPaymentAPI } from "../services/cart.api";
import {
  Minus, Plus, Trash2, ArrowLeft, ShoppingBag,
  MoveRight, ShieldCheck, Loader2, AlertCircle
} from "lucide-react";
import gsap from "gsap";
import {
  increaseCart, decreaseCart, removeFromCart,
  fetchCart, clearCart
} from "../redux/cart.slice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const isInitialMount = useRef(true);

  // Redux State
  const cartItems = useSelector((state) => state.cart.items || []);
  const total = useSelector((state) => state.cart.totalPrice);
  const { Razorpay } = useRazorpay();

  // Local UI State
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);

  const safeTotal = Number(total || 0);
  const freeShippingLimit = 5000;
  const progress = Math.min((safeTotal / freeShippingLimit) * 100, 100);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isInitialMount.current) {
        gsap.from(".reveal", {
          y: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
        });
        isInitialMount.current = false;
      }
      gsap.to(".shipping-line", {
        width: `${progress}%`,
        duration: 0.6,
        ease: "power2.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, [progress, cartItems.length]);

  const handleCartAction = async (action, payload, itemId) => {
    try {
      setActiveItemId(itemId);
      await dispatch(action(payload)).unwrap();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setActiveItemId(null);
    }
  };

  const handleCheckout = async () => {
    try {
      setPaymentLoading(true);

      const savedAddress = localStorage.getItem("shippingAddress");
      if (!savedAddress) {
        navigate("/address");
        return;
      }
      const shippingAddress = JSON.parse(savedAddress);

      // 1. Create order on server
      const res = await createOrderAPI(shippingAddress);
      const order = res.data.order;

      const options = {
        key: "rzp_test_SpkPh7sxRTTlGW",
        amount: order.amount,
        currency: order.currency,
        name: "Snitch",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            await verifyPaymentAPI({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // ✅ clear redux cart ONLY
            dispatch(clearCart());

            // optional safety: reset loading
            setPaymentLoading(false);

            // ✅ correct route
            navigate("/order-success", { replace: true });

          } catch (err) {
            console.error("Verification failed", err);
            alert("Payment verification failed.");
          }
        },
        prefill: { name: "Customer", email: "customer@example.com" },
        theme: { color: "#1a1714" },
        modal: { ondismiss: () => setPaymentLoading(false) }
      };

      const rzp = new Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#f8f5f2] text-[#1a1714] font-light selection:bg-[#1a1714] selection:text-white overflow-x-hidden">
      {/* Visual Grain */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-32 md:pt-16">
        <header className="mb-12 reveal">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold mb-8 opacity-60 hover:opacity-100 transition-all">
            <ArrowLeft size={12} />
            <span>Back</span>
          </button>
          <div className="flex items-baseline justify-between border-b border-[#1a1714]/10 pb-6">
            <h1 className="text-4xl md:text-6xl font-serif italic tracking-tight">Your Bag</h1>
            <span className="text-xs uppercase tracking-widest font-medium opacity-50">[{cartItems.length}]</span>
          </div>
        </header>

        {cartItems.length === 0 ? (
          <EmptyState onExplore={() => navigate('/')} />
        ) : (
          <div className="grid lg:grid-cols-12 gap-12 xl:gap-20">
            {/* Items List */}
            <div className="lg:col-span-7 xl:col-span-8">
              {/* Shipping Progress */}
              <div className="mb-12 reveal bg-white/40 backdrop-blur-sm p-6 border border-[#1a1714]/5">
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-4">
                  <span className="opacity-80">
                    {progress < 100
                      ? `Spend ₹${(freeShippingLimit - safeTotal).toLocaleString()} more for free shipping`
                      : "Complimentary shipping applied"}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-[1px] w-full bg-[#1a1714]/5">
                  <div className="shipping-line h-full bg-[#1a1714] w-0"></div>
                </div>
              </div>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    onAction={handleCartAction}
                    isUpdating={activeItemId === item._id}
                  />
                ))}
              </div>
            </div>

            {/* Summary Sidebar */}
            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-10 space-y-6">
                <div className="bg-white p-8 md:p-10 shadow-sm border border-[#1a1714]/5">
                  <h2 className="text-xl font-serif italic mb-8 border-b border-[#1a1714]/5 pb-4">Summary</h2>

                  <div className="space-y-4 text-[11px] uppercase tracking-widest font-bold mb-8">
                    <div className="flex justify-between opacity-60">
                      <span>Subtotal</span>
                      <span>₹{safeTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between opacity-60">
                      <span>Shipping</span>
                      <span>{safeTotal > freeShippingLimit ? "Free" : "Calculated"}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t-2 border-[#1a1714] flex justify-between items-baseline mb-8">
                    <span className="text-xs uppercase font-black">Total</span>
                    <span className="text-3xl md:text-4xl font-light tracking-tighter italic">₹{safeTotal.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={paymentLoading}
                    className="w-full bg-[#1a1714] text-white py-5 uppercase text-[11px] tracking-[0.3em] font-black hover:bg-black transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    {paymentLoading ? <Loader2 className="animate-spin" size={16} /> : "Complete Order"}
                    {!paymentLoading && <MoveRight size={16} />}
                  </button>

                  <div className="mt-8 flex items-center justify-center gap-4 opacity-30 text-[9px] uppercase tracking-widest font-bold">
                    <ShieldCheck size={14} />
                    <span>Secure Encrypted Checkout</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

/* ======================
   SUB-COMPONENTS
====================== */

const CartItem = memo(({ item, onAction, isUpdating }) => {
  // Determine price to show
  const displayPrice = item.selectedVariant?.price?.amount || item.product?.price?.amount || item.price?.amount || 0;

  return (
    <div className="reveal group bg-white/40 hover:bg-white transition-all duration-500 p-4 md:p-6 flex gap-6 md:gap-8 border border-[#1a1714]/5 rounded-sm relative">
      {isUpdating && (
        <div className="absolute top-0 left-0 w-full h-[1px] bg-[#1a1714] animate-pulse"></div>
      )}

      <div className="w-24 h-32 md:w-32 md:h-44 bg-[#f0edea] overflow-hidden flex-shrink-0">
        <img
          src={item.selectedVariant?.images?.[0]?.url || item.product?.images?.[0]?.url}
          alt={item.product?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-sm md:text-xl font-serif italic uppercase">{item.product?.title}</h3>
            <p className="text-sm md:text-lg font-medium">₹{displayPrice.toLocaleString()}</p>
          </div>
          <div className="flex gap-4 mt-2">
            {item.selectedAttributes?.size && (
              <p className="text-[9px] uppercase tracking-widest font-bold opacity-40">Size: {item.selectedAttributes.size}</p>
            )}
            {item.selectedAttributes?.color && (
              <p className="text-[9px] uppercase tracking-widest font-bold opacity-40">Color: {item.selectedAttributes.color}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center border border-[#1a1714]/10 rounded-full px-2 py-1 bg-white">
            <button
              disabled={item.quantity <= 1 || isUpdating}
              onClick={() => onAction(decreaseCart, { itemId: item._id, quantity: 1 }, item._id)}
              className="p-2 hover:opacity-50 transition-opacity disabled:opacity-10"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
            <button
              disabled={isUpdating}
              onClick={() => onAction(increaseCart, { itemId: item._id, quantity: 1 }, item._id)}
              className="p-2 hover:opacity-50 transition-opacity disabled:opacity-10"
            >
              <Plus size={12} />
            </button>
          </div>

          <button
            disabled={isUpdating}
            onClick={() => onAction(removeFromCart, item._id, item._id)}
            className="flex items-center gap-2 text-[9px] uppercase font-bold text-red-800/60 hover:text-red-800 transition-colors"
          >
            <Trash2 size={12} />
            <span className="tracking-widest">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
});

const EmptyState = ({ onExplore }) => (
  <div className="py-32 text-center reveal">
    <ShoppingBag size={40} className="mx-auto mb-6 opacity-20" strokeWidth={1} />
    <h2 className="text-3xl font-serif italic mb-8">The bag is empty</h2>
    <button onClick={onExplore} className="inline-flex items-center gap-4 border-b border-[#1a1714] pb-2 uppercase text-[10px] tracking-[0.3em] font-black hover:opacity-50 transition-all">
      Continue Browsing <MoveRight size={14} />
    </button>
  </div>
);

export default CartPage;