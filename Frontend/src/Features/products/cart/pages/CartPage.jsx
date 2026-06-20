import React, { useLayoutEffect, useRef, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRazorpay } from "react-razorpay";
import { useNavigate } from "react-router-dom";
import { createOrderAPI, verifyPaymentAPI } from "../services/cart.api";
import { 
  Minus, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ShoppingBag, 
  MoveRight, 
  Loader2 
} from "lucide-react";
import gsap from "gsap";
import { 
  increaseCart, 
  decreaseCart, 
  removeFromCart, 
  fetchCart 
} from "../redux/cart.slice";

/**
 * SUB-COMPONENT: CartItem
 * Resiliently handles various data structures (title/name, price/price.amount, etc.)
 */
const CartItem = memo(({ item, onAction, isUpdating }) => {
  // 1. Identify the product object (handles cases where it's named 'product' or 'productId')
  const p = item.productId || item.product || {};
  
  // 2. Extract Name/Title
  const displayName = p.title || p.name || "Premium Item";
  
  // 3. Extract Price (handles nested objects like {amount: 500} or direct numbers)
  const unitPrice = p.price?.amount || p.price || 0;
  
  // 4. Extract Image (handles 'image' string or 'images' array)
  const displayImage = p.image || (p.images && p.images[0]?.url) || (p.images && p.images[0]) || "https://via.placeholder.com/400x600?text=No+Image";

  // 5. Identify the ID for actions
  const productId = p._id || p.id;

  return (
    <div className={`group relative flex gap-4 md:gap-8 py-6 md:py-10 border-b border-[#1a1714]/5 transition-opacity ${isUpdating ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
      {/* Product Image */}
      <div className="relative aspect-[3/4] w-24 md:w-40 bg-[#eceae7] overflow-hidden flex-shrink-0">
        <img 
          src={displayImage} 
          alt={displayName}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = "https://via.placeholder.com/400x600?text=Image+Error"; }}
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow justify-between py-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[11px] md:text-sm uppercase tracking-wider font-bold mb-1">
              {displayName}
            </h3>
            <p className="text-[10px] md:text-xs opacity-50 uppercase tracking-widest">
              Size: {item.size || 'Standard'}
            </p>
          </div>
          <p className="text-sm md:text-lg font-light tracking-tighter">
            ₹{(unitPrice * item.quantity).toLocaleString()}
          </p>
        </div>

        <div className="flex justify-between items-end">
          {/* Quantity Controls */}
          <div className="flex items-center border border-[#1a1714]/10 rounded-sm bg-white">
            <button 
              onClick={() => onAction(decreaseCart, productId, item._id)}
              className="p-2 hover:bg-[#1a1714] hover:text-white transition-colors"
              disabled={isUpdating || !productId}
            >
              <Minus size={12} />
            </button>
            <span className="w-8 text-center text-[10px] md:text-xs font-bold">{item.quantity}</span>
            <button 
              onClick={() => onAction(increaseCart, productId, item._id)}
              className="p-2 hover:bg-[#1a1714] hover:text-white transition-colors"
              disabled={isUpdating || !productId}
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Remove Button */}
          <button 
            onClick={() => onAction(removeFromCart, productId, item._id)}
            className="flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 hover:opacity-100 hover:text-red-600 transition-all"
          >
            <Trash2 size={12} />
            <span className="hidden md:inline">Remove</span>
          </button>
        </div>
      </div>

      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] z-10">
          <Loader2 className="animate-spin opacity-40" size={20} />
        </div>
      )}
    </div>
  );
});

// --- SUB-COMPONENT: EmptyState ---
const EmptyState = ({ onExplore }) => (
  <div className="py-20 md:py-40 text-center reveal border-y border-[#1a1714]/5">
    <ShoppingBag size={48} strokeWidth={0.5} className="opacity-20 mb-6 mx-auto" />
    <h2 className="text-2xl md:text-4xl font-serif italic mb-4 md:mb-6">The bag is empty</h2>
    <button onClick={onExplore} className="inline-flex items-center gap-4 border border-[#1a1714] px-8 py-4 uppercase text-[9px] tracking-[0.3em] font-black hover:bg-[#1a1714] hover:text-white transition-all group">
      Explore Collections <MoveRight size={16} className="group-hover:translate-x-2 transition-transform" />
    </button>
  </div>
);

// --- MAIN COMPONENT: CartPage ---
const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const isInitialMount = useRef(true);

  // Get data from Redux
  const cartItems = useSelector((state) => state.cart.items || []);
  const total = useSelector((state) => state.cart.totalPrice);
  
  const { Razorpay } = useRazorpay();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);

  const safeTotal = Number(total || 0);
  const freeShippingLimit = 5000;
  const progress = Math.min((safeTotal / freeShippingLimit) * 100, 100);

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isInitialMount.current) {
        gsap.from(".reveal", {
          y: 20, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out"
        });
        isInitialMount.current = false;
      }
      gsap.to(".shipping-line", {
        width: `${progress}%`, duration: 0.6, ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, [progress, cartItems.length]);

  const handleCartAction = async (action, productId, itemId) => {
    if (!productId) return;
    try {
      setActiveItemId(itemId);
      await dispatch(action({ productId })).unwrap();
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
      const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress"));

      if (!shippingAddress) {
        navigate("/address");
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
            navigate('/orders');
          } catch (err) {
            console.log("Verification failed", err);
          }
        },
        prefill: { name: "Customer", email: "customer@example.com" },
        theme: { color: "#1a1714" },
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
      {/* Noise Overlay */}
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
              {/* Shipping Progress Bar */}
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

              {/* Items List */}
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

            {/* Sidebar Summary */}
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

export default CartPage;