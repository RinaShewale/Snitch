import React, { useLayoutEffect, useRef, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRazorpay } from "react-razorpay";
import { useNavigate } from "react-router-dom"; // 1. Added useNavigate
import { createOrderAPI, verifyPaymentAPI } from "../services/cart.api";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, MoveRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import gsap from "gsap";
import { increaseCart, decreaseCart, removeFromCart, fetchCart } from "../redux/cart.slice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 2. Initialize navigate
  const containerRef = useRef(null);
  const isInitialMount = useRef(true);

  const cartItems = useSelector((state) => state.cart.items || []);
  const { Razorpay } = useRazorpay();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);

  const total = useSelector((state) => state.cart.totalPrice);
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
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      console.error("Cart action failed:", error);
    } finally {
      setActiveItemId(null);
    }
  };

  const handleCheckout = async () => {
    try {
      setPaymentLoading(true);

      const shippingAddress = JSON.parse(
        localStorage.getItem("shippingAddress")
      );

      // 🚨 REMOVED ALERT - DIRECT REDIRECT
      if (!shippingAddress) {
        navigate("/address"); // Use navigate for SPA feel
        return;
      }

      const res = await createOrderAPI(shippingAddress);
      const order = res.data.order;

      const options = {
        key: "rzp_test_SpkPh7sxRTTlGW",
        amount: order.amount,
        currency: order.currency,
        name: "snitch",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            await verifyPaymentAPI({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            dispatch(fetchCart());
          } catch (err) {
            console.log("Verification failed", err);
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
        },
        theme: {
          color: "#1a1714",
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();

    } catch (err) {
      console.log("Checkout error:", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#f8f5f2] text-[#1a1714] font-light selection:bg-[#1a1714] selection:text-white overflow-x-hidden">
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="hidden lg:block absolute top-10 right-0 text-[18vw] font-serif italic text-[#1a1714]/[0.03] leading-none select-none pointer-events-none">
        Bag
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-32 md:pt-16">
        <header className="mb-8 md:mb-16 reveal">
          <button onClick={() => navigate('/')} className="group flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold mb-6 md:mb-8 opacity-60 hover:opacity-100 transition-all">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to shop</span>
          </button>
          <div className="flex items-baseline justify-between border-b border-[#1a1714]/10 pb-4 md:pb-6">
            <h1 className="text-3xl md:text-6xl font-serif italic tracking-tight">Your Bag</h1>
            <span className="text-[10px] md:text-xs uppercase tracking-widest font-medium opacity-50">[{cartItems.length} items]</span>
          </div>
        </header>

        {cartItems.length === 0 ? (
          <EmptyState onExplore={() => navigate('/')} />
        ) : (
          <div className="grid lg:grid-cols-12 gap-10 xl:gap-20">
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="mb-8 md:mb-12 reveal bg-white/40 backdrop-blur-sm p-5 md:p-6 border border-[#1a1714]/5 rounded-sm">
                <div className="flex justify-between text-[9px] md:text-[10px] uppercase tracking-widest font-bold mb-4">
                  <span className="opacity-80">
                    {progress < 100 ? (
                      <>Spend <span className="font-black">₹{(freeShippingLimit - safeTotal).toLocaleString()}</span> more for free shipping</>
                    ) : (
                      <span className="text-green-700">✓ Complimentary shipping applied</span>
                    )}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-[1.5px] w-full bg-[#1a1714]/5 overflow-hidden">
                  <div className="shipping-line h-full bg-[#1a1714] w-0"></div>
                </div>
              </div>

              <div className="space-y-4">
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

            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-10 space-y-6">
                <div className="bg-white p-6 md:p-10 shadow-sm border border-[#1a1714]/5">
                  <h2 className="text-lg md:text-xl font-serif italic mb-6 md:mb-8 border-b border-[#1a1714]/5 pb-4">Summary</h2>

                  <div className="space-y-4 text-[10px] md:text-[11px] uppercase tracking-widest font-bold mb-8">
                    <div className="flex justify-between opacity-60"><span>Subtotal</span><span>₹{safeTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between opacity-60"><span>Shipping</span><span>{safeTotal > freeShippingLimit ? "Free" : "Calculated at checkout"}</span></div>
                  </div>

                  <div className="pt-6 border-t-2 border-[#1a1714] flex justify-between items-baseline mb-8">
                    <span className="text-[10px] md:text-xs uppercase font-black">Total</span>
                    <span className="text-2xl md:text-4xl font-light tracking-tighter">₹{safeTotal.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={paymentLoading}
                    className="w-full bg-[#1a1714] text-white py-4 md:py-5 uppercase text-[10px] md:text-[11px] tracking-[0.3em] font-black hover:bg-[#2a2622] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-70"
                  >
                    {paymentLoading ? <Loader2 className="animate-spin" size={16} /> : "Secure Checkout"}
                    {!paymentLoading && <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};


const CartItem = memo(({ item, onAction, isUpdating }) => {
  // We use the base item price and don't multiply by quantity as per your request
  const originalPrice = item.price?.amount || 0;
  const currentLivePrice = item.selectedVariant?.price?.amount || item.product?.price?.amount || originalPrice;
  const priceDifference = originalPrice - currentLivePrice;

  return (
    <div className="reveal group bg-white/40 hover:bg-white transition-colors duration-300 p-3 md:p-6 flex gap-4 md:gap-8 border border-transparent hover:border-[#1a1714]/5 rounded-sm relative overflow-hidden">
      {/* Subtle top loading line instead of full-item blinking */}
      {isUpdating && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#1a1714]/5 overflow-hidden">
          <div className="w-1/3 h-full bg-[#1a1714] animate-[loading-bar_1s_infinite_linear]"></div>
        </div>
      )}

      {/* Image */}
      <div className="relative w-20 h-28 md:w-36 md:h-48 overflow-hidden bg-[#ded7d0] flex-shrink-0">
        <img
          src={item.selectedVariant?.images?.[0]?.url || item.product?.images?.[0]?.url}
          alt={item.product?.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1">
              <h3 className="text-xs md:text-lg font-serif italic uppercase leading-tight">{item.product?.title}</h3>
              <p className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-40">ID: {item._id.slice(-6)}</p>
            </div>
            {/* Displaying Original Unit Price (Static) */}
            <p className="text-xs md:text-lg font-medium whitespace-nowrap">
              ₹{originalPrice.toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2 md:mt-3">
            {item.selectedAttributes?.size && (
              <span className="text-[7px] md:text-[9px] px-2 py-0.5 border border-[#1a1714]/10 uppercase font-bold bg-white/50">Size: {item.selectedAttributes.size}</span>
            )}
            {item.selectedAttributes?.color && (
              <span className="text-[7px] md:text-[9px] px-2 py-0.5 border border-[#1a1714]/10 uppercase font-bold bg-white/50">{item.selectedAttributes.color}</span>
            )}
          </div>

          {/* Warning/Savings Text - Smooth Fade Logic (No Blinking) */}
          <div className="mt-3 min-h-[14px]">
            <div className={`transition-all duration-500 ease-out ${Math.abs(priceDifference) > 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
              {priceDifference > 0 ? (
                <p className="text-[8px] md:text-[10px] font-bold text-green-700 uppercase tracking-widest">
                  Live Deal: Save ₹{Math.abs(priceDifference).toLocaleString()} at checkout
                </p>
              ) : priceDifference < 0 ? (
                <p className="text-[8px] md:text-[10px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-1">
                  <AlertCircle size={10} /> Price increased by ₹{Math.abs(priceDifference).toLocaleString()}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center bg-white border border-[#1a1714]/10 shadow-sm rounded-sm overflow-hidden">
            <button
              disabled={item.quantity <= 1 || isUpdating}
              onClick={() => onAction(decreaseCart, { itemId: item._id, quantity: 1 }, item._id)}
              className="p-1.5 md:p-3 hover:bg-[#1a1714] hover:text-white transition-colors disabled:opacity-20"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 md:w-10 text-center text-[10px] md:text-xs font-bold tabular-nums">
              {item.quantity}
            </span>
            <button
              disabled={isUpdating}
              onClick={() => onAction(increaseCart, { itemId: item._id, quantity: 1 }, item._id)}
              className="p-1.5 md:p-3 hover:bg-[#1a1714] hover:text-white transition-colors disabled:opacity-20"
            >
              <Plus size={12} />
            </button>
          </div>

          <button
            disabled={isUpdating}
            onClick={() => onAction(removeFromCart, item._id, item._id)}
            className="group/del flex items-center gap-2 p-2 text-[8px] md:text-[10px] uppercase font-bold opacity-40 hover:opacity-100 transition-all text-red-800 disabled:opacity-10"
          >
            <Trash2 size={12} className="md:size-3.5" />
            <span className="hidden sm:inline tracking-widest">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
});




const EmptyState = ({ onExplore }) => (
  <div className="py-20 md:py-40 text-center reveal border-y border-[#1a1714]/5">
    <ShoppingBag size={48} strokeWidth={0.5} className="opacity-20 mb-6 mx-auto" />
    <h2 className="text-2xl md:text-4xl font-serif italic mb-4 md:mb-6">The bag is empty</h2>
    <button onClick={onExplore} className="inline-flex items-center gap-4 border border-[#1a1714] px-8 py-4 uppercase text-[9px] tracking-[0.3em] font-black hover:bg-[#1a1714] hover:text-white transition-all group">
      Explore Collections <MoveRight size={16} className="group-hover:translate-x-2 transition-transform" />
    </button>
  </div>
);

export default CartPage;