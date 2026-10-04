import React, { useState } from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  Award,
  Check,
  Share2,
  Info
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Painting } from '../types';

interface Props {
  painting: Painting;
  onClose: () => void;
  isQuickView?: boolean;
}

export const ProductDetailModal: React.FC<Props> = ({ painting, onClose, isQuickView = false }) => {
  const { addToCart, wishlist, toggleWishlist, isWishlisted, setIsCheckoutOpen } = useStore();

  const [selectedSize, setSelectedSize] = useState(painting.defaultSize);
  const [selectedFraming, setSelectedFraming] = useState(painting.framingOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'story' | 'materials' | 'heritage'>('story');

  const wishlisted = isWishlisted(painting.id);
  const finalUnitPrice = painting.price + selectedFraming.priceAdded;
  const totalPrice = finalUnitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(painting, selectedSize, selectedFraming, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(painting, selectedSize, selectedFraming, quantity);
    onClose();
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E5DAC8] my-8 max-h-[92vh] flex flex-col lg:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 bg-white/90 hover:bg-white text-[#2E251E] hover:text-[#C85A32] p-2 rounded-full shadow-md transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT: Large Painting Display */}
        <div className="lg:w-1/2 bg-[#F4EFE6] relative flex items-center justify-center p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#EAE3D5]">
          <div className="relative aspect-[4/5] w-full max-w-md rounded-2xl overflow-hidden shadow-xl border border-[#E2D7C5] bg-white group">
            <img
              src={painting.image}
              alt={painting.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />

            {/* Authenticity Watermark/Stamp */}
            <div className="absolute bottom-3 left-3 bg-[#1E2D22]/85 backdrop-blur-xs text-[#FAF7F2] text-[10px] px-3 py-1 rounded-full border border-[#D4943E]/40 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#D4943E]" />
              <span>Certified Original · Madhubani, Bihar</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Detailed Specifications & Purchase Controls */}
        <div className="lg:w-1/2 p-6 sm:p-8 md:p-10 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Top Metas */}
            <div className="flex items-center justify-between text-xs text-[#8E7B6C] uppercase tracking-wider mb-2 font-medium">
              <span className="text-[#C85A32] font-semibold">{painting.categoryName}</span>
              <span>{painting.style}</span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-3xl font-medium text-[#1E2D22] leading-snug mb-1">
              {painting.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6B5D] font-light mb-3">
              {painting.subtitle}
            </p>

            {/* Master Artist Lineage */}
            <div className="bg-white p-3 rounded-xl border border-[#E5DAC8] mb-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1E2D22] text-[#D4943E] flex items-center justify-center font-serif text-sm font-semibold flex-shrink-0">
                {painting.artist[0]}
              </div>
              <div className="text-xs">
                <span className="text-[#8E7B6C] block">Master Artisan:</span>
                <span className="font-semibold text-[#1E2D22]">{painting.artist}</span>
                <span className="text-[11px] text-[#8E7B6C] block font-light">
                  {painting.artistLineage}
                </span>
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex text-[#D4943E]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#1E2D22]">{painting.rating}</span>
              <span className="text-xs text-[#8E7B6C]">
                ({painting.reviewCount} Verified Patron Reviews)
              </span>
            </div>

            {/* Price Display */}
            <div className="py-3 border-y border-[#EAE3D5] mb-5 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#8E7B6C] uppercase block tracking-wider font-semibold">
                  Investment Value
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-semibold text-[#1E2D22]">
                    ₹{finalUnitPrice.toLocaleString('en-IN')}
                  </span>
                  {painting.originalPrice && (
                    <span className="text-sm text-[#8E7B6C] line-through">
                      ₹{(painting.originalPrice + selectedFraming.priceAdded).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full font-medium">
                Taxes Included · Free Insured Delivery
              </span>
            </div>

            {/* Size Selector */}
            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-2">
                Select Artwork Size: <span className="text-[#1E2D22] font-bold">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {painting.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'border-[#C85A32] bg-[#C85A32] text-white shadow-xs'
                        : 'border-[#E2D7C5] bg-white text-[#5A4D41] hover:border-gray-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Framing Options */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-2">
                Museum Framing Option
              </label>
              <div className="space-y-2">
                {painting.framingOptions.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFraming(f)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      selectedFraming.id === f.id
                        ? 'border-[#C85A32] bg-white text-[#1E2D22] font-semibold ring-1 ring-[#C85A32]'
                        : 'border-[#E2D7C5] bg-white text-[#5A4D41] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          selectedFraming.id === f.id
                            ? 'border-[#C85A32] bg-[#C85A32]'
                            : 'border-gray-400'
                        }`}
                      >
                        {selectedFraming.id === f.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <span>{f.label}</span>
                    </div>
                    <span className="text-[#8E7B6C] font-mono">
                      {f.priceAdded === 0 ? 'Included' : `+₹${f.priceAdded.toLocaleString('en-IN')}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs: Cultural Story / Materials / Authenticity */}
            <div className="pt-2 mb-6">
              <div className="flex border-b border-[#EAE3D5] text-xs gap-4 mb-3">
                <button
                  onClick={() => setActiveTab('story')}
                  className={`pb-2 font-medium cursor-pointer ${
                    activeTab === 'story'
                      ? 'border-b-2 border-[#C85A32] text-[#C85A32] font-semibold'
                      : 'text-[#8E7B6C] hover:text-[#1E2D22]'
                  }`}
                >
                  Cultural Story
                </button>
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`pb-2 font-medium cursor-pointer ${
                    activeTab === 'materials'
                      ? 'border-b-2 border-[#C85A32] text-[#C85A32] font-semibold'
                      : 'text-[#8E7B6C] hover:text-[#1E2D22]'
                  }`}
                >
                  Materials & Craft
                </button>
                <button
                  onClick={() => setActiveTab('heritage')}
                  className={`pb-2 font-medium cursor-pointer ${
                    activeTab === 'heritage'
                      ? 'border-b-2 border-[#C85A32] text-[#C85A32] font-semibold'
                      : 'text-[#8E7B6C] hover:text-[#1E2D22]'
                  }`}
                >
                  Authenticity Guarantee
                </button>
              </div>

              {activeTab === 'story' && (
                <div className="text-xs text-[#5A4D41] leading-relaxed space-y-2 font-light animate-in fade-in">
                  <p>{painting.description}</p>
                  <p className="italic text-[#8E5A3C]">
                    <strong>Folklore Meaning:</strong> {painting.culturalStory}
                  </p>
                </div>
              )}

              {activeTab === 'materials' && (
                <div className="text-xs text-[#5A4D41] leading-relaxed space-y-1.5 animate-in fade-in">
                  <p><strong>Substrate:</strong> {painting.materials}</p>
                  <p><strong>Dimensions:</strong> {painting.dimensions}</p>
                  <p><strong>Pigments:</strong> Lampblack soot, crushed stone ochres, turmeric, plant extracts</p>
                </div>
              )}

              {activeTab === 'heritage' && (
                <div className="text-xs text-[#5A4D41] leading-relaxed space-y-1.5 animate-in fade-in">
                  <p>✓ Individually signed certificate of origin and GI verification tag.</p>
                  <p>✓ 100% fair trade commission directly empowering artisan women in Bihar.</p>
                  <p>✓ 7-day safe transit assurance with free repair or replacement.</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#EAE3D5] flex items-center gap-3">
            {/* Quantity */}
            <div className="flex items-center border border-[#E2D7C5] bg-white rounded-xl px-2 py-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-6 text-center font-bold text-gray-500 hover:text-black"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-6 text-center font-bold text-gray-500 hover:text-black"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-[#1E2D22] hover:bg-[#283C2E] text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart (₹{totalPrice.toLocaleString('en-IN')})</span>
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => toggleWishlist(painting.id)}
              className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                wishlisted
                  ? 'border-[#C85A32] bg-[#C85A32] text-white'
                  : 'border-[#E2D7C5] bg-white text-[#2E251E] hover:text-[#C85A32]'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
