import React, { useState } from 'react';
import {
  Globe,
  Save,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CMSContent } from '../../types';

export const AdminCMSTab: React.FC = () => {
  const { cmsContent, updateCMSContent, paintings, showToast } = useStore();

  const [announcementText, setAnnouncementText] = useState(cmsContent.announcementText);
  const [bannerHeadline, setBannerHeadline] = useState(cmsContent.bannerHeadline);
  const [bannerSubtitle, setBannerSubtitle] = useState(cmsContent.bannerSubtitle);
  const [bannerBadge, setBannerBadge] = useState(cmsContent.bannerBadge);
  const [bannerButtonText, setBannerButtonText] = useState(cmsContent.bannerButtonText);
  const [promoBannerText, setPromoBannerText] = useState(cmsContent.promoBannerText);

  // Business info
  const [businessName, setBusinessName] = useState(cmsContent.businessName);
  const [ownerName, setOwnerName] = useState(cmsContent.ownerName);
  const [businessEmail, setBusinessEmail] = useState(cmsContent.businessEmail);
  const [businessPhone, setBusinessPhone] = useState(cmsContent.businessPhone);
  const [whatsappNumber, setWhatsappNumber] = useState(cmsContent.whatsappNumber);
  const [studioAddress, setStudioAddress] = useState(cmsContent.studioAddress);
  const [gstin, setGstin] = useState(cmsContent.gstin);
  const [pan, setPan] = useState(cmsContent.pan);

  // Policies
  const [shippingPolicyText, setShippingPolicyText] = useState(cmsContent.shippingPolicyText);
  const [returnPolicyText, setReturnPolicyText] = useState(cmsContent.returnPolicyText);
  const [authenticityGuaranteeText, setAuthenticityGuaranteeText] = useState(cmsContent.authenticityGuaranteeText);

  // Social Links
  const [instagram, setInstagram] = useState(cmsContent.socialLinks.instagram);
  const [facebook, setFacebook] = useState(cmsContent.socialLinks.facebook);
  const [youtube, setYoutube] = useState(cmsContent.socialLinks.youtube);
  const [pinterest, setPinterest] = useState(cmsContent.socialLinks.pinterest);

  // Featured Paintings Selection
  const [selectedFeaturedIds, setSelectedFeaturedIds] = useState<string[]>(
    cmsContent.featuredPaintingIds || []
  );

  const toggleFeaturedPainting = (id: string) => {
    setSelectedFeaturedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();

    updateCMSContent({
      announcementText: announcementText.trim(),
      bannerHeadline: bannerHeadline.trim(),
      bannerSubtitle: bannerSubtitle.trim(),
      bannerBadge: bannerBadge.trim(),
      bannerButtonText: bannerButtonText.trim(),
      promoBannerText: promoBannerText.trim(),
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      businessEmail: businessEmail.trim(),
      businessPhone: businessPhone.trim(),
      whatsappNumber: whatsappNumber.trim(),
      studioAddress: studioAddress.trim(),
      gstin: gstin.trim(),
      pan: pan.trim(),
      shippingPolicyText: shippingPolicyText.trim(),
      returnPolicyText: returnPolicyText.trim(),
      authenticityGuaranteeText: authenticityGuaranteeText.trim(),
      socialLinks: {
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        youtube: youtube.trim(),
        pinterest: pinterest.trim(),
      },
      featuredPaintingIds: selectedFeaturedIds,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#1E2D22]">
            Website Content Management (CMS)
          </h3>
          <p className="text-xs text-[#8E7B6C]">
            Update your storefront banners, business contact details, policy copy, and featured artworks live without modifying code.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveCMS} className="space-y-6">
        
        {/* Section 1: Hero & Announcements */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EAE3D5]">
            <Globe className="w-5 h-5 text-[#C85A32]" />
            <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
              Storefront Announcements & Hero Messaging
            </h4>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#3E342B] mb-1">
                Top Announcement Ribbon Text (Header Bar)
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none font-medium text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#3E342B] mb-1">
                  Hero Eyebrow / Badge Text
                </label>
                <input
                  type="text"
                  value={bannerBadge}
                  onChange={(e) => setBannerBadge(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3E342B] mb-1">
                  Primary Action Button Text
                </label>
                <input
                  type="text"
                  value={bannerButtonText}
                  onChange={(e) => setBannerButtonText(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#3E342B] mb-1">
                Hero Main Headline
              </label>
              <input
                type="text"
                value={bannerHeadline}
                onChange={(e) => setBannerHeadline(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none font-serif text-base"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3E342B] mb-1">
                Hero Narrative Subtitle
              </label>
              <textarea
                rows={2}
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl p-3 outline-none text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3E342B] mb-1">
                Mid-page Promotional Banner Text
              </label>
              <input
                type="text"
                value={promoBannerText}
                onChange={(e) => setPromoBannerText(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Featured Paintings Selector */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4943E]" />
              <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
                Homepage Featured Paintings Selection
              </h4>
            </div>
            <span className="text-xs text-[#8E7B6C] font-medium">
              {selectedFeaturedIds.length} artworks selected
            </span>
          </div>

          <p className="text-xs text-[#6B5B4E]">
            Check the paintings you wish to highlight in prominent homepage galleries and carousels:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-72 overflow-y-auto p-1">
            {paintings.map((p) => {
              const isSelected = selectedFeaturedIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => toggleFeaturedPainting(p.id)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'border-[#C85A32] bg-[#FAF7F2] shadow-xs'
                      : 'border-[#EAE3D5] hover:border-gray-400 bg-white'
                  }`}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-xs text-[#1E2D22] block truncate">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">₹{p.price.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 accent-[#C85A32] cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Business Information & Invoicing Credentials */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EAE3D5]">
            <ShieldCheck className="w-5 h-5 text-[#1E2D22]" />
            <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
              Atelier Business & Tax Details
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#3E342B] mb-1">
                Business & Atelier Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3E342B] mb-1">
                Founder / Master Artisan Name
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3E342B] mb-1">
                Official Business Email
              </label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3E342B] mb-1">
                Customer Phone Number
              </label>
              <input
                type="text"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3E342B] mb-1">
                WhatsApp Business Helpline
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3E342B] mb-1">
                Registered GSTIN & PAN
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="GSTIN"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none font-mono uppercase"
                />
                <input
                  type="text"
                  placeholder="PAN"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none font-mono uppercase"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#3E342B] mb-1">
                Atelier Studio Physical Address (Printed on Invoices)
              </label>
              <textarea
                rows={2}
                value={studioAddress}
                onChange={(e) => setStudioAddress(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl p-3 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Policies & Guarantees */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EAE3D5]">
            <Truck className="w-5 h-5 text-[#C85A32]" />
            <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
              Fulfillment Policies & Authenticity Guarantees
            </h4>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#3E342B] mb-1">
                Shipping & Packaging Policy Copy
              </label>
              <textarea
                rows={3}
                value={shippingPolicyText}
                onChange={(e) => setShippingPolicyText(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl p-3 outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3E342B] mb-1">
                Return & Refund Policy Copy
              </label>
              <textarea
                rows={2}
                value={returnPolicyText}
                onChange={(e) => setReturnPolicyText(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl p-3 outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3E342B] mb-1">
                Certificate of Authenticity Declaration
              </label>
              <textarea
                rows={2}
                value={authenticityGuaranteeText}
                onChange={(e) => setAuthenticityGuaranteeText(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl p-3 outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Social Media Channels */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EAE3D5]">
            <Share2 className="w-5 h-5 text-[#1E2D22]" />
            <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
              Official Social Media Profiles
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#3E342B] mb-1">Instagram URL</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3E342B] mb-1">Facebook URL</label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3E342B] mb-1">YouTube URL</label>
              <input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3E342B] mb-1">Pinterest URL</label>
              <input
                type="url"
                value={pinterest}
                onChange={(e) => setPinterest(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-4 z-20 bg-[#1E2D22] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between">
          <span className="text-xs text-[#D3C7B5] hidden sm:inline">
            Saving updates will instantly refresh all public storefront copy and contact channels.
          </span>
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 bg-[#D4943E] hover:bg-[#C85A32] text-[#1E2D22] hover:text-white rounded-xl text-xs font-semibold tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Publish Website Changes</span>
          </button>
        </div>

      </form>

    </div>
  );
};
