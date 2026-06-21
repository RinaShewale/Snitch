import React, { useState } from "react";
import { Star, X, Camera } from "lucide-react";

export default function ReviewForm({ onSubmit, onClose, loading }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const ratingTexts = {
    1: "Poor - Disappointed with the product",
    2: "Fair - Could be better",
    3: "Average - Satisfactory",
    4: "Good - Very pleased with the product",
    5: "Excellent - Highly recommended!",
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    previews.forEach((p) => URL.revokeObjectURL(p));
    onClose();
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return alert("Please write a comment");

    await onSubmit({ rating: Number(rating), comment, images });

    setComment("");
    setRating(5);
    previews.forEach((p) => URL.revokeObjectURL(p));
    setImages([]);
    setPreviews([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#111111]/35 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all duration-300 animate-fadeIn">
      <div className="bg-[#FAFAFA] border border-[#1a1714]/10 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl relative scale-100 transition-all duration-300">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 text-neutral-400 hover:text-black transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-neutral-400 block mb-2">Write Review</span>
          <h2 className="text-2xl font-serif italic text-[#1a1714]">Share Your Experience</h2>
        </div>

        {/* Rating Selector */}
        <div className="flex flex-col items-center gap-2 my-6">
          <span className="text-[9px] uppercase tracking-widest font-black text-[#1a1714]/60">Your Rating</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform duration-100 hover:scale-120 focus:outline-none"
              >
                <Star
                  size={32}
                  strokeWidth={1}
                  className={`${
                    star <= (hoverRating || rating)
                      ? "text-amber-500 fill-amber-500"
                      : "text-neutral-300 fill-transparent"
                  } transition-colors duration-150`}
                />
              </button>
            ))}
          </div>
          <p className="text-[9.5px] font-bold text-neutral-500 h-4 mt-1.5 transition-all duration-300">
            {ratingTexts[hoverRating || rating] || ""}
          </p>
        </div>

        {/* Comment field */}
        <div className="space-y-2 mb-6">
          <label className="text-[9px] uppercase tracking-widest font-black text-[#1a1714]/60">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here... How did it fit? How is the material?"
            className="w-full bg-white border border-[#1a1714]/10 rounded-2xl p-4 text-xs h-28 focus:outline-none focus:border-black transition-colors resize-none placeholder:text-neutral-400 leading-relaxed font-light"
          />
        </div>

        {/* Image Upload Widget */}
        <div className="space-y-3 mb-8">
          <label className="text-[9px] uppercase tracking-widest font-black text-[#1a1714]/60 block">
            Upload Images (Optional, Max 5)
          </label>
          <div className="flex flex-wrap gap-3 items-center">
            {images.length < 5 && (
              <div className="relative w-16 h-16 rounded-2xl border-2 border-dashed border-neutral-200 hover:border-black/35 flex flex-col items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all cursor-pointer bg-white">
                <Camera size={18} className="mb-0.5 text-neutral-400" />
                <span className="text-[8px] font-bold uppercase tracking-wider">Add</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            )}

            {previews.map((src, idx) => (
              <div key={idx} className="relative w-16 h-16 rounded-2xl overflow-hidden border border-neutral-200 group animate-fadeIn">
                <img src={src} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleClose}
            className="flex-1 py-4 border border-[#1a1714]/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#1a1714]/5 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#1a1714] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all hover:-translate-y-0.5 duration-300 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? "Posting..." : "Submit Review"}
          </button>
        </div>

      </div>
    </div>
  );
}