import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Eye,
  FileText,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  X,
  CreditCard,
  MapPin,
  ExternalLink,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

interface AdminOrdersTabProps {
  onOpenInvoice: (order: Order) => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({ onOpenInvoice }) => {
  const {
    orders,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateOrderShipping,
    cancelOrder,
    showToast,
  } = useStore();

  // Search & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Selected Order for Review Drawer/Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Cancellation Modal
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Customer requested cancellation prior to dispatch');
  const [restoreStockOnCancel, setRestoreStockOnCancel] = useState(true);

  // Shipping Form State within Review
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [courierName, setCourierName] = useState('Delhivery Express Art Care');
  const [trackingNo, setTrackingNo] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [estDelivery, setEstDelivery] = useState('');

  // Payment Verification State
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentStatusOption, setPaymentStatusOption] = useState<Order['paymentStatus']>('Paid');
  const [paymentRefNumber, setPaymentRefNumber] = useState('');

  // Open Review Drawer
  const handleOpenReview = (order: Order) => {
    setSelectedOrder(order);
    setCourierName(order.courierPartner || order.shippingDetails?.courierPartner || 'Delhivery Express Art Care');
    setTrackingNo(order.trackingNumber || order.shippingDetails?.trackingNumber || '');
    setTrackingUrl(order.shippingDetails?.trackingUrl || '');
    setEstDelivery(order.shippingDetails?.estimatedDelivery || '');
    setPaymentStatusOption(order.paymentStatus);
    setPaymentRefNumber(order.paymentDetails?.transactionRef || '');
    setIsEditingShipping(false);
    setIsVerifyingPayment(false);
  };

  // Status transitions
  const handleQuickStatusChange = (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === 'Cancelled') {
      const target = orders.find((o) => o.id === orderId);
      if (target) setCancelModalOrder(target);
      return;
    }
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
    }
  };

  // Save Shipping updates
  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    updateOrderShipping(selectedOrder.id, {
      courierPartner: courierName,
      trackingNumber: trackingNo,
      trackingUrl: trackingUrl || (trackingNo ? `https://www.delhivery.com/track/package/${trackingNo}` : undefined),
      dispatchDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: estDelivery,
    });

    setIsEditingShipping(false);
    // Update local modal state
    setSelectedOrder((prev) =>
      prev
        ? {
            ...prev,
            trackingNumber: trackingNo,
            courierPartner: courierName,
            shippingDetails: {
              courierPartner: courierName,
              trackingNumber: trackingNo,
              trackingUrl: trackingUrl,
              dispatchDate: new Date().toISOString().split('T')[0],
              estimatedDelivery: estDelivery,
            },
          }
        : null
    );
  };

  // Save Payment verification
  const handleSavePaymentStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    updateOrderPaymentStatus(selectedOrder.id, paymentStatusOption, paymentRefNumber);
    setIsVerifyingPayment(false);
    setSelectedOrder((prev) =>
      prev
        ? {
            ...prev,
            paymentStatus: paymentStatusOption,
            paymentDetails: {
              ...(prev.paymentDetails || { method: prev.paymentMethod, status: paymentStatusOption }),
              status: paymentStatusOption,
              transactionRef: paymentRefNumber,
            },
          }
        : null
    );
  };

  // Confirm Order Cancellation
  const handleConfirmCancellation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalOrder) return;

    cancelOrder(cancelModalOrder.id, cancelReason, restoreStockOnCancel);
    if (selectedOrder && selectedOrder.id === cancelModalOrder.id) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, orderStatus: 'Cancelled', cancellationReason: cancelReason } : null
      );
    }
    setCancelModalOrder(null);
  };

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        (o.invoiceNumber && o.invoiceNumber.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) {
      return false;
    }

    // Payment filter
    if (paymentFilter !== 'all' && o.paymentStatus !== paymentFilter) {
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
            Order Management & Fulfillment
          </h3>
          <p className="text-xs text-[#8E7B6C]">
            Review patron acquisitions, verify payment confirmations, assign couriers, and generate tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE3D5] font-semibold text-[#1E2D22]">
            Total Orders: {orders.length}
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
            placeholder="Search by Order ID, customer name, mobile, email, or invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl text-xs text-[#1E2D22] focus:outline-none focus:border-[#C85A32]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Order Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF7F2] border border-[#E5DAC8] text-xs text-[#1E2D22] rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Order Statuses</option>
            <option value="New Order">New Order</option>
            <option value="Order Confirmed">Order Confirmed</option>
            <option value="Artwork Preparation">Artwork Preparation</option>
            <option value="Quality Check">Quality Check</option>
            <option value="Ready for Dispatch">Ready for Dispatch</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Payment Status */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-[#FAF7F2] border border-[#E5DAC8] text-xs text-[#1E2D22] rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Paid">Paid (Verified)</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#EAE3D5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EAE3D5] text-[#8E7B6C] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-3">Customer Info</th>
                <th className="py-3 px-3">Ordered Artworks</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Order Status</th>
                <th className="py-3 px-3">Tracking</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* Order ID & Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-sm text-[#1E2D22] block">
                        #{o.id}
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        {o.createdAt}
                      </span>
                      {o.invoiceNumber && (
                        <span className="text-[9px] font-mono text-[#8E7B6C] bg-gray-100 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                          {o.invoiceNumber}
                        </span>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-sm text-[#1E2D22] block">
                        {o.customerName}
                      </span>
                      <span className="text-[11px] text-[#6B5B4E] block">{o.phone}</span>
                      <span className="text-[10px] text-gray-500 block truncate max-w-[150px]">{o.email}</span>
                    </td>

                    {/* Items & Amount */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        {o.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-7 h-7 rounded-md object-cover border border-[#EAE3D5]"
                            />
                            <span className="font-medium text-[#1E2D22] line-clamp-1 max-w-[160px]">
                              {item.title} (x{item.quantity})
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="font-mono font-bold text-[#1E2D22] text-xs mt-1.5">
                        Total: ₹{o.total.toLocaleString('en-IN')}
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          o.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                      <span className="text-[10px] text-gray-500 block mt-0.5">
                        {o.paymentMethod}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-3">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleQuickStatusChange(o.id, e.target.value as OrderStatus)}
                        className={`text-xs font-semibold rounded-xl px-2.5 py-1.5 border outline-none cursor-pointer ${
                          o.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : o.orderStatus === 'Shipped'
                            ? 'bg-teal-50 text-teal-800 border-teal-200'
                            : o.orderStatus === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-[#FAF7F2] text-[#1E2D22] border-[#E5DAC8]'
                        }`}
                      >
                        <option value="New Order">New Order</option>
                        <option value="Order Confirmed">Order Confirmed</option>
                        <option value="Artwork Preparation">Artwork Preparation</option>
                        <option value="Quality Check">Quality Check</option>
                        <option value="Ready for Dispatch">Ready for Dispatch</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Courier / Tracking */}
                    <td className="py-3.5 px-3">
                      {o.trackingNumber ? (
                        <div>
                          <span className="font-mono text-[11px] font-bold text-[#1E2D22] block">
                            {o.trackingNumber}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {o.courierPartner || 'Delhivery Express'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenReview(o)}
                          className="px-2.5 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE3D5] text-[#1E2D22] rounded-lg transition-colors font-medium text-xs flex items-center gap-1 cursor-pointer"
                          title="Open Full Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                        <button
                          onClick={() => onOpenInvoice(o)}
                          className="p-1.5 text-[#D4943E] hover:text-[#C85A32] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Generate Tax Invoice"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL ORDER REVIEW MODAL / DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E5DAC8] my-6 max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[#EAE3D5] flex items-center justify-between bg-[#1E2D22] text-[#FAF7F2]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D4943E] text-[#1E2D22] flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-wide">
                    Order Review #{selectedOrder.id}
                  </h3>
                  <p className="text-xs text-[#D3C7B5]">
                    Placed on {selectedOrder.createdAt} · Invoice {selectedOrder.invoiceNumber || 'INV-2026'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenInvoice(selectedOrder)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4943E] hover:bg-[#C85A32] text-[#1E2D22] hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-xs text-[#2E251E]">
              
              {/* Order Status Lifecycle Selector */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D5] space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2D22]">
                  Order Status Management
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'New Order',
                    'Order Confirmed',
                    'Artwork Preparation',
                    'Quality Check',
                    'Ready for Dispatch',
                    'Shipped',
                    'Delivered',
                  ].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleQuickStatusChange(selectedOrder.id, st as OrderStatus)}
                      className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                        selectedOrder.orderStatus === st
                          ? 'bg-[#1E2D22] text-white shadow-xs'
                          : 'bg-white border border-[#E5DAC8] text-[#6B5B4E] hover:border-[#1E2D22]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCancelModalOrder(selectedOrder)}
                    className="px-3 py-1.5 rounded-xl font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer ml-auto"
                  >
                    Cancel Order...
                  </button>
                </div>
              </div>

              {/* Grid: Customer Contact & Shipping Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Patron Details */}
                <div className="p-4 bg-white rounded-2xl border border-[#EAE3D5] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E7B6C] block">
                    Patron Profile
                  </span>
                  <div className="font-semibold text-sm text-[#1E2D22]">{selectedOrder.customerName}</div>
                  <div className="text-[#55473A]">
                    <div><span className="font-medium">Mobile:</span> {selectedOrder.phone}</div>
                    <div><span className="font-medium">Email:</span> {selectedOrder.email}</div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <a
                      href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
                    >
                      <span>WhatsApp Patron</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={`mailto:${selectedOrder.email}?subject=RANGIKA Order Update %23${selectedOrder.id}`}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold hover:bg-gray-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Send Email</span>
                    </a>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="p-4 bg-white rounded-2xl border border-[#EAE3D5] space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E7B6C] block">
                    Delivery Address
                  </span>
                  <p className="text-[#55473A] leading-relaxed">
                    {selectedOrder.shippingAddress.street}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}<br />
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>

              </div>

              {/* Shipping & Courier Assignment */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D5] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C85A32]" />
                    <span className="font-bold uppercase tracking-wider text-[#1E2D22]">
                      Courier & Logistics Details
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingShipping(!isEditingShipping)}
                    className="text-xs text-[#C85A32] font-semibold hover:underline cursor-pointer"
                  >
                    {isEditingShipping ? 'Cancel' : 'Edit Courier Details'}
                  </button>
                </div>

                {isEditingShipping ? (
                  <form onSubmit={handleSaveShipping} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Courier Partner
                      </label>
                      <input
                        type="text"
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        placeholder="e.g. Delhivery Express Art Care"
                        className="w-full bg-white border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Airway Bill / Tracking Number
                      </label>
                      <input
                        type="text"
                        value={trackingNo}
                        onChange={(e) => setTrackingNo(e.target.value)}
                        placeholder="e.g. DELHIVERY-RN-889102"
                        className="w-full bg-white border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none text-xs font-mono font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Tracking Web URL
                      </label>
                      <input
                        type="url"
                        value={trackingUrl}
                        onChange={(e) => setTrackingUrl(e.target.value)}
                        placeholder="https://www.delhivery.com/track/package/..."
                        className="w-full bg-white border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Estimated Delivery Date
                      </label>
                      <input
                        type="date"
                        value={estDelivery}
                        onChange={(e) => setEstDelivery(e.target.value)}
                        className="w-full bg-white border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#1E2D22] text-white rounded-xl text-xs font-semibold hover:bg-[#2C3E30] transition-colors cursor-pointer"
                      >
                        Save Logistics Info
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500 block">Courier:</span>
                      <span className="font-semibold text-[#1E2D22]">
                        {selectedOrder.courierPartner || selectedOrder.shippingDetails?.courierPartner || 'Unassigned'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Tracking Number:</span>
                      <span className="font-mono font-bold text-[#1E2D22]">
                        {selectedOrder.trackingNumber || selectedOrder.shippingDetails?.trackingNumber || 'Awaiting dispatch'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Estimated Arrival:</span>
                      <span className="font-semibold text-[#1E2D22]">
                        {selectedOrder.shippingDetails?.estimatedDelivery || '3-5 Business Days'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Verification Box */}
              <div className="p-4 bg-white rounded-2xl border border-[#EAE3D5] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#1E2D22]" />
                    <span className="font-bold uppercase tracking-wider text-[#1E2D22]">
                      Payment Verification
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsVerifyingPayment(!isVerifyingPayment)}
                    className="text-xs text-[#C85A32] font-semibold hover:underline cursor-pointer"
                  >
                    {isVerifyingPayment ? 'Cancel' : 'Update Verification'}
                  </button>
                </div>

                {isVerifyingPayment ? (
                  <form onSubmit={handleSavePaymentStatus} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Verified Status
                      </label>
                      <select
                        value={paymentStatusOption}
                        onChange={(e) => setPaymentStatusOption(e.target.value as any)}
                        className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none text-xs"
                      >
                        <option value="Paid">Paid (Verified Gateway / Bank Transfer)</option>
                        <option value="Pending Verification">Pending Verification</option>
                        <option value="Refunded">Refunded</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Transaction Ref / Bank UTR
                      </label>
                      <input
                        type="text"
                        value={paymentRefNumber}
                        onChange={(e) => setPaymentRefNumber(e.target.value)}
                        placeholder="e.g. UPI/628190281920/HDFC"
                        className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none text-xs font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#1E2D22] text-white rounded-xl text-xs font-semibold hover:bg-[#2C3E30] transition-colors cursor-pointer"
                      >
                        Confirm Payment Record
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-gray-500 block">Method:</span>
                      <span className="font-semibold text-[#1E2D22]">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Status:</span>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          selectedOrder.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Transaction Ref:</span>
                      <span className="font-mono text-gray-700">
                        {selectedOrder.paymentDetails?.transactionRef || 'N/A'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ordered Items Table */}
              <div className="p-4 bg-white rounded-2xl border border-[#EAE3D5] space-y-3">
                <span className="font-bold uppercase tracking-wider text-[#1E2D22] block">
                  Ordered Artworks Breakdown
                </span>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EAE3D5] text-[#8E7B6C] pb-2">
                      <th className="pb-2">Artwork</th>
                      <th className="pb-2">Framing & Size</th>
                      <th className="pb-2 text-center">Qty</th>
                      <th className="pb-2 text-right">Unit Rate</th>
                      <th className="pb-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 pr-2 flex items-center gap-2.5">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover border border-[#EAE3D5]"
                          />
                          <span className="font-semibold text-[#1E2D22]">{item.title}</span>
                        </td>
                        <td className="py-2.5 text-[#55473A]">
                          <div>{item.selectedSize}</div>
                          <div className="text-[10px] text-gray-500">{item.selectedFraming?.label}</div>
                        </td>
                        <td className="py-2.5 text-center font-medium">{item.quantity}</td>
                        <td className="py-2.5 text-right font-mono">₹{item.price.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-[#1E2D22]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Subtotal & Total breakdown */}
                <div className="pt-3 border-t border-[#EAE3D5] flex justify-end">
                  <div className="w-56 space-y-1 font-mono text-right">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-[#C85A32]">
                        <span>Discount:</span>
                        <span>-₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm text-[#1E2D22] pt-1 border-t border-gray-200">
                      <span>Total:</span>
                      <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#EAE3D5] flex items-center justify-between">
              <span className="text-xs text-[#8E7B6C]">
                Changes persist to database and sync live to patron account
              </span>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#1E2D22] text-white rounded-xl text-xs font-semibold hover:bg-[#2C3E30] transition-colors cursor-pointer"
              >
                Close Review
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CANCELLATION MODAL WITH RECORDED REASON */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-red-200 shadow-2xl space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
                  Cancel Order #{cancelModalOrder.id}
                </h4>
                <p className="text-xs text-[#8E7B6C]">
                  Please specify the recorded cancellation reason
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmCancellation} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Cancellation Reason *
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl p-2.5 outline-none mb-2"
                >
                  <option value="Customer requested cancellation prior to dispatch">Customer requested cancellation</option>
                  <option value="Duplicate order placed by accident">Duplicate order placed</option>
                  <option value="Delivery address unserviceable by art courier">Address unserviceable</option>
                  <option value="Customer requested change of artwork motif/size">Change of motif requested</option>
                  <option value="Payment verification timeout">Payment verification timeout</option>
                  <option value="Other administrative reason">Other reason</option>
                </select>
                <input
                  type="text"
                  placeholder="Additional note..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE3D5]">
                <input
                  type="checkbox"
                  checked={restoreStockOnCancel}
                  onChange={(e) => setRestoreStockOnCancel(e.target.checked)}
                  className="w-4 h-4 accent-[#C85A32] rounded cursor-pointer"
                />
                <span className="font-medium text-[#1E2D22]">
                  Restore stock quantities for cancelled artworks
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
