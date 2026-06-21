import React, { useState } from "react";
import { Star, X, Camera } from "lucide-react";

export default function ReviewForm({ onSubmit, onClose, loading, productId }) {
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

        const newPreviews = files.map(f => URL.createObjectURL(f));

        setImages((prev) => [...prev, ...files]);
        setPreviews((prev) => [...prev, ...newPreviews]);
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

    // ⭐ FIXED SUBMIT LOGIC (MAIN FIX)
    const handleSubmit = async () => {
        if (!comment.trim()) return alert("Please write a comment");

        const formData = new FormData();

        formData.append("rating", String(rating));   // ✅ force string
        formData.append("comment", comment);
        formData.append("productId", productId);

        images.forEach((file) => {
            formData.append("images", file);
        });

        await onSubmit(formData);

        setComment("");
        setRating(5);
        setImages([]);
        setPreviews([]);
        onClose();
    };

    

    return (
        <div className="fixed inset-0 bg-[#111111]/35 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-[#FAFAFA] border border-[#1a1714]/10 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl relative">

                {/* Close */}
                <button
                    onClick={handleClose}
                    className="absolute right-6 top-6 text-neutral-400 hover:text-black"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-neutral-400 block mb-2">
                        Write Review
                    </span>
                    <h2 className="text-2xl font-serif italic text-[#1a1714]">
                        Share Your Experience
                    </h2>
                </div>

                {/* Rating */}
                <div className="flex flex-col items-center gap-2 my-6">
                    <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            >
                                <Star
                                    size={32}
                                    strokeWidth={1}
                                    className={
                                        star <= (hoverRating || rating)
                                            ? "text-amber-500 fill-amber-500"
                                            : "text-neutral-300"
                                    }
                                />
                            </button>
                        ))}
                    </div>

                    <p className="text-[10px] text-neutral-500">
                        {ratingTexts[hoverRating || rating]}
                    </p>
                </div>

                {/* Comment */}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review..."
                    className="w-full border p-4 rounded-2xl text-xs h-28"
                />

                {/* Images */}
                <div className="flex flex-wrap gap-3 mt-4">
                    {images.length < 5 && (
                        <div className="w-16 h-16 border-dashed border-2 flex items-center justify-center relative rounded-xl">
                            <Camera size={18} />
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
                        <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden">
                            <img src={src} className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeImage(idx)}
                                className="absolute inset-0 bg-black/50 text-white opacity-0 hover:opacity-100"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleClose}
                        className="flex-1 border rounded-2xl py-3 text-xs"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-black text-white rounded-2xl py-3 text-xs"
                    >
                        {loading ? "Posting..." : "Submit Review"}
                    </button>
                </div>

            </div>
        </div>
    );
}