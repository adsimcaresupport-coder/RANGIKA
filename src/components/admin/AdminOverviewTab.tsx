import React from 'react';
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertTriangle,
  Sparkles,
  Building2,
  DollarSign,
  ArrowRight,
  Eye,
  FileText,
  MessageCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, CustomPaintingRequest, WholesaleEnquiry } from '../../types';

interface AdminOverviewTabProps {
  onNavigateTab: (tabKey: any) => void;
  onOpenOrder: (order: Order) => void;
  onOpenInvoice: (order: Order) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  onNavigateTab,
  onOpenOrder,
  onOpenInvoice,
}) => {
  const {
    orders,
    paintings,
    customRequests,
    wholesaleEnquiries,
    customers,
  } = useStore();

  // Metrics calculated strictly from real database records
  const totalSales = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.orderStatus === 'New Order').length;
  const pendingPaymentOrders = orders.filter((o) => o.paymentStatus === 'Pending Verification').length;
  const confirmedOrders = orders.filter((o) => o.orderStatus === 'Order Confirmed').length;
  const processingOrders = orders.filter((o) =>
    ['Artwork Preparation', 'Quality Check', 'Ready for Dispatch'].includes(o.orderStatus)
  ).length;
  const shippedOrders = orders.filter((o) => o.orderStatus === 'Shipped').length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'Cancelled').length;

  const totalProducts = paintings.length;
  const inStockProducts = paintings.filter(
    (p) => p.inStock && (p.stockQuantity === undefined || p.stockQuantity > 0)
  ).length;
  const lowStockProducts = paintings.filter((p) => {
    const qty = p.stockQuantity ?? 5;
    const threshold = p.lowStockThreshold ?? 3;
    return qty > 0 && qty <= threshold;
  }).length;
  const outOfStockProducts = paintings.filter(
    (p) => !p.inStock || (p.stockQuantity !== undefined && p.stockQuantity <= 0)
  ).length;

  const totalCustomRequests = customRequests.length;
  const activeCustomRequests = customRequests.filter(
    (r) => !['Completed', 'Cancelled'].includes(r.status)
  ).length;

  const totalWholesale = wholesaleEnquiries.length;
  const activeWholesale = wholesaleEnquiries.filter(
    (w) => !['Closed'].includes(w.status)
  ).length;

  // Recent lists
  const recentOrders = orders.slice(0, 5);
  const recentCustomRequests = customRequests.slice(0, 3);
  const recentWholesale = wholesaleEnquiries.slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner Notice */}
      <div className="bg-[#1E2D22] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md border border-[#2D3E32]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4943E] animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-[#D4943E] font-semibold">
              Live Business Telemetry
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-wide">
            Welcome back to RANGIKA Atelier
          </h3>
          <p className="text-xs sm:text-sm text-[#D3C7B5] max-w-2xl font-light leading-relaxed">
            All statistics, inventory counts, and financial summaries below are derived exclusively from your active commerce database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2.5 bg-[#D4943E] hover:bg-[#C85A32] text-[#1E2D22] hover:text-white rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer shadow-xs"
          >
            + Add New Painting
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer"
          >
            Manage Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE3D5] shadow-xs hover:border-[#D4943E] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-[#6B5B4E]">Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2D22]">
            ₹{totalSales.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#8E7B6C] mt-1.5 flex items-center gap-1">
            <span>{totalOrders} lifetime orders placed</span>
          </p>
        </div>

        {/* Total Orders & Statuses */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white rounded-2xl p-5 border border-[#EAE3D5] shadow-xs hover:border-[#C85A32] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-[#6B5B4E]">Orders In Motion</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2D22] group-hover:text-[#C85A32] transition-colors">
            {totalOrders}
          </div>
          <div className="text-[11px] text-[#8E7B6C] mt-1.5 flex flex-wrap gap-x-2">
            <span className="text-amber-700 font-semibold">{newOrders} New</span>
            <span>•</span>
            <span className="text-indigo-700 font-medium">{processingOrders} Processing</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">{deliveredOrders} Delivered</span>
          </div>
        </div>

        {/* Product Catalog & Stock */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white rounded-2xl p-5 border border-[#EAE3D5] shadow-xs hover:border-[#D4943E] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-[#6B5B4E]">Catalog Inventory</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2D22]">
            {totalProducts} <span className="text-sm font-sans font-normal text-gray-500">Paintings</span>
          </div>
          <div className="text-[11px] mt-1.5 flex flex-wrap gap-x-2">
            <span className="text-emerald-700 font-medium">{inStockProducts} In Stock</span>
            {lowStockProducts > 0 && (
              <>
                <span>•</span>
                <span className="text-amber-700 font-semibold">{lowStockProducts} Low Stock</span>
              </>
            )}
            {outOfStockProducts > 0 && (
              <>
                <span>•</span>
                <span className="text-red-600 font-semibold">{outOfStockProducts} Out</span>
              </>
            )}
          </div>
        </div>

        {/* Custom Painting & Wholesale Enquiries */}
        <div
          onClick={() => onNavigateTab('custom')}
          className="bg-white rounded-2xl p-5 border border-[#EAE3D5] shadow-xs hover:border-[#1E2D22] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-[#6B5B4E]">Custom & Wholesale</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2D22]">
            {totalCustomRequests + totalWholesale} <span className="text-sm font-sans font-normal text-gray-500">Inquiries</span>
          </div>
          <p className="text-[11px] text-[#8E7B6C] mt-1.5">
            {activeCustomRequests} active custom · {activeWholesale} active wholesale
          </p>
        </div>

      </div>

      {/* Detailed Order Status Pipeline Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EAE3D5]">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
              Order Fulfillment Lifecycle
            </h4>
            <p className="text-xs text-[#8E7B6C]">
              Real-time progression of orders across artisan fulfillment stages
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-[#C85A32] hover:text-[#1E2D22] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All Orders ({totalOrders})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          
          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DAC8]">
            <span className="text-[10px] uppercase font-bold text-[#6B5B4E] block">New Orders</span>
            <span className="text-xl font-bold font-serif text-[#1E2D22] mt-1 block">{newOrders}</span>
            <span className="text-[10px] text-amber-700 font-medium">Needs Review</span>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DAC8]">
            <span className="text-[10px] uppercase font-bold text-[#6B5B4E] block">Pending Verification</span>
            <span className="text-xl font-bold font-serif text-[#1E2D22] mt-1 block">{pendingPaymentOrders}</span>
            <span className="text-[10px] text-orange-600 font-medium">Awaiting UTR</span>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DAC8]">
            <span className="text-[10px] uppercase font-bold text-[#6B5B4E] block">Confirmed</span>
            <span className="text-xl font-bold font-serif text-[#1E2D22] mt-1 block">{confirmedOrders}</span>
            <span className="text-[10px] text-blue-700 font-medium">Queue ready</span>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DAC8]">
            <span className="text-[10px] uppercase font-bold text-[#6B5B4E] block">In Processing</span>
            <span className="text-xl font-bold font-serif text-[#1E2D22] mt-1 block">{processingOrders}</span>
            <span className="text-[10px] text-indigo-700 font-medium">Artisan bench</span>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DAC8]">
            <span className="text-[10px] uppercase font-bold text-[#6B5B4E] block">Shipped</span>
            <span className="text-xl font-bold font-serif text-[#1E2D22] mt-1 block">{shippedOrders}</span>
            <span className="text-[10px] text-teal-700 font-medium">In Transit</span>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DAC8]">
            <span className="text-[10px] uppercase font-bold text-[#6B5B4E] block">Delivered</span>
            <span className="text-xl font-bold font-serif text-[#1E2D22] mt-1 block">{deliveredOrders}</span>
            <span className="text-[10px] text-emerald-700 font-medium">Successful</span>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DAC8]">
            <span className="text-[10px] uppercase font-bold text-[#6B5B4E] block">Cancelled</span>
            <span className="text-xl font-bold font-serif text-[#1E2D22] mt-1 block">{cancelledOrders}</span>
            <span className="text-[10px] text-gray-500 font-medium">Restored</span>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DAC8]">
            <span className="text-[10px] uppercase font-bold text-[#6B5B4E] block">Total Patrons</span>
            <span className="text-xl font-bold font-serif text-[#1E2D22] mt-1 block">{customers.length}</span>
            <span className="text-[10px] text-[#C85A32] font-medium">Registered</span>
          </div>

        </div>
      </div>

      {/* Two Column Section: Recent Orders & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table (Col 2/3) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
                Recent Customer Orders
              </h4>
              <p className="text-xs text-[#8E7B6C]">Latest transactions from patrons</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-[#C85A32] hover:text-[#1E2D22] flex items-center gap-1 cursor-pointer"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-xs">
              No orders registered in the system yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#EAE3D5] text-[#8E7B6C] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 pr-2">Order ID</th>
                    <th className="py-2.5 px-2">Patron</th>
                    <th className="py-2.5 px-2">Total (₹)</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 pl-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EFE6]">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3 pr-2">
                        <span className="font-mono font-bold text-[#1E2D22] block">#{o.id}</span>
                        <span className="text-[10px] text-gray-500">{o.createdAt}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-semibold text-[#1E2D22] block">{o.customerName}</span>
                        <span className="text-[10px] text-gray-500">{o.phone}</span>
                      </td>
                      <td className="py-3 px-2 font-mono font-bold text-[#1E2D22]">
                        ₹{o.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            o.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : o.orderStatus === 'Shipped'
                              ? 'bg-teal-50 text-teal-800 border border-teal-200'
                              : o.orderStatus === 'Cancelled'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenOrder(o)}
                            className="p-1.5 text-gray-600 hover:text-[#1E2D22] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="Review Order"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenInvoice(o)}
                            className="p-1.5 text-[#D4943E] hover:text-[#C85A32] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Print / View Invoice"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Customer Enquiries Feed (Col 1/3) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5]">
            <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
              Client Inquiries
            </h4>
            <span className="text-xs text-[#8E7B6C]">{totalCustomRequests + totalWholesale} total</span>
          </div>

          {/* Custom Painting Requests list */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#6B5B4E] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4943E]" />
                <span>Custom Paintings</span>
              </span>
              <button
                onClick={() => onNavigateTab('custom')}
                className="text-[11px] font-semibold text-[#C85A32] hover:underline cursor-pointer"
              >
                View all ({customRequests.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {recentCustomRequests.map((r) => (
                <div
                  key={r.id}
                  onClick={() => onNavigateTab('custom')}
                  className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DAC8] hover:border-[#C85A32] transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-xs text-[#1E2D22] block">{r.customerName}</span>
                      <span className="text-[11px] text-[#6B5B4E] line-clamp-1">{r.theme}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white font-medium text-[#1E2D22] border border-[#E5DAC8]">
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wholesale Enquiries list */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#6B5B4E] flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#1E2D22]" />
                <span>Wholesale B2B</span>
              </span>
              <button
                onClick={() => onNavigateTab('wholesale')}
                className="text-[11px] font-semibold text-[#C85A32] hover:underline cursor-pointer"
              >
                View all ({wholesaleEnquiries.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {recentWholesale.map((w) => (
                <div
                  key={w.id}
                  onClick={() => onNavigateTab('wholesale')}
                  className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DAC8] hover:border-[#1E2D22] transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-xs text-[#1E2D22] block">{w.businessName}</span>
                      <span className="text-[11px] text-[#6B5B4E]">Req: {w.requiredQuantity} pcs · {w.budget}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white font-medium text-[#1E2D22] border border-[#E5DAC8]">
                      {w.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
