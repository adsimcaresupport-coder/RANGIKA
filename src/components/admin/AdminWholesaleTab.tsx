import React, { useState } from 'react';
import {
  Building2,
  Search,
  ExternalLink,
  MessageCircle,
  Mail,
  Download,
  CheckCircle2,
  Clock,
  Plus,
  Eye,
  X,
  FileSpreadsheet,
  PackageCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { WholesaleEnquiry, WholesaleStatus, Order } from '../../types';

interface AdminWholesaleTabProps {
  onOpenOrder?: (order: Order) => void;
}

export const AdminWholesaleTab: React.FC<AdminWholesaleTabProps> = ({ onOpenOrder }) => {
  const {
    wholesaleEnquiries,
    updateWholesaleStatus,
    addWholesaleNote,
    convertWholesaleToOrder,
    showToast,
  } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<WholesaleEnquiry | null>(null);

  // New Note
  const [noteText, setNoteText] = useState('');

  // Quotation edit
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState<number>(200000);

  const ALL_STATUSES: WholesaleStatus[] = [
    'New',
    'Contacted',
    'Discussion in Progress',
    'Quotation Sent',
    'Negotiation',
    'Order Confirmed',
    'Closed',
  ];

  const handleOpenDetail = (w: WholesaleEnquiry) => {
    setSelectedEnquiry(w);
    setQuoteAmount(w.quotationAmount || 150000);
    setIsEditingQuote(false);
    setNoteText('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !noteText.trim()) return;

    addWholesaleNote(selectedEnquiry.id, noteText.trim());
    setSelectedEnquiry((prev) =>
      prev
        ? {
            ...prev,
            internalNotes: [
              {
                id: `wn-${Date.now()}`,
                note: noteText.trim(),
                author: 'Vandana Jha (Owner)',
                date: new Date().toISOString().split('T')[0],
              },
              ...(prev.internalNotes || []),
            ],
          }
        : null
    );
    setNoteText('');
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    updateWholesaleStatus(selectedEnquiry.id, 'Quotation Sent', Number(quoteAmount));
    setSelectedEnquiry((prev) =>
      prev
        ? {
            ...prev,
            status: 'Quotation Sent',
            quotationAmount: Number(quoteAmount),
          }
        : null
    );
    setIsEditingQuote(false);
    showToast('Quote Saved', `Wholesale proposal of ₹${quoteAmount.toLocaleString('en-IN')} updated for ${selectedEnquiry.businessName}.`);
  };

  const handleStatusChange = (newStatus: WholesaleStatus) => {
    if (!selectedEnquiry) return;
    updateWholesaleStatus(selectedEnquiry.id, newStatus, selectedEnquiry.quotationAmount);
    setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  const handleConvertToOrder = () => {
    if (!selectedEnquiry) return;
    const newOrder = convertWholesaleToOrder(selectedEnquiry.id);
    if (newOrder && onOpenOrder) {
      setSelectedEnquiry(null);
      onOpenOrder(newOrder);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Enquiry ID',
      'Business Name',
      'Contact Person',
      'Phone',
      'Email',
      'Business Type',
      'Required Quantity',
      'Budget',
      'Location',
      'Status',
      'Quotation Amount',
      'Date',
    ];

    const rows = wholesaleEnquiries.map((w) => [
      w.id,
      `"${w.businessName.replace(/"/g, '""')}"`,
      `"${w.contactPerson.replace(/"/g, '""')}"`,
      w.phone,
      w.email,
      `"${w.businessType}"`,
      w.requiredQuantity,
      `"${w.budget}"`,
      `"${w.deliveryLocation}"`,
      w.status,
      w.quotationAmount || '',
      w.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RANGIKA_Wholesale_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported', 'Wholesale enquiry records exported successfully.');
  };

  const filteredEnquiries = wholesaleEnquiries.filter((w) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        w.id.toLowerCase().includes(q) ||
        w.businessName.toLowerCase().includes(q) ||
        w.contactPerson.toLowerCase().includes(q) ||
        w.phone.toLowerCase().includes(q) ||
        w.email.toLowerCase().includes(q) ||
        w.businessType.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== 'all' && w.status !== statusFilter) {
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
            Wholesale, Hospitality & Corporate B2B
          </h3>
          <p className="text-xs text-[#8E7B6C]">
            Manage bulk consignments for art galleries, interior designers, heritage luxury hotels, and corporate gifting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#EAE3D5] hover:border-[#1E2D22] text-[#1E2D22] rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <span className="px-3 py-2 rounded-xl bg-white border border-[#EAE3D5] text-xs font-semibold text-[#1E2D22]">
            Total Inquiries: {wholesaleEnquiries.length}
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3D5] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by business name, contact person, phone, email, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl text-xs text-[#1E2D22] focus:outline-none focus:border-[#C85A32]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#FAF7F2] border border-[#E5DAC8] text-xs text-[#1E2D22] rounded-xl px-3 py-2 outline-none cursor-pointer"
        >
          <option value="all">All Pipeline Stages</option>
          {ALL_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-3xl border border-[#EAE3D5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EAE3D5] text-[#8E7B6C] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Business Client</th>
                <th className="py-3 px-3">Contact Person</th>
                <th className="py-3 px-3">Business Domain</th>
                <th className="py-3 px-3 text-center">Volume (Pcs)</th>
                <th className="py-3 px-3">Budget</th>
                <th className="py-3 px-3">Quotation (₹)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6]">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No wholesale enquiries match your query.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((w) => (
                  <tr key={w.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* Business Name */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-sm text-[#1E2D22] block">
                        {w.businessName}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">#{w.id} · {w.createdAt}</span>
                    </td>

                    {/* Contact Person */}
                    <td className="py-3.5 px-3">
                      <span className="font-medium text-[#1E2D22] block">{w.contactPerson}</span>
                      <span className="text-[11px] text-[#6B5B4E] block">{w.phone}</span>
                      <span className="text-[10px] text-gray-400 block">{w.email}</span>
                    </td>

                    {/* Domain */}
                    <td className="py-3.5 px-3">
                      <span className="text-[#1E2D22] font-medium block">{w.businessType}</span>
                      <span className="text-[10px] text-gray-500">{w.deliveryLocation}</span>
                    </td>

                    {/* Quantity */}
                    <td className="py-3.5 px-3 text-center font-bold font-mono text-sm text-[#1E2D22]">
                      {w.requiredQuantity}
                    </td>

                    {/* Budget */}
                    <td className="py-3.5 px-3 font-medium text-[#1E2D22]">
                      {w.budget}
                    </td>

                    {/* Quotation */}
                    <td className="py-3.5 px-3 font-mono font-bold text-[#1E2D22]">
                      {w.quotationAmount ? (
                        <span className="text-emerald-700">₹{w.quotationAmount.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-gray-400 italic font-sans font-normal text-[11px]">Unquoted</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          w.status === 'Order Confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : w.status === 'Quotation Sent' || w.status === 'Negotiation'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : w.status === 'Closed'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(w)}
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

      {/* DETAIL MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E5DAC8] my-6 max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[#EAE3D5] flex items-center justify-between bg-[#1E2D22] text-[#FAF7F2]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D4943E] text-[#1E2D22] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-wide">
                    {selectedEnquiry.businessName}
                  </h3>
                  <p className="text-xs text-[#D3C7B5]">
                    Enquiry #{selectedEnquiry.id} · Received {selectedEnquiry.createdAt}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-xs text-[#2E251E]">
              
              {/* Pipeline Status Selector */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[#1E2D22]">
                    B2B Pipeline Status
                  </span>
                  <span className="font-bold text-[#C85A32]">{selectedEnquiry.status}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ALL_STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                        selectedEnquiry.status === st
                          ? 'bg-[#1E2D22] text-white shadow-xs'
                          : 'bg-white border border-[#E5DAC8] text-[#6B5B4E] hover:border-[#1E2D22]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Business Details & Scope */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 bg-white rounded-2xl border border-[#EAE3D5] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E7B6C] block">
                    Business Profile
                  </span>
                  <div className="font-semibold text-sm text-[#1E2D22]">{selectedEnquiry.businessName}</div>
                  <div className="text-[#55473A] space-y-0.5">
                    <div><span className="font-medium">Contact Person:</span> {selectedEnquiry.contactPerson}</div>
                    <div><span className="font-medium">Industry:</span> {selectedEnquiry.businessType}</div>
                    <div><span className="font-medium">Mobile:</span> {selectedEnquiry.phone}</div>
                    <div><span className="font-medium">Email:</span> {selectedEnquiry.email}</div>
                    <div><span className="font-medium">Delivery Hub:</span> {selectedEnquiry.deliveryLocation}</div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <a
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedEnquiry.contactPerson)},%20greetings%20from%20RANGIKA%20Mithila%20Art.%20Regarding%20your%20wholesale%20consignment%20inquiry%20%23${selectedEnquiry.id}:`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>WhatsApp Partner</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={`mailto:${selectedEnquiry.email}?subject=RANGIKA B2B Wholesale Proposal %23${selectedEnquiry.id}`}
                      className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Email Partner</span>
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#EAE3D5] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E7B6C] block">
                    Consignment Scope & Budget
                  </span>
                  <div className="space-y-1.5 text-[#55473A]">
                    <div><span className="font-semibold text-gray-700">Required Quantity:</span> <strong className="text-base text-[#1E2D22] font-mono">{selectedEnquiry.requiredQuantity} Paintings</strong></div>
                    <div><span className="font-semibold text-gray-700">Client Budget:</span> <strong className="text-sm text-[#1E2D22]">{selectedEnquiry.budget}</strong></div>
                    <div><span className="font-semibold text-gray-700">Preferred Categories:</span> {selectedEnquiry.categories?.join(', ') || 'General Mithila Selection'}</div>
                    <div className="pt-1">
                      <span className="font-semibold text-gray-700 block">Specific Requirements:</span>
                      <p className="mt-1 p-2 bg-[#FAF7F2] rounded-xl border border-[#E5DAC8] text-[#3E342B]">
                        {selectedEnquiry.additionalRequirements || 'Standard framed gallery pieces with certificates.'}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Quotation & Conversion Box */}
              <div className="p-5 bg-white rounded-2xl border-2 border-[#1E2D22] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base font-bold text-[#1E2D22]">
                    Wholesale Commercial Quotation
                  </span>

                  <div>
                    {selectedEnquiry.convertedOrderId ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Converted to B2B Order #{selectedEnquiry.convertedOrderId}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConvertToOrder}
                        className="px-4 py-1.5 bg-[#1E2D22] hover:bg-[#2C3E30] text-white rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <PackageCheck className="w-4 h-4 text-[#D4943E]" />
                        <span>Convert to Confirmed B2B Order</span>
                      </button>
                    )}
                  </div>
                </div>

                {isEditingQuote ? (
                  <form onSubmit={handleSaveQuote} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Commercial Quotation (₹ Total Consignment)
                      </label>
                      <input
                        type="number"
                        min={1000}
                        value={quoteAmount}
                        onChange={(e) => setQuoteAmount(Number(e.target.value))}
                        className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none font-mono text-sm font-bold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#1E2D22] text-white rounded-xl text-xs font-semibold hover:bg-[#2C3E30] cursor-pointer"
                    >
                      Save Quote
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingQuote(false)}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE3D5]">
                    <div>
                      <span className="text-gray-500 text-[11px] block">Recorded Quotation:</span>
                      <span className="font-mono font-bold text-xl text-[#1E2D22]">
                        {selectedEnquiry.quotationAmount
                          ? `₹${selectedEnquiry.quotationAmount.toLocaleString('en-IN')}`
                          : 'Not quoted yet'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingQuote(true)}
                      className="px-4 py-2 bg-white border border-[#E5DAC8] rounded-xl text-xs font-semibold text-[#1E2D22] hover:border-[#1E2D22] cursor-pointer"
                    >
                      Update Quotation
                    </button>
                  </div>
                )}
              </div>

              {/* Internal Notes Timeline */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D5] space-y-3">
                <span className="font-bold uppercase tracking-wider text-[#1E2D22] block">
                  Internal Notes & Relationship Timeline
                </span>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add meeting notes, discount agreements, or courier discussions..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="flex-1 bg-white border border-[#E5DAC8] rounded-xl px-3.5 py-2 outline-none text-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1E2D22] text-white rounded-xl text-xs font-semibold hover:bg-[#2C3E30] transition-colors cursor-pointer"
                  >
                    Add Note
                  </button>
                </form>

                <div className="space-y-2 pt-2">
                  {(!selectedEnquiry.internalNotes || selectedEnquiry.internalNotes.length === 0) ? (
                    <p className="text-gray-400 italic text-[11px]">No internal notes recorded yet.</p>
                  ) : (
                    selectedEnquiry.internalNotes.map((n) => (
                      <div key={n.id} className="p-3 bg-white rounded-xl border border-[#E5DAC8] text-xs">
                        <p className="text-[#2E251E]">{n.note}</p>
                        <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                          <span>By {n.author}</span>
                          <span>{n.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#EAE3D5] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2 bg-[#1E2D22] text-white rounded-xl text-xs font-semibold hover:bg-[#2C3E30] transition-colors cursor-pointer"
              >
                Close Partner View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
