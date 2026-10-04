import React from 'react';
import { Lightbulb, Compass, FileCheck2, Brush, ShieldCheck, Truck } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Share Your Idea',
    desc: 'Tell us your preferred theme, motifs, color tones, and wall dimensions.',
    icon: Lightbulb,
  },
  {
    num: '02',
    title: 'Choose Your Design',
    desc: 'Our master artisans share compositional sketches and symbolism options.',
    icon: Compass,
  },
  {
    num: '03',
    title: 'Approve Quotation',
    desc: 'Receive transparent pricing based on size, complexity, and framing.',
    icon: FileCheck2,
  },
  {
    num: '04',
    title: 'We Create Artwork',
    desc: 'Hand-painted using natural mineral dyes and bamboo reed pens on handmade paper.',
    icon: Brush,
  },
  {
    num: '05',
    title: 'Quality Check',
    desc: 'Rigorous inspection of line fidelity, dye setting, and archival framing.',
    icon: ShieldCheck,
  },
  {
    num: '06',
    title: 'Safe Delivery',
    desc: 'Securely packaged in museum shockproof crates with tracking right to your door.',
    icon: Truck,
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#EAE3D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C85A32] font-semibold block mb-2 font-sans">
            THE ARTISANAL JOURNEY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1E2D22] mb-3">
            How Custom Art Comes to Life
          </h2>
          <p className="text-sm sm:text-base text-[#6B5B4E] font-light">
            From your cherished inspiration to a timeless Indian folk heirloom in six thoughtful steps.
          </p>
        </div>

        {/* 6 Step Process Horizontal Grid on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-white p-5 rounded-2xl border border-[#E5DAC8] shadow-xs hover:border-[#C85A32] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Row: Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#D4943E] bg-[#FAF7F2] px-2 py-1 rounded border border-[#E2D7C5]">
                      {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-[#F4EFE6] text-[#1E2D22] group-hover:bg-[#1E2D22] group-hover:text-white transition-colors flex items-center justify-center">
                      <Icon className="w-4 h-4 stroke-[1.6]" />
                    </div>
                  </div>

                  <h3 className="font-serif text-base font-semibold text-[#1E2D22] group-hover:text-[#C85A32] transition-colors mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#6B5B4E] leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F4EFE6] flex items-center gap-1.5 text-[10px] text-[#8E7B6C] uppercase font-semibold tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]"></span>
                  <span>Step {idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
