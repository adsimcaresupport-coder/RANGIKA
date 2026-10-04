import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FeaturedCollectionBanner: React.FC = () => {
  const { setActiveTab, setFilters } = useStore();

  const handleExploreNewArrivals = () => {
    setFilters((prev) => ({
      ...prev,
      category: 'all',
      sortBy: 'newest',
    }));
    setActiveTab('shop');
  };

  return (
    <section className="bg-[#1E2D22] text-[#FAF7F2] py-14 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4943E_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#D4943E] font-semibold block mb-3 font-sans">
              THE RANGIKA COLLECTION
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.15] text-[#FAF7F2] mb-5">
              Traditional Art. <br />
              <span className="italic text-[#EDE5D8] font-normal">Timeless Beauty.</span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#D3C7B5] leading-relaxed max-w-md mb-8 font-light">
              Discover meaningful artwork for your home, your celebrations, and your special moments. Handcrafted with reverence using indigenous mineral pigments and ancient sacred geometry.
            </p>

            <div>
              <button
                onClick={handleExploreNewArrivals}
                className="bg-[#D4943E] hover:bg-[#C85A32] text-white font-medium text-sm sm:text-base px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Explore New Arrivals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT VISUAL: Framed gallery arrangement with script tag matching reference */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-[#3E5343] bg-[#243429]">
              <img
                src="/src/assets/images/featured_paintings_collection_1791131855630.jpg"
                alt="Framed authentic Mithila paintings curated in an elegant luxury interior"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E2D22]/60 via-transparent to-transparent pointer-events-none"></div>

              {/* Floating handwritten cursive accent (matching reference "Different Bags Brighter Stories") */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-none transform rotate-[4deg]">
                <div className="bg-[#1E2D22]/80 backdrop-blur-md px-4 py-2.5 rounded-lg border border-[#E5B869]/30">
                  <p className="font-script text-xl sm:text-2xl text-[#E5B869] text-right whitespace-pre-line leading-tight">
                    Different Stories{"\n"}Brighter Spaces
                  </p>
                </div>
              </div>

              {/* Bottom tag */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-xs text-[#FAF7F2] bg-[#1E2D22]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                Museum Quality Archival Teak & Glass Framing
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
