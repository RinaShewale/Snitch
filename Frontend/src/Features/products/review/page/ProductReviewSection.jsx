import React, { useState, useMemo } from "react";
import { useReview } from "../hooks/useReview";
import ReviewForm from "./ReviewForm";
import { Star, MessageSquare, CheckCircle2, X, ArrowRight, LayoutGrid, MessageCircle } from "lucide-react";

// Helper to get name safely
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

export default function ProductReviewSection({ productId }) {
  const { reviews = [], loading, submitReview } = useReview(productId);
  const [openForm, setOpenForm] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState("reviews");
  const [submitting, setSubmitting] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);

  // Updated to handle the [{url: "..."}] structure from DB
  const allUserImages = useMemo(() => {
    return reviews.flatMap(r =>
      (r.images || []).map(img => ({
        url: img?.url || img, // Handle both string or object
        userName: getUserName(r.userId),
        date: r.createdAt
      }))
    ).filter(img => img.url);
  }, [reviews]);

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

  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const ReviewCard = ({ r, compact = false }) => {
    return (
      <div className={`group bg-white ${compact ? 'p-6 border-b border-neutral-100' : 'p-8 rounded-[2rem] border border-neutral-100 hover:border-neutral-300 transition-all duration-500 hover:shadow-xl hover:shadow-neutral-200/30'}`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white text-[10px] font-bold uppercase">
              {getUserName(r.userId).charAt(0)}
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

        {/* IMAGE LISTING FIX */}
        {(r.images || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {r.images.map((img, i) => {
              const imageUrl = img?.url || img;
              if (!imageUrl) return null;
              return (
                <div key={i} className="relative overflow-hidden rounded-xl w-14 h-14 bg-neutral-50 border border-neutral-100">
                  <img
                    src={imageUrl}
                    onClick={() => setZoomImage(imageUrl)}
                    className="w-full h-full object-cover cursor-zoom-in hover:opacity-80 transition"
                    alt="User Upload"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-[1300px] mx-auto px-6 md:px-12 w-full mt-32 border-t border-neutral-100 pt-24 pb-24 font-sans">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-20">
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 mb-4 font-bold">Reviews</p>
          <h2 className="text-5xl md:text-6xl font-serif italic text-neutral-900 leading-tight">Customer <br /> Experience</h2>
        </div>

        <div className="flex flex-wrap items-center gap-10 bg-neutral-50/50 p-10 rounded-[3rem] border border-neutral-100">
          <div className="text-center">
            <div className="text-6xl font-serif mb-1">{avgRating}</div>
            <div className="flex justify-center">{renderStars(Math.round(Number(avgRating)), 14)}</div>
            <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-400 mt-4 font-bold">Average Score ({reviews.length})</p>
          </div>
          <div className="hidden sm:block h-16 w-[1px] bg-neutral-200" />
          <button
            onClick={() => setOpenForm(true)}
            className="bg-neutral-900 text-white px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200"
          >
            Leave a Review
          </button>
        </div>
      </div>

      {/* REVIEWS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-3 text-center py-20 animate-pulse text-neutral-400 text-[10px] uppercase tracking-widest font-bold">Syncing Stories...</div>
        ) : reviews.length === 0 ? (
          <div className="col-span-3 py-32 text-center bg-neutral-50 rounded-[3.5rem] border border-dashed border-neutral-200">
            <MessageSquare className="mx-auto mb-4 text-neutral-300" size={32} />
            <p className="text-neutral-400 font-serif italic text-xl">Be the first to share your journey.</p>
          </div>
        ) : (
          reviews.slice(0, 3).map((r) => <ReviewCard key={r._id} r={r} />)
        )}
      </div>

      {/* EXPLORE MORE BUTTON */}
      {reviews.length > 0 && (
        <div className="mt-20 flex justify-center">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="group flex flex-col items-center gap-4 text-neutral-900 transition-all hover:text-neutral-500"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] font-black">
              Explore {reviews.length} reviews & {allUserImages.length} photos
            </span>
            <div className="w-14 h-14 rounded-full border border-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-all duration-500">
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      )}

      {/* DRAWER & ZOOM MODALS */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[500] flex justify-end">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col">
            <div className="p-10 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="font-serif italic text-3xl">Community</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-100"><X size={18} /></button>
            </div>

            <div className="flex px-10 py-4 gap-8 border-b border-neutral-50 bg-neutral-50/30">
              <button onClick={() => setDrawerTab("reviews")} className={`text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 pb-2 ${drawerTab === 'reviews' ? 'text-black border-b-2 border-black' : 'text-neutral-400'}`}>
                <MessageCircle size={14} /> Reviews ({reviews.length})
              </button>
              <button onClick={() => setDrawerTab("gallery")} className={`text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 pb-2 ${drawerTab === 'gallery' ? 'text-black border-b-2 border-black' : 'text-neutral-400'}`}>
                <LayoutGrid size={14} /> Gallery ({allUserImages.length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {drawerTab === "reviews" ? (
                <div className="space-y-1">
                  {reviews.map((r) => <ReviewCard key={r._id} r={r} compact={true} />)}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {allUserImages.map((img, i) => (
                    <div key={i} className="aspect-square relative group overflow-hidden rounded-lg bg-neutral-100">
                      <img
                        src={img.url}
                        onClick={() => setZoomImage(img.url)}
                        className="w-full h-full object-cover cursor-zoom-in"
                        alt="Community"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {openForm && <ReviewForm loading={submitting} onClose={() => setOpenForm(false)} onSubmit={handleSubmit} productId={productId} />}

      {zoomImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[600] flex items-center justify-center p-8" onClick={() => setZoomImage(null)}>
          <img src={zoomImage} className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" alt="Enlarged" />
        </div>
      )}
    </div>
  );
}