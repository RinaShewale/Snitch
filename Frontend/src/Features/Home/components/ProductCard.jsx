import React, { useRef } from 'react';
import gsap from 'gsap';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, fetchCart } from '../../products/cart/redux/cart.slice'; // Adjust path
import { useWishlist } from '../../products/wishlist/hooks/useWishlist'; // Adjust path

const ProductCard = ({ product }) => {
  const imgRef = useRef(null);
  const actionsRef = useRef(null);
  const viewBtnRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- WISHLIST HOOK ---
  const { toggleWishlist: toggleWishlistHook, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product?._id);

  const title = product?.title || "Untitled Piece";
  const price = Number(product?.price?.amount ?? product?.priceAmount ?? 0);
  const imageSrc = product?.images?.[0]?.url || product?.images?.[0] || "https://via.placeholder.com/800x1000?text=No+Image";
  const category = product?.category || "Collection";

  // --- GSAP ANIMATIONS ---
  const onMouseEnter = () => {
    if (window.innerWidth >= 768) {
      gsap.killTweensOf([imgRef.current, actionsRef.current.children, viewBtnRef.current]);

      gsap.to(imgRef.current, { 
        scale: 1.08, 
        duration: 0.8, 
        ease: "power2.out" 
      });
      
      gsap.to(actionsRef.current.children, { 
        opacity: 1, 
        x: 0, 
        duration: 0.4, 
        stagger: 0.08, 
        ease: "power2.out",
        overwrite: true 
      });
      
      gsap.to(viewBtnRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        ease: "back.out(1.7)",
        overwrite: true
      });
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth >= 768) {
      gsap.to(imgRef.current, { 
        scale: 1, 
        duration: 0.6, 
        ease: "power2.inOut" 
      });
      
      gsap.to(actionsRef.current.children, { 
        opacity: 0, 
        x: 15, 
        duration: 0.3, 
        stagger: 0.05,
        ease: "power2.in",
        overwrite: true
      });
      
      gsap.to(viewBtnRef.current, { 
        opacity: 0, 
        y: 15, 
        duration: 0.3, 
        ease: "power2.in",
        overwrite: true
      });
    }
  };

  // --- HANDLERS ---
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlistHook(product._id);
    
    // Quick pop animation
    gsap.fromTo(e.currentTarget, 
      { scale: 0.7 }, 
      { scale: 1, duration: 0.4, ease: "back.out(2)" }
    );
  };

  const handleAddToCartClick = async (e) => {
    e.stopPropagation();
    
    // Pop animation
    gsap.fromTo(e.currentTarget, 
        { scale: 0.7 }, 
        { scale: 1, duration: 0.4, ease: "back.out(2)" }
    );

    // Quick add: using first variant if available
    const firstVariant = product?.variants?.[0];
    const variantId = firstVariant?._id;
    const color = firstVariant?.attributes?.color || firstVariant?.color || "";
    const size = (firstVariant?.attributes?.size?.[0] || firstVariant?.size) || "";

    await dispatch(addToCart({
      productId: product._id,
      variantId,
      quantity: 1,
      selectedAttributes: { color, size },
    }));
    dispatch(fetchCart());
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => product?._id && navigate(`/product/${product._id}`)}
      className="group relative flex flex-col bg-white overflow-hidden cursor-pointer w-full"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f4f1ee]">
        <img
          ref={imgRef}
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* --- ACTIONS (HEART/BAG) --- */}
        <div
          ref={actionsRef}
          className="absolute top-3 right-3 flex flex-col gap-2 z-20"
        >
          <button
            onClick={handleWishlistClick}
            className={`w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm transition-colors duration-300
                       opacity-100 translate-x-0 md:opacity-0 md:translate-x-4 hover:bg-white`} 
          >
            <Heart
              size={15}
              fill={isWishlisted ? "#ef4444" : "none"}
              className={isWishlisted ? "text-red-500 stroke-red-500" : "text-[#1a1714]"}
            />
          </button>

          <button
            onClick={handleAddToCartClick}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm
                       opacity-100 translate-x-0 md:opacity-0 md:translate-x-4 hover:bg-black hover:text-white transition-colors duration-300"
          >
            <ShoppingBag size={15} />
          </button>
        </div>

        {/* --- VIEW PRODUCT BUTTON (Desktop Only) --- */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none z-10">
          <button
            ref={viewBtnRef}
            className="opacity-0 translate-y-6 pointer-events-auto bg-white text-[#1a1714] px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 hover:bg-[#1a1714] hover:text-white transition-colors duration-300"
          >
            <Eye size={14} /> View Product
          </button>
        </div>
      </div>

      {/* TEXT CONTENT */}
      <div className="py-5 px-2 flex flex-col items-center text-center">
        <span className="text-[8px] uppercase tracking-[0.3em] text-[#1a1714]/40 font-bold mb-1">
          {category}
        </span>
        <h3 className="text-[13px] font-medium text-[#1a1714] mb-2 tracking-tight line-clamp-1">
          {title}
        </h3>
        <div className="h-[1px] w-6 bg-[#1a1714]/10 mb-2"></div>
        <p className="font-serif text-[15px] text-[#1a1714]">
          ₹{price.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;