import React, { useState } from "react";
import { useReview } from "../hooks/useReview";
import ReviewForm from "./ReviewForm";
import { Star, MessageSquare, X } from "lucide-react";

export default function ProductReviewSection({ productId }) {
  const { reviews = [], loading, submitReview } = useReview(productId);

  const [openForm, setOpenForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      await submitReview({
        productId,
        ...data,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: Get Initials from Name
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Helper: Get Custom Avatar Color Palette
  const getAvatarBg = (name) => {
    if (!name) return "bg-[#e5e5e5] text-neutral-600";
    const colors = [
      "bg-[#e8ece9] text-[#2c3e2f]", // Sage green
      "bg-[#f0ece1] text-[#4f4631]", // Cream / Brown
      "bg-[#e5ebf0] text-[#1c384e]", // Soft blue
      "bg-[#ebdce6] text-[#4a1c3d]", // Soft pink
      "bg-[#ece5f0] text-[#2f1c4e]", // Soft purple
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Helper: Render beautiful stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} size={14} className="text-amber-500 fill-amber-500" />
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <div key={i} className="relative inline-block">
            <Star size={14} className="text-neutral-200 fill-neutral-200" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star size={14} className="text-amber-500 fill-amber-500" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} size={14} className="text-neutral-200 fill-neutral-200" />
        );
      }
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  // Calculations
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  // Build star distribution
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const roundedRating = Math.round(r.rating);
    if (starCounts[roundedRating] !== undefined) {
      starCounts[roundedRating]++;
    }
  });

  return (
    <div className="lg:col-span-12 w-full mt-24 border-t border-[#1a1714]/10 pt-16 font-sans">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-10 gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 block mb-2">Feedback</span>
          <h2 className="text-3xl font-serif italic tracking-tight text-[#1a1714]">Customer Reviews</h2>
        </div>
        <div className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
          {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"} for this product
        </div>
      </div>

      {/* RATING SUMMARY STATS PANEL */}
      {totalReviews > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-[#1a1714]/5 rounded-[2rem] p-8 mb-12 shadow-sm">
          {/* Large Average Score */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#1a1714]/5 pb-8 md:pb-0 md:pr-8">
            <p className="text-6xl font-serif italic tracking-tighter text-[#1a1714] mb-3">{averageRating}</p>
            {renderStars(Number(averageRating))}
            <p className="text-[9px] uppercase tracking-widest font-black text-neutral-400 mt-3">Average Rating</p>
          </div>

          {/* Breakdown Bars */}
          <div className="md:col-span-5 space-y-2.5 flex flex-col justify-center">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = starCounts[stars] || 0;
              const percentage = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-neutral-400 w-10 text-right">{stars} Star</span>
                  <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1a1714] rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400 w-12 text-left">
                    {percentage}% ({count})
                  </span>
                </div>
              );
            })}
          </div>

          {/* CTA Box */}
          <div className="md:col-span-3 flex flex-col items-center justify-center text-center pl-0 md:pl-4">
            <p className="text-sm font-serif italic text-[#1a1714] mb-1">Share your thoughts</p>
            <p className="text-[10px] text-neutral-400 font-light leading-relaxed mb-5 max-w-[200px]">
              If you have purchased this product, tell other buyers about your experience.
            </p>
            <button
              onClick={() => setOpenForm(true)}
              className="w-full bg-[#1a1714] text-white hover:bg-black text-[10px] font-black uppercase tracking-[0.2em] px-6 py-4 rounded-2xl transition-all hover:-translate-y-0.5 duration-300 shadow-sm"
            >
              Write a Review
            </button>
          </div>
        </div>
      )}

      {/* REVIEWS LIST */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#1a1714]/5 rounded-[2rem]">
          <div className="w-8 h-8 border-2 border-neutral-200 border-t-[#1a1714] rounded-full animate-spin mb-4" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold">Loading Customer Reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#1a1714]/5 rounded-[2rem] px-6 shadow-sm">
          <MessageSquare size={32} strokeWidth={1} className="text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-serif italic text-neutral-700 mb-1">No Reviews Yet</h3>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 max-w-xs mx-auto mb-6">
            Be the first to share your thoughts on this product.
          </p>
          <button
            onClick={() => setOpenForm(true)}
            className="border border-[#1a1714]/20 hover:bg-[#1a1714]/5 text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4.5 rounded-2xl transition-all duration-300"
          >
            Write the First Review
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => {
            const initials = getInitials(r.name);
            const avatarColor = getAvatarBg(r.name);
            const reviewDate = r.createdAt
              ? new Date(r.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
              : "Recent Purchase";

            return (
              <div
                key={r._id}
                className="bg-white border border-[#1a1714]/5 rounded-[2rem] p-6 md:p-8 shadow-sm transition-all hover:shadow-md duration-300"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center font-bold text-xs uppercase tracking-[0.15em] shadow-sm`}>
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-[#1a1714]">{r.name || "Verified Customer"}</p>
                        <span className="bg-[#f0ece1] text-[#4f4631] text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-neutral-200/20">
                          Verified Buyer
                        </span>
                      </div>
                      <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-1">{reviewDate}</p>
                    </div>
                  </div>

                  <div>{renderStars(r.rating)}</div>
                </div>

                <div className="mt-6 pl-0 md:pl-16">
                  <p className="text-xs text-neutral-600 leading-relaxed font-light whitespace-pre-line">
                    {r.comment}
                  </p>

                  {/* Review Attachment Images */}
                  {r.images && r.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {r.images.map((img, idx) => (
                        <div
                          key={img.fileId || idx}
                          onClick={() => setZoomImage(img.url || img)}
                          className="relative w-20 h-20 rounded-2xl overflow-hidden border border-neutral-100 shadow-sm cursor-zoom-in hover:opacity-90 transition-opacity animate-fadeIn"
                        >
                          <img
                            src={img.url || img}
                            className="w-full h-full object-cover"
                            alt={`Review Attachment ${idx + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FORM MODAL */}
      {openForm && (
        <ReviewForm
          loading={submitting}
          onClose={() => setOpenForm(false)}
          onSubmit={handleSubmit}
          productId={productId}
        />
      )}

      {/* ZOOM IMAGE OVERLAY MODAL */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-[#111111]/70 backdrop-blur-md flex items-center justify-center z-[150] p-4 cursor-zoom-out animate-fadeIn"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-black">
            <button
              onClick={() => setZoomImage(null)}
              className="absolute right-6 top-6 w-10 h-10 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors z-10 border border-white/15"
            >
              <X size={18} />
            </button>
            <img
              src={zoomImage}
              className="max-w-full max-h-[80vh] object-contain mx-auto"
              alt="Zoomed Review Attachment"
            />
          </div>
        </div>
      )}
    </div>
  );
}