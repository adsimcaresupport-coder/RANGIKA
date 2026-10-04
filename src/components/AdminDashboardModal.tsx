import React, { useState } from 'react';
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Sparkles,
  Building2,
  TrendingUp,
  Tag,
  Globe,
  FileSpreadsheet,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { AdminLoginView } from './admin/AdminLoginView';
import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { AdminProductsTab } from './admin/AdminProductsTab';
import { AdminOrdersTab } from './admin/AdminOrdersTab';
import { AdminCustomersTab } from './admin/AdminCustomersTab';
import { AdminCustomRequestsTab } from './admin/AdminCustomRequestsTab';
import { AdminWholesaleTab } from './admin/AdminWholesaleTab';
import { AdminInventoryTab } from './admin/AdminInventoryTab';
import { AdminCouponsTab } from './admin/AdminCouponsTab';
import { AdminCMSTab } from './admin/AdminCMSTab';
import { AdminReportsTab } from './admin/AdminReportsTab';
import { AdminSecurityTab } from './admin/AdminSecurityTab';
import { AdminInvoiceModal } from './admin/AdminInvoiceModal';

export type AdminTabKey =
  | 'overview'
  | 'products'
  | 'orders'
  | 'customers'
  | 'custom'
  | 'wholesale'
  | 'inventory'
  | 'coupons'
  | 'cms'
  | 'reports'
  | 'security';

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    adminAuth,
    adminLogout,
    selectedInvoiceOrder,
    setSelectedInvoiceOrder,
    orders,
    customRequests,
    wholesaleEnquiries,
    paintings,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTabKey>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modal for reviewing an order passed from other tabs
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

  if (!isAdminOpen) return null;

  // Unread/action counts
  const newOrdersCount = orders.filter((o) => o.orderStatus === 'New Order').length;
  const newCustomCount = customRequests.filter((r) => r.status === 'New Request').length;
  const newWholesaleCount = wholesaleEnquiries.filter((w) => w.status === 'New').length;
  const lowStockCount = paintings.filter((p) => {
    const qty = p.stockQuantity ?? 5;
    const threshold = p.lowStockThreshold ?? 3;
    return qty <= threshold;
  }).length;

  const NAV_ITEMS = [
    { key: 'overview', label: 'Studio Overview', icon: LayoutDashboard, badge: null },
    { key: 'products', label: 'Paintings Catalog', icon: Package, badge: `${paintings.length}` },
    { key: 'orders', label: 'Orders & Fulfillment', icon: ShoppingCart, badge: newOrdersCount > 0 ? `${newOrdersCount} new` : null, badgeColor: 'bg-amber-600' },
    { key: 'customers', label: 'Patrons & CRM', icon: Users, badge: null },
    { key: 'custom', label: 'Custom Paintings', icon: Sparkles, badge: newCustomCount > 0 ? `${newCustomCount} new` : null, badgeColor: 'bg-purple-600' },
    { key: 'wholesale', label: 'Wholesale B2B', icon: Building2, badge: newWholesaleCount > 0 ? `${newWholesaleCount} new` : null, badgeColor: 'bg-blue-600' },
    { key: 'inventory', label: 'Stock & Inventory', icon: TrendingUp, badge: lowStockCount > 0 ? `${lowStockCount} low` : null, badgeColor: 'bg-red-600' },
    { key: 'coupons', label: 'Coupons & Offers', icon: Tag, badge: null },
    { key: 'cms', label: 'Website CMS', icon: Globe, badge: null },
    { key: 'reports', label: 'Business Reports', icon: FileSpreadsheet, badge: null },
    { key: 'security', label: 'Security & Audit', icon: ShieldCheck, badge: null },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in overflow-hidden">
      <div className="relative w-full max-w-[1400px] h-[95vh] bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E5DAC8] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-[#2D3E32] flex items-center justify-between bg-[#1E2D22] text-[#FAF7F2] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4943E] text-[#1E2D22] flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide">
                  RANGIKA Atelier Executive Suite
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4943E]/20 text-[#E5B869] border border-[#D4943E]/30 uppercase tracking-wider">
                  Owner Portal
                </span>
              </div>
              <p className="text-[11px] text-[#D3C7B5]">
                {adminAuth.isAuthenticated
                  ? `Signed in as ${adminAuth.adminName} (${adminAuth.adminEmail})`
                  : 'Authentication Required · Restricted Business Access'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminAuth.isAuthenticated && (
              <button
                onClick={adminLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
                title="Lock Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock</span>
              </button>
            )}

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 text-gray-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        {!adminAuth.isAuthenticated ? (
          /* Authentication Screen */
          <AdminLoginView />
        ) : (
          /* Fully Unlocked Executive Dashboard with Sidebar & Content */
          <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-[#F4EFE6] border-r border-[#EAE3D5] flex flex-col justify-between flex-shrink-0 overflow-y-auto hidden md:flex">
              <div className="p-4 space-y-1">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8E7B6C]">
                  Commerce Modules
                </div>

                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;

                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key as AdminTabKey)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#1E2D22] text-[#FAF7F2] shadow-sm'
                          : 'text-[#4A3E33] hover:bg-[#EAE3D5] hover:text-[#1E2D22]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4943E]' : 'text-[#8E7B6C]'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                            isActive ? 'bg-[#C85A32]' : item.badgeColor || 'bg-gray-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Quick Help */}
              <div className="p-4 border-t border-[#EAE3D5] bg-[#FAF7F2]/50 text-[11px] text-[#6B5B4E] space-y-1">
                <div className="font-semibold text-[#1E2D22]">Direct Business Control</div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Manage paintings, inventory, pricing, coupons, and orders directly without developer intervention.
                </p>
              </div>
            </aside>

            {/* Mobile Horizontal Tabs Bar */}
            <div className="md:hidden flex border-b border-[#EAE3D5] bg-[#F4EFE6] px-2 py-2 overflow-x-auto gap-1 flex-shrink-0 text-xs">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key as AdminTabKey)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isActive ? 'bg-[#1E2D22] text-white' : 'text-[#6B5B4E] hover:bg-[#EAE3D5]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#FAF7F2]">
              {activeTab === 'overview' && (
                <AdminOverviewTab
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenOrder={(order) => {
                    setActiveTab('orders');
                  }}
                  onOpenInvoice={(order) => setSelectedInvoiceOrder(order)}
                />
              )}

              {activeTab === 'products' && <AdminProductsTab />}

              {activeTab === 'orders' && (
                <AdminOrdersTab
                  onOpenInvoice={(order) => setSelectedInvoiceOrder(order)}
                />
              )}

              {activeTab === 'customers' && (
                <AdminCustomersTab
                  onOpenOrder={(order) => {
                    setActiveTab('orders');
                  }}
                  onOpenInvoice={(order) => setSelectedInvoiceOrder(order)}
                />
              )}

              {activeTab === 'custom' && (
                <AdminCustomRequestsTab
                  onOpenOrder={(order) => {
                    setActiveTab('orders');
                  }}
                />
              )}

              {activeTab === 'wholesale' && (
                <AdminWholesaleTab
                  onOpenOrder={(order) => {
                    setActiveTab('orders');
                  }}
                />
              )}

              {activeTab === 'inventory' && <AdminInventoryTab />}

              {activeTab === 'coupons' && <AdminCouponsTab />}

              {activeTab === 'cms' && <AdminCMSTab />}

              {activeTab === 'reports' && <AdminReportsTab />}

              {activeTab === 'security' && <AdminSecurityTab />}
            </main>

          </div>
        )}

      </div>
    </div>
  );
};
