import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    appliedDiscount,
    applyDiscountCode,
    removeDiscountCode,
    cartTotal,
    setIsCheckoutOpen,
    setActiveTab,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyDiscountCode(couponInput);
    if (ok) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between z-10 border-l border-[#E5DAC8] animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-[#EAE3D5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C85A32]" />
            <h3 className="font-serif text-xl font-medium text-[#1E2D22]">
              Your Art Collection
            </h3>
            <span className="text-xs bg-[#F4EFE6] px-2 py-0.5 rounded-full font-mono font-semibold text-[#6B5B4E]">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Milestone */}
        <div className="bg-[#1E2D22] text-[#FAF7F2] px-4 py-2.5 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[#E5D7C2]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4943E]" />
            Free White-Glove Insured Art Transit
          </span>
          <span className="text-[#D4943E] font-semibold">All India</span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="w-12 h-12 text-[#D5C7B0] mx-auto mb-3" />
              <h4 className="font-serif text-xl text-[#1E2D22] mb-1">Your cart is empty</h4>
              <p className="text-xs text-[#8E7B6C] max-w-xs mx-auto mb-6">
                Discover traditional Mithila paintings hand-painted by master artisans in Bihar.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveTab('shop');
                }}
                className="bg-[#1E2D22] hover:bg-[#C85A32] text-white text-xs px-6 py-2.5 rounded-full uppercase tracking-wider font-semibold transition-colors"
              >
                Explore Paintings
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-[#E5DAC8] flex gap-3.5 shadow-xs relative"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-24 rounded-xl object-cover object-center flex-shrink-0 border border-[#EAE3D5]"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-[#1E2D22] line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#8E7B6C] mt-0.5">
                      Size: <span className="text-[#2E251E] font-medium">{item.selectedSize}</span>
                    </p>
                    <p className="text-[11px] text-[#8E7B6C] line-clamp-1">
                      Frame: <span className="text-[#2E251E] font-medium">{item.selectedFraming.label}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F4EFE6]">
                    <div className="flex items-center border border-[#E2D7C5] rounded-lg bg-[#FAF7F2]">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-gray-500 hover:text-black font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-gray-500 hover:text-black font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-sm font-semibold text-[#1E2D22]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove artwork"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-[#EAE3D5] space-y-4">
            {/* Promo Code Applicator */}
            {appliedDiscount ? (
              <div className="bg-[#E8F5E9] text-[#2E7D32] px-3.5 py-2 rounded-xl text-xs flex items-center justify-between border border-[#C8E6C9]">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>
                    Coupon <strong>{appliedDiscount.code}</strong> applied ({appliedDiscount.percent ? `${appliedDiscount.percent}% off` : `₹${appliedDiscount.amount} off`})
                  </span>
                </div>
                <button
                  onClick={removeDiscountCode}
                  className="text-red-500 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount code (try MITHILA10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2 border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32] uppercase placeholder:normal-case"
                />
                <button
                  type="submit"
                  className="bg-[#F4EFE6] hover:bg-[#EAE3D5] text-[#1E2D22] text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#6B5B4E]">
              <div className="flex justify-between">
                <span>Artwork Subtotal</span>
                <span className="font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-[#2E7D32]">
                  <span>Discount {appliedDiscount.percent ? `(${appliedDiscount.percent}%)` : `(${appliedDiscount.code})`}</span>
                  <span className="font-mono">-₹{appliedDiscount.amount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Freight & Packaging</span>
                <span className="text-[#2E7D32] font-semibold">FREE</span>
              </div>
              <div className="pt-2 border-t border-[#EAE3D5] flex justify-between items-baseline text-sm font-semibold text-[#1E2D22]">
                <span className="font-serif text-base">Grand Total</span>
                <span className="font-serif text-xl">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-[#1E2D22] hover:bg-[#C85A32] text-white py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8E7B6C]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>100% Encrypted & Authenticity Guaranteed</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
