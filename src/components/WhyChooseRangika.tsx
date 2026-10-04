import React from 'react';
import { Landmark, Sparkles, Feather, Gift, PackageCheck, HeartHandshake } from 'lucide-react';

const REASONS = [
  {
    title: 'Traditional Mithila Art',
    desc: 'Pure ancestral techniques practiced for centuries in Madhubani, preserving authentic mineral pigments and bamboo nib hatching.',
    icon: Landmark,
  },
  {
    title: 'Custom Artwork Options',
    desc: 'Collaborate with hereditary artists to personalize dimensions, bridal names, specific motifs, and bespoke palettes.',
    icon: Sparkles,
  },
  {
    title: 'Beautiful Cultural Designs',
    desc: 'Each sacred motif—from the lotus of purity to the peacock of prosperity—carries deep Vedic lore and positive harmony.',
    icon: Feather,
  },
  {
    title: 'Artwork for Special Occasions',
    desc: 'Memorable ceremonial heirlooms for weddings, Griha Pravesh housewarmings, milestones, and Diwali celebrations.',
    icon: Gift,
  },
  {
    title: 'Individual & Bulk Orders',
    desc: 'Flexible capacity catering to private collector homes as well as luxury hotels, interior designers, and corporate suites.',
    icon: PackageCheck,
  },
  {
    title: 'Customer-Focused Service',
    desc: 'Transparent quotation, dedicated progress photo updates from the artist, and museum shock-proof delivery nationwide.',
    icon: HeartHandshake,
  },
];

export const WhyChooseRangika: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#F4EFE6] border-b border-[#E8DFC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C85A32] font-semibold block mb-2 font-sans">
            OUR PROMISE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1E2D22] mb-3">
            Why Choose RANGIKA
          </h2>
          <p className="text-sm sm:text-base text-[#6B5B4E] font-light">
            We bridge the sacred vernacular art tradition of Mithila with contemporary elegance and uncompromising craft integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {REASONS.map((r, idx) => {
            const Icon = r.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 border border-[#E5DAC8] shadow-xs hover:border-[#C85A32] hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#C85A32] border border-[#E2D7C5] flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 stroke-[1.6]" />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#1E2D22] mb-2.5">
                  {r.title}
                </h3>
                <p className="text-sm text-[#6B5B4E] font-light leading-relaxed">
                  {r.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
