import React, { useState, useEffect, useRef } from "react";
import {
  Search, ShoppingBag, X, Heart, Package, LogOut,
  User, ChevronRight, Menu, ArrowLeft, Box
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../../auth/redux/auth.slice";
import { fetchCart } from "../../products/cart/redux/cart.slice";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useProduct } from "../../products/hooks/useProduct";
import { useWishlist } from "../../products/wishlist/hooks/useWishlist";

gsap.registerPlugin(useGSAP);

export default function Navbar() {
  const { user, loading } = useSelector((state) => state.auth);
  const isSeller = user?.role === "seller";

  const searchProducts = useSelector((state) => state.product?.searchProducts ?? []);
  const { handleSearchSimilarProducts, handleClearSearch } = useProduct();
  const { wishlistItems, fetchWishlist } = useWishlist();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const overlayRef = useRef(null);
  const linksRef = useRef([]);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  const wishlistCount = wishlistItems?.length || 0;

  const customerLinks = [
    { name: "Collections", path: "/category/collections" },
    { name: "Bags", path: "/category/bags" },
    { name: "Footwear", path: "/category/footwear" },
    { name: "Accessories", path: "/category/accessories" },
  ];

  const sellerLinks = [
    { name: "Inventory", path: "/seller/inventory" },
    { name: "Add Product", path: "/seller/create" },
    { name: "Orders", path: "/seller/orders" },
  ];

  const navLinks = isSeller ? sellerLinks : customerLinks;

  // --- Animation Control ---
  const { contextSafe } = useGSAP();
  
  const toggleMenu = contextSafe((open) => {
    if (open) {
      setIsMenuOpen(true);
      document.body.style.overflow = "hidden"; // Prevent scrolling
      const tl = gsap.timeline();
      tl.set(overlayRef.current, { display: "flex", pointerEvents: "auto" })
        .to(overlayRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" })
        .fromTo(linksRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, ease: "power2.out" },
          "-=0.1"
        );
    } else {
      document.body.style.overflow = "unset";
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setIsMenuOpen(false);
          gsap.set(overlayRef.current, { display: "none" });
        }
      });
    }
  });

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const delayDebounceFn = setTimeout(() => {
        handleSearchSimilarProducts(searchQuery);
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      handleClearSearch();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart());
      fetchWishlist();
    }
  }, [user, dispatch, fetchWishlist]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close everything on route change
  useEffect(() => {
    if (isMenuOpen) toggleMenu(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]); // Triggered on path change

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logoutAction());
    setDropdownOpen(false);
    navigate("/login");
  };

  const UserAvatar = ({ size = "w-8 h-8", text = "text-[10px]" }) => {
    const [imgError, setImgError] = useState(false);
    if (user?.avatar && !imgError) {
      return (
        <img
          src={user.avatar}
          className={`${size} rounded-full object-cover border border-neutral-200`}
          alt="Profile"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={() => setImgError(true)}
        />
      );
    }
    return (
      <div className={`${size} rounded-full bg-neutral-900 flex items-center justify-center font-bold text-white ${text}`}>
        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={14} />}
      </div>
    );
  };

  const handleSearchSubmit = async (query) => {
    if (!query.trim()) return;
    setSearchOpen(false);
    setSearchQuery("");
    await handleSearchSimilarProducts(query);
    navigate(`/search?query=${query}`);
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <strong key={i} className="text-black font-bold">{part}</strong>
          ) : (
            <span key={i} className="text-neutral-400">{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <>
      <div className={`transition-all duration-300 ${scrolled ? "h-[64px]" : "h-[80px] lg:h-[100px]"}`} />

      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 bg-white/95 backdrop-blur-md ${scrolled ? "py-3 shadow-sm" : "py-5 lg:py-8"}`}>
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 flex items-center relative">
          <div className="flex items-center flex-1">
            <button onClick={() => toggleMenu(true)} className="lg:hidden p-2 -ml-2 active:scale-90 transition-transform">
              <Menu size={26} strokeWidth={1.5} />
            </button>
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((l) => (
                <Link key={l.name} to={l.path} className="relative group text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-800">
                  {l.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-black transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>

          <Link to={isSeller ? "/seller/orders" : "/"} className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex flex-col items-center z-10">
            <span className="font-serif text-2xl md:text-3xl tracking-[0.25em] md:tracking-[0.4em] text-neutral-900 uppercase font-medium">SNITCH</span>
            {isSeller && <span className="text-[8px] font-bold tracking-[0.3em] text-neutral-400 -mt-1">SELLER HUB</span>}
          </Link>

          <div className="flex items-center justify-end gap-1 md:gap-2 flex-1">
            <button onClick={() => setSearchOpen(true)} className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-neutral-50 rounded-full transition-colors text-neutral-500">
              <Search size={18} strokeWidth={1.5} />
              <span className="text-[10px] uppercase font-bold tracking-widest">Search</span>
            </button>
            <button onClick={() => setSearchOpen(true)} className="md:hidden p-2 active:scale-90 transition-transform"><Search size={22} strokeWidth={1.5} /></button>

            {!isSeller && (
              <>
                <Link to="/wishlist" className="p-2 hover:bg-neutral-50 rounded-full transition-colors relative group active:scale-90">
                  <Heart size={20} strokeWidth={1.5} className={`${wishlistCount > 0 ? "fill-black text-black" : "group-hover:fill-black"} transition-all`} />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-0 w-4 h-4 bg-black text-white text-[8px] rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link to="/cart" className="relative p-2 group active:scale-90 transition-transform">
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  {cartCount > 0 && <span className="absolute top-1 right-0 w-4 h-4 bg-black text-white text-[8px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
                </Link>
              </>
            )}

            {!loading && user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="p-1 active:scale-95 transition-transform"><UserAvatar size="w-8 h-8 md:w-9 md:h-9" /></button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-64 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl border border-neutral-100 p-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-neutral-50 mb-1">
                        <p className="text-[9px] text-neutral-400 uppercase font-bold tracking-widest">{isSeller ? "Seller Account" : "Account"}</p>
                        <p className="text-sm font-semibold truncate">{user.fullName}</p>
                      </div>
                      {isSeller ? (
                        <>
                           <DropdownItem icon={<Box size={16} />} label="Inventory" onClick={() => navigate("/seller/inventory")} />
                           <DropdownItem icon={<Package size={16} />} label="Seller Orders" onClick={() => navigate("/seller/orders")} />
                        </>
                      ) : (
                        <DropdownItem icon={<Package size={16} />} label="My Orders" onClick={() => navigate("/my-orders")} />
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                        <LogOut size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-neutral-50 rounded-full"><User size={20} strokeWidth={1.5} /></Link>
            )}
          </div>
        </div>
      </nav>

      {/* --- SEARCH OVERLAY --- */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 bg-white z-[300] flex flex-col">
            <div className="w-full border-b border-neutral-100 py-4 px-6">
              <div className="max-w-5xl mx-auto flex items-center gap-4">
                <button onClick={() => setSearchOpen(false)} className="p-2 -ml-2"><ArrowLeft size={24} /></button>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(searchQuery)}
                  placeholder="What are you looking for?"
                  className="flex-1 text-xl md:text-3xl font-serif outline-none py-2 placeholder:text-neutral-300"
                />
                <button onClick={() => setSearchQuery("")} className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200"><X size={20} /></button>
              </div>
            </div>
            {/* Results section */}
            <div className="flex-1 overflow-y-auto bg-neutral-50/30">
              <div className="max-w-5xl mx-auto p-6 md:p-10">
                {searchQuery.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchProducts.map((item) => (
                      <div key={item._id} onClick={() => handleSearchSubmit(item.title)} className="flex items-center gap-4 py-4 px-4 bg-white hover:shadow-md cursor-pointer rounded-2xl transition-all group">
                        <div className="w-10 h-10 bg-neutral-100 rounded-xl overflow-hidden">
                          <img src={item.images?.[0]?.url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base tracking-tight">{highlightMatch(item.title, searchQuery)}</span>
                          <span className="text-xs text-neutral-400 uppercase tracking-widest">{item.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE MENU OVERLAY */}
      <div 
        ref={overlayRef} 
        style={{ display: "none", opacity: 0 }} 
        className="fixed inset-0 z-[200] bg-white flex flex-col"
      >
        <div className="flex justify-between items-center px-8 py-6 border-b border-neutral-50">
          <span className="font-serif text-xl tracking-widest">{isSeller ? "SELLER HUB" : "MENU"}</span>
          <button 
            onClick={() => toggleMenu(false)} 
            className="p-3 bg-neutral-100 rounded-full active:scale-90 transition-transform"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-col px-8 py-10 overflow-y-auto h-full">
          <div className="flex flex-col gap-2">
            {navLinks.map((l, i) => (
              <Link
                key={l.name}
                to={l.path}
                ref={el => linksRef.current[i] = el}
                onClick={() => toggleMenu(false)} // FIX: Closes menu immediately when link clicked
                className="text-4xl font-serif py-4 border-b border-neutral-50 flex justify-between items-center active:bg-neutral-50 transition-colors"
              >
                {l.name}
                <ChevronRight size={24} className="text-neutral-300" />
              </Link>
            ))}
          </div>

          {/* Bottom logout for mobile for better UX */}
          {user && (
            <button 
              onClick={handleLogout}
              className="mt-auto mb-10 flex items-center gap-3 text-rose-500 font-bold tracking-widest uppercase text-sm"
            >
              <LogOut size={20} /> Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function DropdownItem({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-neutral-50 transition-all rounded-xl group">
      <div className="flex items-center gap-3">
        <span className="text-neutral-400 group-hover:text-black">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 group-hover:text-black">{label}</span>
      </div>
      <ChevronRight size={14} className="text-neutral-300 group-hover:text-black" />
    </button>
  );
}