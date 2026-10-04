import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Percent,
  IndianRupee,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';

export const AdminCouponsTab: React.FC = () => {
  const {
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponActive,
    showToast,
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minOrderValue, setMinOrderValue] = useState<number>(2000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]
  );
  const [usageLimit, setUsageLimit] = useState<number>(200);
  const [description, setDescription] = useState('Festive celebratory discount on authentic Mithila art');
  const [isActive, setIsActive] = useState<boolean>(true);

  const handleOpenAdd = () => {
    setEditingCouponId(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(15);
    setMinOrderValue(2000);
    setStartDate(new Date().toISOString().split('T')[0]);
    setExpiryDate(new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]);
    setUsageLimit(200);
    setDescription('Festive celebratory discount on authentic Mithila art');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCouponId(c.id);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountValue(c.discountValue);
    setMinOrderValue(c.minOrderValue);
    setStartDate(c.startDate);
    setExpiryDate(c.expiryDate);
    setUsageLimit(c.usageLimit);
    setDescription(c.description);
    setIsActive(c.isActive);
    setIsModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('Validation Error', 'Coupon code is required', 'error');
      return;
    }

    const payload = {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue),
      startDate,
      expiryDate,
      usageLimit: Number(usageLimit),
      eligibleCategories: ['all'],
      isActive,
      description: description.trim(),
    };

    if (editingCouponId) {
      updateCoupon(editingCouponId, payload);
    } else {
      addCoupon(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#1E2D22]">
            Coupons, Offers & Festive Promotions
          </h3>
          <p className="text-xs text-[#8E7B6C]">
            Create and monitor voucher codes applied by patrons during online checkout.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C85A32] hover:bg-[#A94924] text-white rounded-2xl text-xs font-semibold tracking-wider transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Coupon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map((c) => {
          const isExpired = new Date().toISOString().split('T')[0] > c.expiryDate;

          return (
            <div
              key={c.id}
              className={`bg-white rounded-3xl p-6 border transition-all shadow-xs relative overflow-hidden flex flex-col justify-between ${
                c.isActive && !isExpired
                  ? 'border-[#EAE3D5] hover:border-[#C85A32]'
                  : 'border-gray-200 opacity-60 bg-gray-50'
              }`}
            >
              <div>
                {/* Top Badge & Code */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono font-bold text-base px-3 py-1 bg-[#FAF7F2] border border-[#E5DAC8] text-[#1E2D22] rounded-xl tracking-wider">
                    {c.code}
                  </span>
                  <button
                    onClick={() => toggleCouponActive(c.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                      c.isActive && !isExpired
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isExpired ? 'Expired' : c.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>

                {/* Discount Display */}
                <div className="flex items-baseline gap-1 my-2">
                  <span className="font-serif text-3xl font-bold text-[#C85A32]">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                  </span>
                </div>

                <p className="text-xs text-[#55473A] mb-3 leading-relaxed">
                  {c.description}
                </p>

                {/* Details list */}
                <div className="space-y-1 text-[11px] text-[#6B5B4E] pt-2 border-t border-[#F4EFE6]">
                  <div>Min. Order Value: <strong className="text-[#1E2D22]">₹{c.minOrderValue.toLocaleString('en-IN')}</strong></div>
                  <div>Valid: <span className="font-mono">{c.startDate}</span> to <span className="font-mono">{c.expiryDate}</span></div>
                  <div>Redemptions: <strong className="font-mono text-[#1E2D22]">{c.usageCount}</strong> / {c.usageLimit} uses</div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-[#F4EFE6]">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE3D5] text-[#1E2D22] rounded-xl text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => deleteCoupon(c.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT COUPON MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-[#E5DAC8] shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-3">
              <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
                {editingCouponId ? 'Edit Discount Coupon' : 'Create Promotional Coupon'}
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Coupon Voucher Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20 or DIWALI500"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full uppercase font-mono font-bold text-sm bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full font-mono font-bold text-sm bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Minimum Order Value (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  className="w-full font-mono bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Usage Limit (Total Times)
                </label>
                <input
                  type="number"
                  min={1}
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Promotion Tagline / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15% festive celebration discount on orders above ₹2,000"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#C85A32] rounded cursor-pointer"
                />
                <span className="font-semibold text-[#1E2D22]">Active and ready to apply at checkout</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE3D5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E2D22] text-white rounded-xl text-xs font-semibold hover:bg-[#2C3E30] transition-colors cursor-pointer shadow-sm"
                >
                  Save Coupon
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
