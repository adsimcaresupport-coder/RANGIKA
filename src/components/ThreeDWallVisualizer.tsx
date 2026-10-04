import React, { useState } from 'react';
import {
  Box,
  Layers,
  Sun,
  Palette,
  Maximize2,
  Sliders,
  Check,
  ShoppingBag,
  Sparkles,
  Rotate3d,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Painting } from '../types';

interface WallStyle {
  id: string;
  name: string;
  wallBg: string;
  floorBg: string;
  accent: string;
}

const WALL_STYLES: WallStyle[] = [
  {
    id: 'linen-cream',
    name: 'Raw Linen Cream',
    wallBg: '#F4EFE6',
    floorBg: '#D8CBB6',
    accent: '#8E7B6C',
  },
  {
    id: 'terracotta-earth',
    name: 'Mithila Terracotta',
    wallBg: '#B85532',
    floorBg: '#8A3B20',
    accent: '#FAF7F2',
  },
  {
    id: 'forest-haven',
    name: 'Deep Forest Green',
    wallBg: '#1E2D22',
    floorBg: '#141E17',
    accent: '#D4943E',
  },
  {
    id: 'sandstone-haveli',
    name: 'Haveli Sandstone',
    wallBg: '#E8DFC9',
    floorBg: '#C2B498',
    accent: '#42362C',
  },
  {
    id: 'royal-indigo',
    name: 'Midnight Neel',
    wallBg: '#1C2833',
    floorBg: '#131B22',
    accent: '#E5B869',
  },
];

type Angle3D = 'front' | 'left-3d' | 'right-3d' | 'low-angle';

export const ThreeDWallVisualizer: React.FC = () => {
  const { paintings, addToCart, setSelectedPainting } = useStore();

  const [selectedPaintingIndex, setSelectedPaintingIndex] = useState(0);
  const [wallStyle, setWallStyle] = useState<WallStyle>(WALL_STYLES[0]);
  const [angle3D, setAngle3D] = useState<Angle3D>('left-3d');
  const [frameType, setFrameType] = useState<'teak-3d' | 'black-3d' | 'unframed-3d'>('teak-3d');
  const [lighting, setLighting] = useState<'gallery-spot' | 'warm-ambient' | 'natural-sun'>('gallery-spot');
  const [scaleSize, setScaleSize] = useState<number>(100); // 80% to 130%

  const currentPainting: Painting = paintings[selectedPaintingIndex] || paintings[0];

  const handlePrevPainting = () => {
    setSelectedPaintingIndex((prev) => (prev === 0 ? paintings.length - 1 : prev - 1));
  };

  const handleNextPainting = () => {
    setSelectedPaintingIndex((prev) => (prev === paintings.length - 1 ? 0 : prev + 1));
  };

  // 3D Transform calculations based on angle
  const get3DTransform = () => {
    switch (angle3D) {
      case 'left-3d':
        return 'rotateY(16deg) rotateX(2deg) translateZ(30px)';
      case 'right-3d':
        return 'rotateY(-16deg) rotateX(2deg) translateZ(30px)';
      case 'low-angle':
        return 'rotateX(12deg) translateZ(20px)';
      default:
        return 'rotateY(0deg) rotateX(0deg) translateZ(25px)';
    }
  };

  // 3D Frame styles
  const getFrame3DStyles = () => {
    if (frameType === 'teak-3d') {
      return {
        boxShadow:
          '0 28px 45px -10px rgba(0, 0, 0, 0.45), 0 10px 20px -5px rgba(0,0,0,0.3), inset 0 0 0 16px #4A301E, inset 0 0 0 20px #2D1D12, inset 0 0 0 26px #FAF7F2',
        border: '3px solid #66432B',
      };
    }
    if (frameType === 'black-3d') {
      return {
        boxShadow:
          '0 28px 45px -10px rgba(0, 0, 0, 0.5), 0 10px 20px -5px rgba(0,0,0,0.35), inset 0 0 0 14px #1A1A1A, inset 0 0 0 17px #111111, inset 0 0 0 24px #FFFFFF',
        border: '2px solid #2A2A2A',
      };
    }
    // Unframed 3D handmade paper with torn deckled edges & floating shadow
    return {
      boxShadow:
        '0 20px 35px -8px rgba(0, 0, 0, 0.35), 0 6px 12px -3px rgba(0,0,0,0.2)',
      border: '1px solid #D5C7B0',
    };
  };

  const getLightingStyle = () => {
    if (lighting === 'gallery-spot') {
      return 'radial-gradient(ellipse 70% 60% at 50% 25%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.18) 100%)';
    }
    if (lighting === 'warm-ambient') {
      return 'radial-gradient(ellipse 80% 70% at 50% 30%, rgba(255,225,180,0.35) 0%, rgba(0,0,0,0.15) 100%)';
    }
    // natural sun from left
    return 'linear-gradient(115deg, rgba(255,250,235,0.45) 0%, rgba(255,255,255,0.1) 45%, rgba(0,0,0,0.2) 100%)';
  };

  const handleAddToCartFrom3D = () => {
    const framingOption =
      frameType === 'teak-3d'
        ? currentPainting.framingOptions[1] || currentPainting.framingOptions[0]
        : frameType === 'black-3d'
        ? currentPainting.framingOptions[2] || currentPainting.framingOptions[0]
        : currentPainting.framingOptions[0];

    addToCart(currentPainting, currentPainting.defaultSize, framingOption, 1);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#1E2D22] text-[#FAF7F2] relative overflow-hidden">
      {/* Background ambient texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D4943E_1px,transparent_1px)] [background-size:28px_28px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#283C2E] border border-[#D4943E]/40 px-3.5 py-1.5 rounded-full text-xs text-[#E5B869] font-semibold mb-3">
            <Rotate3d className="w-4 h-4 animate-spin [animation-duration:8s]" />
            <span>INTERACTIVE 3D VIRTUAL GALLERY</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-white mb-3">
            Experience Mithila Art in 3D Space
          </h2>
          <p className="text-sm sm:text-base text-[#D3C7B5] font-light leading-relaxed">
            See how authentic Madhubani paintings illuminate real walls. Switch 3D perspectives, test room wall tones, adjust gallery spotlights, and preview handcrafted frames.
          </p>
        </div>

        {/* 3D Visualizer Main Stage */}
        <div className="bg-[#142018] rounded-3xl p-4 sm:p-8 border border-[#3E5343] shadow-2xl">
          
          {/* Virtual 3D Room Box */}
          <div
            className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[560px] rounded-2xl overflow-hidden flex flex-col justify-between transition-colors duration-500 shadow-inner"
            style={{
              backgroundColor: wallStyle.wallBg,
              perspective: '1200px',
            }}
          >
            {/* Lighting Overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-700 z-10"
              style={{ background: getLightingStyle() }}
            />

            {/* Simulated 3D Architectural Floor at the bottom */}
            <div
              className="absolute bottom-0 inset-x-0 h-16 sm:h-24 transition-colors duration-500 z-10 border-t border-black/10"
              style={{
                backgroundColor: wallStyle.floorBg,
                boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.15)',
              }}
            >
              {/* Floor Wood Plank Grid Effect */}
              <div className="w-full h-full opacity-15 bg-[repeating-linear-gradient(90deg,transparent,transparent_60px,rgba(0,0,0,0.4)_61px)]"></div>
            </div>

            {/* Ceiling shadow top */}
            <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-black/25 to-transparent pointer-events-none z-10"></div>

            {/* Top Navigation Controls on 3D Canvas */}
            <div className="relative z-20 p-4 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#D4943E] animate-pulse"></span>
                <span className="font-serif tracking-wider text-white">
                  {currentPainting.title}
                </span>
                <span className="text-[#D4943E] font-semibold">
                  (₹{currentPainting.price.toLocaleString('en-IN')})
                </span>
              </div>

              {/* Prev / Next Artwork buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPainting}
                  className="bg-black/50 hover:bg-black text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
                  title="Previous Artwork"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextPainting}
                  className="bg-black/50 hover:bg-black text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
                  title="Next Artwork"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CENTER: THE 3D HUNG PAINTING */}
            <div className="relative z-20 flex-1 flex items-center justify-center p-6">
              <div
                style={{
                  transform: get3DTransform(),
                  transition: 'transform 0.6s cubic-bezier(0.2, 0.9, 0.3, 1), width 0.4s ease',
                  transformStyle: 'preserve-3d',
                  width: `${Math.round(260 * (scaleSize / 100))}px`,
                }}
                className="max-w-[70vw] relative group cursor-pointer"
                onClick={() => setSelectedPainting(currentPainting)}
              >
                {/* 3D Frame and Canvas Artwork */}
                <div
                  className="relative aspect-[3/4] w-full rounded-lg overflow-hidden transition-all duration-500 bg-[#FAF7F2]"
                  style={getFrame3DStyles()}
                >
                  <img
                    src={currentPainting.image}
                    alt={currentPainting.title}
                    className="w-full h-full object-cover object-center"
                  />

                  {/* 3D Glass Light Glare / Sheen Reflection */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-60"></div>
                </div>

                {/* 3D Wall Cast Shadow Beneath Frame */}
                <div
                  className="absolute -bottom-8 left-4 right-4 h-6 bg-black/40 blur-md rounded-full pointer-events-none transition-all duration-500"
                  style={{
                    transform:
                      angle3D === 'left-3d'
                        ? 'translateX(20px) skewX(-15deg)'
                        : angle3D === 'right-3d'
                        ? 'translateX(-20px) skewX(15deg)'
                        : 'none',
                  }}
                />
              </div>
            </div>

            {/* Bottom 3D Quick Action */}
            <div className="relative z-20 p-4 sm:p-6 flex items-center justify-between">
              <div className="hidden sm:block text-xs bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white/80 border border-white/10">
                Click artwork to view archival details & folklore story
              </div>

              <button
                onClick={handleAddToCartFrom3D}
                className="ml-auto bg-[#D4943E] hover:bg-[#C85A32] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer transform hover:scale-105"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart (₹{currentPainting.price.toLocaleString('en-IN')})</span>
              </button>
            </div>
          </div>

          {/* 3D INTERACTIVE CONTROL DOCK BELOW CANVAS */}
          <div className="mt-6 pt-6 border-t border-[#283C2E] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            
            {/* 1. 3D Perspective Angles */}
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#D4943E] block mb-2 flex items-center gap-1.5">
                <Rotate3d className="w-3.5 h-3.5" />
                <span>3D View Angle</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAngle3D('front')}
                  className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                    angle3D === 'front'
                      ? 'border-[#D4943E] bg-[#283C2E] text-white font-semibold'
                      : 'border-[#3E5343] bg-[#1A281E] text-gray-300 hover:border-gray-400'
                  }`}
                >
                  Direct Front
                </button>
                <button
                  onClick={() => setAngle3D('left-3d')}
                  className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                    angle3D === 'left-3d'
                      ? 'border-[#D4943E] bg-[#283C2E] text-white font-semibold'
                      : 'border-[#3E5343] bg-[#1A281E] text-gray-300 hover:border-gray-400'
                  }`}
                >
                  Left 3D Tilt
                </button>
                <button
                  onClick={() => setAngle3D('right-3d')}
                  className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                    angle3D === 'right-3d'
                      ? 'border-[#D4943E] bg-[#283C2E] text-white font-semibold'
                      : 'border-[#3E5343] bg-[#1A281E] text-gray-300 hover:border-gray-400'
                  }`}
                >
                  Right 3D Tilt
                </button>
                <button
                  onClick={() => setAngle3D('low-angle')}
                  className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                    angle3D === 'low-angle'
                      ? 'border-[#D4943E] bg-[#283C2E] text-white font-semibold'
                      : 'border-[#3E5343] bg-[#1A281E] text-gray-300 hover:border-gray-400'
                  }`}
                >
                  Lounge View
                </button>
              </div>
            </div>

            {/* 2. Wall Colors */}
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#D4943E] block mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Wall Tone: {wallStyle.name}</span>
              </span>
              <div className="flex items-center gap-2.5">
                {WALL_STYLES.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => setWallStyle(ws)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer relative ${
                      wallStyle.id === ws.id ? 'scale-115 border-[#D4943E] shadow-md' : 'border-white/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: ws.wallBg }}
                    title={ws.name}
                  >
                    {wallStyle.id === ws.id && (
                      <Check className="w-3 h-3 text-white absolute inset-0 m-auto drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. 3D Framing Types */}
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#D4943E] block mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>3D Frame Finish</span>
              </span>
              <div className="space-y-1.5">
                <button
                  onClick={() => setFrameType('teak-3d')}
                  className={`w-full py-1.5 px-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    frameType === 'teak-3d'
                      ? 'border-[#D4943E] bg-[#283C2E] text-white font-semibold'
                      : 'border-[#3E5343] bg-[#1A281E] text-gray-300'
                  }`}
                >
                  Solid Teak Wood Box (+₹450)
                </button>
                <button
                  onClick={() => setFrameType('black-3d')}
                  className={`w-full py-1.5 px-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    frameType === 'black-3d'
                      ? 'border-[#D4943E] bg-[#283C2E] text-white font-semibold'
                      : 'border-[#3E5343] bg-[#1A281E] text-gray-300'
                  }`}
                >
                  Museum Black Bevel (+₹350)
                </button>
                <button
                  onClick={() => setFrameType('unframed-3d')}
                  className={`w-full py-1.5 px-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    frameType === 'unframed-3d'
                      ? 'border-[#D4943E] bg-[#283C2E] text-white font-semibold'
                      : 'border-[#3E5343] bg-[#1A281E] text-gray-300'
                  }`}
                >
                  Unframed Deckled Lokta (+₹0)
                </button>
              </div>
            </div>

            {/* 4. Lighting & Scaling */}
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#D4943E] block mb-2 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                <span>Lighting Atmosphere</span>
              </span>
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                <button
                  onClick={() => setLighting('gallery-spot')}
                  className={`py-1 px-2 rounded-md border text-center transition-colors cursor-pointer text-[10px] ${
                    lighting === 'gallery-spot'
                      ? 'border-[#D4943E] bg-[#283C2E] text-white'
                      : 'border-[#3E5343] bg-[#1A281E] text-gray-300'
                  }`}
                >
                  Spotlight
                </button>
                <button
                  onClick={() => setLighting('warm-ambient')}
                  className={`py-1 px-2 rounded-md border text-center transition-colors cursor-pointer text-[10px] ${
                    lighting === 'warm-ambient'
                      ? 'border-[#D4943E] bg-[#283C2E] text-white'
                      : 'border-[#3E5343] bg-[#1A281E] text-gray-300'
                  }`}
                >
                  Warm Glow
                </button>
                <button
                  onClick={() => setLighting('natural-sun')}
                  className={`py-1 px-2 rounded-md border text-center transition-colors cursor-pointer text-[10px] ${
                    lighting === 'natural-sun'
                      ? 'border-[#D4943E] bg-[#283C2E] text-white'
                      : 'border-[#3E5343] bg-[#1A281E] text-gray-300'
                  }`}
                >
                  Morning Sun
                </button>
              </div>

              {/* Scale Slider */}
              <div className="flex items-center justify-between text-[11px] text-[#A89C8B] mb-1">
                <span>Wall Scale:</span>
                <span>{scaleSize}% ({currentPainting.defaultSize})</span>
              </div>
              <input
                type="range"
                min="80"
                max="130"
                value={scaleSize}
                onChange={(e) => setScaleSize(Number(e.target.value))}
                className="w-full accent-[#D4943E] cursor-pointer"
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
