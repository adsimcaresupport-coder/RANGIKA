import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  Edit3,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Painting, StockAdjustmentLog } from '../../types';

export const AdminInventoryTab: React.FC = () => {
  const {
    paintings,
    stockLogs,
    adjustStockWithReason,
    updatePaintingStock,
    showToast,
  } = useStore();

  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'low_stock' | 'out_of_stock' | 'healthy'>('all');

  // Modal for formal stock adjustment
  const [adjustmentModalPainting, setAdjustmentModalPainting] = useState<Painting | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<StockAdjustmentLog['changeType']>('add');
  const [adjustQuantity, setAdjustQuantity] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState<string>('New handcrafted studio batch received from Jitwarpur guild');

  // Direct quick +/- 1
  const handleQuickAdd = (p: Painting) => {
    adjustStockWithReason(p.id, 1, 'Quick +1 studio restock', 'add');
  };

  const handleQuickReduce = (p: Painting) => {
    const current = p.stockQuantity ?? 5;
    if (current <= 0) {
      showToast('Cannot Reduce', 'Painting is already at 0 stock', 'error');
      return;
    }
    adjustStockWithReason(p.id, -1, 'Quick -1 physical adjustment', 'reduce');
  };

  // Submit formal adjustment modal
  const handleFormAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustmentModalPainting) return;

    let delta = Number(adjustQuantity);
    if (adjustmentType === 'reduce') {
      delta = -Math.abs(delta);
    } else if (adjustmentType === 'correction') {
      const current = adjustmentModalPainting.stockQuantity ?? 5;
      delta = delta - current;
    }

    adjustStockWithReason(
      adjustmentModalPainting.id,
      delta,
      adjustReason,
      adjustmentType
    );

    setAdjustmentModalPainting(null);
  };

  // Inventory stats
  const totalStockCount = paintings.reduce((sum, p) => sum + (p.stockQuantity ?? 5), 0);
  const lowStockCount = paintings.filter((p) => {
    const qty = p.stockQuantity ?? 5;
    const threshold = p.lowStockThreshold ?? 3;
    return qty > 0 && qty <= threshold;
  }).length;
  const outOfStockCount = paintings.filter((p) => {
    const qty = p.stockQuantity ?? 5;
    return qty <= 0 || !p.inStock;
  }).length;
  const healthyStockCount = paintings.length - lowStockCount - outOfStockCount;

  const filteredPaintings = paintings.filter((p) => {
    const qty = p.stockQuantity ?? 5;
    const threshold = p.lowStockThreshold ?? 3;

    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.artist.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filterLevel === 'low_stock' && (qty <= 0 || qty > threshold)) return false;
    if (filterLevel === 'out_of_stock' && (qty > 0 && p.inStock)) return false;
    if (filterLevel === 'healthy' && (qty <= threshold || !p.inStock)) return false;

    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#1E2D22]">
            Inventory & Stock Management
          </h3>
          <p className="text-xs text-[#8E7B6C]">
            Track physical atelier stocks, record audit adjustments with reasons, and monitor stock movements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EAE3D5] text-xs font-semibold text-[#1E2D22]">
            Total Units in Atelier: <strong className="font-mono text-base">{totalStockCount}</strong>
          </span>
        </div>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div
          onClick={() => setFilterLevel('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'all'
              ? 'bg-[#1E2D22] text-white border-[#1E2D22]'
              : 'bg-white text-[#1E2D22] border-[#EAE3D5] hover:border-[#1E2D22]'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider block opacity-75">All Masterpieces</span>
          <span className="text-2xl font-serif font-bold block mt-1">{paintings.length}</span>
          <span className="text-[10px] opacity-75">{totalStockCount} total pieces</span>
        </div>

        <div
          onClick={() => setFilterLevel('healthy')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'healthy'
              ? 'bg-emerald-800 text-white border-emerald-800'
              : 'bg-white text-emerald-800 border-[#EAE3D5] hover:border-emerald-600'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider block opacity-75">Healthy Stock</span>
          <span className="text-2xl font-serif font-bold block mt-1">{healthyStockCount}</span>
          <span className="text-[10px] opacity-75">&gt; 3 units available</span>
        </div>

        <div
          onClick={() => setFilterLevel('low_stock')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'low_stock'
              ? 'bg-amber-700 text-white border-amber-700'
              : 'bg-white text-amber-800 border-[#EAE3D5] hover:border-amber-600'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider block opacity-75">Low Stock Alert</span>
          <span className="text-2xl font-serif font-bold block mt-1">{lowStockCount}</span>
          <span className="text-[10px] opacity-75">1 - 3 units left</span>
        </div>

        <div
          onClick={() => setFilterLevel('out_of_stock')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'out_of_stock'
              ? 'bg-red-800 text-white border-red-800'
              : 'bg-white text-red-700 border-[#EAE3D5] hover:border-red-600'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider block opacity-75">Out of Stock</span>
          <span className="text-2xl font-serif font-bold block mt-1">{outOfStockCount}</span>
          <span className="text-[10px] opacity-75">0 units available</span>
        </div>

      </div>

      {/* Search & Stock Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3D5] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by painting title, SKU, or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl text-xs text-[#1E2D22] focus:outline-none focus:border-[#C85A32]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#8E7B6C] font-medium">Filter Level:</span>
          {(['all', 'healthy', 'low_stock', 'out_of_stock'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer capitalize ${
                filterLevel === lvl
                  ? 'bg-[#1E2D22] text-white'
                  : 'bg-[#FAF7F2] text-[#6B5B4E] hover:text-[#1E2D22]'
              }`}
            >
              {lvl.replace('_', ' ')}
            </button>
          ))}
        </div>

      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-3xl border border-[#EAE3D5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EAE3D5] text-[#8E7B6C] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Artwork & SKU</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Artist</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3 text-center">Available Stock</th>
                <th className="py-3 px-3 text-center">Quick Adjust</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6]">
              {filteredPaintings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No artworks match the stock filter.
                  </td>
                </tr>
              ) : (
                filteredPaintings.map((p) => {
                  const qty = p.stockQuantity ?? 5;
                  const threshold = p.lowStockThreshold ?? 3;
                  const isOut = qty <= 0 || !p.inStock;
                  const isLow = qty > 0 && qty <= threshold;

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      {/* Title & Image */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-11 h-11 rounded-xl object-cover border border-[#EAE3D5] flex-shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-sm text-[#1E2D22] block line-clamp-1">
                              {p.title}
                            </span>
                            <span className="font-mono text-[10px] text-[#8E7B6C]">
                              {p.sku || `RNG-${p.id.slice(-4).toUpperCase()}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 text-[#6B5B4E]">
                        {p.categoryName}
                      </td>

                      {/* Artist */}
                      <td className="py-3.5 px-3 font-medium text-[#1E2D22]">
                        {p.artist}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3 font-mono font-bold text-[#1E2D22]">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>

                      {/* Stock Level Badge */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-mono font-bold text-base text-[#1E2D22]">
                            {qty}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              isOut
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : isLow
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                          </span>
                        </div>
                      </td>

                      {/* Quick Adjust Buttons */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#E5DAC8]">
                          <button
                            type="button"
                            onClick={() => handleQuickReduce(p)}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-gray-200 text-[#1E2D22] flex items-center justify-center font-bold transition-colors cursor-pointer"
                            title="Quick Reduce -1"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs px-2">{qty}</span>
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(p)}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-gray-200 text-[#1E2D22] flex items-center justify-center font-bold transition-colors cursor-pointer"
                            title="Quick Add +1"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Formal Audit Adjustment Modal Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setAdjustmentModalPainting(p);
                            setAdjustmentType('add');
                            setAdjustQuantity(1);
                            setAdjustReason('New handcrafted studio batch received from Jitwarpur guild');
                          }}
                          className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE3D5] text-[#1E2D22] rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Record Audit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movement History Log Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#C85A32]" />
            <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
              Stock Movement & Adjustment History Log
            </h4>
          </div>
          <span className="text-xs text-[#8E7B6C]">{stockLogs.length} total events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[#8E7B6C] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5">Date & Time</th>
                <th className="py-2.5">Artwork Title</th>
                <th className="py-2.5">SKU</th>
                <th className="py-2.5 text-center">Movement</th>
                <th className="py-2.5">Prev → New</th>
                <th className="py-2.5">Recorded Reason</th>
                <th className="py-2.5 text-right">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF7F2]/50 text-[#3E342B]">
                  <td className="py-2.5 font-mono text-[11px] text-gray-500">{log.date}</td>
                  <td className="py-2.5 font-semibold text-[#1E2D22]">{log.paintingTitle}</td>
                  <td className="py-2.5 font-mono text-gray-500">{log.sku}</td>
                  <td className="py-2.5 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                        log.quantityChanged > 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {log.quantityChanged > 0 ? `+${log.quantityChanged}` : log.quantityChanged}
                    </span>
                  </td>
                  <td className="py-2.5 font-mono text-[11px]">
                    {log.previousStock} → <strong className="text-[#1E2D22]">{log.newStock}</strong>
                  </td>
                  <td className="py-2.5 text-gray-600 max-w-xs">{log.reason}</td>
                  <td className="py-2.5 text-right font-medium text-gray-500">{log.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORMAL STOCK ADJUSTMENT MODAL */}
      {adjustmentModalPainting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#E5DAC8] shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-3">
              <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
                Record Stock Adjustment
              </h4>
              <button
                type="button"
                onClick={() => setAdjustmentModalPainting(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DAC8]">
              <div className="font-semibold text-sm text-[#1E2D22]">{adjustmentModalPainting.title}</div>
              <div className="text-xs text-[#6B5B4E] mt-0.5">
                Current Available Stock: <strong className="text-base text-[#1E2D22] font-mono">{adjustmentModalPainting.stockQuantity ?? 5} units</strong>
              </div>
            </div>

            <form onSubmit={handleFormAdjustment} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Adjustment Action *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('add')}
                    className={`py-2 rounded-xl font-semibold border transition-all cursor-pointer ${
                      adjustmentType === 'add'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-[#FAF7F2] border-[#E5DAC8] text-gray-700'
                    }`}
                  >
                    + Add Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('reduce')}
                    className={`py-2 rounded-xl font-semibold border transition-all cursor-pointer ${
                      adjustmentType === 'reduce'
                        ? 'bg-red-700 text-white border-red-700'
                        : 'bg-[#FAF7F2] border-[#E5DAC8] text-gray-700'
                    }`}
                  >
                    - Reduce Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('correction')}
                    className={`py-2 rounded-xl font-semibold border transition-all cursor-pointer ${
                      adjustmentType === 'correction'
                        ? 'bg-[#1E2D22] text-white border-[#1E2D22]'
                        : 'bg-[#FAF7F2] border-[#E5DAC8] text-gray-700'
                    }`}
                  >
                    = Set Exact
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {adjustmentType === 'correction' ? 'Exact New Total Stock' : 'Quantity Units'} *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                  className="w-full text-base font-bold font-mono bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Recorded Business Reason *
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl p-2.5 outline-none mb-2"
                >
                  <option value="New handcrafted studio batch received from Jitwarpur guild">New studio batch received</option>
                  <option value="Physical atelier audit recount">Physical atelier audit recount</option>
                  <option value="Artwork selected for art gallery exhibition display">Gallery exhibition loan</option>
                  <option value="Damaged during framing process">Damaged in framing</option>
                  <option value="Transit damage loss replacement">Damaged in courier transit</option>
                  <option value="Private patron commission reserved">Direct patron reservation</option>
                  <option value="Manual stock correction">Other manual correction</option>
                </select>

                <input
                  type="text"
                  placeholder="Additional specific audit details..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustmentModalPainting(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E2D22] text-white rounded-xl text-xs font-semibold hover:bg-[#2C3E30] transition-colors cursor-pointer shadow-sm"
                >
                  Commit Stock Record
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
