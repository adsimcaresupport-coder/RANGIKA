import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';

interface AdminInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const AdminInvoiceModal: React.FC<AdminInvoiceModalProps> = ({ order, onClose }) => {
  const { cmsContent } = useStore();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = order.invoiceNumber || `INV-2026-${order.id.replace(/[^0-9]/g, '').slice(-3) || '101'}`;
  const invoiceDate = order.createdAt || new Date().toISOString().split('T')[0];

  // GST Breakdown (Fine art HSN 9701 in India is typically 12% GST: 6% CGST + 6% SGST, or included in MRP)
  const gstRate = 0.12;
  const taxableBase = Math.round(order.total / (1 + gstRate));
  const totalGst = order.total - taxableBase;
  const cgst = Math.round(totalGst / 2);
  const sgst = totalGst - cgst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E5DAC8] my-6 max-h-[94vh] flex flex-col">
        
        {/* Top Control Bar (Hidden during printing) */}
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-[#1E2D22] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-serif text-lg sm:text-xl font-medium tracking-wide">
              Official Tax Invoice · {invoiceNumber}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D4943E]/20 text-[#E5B869] border border-[#D4943E]/30">
              Order #{order.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#D4943E] hover:bg-[#C85A32] text-[#1E2D22] hover:text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
              title="Print Invoice"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              title="Save as PDF via browser print"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-300 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white text-[#1E2D22] font-sans print:p-0 print:overflow-visible">
          
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-[#1E2D22]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-3xl sm:text-4xl tracking-[0.16em] font-bold text-[#1E2D22]">
                  RANGIKA
                </span>
                <span className="w-2 h-2 rounded-full bg-[#C85A32]"></span>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8E7B6C] mt-0.5">
                Authentic Mithila & Madhubani Fine Art Atelier
              </p>
              <p className="text-xs text-[#55473A] mt-2 max-w-sm leading-relaxed">
                {cmsContent.studioAddress}
              </p>
              <div className="text-xs text-[#55473A] mt-1 space-y-0.5">
                <p><span className="font-semibold">GSTIN:</span> {cmsContent.gstin} | <span className="font-semibold">PAN:</span> {cmsContent.pan}</p>
                <p><span className="font-semibold">Email:</span> {cmsContent.businessEmail} | <span className="font-semibold">Support:</span> {cmsContent.businessPhone}</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-[#F4EFE6] text-[#1E2D22] text-xs font-bold uppercase tracking-wider rounded-md mb-2">
                Tax Invoice
              </span>
              <table className="text-xs text-[#55473A] sm:ml-auto">
                <tbody>
                  <tr>
                    <td className="font-semibold pr-3 py-0.5 sm:text-right">Invoice No:</td>
                    <td className="font-mono font-bold text-[#1E2D22]">{invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-3 py-0.5 sm:text-right">Invoice Date:</td>
                    <td>{invoiceDate}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-3 py-0.5 sm:text-right">Order ID:</td>
                    <td className="font-bold text-[#C85A32]">#{order.id}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-3 py-0.5 sm:text-right">Payment Mode:</td>
                    <td>{order.paymentMethod} ({order.paymentStatus})</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-gray-200 text-xs">
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE3D5]">
              <h4 className="font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5 flex items-center gap-1.5">
                <span>Billed & Shipped To:</span>
              </h4>
              <p className="font-bold text-sm text-[#1E2D22]">{order.customerName}</p>
              <p className="text-[#55473A] mt-1 leading-relaxed">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
              <p className="text-[#55473A] mt-2">
                <span className="font-semibold">Phone:</span> {order.phone}<br />
                <span className="font-semibold">Email:</span> {order.email}
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE3D5]">
              <h4 className="font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1.5">
                Shipping & Verification:
              </h4>
              <p className="text-[#55473A]"><span className="font-semibold">Courier Partner:</span> {order.courierPartner || order.shippingDetails?.courierPartner || 'Delhivery Art Express'}</p>
              <p className="text-[#55473A] mt-0.5"><span className="font-semibold">Tracking Number:</span> {order.trackingNumber || order.shippingDetails?.trackingNumber || 'Assigned at dispatch'}</p>
              <p className="text-[#55473A] mt-0.5"><span className="font-semibold">HSN Code:</span> 9701 (Original Paintings, Drawings & Pastels Hand-executed)</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payment {order.paymentStatus} · Heritage Origin Certified</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[#1E2D22] text-[#1E2D22] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5">#</th>
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5">HSN</th>
                  <th className="py-2.5">Framing & Size</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Rate</th>
                  <th className="py-2.5 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <tr key={item.id} className="text-[#3E342B]">
                    <td className="py-3 font-mono text-gray-500">{idx + 1}</td>
                    <td className="py-3 pr-2">
                      <span className="font-semibold text-[#1E2D22] block text-[13px]">{item.title}</span>
                      <span className="text-[11px] text-[#8E7B6C]">Authentic Mithila folk painting with natural mineral pigments</span>
                    </td>
                    <td className="py-3 font-mono text-gray-600">9701</td>
                    <td className="py-3 text-gray-700">
                      <div>{item.selectedSize}</div>
                      <div className="text-[10px] text-gray-500">{item.selectedFraming?.label || 'Teak Wood Frame'}</div>
                    </td>
                    <td className="py-3 text-center font-medium">{item.quantity}</td>
                    <td className="py-3 text-right font-mono">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right font-mono font-bold text-[#1E2D22]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Calculation & Tax Breakdown */}
          <div className="border-t-2 border-gray-200 pt-4 flex flex-col sm:flex-row justify-between items-start gap-6 text-xs">
            <div className="max-w-md space-y-2">
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE3D5]">
                <h5 className="font-semibold text-[#1E2D22] mb-1">Authenticity & Tax Declaration:</h5>
                <p className="text-[11px] text-[#6B5B4E] leading-relaxed">
                  We declare that this invoice shows the actual price of the authentic handcrafted Mithila artwork described and that all particulars are true and correct. Original Indian folk artworks created by hand fall under HSN 9701.
                </p>
              </div>
              <p className="text-[10px] text-gray-500 italic">
                * This is a computer-generated tax invoice with registered digital validation.
              </p>
            </div>

            <div className="w-full sm:w-72 space-y-1.5 font-sans">
              <div className="flex justify-between py-1 text-gray-600">
                <span>Subtotal (Gross):</span>
                <span className="font-mono">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between py-1 text-[#C85A32]">
                  <span>Discount Applied:</span>
                  <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between py-1 text-gray-600">
                <span>Insured Art Transit:</span>
                <span className="font-mono text-emerald-700 font-medium">
                  {order.shipping === 0 ? 'FREE (Complimentary)' : `₹${order.shipping}`}
                </span>
              </div>
              <div className="flex justify-between py-1 text-gray-500 text-[11px]">
                <span>Taxable Value:</span>
                <span className="font-mono">₹{taxableBase.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-500 text-[11px]">
                <span>Integrated GST (12% incl.):</span>
                <span className="font-mono">₹{totalGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2.5 border-t-2 border-[#1E2D22] text-[#1E2D22] font-bold text-base">
                <span>Total Amount:</span>
                <span className="font-mono text-[#1E2D22]">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Authorized Signatory */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-2 text-[#1E2D22]">
              <ShieldCheck className="w-5 h-5 text-[#D4943E]" />
              <span className="font-serif italic font-medium">Rooted in Heritage · Created by Hand · Made for Today</span>
            </div>

            <div className="text-right">
              <div className="h-10 border-b border-gray-300 w-44 mb-1">
                <span className="font-serif italic text-sm text-[#1E2D22] leading-loose">Vandana Jha</span>
              </div>
              <p className="font-semibold text-[#1E2D22]">Authorized Signatory</p>
              <p className="text-[10px] text-gray-500">For RANGIKA Mithila Atelier</p>
            </div>
          </div>

        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-[#F4EFE6] border-t border-[#EAE3D5] flex items-center justify-between text-xs text-[#6B5B4E] print:hidden">
          <span>Customer invoice copy for Order #{order.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1E2D22] text-white rounded-lg text-xs font-medium hover:bg-[#2C3E30] transition-colors cursor-pointer"
          >
            Close Invoice
          </button>
        </div>

      </div>
    </div>
  );
};
