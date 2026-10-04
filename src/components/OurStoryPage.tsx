import React from 'react';
import { ArrowRight, Leaf, Sparkles, Heart, Award, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OurStoryPage: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Editorial Top Headline */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C85A32] font-semibold block mb-3 font-sans">
            THE ROOTS OF RANGIKA
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-[#1E2D22] leading-tight mb-6">
            Preserving Two Millennia of Mithila Soul
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#6B5B4E] font-light leading-relaxed">
            In the ancient kingdom of Mithila, north of the sacred Ganges in Bihar, art was never conceived as mere decoration. It was a sacred living ritual, passed from mother to daughter across generations on the mud walls of festive courtyards.
          </p>
        </div>

        {/* Hero Image Split */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-xl border border-[#E5DAC8]">
          <img
            src="/src/assets/images/artisan_hands_painting_1791131837940.jpg"
            alt="Mithila master artisan hands creating traditional Madhubani motifs with natural pigments"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white max-w-lg">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4943E] font-semibold block mb-1">
              HEREDITARY GUILDS OF JITWARPUR & RANTI
            </span>
            <p className="font-serif text-xl sm:text-2xl font-light">
              "When our hands hold the bamboo stylus, we do not paint alone. Our grandmothers guide every stroke."
            </p>
          </div>
        </div>

        {/* The 5 Authentic Styles */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C85A32] font-semibold block mb-1">
              THE FIVE FORMS
            </span>
            <h2 className="font-serif text-3xl font-medium text-[#1E2D22]">
              The Classical Schools of Madhubani
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E5DAC8] shadow-xs">
              <h3 className="font-serif text-lg font-semibold text-[#1E2D22] mb-2">
                1. Bharni (Mineral Color Fill)
              </h3>
              <p className="text-xs text-[#6B5B4E] leading-relaxed">
                Characterized by rich, flat fills of vibrant natural mineral and plant dyes—turmeric yellow, vermilion red, indigo blue—outlined by solid black contours.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E5DAC8] shadow-xs">
              <h3 className="font-serif text-lg font-semibold text-[#1E2D22] mb-2">
                2. Kachni (Fine Line Hatching)
              </h3>
              <p className="text-xs text-[#6B5B4E] leading-relaxed">
                Rendered strictly in delicate monochrome or limited palette using micro cross-hatching and parallel fine lines. Demands unmatched pen steadiness.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E5DAC8] shadow-xs">
              <h3 className="font-serif text-lg font-semibold text-[#1E2D22] mb-2">
                3. Kohbar (Bridal Blessing)
              </h3>
              <p className="text-xs text-[#6B5B4E] leading-relaxed">
                Sacred chamber ritual compositions featuring the divine marriage of nature: bamboo groves for endurance, lotus for purity, and sun-moon for cosmic balance.
              </p>
            </div>
          </div>
        </div>

        {/* Natural Pigments Sourcing */}
        <div className="bg-[#F4EFE6] rounded-3xl p-8 sm:p-12 border border-[#E8DFC9] flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C85A32] font-semibold block">
              ORGANIC PURITY
            </span>
            <h3 className="font-serif text-3xl font-medium text-[#1E2D22]">
              Dyes Sourced Directly from the Earth
            </h3>
            <p className="text-xs sm:text-sm text-[#6B5B4E] leading-relaxed font-light">
              Unlike commercial factory prints that rely on chemical synthetics, authentic Mithila art is alive. Our master artists produce lampblack soot from mustard oil lamps, bright yellow from dried wild turmeric, deep crimson from peet flowers and sindoor, and verdant greens from fresh broad bean leaves.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('shop')}
                className="bg-[#1E2D22] hover:bg-[#C85A32] text-white px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
              >
                <span>View Certified Original Artworks</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-[#E2D7C5]">
              <img
                src="/src/assets/images/featured_paintings_collection_1791131855630.jpg"
                alt="Living room interior with authentic Mithila paintings"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
