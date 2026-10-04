import React, { useState } from 'react';
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedCategory, setIsCustomOrderModalOpen, setIsWholesaleModalOpen, showToast, cmsContent } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSuccess(true);
    showToast('Subscribed!', 'Welcome to the RANGIKA heritage circle. You will receive private collection releases.');
  };

  return (
    <footer className="bg-[#1E2D22] text-[#FAF7F2] pt-16 sm:pt-20 pb-12 border-t border-[#2D3E32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter / Community Banner */}
        <div className="bg-[#283C2E] rounded-3xl p-8 sm:p-10 mb-16 border border-[#3E5343] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4943E] font-semibold block mb-1">
              THE RANGIKA CHRONICLES
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">
              Stories of Folk Lore & Master Editions
            </h3>
            <p className="text-xs sm:text-sm text-[#D3C7B5] font-light">
              Receive rare exhibition invitations, master artisan profiles, and auspicious festival artwork curation.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {newsletterSuccess ? (
              <div className="flex items-center gap-2 text-xs text-[#E5B869] font-medium bg-[#1E2D22] px-5 py-3 rounded-full border border-[#D4943E]/40">
                <Check className="w-4 h-4 text-[#2E7D32]" />
                <span>You are subscribed to the private patron circle.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2.5 w-full">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-[#1E2D22] border border-[#3E5343] text-sm text-white px-4 py-3 rounded-full outline-none focus:border-[#D4943E] placeholder:text-[#8E7B6C] min-w-[260px]"
                />
                <button
                  type="submit"
                  className="bg-[#D4943E] hover:bg-[#C85A32] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Join Circle</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4 Columns Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#2D3E32]">
          
          {/* Col 1: Brand Lore */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col items-start cursor-pointer" onClick={() => setActiveTab('home')}>
              <span className="font-serif text-3xl tracking-[0.2em] font-semibold text-[#FAF7F2]">
                RANGIKA
              </span>
              <span className="text-[10px] tracking-[0.28em] text-[#D4943E] uppercase font-medium mt-1 font-sans">
                ART THAT TELLS STORIES
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#C5B7A2] leading-relaxed max-w-sm font-light">
              Celebrating the authentic ancestral legacy of Mithila and Madhubani painting. Hand-crafted with organic minerals and bamboo reed stylus directly by master women artisan collectives in Bihar.
            </p>

            <div className="flex items-center gap-3 pt-2 text-[#D3C7B5]">
              <a
                href={`https://wa.me/${cmsContent.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#283C2E] border border-[#3E5343] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors"
                title="Direct WhatsApp Helpline"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <span className="text-xs text-[#A89C8B]">
                Artisan Helpline: <strong className="text-white">{cmsContent.businessPhone}</strong>
              </span>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-medium text-white tracking-wider">
              Art Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#C5B7A2]">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('traditional-mithila');
                    setActiveTab('shop');
                  }}
                  className="hover:text-[#D4943E] transition-colors cursor-pointer"
                >
                  Traditional Mithila Art
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('radha-krishna');
                    setActiveTab('shop');
                  }}
                  className="hover:text-[#D4943E] transition-colors cursor-pointer"
                >
                  Radha Krishna Paintings
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('nature-wildlife');
                    setActiveTab('shop');
                  }}
                  className="hover:text-[#D4943E] transition-colors cursor-pointer"
                >
                  Nature & Wildlife
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('wedding-couple');
                    setActiveTab('shop');
                  }}
                  className="hover:text-[#D4943E] transition-colors cursor-pointer"
                >
                  Wedding & Kohbar Art
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('modern-madhubani');
                    setActiveTab('shop');
                  }}
                  className="hover:text-[#D4943E] transition-colors cursor-pointer"
                >
                  Modern Madhubani Art
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Commissions */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-medium text-white tracking-wider">
              Commissions & B2B
            </h4>
            <ul className="space-y-2 text-xs text-[#C5B7A2]">
              <li>
                <button
                  onClick={() => setActiveTab('custom-painting')}
                  className="hover:text-[#D4943E] transition-colors cursor-pointer text-left"
                >
                  Bespoke Custom Paintings
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('wholesale')}
                  className="hover:text-[#D4943E] transition-colors cursor-pointer text-left"
                >
                  Wholesale & Galleries
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('our-story')}
                  className="hover:text-[#D4943E] transition-colors cursor-pointer text-left"
                >
                  Our Heritage & Artisans
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="hover:text-[#D4943E] transition-colors cursor-pointer text-left"
                >
                  Contact Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Policies */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-medium text-white tracking-wider">
              Patron Care & Policies
            </h4>
            <ul className="space-y-2 text-xs text-[#C5B7A2]">
              <li>
                <span className="hover:text-white cursor-pointer">Certificate of Authenticity</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Safe Museum Transit Policy</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">7-Day Return & Cancellation</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Custom Order Terms</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Privacy & Data Security</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Heritage Badge */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A89C8B] gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4943E]"></span>
            <span>
              © {new Date().getFullYear()} RANGIKA. Rooted in Mithila, Bihar. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="italic font-serif text-[#D4943E]">
              "Art That Tells Stories"
            </span>
            <span className="text-[#3E5343]">|</span>
            <span>GI Protected Geographical Folk Heritage</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
