import React, { useState } from 'react';
import {
  X,
  User,
  Package,
  Heart,
  Sparkles,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  MapPin,
  Calendar,
  Printer
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const ORDER_STEPS = [
  'Order Received',
  'Order Confirmed',
  'Artwork Preparation',
  'Quality Check',
  'Ready for Dispatch',
  'Shipped',
  'Delivered',
];

export const AccountModal: React.FC = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    orders,
    customRequests,
    wishlist,
    paintings,
    setSelectedPainting,
    setActiveTab,
    cmsContent,
    setSelectedInvoiceOrder,
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'custom' | 'wishlist' | 'profile'>('orders');

  if (!isAccountOpen) return null;

  const getStepIndex = (status: string) => {
    const idx = ORDER_STEPS.indexOf(status);
    return idx >= 0 ? idx : 1;
  };

  const wishlistedPaintings = paintings.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E5DAC8] my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EAE3D5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1E2D22] text-[#D4943E] flex items-center justify-center font-serif text-lg font-bold">
              R
            </div>
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1E2D22]">
                Patron Portal & Order Tracking
              </h3>
              <p className="text-xs text-[#8E7B6C]">
                Signed in as <span className="font-semibold text-[#1E2D22]">Aditi Mathur</span> (aditi.mathur@gmail.com)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAccountOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtabs Bar */}
        <div className="flex border-b border-[#EAE3D5] bg-[#F4EFE6] px-6 text-xs sm:text-sm overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`py-3 px-4 font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'orders'
                ? 'border-[#C85A32] text-[#C85A32] font-semibold'
                : 'border-transparent text-[#6B5B4E] hover:text-[#1E2D22]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History & Tracking ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('custom')}
            className={`py-3 px-4 font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'custom'
                ? 'border-[#C85A32] text-[#C85A32] font-semibold'
                : 'border-transparent text-[#6B5B4E] hover:text-[#1E2D22]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Custom Painting Requests ({customRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('wishlist')}
            className={`py-3 px-4 font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'wishlist'
                ? 'border-[#C85A32] text-[#C85A32] font-semibold'
                : 'border-transparent text-[#6B5B4E] hover:text-[#1E2D22]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Favorites ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`py-3 px-4 font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'profile'
                ? 'border-[#C85A32] text-[#C85A32] font-semibold'
                : 'border-transparent text-[#6B5B4E] hover:text-[#1E2D22]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Patron Profile</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* ORDERS & TRACKING */}
          {activeSubTab === 'orders' && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-[#D5C7B0] mx-auto mb-2" />
                  <p className="text-sm text-[#7A6B5D]">No orders placed yet.</p>
                </div>
              ) : (
                orders.map((ord) => {
                  const currentIdx = getStepIndex(ord.orderStatus);
                  return (
                    <div
                      key={ord.id}
                      className="bg-white rounded-2xl p-6 border border-[#E5DAC8] shadow-xs space-y-6"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE3D5]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-lg font-semibold text-[#1E2D22]">
                              Order #{ord.id}
                            </span>
                            <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-0.5 rounded-full font-medium">
                              {ord.orderStatus}
                            </span>
                          </div>
                          <p className="text-xs text-[#8E7B6C] mt-0.5">
                            Placed on {ord.createdAt} · Payment: {ord.paymentMethod} ({ord.paymentStatus})
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedInvoiceOrder(ord)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2D7C5] bg-[#FAF7F2] hover:bg-[#EAE3D5] text-[#1E2D22] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                            title="View or print official tax invoice"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#C85A32]" />
                            <span>Tax Invoice</span>
                          </button>

                          <div className="text-right">
                            <span className="text-xs text-[#8E7B6C] block uppercase font-medium">
                              Total Order Value
                            </span>
                            <span className="font-serif text-xl font-semibold text-[#1E2D22]">
                              ₹{ord.total.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 7-Step Visual Timeline */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#6B5B4E] mb-3">
                          <span className="flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-[#C85A32]" />
                            Live Handcraft & Delivery Milestones
                          </span>
                          {ord.trackingNumber && (
                            <span className="font-mono text-[#1E2D22]">
                              Tracking: {ord.trackingNumber}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                          {ORDER_STEPS.map((stepName, sIdx) => {
                            const isCompleted = sIdx <= currentIdx;
                            const isCurrent = sIdx === currentIdx;
                            return (
                              <div
                                key={stepName}
                                className={`p-2 rounded-xl text-center border text-[11px] transition-all ${
                                  isCurrent
                                    ? 'bg-[#1E2D22] text-[#FAF7F2] border-[#1E2D22] font-bold shadow-xs'
                                    : isCompleted
                                    ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9] font-medium'
                                    : 'bg-[#FAF7F2] text-[#8E7B6C] border-[#EAE3D5]'
                                }`}
                              >
                                <div className="flex items-center justify-center mb-1">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-current" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                  )}
                                </div>
                                <span className="leading-tight block line-clamp-2">{stepName}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Purchased Artworks Items */}
                      <div className="pt-4 border-t border-[#F4EFE6] space-y-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] block">
                          Included Artworks:
                        </span>
                        {ord.items.map((it) => (
                          <div
                            key={it.id}
                            className="flex items-center gap-3 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EAE3D5]"
                          >
                            <img
                              src={it.image}
                              alt={it.title}
                              className="w-12 h-14 rounded-lg object-cover"
                            />
                            <div className="flex-1 text-xs">
                              <span className="font-semibold text-[#1E2D22] block">{it.title}</span>
                              <span className="text-[#8E7B6C]">
                                {it.selectedSize} · {it.selectedFraming.label} · Qty: {it.quantity}
                              </span>
                            </div>
                            <span className="font-serif text-sm font-semibold text-[#1E2D22]">
                              ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address footer */}
                      <div className="text-xs text-[#8E7B6C] pt-2 border-t border-[#F4EFE6] flex items-center justify-between">
                        <span>
                          Shipment destination: {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.state} {ord.shippingAddress.postalCode}
                        </span>
                        <span className="text-[#2E7D32] font-medium">Archival Crate Protected</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* CUSTOM PAINTING REQUESTS */}
          {activeSubTab === 'custom' && (
            <div className="space-y-6">
              {customRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-[#D5C7B0] mx-auto mb-2" />
                  <p className="text-sm text-[#7A6B5D]">No custom painting requests yet.</p>
                </div>
              ) : (
                customRequests.map((cr) => (
                  <div
                    key={cr.id}
                    className="bg-white rounded-2xl p-6 border border-[#E5DAC8] shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE3D5]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-lg font-semibold text-[#1E2D22]">
                            Custom Request #{cr.id}
                          </span>
                          <span className="text-xs bg-[#FFF8E1] text-[#B87B2E] border border-[#FFE082] px-2.5 py-0.5 rounded-full font-medium">
                            {cr.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#8E7B6C] mt-0.5">
                          Submitted on {cr.createdAt} · Theme: <strong className="text-[#1E2D22]">{cr.theme}</strong>
                        </p>
                      </div>

                      {cr.quotationAmount && (
                        <div className="text-right">
                          <span className="text-xs text-[#8E7B6C] block uppercase font-medium">
                            Artisan Quotation
                          </span>
                          <span className="font-serif text-xl font-semibold text-[#1E2D22]">
                            ₹{cr.quotationAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-[#5A4D41] space-y-2 bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE3D5]">
                      <p><strong>Design Requirements:</strong> {cr.designRequirements}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#EAE3D5]">
                        <p><strong>Size:</strong> {cr.preferredSize}</p>
                        <p><strong>Material:</strong> {cr.materialPreference}</p>
                        <p><strong>Target Delivery:</strong> {cr.deliveryDate}</p>
                      </div>
                      {cr.adminNotes && (
                        <div className="mt-2 pt-2 border-t border-[#EAE3D5] text-[#1E2D22]">
                          <strong>Master Studio Note:</strong> {cr.adminNotes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-[#8E7B6C]">
                        Direct Studio Support Line: {cmsContent.businessPhone}
                      </span>
                      <button
                        onClick={() => {
                          const text = encodeURIComponent(
                            `Namaste RANGIKA! Checking status for custom painting request [ID: ${cr.id}].`
                          );
                          window.open(`https://wa.me/${cmsContent.whatsappNumber.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                        }}
                        className="bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs px-4 py-2 rounded-full font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* WISHLIST */}
          {activeSubTab === 'wishlist' && (
            <div>
              {wishlistedPaintings.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-[#D5C7B0] mx-auto mb-2" />
                  <p className="text-sm text-[#7A6B5D]">No paintings saved in wishlist yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {wishlistedPaintings.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setIsAccountOpen(false);
                        setSelectedPainting(p);
                      }}
                      className="bg-white rounded-2xl border border-[#E5DAC8] overflow-hidden shadow-xs hover:shadow-md cursor-pointer group transition-all"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full aspect-[4/5] object-cover transition-transform group-hover:scale-105 duration-500"
                      />
                      <div className="p-4">
                        <span className="text-[10px] uppercase tracking-wider text-[#C85A32] font-semibold block">
                          {p.categoryName}
                        </span>
                        <h4 className="font-serif text-base font-semibold text-[#1E2D22] line-clamp-1 mb-1">
                          {p.title}
                        </h4>
                        <span className="font-serif text-lg font-bold text-[#1E2D22]">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {activeSubTab === 'profile' && (
            <div className="bg-white rounded-2xl p-6 border border-[#E5DAC8] shadow-xs max-w-xl mx-auto space-y-4 text-xs">
              <h4 className="font-serif text-xl font-medium text-[#1E2D22] mb-3">
                Saved Patron Credentials
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-[#8E7B6C] block uppercase tracking-wider font-semibold mb-1">
                    Primary Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Aditi Mathur"
                    className="w-full text-sm p-2.5 border border-[#E2D7C5] rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[#8E7B6C] block uppercase tracking-wider font-semibold mb-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    defaultValue="aditi.mathur@gmail.com"
                    className="w-full text-sm p-2.5 border border-[#E2D7C5] rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[#8E7B6C] block uppercase tracking-wider font-semibold mb-1">
                    Default Shipping Address
                  </label>
                  <textarea
                    rows={2}
                    defaultValue="45, Palm Avenue, Indiranagar, Bengaluru, Karnataka 560038"
                    className="w-full text-sm p-2.5 border border-[#E2D7C5] rounded-lg"
                  ></textarea>
                </div>
                <div className="pt-2">
                  <button className="bg-[#1E2D22] hover:bg-[#C85A32] text-white px-6 py-2.5 rounded-full uppercase tracking-wider font-semibold transition-colors">
                    Save Profile Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
