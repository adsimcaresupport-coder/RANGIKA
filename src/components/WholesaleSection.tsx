import React, { useState } from 'react';
import { Building2, CheckCircle2, Send, Briefcase, Globe, Award, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const BUSINESS_TYPES = [
  'Art Gallery & Fine Art Dealer',
  'Luxury Home Decor & Furniture Store',
  'Interior Architecture & Design Firm',
  'Hospitality / Boutique Hotel Chain',
  'Corporate Gifting Agency / Enterprise',
  'Museum Gift Shop & Cultural Emporium',
  'International Retailer & Export Buyer',
  'Online Art Curator / Marketplace',
];

const CATEGORY_OPTIONS = [
  'Traditional Mithila Paintings',
  'Radha Krishna Devotional Series',
  'Nature & Peacock Wildlife Collections',
  'Bespoke Wedding & Couple Keepsakes',
  'Modern Madhubani Minimalist Works',
  'Custom Architectural Murals',
];

export const WholesaleSection: React.FC = () => {
  const { submitWholesaleEnquiry } = useStore();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  // Form states
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [requiredQuantity, setRequiredQuantity] = useState(20);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Traditional Mithila Paintings',
    'Modern Madhubani Minimalist Works',
  ]);
  const [budget, setBudget] = useState('₹1,50,000 - ₹3,00,000');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!businessName.trim()) errs.businessName = 'Please enter your business or organization name.';
    if (!contactPerson.trim()) errs.contactPerson = 'Please enter contact person name.';
    if (!phone.trim()) errs.phone = 'Please enter phone number.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Please enter a valid email address.';
    if (!deliveryLocation.trim()) errs.deliveryLocation = 'Please provide delivery location / city.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const id = submitWholesaleEnquiry({
      businessName,
      contactPerson,
      phone,
      email,
      businessType,
      requiredQuantity,
      categories: selectedCategories,
      budget,
      deliveryLocation,
      additionalRequirements,
    });

    setSubmittedId(id);
    setFormSubmitted(true);
  };

  return (
    <section id="wholesale" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#EAE3D5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#F4EFE6] border border-[#E2D7C5] px-3.5 py-1.5 rounded-full text-xs text-[#1E2D22] font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>COMMERCIAL & EXPORT PARTNERSHIPS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1E2D22] mb-4">
            Bring Mithila Art to Your Customers
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#6B5B4E] font-light leading-relaxed">
            Partner with RANGIKA for painting collections, customized artwork, and bulk order enquiries. We support galleries, boutiques, interior decorators, and corporate houses globally.
          </p>
        </div>

        {/* 3 Pillars for Bulk Buyers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white p-6 rounded-2xl border border-[#E5DAC8] shadow-xs">
            <Award className="w-8 h-8 text-[#D4943E] mb-3" />
            <h4 className="font-serif text-lg font-medium text-[#1E2D22] mb-1.5">
              Certificates of Authenticity
            </h4>
            <p className="text-xs text-[#6B5B4E] leading-relaxed">
              Every individual artwork includes a signed certificate documenting the artisan's lineage, materials, and cultural folklore.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5DAC8] shadow-xs">
            <Briefcase className="w-8 h-8 text-[#C85A32] mb-3" />
            <h4 className="font-serif text-lg font-medium text-[#1E2D22] mb-1.5">
              Tiered Volume Pricing
            </h4>
            <p className="text-xs text-[#6B5B4E] leading-relaxed">
              Transparent catalog discounts of 25% to 45% for wholesale quantities, with flexible framing and packaging configurations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5DAC8] shadow-xs">
            <Globe className="w-8 h-8 text-[#1E2D22] mb-3" />
            <h4 className="font-serif text-lg font-medium text-[#1E2D22] mb-1.5">
              Worldwide Insured Freight
            </h4>
            <p className="text-xs text-[#6B5B4E] leading-relaxed">
              Robust wooden archival crate packing ensuring safe international and domestic delivery with complete customs handling.
            </p>
          </div>
        </div>

        {formSubmitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5DAC8] shadow-md text-center max-w-xl mx-auto animate-in fade-in">
            <div className="w-16 h-16 bg-[#1E2D22] text-[#D4943E] rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-medium text-[#1E2D22] mb-2">
              Wholesale Enquiry #{submittedId} Received!
            </h3>
            <p className="text-sm text-[#6B5B4E] mb-6">
              Thank you, {contactPerson}. Our B2B partnership team at RANGIKA will contact you within 1 business day with our wholesale catalog and volume price breakdown.
            </p>
            <button
              onClick={() => {
                setFormSubmitted(false);
                setAdditionalRequirements('');
              }}
              className="text-xs text-[#C85A32] underline hover:text-[#B24622]"
            >
              Submit another enquiry
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DAC8] shadow-sm space-y-7"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                  Business / Company Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gallery Veda, London"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={`w-full text-sm px-4 py-2.5 rounded-lg border ${
                    errors.businessName ? 'border-red-500' : 'border-[#E2D7C5]'
                  } focus:border-[#C85A32] outline-none`}
                />
                {errors.businessName && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.businessName}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                  Contact Person *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alistair Wright (Curator)"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className={`w-full text-sm px-4 py-2.5 rounded-lg border ${
                    errors.contactPerson ? 'border-red-500' : 'border-[#E2D7C5]'
                  } focus:border-[#C85A32] outline-none`}
                />
                {errors.contactPerson && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.contactPerson}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98112 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full text-sm px-4 py-2.5 rounded-lg border ${
                    errors.phone ? 'border-red-500' : 'border-[#E2D7C5]'
                  } focus:border-[#C85A32] outline-none`}
                />
                {errors.phone && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.phone}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="partnerships@gallery.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full text-sm px-4 py-2.5 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-[#E2D7C5]'
                  } focus:border-[#C85A32] outline-none`}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                  Business Type *
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-[#E2D7C5] focus:border-[#C85A32] outline-none bg-white cursor-pointer"
                >
                  {BUSINESS_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity, Budget & Delivery */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                  Required Quantity (Units)
                </label>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  value={requiredQuantity}
                  onChange={(e) => setRequiredQuantity(Math.max(5, Number(e.target.value)))}
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-[#E2D7C5] focus:border-[#C85A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                  Estimated Budget
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. ₹2,00,000"
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-[#E2D7C5] focus:border-[#C85A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                  Delivery Destination / City *
                </label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className={`w-full text-sm px-4 py-2.5 rounded-lg border ${
                    errors.deliveryLocation ? 'border-red-500' : 'border-[#E2D7C5]'
                  } focus:border-[#C85A32] outline-none`}
                />
                {errors.deliveryLocation && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.deliveryLocation}</span>
                )}
              </div>
            </div>

            {/* Categories of Interest */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-2.5">
                Categories of Interest
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`text-xs p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'border-[#C85A32] bg-[#FAF7F2] font-semibold text-[#1E2D22]'
                          : 'border-[#E2D7C5] text-[#5A4D41] hover:border-gray-400'
                      }`}
                    >
                      <span className="line-clamp-1">{cat}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-[#C85A32] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Requirements */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                Additional Requirements / Framing / Custom Sizing Notes
              </label>
              <textarea
                rows={3}
                placeholder="Mention specific dimensions, custom packaging, framing finishes, or target timelines..."
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                className="w-full text-sm p-3.5 rounded-xl border border-[#E2D7C5] focus:border-[#C85A32] outline-none leading-relaxed"
              ></textarea>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-[#EAE3D5] flex items-center justify-between">
              <span className="text-xs text-[#7A6B5D] hidden sm:inline">
                Confidential B2B pricing protected under direct artisan agreement.
              </span>
              <button
                type="submit"
                className="bg-[#1E2D22] hover:bg-[#C85A32] text-white px-8 py-3.5 rounded-full font-medium text-sm transition-all duration-300 shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Request Wholesale Pricing →</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
