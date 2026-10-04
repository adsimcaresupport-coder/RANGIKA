import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  MessageCircle,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Layers,
  Palette,
  Send,
  HelpCircle,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const CUSTOM_THEMES = [
  'Personalized Family Legacy Artwork',
  'Wedding & Kohbar Bridal Chamber Blessing',
  'Couple Portrait in Madhubani Motif',
  'Religious & Sacred Deities (Radha-Krishna, Durga, Shiva)',
  'Housewarming / Griha Pravesh Auspicious Art',
  'Corporate Heritage Gifting & Executive Art',
  'Architectural Wall Mural Design',
  'Sacred Nature & Wildlife Custom Composition',
];

const MATERIALS = [
  'Handmade 280 GSM Lokta Paper (Authentic Organic)',
  'Hand-spun Raw Tussar Silk (Lustrous & Rare)',
  'Heavyweight Belgian Fine Archival Canvas',
  'Fine Khadi Handloom Treated Fabric',
];

const FRAMING_OPTIONS = [
  'Museum Grade Solid Teak Wood Frame with Glass',
  'Minimalist Matte Black Wood Frame',
  'Unframed / Rolled in Heavy-Duty Archival Tube',
];

export const CustomPaintingSection: React.FC = () => {
  const { submitCustomRequest, setIsAccountOpen } = useStore();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState('');

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState(CUSTOM_THEMES[0]);
  const [designRequirements, setDesignRequirements] = useState('');
  const [preferredSize, setPreferredSize] = useState('24x36 in');
  const [preferredColors, setPreferredColors] = useState('Earthy Terracotta, Turmeric Yellow, and Natural Indigo');
  const [materialPreference, setMaterialPreference] = useState(MATERIALS[0]);
  const [framingPreference, setFramingPreference] = useState(FRAMING_OPTIONS[0]);
  const [quantity, setQuantity] = useState(1);
  const [budget, setBudget] = useState('₹2,500 - ₹4,000');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenceImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = 'Please enter your name.';
    if (!mobile.trim()) errs.mobile = 'Please enter your mobile phone number.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Please provide a valid email address.';
    if (!designRequirements.trim() || designRequirements.length < 15) {
      errs.designRequirements = 'Please describe your vision (at least 15 characters).';
    }
    if (!deliveryAddress.trim()) errs.deliveryAddress = 'Please specify destination city/address.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const id = submitCustomRequest({
      customerName,
      mobile,
      email,
      theme,
      designRequirements,
      preferredSize,
      preferredColors,
      materialPreference,
      framingPreference,
      quantity,
      budget,
      deliveryDate: deliveryDate || 'Flexible / 4-6 weeks',
      deliveryAddress,
      additionalInstructions,
      referenceImage: referenceImage || undefined,
    });

    setSubmittedRequestId(id);
    setFormSubmitted(true);
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(
      `Namaste RANGIKA! I am inquiring about custom Mithila painting request [ID: ${
        submittedRequestId || 'NEW'
      }] for "${theme}". My requirements: ${designRequirements.slice(0, 100)}...`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <section id="custom-painting" className="py-16 sm:py-24 bg-[#F4EFE6] border-t border-[#E8DFC9]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FAF7F2] border border-[#E2D7C5] px-3.5 py-1.5 rounded-full text-xs text-[#C85A32] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BESPOKE ART COMMISSIONS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1E2D22] mb-4">
            Your Idea. Our Art.
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#6B5B4E] font-light leading-relaxed">
            Have a special design in mind? Tell us what you want, choose your preferred size and colors, and let RANGIKA help bring your vision to life through Mithila-inspired artwork.
          </p>
        </div>

        {formSubmitted ? (
          /* Confirmation State with WhatsApp shortcut & Order Tracking */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5DAC8] shadow-lg text-center max-w-2xl mx-auto animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-[#233327] text-[#D4943E] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase tracking-[0.25em] text-[#C85A32] font-semibold block mb-2">
              REQUEST REGISTERED
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1E2D22] mb-3">
              Thank You, {customerName}!
            </h3>
            <p className="text-sm text-[#6B5B4E] leading-relaxed mb-4">
              Your custom painting request <span className="font-mono font-semibold text-[#1E2D22]">#{submittedRequestId}</span> has been securely recorded. Our master artisan coordinator is reviewing your specifications and will prepare a tailored quotation within 24–48 hours.
            </p>

            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8DFC9] text-xs text-[#5A4D41] text-left space-y-2 mb-8">
              <p><strong>Selected Theme:</strong> {theme}</p>
              <p><strong>Preferred Size & Material:</strong> {preferredSize} · {materialPreference}</p>
              <p><strong>Estimated Budget:</strong> {budget}</p>
              <p><strong>Registered Contact:</strong> {mobile} | {email}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleWhatsAppChat}
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuss on WhatsApp Now</span>
              </button>

              <button
                onClick={() => setIsAccountOpen(true)}
                className="w-full sm:w-auto bg-[#1E2D22] hover:bg-[#283C2E] text-white px-6 py-3 rounded-full font-medium text-sm transition-colors cursor-pointer"
              >
                <span>Track Request in My Account</span>
              </button>
            </div>

            <button
              onClick={() => {
                setFormSubmitted(false);
                setDesignRequirements('');
                setReferenceImage(null);
              }}
              className="mt-6 text-xs text-[#8E7B6C] hover:text-[#C85A32] underline"
            >
              Submit another custom request
            </button>
          </div>
        ) : (
          /* Dedicated Interactive Custom Order Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E5DAC8] shadow-sm space-y-8"
          >
            {/* Customer Details Row */}
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1E2D22] pb-3 border-b border-[#EAE3D5] mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C85A32]"></span>
                <span>1. Contact & Customer Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Smt. Radhika Verma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full text-sm px-4 py-2.5 rounded-lg border ${
                      errors.customerName ? 'border-red-500 bg-red-50/20' : 'border-[#E2D7C5]'
                    } focus:border-[#C85A32] outline-none`}
                  />
                  {errors.customerName && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.customerName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                    Mobile Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={`w-full text-sm px-4 py-2.5 rounded-lg border ${
                      errors.mobile ? 'border-red-500 bg-red-50/20' : 'border-[#E2D7C5]'
                    } focus:border-[#C85A32] outline-none`}
                  />
                  {errors.mobile && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.mobile}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="radhika@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full text-sm px-4 py-2.5 rounded-lg border ${
                      errors.email ? 'border-red-500 bg-red-50/20' : 'border-[#E2D7C5]'
                    } focus:border-[#C85A32] outline-none`}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Design & Theme Specifications */}
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1E2D22] pb-3 border-b border-[#EAE3D5] mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4943E]"></span>
                <span>2. Artwork Theme & Design Vision</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                    Painting Theme *
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-[#E2D7C5] focus:border-[#C85A32] outline-none bg-white cursor-pointer"
                  >
                    {CUSTOM_THEMES.map((th) => (
                      <option key={th} value={th}>
                        {th}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                    Preferred Dimensions / Size *
                  </label>
                  <select
                    value={preferredSize}
                    onChange={(e) => setPreferredSize(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-[#E2D7C5] focus:border-[#C85A32] outline-none bg-white cursor-pointer"
                  >
                    <option value="12x16 in (Accent Desk / Small Nook)">12x16 in (Accent Desk / Small Nook)</option>
                    <option value="18x24 in (Standard Living Wall)">18x24 in (Standard Living Wall)</option>
                    <option value="24x36 in (Statement Hallway / Dining)">24x36 in (Statement Hallway / Dining)</option>
                    <option value="36x48 in (Grand Masterpiece / Entrance)">36x48 in (Grand Masterpiece / Entrance)</option>
                    <option value="Custom Murals & Large Canvas">Custom Murals & Large Canvas</option>
                  </select>
                </div>
              </div>

              {/* Design Requirements Textarea */}
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                  Design Requirements & Cultural Elements *
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us what you want painted: specific symbols (peacocks, lotus, sacred tree, sun & moon), family initials, wedding dates in Maithili script, mythological scenes, or custom symbolism..."
                  value={designRequirements}
                  onChange={(e) => setDesignRequirements(e.target.value)}
                  className={`w-full text-sm p-4 rounded-xl border ${
                    errors.designRequirements ? 'border-red-500 bg-red-50/20' : 'border-[#E2D7C5]'
                  } focus:border-[#C85A32] outline-none leading-relaxed`}
                ></textarea>
                {errors.designRequirements && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.designRequirements}</span>
                )}
              </div>

              {/* Preferred Colors & Material */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                    Preferred Color Palette
                  </label>
                  <input
                    type="text"
                    value={preferredColors}
                    onChange={(e) => setPreferredColors(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-[#E2D7C5] focus:border-[#C85A32] outline-none"
                    placeholder="e.g. Terracotta, Turmeric Yellow, Natural Indigo, Monochrome"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                    Material Preference
                  </label>
                  <select
                    value={materialPreference}
                    onChange={(e) => setMaterialPreference(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-[#E2D7C5] focus:border-[#C85A32] outline-none bg-white cursor-pointer"
                  >
                    {MATERIALS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Framing Preference & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                    Framing Preference
                  </label>
                  <select
                    value={framingPreference}
                    onChange={(e) => setFramingPreference(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-[#E2D7C5] focus:border-[#C85A32] outline-none bg-white cursor-pointer"
                  >
                    {FRAMING_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-[#E2D7C5] focus:border-[#C85A32] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Delivery, Budget & Reference Image Upload */}
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1E2D22] pb-3 border-b border-[#EAE3D5] mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E2D22]"></span>
                <span>3. Budget, Delivery & Reference Material</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                    Estimated Budget Range (₹)
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-[#E2D7C5] focus:border-[#C85A32] outline-none bg-white cursor-pointer"
                  >
                    <option value="₹1,500 - ₹2,500">₹1,500 - ₹2,500 (Small Accent Artwork)</option>
                    <option value="₹2,500 - ₹4,000">₹2,500 - ₹4,000 (Popular Medium Wall Art)</option>
                    <option value="₹4,000 - ₹7,000">₹4,000 - ₹7,000 (Detailed Framed Artwork)</option>
                    <option value="₹7,000+ (Grand Masterpiece / Murals)">₹7,000+ (Grand Masterpiece / Large Silk Mural)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                    Required Delivery Date
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-[#E2D7C5] focus:border-[#C85A32] outline-none"
                  />
                  <span className="text-[11px] text-[#8E7B6C] block mt-1">
                    Authentic handmade work typically takes 3 to 6 weeks.
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                  Delivery Address / City *
                </label>
                <input
                  type="text"
                  placeholder="Apartment, Street, City, State, Pin Code"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className={`w-full text-sm px-4 py-2.5 rounded-lg border ${
                    errors.deliveryAddress ? 'border-red-500 bg-red-50/20' : 'border-[#E2D7C5]'
                  } focus:border-[#C85A32] outline-none`}
                />
                {errors.deliveryAddress && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.deliveryAddress}</span>
                )}
              </div>

              {/* Reference Image Upload Box */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                  Upload Reference Image / Interior Wall Photo (Optional)
                </label>
                <div className="border-2 border-dashed border-[#E2D7C5] hover:border-[#C85A32] rounded-2xl p-6 text-center transition-colors bg-[#FAF7F2]/60 relative">
                  {referenceImage ? (
                    <div className="relative inline-block">
                      <img
                        src={referenceImage}
                        alt="Uploaded reference"
                        className="max-h-48 rounded-xl object-contain border border-[#E2D7C5]"
                      />
                      <button
                        type="button"
                        onClick={() => setReferenceImage(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-[#8E7B6C] mx-auto mb-2" />
                      <p className="text-xs text-[#5A4D41] font-medium mb-1">
                        Drag and drop your photo here, or click to browse
                      </p>
                      <p className="text-[11px] text-[#8E7B6C]">
                        PNG, JPG or WEBP (up to 10MB)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Action & WhatsApp Guarantee */}
            <div className="pt-6 border-t border-[#EAE3D5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#6B5B4E]">
                <CheckCircle2 className="w-4 h-4 text-[#D4943E]" />
                <span>Zero advance required until design sketch approval.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#1E2D22] hover:bg-[#C85A32] text-white px-8 py-3.5 rounded-full font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Custom Painting →</span>
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
