import React from 'react';
import { ArrowRight, Rotate3d } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES_LIST } from '../data/paintingsData';
import { PaintingCategory } from '../types';
import { ThreeDTiltCard } from './ThreeDTiltCard';

export const ShopByCategory: React.FC = () => {
  const { setSelectedCategory, setActiveTab } = useStore();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId as PaintingCategory);
    setActiveTab('shop');
  };

  const handleViewAll = () => {
    setSelectedCategory('all');
    setActiveTab('shop');
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C85A32] font-semibold block mb-1">
              Curated Collections
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-[#1E2D22]">
              Explore the Art of Mithila
            </h2>
          </div>

          <button
            onClick={handleViewAll}
            className="text-xs sm:text-sm font-medium tracking-wider uppercase text-[#6B5B4E] hover:text-[#C85A32] inline-flex items-center gap-1.5 transition-colors group cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 5 Horizontal Category Image Cards matching reference screenshot with 3D Tilt */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1">
          {CATEGORIES_LIST.map((category) => (
            <ThreeDTiltCard key={category.id} tiltIntensity={10} className="h-full">
              <div
                onClick={() => handleCategorySelect(category.id)}
                className="group cursor-pointer flex flex-col h-full"
              >
                {/* Image Container with subtle framing and hover zoom */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F0E9DC] border border-[#E5DAC8] shadow-sm transition-all duration-500 group-hover:shadow-lg group-hover:border-[#C85A32]/40">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Count badge */}
                  <div className="absolute top-2.5 right-2.5 bg-[#FAF7F2]/90 backdrop-blur-xs text-[10px] font-semibold text-[#6B5B4E] px-2 py-0.5 rounded-full border border-[#E2D7C5]">
                    {category.count} Works
                  </div>
                </div>

                {/* Title & Arrow matching reference layout */}
                <div className="pt-3 pb-1 flex items-center justify-between">
                  <h3 className="font-serif text-base sm:text-lg font-medium text-[#2E251E] group-hover:text-[#C85A32] transition-colors leading-tight line-clamp-1">
                    {category.name}
                  </h3>
                  <span className="text-[#8E7B6C] group-hover:text-[#C85A32] group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-4 h-4 stroke-[1.6]" />
                  </span>
                </div>
                <p className="text-[11px] text-[#8E7B6C] line-clamp-1 font-light">
                  {category.tagline}
                </p>
              </div>
            </ThreeDTiltCard>
          ))}
        </div>

      </div>
    </section>
  );
};
