import React, { useState } from "react";
import { useReview } from "../hooks/useReview";
import ReviewForm from "./ReviewForm";

export default function ProductReviewSection({ productId }) {
  const { reviews, loading, submitReview } = useReview(productId);

  const [openForm, setOpenForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <div className="max-w-3xl mx-auto mt-16 px-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Customer Reviews</h2>

        <button
          onClick={() => setOpenForm(true)}
          className="bg-black text-white text-xs px-4 py-2 rounded-full"
        >
          Write Review
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-xs text-gray-400">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-xs text-gray-400">No reviews yet</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="border p-4 rounded-xl bg-white">
              <div className="flex justify-between">
                <p className="text-xs font-semibold">{r.name}</p>
                <p className="text-xs text-yellow-600">
                  ⭐ {r.rating}/5
                </p>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* FORM MODAL */}
      {openForm && (
        <ReviewForm
          loading={submitting}
          onClose={() => setOpenForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}