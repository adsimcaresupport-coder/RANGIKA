import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { BrandValuesStrip } from './components/BrandValuesStrip';
import { ShopByCategory } from './components/ShopByCategory';
import { OurStorySection } from './components/OurStorySection';
import { FeaturedCollectionBanner } from './components/FeaturedCollectionBanner';
import { ThreeDWallVisualizer } from './components/ThreeDWallVisualizer';
import { ArtMatchmaker } from './components/ArtMatchmaker';
import { ShopAllPaintings } from './components/ShopAllPaintings';
import { CustomPaintingSection } from './components/CustomPaintingSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { WhyChooseRangika } from './components/WhyChooseRangika';
import { WholesaleSection } from './components/WholesaleSection';
import { GalleryInspiration } from './components/GalleryInspiration';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { ContactSection } from './components/ContactSection';
import { OurStoryPage } from './components/OurStoryPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AccountModal } from './components/AccountModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { StyleGuideModal } from './components/StyleGuideModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminInvoiceModal } from './components/admin/AdminInvoiceModal';
import { Footer } from './components/Footer';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    selectedPainting,
    setSelectedPainting,
    quickViewPainting,
    setQuickViewPainting,
    selectedInvoiceOrder,
    setSelectedInvoiceOrder,
    toasts,
    removeToast,
  } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2E251E]">
      <Header />

      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroBanner />
            <BrandValuesStrip />
            <ShopByCategory />
            <OurStorySection />
            <FeaturedCollectionBanner />
            <ThreeDWallVisualizer />
            <ArtMatchmaker />
            <ShopAllPaintings />
            <CustomPaintingSection />
            <HowItWorksSection />
            <WhyChooseRangika />
            <GalleryInspiration />
            <CustomerReviewsSection />
          </>
        )}

        {activeTab === 'shop' && (
          <div className="pt-2">
            <ShopAllPaintings />
          </div>
        )}

        {activeTab === 'matchmaker' && (
          <div className="pt-2">
            <ArtMatchmaker />
          </div>
        )}

        {activeTab === '3d-view' && (
          <div className="pt-2">
            <ThreeDWallVisualizer />
            <ShopAllPaintings />
          </div>
        )}

        {activeTab === 'custom-painting' && (
          <div className="pt-4">
            <CustomPaintingSection />
            <HowItWorksSection />
            <WhyChooseRangika />
          </div>
        )}

        {activeTab === 'our-story' && (
          <OurStoryPage />
        )}

        {activeTab === 'wholesale' && (
          <div className="pt-4">
            <WholesaleSection />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="pt-4">
            <ContactSection />
          </div>
        )}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <AccountModal />
      <AdminDashboardModal />
      <StyleGuideModal />

      {/* Global Tax Invoice Modal (Download / Print) */}
      {selectedInvoiceOrder && (
        <AdminInvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* Product Detail Modal */}
      {selectedPainting && (
        <ProductDetailModal
          painting={selectedPainting}
          onClose={() => setSelectedPainting(null)}
        />
      )}

      {/* Quick View Modal */}
      {quickViewPainting && (
        <ProductDetailModal
          painting={quickViewPainting}
          onClose={() => setQuickViewPainting(null)}
          isQuickView={true}
        />
      )}

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#1E2D22] text-[#FAF7F2] p-4 rounded-2xl shadow-xl border border-[#3E5343] flex items-start justify-between gap-3 animate-in slide-in-from-bottom-3 duration-300"
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-[#2E7D32] flex-shrink-0 mt-0.5" />
              )}
              {toast.type === 'info' && (
                <Info className="w-5 h-5 text-[#D4943E] flex-shrink-0 mt-0.5" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h5 className="font-serif text-sm font-semibold text-white leading-snug">
                  {toast.title}
                </h5>
                <p className="text-xs text-[#D3C7B5] mt-0.5 leading-relaxed font-light">
                  {toast.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#8E7B6C] hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
