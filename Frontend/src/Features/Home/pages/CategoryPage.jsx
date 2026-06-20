import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../../products/hooks/useProduct";
import ProductCard from "../components/ProductCard";
import { ChevronRight, SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoryPage() {
    const { category } = useParams();
    const { handleGetAllProducts } = useProduct();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("newest");

    // Format category name for display
    const decodedCategory = useMemo(() => decodeURIComponent(category), [category]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await handleGetAllProducts(decodedCategory);
                setProducts(data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, decodedCategory]);
    

    // Skeleton Component
    const SkeletonCard = () => (
        <div className="animate-pulse">
            <div className="bg-neutral-200 aspect-[3/4] rounded-xl mb-4"></div>
            <div className="h-4 bg-neutral-200 w-2/3 mb-2 rounded"></div>
            <div className="h-4 bg-neutral-200 w-1/2 rounded"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfaf8] text-[#1a1a1a]">
            {/* Header Section */}
            <header className="px-6 lg:px-12 pt-10 pb-6 border-b border-neutral-200 bg-white">


                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-serif capitalize mb-2">
                            {decodedCategory}
                        </h1>
                        <p className="text-neutral-500 text-sm">
                            Discover our curated selection of {decodedCategory} ({products.length} items)
                        </p>
                    </div>

                    {/* Interaction Bar */}
                    <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                        <button className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-full text-sm hover:bg-black hover:text-white transition-all">
                            <SlidersHorizontal size={16} />
                            Filter
                        </button>
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-full text-sm">
                                Sort: <span className="font-semibold capitalize">{sortBy}</span>
                                <ChevronDown size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="px-6 lg:px-12 py-10">
                {loading ? (
                    /* Loading Grid */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : products.length > 0 ? (
                    /* Product Grid */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-8"
                    >
                        {products.map((product) => (
                            <div key={product._id} className="group">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                            <SlidersHorizontal className="text-neutral-300" size={32} />
                        </div>
                        <h2 className="text-2xl font-serif mb-2">No products found</h2>
                        <p className="text-neutral-500 mb-8 max-w-xs">
                            We couldn't find anything in this category. Try checking our other collections.
                        </p>
                        <Link
                            to="/"
                            className="px-8 py-3 bg-black text-white rounded-full text-sm uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                        >
                            Shop New Arrivals
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}