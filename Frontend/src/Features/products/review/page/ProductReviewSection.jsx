import React, { useState } from "react";
import { useReview } from "../hooks/useReview";
import ReviewForm from "./ReviewForm";
import { Star, MessageSquare, CheckCircle2, X, ArrowRight, Camera } from "lucide-react";

export default function ProductReviewSection({ productId }) {
  const { reviews = [], loading, submitReview } = useReview(productId);
  const [openForm, setOpenForm] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await submitReview(formData);
      setOpenForm(false);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setSubmitting(false); 
    }
  };

  const getUserName = (userObj) => {
    if (!userObj) return "Verified Buyer";
    if (userObj.fullName) return userObj.fullName;
    if (userObj.email) return userObj.email.split("@")[0];
    return "Guest User";
  };

  const renderStars = (rating, size = 12) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star 
          key={i} 
          size={size} 
          className={i <= rating ? "text-amber-500 fill-amber-500" : "text-neutral-200"} 
        />
      ))}
    </div>
  );

  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  // Reusable Review Card Component
  const ReviewCard = ({ r, compact = false }) => (
    <div className={`group bg-white ${compact ? 'p-6 border-b border-neutral-100' : 'p-8 rounded-[2rem] border border-neutral-100 hover:border-neutral-300 transition-all duration-500 hover:shadow-xl hover:shadow-neutral-200/30'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white text-[10px] font-bold">
            {getUserName(r.userId).charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-900">{getUserName(r.userId)}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 size={10} className="text-emerald-500" />
              <span className="text-[8px] text-emerald-600 font-bold uppercase tracking-tighter">Verified Purchase</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          {renderStars(r.rating, 10)}
          <p className="text-[8px] text-neutral-300 mt-2 uppercase font-bold tracking-widest">
            {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>
      
      <p className="text-sm text-neutral-600 leading-relaxed italic font-light">"{r.comment}"</p>
      
      {r.images?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {r.images.map((img, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl w-14 h-14 bg-neutral-50 border border-neutral-100">
              <img 
                src={img.url} 
                onClick={() => setZoomImage(img.url)} 
                className="w-full h-full object-cover cursor-zoom-in hover:scale-110 transition-transform duration-500" 
                alt="User review" 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-[1300px] mx-auto px-6 md:px-12 w-full mt-32 border-t border-neutral-100 pt-24 pb-24 font-sans overflow-hidden">
      
      {/* --- SECTION HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-20">
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 mb-4 font-bold">Community Reviews</p>
          <h2 className="text-5xl md:text-6xl font-serif italic text-neutral-900 leading-tight">Client <br /> Experiences</h2>
        </div>

        <div className="flex flex-wrap items-center gap-10 bg-neutral-50/50 p-10 rounded-[3rem] border border-neutral-100">
          <div className="text-center">
            <div className="text-6xl font-serif mb-1">{avgRating}</div>
            <div className="flex justify-center">{renderStars(Math.round(Number(avgRating)), 14)}</div>
            <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-400 mt-4 font-bold">Average Score</p>
          </div>
          
          <div className="hidden sm:block h-16 w-[1px] bg-neutral-200" />

          <div className="hidden sm:block w-40 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => Math.round(r.rating) === star).length;
              const perc = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-[9px] font-bold text-neutral-400 w-2">{star}</span>
                  <div className="flex-1 h-[2px] bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-900" style={{ width: `${perc}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => setOpenForm(true)}
            className="bg-neutral-900 text-white px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-neutral-200"
          >
            Leave a Review
          </button>
        </div>
      </div>

      {/* --- FEATURED GRID (Main Page) --- */}
      {loading ? (
        <div className="py-24 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
            <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Loading Reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-32 text-center bg-neutral-50 rounded-[3.5rem] border border-dashed border-neutral-200">
             <MessageSquare className="mx-auto mb-4 text-neutral-300" size={32} />
             <p className="text-neutral-400 font-serif italic text-xl">Be the first to share your journey.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((r) => <ReviewCard key={r._id} r={r} />)}
        </div>
      )}

      {/* --- VIEW ALL TRIGGER --- */}
      {reviews.length > 3 && (
        <div className="mt-20 flex justify-center">
            <button 
                onClick={() => setIsDrawerOpen(true)}
                className="group flex flex-col items-center gap-4 text-neutral-900 hover:text-neutral-500 transition-all"
            >
                <span className="text-[10px] uppercase tracking-[0.4em] font-black">Explore all {reviews.length} reviews</span>
                <div className="w-14 h-14 rounded-full border border-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-all duration-500">
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </button>
        </div>
      )}

      {/* --- SIDE DRAWER PANEL --- */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[500] flex justify-end">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsDrawerOpen(false)} 
            />
            
            {/* Drawer Content */}
            <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                <div className="p-10 border-b border-neutral-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-serif italic text-3xl text-neutral-900">All Reviews</h3>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mt-2">Showing {reviews.length} perspectives</p>
                    </div>
                    <button 
                      onClick={() => setIsDrawerOpen(false)} 
                      className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-neutral-50 transition-colors border border-neutral-100"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto bg-white px-4">
                    {reviews.map((r) => <ReviewCard key={r._id} r={r} compact={true} />)}
                </div>

                <div className="p-10 bg-neutral-50 border-t border-neutral-100">
                    <button 
                      onClick={() => { setIsDrawerOpen(false); setOpenForm(true); }} 
                      className="w-full py-6 bg-neutral-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors"
                    >
                        Write a review
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODALS --- */}
      {openForm && (
        <ReviewForm 
            loading={submitting} 
            onClose={() => setOpenForm(false)} 
            onSubmit={handleSubmit} 
            productId={productId} 
        />
      )}

      {zoomImage && (
        <div 
          className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[600] flex flex-col items-center justify-center p-8 cursor-zoom-out" 
          onClick={() => setZoomImage(null)}
        >
          <img 
            src={zoomImage} 
            className="max-w-full max-h-[80vh] rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] object-contain animate-in zoom-in-95 duration-300" 
            alt="Enlarged" 
          />
          <button className="mt-12 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 hover:text-black transition-colors">
            Click anywhere to close
          </button>
        </div>
      )}
    </div>
  );
}