import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ExternalLink,
  MessageCircle,
  Mail,
  Calendar,
  CheckCircle2,
  DollarSign,
  PackageCheck,
  Eye,
  X,
  FileText,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CustomPaintingRequest, CustomRequestStatus, Order } from '../../types';

interface AdminCustomRequestsTabProps {
  onOpenOrder?: (order: Order) => void;
}

export const AdminCustomRequestsTab: React.FC<AdminCustomRequestsTabProps> = ({ onOpenOrder }) => {
  const {
    customRequests,
    updateCustomRequestStatus,
    convertCustomToOrder,
    showToast,
  } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReq, setSelectedReq] = useState<CustomPaintingRequest | null>(null);

  // Quote Editing
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState<number>(3500);
  const [estDays, setEstDays] = useState<number>(14);
  const [adminNotes, setAdminNotes] = useState('');

  // Status List
  const ALL_STATUSES: CustomRequestStatus[] = [
    'New Request',
    'Under Discussion',
    'Quotation Sent',
    'Awaiting Approval',
    'Order Confirmed',
    'Painting in Progress',
    'Quality Check',
    'Ready for Dispatch',
    'Shipped',
    'Completed',
    'Cancelled',
  ];

  const handleOpenDetail = (req: CustomPaintingRequest) => {
    setSelectedReq(req);
    setQuoteAmount(req.quotationAmount || 3500);
    setEstDays(req.estimatedDays || 14);
    setAdminNotes(req.adminNotes || '');
    setIsEditingQuote(false);
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    updateCustomRequestStatus(
      selectedReq.id,
      selectedReq.status === 'New Request' ? 'Quotation Sent' : selectedReq.status,
      Number(quoteAmount),
      adminNotes.trim(),
      Number(estDays)
    );

    setSelectedReq((prev) =>
      prev
        ? {
            ...prev,
            quotationAmount: Number(quoteAmount),
            estimatedDays: Number(estDays),
            adminNotes: adminNotes.trim(),
            status: prev.status === 'New Request' ? 'Quotation Sent' : prev.status,
          }
        : null
    );

    setIsEditingQuote(false);
    showToast('Quotation Saved', `Quotation of ₹${quoteAmount.toLocaleString('en-IN')} updated for ${selectedReq.customerName}.`);
  };

  const handleConvertToOrder = () => {
    if (!selectedReq) return;
    const newOrder = convertCustomToOrder(selectedReq.id);
    if (newOrder && onOpenOrder) {
      setSelectedReq(null);
      onOpenOrder(newOrder);
    }
  };

  const handleStatusChange = (newStatus: CustomRequestStatus) => {
    if (!selectedReq) return;
    updateCustomRequestStatus(selectedReq.id, newStatus, selectedReq.quotationAmount, selectedReq.adminNotes, selectedReq.estimatedDays);
    setSelectedReq((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  const filteredRequests = customRequests.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        r.id.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.mobile.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.theme.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== 'all' && r.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#1E2D22]">
            Custom Mithila Painting Commissions
          </h3>
          <p className="text-xs text-[#8E7B6C]">
            Direct patron custom briefs, custom dimensions, reference artworks, quote approvals, and artisan production pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EAE3D5] text-xs font-semibold text-[#1E2D22]">
            Total Inquiries: {customRequests.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3D5] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Request ID, customer name, mobile, theme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl text-xs text-[#1E2D22] focus:outline-none focus:border-[#C85A32]"
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#FAF7F2] border border-[#E5DAC8] text-xs text-[#1E2D22] rounded-xl px-3 py-2 outline-none cursor-pointer"
        >
          <option value="all">All Request Statuses</option>
          {ALL_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

      </div>

      {/* Requests Grid / Table */}
      <div className="bg-white rounded-3xl border border-[#EAE3D5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EAE3D5] text-[#8E7B6C] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Theme & Requirements</th>
                <th className="py-3 px-3">Budget & Deadline</th>
                <th className="py-3 px-3">Quotation (₹)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6]">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No custom painting requests match your query.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1E2D22]">
                      #{req.id}
                      <span className="text-[10px] text-gray-400 block font-sans font-normal">
                        {req.createdAt}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-sm text-[#1E2D22] block">
                        {req.customerName}
                      </span>
                      <span className="text-[11px] text-[#6B5B4E] block">{req.mobile}</span>
                      <span className="text-[10px] text-gray-400 block">{req.email}</span>
                    </td>

                    {/* Theme */}
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-[#1E2D22] block line-clamp-1">
                        {req.theme}
                      </span>
                      <span className="text-[11px] text-[#8E7B6C] line-clamp-1">
                        {req.preferredSize} · {req.preferredColors}
                      </span>
                    </td>

                    {/* Budget & Date */}
                    <td className="py-3.5 px-3">
                      <span className="font-medium text-[#1E2D22] block">{req.budget}</span>
                      <span className="text-[10px] text-gray-500">Need by: {req.deliveryDate || 'Flexible'}</span>
                    </td>

                    {/* Quotation */}
                    <td className="py-3.5 px-3 font-mono font-bold text-[#1E2D22]">
                      {req.quotationAmount ? (
                        <span className="text-emerald-700">₹{req.quotationAmount.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-gray-400 italic font-sans font-normal text-[11px]">Unquoted</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : req.status === 'Order Confirmed' || req.status === 'Painting in Progress'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : req.status === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(req)}
                        className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE3D5] text-[#1E2D22] rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL FOR CUSTOM COMMISSION */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E5DAC8] my-6 max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[#EAE3D5] flex items-center justify-between bg-[#1E2D22] text-[#FAF7F2]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D4943E] text-[#1E2D22] flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-wide">
                    Custom Brief #{selectedReq.id}
                  </h3>
                  <p className="text-xs text-[#D3C7B5]">
                    Commissioned by {selectedReq.customerName} on {selectedReq.createdAt}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedReq(null)}
                className="p-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-xs text-[#2E251E]">
              
              {/* Status Pipeline Step Selector */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[#1E2D22]">
                    Commission Progress Stage
                  </span>
                  <span className="font-bold text-[#C85A32]">{selectedReq.status}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ALL_STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                        selectedReq.status === st
                          ? 'bg-[#1E2D22] text-white shadow-xs'
                          : 'bg-white border border-[#E5DAC8] text-[#6B5B4E] hover:border-[#1E2D22]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Customer Info & Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Patron Details */}
                <div className="p-4 bg-white rounded-2xl border border-[#EAE3D5] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E7B6C] block">
                    Patron Details
                  </span>
                  <div className="font-semibold text-sm text-[#1E2D22]">{selectedReq.customerName}</div>
                  <div className="text-[#55473A] space-y-0.5">
                    <div><span className="font-medium">Mobile:</span> {selectedReq.mobile}</div>
                    <div><span className="font-medium">Email:</span> {selectedReq.email}</div>
                    <div><span className="font-medium">Delivery Destination:</span> {selectedReq.deliveryAddress}</div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <a
                      href={`https://wa.me/${selectedReq.mobile.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedReq.customerName)},%20greetings%20from%20RANGIKA%20Mithila%20Art.%20Regarding%20your%20custom%20painting%20request%20%23${selectedReq.id}:`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>WhatsApp Patron</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={`mailto:${selectedReq.email}?subject=RANGIKA Custom Painting Quotation %23${selectedReq.id}`}
                      className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Send Email</span>
                    </a>
                  </div>
                </div>

                {/* Brief & Dimensions */}
                <div className="p-4 bg-white rounded-2xl border border-[#EAE3D5] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E7B6C] block">
                    Artwork Specification
                  </span>
                  <div>
                    <span className="font-semibold text-gray-500">Theme:</span>
                    <p className="font-bold text-sm text-[#1E2D22] mt-0.5">{selectedReq.theme}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[#55473A] pt-1">
                    <div><span className="font-semibold text-gray-500">Dimensions:</span> {selectedReq.preferredSize}</div>
                    <div><span className="font-semibold text-gray-500">Quantity:</span> {selectedReq.quantity}</div>
                    <div><span className="font-semibold text-gray-500">Color Palette:</span> {selectedReq.preferredColors}</div>
                    <div><span className="font-semibold text-gray-500">Material:</span> {selectedReq.materialPreference}</div>
                    <div><span className="font-semibold text-gray-500">Framing:</span> {selectedReq.framingPreference}</div>
                    <div><span className="font-semibold text-gray-500">Target Date:</span> {selectedReq.deliveryDate || 'Flexible'}</div>
                  </div>
                </div>

              </div>

              {/* Requirements & Description */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D5] space-y-2">
                <span className="font-bold uppercase tracking-wider text-[#1E2D22] block">
                  Detailed Painting Requirements & Instructions
                </span>
                <p className="text-sm text-[#3E342B] leading-relaxed bg-white p-3.5 rounded-xl border border-[#E5DAC8]">
                  {selectedReq.designRequirements}
                </p>
                {selectedReq.additionalInstructions && (
                  <p className="text-xs text-[#6B5B4E] italic pt-1">
                    Note: "{selectedReq.additionalInstructions}"
                  </p>
                )}
              </div>

              {/* Reference Image If Provided */}
              {selectedReq.referenceImage && (
                <div className="p-4 bg-white rounded-2xl border border-[#EAE3D5] space-y-2">
                  <span className="font-bold uppercase tracking-wider text-[#1E2D22] block">
                    Customer Reference Image
                  </span>
                  <div className="max-w-xs rounded-xl overflow-hidden border border-[#EAE3D5]">
                    <img
                      src={selectedReq.referenceImage}
                      alt="Reference"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Quotation & Artisan Production Management Box */}
              <div className="p-5 bg-white rounded-2xl border-2 border-[#D4943E] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#C85A32]" />
                    <span className="font-serif text-base font-bold text-[#1E2D22]">
                      Artisan Atelier Quotation
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedReq.convertedOrderId ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Converted to Order #{selectedReq.convertedOrderId}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConvertToOrder}
                        className="px-4 py-1.5 bg-[#C85A32] hover:bg-[#A94924] text-white rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Convert to Official Order</span>
                      </button>
                    )}
                  </div>
                </div>

                {isEditingQuote ? (
                  <form onSubmit={handleSaveQuote} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Quotation Amount (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min={500}
                        value={quoteAmount}
                        onChange={(e) => setQuoteAmount(Number(e.target.value))}
                        className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none text-sm font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Estimated Creation Lead Time (Days)
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={estDays}
                        onChange={(e) => setEstDays(Number(e.target.value))}
                        className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none text-sm font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Artisan Master Notes / Internal Instructions
                      </label>
                      <textarea
                        rows={2}
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="e.g. Master artisan Godavari Devi will execute center Kohbar with natural vermilion on Lokta paper..."
                        className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl p-2.5 outline-none text-xs"
                      />
                    </div>

                    <div className="sm:col-span-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingQuote(false)}
                        className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#1E2D22] text-white rounded-xl text-xs font-semibold hover:bg-[#2C3E30] transition-colors cursor-pointer"
                      >
                        Save Quotation
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE3D5]">
                    <div>
                      <span className="text-gray-500 text-[11px] block">Current Quotation:</span>
                      <span className="font-mono font-bold text-xl text-[#1E2D22]">
                        ₹{(selectedReq.quotationAmount || quoteAmount).toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-500 text-[11px] block mt-0.5">
                        Production Lead Time: ~{selectedReq.estimatedDays || 14} days
                      </span>
                      {selectedReq.adminNotes && (
                        <p className="text-xs text-[#55473A] mt-2 italic bg-white p-2 rounded-lg border border-[#E5DAC8]">
                          "{selectedReq.adminNotes}"
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingQuote(true)}
                      className="px-4 py-2 bg-white border border-[#E5DAC8] rounded-xl text-xs font-semibold text-[#1E2D22] hover:border-[#1E2D22] transition-colors cursor-pointer"
                    >
                      Update Quotation & Notes
                    </button>
                  </div>
                )}

              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#EAE3D5] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="px-5 py-2 bg-[#1E2D22] text-white rounded-xl text-xs font-semibold hover:bg-[#2C3E30] transition-colors cursor-pointer"
              >
                Close Brief
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
