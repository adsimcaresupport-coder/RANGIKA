import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Rotate3d } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const HERO_SLIDES = [
  {
    eyebrow: 'TRADITIONAL MITHILA ART',
    headingLine1: 'More Than Art.',
    headingLine2: 'A Story of Mithila.',
    headingLine3: 'A Tradition You Carry.',
    description:
      'Discover the timeless beauty of handcrafted Mithila paintings. Rooted in the rich cultural heritage of Bihar, every artwork brings traditional craftsmanship, meaningful stories, and vibrant Indian artistry into your space.',
    taglineScript: 'Rooted in Culture\nCreated by Hand\nMade for Today',
    rightScript: 'Handmade\nSustainable\nMeaningful',
    image: '/src/assets/images/hero_mithila_art_1791131818866.jpg',
    categoryTarget: 'traditional-mithila',
  },
  {
    eyebrow: 'SACRED KOHBAR BLESSINGS',
    headingLine1: 'Auspicious Symbols.',
    headingLine2: 'Centuries of Lore.',
    headingLine3: 'Woven for Generations.',
    description:
      'Immerse in radiant wedding Kohbar and Kalpavriksha compositions, hand-painted with bamboo nibs and natural mineral dyes by master artisan women of Madhubani.',
    taglineScript: 'Sacred Motifs\nPure Earth Dyes\nVedic Harmony',
    rightScript: 'Authentic\nTimeless\nHandcrafted',
    image: '/src/assets/images/cat_treeoflife_art_1791132060397.jpg',
    categoryTarget: 'wedding-couple',
  },
  {
    eyebrow: 'DIVINE RASLEELA & NATURE',
    headingLine1: 'Dancing Peacocks.',
    headingLine2: 'Celestial Romance.',
    headingLine3: 'Living Indian Art.',
    description:
      'From rhythmically feathered Mayurs to eternal Radha-Krishna milan, experience collector-grade Mithila fine art curated for refined modern interiors.',
    taglineScript: 'Fine Line Kachni\nMineral Pigments\nArt That Heals',
    rightScript: 'Collector Grade\nDirect from Artisans\nCertified',
    image: '/src/assets/images/cat_radhakrishna_art_1791132045679.jpg',
    categoryTarget: 'radha-krishna',
  },
];

export const HeroBanner: React.FC = () => {
  const { setActiveTab, setSelectedCategory, setIsCustomOrderModalOpen } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = HERO_SLIDES[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative bg-[#1E2D22] text-[#FAF7F2] overflow-hidden">
      {/* Background ambient texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px] items-stretch">
          
          {/* LEFT CONTENT AREA */}
          <div className="lg:col-span-6 px-6 sm:px-10 lg:pl-12 lg:pr-8 py-14 sm:py-16 lg:py-20 flex flex-col justify-between z-10">
            <div>
              {/* Overline */}
              <div className="flex items-center gap-3 mb-6">
                <span className="h-[1px] w-8 bg-[#D4943E]"></span>
                <span className="text-[11px] sm:text-xs tracking-[0.25em] font-semibold text-[#D4943E] uppercase font-sans">
                  {slide.eyebrow}
                </span>
              </div>

              {/* Main Headline with Serif Typography */}
              <div className="relative">
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-medium leading-[1.12] tracking-tight text-[#FAF7F2] mb-6">
                  <span className="block">{slide.headingLine1}</span>
                  <span className="block italic text-[#EDE5D8] font-normal">{slide.headingLine2}</span>
                  <span className="block text-[#FAF7F2]">{slide.headingLine3}</span>
                </h1>

                {/* Floating Handwritten Decorative Text (matching reference "Rooted in Culture...") */}
                <div className="hidden sm:block absolute right-0 -top-4 sm:top-2 md:top-4 text-right transform rotate-[-4deg] pointer-events-none">
                  <p className="font-script text-xl sm:text-2xl text-[#E5B869] leading-snug whitespace-pre-line opacity-90 drop-shadow-sm">
                    {slide.taglineScript}
                  </p>
                </div>
              </div>

              {/* Description paragraph */}
              <p className="font-sans text-sm sm:text-base text-[#D3C7B5] leading-relaxed max-w-xl mb-9 font-light">
                {slide.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setSelectedCategory(slide.categoryTarget as any);
                    setActiveTab('shop');
                  }}
                  className="bg-[#D4943E] hover:bg-[#C85A32] text-white font-medium text-sm sm:text-base px-6 sm:px-7 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>Shop Paintings</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('3d-view')}
                  className="bg-[#283C2E] hover:bg-[#344D3C] border border-[#D4943E]/50 text-[#E5B869] font-medium text-sm sm:text-base px-5 sm:px-6 py-3 rounded-full transition-all duration-300 inline-flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Rotate3d className="w-4 h-4 text-[#D4943E]" />
                  <span>3D Wall View</span>
                </button>

                <button
                  onClick={() => setIsCustomOrderModalOpen(true)}
                  className="border border-[#E2D7C5]/40 hover:border-white text-[#FAF7F2] hover:bg-white/10 font-medium text-xs sm:text-sm px-5 py-3 rounded-full transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#D4943E]" />
                  <span>Custom Art</span>
                </button>
              </div>
            </div>

            {/* Slide Navigation Controls at bottom (matching reference: ← — 01 02 03 →) */}
            <div className="pt-10 lg:pt-14 flex items-center gap-6 text-xs text-[#A89C8B]">
              <button
                onClick={handlePrev}
                className="hover:text-white transition-colors p-1"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <span className="w-6 h-[1.5px] bg-[#D4943E]"></span>
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`transition-all font-mono text-xs cursor-pointer ${
                      currentSlide === idx
                        ? 'text-white font-bold scale-110'
                        : 'text-[#847867] hover:text-[#C5B7A2]'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="hover:text-white transition-colors p-1"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT VISUAL AREA matching reference image composition */}
          <div className="lg:col-span-6 relative min-h-[420px] lg:min-h-full overflow-hidden bg-[#243429]">
            <img
              src={slide.image}
              alt="Authentic handcrafted Mithila painting displayed in luxury lifestyle aesthetic"
              className="w-full h-full object-cover object-center transform scale-100 transition-all duration-700 ease-out"
              loading="eager"
            />

            {/* Subtle soft dark vignette on the left edge for seamless transition */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#1E2D22] to-transparent pointer-events-none hidden lg:block"></div>

            {/* Floating handwritten decorative text on the right side (matching reference "Handmade Sustainable Meaningful") */}
            <div className="absolute right-6 top-8 sm:right-10 sm:top-12 z-20 pointer-events-none transform rotate-[3deg]">
              <div className="bg-[#1E2D22]/60 backdrop-blur-sm px-4 py-3 rounded-lg border border-[#E5B869]/20 shadow-lg">
                <p className="font-script text-xl sm:text-2xl text-[#E5B869] whitespace-pre-line text-right leading-snug">
                  {slide.rightScript}
                </p>
              </div>
            </div>

            {/* Subtle decorative bottom badge */}
            <div className="absolute bottom-5 left-5 z-20 bg-[#1E2D22]/85 backdrop-blur-md px-4 py-2 rounded-full border border-[#D4943E]/30 text-xs text-[#FAF7F2] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4943E]"></span>
              <span>100% Hand-painted on Handmade Lokta & Silk</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
