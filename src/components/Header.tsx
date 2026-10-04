import React, { useState } from 'react';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Palette
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cart,
    setIsCartOpen,
    wishlist,
    setIsAccountOpen,
    setIsStyleGuideOpen,
    setIsAdminOpen,
    filters,
    setFilters,
    cmsContent,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'matchmaker', label: 'AI Matchmaker' },
    { id: '3d-view', label: '3D Wall Art' },
    { id: 'custom-painting', label: 'Custom Painting' },
    { id: 'our-story', label: 'Our Story' },
    { id: 'wholesale', label: 'Wholesale' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab !== 'shop') {
      setActiveTab('shop');
    }
  };

  return (
    <>
      {/* Top Heritage Notice Bar */}
      <div className="bg-[#1E2D22] text-[#E5D7C2] text-xs py-2 px-4 border-b border-[#2D3E32]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4943E] animate-pulse"></span>
            <span className="font-light tracking-wide">
              {cmsContent.announcementText || 'Authentic Handcrafted Mithila & Madhubani Artistry · Direct from Master Artisans of Bihar'}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs text-[#C5B7A2]">
            <button
              onClick={() => setIsStyleGuideOpen(true)}
              className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-[#D4943E]" />
              Visual Style Guide
            </button>
            <span className="text-[#3E5343]">|</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4943E]" />
              Artisan Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Header matching reference screenshot */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-[#EAE3D5] backdrop-blur-md bg-opacity-95 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-22">
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#2E251E] hover:text-[#C85A32] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* LEFT: Brand Logo & Tagline */}
            <div className="flex-shrink-0 flex flex-col items-start cursor-pointer" onClick={() => handleNavClick('home')}>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl sm:text-3xl md:text-3xl tracking-[0.18em] font-semibold text-[#1E2D22]">
                  RANGIKA
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#C85A32]"></span>
              </div>
              <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.28em] text-[#6B5B4E] uppercase font-medium mt-0.5">
                ART THAT TELLS STORIES
              </span>
            </div>

            {/* CENTER: Clean Minimalist Navigation */}
            <nav className="hidden lg:flex items-center space-x-9">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative text-sm tracking-wide transition-all cursor-pointer py-1 font-medium ${
                      isActive
                        ? 'text-[#C85A32]'
                        : 'text-[#3E342B] hover:text-[#C85A32]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C85A32] rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* RIGHT: Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5 text-[#2E251E]">
              {/* Search Toggle */}
              <div className="relative">
                {showSearchInput ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search motifs, artists, styles..."
                      value={filters.searchQuery}
                      onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                      autoFocus
                      className="w-44 sm:w-64 text-xs bg-white border border-[#E2D7C5] rounded-full py-1.5 pl-3 pr-8 focus:outline-none focus:border-[#C85A32]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSearchInput(false)}
                      className="absolute right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      setShowSearchInput(true);
                      if (activeTab !== 'shop') setActiveTab('shop');
                    }}
                    className="p-1.5 text-[#2E251E] hover:text-[#C85A32] transition-colors cursor-pointer"
                    aria-label="Search"
                    title="Search paintings"
                  >
                    <Search className="w-5 h-5 stroke-[1.6]" />
                  </button>
                )}
              </div>

              {/* Account / Order Tracking */}
              <button
                onClick={() => setIsAccountOpen(true)}
                className="p-1.5 text-[#2E251E] hover:text-[#C85A32] transition-colors cursor-pointer"
                aria-label="My Account and Orders"
                title="Account & Orders"
              >
                <User className="w-5 h-5 stroke-[1.6]" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => {
                  setActiveTab('shop');
                  setFilters((prev) => ({ ...prev, category: 'all' }));
                }}
                className="p-1.5 text-[#2E251E] hover:text-[#C85A32] transition-colors relative cursor-pointer"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.6]" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C85A32] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-1.5 text-[#2E251E] hover:text-[#C85A32] transition-colors relative cursor-pointer"
                aria-label="Shopping Cart"
                title="View Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D4943E] text-[#1E2D22] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-b border-[#EAE3D5] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`block w-full text-left py-2.5 px-3 rounded-md text-base font-medium ${
                    activeTab === link.id
                      ? 'bg-[#F4EFE6] text-[#C85A32] font-semibold'
                      : 'text-[#2E251E] hover:bg-[#F4EFE6]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[#EAE3D5] flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsStyleGuideOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 py-2 px-3 text-sm text-[#6B5B4E] hover:text-[#C85A32]"
              >
                <Palette className="w-4 h-4 text-[#D4943E]" />
                View Brand Visual Style Guide
              </button>
              <button
                onClick={() => {
                  setIsAdminOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 py-2 px-3 text-sm text-[#6B5B4E] hover:text-[#C85A32]"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4943E]" />
                Artisan Admin Dashboard
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
