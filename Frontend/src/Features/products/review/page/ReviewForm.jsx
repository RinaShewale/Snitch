import React, { useState, useEffect } from "react";
import { Star, X, Camera, Plus, Trash2 } from "lucide-react";

export default function ReviewForm({ onSubmit, onClose, loading, productId }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Clean up memory from object URLs
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p));
  }, [previews]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      return alert("You can only upload up to 5 images.");
    }
    
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return alert("Please share a few words about your experience.");
    
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("rating", String(rating));
    formData.append("comment", comment);
    images.forEach((file) => formData.append("images", file));
    
    await onSubmit(formData);
  };

  const getRatingLabel = (val) => {
    const labels = { 1: "Poor", 2: "Fair", 3: "Average", 4: "Good", 5: "Excellent" };
    return labels[val] || "";
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[450px] p-10 rounded-[3rem] shadow-2xl relative animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-8 top-8 p-2 text-neutral-400 hover:text-black hover:bg-neutral-50 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] tracking-[0.4em] text-neutral-400 uppercase font-bold mb-3">Community Input</p>
          <h2 className="text-3xl font-serif italic text-neutral-900">Write a Review</h2>
        </div>

        {/* Star Rating Section */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button 
                key={s} 
                onClick={() => setRating(s)} 
                onMouseEnter={() => setHoverRating(s)} 
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 active:scale-90"
              >
                <Star 
                  size={36} 
                  strokeWidth={1.5}
                  className={(hoverRating || rating) >= s 
                    ? "text-amber-500 fill-amber-500 transition-colors duration-200" 
                    : "text-neutral-200 transition-colors duration-200"
                  } 
                />
              </button>
            ))}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 h-4">
            {getRatingLabel(hoverRating || rating)}
          </p>
        </div>

        {/* Comment Input */}
        <div className="relative mb-6">
          <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            placeholder="Tell us what you liked or didn't like..." 
            className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-6 text-sm h-40 outline-none focus:border-neutral-300 focus:bg-white transition-all resize-none font-light italic" 
          />
        </div>

        {/* Image Upload Section */}
        <div className="mb-10">
          <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-4">Add Photos ({images.length}/5)</p>
          <div className="flex flex-wrap gap-3">
            <label className="w-16 h-16 border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center rounded-2xl cursor-pointer hover:bg-neutral-50 hover:border-neutral-400 transition-all group">
              <Camera size={20} className="text-neutral-300 group-hover:text-neutral-500 transition-colors" />
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />
            </label>

            {previews.map((src, i) => (
              <div key={i} className="relative group w-16 h-16">
                <img 
                  src={src} 
                  className="w-full h-full object-cover rounded-2xl border border-neutral-100" 
                  alt="Preview" 
                />
                <button 
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity border border-neutral-100 hover:bg-red-50"
                >
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          className="w-full group relative overflow-hidden py-5 bg-neutral-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:shadow-2xl hover:shadow-neutral-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : "Submit Feedback"}
          </span>
          <div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}