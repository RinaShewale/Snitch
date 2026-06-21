import React, { useState } from "react";

export default function ReviewForm({ onSubmit, onClose, loading }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!comment.trim()) return alert("Please write a comment");

    await onSubmit({ rating: Number(rating), comment });

    setComment("");
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-lg">

        <h2 className="text-lg font-bold mb-4">Write Review</h2>

        {/* Rating */}
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} Star
            </option>
          ))}
        </select>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full border p-2 rounded h-24"
        />

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-black text-white py-2 rounded"
          >
            {loading ? "Posting..." : "Submit"}
          </button>
        </div>

      </div>
    </div>
  );
}