import React, { useState } from 'react';
import {
  Users,
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  Package,
  Calendar,
  IndianRupee,
  ExternalLink,
  X,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CustomerRecord, Order } from '../../types';

interface AdminCustomersTabProps {
  onOpenOrder: (order: Order) => void;
  onOpenInvoice: (order: Order) => void;
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({
  onOpenOrder,
  onOpenInvoice,
}) => {
  const { customers } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.addresses.some((a) => a.city.toLowerCase().includes(q) || a.state.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#1E2D22]">
            Patron & Collector CRM
          </h3>
          <p className="text-xs text-[#8E7B6C]">
            Verified customer profiles, acquisition histories, and lifetime order analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EAE3D5] text-xs font-semibold text-[#1E2D22]">
            Total Patrons: {customers.length}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3D5] flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patron name, email address, mobile number, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl text-xs text-[#1E2D22] focus:outline-none focus:border-[#C85A32]"
          />
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-3xl border border-[#EAE3D5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EAE3D5] text-[#8E7B6C] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-3">Contact Details</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-center">Total Orders</th>
                <th className="py-3 px-3">Lifetime Value</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No patrons match your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1E2D22] text-[#D4943E] font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-[#1E2D22] block">
                            {c.name}
                          </span>
                          <span className="text-[10px] text-gray-400">Patron ID: {c.id.slice(-8)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-3">
                      <span className="text-xs font-medium text-[#1E2D22] block">{c.phone}</span>
                      <span className="text-[11px] text-[#6B5B4E] block">{c.email}</span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-3">
                      {c.addresses[0] ? (
                        <span className="text-[#55473A] block">
                          {c.addresses[0].city}, {c.addresses[0].state}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not recorded</span>
                      )}
                    </td>

                    {/* Orders count */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold text-xs border border-blue-200">
                        {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}
                      </span>
                    </td>

                    {/* Lifetime Value */}
                    <td className="py-3.5 px-3 font-mono font-bold text-sm text-[#1E2D22]">
                      ₹{c.totalSpent.toLocaleString('en-IN')}
                    </td>

                    {/* Last active */}
                    <td className="py-3.5 px-3 text-[#6B5B4E]">
                      {c.lastOrderDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE3D5] text-[#1E2D22] rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Drilldown</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER DETAIL PROFILE MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E5DAC8] my-6 max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[#EAE3D5] flex items-center justify-between bg-[#1E2D22] text-[#FAF7F2]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D4943E] text-[#1E2D22] flex items-center justify-center font-bold text-base font-serif">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-wide">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-[#D3C7B5]">
                    Member since {selectedCustomer.firstOrderDate} · Total Spent: ₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-xs text-[#2E251E]">
              
              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D5] space-y-1.5">
                  <span className="font-bold uppercase tracking-wider text-[#8E7B6C] block">
                    Contact Channels
                  </span>
                  <div><span className="font-semibold">Mobile:</span> {selectedCustomer.phone}</div>
                  <div><span className="font-semibold">Email:</span> {selectedCustomer.email}</div>
                  <div className="pt-2 flex gap-2">
                    <a
                      href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1"
                    >
                      <span>WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={`mailto:${selectedCustomer.email}`}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold hover:bg-gray-200"
                    >
                      Email Patron
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D5] space-y-1.5">
                  <span className="font-bold uppercase tracking-wider text-[#8E7B6C] block">
                    Recorded Addresses
                  </span>
                  {selectedCustomer.addresses.map((addr, idx) => (
                    <p key={idx} className="text-[#55473A] leading-relaxed">
                      {addr.street}<br />
                      {addr.city}, {addr.state} {addr.postalCode ? `- ${addr.postalCode}` : ''}
                    </p>
                  ))}
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-[#1E2D22]">
                  Acquisition History ({selectedCustomer.orders.length})
                </h4>

                {selectedCustomer.orders.length === 0 ? (
                  <p className="text-gray-400 italic">No completed orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedCustomer.orders.map((o) => (
                      <div
                        key={o.id}
                        className="p-4 bg-white rounded-2xl border border-[#EAE3D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#1E2D22]">#{o.id}</span>
                            <span className="text-[10px] text-gray-400">{o.createdAt}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-[#1E2D22]">
                              {o.orderStatus}
                            </span>
                          </div>
                          <div className="text-[#6B5B4E] mt-1">
                            {o.items.map((i) => `${i.title} (x${i.quantity})`).join(', ')}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="font-mono font-bold text-sm text-[#1E2D22]">
                            ₹{o.total.toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedCustomer(null);
                              onOpenOrder(o);
                            }}
                            className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE3D5] rounded-xl text-xs font-semibold text-[#1E2D22] transition-colors cursor-pointer"
                          >
                            View Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Painting Inquiries */}
              {selectedCustomer.customRequests.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-[#EAE3D5]">
                  <h4 className="font-bold uppercase tracking-wider text-[#1E2D22]">
                    Custom Painting Requests ({selectedCustomer.customRequests.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedCustomer.customRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE3D5] flex items-center justify-between"
                      >
                        <div>
                          <span className="font-semibold text-[#1E2D22] block">#{req.id} · {req.theme}</span>
                          <span className="text-[11px] text-[#6B5B4E]">Status: {req.status} · Budget: {req.budget}</span>
                        </div>
                        {req.quotationAmount && (
                          <span className="font-mono font-bold text-xs text-[#1E2D22]">
                            Quote: ₹{req.quotationAmount.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#EAE3D5] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-[#1E2D22] text-white rounded-xl text-xs font-semibold hover:bg-[#2C3E30] transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
