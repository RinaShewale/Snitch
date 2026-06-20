import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../products/hooks/useProduct";

export default function CategoryFilter() {
  const navigate = useNavigate();
  const { handleGetCategories } = useProduct();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await handleGetCategories();

        const allowedCategories = [
          "topwear",
          "bottomwear",
          "co-ords",
          "kurtas",
          "ethnic",
          "western",
          "outerwear",
          "comfort",
          "occasion",
          "party-wear",
        ];

        const filtered = (data || []).filter((cat) =>
          allowedCategories.includes(cat.id)
        );

        setCategories(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = (id) => {
    navigate(`/products/${id}`);
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        No categories found
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl text-center mb-10 text-gray-800">
        Featured Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10">
        {categories.map((cat) => (
          <div
            key={cat._id || cat.id}
            onClick={() => handleClick(cat.id || cat._id)}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform">
              <img
                src={cat.img}
                alt={cat.label}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-center">
              {cat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}