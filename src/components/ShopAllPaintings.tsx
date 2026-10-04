import React, { useState } from 'react';
import {
  Filter,
  X,
  Search,
  SlidersHorizontal,
  Eye,
  Heart,
  ShoppingBag,
  Star,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Painting, ArtworkStyle, MotifType, ColorPaletteType, PaintingCategory } from '../types';
import { ThreeDTiltCard } from './ThreeDTiltCard';

export const ShopAllPaintings: React.FC = () => {
  const {
    filteredPaintings,
    paintings,
    filters,
    setFilters,
    resetFilters,
    setSelectedPainting,
    setQuickViewPainting,
    addToCart,
    wishlist,
    toggleWishlist,
    isWishlisted,
  } = useStore();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string>('all');

  // Facet options extracted dynamically from dataset
  const artists = Array.from(new Set(paintings.map((p) => p.artist)));
  const styles: ArtworkStyle[] = [
    'Bharni (Filled Mineral Colors)',
    'Kachni (Fine Line Hatching)',
    'Tantrik & Sacred',
    'Kohbar (Wedding Blessing)',
    'Contemporary Madhubani',
  ];
  const motifs: MotifType[] = [
    'Peacock (Mayur)',
    'Fish (Matsya)',
    'Tree of Life (Kalpavriksha)',
    'Radha Krishna',
    'Lotus (Kamal)',
    'Sun & Moon (Surya-Chandra)',
    'Elephant (Gaja)',
  ];
  const palettes: ColorPaletteType[] = [
    'Earthy Terracotta & Ochre',
    'Vibrant Natural Mineral',
    'Monochrome Black & White',
    'Indigo & Mustard',
    'Heritage Crimson & Gold',
  ];
  const allSizes = ['12x16 in', '16x20 in', '18x24 in', '24x36 in', '36x48 in'];

  const categories: { id: PaintingCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Collections' },
    { id: 'traditional-mithila', label: 'Traditional Mithila' },
    { id: 'radha-krishna', label: 'Radha Krishna' },
    { id: 'nature-wildlife', label: 'Nature & Wildlife' },
    { id: 'wedding-couple', label: 'Wedding & Couple' },
    { id: 'modern-madhubani', label: 'Modern Madhubani' },
  ];

  // Count active filters
  const activeFilterCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.artist !== 'all' ? 1 : 0) +
    (filters.colorPalette !== 'all' ? 1 : 0) +
    (filters.motif !== 'all' ? 1 : 0) +
    (filters.style !== 'all' ? 1 : 0) +
    (filters.size !== 'all' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.searchQuery.trim() ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 6000 ? 1 : 0);

  const handleQuickAdd = (painting: Painting, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultFraming = painting.framingOptions[0];
    addToCart(painting, painting.defaultSize, defaultFraming, 1);
  };

  return (
    <section id="shop-catalog" className="py-12 sm:py-16 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C85A32] font-semibold block mb-2 font-sans">
            AUTHENTIC MASTERPIECES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1E2D22] mb-4">
            Find Your Perfect Artwork
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#6B5B4E] font-light leading-relaxed">
            Every brushstroke preserves centuries of Mithila cultural memory. Filter by revered master artists, sacred ritual motifs, organic color palettes, and styles.
          </p>
        </div>

        {/* Top Category Tabs for quick switching */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#EAE3D5] no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                filters.category === cat.id
                  ? 'bg-[#1E2D22] text-[#FAF7F2] shadow-xs'
                  : 'bg-[#F4EFE6] text-[#6B5B4E] hover:bg-[#EAE3D5] hover:text-[#1E2D22]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search, Mobile Filter Trigger, and Sort Bar */}
        <div className="bg-[#F4EFE6] p-4 sm:p-5 rounded-2xl border border-[#E5DAC8] mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8E7B6C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, artist, motifs, or lore..."
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E2D7C5] focus:border-[#C85A32] rounded-xl text-sm text-[#2E251E] placeholder:text-[#8E7B6C] outline-none"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-3 justify-between md:justify-end">
            {/* Mobile Filter Sheet Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden bg-white border border-[#E2D7C5] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#2E251E] flex items-center gap-2 hover:border-[#C85A32]"
            >
              <Filter className="w-4 h-4 text-[#C85A32]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-[#C85A32] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B5B4E] uppercase tracking-wider font-semibold hidden sm:inline">
                Sort:
              </span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-white border border-[#E2D7C5] focus:border-[#C85A32] text-xs sm:text-sm font-medium text-[#2E251E] rounded-xl px-3 py-2.5 outline-none cursor-pointer"
              >
                <option value="featured">Curated & Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Reset Button */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="p-2.5 text-[#8E7B6C] hover:text-[#C85A32] hover:bg-white rounded-xl transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Badges */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-[#8E7B6C] font-medium mr-1">Active filters:</span>
            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#EAE3D5] text-[#2E251E]">
                Category: {categories.find((c) => c.id === filters.category)?.label}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-[#C85A32]"
                  onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
                />
              </span>
            )}
            {filters.artist !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#EAE3D5] text-[#2E251E]">
                Artist: {filters.artist}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-[#C85A32]"
                  onClick={() => setFilters((prev) => ({ ...prev, artist: 'all' }))}
                />
              </span>
            )}
            {filters.motif !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#EAE3D5] text-[#2E251E]">
                Motif: {filters.motif}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-[#C85A32]"
                  onClick={() => setFilters((prev) => ({ ...prev, motif: 'all' }))}
                />
              </span>
            )}
            {filters.style !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#EAE3D5] text-[#2E251E]">
                Style: {filters.style}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-[#C85A32]"
                  onClick={() => setFilters((prev) => ({ ...prev, style: 'all' }))}
                />
              </span>
            )}
            {filters.colorPalette !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#EAE3D5] text-[#2E251E]">
                Palette: {filters.colorPalette}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-[#C85A32]"
                  onClick={() => setFilters((prev) => ({ ...prev, colorPalette: 'all' }))}
                />
              </span>
            )}
            {filters.size !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#EAE3D5] text-[#2E251E]">
                Size: {filters.size}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-[#C85A32]"
                  onClick={() => setFilters((prev) => ({ ...prev, size: 'all' }))}
                />
              </span>
            )}
            {filters.inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#EAE3D5] text-[#2E251E]">
                In Stock Only
                <X
                  className="w-3 h-3 cursor-pointer hover:text-[#C85A32]"
                  onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: false }))}
                />
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs text-[#C85A32] underline hover:text-[#B24622] ml-2 font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Layout Grid: Desktop Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-2xl border border-[#E5DAC8] shadow-xs space-y-7 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C85A32]" />
                <h3 className="font-serif text-lg font-semibold text-[#1E2D22]">Filter Artworks</h3>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#C85A32] hover:underline font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Filter by Specific Motifs */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-3">
                Sacred Motifs
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, motif: 'all' }))}
                  className={`w-full text-left text-xs py-1 px-2 rounded-md transition-colors ${
                    filters.motif === 'all'
                      ? 'bg-[#F4EFE6] font-semibold text-[#C85A32]'
                      : 'text-[#5A4D41] hover:bg-[#FAF7F2]'
                  }`}
                >
                  All Motifs
                </button>
                {motifs.map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilters((prev) => ({ ...prev, motif: m }))}
                    className={`w-full text-left text-xs py-1 px-2 rounded-md transition-colors flex items-center justify-between ${
                      filters.motif === m
                        ? 'bg-[#F4EFE6] font-semibold text-[#C85A32]'
                        : 'text-[#5A4D41] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>{m}</span>
                    {filters.motif === m && <Check className="w-3.5 h-3.5 text-[#C85A32]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Artwork Style */}
            <div className="pt-4 border-t border-[#EAE3D5]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-3">
                Artwork Style
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, style: 'all' }))}
                  className={`w-full text-left text-xs py-1 px-2 rounded-md transition-colors ${
                    filters.style === 'all'
                      ? 'bg-[#F4EFE6] font-semibold text-[#C85A32]'
                      : 'text-[#5A4D41] hover:bg-[#FAF7F2]'
                  }`}
                >
                  All Styles
                </button>
                {styles.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilters((prev) => ({ ...prev, style: s }))}
                    className={`w-full text-left text-xs py-1 px-2 rounded-md transition-colors flex items-center justify-between ${
                      filters.style === s
                        ? 'bg-[#F4EFE6] font-semibold text-[#C85A32]'
                        : 'text-[#5A4D41] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span className="line-clamp-1">{s}</span>
                    {filters.style === s && <Check className="w-3.5 h-3.5 text-[#C85A32]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Artist */}
            <div className="pt-4 border-t border-[#EAE3D5]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-3">
                Master Artists & Guilds
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, artist: 'all' }))}
                  className={`w-full text-left text-xs py-1 px-2 rounded-md transition-colors ${
                    filters.artist === 'all'
                      ? 'bg-[#F4EFE6] font-semibold text-[#C85A32]'
                      : 'text-[#5A4D41] hover:bg-[#FAF7F2]'
                  }`}
                >
                  All Artists
                </button>
                {artists.map((art) => (
                  <button
                    key={art}
                    onClick={() => setFilters((prev) => ({ ...prev, artist: art }))}
                    className={`w-full text-left text-xs py-1 px-2 rounded-md transition-colors flex items-center justify-between ${
                      filters.artist === art
                        ? 'bg-[#F4EFE6] font-semibold text-[#C85A32]'
                        : 'text-[#5A4D41] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span className="line-clamp-1">{art}</span>
                    {filters.artist === art && <Check className="w-3.5 h-3.5 text-[#C85A32]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Color Palette */}
            <div className="pt-4 border-t border-[#EAE3D5]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-3">
                Color Palette
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, colorPalette: 'all' }))}
                  className={`w-full text-left text-xs py-1 px-2 rounded-md transition-colors ${
                    filters.colorPalette === 'all'
                      ? 'bg-[#F4EFE6] font-semibold text-[#C85A32]'
                      : 'text-[#5A4D41] hover:bg-[#FAF7F2]'
                  }`}
                >
                  All Palettes
                </button>
                {palettes.map((cp) => (
                  <button
                    key={cp}
                    onClick={() => setFilters((prev) => ({ ...prev, colorPalette: cp }))}
                    className={`w-full text-left text-xs py-1 px-2 rounded-md transition-colors flex items-center justify-between ${
                      filters.colorPalette === cp
                        ? 'bg-[#F4EFE6] font-semibold text-[#C85A32]'
                        : 'text-[#5A4D41] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span className="line-clamp-1">{cp}</span>
                    {filters.colorPalette === cp && <Check className="w-3.5 h-3.5 text-[#C85A32]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Size */}
            <div className="pt-4 border-t border-[#EAE3D5]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-3">
                Artwork Dimensions
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                {allSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFilters((prev) => ({ ...prev, size: filters.size === sz ? 'all' : sz }))}
                    className={`text-xs py-1.5 px-2 rounded-md border text-center transition-all ${
                      filters.size === sz
                        ? 'border-[#C85A32] bg-[#C85A32]/10 text-[#C85A32] font-semibold'
                        : 'border-[#E2D7C5] text-[#5A4D41] hover:border-[#8E7B6C]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="pt-4 border-t border-[#EAE3D5]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E]">
                  Max Price
                </h4>
                <span className="text-xs font-semibold text-[#1E2D22]">
                  ₹{filters.maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="6000"
                step="200"
                value={filters.maxPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full accent-[#C85A32] cursor-pointer"
              />
            </div>

            {/* In Stock Toggle */}
            <div className="pt-4 border-t border-[#EAE3D5] flex items-center justify-between">
              <span className="text-xs text-[#5A4D41] font-medium">In-Stock Artworks Only</span>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
                className="accent-[#C85A32] w-4 h-4 cursor-pointer"
              />
            </div>
          </aside>

          {/* MAIN PRODUCT GRID */}
          <main className="lg:col-span-9">
            {/* Results count status */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-medium text-[#7A6B5D] uppercase tracking-wider">
                Showing {filteredPaintings.length} of {paintings.length} Handcrafted Works
              </span>
              <span className="text-xs text-[#8E7B6C] italic font-serif hidden sm:inline">
                Natural mineral dyes on handmade Lokta & Silk
              </span>
            </div>

            {filteredPaintings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#E2D7C5] p-8">
                <Sparkles className="w-10 h-10 text-[#D4943E] mx-auto mb-4 opacity-70" />
                <h3 className="font-serif text-2xl text-[#1E2D22] mb-2 font-medium">
                  No Artworks Match Your Filters
                </h3>
                <p className="text-sm text-[#7A6B5D] max-w-md mx-auto mb-6">
                  Try adjusting your motif, artist, or style criteria, or explore our custom painting commission service.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#1E2D22] hover:bg-[#283C2E] text-white text-xs uppercase tracking-wider px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
                {filteredPaintings.map((painting) => {
                  const wishlisted = isWishlisted(painting.id);
                  return (
                    <ThreeDTiltCard key={painting.id} tiltIntensity={7} className="h-full">
                      <div
                        onClick={() => setSelectedPainting(painting)}
                        className="group bg-white rounded-2xl border border-[#EAE3D5] hover:border-[#C85A32]/50 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden cursor-pointer h-full"
                      >
                      {/* Painting Artwork Image Container */}
                      <div className="relative aspect-[4/5] bg-[#F4EFE6] overflow-hidden">
                        <img
                          src={painting.image}
                          alt={painting.title}
                          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                          {painting.isNewArrival && (
                            <span className="bg-[#1E2D22] text-[#FAF7F2] text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-xs">
                              New Arrival
                            </span>
                          )}
                          {painting.featured && (
                            <span className="bg-[#D4943E] text-[#1E2D22] text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shadow-xs">
                              Masterpiece
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(painting.id);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10 cursor-pointer ${
                            wishlisted
                              ? 'bg-[#C85A32] text-white shadow-md'
                              : 'bg-white/80 hover:bg-white text-[#2E251E] hover:text-[#C85A32] backdrop-blur-xs shadow-xs'
                          }`}
                          aria-label="Save to wishlist"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              wishlisted ? 'fill-current' : 'stroke-[1.7]'
                            }`}
                          />
                        </button>

                        {/* Quick View Button on Hover */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewPainting(painting);
                          }}
                          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#1E2D22]/90 hover:bg-[#1E2D22] text-white text-xs px-4 py-2 rounded-full flex items-center gap-1.5 shadow-md backdrop-blur-xs cursor-pointer transform translate-y-2 group-hover:translate-y-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Quick View</span>
                        </button>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Artist & Category Meta */}
                          <div className="flex items-center justify-between text-[11px] text-[#8E7B6C] uppercase tracking-wider mb-1.5 font-medium">
                            <span className="line-clamp-1">{painting.artist}</span>
                            <span className="text-[#C85A32]">{painting.categoryName}</span>
                          </div>

                          {/* Title */}
                          <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1E2D22] group-hover:text-[#C85A32] transition-colors leading-snug line-clamp-1 mb-1">
                            {painting.title}
                          </h3>

                          {/* Subtitle / Motif note */}
                          <p className="text-xs text-[#7A6B5D] line-clamp-1 font-light mb-3">
                            {painting.subtitle}
                          </p>

                          {/* Motifs & Style Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            <span className="text-[10px] bg-[#FAF7F2] border border-[#E5DAC8] text-[#5A4D41] px-2 py-0.5 rounded-md font-medium">
                              {painting.motif}
                            </span>
                            <span className="text-[10px] bg-[#FAF7F2] border border-[#E5DAC8] text-[#5A4D41] px-2 py-0.5 rounded-md font-medium">
                              {painting.style.split(' ')[0]}
                            </span>
                          </div>

                          {/* Available Sizes Pills */}
                          <div className="flex items-center gap-1.5 text-[10px] text-[#8E7B6C] mb-4">
                            <span className="font-semibold uppercase tracking-wider">Sizes:</span>
                            {painting.sizes.slice(0, 2).map((s) => (
                              <span key={s} className="bg-[#F4EFE6] px-1.5 py-0.5 rounded text-[#5A4D41]">
                                {s}
                              </span>
                            ))}
                            {painting.sizes.length > 2 && (
                              <span className="text-[#8E7B6C]">+{painting.sizes.length - 2} more</span>
                            )}
                          </div>
                        </div>

                        {/* Price & Add to Cart footer */}
                        <div className="pt-3 border-t border-[#EAE3D5] flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="font-serif text-xl sm:text-2xl font-semibold text-[#1E2D22]">
                                ₹{painting.price.toLocaleString('en-IN')}
                              </span>
                              {painting.originalPrice && (
                                <span className="text-xs text-[#8E7B6C] line-through">
                                  ₹{painting.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 fill-[#D4943E] text-[#D4943E]" />
                              <span className="text-[11px] font-semibold text-[#2E251E]">
                                {painting.rating}
                              </span>
                              <span className="text-[11px] text-[#8E7B6C]">
                                ({painting.reviewCount})
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(painting, e)}
                            className="bg-[#1E2D22] hover:bg-[#C85A32] text-white p-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                            title="Add default size to cart"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span className="hidden sm:inline">Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </ThreeDTiltCard>
                );
              })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTERS SHEET MODAL */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          ></div>
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D5] mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#C85A32]" />
                  <h3 className="font-serif text-xl font-semibold text-[#1E2D22]">Filter Artworks</h3>
                </div>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Facets */}
              <div className="space-y-6">
                {/* Category */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-2">
                    Category
                  </h4>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value as any }))}
                    className="w-full text-xs p-2.5 border border-[#E2D7C5] rounded-lg"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Motifs */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-2">
                    Sacred Motifs
                  </h4>
                  <select
                    value={filters.motif}
                    onChange={(e) => setFilters((prev) => ({ ...prev, motif: e.target.value as any }))}
                    className="w-full text-xs p-2.5 border border-[#E2D7C5] rounded-lg"
                  >
                    <option value="all">All Motifs</option>
                    {motifs.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Style */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-2">
                    Artwork Style
                  </h4>
                  <select
                    value={filters.style}
                    onChange={(e) => setFilters((prev) => ({ ...prev, style: e.target.value as any }))}
                    className="w-full text-xs p-2.5 border border-[#E2D7C5] rounded-lg"
                  >
                    <option value="all">All Styles</option>
                    {styles.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Artist */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-2">
                    Master Artist
                  </h4>
                  <select
                    value={filters.artist}
                    onChange={(e) => setFilters((prev) => ({ ...prev, artist: e.target.value }))}
                    className="w-full text-xs p-2.5 border border-[#E2D7C5] rounded-lg"
                  >
                    <option value="all">All Artists</option>
                    {artists.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Palette */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-2">
                    Color Palette
                  </h4>
                  <select
                    value={filters.colorPalette}
                    onChange={(e) => setFilters((prev) => ({ ...prev, colorPalette: e.target.value as any }))}
                    className="w-full text-xs p-2.5 border border-[#E2D7C5] rounded-lg"
                  >
                    <option value="all">All Palettes</option>
                    {palettes.map((cp) => (
                      <option key={cp} value={cp}>
                        {cp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EAE3D5] space-y-2">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[#1E2D22] text-white py-3 rounded-xl font-medium text-sm"
              >
                Apply Filters ({filteredPaintings.length} Results)
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full text-xs text-[#8E7B6C] hover:text-[#C85A32] py-2"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
