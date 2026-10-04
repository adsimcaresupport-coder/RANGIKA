import React from 'react';
import { Sprout, Heart, Palette, Feather } from 'lucide-react';

interface ValueItem {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}

const VALUES: ValueItem[] = [
  {
    icon: Sprout,
    title: 'Traditional Art',
    subtitle: 'Rooted in Heritage',
  },
  {
    icon: Heart,
    title: 'Handcrafted',
    subtitle: 'Made with Care',
  },
  {
    icon: Palette,
    title: 'Custom Creations',
    subtitle: 'Designed for You',
  },
  {
    icon: Feather,
    title: 'Cultural Stories',
    subtitle: 'Art with Meaning',
  },
];

export const BrandValuesStrip: React.FC = () => {
  return (
    <section className="bg-[#F4EFE6] border-b border-[#E8DFC9] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center group cursor-default transition-all"
              >
                <div className="w-12 h-12 rounded-full border border-[#D5C7B0] flex items-center justify-center mb-3 text-[#1E2D22] group-hover:border-[#C85A32] group-hover:text-[#C85A32] group-hover:bg-white/60 transition-all duration-300">
                  <Icon className="w-5 h-5 stroke-[1.4]" />
                </div>
                <h4 className="font-serif text-base sm:text-lg font-medium text-[#2E251E] group-hover:text-[#C85A32] transition-colors">
                  {val.title}
                </h4>
                <p className="font-sans text-xs sm:text-xs text-[#7A6B5D] uppercase tracking-wider mt-0.5 font-medium">
                  {val.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
