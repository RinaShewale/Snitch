import React, { useState, useEffect } from 'react';
import HeroSlider from '../components/HeroSlider';
import NewSeasonBanner from '../components/NewSeasonBanner';
import ProductGrid from '../components/ProductGrid';
import Editorial from '../components/Editorial';
import TrustBadges from '../components/TrustBadges';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { useProduct } from '../../products/hooks/useProduct';
import CategoryFilter from '../components/CategoryFilter';

export default function DashboardPage() {
  const { handleGetAllProducts } = useProduct();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      try {
        const data = await handleGetAllProducts();
        if (isMounted) {
          setProducts(data || []);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching products on dashboard:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  return (
    <main className="relative bg-[#f5f1ec] text-[#1a1714] min-h-screen overflow-x-hidden selection:bg-[#1a1714] selection:text-[#f5f1ec]">
    

      {/* 2. Fullscreen Multi-Panel Hero */}
      <HeroSlider />
      
      {/* 3. Luxury Announcement Marquee Banner */}
      <div className="bg-[#1a1714] text-[#f5f1ec] py-4 overflow-hidden border-y border-[#f5f1ec]/10">
        <div className="flex animate-marquee whitespace-nowrap gap-16">
           {Array.from({ length: 8 }).map((_, i) => (
             <span key={i} className="text-[9px] uppercase tracking-[0.35em] font-medium flex items-center gap-4">
               <span>Free Worldwide Delivery on Orders Over ₹5,000</span>
               <span className="w-1.5 h-1.5 rounded-full bg-[#ded7d0]"></span>
               <span>Discover Contemporary Luxury Tailoring</span>
               <span className="w-1.5 h-1.5 rounded-full bg-[#ded7d0]"></span>
               <span>New Season Arrivals Live</span>
             </span>
           ))}
        </div>
      </div>



<CategoryFilter />
      {/* 5. Split-Parallax New Season Feature */}
      <NewSeasonBanner />

      {/* 6. Trending Product Grid (Fetched / Fallback list) */}
      <ProductGrid products={products} loading={loading} />

      {/* 7. Brand Philosophy & Macro Detailing */}
      <Editorial />

      {/* 8. Trust Badges Information Grid */}
      <TrustBadges />

      {/* 9. Centered Minimalist Newsletter Subscribe Form */}
      <Newsletter />

      {/* 10. Atelier Dark Footer */}
      <Footer />
    </main>
  );
}