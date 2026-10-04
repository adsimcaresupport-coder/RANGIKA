import React from 'react';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OurStorySection: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <section className="bg-[#FAF7F2] border-t border-[#EAE3D5] py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* LEFT: Artisan Handcrafting Photography with circular badge overlay */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-[#E5DAC8] bg-[#F4EFE6]">
              <img
                src="/src/assets/images/artisan_hands_painting_1791131837940.jpg"
                alt="Indian master artisan hands painting traditional Madhubani motifs with natural pigments"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              
              {/* Circular Seal Badge (matching reference 'CRAFTING BRIGHTER TOMORROWS') */}
              <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 bg-[#1E2D22]/90 backdrop-blur-md text-[#FAF7F2] w-28 h-28 sm:w-32 sm:h-32 rounded-full p-2 flex flex-col items-center justify-center text-center border border-[#D4943E]/40 shadow-xl cursor-default group">
                <div className="w-full h-full border border-dashed border-[#D4943E]/40 rounded-full flex flex-col items-center justify-center p-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#D4943E]">
                    CRAFTING
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#E5B869] my-0.5" />
                  <span className="text-[8px] uppercase tracking-[0.16em] text-[#E8DFC9] leading-tight font-medium">
                    HERITAGE FOR TOMORROWS
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#D4943E] mt-1 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Cultural origin footnote */}
            <div className="mt-3 flex items-center justify-between text-xs text-[#8E7B6C] px-1">
              <span>Ranti & Jitwarpur Clusters, Madhubani District, Bihar</span>
              <span className="italic font-serif">100% Fair Trade Artisan Guild</span>
            </div>
          </div>

          {/* RIGHT: Warm cream story content matching reference */}
          <div className="lg:col-span-6 relative">
            {/* Small uppercase heading */}
            <span className="text-xs uppercase tracking-[0.25em] text-[#C85A32] font-semibold block mb-3">
              OUR STORY
            </span>

            {/* Main Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1E2D22] leading-tight mb-6">
              Keeping Our Traditions Alive
            </h2>

            {/* Story Description paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-[#5A4D41] font-light leading-relaxed mb-8">
              <p>
                <strong className="font-semibold text-[#2E251E]">RANGIKA</strong> celebrates the rich artistic heritage of Mithila through authentic paintings and customized artwork. Our collection brings together cultural expression, intricate patterns, meaningful stories, and timeless Indian creativity.
              </p>
              <p>
                Practiced for over two millennia in northern Bihar, Madhubani art began as ritual wall paintings (Bhitti Chitra) created by women on festive mud courtyards and bridal chambers. Today, we empower hereditary master women artists by bringing their authentic pen-and-dye lore directly to discerning art patrons worldwide.
              </p>
              <p>
                Whether you are looking for a painting for your home, a thoughtful gift, or a personalized design, RANGIKA helps you discover artwork that reflects your taste and imagination.
              </p>
            </div>

            {/* Action button & script accent */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
              <button
                onClick={() => setActiveTab('our-story')}
                className="text-sm font-semibold tracking-wider uppercase text-[#1E2D22] hover:text-[#C85A32] inline-flex items-center gap-2 border-b-2 border-[#1E2D22] hover:border-[#C85A32] pb-1 transition-all group cursor-pointer"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Decorative handwritten accent (matching reference "From Bangladesh to the World" -> "From Mithila to the World") */}
              <div className="flex items-center gap-2 pointer-events-none">
                <Leaf className="w-5 h-5 text-[#3E5644] opacity-80" />
                <span className="font-script text-2xl sm:text-3xl text-[#8E5A3C] tracking-wide transform rotate-[-2deg]">
                  From Mithila to the World
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
