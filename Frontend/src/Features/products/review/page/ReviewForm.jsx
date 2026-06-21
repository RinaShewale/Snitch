import React, { useState, useEffect } from "react";
import { Star, X, Camera, Trash2 } from "lucide-react";

export default function ReviewForm({ onSubmit, onClose, loading, productId }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p));
  }, [previews]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) return alert("Max 5 images allowed");
    
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return alert("Please write a comment");
    
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("rating", String(rating));
    formData.append("comment", comment);

    // IMPORTANT: Check your backend. If your backend uses 
    // upload.array('images'), use "images". 
    // If it uses upload.array('image'), use "image".
    images.forEach((file) => {
      formData.append("images", file); 
    });

    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose} 
          className="absolute right-8 top-8 p-2 text-neutral-400 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.4em] text-neutral-400 uppercase font-bold mb-2">Feedback</p>
          <h2 className="text-2xl font-serif italic text-neutral-900">Share Your Story</h2>
        </div>

        {/* Star Selection */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button 
                key={s} 
                type="button"
                onClick={() => setRating(s)} 
                onMouseEnter={() => setHoverRating(s)} 
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 active:scale-90"
              >
                <Star 
                  size={32} 
                  className={(hoverRating || rating) >= s ? "text-amber-500 fill-amber-500" : "text-neutral-200"} 
                />
              </button>
            ))}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 h-4">
            {hoverRating || rating === 5 ? "Excellent" : rating === 4 ? "Good" : "Average"}
          </p>
        </div>

        <textarea 
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
          placeholder="How was the quality? The fit? The feel?..." 
          className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-6 text-sm h-36 outline-none focus:border-neutral-300 focus:bg-white transition-all resize-none italic font-light" 
        />

        {/* Image Upload Area */}
        <div className="mt-6">
          <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-3">Add Photos ({images.length}/5)</p>
          <div className="flex flex-wrap gap-2">
            <label className="w-14 h-14 border-2 border-dashed border-neutral-200 flex items-center justify-center rounded-xl cursor-pointer hover:bg-neutral-50 hover:border-neutral-400 transition-all group">
              <Camera size={18} className="text-neutral-300 group-hover:text-neutral-500" />
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            {previews.map((src, i) => (
              <div key={i} className="relative w-14 h-14 group">
                <img src={src} className="w-full h-full object-cover rounded-xl border border-neutral-100" alt="Preview" />
                <button 
                  onClick={() => removeImage(i)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          className="w-full mt-10 py-5 bg-neutral-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-neutral-100"
        >
          {loading ? "Uploading..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}