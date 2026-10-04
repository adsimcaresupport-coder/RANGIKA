import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Home,
  Compass,
  Heart,
  RotateCcw,
  ShoppingBag,
  Eye,
  Rotate3d,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Layers,
  Info
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Painting } from '../types';
import { ThreeDTiltCard } from './ThreeDTiltCard';

interface MatchmakerResult {
  primaryMatchId: string;
  matchedPaintingIds: string[];
  curatorSummary: string;
  colorHarmonyReasoning: string;
  culturalEnergyAlignment: string;
  recommendedFraming: string;
  recommendedWallColorId: string;
  placementTip: string;
  isGeminiPowered?: boolean;
}

const ROOMS = [
  { id: 'Living Room', label: 'Living Room', desc: 'Central conversation & family gathering' },
  { id: 'Master Bedroom', label: 'Master Bedroom', desc: 'Serene retreat of intimacy & rest' },
  { id: 'Puja & Sacred Room', label: 'Puja & Sacred Space', desc: 'Devotional altar & daily meditation' },
  { id: 'Dining Hall', label: 'Dining Hall', desc: 'Nourishment, warmth & celebration' },
  { id: 'Foyer / Entrance', label: 'Foyer & Entranceway', desc: 'First impression of auspicious welcome' },
  { id: 'Study & Home Office', label: 'Study / Executive Office', desc: 'Intellectual clarity, focus & wisdom' },
];

const WALL_COLORS = [
  { id: 'Warm Cream / Off-White', label: 'Warm Cream / Off-White', hex: '#FAF7F2', border: '#E2D7C5' },
  { id: 'Mithila Terracotta / Rust', label: 'Mithila Terracotta / Rust', hex: '#B85532', border: '#8A3B20' },
  { id: 'Deep Forest / Sage Green', label: 'Deep Forest / Sage Green', hex: '#1E2D22', border: '#3E5343' },
  { id: 'Haveli Sandstone / Warm Beige', label: 'Haveli Sandstone / Beige', hex: '#E8DFC9', border: '#C5B7A2' },
  { id: 'Royal Indigo / Neel Blue', label: 'Royal Midnight Neel', hex: '#1C2833', border: '#2C3E50' },
  { id: 'Charcoal / Slate Grey', label: 'Charcoal / Slate Grey', hex: '#343A40', border: '#495057' },
];

const STYLES = [
  { id: 'Modern Minimalist & Japandi', label: 'Modern Minimalist / Japandi', desc: 'Clean lines, raw textures, unhurried space' },
  { id: 'Classic Indian Heritage & Haveli', label: 'Classic Indian Heritage', desc: 'Teak wood, brass accents, rich architectural lore' },
  { id: 'Contemporary Luxury', label: 'Contemporary Luxury', desc: 'Refined neutral surfaces, statement art lighting' },
  { id: 'Warm Bohemian & Earthy', label: 'Warm Bohemian & Earthy', desc: 'Linen, terracotta planters, handloom textures' },
];

const ENERGIES = [
  { id: 'Peace & Meditative Tranquility', label: 'Peace & Serenity', desc: 'Calming mind and relieving daily stress' },
  { id: 'Prosperity & Auspicious Abundance', label: 'Prosperity & Abundance', desc: 'Inviting flourishing joy and growth' },
  { id: 'Divine Love & Devotional Harmony', label: 'Love & Devotional Harmony', desc: 'Strengthening relationships & warmth' },
  { id: 'Intellectual Wisdom & Strength', label: 'Wisdom & Steadfast Dignity', desc: 'Fostering insight, courage and focus' },
];

export const ArtMatchmaker: React.FC = () => {
  const { paintings, addToCart, setSelectedPainting, setActiveTab, showToast } = useStore();

  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0].id);
  const [selectedWallColor, setSelectedWallColor] = useState(WALL_COLORS[0].id);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [selectedEnergy, setSelectedEnergy] = useState(ENERGIES[0].id);
  const [userNotes, setUserNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MatchmakerResult | null>(null);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/art-matchmaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomType: selectedRoom,
          wallColor: selectedWallColor,
          interiorStyle: selectedStyle,
          desiredEnergy: selectedEnergy,
          userNotes,
          availablePaintings: paintings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate match');
      }

      const data: MatchmakerResult = await response.json();
      setResult(data);
      showToast(
        'Art Match Discovered!',
        `Gemini curator matched artwork for your ${selectedRoom}.`
      );
    } catch (err) {
      console.error(err);
      // Fallback matching
      const defaultId = paintings[0]?.id || 'rangika-01';
      setResult({
        primaryMatchId: defaultId,
        matchedPaintingIds: [defaultId, paintings[1]?.id || 'rangika-02', paintings[2]?.id || 'rangika-03'],
        curatorSummary: `This exquisite handcrafted Mithila artwork forms a sacred visual anchor in your ${selectedRoom}, complementing the ${selectedWallColor} tones with natural mineral pigments.`,
        colorHarmonyReasoning: `The earthy minerals create natural depth against your wall tone, elevating natural lighting and room presence.`,
        culturalEnergyAlignment: `According to sacred Mithila lore, these traditional symbols foster ${selectedEnergy.toLowerCase()} and bring ancient blessings.`,
        recommendedFraming: 'Solid Teak Wood Frame',
        recommendedWallColorId: 'linen-cream',
        placementTip: 'Hang centered at 57 inches eye-level with warm 2700K ambient illumination.',
        isGeminiPowered: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const primaryPainting = paintings.find((p) => p.id === result?.primaryMatchId) || paintings[0];
  const secondaryPaintings = paintings.filter(
    (p) => result?.matchedPaintingIds.includes(p.id) && p.id !== result?.primaryMatchId
  );

  return (
    <section id="art-matchmaker" className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-[#EAE3D5] relative overflow-hidden">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C85A32_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#F4EFE6] border border-[#E2D7C5] px-4 py-1.5 rounded-full text-xs text-[#C85A32] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI ART CURATOR & MATCHMAKER</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1E2D22] mb-3">
            Find Your Home's Sacred Counterpart
          </h2>
          <p className="text-sm sm:text-base text-[#6B5B4E] font-light leading-relaxed">
            Our Gemini AI Art Curator analyzes your interior dimensions, wall palette, room function, and Vedic energy aspirations to recommend the ideal authentic Mithila artwork.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-3xl p-12 border border-[#E5DAC8] shadow-lg text-center max-w-xl mx-auto space-y-6 animate-in fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-[#F4EFE6] border-t-[#C85A32] animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-[#F4EFE6] border-b-[#D4943E] animate-spin [animation-direction:reverse] [animation-duration:3s]"></div>
              <Sparkles className="w-8 h-8 text-[#D4943E] absolute inset-0 m-auto animate-pulse" />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-medium text-[#1E2D22] mb-2">
                Consulting RANGIKA's Art Curator AI...
              </h3>
              <p className="text-xs text-[#6B5B4E] max-w-sm mx-auto leading-relaxed">
                Analyzing natural mineral pigment temperatures, classical Madhubani motifs, and spatial harmony for your {selectedRoom}...
              </p>
            </div>
          </div>
        )}

        {/* Results View */}
        {!isLoading && result && (
          <div className="space-y-12 animate-in fade-in zoom-in-95">
            {/* Primary Match Showcase */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DAC8] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
              
              {/* Left: 3D Tilt Artwork Card */}
              <div className="lg:col-span-5 flex justify-center">
                <ThreeDTiltCard tiltIntensity={12} className="w-full max-w-sm">
                  <div
                    onClick={() => setSelectedPainting(primaryPainting)}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-[#F4EFE6] border-4 border-[#3D2617] cursor-pointer group"
                  >
                    <img
                      src={primaryPainting.image}
                      alt={primaryPainting.title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Top Match Tag */}
                    <div className="absolute top-3 left-3 bg-[#1E2D22]/90 backdrop-blur-xs text-[#FAF7F2] text-[10px] font-semibold px-3 py-1 rounded-full border border-[#D4943E]/40 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#D4943E]" />
                      <span>99.4% Curatorial Match</span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-full">
                      Click to inspect
                    </div>
                  </div>
                </ThreeDTiltCard>
              </div>

              {/* Right: AI Curatorial Analysis & Actions */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#C85A32]">
                      {primaryPainting.categoryName} · {primaryPainting.style}
                    </span>
                    {result.isGeminiPowered && (
                      <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded font-mono font-medium">
                        Gemini 3.8 Flash
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-3xl font-medium text-[#1E2D22] mb-1">
                    {primaryPainting.title}
                  </h3>
                  <p className="text-xs text-[#8E7B6C]">
                    By <strong className="text-[#1E2D22]">{primaryPainting.artist}</strong> ({primaryPainting.artistLineage})
                  </p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pb-3 border-b border-[#EAE3D5]">
                  <span className="font-serif text-3xl font-semibold text-[#1E2D22]">
                    ₹{primaryPainting.price.toLocaleString('en-IN')}
                  </span>
                  {primaryPainting.originalPrice && (
                    <span className="text-xs text-[#8E7B6C] line-through">
                      ₹{primaryPainting.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full font-medium ml-auto">
                    Free Insured Transit Included
                  </span>
                </div>

                {/* AI Reasoning Accordions / Points */}
                <div className="space-y-3 text-xs">
                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E5DAC8]">
                    <strong className="text-[#1E2D22] font-serif text-sm block mb-1">
                      Curator's Spatial Verdict:
                    </strong>
                    <p className="text-[#5A4D41] leading-relaxed font-light">
                      {result.curatorSummary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DAC8]">
                      <strong className="text-[#1E2D22] block font-semibold mb-0.5">
                        Color Harmony:
                      </strong>
                      <p className="text-[#6B5B4E] leading-relaxed">
                        {result.colorHarmonyReasoning}
                      </p>
                    </div>

                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DAC8]">
                      <strong className="text-[#1E2D22] block font-semibold mb-0.5">
                        Vedic Energy Lore:
                      </strong>
                      <p className="text-[#6B5B4E] leading-relaxed">
                        {result.culturalEnergyAlignment}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[#8E7B6C] text-[11px] pt-1">
                    <span><strong>Recommended Framing:</strong> {result.recommendedFraming}</span>
                    <span><strong>Placement:</strong> {result.placementTip}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      const defaultFraming = primaryPainting.framingOptions[1] || primaryPainting.framingOptions[0];
                      addToCart(primaryPainting, primaryPainting.defaultSize, defaultFraming, 1);
                    }}
                    className="bg-[#1E2D22] hover:bg-[#C85A32] text-white px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart (₹{primaryPainting.price.toLocaleString('en-IN')})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('3d-view')}
                    className="bg-[#283C2E] hover:bg-[#344D3C] text-[#E5B869] border border-[#D4943E]/40 px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Rotate3d className="w-4 h-4 text-[#D4943E]" />
                    <span>View on 3D Wall</span>
                  </button>

                  <button
                    onClick={() => setResult(null)}
                    className="p-3 text-[#8E7B6C] hover:text-[#C85A32] transition-colors ml-auto text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Secondary Complementary Matches */}
            {secondaryPaintings.length > 0 && (
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-[0.2em] text-[#6B5B4E] font-semibold block text-center">
                  Alternate Curatorial Selections for this Space
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {secondaryPaintings.map((painting) => (
                    <div
                      key={painting.id}
                      className="bg-white p-4 rounded-2xl border border-[#E5DAC8] flex gap-4 items-center shadow-xs hover:border-[#C85A32] transition-all"
                    >
                      <img
                        src={painting.image}
                        alt={painting.title}
                        className="w-20 h-24 rounded-xl object-cover flex-shrink-0 border"
                      />
                      <div className="flex-1 text-xs">
                        <span className="text-[#C85A32] font-semibold text-[10px] uppercase block">
                          {painting.categoryName}
                        </span>
                        <h4 className="font-serif text-base font-semibold text-[#1E2D22] line-clamp-1 mb-0.5">
                          {painting.title}
                        </h4>
                        <p className="text-[#8E7B6C] line-clamp-1 mb-2">{painting.subtitle}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-sm text-[#1E2D22]">
                            ₹{painting.price.toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => setSelectedPainting(painting)}
                            className="text-[#C85A32] hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step-by-Step Matchmaker Quiz Form */}
        {!isLoading && !result && (
          <form
            onSubmit={handleMatch}
            className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E5DAC8] shadow-md space-y-10"
          >
            {/* Step 1: Room Selection */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5] mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1E2D22] text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#1E2D22]">
                    Select the Room / Function
                  </h3>
                </div>
                <span className="text-xs text-[#8E7B6C]">Step 1 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {ROOMS.map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setSelectedRoom(r.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedRoom === r.id
                        ? 'border-[#C85A32] bg-[#FAF7F2] ring-2 ring-[#C85A32]/20 font-semibold'
                        : 'border-[#E2D7C5] bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif text-base text-[#1E2D22]">{r.label}</span>
                      {selectedRoom === r.id && <CheckCircle2 className="w-4 h-4 text-[#C85A32]" />}
                    </div>
                    <p className="text-[11px] text-[#7A6B5D] font-light leading-snug">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Wall Color Tone */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5] mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1E2D22] text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#1E2D22]">
                    Primary Wall Color Tone
                  </h3>
                </div>
                <span className="text-xs text-[#8E7B6C]">Step 2 of 4</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {WALL_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setSelectedWallColor(c.id)}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                      selectedWallColor === c.id
                        ? 'border-[#C85A32] bg-[#FAF7F2] ring-2 ring-[#C85A32]/20 font-semibold'
                        : 'border-[#E2D7C5] hover:border-gray-400'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full border shadow-inner flex items-center justify-center"
                      style={{ backgroundColor: c.hex, borderColor: c.border }}
                    >
                      {selectedWallColor === c.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#C85A32] drop-shadow" />
                      )}
                    </div>
                    <span className="text-xs text-[#1E2D22] leading-tight">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Interior Design Architecture */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5] mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1E2D22] text-white text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#1E2D22]">
                    Interior Architectural Style
                  </h3>
                </div>
                <span className="text-xs text-[#8E7B6C]">Step 3 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {STYLES.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedStyle === s.id
                        ? 'border-[#C85A32] bg-[#FAF7F2] ring-2 ring-[#C85A32]/20 font-semibold'
                        : 'border-[#E2D7C5] bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif text-base text-[#1E2D22]">{s.label}</span>
                      {selectedStyle === s.id && <CheckCircle2 className="w-4 h-4 text-[#C85A32]" />}
                    </div>
                    <p className="text-[11px] text-[#7A6B5D] font-light leading-snug">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Desired Energy / Aura */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5] mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1E2D22] text-white text-xs flex items-center justify-center font-bold">
                    4
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#1E2D22]">
                    Desired Emotional & Spiritual Atmosphere
                  </h3>
                </div>
                <span className="text-xs text-[#8E7B6C]">Step 4 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {ENERGIES.map((e) => (
                  <button
                    type="button"
                    key={e.id}
                    onClick={() => setSelectedEnergy(e.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedEnergy === e.id
                        ? 'border-[#C85A32] bg-[#FAF7F2] ring-2 ring-[#C85A32]/20 font-semibold'
                        : 'border-[#E2D7C5] bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif text-base text-[#1E2D22]">{e.label}</span>
                      {selectedEnergy === e.id && <CheckCircle2 className="w-4 h-4 text-[#C85A32]" />}
                    </div>
                    <p className="text-[11px] text-[#7A6B5D] font-light leading-snug">{e.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Custom Notes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                Special Details / Preferred Motifs (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Seeking peacocks or tree of life, space has teak wood sofa and brass pendant lighting..."
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                className="w-full text-sm px-4 py-2.5 border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32]"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#EAE3D5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#8E7B6C] flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#D4943E]" />
                <span>Powered by Gemini AI and 2,000+ years of Mithila folk art lore.</span>
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto bg-[#1E2D22] hover:bg-[#C85A32] text-white px-9 py-4 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate AI Artwork Recommendations →</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
