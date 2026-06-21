import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../hooks/useWishlist"; // Adjust path
import ProductCard from "../../../Home/components/ProductCard"; // Adjust path
import { Heart, ArrowRight } from "lucide-react";

const WishlistPage = () => {
  const { wishlistItems, loading, fetchWishlist } = useWishlist();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center">
        <div className="w-16 h-[1px] bg-black animate-pulse mb-4" />
        <span className="text-[8px] uppercase tracking-[0.4em] font-bold">Your Atelier</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-5 md:px-10">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-neutral-200" />
            <Heart size={16} className="text-neutral-400" />
            <div className="h-[1px] w-8 bg-neutral-200" />
          </div>
          <h1 className="text-5xl font-serif italic mb-4">My Wishlist</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
            {wishlistItems.length} Pieces Saved
          </p>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {wishlistItems?.[0]?.products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-neutral-200 rounded-[3rem] bg-white">
            <p className="text-neutral-400 font-serif italic text-lg mb-8">Your wishlist is currently empty</p>
            <Link
              to="/new"
              className="group flex items-center gap-4 bg-black text-white px-8 py-4 rounded-full transition-all hover:scale-105"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Explore Collection</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        .font-serif { font-family: 'Instrument Serif', serif; }
      `}</style>
    </div>
  );
};

export default WishlistPage;