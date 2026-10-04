import React from 'react';
import {
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Calendar,
  DollarSign,
  Package,
  Award,
  AlertTriangle,
  XCircle,
  Building2,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminReportsTab: React.FC = () => {
  const {
    orders,
    paintings,
    customRequests,
    wholesaleEnquiries,
    customers,
    showToast,
  } = useStore();

  const handlePrintReport = () => {
    window.print();
  };

  // Financial aggregates
  const validOrders = orders.filter((o) => o.orderStatus !== 'Cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
  const averageOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  // Monthly Sales Aggregation
  const monthlySalesMap = new Map<string, { month: string; orders: number; revenue: number }>();
  orders.forEach((o) => {
    if (o.orderStatus === 'Cancelled') return;
    const monthKey = o.createdAt.substring(0, 7); // e.g. "2026-10"
    const curr = monthlySalesMap.get(monthKey) || { month: monthKey, orders: 0, revenue: 0 };
    curr.orders += 1;
    curr.revenue += o.total;
    monthlySalesMap.set(monthKey, curr);
  });
  const monthlyBreakdown = Array.from(monthlySalesMap.values()).sort((a, b) => b.month.localeCompare(a.month));

  // Best-Selling Paintings (Calculated from orders items)
  const productSalesMap = new Map<string, { id: string; title: string; unitsSold: number; revenue: number; image: string }>();
  validOrders.forEach((o) => {
    o.items.forEach((item) => {
      const existing = productSalesMap.get(item.paintingId) || {
        id: item.paintingId,
        title: item.title,
        unitsSold: 0,
        revenue: 0,
        image: item.image,
      };
      existing.unitsSold += item.quantity;
      existing.revenue += item.price * item.quantity;
      productSalesMap.set(item.paintingId, existing);
    });
  });
  const bestSellers = Array.from(productSalesMap.values()).sort((a, b) => b.revenue - a.revenue);

  // Category Revenue Share
  const categoryRevenueMap = new Map<string, { name: string; revenue: number; count: number }>();
  paintings.forEach((p) => {
    const existing = categoryRevenueMap.get(p.category) || { name: p.categoryName, revenue: 0, count: 0 };
    existing.count += 1;
    categoryRevenueMap.set(p.category, existing);
  });
  validOrders.forEach((o) => {
    o.items.forEach((item) => {
      const p = paintings.find((pt) => pt.id === item.paintingId);
      if (p) {
        const cat = categoryRevenueMap.get(p.category);
        if (cat) {
          cat.revenue += item.price * item.quantity;
        }
      }
    });
  });
  const categoryAnalysis = Array.from(categoryRevenueMap.values());

  // Low stock products alert list
  const lowStockList = paintings.filter((p) => {
    const qty = p.stockQuantity ?? 5;
    const threshold = p.lowStockThreshold ?? 3;
    return qty <= threshold;
  });

  // Cancelled Orders
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'Cancelled');
  const cancelledTotal = cancelledOrders.reduce((sum, o) => sum + o.total, 0);

  // Custom painting pipeline
  const customQuotedTotal = customRequests.reduce((sum, r) => sum + (r.quotationAmount || 0), 0);
  const wholesaleQuotedTotal = wholesaleEnquiries.reduce((sum, w) => sum + (w.quotationAmount || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#1E2D22]">
            Atelier Executive Analytics & Business Intelligence
          </h3>
          <p className="text-xs text-[#8E7B6C]">
            Comprehensive reporting derived exclusively from actual order, custom request, and inventory database records.
          </p>
        </div>

        <button
          onClick={handlePrintReport}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#EAE3D5] hover:border-[#1E2D22] text-[#1E2D22] rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D5] shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8E7B6C] block">Gross Realized Sales</span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2D22] mt-1 block">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">Excluding cancelled transactions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D5] shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8E7B6C] block">Average Order Value</span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2D22] mt-1 block">
            ₹{averageOrderValue.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-[#6B5B4E]">Across {validOrders.length} valid orders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D5] shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8E7B6C] block">Custom Pipeline Value</span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2D22] mt-1 block">
            ₹{customQuotedTotal.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-purple-700 font-medium">{customRequests.length} custom briefs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D5] shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8E7B6C] block">Wholesale B2B Pipeline</span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2D22] mt-1 block">
            ₹{wholesaleQuotedTotal.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-blue-700 font-medium">{wholesaleEnquiries.length} consignments</span>
        </div>
      </div>

      {/* Two Column Layout: Monthly Sales & Best-Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Breakdown Table */}
        <div className="bg-white rounded-3xl p-6 border border-[#EAE3D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5]">
            <h4 className="font-serif text-lg font-bold text-[#1E2D22] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C85A32]" />
              <span>Monthly Sales Performance</span>
            </h4>
            <span className="text-xs text-[#8E7B6C] font-mono">{monthlyBreakdown.length} months tracked</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE3D5] text-[#8E7B6C] pb-2 font-semibold text-[11px] uppercase">
                <th className="pb-2">Billing Month</th>
                <th className="pb-2 text-center">Orders</th>
                <th className="pb-2 text-right">Gross Sales (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6]">
              {monthlyBreakdown.map((row) => (
                <tr key={row.month} className="hover:bg-[#FAF7F2]">
                  <td className="py-2.5 font-mono font-medium text-[#1E2D22]">{row.month}</td>
                  <td className="py-2.5 text-center font-bold text-gray-700">{row.orders}</td>
                  <td className="py-2.5 text-right font-mono font-bold text-[#1E2D22]">
                    ₹{row.revenue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Best-Selling Artworks */}
        <div className="bg-white rounded-3xl p-6 border border-[#EAE3D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5]">
            <h4 className="font-serif text-lg font-bold text-[#1E2D22] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D4943E]" />
              <span>Best-Selling Paintings</span>
            </h4>
            <span className="text-xs text-[#8E7B6C]">By volume & revenue</span>
          </div>

          <div className="space-y-3">
            {bestSellers.length === 0 ? (
              <p className="text-gray-400 italic text-xs py-4">No order items recorded yet.</p>
            ) : (
              bestSellers.slice(0, 5).map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between gap-3 p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DAC8]">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#1E2D22] text-[#D4943E] font-bold text-xs flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover border border-[#EAE3D5]"
                    />
                    <div>
                      <span className="font-semibold text-xs text-[#1E2D22] block line-clamp-1">{item.title}</span>
                      <span className="text-[10px] text-[#8E7B6C]">{item.unitsSold} units acquired</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm text-[#1E2D22]">
                    ₹{item.revenue.toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Category Revenue Distribution & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Share */}
        <div className="bg-white rounded-3xl p-6 border border-[#EAE3D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5]">
            <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
              Category Revenue Share
            </h4>
            <span className="text-xs text-[#8E7B6C]">Catalog distribution</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE3D5] text-[#8E7B6C] pb-2 font-semibold text-[11px] uppercase">
                <th className="pb-2">Category</th>
                <th className="pb-2 text-center">Artworks</th>
                <th className="pb-2 text-right">Revenue (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6]">
              {categoryAnalysis.map((cat) => (
                <tr key={cat.name} className="hover:bg-[#FAF7F2]">
                  <td className="py-2.5 font-medium text-[#1E2D22]">{cat.name}</td>
                  <td className="py-2.5 text-center text-gray-600">{cat.count}</td>
                  <td className="py-2.5 text-right font-mono font-bold text-[#1E2D22]">
                    ₹{cat.revenue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-3xl p-6 border border-[#EAE3D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5]">
            <h4 className="font-serif text-lg font-bold text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Low-Stock & Out-of-Stock Replenishment Alerts</span>
            </h4>
            <span className="text-xs font-bold text-red-600">{lowStockList.length} alerts</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {lowStockList.length === 0 ? (
              <p className="text-emerald-700 text-xs py-4">All catalog items have healthy stock levels.</p>
            ) : (
              lowStockList.map((p) => {
                const qty = p.stockQuantity ?? 5;
                return (
                  <div key={p.id} className="p-2.5 bg-red-50/50 rounded-xl border border-red-200 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-[#1E2D22] block">{p.title}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{p.sku} · {p.artist}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-white text-red-700 border border-red-200">
                      {qty === 0 ? 'OUT OF STOCK' : `${qty} left`}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
