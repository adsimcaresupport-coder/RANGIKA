import React, { useState } from 'react';
import { X, Palette, Type, Layers, Box, Sliders, Image, Check, Copy } from 'lucide-react';
import { STYLE_GUIDE } from '../styles/styleGuide';
import { useStore } from '../context/StoreContext';

export const StyleGuideModal: React.FC = () => {
  const { isStyleGuideOpen, setIsStyleGuideOpen, showToast } = useStore();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!isStyleGuideOpen) return null;

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast('Color Copied', `Hex code ${hex} copied to clipboard!`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E5DAC8] my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-[#EAE3D5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1E2D22] text-[#D4943E] flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#1E2D22]">
                RANGIKA Brand Visual Style Guide
              </h3>
              <p className="text-xs text-[#8E7B6C]">
                Living Design System: Palettes, Typography, Spacing, Buttons, Forms & Imagery
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsStyleGuideOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Style Guide Content */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-12 flex-1">
          
          {/* 1. COLOR PALETTES */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-[#C85A32]"></span>
              <h4 className="font-serif text-2xl font-medium text-[#1E2D22]">
                1. Primary & Secondary Color Palettes
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#6B5B4E] font-light mb-6">
              Rooted in the organic heritage pigments of northern Bihar: aged handmade Lokta paper, charcoal soot, terracotta kilns, natural turmeric, and deep forest evergreen.
            </p>

            {/* Primary Swatches */}
            <div className="mb-6">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-3">
                Primary Core Colors
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STYLE_GUIDE.colorPalettes.primary.map((swatch) => (
                  <div
                    key={swatch.hex}
                    onClick={() => copyToClipboard(swatch.hex)}
                    className="bg-white rounded-2xl border border-[#E5DAC8] p-4 shadow-xs hover:border-[#C85A32] cursor-pointer group transition-all"
                  >
                    <div
                      className="w-full h-20 rounded-xl mb-3 border border-black/10 flex items-center justify-center transition-transform group-hover:scale-102"
                      style={{ backgroundColor: swatch.hex }}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-[10px] px-2 py-1 rounded">
                        {copiedHex === swatch.hex ? 'Copied!' : 'Click to copy'}
                      </span>
                    </div>
                    <span className="font-serif text-base font-semibold text-[#1E2D22] block">
                      {swatch.name}
                    </span>
                    <div className="flex items-center justify-between text-xs font-mono text-[#8E7B6C] my-1">
                      <span>{swatch.hex}</span>
                      <span className="text-[10px]">{swatch.rgb}</span>
                    </div>
                    <p className="text-[11px] text-[#5A4D41] leading-tight font-light mt-2">
                      {swatch.usage}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Swatches */}
            <div className="mb-6">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-3">
                Secondary Accent & Earth Tones
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {STYLE_GUIDE.colorPalettes.secondary.map((swatch) => (
                  <div
                    key={swatch.hex}
                    onClick={() => copyToClipboard(swatch.hex)}
                    className="bg-white rounded-2xl border border-[#E5DAC8] p-3.5 shadow-xs hover:border-[#C85A32] cursor-pointer group transition-all"
                  >
                    <div
                      className="w-full h-14 rounded-xl mb-2.5 border border-black/10"
                      style={{ backgroundColor: swatch.hex }}
                    ></div>
                    <span className="font-serif text-sm font-semibold text-[#1E2D22] block">
                      {swatch.name}
                    </span>
                    <span className="font-mono text-xs text-[#8E7B6C] block">{swatch.hex}</span>
                    <p className="text-[10px] text-[#5A4D41] font-light mt-1 line-clamp-2">
                      {swatch.usage}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Traditional Mithila Pigment Lore */}
            <div className="bg-[#F4EFE6] p-5 rounded-2xl border border-[#E2D7C5]">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-3">
                Traditional Madhubani Pigment Sourcebook
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                {STYLE_GUIDE.colorPalettes.traditionalMithilaPigments.map((pig) => (
                  <div key={pig.name} className="flex items-start gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: pig.hex }}
                    ></span>
                    <div>
                      <strong className="text-[#1E2D22] block font-serif text-sm">{pig.name}</strong>
                      <span className="text-[11px] text-[#7A6B5D] font-light">{pig.usage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. TYPOGRAPHY HIERARCHY */}
          <section className="pt-8 border-t border-[#EAE3D5]">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-[#D4943E]"></span>
              <h4 className="font-serif text-2xl font-medium text-[#1E2D22]">
                2. Typography Hierarchy
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#6B5B4E] font-light mb-6">
              A balanced blend of majestic classical serif for headlines, ultra-readable modern sans-serif for descriptions, and natural cursive script for poetic artisan annotations.
            </p>

            <div className="space-y-4">
              {STYLE_GUIDE.typography.hierarchy.map((typeLevel) => (
                <div
                  key={typeLevel.level}
                  className="bg-white p-5 rounded-2xl border border-[#E5DAC8] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="md:w-1/3">
                    <span className="text-xs uppercase tracking-wider text-[#C85A32] font-semibold block">
                      {typeLevel.level}
                    </span>
                    <span className="text-xs text-[#8E7B6C] block mt-0.5">{typeLevel.font}</span>
                    <span className="text-[11px] text-[#7A6B5D] font-mono mt-0.5 block">
                      Size: {typeLevel.size}
                    </span>
                  </div>

                  <div className="md:w-2/3">
                    <p
                      className={`${
                        typeLevel.level.includes('Script')
                          ? 'font-script text-2xl text-[#8E5A3C]'
                          : typeLevel.level.includes('Hero') || typeLevel.level.includes('Title')
                          ? 'font-serif text-xl sm:text-2xl text-[#1E2D22]'
                          : 'text-sm text-[#2E251E]'
                      }`}
                    >
                      {typeLevel.example}
                    </p>
                    <span className="text-[11px] text-[#8E7B6C] mt-1 block">
                      Purpose: {typeLevel.usage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. BUTTON STYLES */}
          <section className="pt-8 border-t border-[#EAE3D5]">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-[#1E2D22]"></span>
              <h4 className="font-serif text-2xl font-medium text-[#1E2D22]">
                3. Button Styles & Interactions
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {STYLE_GUIDE.buttonStyles.map((btn) => (
                <div key={btn.name} className="bg-white p-6 rounded-2xl border border-[#E5DAC8]">
                  <h5 className="font-serif text-base font-semibold text-[#1E2D22] mb-1">
                    {btn.name}
                  </h5>
                  <p className="text-xs text-[#6B5B4E] mb-4 font-light">{btn.description}</p>
                  
                  {/* Button Demo */}
                  <div className="p-4 bg-[#FAF7F2] rounded-xl flex items-center justify-center">
                    {btn.name.includes('Ghost') ? (
                      <div className="bg-[#1E2D22] p-4 rounded-xl w-full flex justify-center">
                        <button className={btn.classes}>Create Custom Art</button>
                      </div>
                    ) : (
                      <button className={btn.classes}>
                        <span>Action Preview</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. FORM ELEMENTS & IMAGE TREATMENT */}
          <section className="pt-8 border-t border-[#EAE3D5]">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-[#8E5A3C]"></span>
              <h4 className="font-serif text-2xl font-medium text-[#1E2D22]">
                4. Form Design & Image Treatment Philosophy
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#5A4D41]">
              <div className="bg-white p-6 rounded-2xl border border-[#E5DAC8] space-y-3">
                <h5 className="font-serif text-lg font-medium text-[#1E2D22]">
                  Form Element Standards
                </h5>
                <p>• Backgrounds: Pure white or warm oatmeal #FAF7F2 with 1px border (#E2D7C5).</p>
                <p>• Active Focus: Smooth 300ms terracotta (#C85A32) outline ring.</p>
                <p>• Labels: Uppercase tracking-wider 11px font for disciplined editorial structure.</p>
                <p>• Upload Containers: 2px dashed border with gentle hover feedback.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E5DAC8] space-y-3">
                <h5 className="font-serif text-lg font-medium text-[#1E2D22]">
                  Image Treatment Philosophy
                </h5>
                <p>• <strong>Cultural Authenticity:</strong> High fidelity, tactile handmade Lokta texture, natural soft sunlight, no artificial synthetic glossy filters.</p>
                <p>• <strong>Aspect Proportions:</strong> 3:4 for portrait wall art cards; 16:9 for lifestyle interior banners; 4:3 for artisanal macro hands.</p>
                <p>• <strong>Micro-interactions:</strong> Subtle 1.03x scale zoom (600ms bezier) on hover with warm vignette.</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#EAE3D5] flex justify-end">
          <button
            onClick={() => setIsStyleGuideOpen(false)}
            className="bg-[#1E2D22] hover:bg-[#C85A32] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
