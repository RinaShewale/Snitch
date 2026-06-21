import React, { useState, useEffect } from "react";
import { Star, X, Camera } from "lucide-react";

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
    if (images.length + files.length > 5) return alert("Max 5 images");
    
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return alert("Please write a comment");
    
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("rating", String(rating));
    formData.append("comment", comment);
    
    // Append each file to the 'images' field
    images.forEach((file) => {
      formData.append("images", file);
    });

    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[200] p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl relative">
        <button onClick={onClose} className="absolute right-6 top-6 hover:rotate-90 transition-transform"><X size={20} /></button>
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-widest text-gray-400 uppercase">Write Review</p>
          <h2 className="text-2xl font-serif italic">Share Your Experience</h2>
        </div>
        
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button 
                key={s} 
                onClick={() => setRating(s)} 
                onMouseEnter={() => setHoverRating(s)} 
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform active:scale-90"
              >
                <Star size={32} className={s <= (hoverRating || rating) ? "text-amber-500 fill-amber-500" : "text-gray-200"} />
              </button>
            ))}
          </div>
        </div>

        <textarea 
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
          placeholder="What did you think of the product?" 
          className="w-full border rounded-2xl p-4 text-sm h-32 outline-none focus:border-black transition-colors" 
        />

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          <div className="flex-shrink-0 w-14 h-14 border-2 border-dashed border-neutral-200 flex items-center justify-center rounded-xl relative hover:border-black transition-colors">
            <Camera size={18} className="text-neutral-400" />
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleImageChange} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
          </div>
          {previews.map((src, i) => (
            <img key={i} src={src} className="w-14 h-14 object-cover rounded-xl border border-neutral-100" alt="Preview" />
          ))}
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          className="w-full mt-8 py-4 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors"
        >
          {loading ? "Posting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}