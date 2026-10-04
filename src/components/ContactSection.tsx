import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactSection: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [enquiryType, setEnquiryType] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    showToast('Message Sent', 'Thank you! Our studio team will get back to you within 24 hours.');
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C85A32] font-semibold block mb-2 font-sans">
            CONNECT WITH US
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1E2D22] mb-3">
            Contact RANGIKA Studio
          </h2>
          <p className="text-sm sm:text-base text-[#6B5B4E] font-light leading-relaxed">
            Whether you seek custom commissions, heritage curation, gallery partnerships, or assistance with an artwork, our artisan studio team welcomes your conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Studio Contact Cards Left */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E5DAC8] shadow-xs space-y-4">
              <h3 className="font-serif text-xl font-medium text-[#1E2D22]">
                Heritage Studio & Guild
              </h3>
              
              <div className="flex items-start gap-3.5 text-xs text-[#5A4D41]">
                <MapPin className="w-4 h-4 text-[#C85A32] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1E2D22]">Bihar Master Artisan Workshop:</strong>
                  <span>Ranti & Jitwarpur Craft Clusters, Madhubani District, Bihar 847211</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-xs text-[#5A4D41]">
                <MapPin className="w-4 h-4 text-[#D4943E] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1E2D22]">Curatorial Studio:</strong>
                  <span>Hauz Khas Heritage Design Enclave, New Delhi 110016</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-xs text-[#5A4D41] pt-2 border-t border-[#F4EFE6]">
                <Phone className="w-4 h-4 text-[#1E2D22] flex-shrink-0" />
                <div>
                  <span className="text-[#8E7B6C] block">Direct Telephone:</span>
                  <a href="tel:+919876543210" className="font-semibold text-[#1E2D22] hover:text-[#C85A32]">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-xs text-[#5A4D41]">
                <Mail className="w-4 h-4 text-[#1E2D22] flex-shrink-0" />
                <div>
                  <span className="text-[#8E7B6C] block">Studio Email:</span>
                  <a href="mailto:namaste@rangika-art.in" className="font-semibold text-[#1E2D22] hover:text-[#C85A32]">
                    namaste@rangika-art.in
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F4EFE6]">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant WhatsApp Art Concierge</span>
                </a>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E2D7C5] text-xs text-[#6B5B4E] space-y-1.5">
              <div className="flex items-center gap-2 text-[#1E2D22] font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Studio Concierge Hours</span>
              </div>
              <p>Monday to Saturday: 10:00 AM – 7:30 PM IST</p>
              <p>Sundays & Auspicious Festivals: By Appointment</p>
            </div>
          </div>

          {/* Contact Form Right */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-3xl border border-[#E5DAC8] shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                    ✓
                  </div>
                  <h4 className="font-serif text-2xl font-medium text-[#1E2D22]">
                    Message Received
                  </h4>
                  <p className="text-xs text-[#6B5B4E] max-w-sm mx-auto">
                    Thank you, {name}. An art coordinator will respond to your enquiry shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="mt-4 text-xs text-[#C85A32] underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-serif text-xl font-medium text-[#1E2D22] mb-2">
                    Send a Message to the Curators
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rohini Sen"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 00000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rohini@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                      Nature of Enquiry
                    </label>
                    <select
                      value={enquiryType}
                      onChange={(e) => setEnquiryType(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 border border-[#E2D7C5] rounded-xl outline-none bg-white focus:border-[#C85A32] cursor-pointer"
                    >
                      <option value="General Enquiry">General Artwork Question</option>
                      <option value="Custom Commission">Custom Artwork Commission</option>
                      <option value="Wholesale / B2B">Wholesale & Gallery Partnership</option>
                      <option value="Order Tracking">Order & Delivery Assistance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="How can our master artisans and curators assist you?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-sm p-3.5 border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32] leading-relaxed"
                    ></textarea>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-[#8E7B6C]">
                      We respect your privacy and never share your details.
                    </span>
                    <button
                      type="submit"
                      className="bg-[#1E2D22] hover:bg-[#C85A32] text-white px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
