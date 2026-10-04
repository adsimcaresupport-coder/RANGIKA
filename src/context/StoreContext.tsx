import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Painting,
  CartItem,
  CustomPaintingRequest,
  WholesaleEnquiry,
  Order,
  Review,
  PaintingCategory,
  ArtworkStyle,
  MotifType,
  ColorPaletteType,
  OrderStatus,
  CustomRequestStatus,
  WholesaleStatus,
  StockAdjustmentLog,
  Coupon,
  CMSContent,
  AdminAuditLog,
  AdminAuth,
  CustomerRecord,
  ShippingDetails,
} from '../types';
import {
  INITIAL_PAINTINGS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_CMS_CONTENT,
  INITIAL_ORDERS,
  INITIAL_CUSTOM_REQUESTS,
  INITIAL_WHOLESALE_ENQUIRIES,
  INITIAL_STOCK_LOGS,
  INITIAL_AUDIT_LOGS,
} from '../data/paintingsData';

export interface FilterState {
  searchQuery: string;
  category: PaintingCategory | 'all';
  artist: string | 'all';
  colorPalette: ColorPaletteType | 'all';
  motif: MotifType | 'all';
  style: ArtworkStyle | 'all';
  size: string | 'all';
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest' | 'rating';
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

interface StoreContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: PaintingCategory | 'all';
  setSelectedCategory: (cat: PaintingCategory | 'all') => void;

  // Paintings Catalog
  paintings: Painting[];
  selectedPainting: Painting | null;
  setSelectedPainting: (p: Painting | null) => void;
  quickViewPainting: Painting | null;
  setQuickViewPainting: (p: Painting | null) => void;

  // Filter State
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filteredPaintings: Painting[];

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (painting: Painting, size: string, framing: { id: string; label: string; priceAdded: number }, quantity?: number) => boolean;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  cartSubtotal: number;
  appliedDiscount: { code: string; percent?: number; amount: number; description?: string } | null;
  applyDiscountCode: (code: string) => boolean;
  removeDiscountCode: () => void;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (paintingId: string) => void;
  isWishlisted: (paintingId: string) => boolean;

  // Custom Orders
  customRequests: CustomPaintingRequest[];
  submitCustomRequest: (request: Omit<CustomPaintingRequest, 'id' | 'status' | 'createdAt'>) => string;
  updateCustomRequestStatus: (
    id: string,
    status: CustomRequestStatus,
    quote?: number,
    adminNotes?: string,
    estimatedDays?: number
  ) => void;
  convertCustomToOrder: (requestId: string) => Order | null;

  // Wholesale
  wholesaleEnquiries: WholesaleEnquiry[];
  submitWholesaleEnquiry: (enquiry: Omit<WholesaleEnquiry, 'id' | 'status' | 'createdAt'>) => string;
  updateWholesaleStatus: (id: string, status: WholesaleStatus, quote?: number) => void;
  addWholesaleNote: (enquiryId: string, noteText: string) => void;
  convertWholesaleToOrder: (enquiryId: string) => Order | null;

  // Orders & Checkout
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'orderStatus'>) => Order;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    courierPartner?: string,
    notes?: string
  ) => void;
  updateOrderPaymentStatus: (
    orderId: string,
    paymentStatus: Order['paymentStatus'],
    transactionRef?: string
  ) => void;
  updateOrderShipping: (orderId: string, shipping: ShippingDetails) => void;
  cancelOrder: (orderId: string, reason: string, restoreStock?: boolean) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'verifiedPurchase'>) => void;

  // Admin & Modals
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  isCustomOrderModalOpen: boolean;
  setIsCustomOrderModalOpen: (open: boolean) => void;
  isWholesaleModalOpen: boolean;
  setIsWholesaleModalOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isStyleGuideOpen: boolean;
  setIsStyleGuideOpen: (open: boolean) => void;

  // Invoice viewer modal
  selectedInvoiceOrder: Order | null;
  setSelectedInvoiceOrder: (order: Order | null) => void;

  // Product Management
  addNewPainting: (painting: Omit<Painting, 'id'>) => void;
  updatePainting: (id: string, updates: Partial<Painting>) => void;
  deletePainting: (id: string) => void;
  duplicatePainting: (id: string) => void;
  togglePublishPainting: (id: string) => void;
  togglePaintingStock: (id: string) => void;
  updatePaintingPrice: (id: string, newPrice: number, originalPrice?: number) => void;
  updatePaintingStock: (id: string, newQty: number, reason?: string) => void;

  // Inventory & Stock Adjustment
  stockLogs: StockAdjustmentLog[];
  adjustStockWithReason: (
    paintingId: string,
    delta: number,
    reason: string,
    changeType?: StockAdjustmentLog['changeType']
  ) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;

  // CMS Content
  cmsContent: CMSContent;
  updateCMSContent: (updates: Partial<CMSContent>) => void;

  // Admin Security & Audit
  adminAuth: AdminAuth;
  adminLogin: (credentials: { email?: string; password?: string; pin?: string }) => Promise<boolean>;
  adminLogout: () => void;
  changeAdminPin: (currentPin: string, newPin: string) => Promise<{ success: boolean; message: string }>;
  adminAuditLogs: AdminAuditLog[];
  logAdminAction: (action: string, category: AdminAuditLog['category'], details: string) => void;

  // Customers CRM
  customers: CustomerRecord[];

  // Notifications
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  category: 'all',
  artist: 'all',
  colorPalette: 'all',
  motif: 'all',
  style: 'all',
  size: 'all',
  minPrice: 0,
  maxPrice: 6000,
  inStockOnly: false,
  sortBy: 'featured',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [selectedCategory, setSelectedCategoryState] = useState<PaintingCategory | 'all'>('all');

  // Load Paintings
  const [paintings, setPaintings] = useState<Painting[]>(() => {
    const saved = localStorage.getItem('rangika_paintings_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PAINTINGS;
      }
    }
    return INITIAL_PAINTINGS;
  });

  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [quickViewPainting, setQuickViewPainting] = useState<Painting | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rangika_cart_v3');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percent?: number;
    amount: number;
    description?: string;
  } | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('rangika_wishlist_v3');
    return saved ? JSON.parse(saved) : ['rangika-01', 'rangika-04'];
  });

  // Custom requests
  const [customRequests, setCustomRequests] = useState<CustomPaintingRequest[]>(() => {
    const saved = localStorage.getItem('rangika_custom_requests_v3');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOM_REQUESTS;
  });

  // Wholesale enquiries
  const [wholesaleEnquiries, setWholesaleEnquiries] = useState<WholesaleEnquiry[]>(() => {
    const saved = localStorage.getItem('rangika_wholesale_v3');
    return saved ? JSON.parse(saved) : INITIAL_WHOLESALE_ENQUIRIES;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rangika_orders_v3');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('rangika_reviews_v3');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('rangika_coupons_v3');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  // CMS Content
  const [cmsContent, setCmsContent] = useState<CMSContent>(() => {
    const saved = localStorage.getItem('rangika_cms_v3');
    return saved ? JSON.parse(saved) : INITIAL_CMS_CONTENT;
  });

  // Stock Logs
  const [stockLogs, setStockLogs] = useState<StockAdjustmentLog[]>(() => {
    const saved = localStorage.getItem('rangika_stock_logs_v3');
    return saved ? JSON.parse(saved) : INITIAL_STOCK_LOGS;
  });

  // Admin Audit Logs
  const [adminAuditLogs, setAdminAuditLogs] = useState<AdminAuditLog[]>(() => {
    const saved = localStorage.getItem('rangika_audit_logs_v3');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Admin Authentication
  const [adminAuth, setAdminAuth] = useState<AdminAuth>(() => {
    const saved = sessionStorage.getItem('rangika_admin_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      isAuthenticated: false,
      adminRole: 'owner',
      adminEmail: 'admin@rangika.art',
      adminName: 'Vandana Jha (Owner)',
    };
  });

  // Modals
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCustomOrderModalOpen, setIsCustomOrderModalOpen] = useState(false);
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isStyleGuideOpen, setIsStyleGuideOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to Backend Server & localStorage
  const syncToServer = async (payload: any) => {
    try {
      await fetch('/api/store-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      // Quiet fail if offline
    }
  };

  // Initial fetch from server to hydrate latest persisted data
  useEffect(() => {
    const hydrateFromServer = async () => {
      try {
        const res = await fetch('/api/store-data');
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          if (d.paintings && Array.isArray(d.paintings)) setPaintings(d.paintings);
          if (d.orders && Array.isArray(d.orders)) setOrders(d.orders);
          if (d.customRequests && Array.isArray(d.customRequests)) setCustomRequests(d.customRequests);
          if (d.wholesaleEnquiries && Array.isArray(d.wholesaleEnquiries)) setWholesaleEnquiries(d.wholesaleEnquiries);
          if (d.coupons && Array.isArray(d.coupons)) setCoupons(d.coupons);
          if (d.cmsContent) setCmsContent(d.cmsContent);
          if (d.stockLogs && Array.isArray(d.stockLogs)) setStockLogs(d.stockLogs);
          if (d.adminAuditLogs && Array.isArray(d.adminAuditLogs)) setAdminAuditLogs(d.adminAuditLogs);
        }
      } catch (err) {
        // Use local defaults
      }
    };
    hydrateFromServer();
  }, []);

  // Save changes to localStorage and push sync to backend
  useEffect(() => {
    localStorage.setItem('rangika_paintings_v3', JSON.stringify(paintings));
    syncToServer({ paintings });
  }, [paintings]);

  useEffect(() => {
    localStorage.setItem('rangika_cart_v3', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rangika_wishlist_v3', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('rangika_custom_requests_v3', JSON.stringify(customRequests));
    syncToServer({ customRequests });
  }, [customRequests]);

  useEffect(() => {
    localStorage.setItem('rangika_wholesale_v3', JSON.stringify(wholesaleEnquiries));
    syncToServer({ wholesaleEnquiries });
  }, [wholesaleEnquiries]);

  useEffect(() => {
    localStorage.setItem('rangika_orders_v3', JSON.stringify(orders));
    syncToServer({ orders });
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rangika_reviews_v3', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('rangika_coupons_v3', JSON.stringify(coupons));
    syncToServer({ coupons });
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('rangika_cms_v3', JSON.stringify(cmsContent));
    syncToServer({ cmsContent });
  }, [cmsContent]);

  useEffect(() => {
    localStorage.setItem('rangika_stock_logs_v3', JSON.stringify(stockLogs));
    syncToServer({ stockLogs });
  }, [stockLogs]);

  useEffect(() => {
    localStorage.setItem('rangika_audit_logs_v3', JSON.stringify(adminAuditLogs));
    syncToServer({ adminAuditLogs });
  }, [adminAuditLogs]);

  useEffect(() => {
    sessionStorage.setItem('rangika_admin_auth', JSON.stringify(adminAuth));
  }, [adminAuth]);

  // Audit Log Helper
  const logAdminAction = (action: string, category: AdminAuditLog['category'], details: string) => {
    const newLog: AdminAuditLog = {
      id: `aud-${Date.now()}`,
      action,
      category,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      performedBy: adminAuth.isAuthenticated ? adminAuth.adminName : 'System Operator',
    };
    setAdminAuditLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  // Admin Auth Methods
  const adminLogin = async (credentials: { email?: string; password?: string; pin?: string }): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setAdminAuth({
          isAuthenticated: true,
          adminRole: data.user.adminRole,
          adminEmail: data.user.adminEmail,
          adminName: data.user.adminName,
        });
        logAdminAction('Admin Logged In', 'auth', `Master administrator authenticated (${data.user.adminEmail})`);
        showToast('Welcome, Administrator', 'Access granted to RANGIKA Management Suite.');
        return true;
      } else {
        showToast('Authentication Failed', data.message || 'Incorrect credentials', 'error');
        return false;
      }
    } catch (e) {
      // Fallback offline validation
      if (
        credentials.pin === '8822' ||
        (credentials.email?.toLowerCase() === 'admin@rangika.art' && credentials.password === 'Rangika@Mithila2026')
      ) {
        setAdminAuth({
          isAuthenticated: true,
          adminRole: 'owner',
          adminEmail: 'admin@rangika.art',
          adminName: 'Vandana Jha (Owner)',
        });
        logAdminAction('Admin Logged In (Offline)', 'auth', 'Administrator authenticated via backup credentials');
        showToast('Welcome, Administrator', 'Access granted to RANGIKA Management Suite.');
        return true;
      }
      showToast('Authentication Failed', 'Invalid administrator PIN or credentials', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    logAdminAction('Admin Logged Out', 'auth', 'Administrator terminated session');
    setAdminAuth({
      isAuthenticated: false,
      adminRole: 'owner',
      adminEmail: 'admin@rangika.art',
      adminName: 'Vandana Jha (Owner)',
    });
    showToast('Signed Out', 'Administrator session closed securely.');
  };

  const changeAdminPin = async (currentPin: string, newPin: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/admin/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPin, newPin }),
      });
      const data = await res.json();
      if (data.success) {
        logAdminAction('Security PIN Changed', 'auth', 'Administrator updated master security access PIN');
        showToast('PIN Updated', 'New owner access PIN is now active.');
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Failed to update PIN' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error updating PIN' };
    }
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setSelectedCategory = (cat: PaintingCategory | 'all') => {
    setSelectedCategoryState(cat);
    setFilters((prev) => ({ ...prev, category: cat }));
    if (activeTab !== 'shop') {
      setActiveTab('shop');
    }
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSelectedCategoryState('all');
  };

  // Filtered paintings logic: EXCLUDE unpublished paintings from the public shop!
  const filteredPaintings = paintings.filter((p) => {
    // Hide unpublished paintings on customer-facing shop
    if (p.isPublished === false) {
      return false;
    }

    // Search query in title, artist, description, motifs, sku
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.artist.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.motif.toLowerCase().includes(q) ||
        p.style.toLowerCase().includes(q) ||
        p.colorPalette.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category
    if (filters.category !== 'all' && p.category !== filters.category) {
      return false;
    }

    // Artist
    if (filters.artist !== 'all' && p.artist !== filters.artist) {
      return false;
    }

    // Color Palette
    if (filters.colorPalette !== 'all' && p.colorPalette !== filters.colorPalette) {
      return false;
    }

    // Motif
    if (filters.motif !== 'all' && p.motif !== filters.motif) {
      return false;
    }

    // Artwork Style
    if (filters.style !== 'all' && p.style !== filters.style) {
      return false;
    }

    // Size
    if (filters.size !== 'all' && !p.sizes.includes(filters.size)) {
      return false;
    }

    // Price Range
    if (p.price < filters.minPrice || p.price > filters.maxPrice) {
      return false;
    }

    // In Stock Only
    if (filters.inStockOnly && (!p.inStock || (p.stockQuantity !== undefined && p.stockQuantity <= 0))) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.price - b.price;
    if (filters.sortBy === 'price-high') return b.price - a.price;
    if (filters.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    // 'featured'
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  // Cart operations with stock check
  const addToCart = (
    painting: Painting,
    size: string,
    framing: { id: string; label: string; priceAdded: number },
    quantity = 1
  ): boolean => {
    // Verify stock
    if (painting.stockQuantity !== undefined && painting.stockQuantity < quantity) {
      showToast('Insufficient Stock', `Only ${painting.stockQuantity} pieces remaining in studio inventory.`, 'error');
      return false;
    }

    if (!painting.inStock || (painting.stockQuantity !== undefined && painting.stockQuantity <= 0)) {
      showToast('Out of Stock', 'This artwork is currently out of stock.', 'error');
      return false;
    }

    const itemPrice = painting.price + framing.priceAdded;
    const itemId = `${painting.id}-${size}-${framing.id}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (painting.stockQuantity !== undefined && nextQty > painting.stockQuantity) {
          showToast('Stock Limit Reached', `Cannot add more than ${painting.stockQuantity} available units.`, 'error');
          return prev;
        }
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: nextQty } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          paintingId: painting.id,
          title: painting.title,
          image: painting.image,
          price: itemPrice,
          selectedSize: size,
          selectedFraming: framing,
          quantity,
        },
      ];
    });

    showToast(
      'Added to Art Cart',
      `"${painting.title}" (${size}, ${framing.label.split(' ')[0]}) added to your acquisition bag.`
    );
    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Removed from Cart', 'Item removed from your bag.', 'info');
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const item = cart.find((i) => i.id === itemId);
    if (item) {
      const painting = paintings.find((p) => p.id === item.paintingId);
      if (painting && painting.stockQuantity !== undefined && quantity > painting.stockQuantity) {
        showToast('Stock Limit Reached', `Only ${painting.stockQuantity} units in stock.`, 'error');
        return;
      }
    }

    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const applyDiscountCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
      showToast('Invalid Coupon', 'Code not recognized. Try FESTIVE15 or MITHILA500', 'error');
      return false;
    }

    if (!coupon.isActive) {
      showToast('Coupon Inactive', 'This promotional code is no longer active', 'error');
      return false;
    }

    const today = new Date().toISOString().split('T')[0];
    if (coupon.expiryDate && today > coupon.expiryDate) {
      showToast('Coupon Expired', 'This promotional code has expired', 'error');
      return false;
    }

    if (cartSubtotal < coupon.minOrderValue) {
      showToast(
        'Minimum Value Required',
        `Add items worth ₹${(coupon.minOrderValue - cartSubtotal).toLocaleString('en-IN')} more to unlock this discount`,
        'error'
      );
      return false;
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * coupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(coupon.discountValue, cartSubtotal);
    }

    setAppliedDiscount({
      code: coupon.code,
      percent: coupon.discountType === 'percentage' ? coupon.discountValue : undefined,
      amount: discountAmount,
      description: coupon.description,
    });

    // Increment usage
    setCoupons((prev) =>
      prev.map((c) => (c.id === coupon.id ? { ...c, usageCount: c.usageCount + 1 } : c))
    );

    showToast('Promotion Applied', `You saved ₹${discountAmount.toLocaleString('en-IN')} with code ${coupon.code}!`);
    return true;
  };

  const removeDiscountCode = () => {
    setAppliedDiscount(null);
    showToast('Coupon Removed', 'Discount removed from bag', 'info');
  };

  const cartTotal = Math.max(0, cartSubtotal - (appliedDiscount?.amount || 0));

  // Wishlist
  const toggleWishlist = (paintingId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(paintingId);
      if (exists) {
        showToast('Removed from Favorites', 'Painting removed from your saved list.', 'info');
        return prev.filter((id) => id !== paintingId);
      } else {
        showToast('Saved to Favorites', 'Painting saved to your patron wishlist.');
        return [...prev, paintingId];
      }
    });
  };

  const isWishlisted = (paintingId: string) => wishlist.includes(paintingId);

  // Stock Adjustment Engine
  const adjustStockWithReason = (
    paintingId: string,
    delta: number,
    reason: string,
    changeType: StockAdjustmentLog['changeType'] = 'correction'
  ) => {
    const painting = paintings.find((p) => p.id === paintingId);
    if (!painting) return;

    const prevStock = painting.stockQuantity ?? 5;
    const newStock = Math.max(0, prevStock + delta);
    const inStock = newStock > 0;

    setPaintings((prev) =>
      prev.map((p) =>
        p.id === paintingId
          ? {
              ...p,
              stockQuantity: newStock,
              inStock,
            }
          : p
      )
    );

    const logItem: StockAdjustmentLog = {
      id: `sl-${Date.now()}`,
      paintingId,
      paintingTitle: painting.title,
      sku: painting.sku || `RNG-${paintingId.slice(-4).toUpperCase()}`,
      changeType,
      quantityChanged: delta,
      previousStock: prevStock,
      newStock,
      reason,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      performedBy: adminAuth.isAuthenticated ? adminAuth.adminName : 'Studio Inventory Manager',
    };

    setStockLogs((prev) => [logItem, ...prev]);
    logAdminAction(
      'Stock Adjusted',
      'inventory',
      `Stock for "${painting.title}" changed from ${prevStock} to ${newStock} (${delta > 0 ? '+' : ''}${delta}). Reason: ${reason}`
    );
    showToast('Stock Adjusted', `Stock for "${painting.title}" updated to ${newStock} units.`);
  };

  // Orders Management
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'orderStatus'>): Order => {
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const id = `RNG-${orderNumber}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      ...orderData,
      id,
      invoiceNumber,
      orderStatus: 'Order Confirmed',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      trackingNumber: `DELHIVERY-RN-${Math.floor(100000 + Math.random() * 900000)}`,
      courierPartner: 'Delhivery Express Art Care',
      shippingDetails: {
        courierPartner: 'Delhivery Express Art Care',
        trackingNumber: `DELHIVERY-RN-${Math.floor(100000 + Math.random() * 900000)}`,
        trackingUrl: `https://www.delhivery.com/track/package/DELHIVERY-RN-${orderNumber}`,
        dispatchDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      },
      paymentDetails: {
        method: orderData.paymentMethod,
        status: orderData.paymentStatus,
        transactionRef: `TXN-${Date.now().toString().slice(-8)}`,
        verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        verifiedBy: orderData.paymentStatus === 'Paid' ? 'Verified Gateway' : undefined,
      },
    };

    // Deduct stock for each purchased item
    orderData.items.forEach((item) => {
      adjustStockWithReason(
        item.paintingId,
        -item.quantity,
        `Auto-deducted for new order #${id}`,
        'order_deduct'
      );
    });

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setAppliedDiscount(null);
    logAdminAction('New Order Received', 'order', `Order #${id} placed by ${orderData.customerName} for ₹${orderData.total.toLocaleString('en-IN')}`);
    showToast('Order Placed Successfully!', `Order ${id} confirmed! Invoice ${invoiceNumber} generated.`);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    courierPartner?: string,
    notes?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: status,
              updatedAt: new Date().toISOString().split('T')[0],
              ...(trackingNumber ? { trackingNumber } : {}),
              ...(courierPartner ? { courierPartner } : {}),
              ...(notes ? { notes } : {}),
              shippingDetails: {
                ...(o.shippingDetails || { courierPartner: 'Delhivery', trackingNumber: '' }),
                ...(courierPartner ? { courierPartner } : {}),
                ...(trackingNumber ? { trackingNumber } : {}),
              },
            }
          : o
      )
    );

    logAdminAction('Order Status Changed', 'order', `Order #${orderId} status set to "${status}"`);
    showToast('Order Status Updated', `Order ${orderId} is now "${status}".`);
  };

  const updateOrderPaymentStatus = (
    orderId: string,
    paymentStatus: Order['paymentStatus'],
    transactionRef?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus,
              updatedAt: new Date().toISOString().split('T')[0],
              paymentDetails: {
                ...(o.paymentDetails || { method: o.paymentMethod, status: paymentStatus }),
                status: paymentStatus,
                transactionRef: transactionRef || o.paymentDetails?.transactionRef || `REF-${Date.now().toString().slice(-6)}`,
                verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                verifiedBy: adminAuth.isAuthenticated ? adminAuth.adminName : 'Administrator',
              },
            }
          : o
      )
    );

    logAdminAction('Payment Status Updated', 'order', `Order #${orderId} payment marked as "${paymentStatus}"`);
    showToast('Payment Updated', `Order ${orderId} payment status verified as "${paymentStatus}".`);
  };

  const updateOrderShipping = (orderId: string, shipping: ShippingDetails) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              trackingNumber: shipping.trackingNumber,
              courierPartner: shipping.courierPartner,
              shippingDetails: shipping,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : o
      )
    );

    logAdminAction('Shipping Details Added', 'order', `Order #${orderId} courier assigned: ${shipping.courierPartner} (${shipping.trackingNumber})`);
    showToast('Shipping Assigned', `Tracking updated for order ${orderId}.`);
  };

  const cancelOrder = (orderId: string, reason: string, restoreStock = true) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (restoreStock && order.orderStatus !== 'Cancelled') {
      order.items.forEach((item) => {
        adjustStockWithReason(
          item.paintingId,
          item.quantity,
          `Restored upon cancellation of Order #${orderId}. Reason: ${reason}`,
          'cancel_restore'
        );
      });
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: 'Cancelled',
              cancellationReason: reason,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : o
      )
    );

    logAdminAction('Order Cancelled', 'order', `Order #${orderId} cancelled. Reason: ${reason}`);
    showToast('Order Cancelled', `Order ${orderId} cancelled. Inventory restored accordingly.`, 'info');
  };

  // Product Management
  const addNewPainting = (newP: Omit<Painting, 'id'>) => {
    const id = `rangika-${Date.now().toString().slice(-4)}`;
    const sku = newP.sku || `RNG-${newP.category.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const painting: Painting = {
      ...newP,
      id,
      sku,
      stockQuantity: newP.stockQuantity ?? 5,
      lowStockThreshold: newP.lowStockThreshold ?? 3,
      isPublished: newP.isPublished ?? true,
      inStock: (newP.stockQuantity ?? 5) > 0,
    };
    setPaintings((prev) => [painting, ...prev]);

    // Initial stock log
    adjustStockWithReason(
      id,
      painting.stockQuantity || 5,
      'Initial stock registered on product creation',
      'add'
    );

    logAdminAction('Product Added', 'product', `New painting "${painting.title}" (SKU: ${sku}) created and published`);
    showToast('New Painting Added', `"${painting.title}" is now available in your studio catalog.`);
  };

  const updatePainting = (id: string, updates: Partial<Painting>) => {
    setPaintings((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updates };
        if (updates.stockQuantity !== undefined) {
          updated.inStock = updates.stockQuantity > 0;
        }
        return updated;
      })
    );

    logAdminAction('Product Updated', 'product', `Updated details for painting ID ${id}`);
    showToast('Painting Updated', 'Product changes saved successfully.');
  };

  const deletePainting = (id: string) => {
    const p = paintings.find((item) => item.id === id);
    setPaintings((prev) => prev.filter((item) => item.id !== id));
    logAdminAction('Product Deleted', 'product', `Deleted painting "${p?.title || id}" from catalog`);
    showToast('Painting Deleted', `"${p?.title || id}" removed from catalog.`, 'info');
  };

  const duplicatePainting = (id: string) => {
    const original = paintings.find((item) => item.id === id);
    if (!original) return;

    const newId = `rangika-${Date.now().toString().slice(-4)}`;
    const newSku = `${original.sku || 'RNG'}-COPY`;
    const copy: Painting = {
      ...original,
      id: newId,
      sku: newSku,
      title: `${original.title} (Masterpiece Copy)`,
      isPublished: false, // Start as draft for safety
      stockQuantity: 1,
      inStock: true,
    };

    setPaintings((prev) => [copy, ...prev]);
    logAdminAction('Product Duplicated', 'product', `Duplicated "${original.title}" as new draft "${copy.title}"`);
    showToast('Painting Duplicated', `Created draft duplicate "${copy.title}". Edit details to publish.`);
  };

  const togglePublishPainting = (id: string) => {
    setPaintings((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !(p.isPublished ?? true);
          logAdminAction(
            next ? 'Product Published' : 'Product Unpublished',
            'product',
            `"${p.title}" is now ${next ? 'visible on public shop' : 'hidden from public shop'}`
          );
          showToast(
            next ? 'Painting Published' : 'Painting Unpublished',
            next ? 'Painting is now visible in the online shop.' : 'Painting is now hidden from public visitors.'
          );
          return { ...p, isPublished: next };
        }
        return p;
      })
    );
  };

  const togglePaintingStock = (id: string) => {
    setPaintings((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStock = !p.inStock;
          const nextQty = nextStock ? Math.max(1, p.stockQuantity ?? 1) : 0;
          logAdminAction(
            'Stock Availability Toggled',
            'inventory',
            `Marked "${p.title}" as ${nextStock ? 'In Stock' : 'Out of Stock'}`
          );
          return { ...p, inStock: nextStock, stockQuantity: nextQty };
        }
        return p;
      })
    );
    showToast('Stock Availability Changed', 'Inventory availability updated.');
  };

  const updatePaintingPrice = (id: string, newPrice: number, originalPrice?: number) => {
    setPaintings((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              price: newPrice,
              originalPrice: originalPrice || p.originalPrice || Math.round(newPrice * 1.25),
            }
          : p
      )
    );
    logAdminAction('Price Updated', 'product', `Price of painting ID ${id} set to ₹${newPrice.toLocaleString('en-IN')}`);
    showToast('Price Updated', `Price set to ₹${newPrice.toLocaleString('en-IN')}`);
  };

  const updatePaintingStock = (id: string, newQty: number, reason = 'Direct inventory count update') => {
    const p = paintings.find((item) => item.id === id);
    if (!p) return;
    const delta = newQty - (p.stockQuantity ?? 0);
    adjustStockWithReason(id, delta, reason, 'correction');
  };

  // Custom Painting Requests
  const submitCustomRequest = (
    data: Omit<CustomPaintingRequest, 'id' | 'status' | 'createdAt'>
  ): string => {
    const id = `CR-${Math.floor(8000 + Math.random() * 2000)}`;
    const newRequest: CustomPaintingRequest = {
      ...data,
      id,
      status: 'New Request',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setCustomRequests((prev) => [newRequest, ...prev]);
    logAdminAction('Custom Request Received', 'custom', `New custom painting request #${id} from ${data.customerName}`);
    showToast('Custom Request Submitted', `Order request ${id} received! Our master artisans will prepare a quotation.`);
    return id;
  };

  const updateCustomRequestStatus = (
    id: string,
    status: CustomRequestStatus,
    quote?: number,
    adminNotes?: string,
    estimatedDays?: number
  ) => {
    setCustomRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              updatedAt: new Date().toISOString().split('T')[0],
              ...(quote !== undefined ? { quotationAmount: quote } : {}),
              ...(adminNotes !== undefined ? { adminNotes } : {}),
              ...(estimatedDays !== undefined ? { estimatedDays } : {}),
            }
          : r
      )
    );
    logAdminAction('Custom Request Updated', 'custom', `Request #${id} status changed to "${status}"`);
    showToast('Custom Request Updated', `Request ${id} updated to status "${status}".`);
  };

  const convertCustomToOrder = (requestId: string): Order | null => {
    const req = customRequests.find((r) => r.id === requestId);
    if (!req) return null;

    const quote = req.quotationAmount || 3500;
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const orderId = `RNG-CUST-${orderNumber}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: orderId,
      invoiceNumber,
      customerName: req.customerName,
      email: req.email,
      phone: req.mobile,
      shippingAddress: {
        street: req.deliveryAddress || 'Address on file',
        city: 'Client Destination',
        state: 'India',
        postalCode: '000000',
        country: 'India',
      },
      items: [
        {
          id: `custom-item-${requestId}`,
          paintingId: `custom-${requestId}`,
          title: `Custom Mithila: ${req.theme}`,
          image: req.referenceImage || '/src/assets/images/hero_mithila_art_1791131818866.jpg',
          price: quote,
          selectedSize: req.preferredSize || 'Custom Size',
          selectedFraming: {
            id: 'custom-frame',
            label: req.framingPreference || 'Handcrafted Teak Wood Frame',
            priceAdded: 0,
          },
          quantity: req.quantity || 1,
        },
      ],
      subtotal: quote,
      discount: 0,
      shipping: 0,
      total: quote,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      orderStatus: 'Order Confirmed',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      trackingNumber: `DELHIVERY-CUSTOM-${orderNumber}`,
      courierPartner: 'Delhivery Express Art Care',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Mark custom request as converted
    setCustomRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Order Confirmed',
              convertedOrderId: orderId,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : r
      )
    );

    logAdminAction('Custom Request Converted to Order', 'custom', `Converted Custom Request #${requestId} to Order #${orderId}`);
    showToast('Converted to Order!', `Custom commission #${requestId} converted into Order #${orderId}.`);
    return newOrder;
  };

  // Wholesale
  const submitWholesaleEnquiry = (
    data: Omit<WholesaleEnquiry, 'id' | 'status' | 'createdAt'>
  ): string => {
    const id = `WS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEnquiry: WholesaleEnquiry = {
      ...data,
      id,
      status: 'New',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setWholesaleEnquiries((prev) => [newEnquiry, ...prev]);
    logAdminAction('Wholesale Enquiry Received', 'wholesale', `New wholesale enquiry #${id} from ${data.businessName} (${data.contactPerson})`);
    showToast('Enquiry Sent', `Wholesale enquiry ${id} submitted! Our partnership team will review.`);
    return id;
  };

  const updateWholesaleStatus = (id: string, status: WholesaleStatus, quote?: number) => {
    setWholesaleEnquiries((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status,
              updatedAt: new Date().toISOString().split('T')[0],
              ...(quote !== undefined ? { quotationAmount: quote } : {}),
            }
          : w
      )
    );
    logAdminAction('Wholesale Status Updated', 'wholesale', `Wholesale enquiry #${id} set to "${status}"`);
    showToast('Wholesale Status Updated', `Enquiry ${id} updated to "${status}".`);
  };

  const addWholesaleNote = (enquiryId: string, noteText: string) => {
    if (!noteText.trim()) return;
    const noteItem = {
      id: `wn-${Date.now()}`,
      note: noteText.trim(),
      author: adminAuth.isAuthenticated ? adminAuth.adminName : 'Admin Team',
      date: new Date().toISOString().split('T')[0],
    };

    setWholesaleEnquiries((prev) =>
      prev.map((w) =>
        w.id === enquiryId
          ? {
              ...w,
              internalNotes: [noteItem, ...(w.internalNotes || [])],
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : w
      )
    );
    logAdminAction('Wholesale Note Added', 'wholesale', `Added note to enquiry #${enquiryId}`);
    showToast('Internal Note Added', 'Wholesale interaction recorded.');
  };

  const convertWholesaleToOrder = (enquiryId: string): Order | null => {
    const ws = wholesaleEnquiries.find((w) => w.id === enquiryId);
    if (!ws) return null;

    const amount = ws.quotationAmount || 150000;
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const orderId = `RNG-BULK-${orderNumber}`;
    const invoiceNumber = `INV-B2B-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: orderId,
      invoiceNumber,
      customerName: `${ws.businessName} (Attn: ${ws.contactPerson})`,
      email: ws.email,
      phone: ws.phone,
      shippingAddress: {
        street: ws.deliveryLocation || 'Business Premises',
        city: ws.deliveryLocation || 'Commercial Hub',
        state: 'India',
        postalCode: '000000',
        country: 'India',
      },
      items: [
        {
          id: `bulk-${enquiryId}`,
          paintingId: 'wholesale-curated-set',
          title: `Curated Wholesale Consignment (${ws.requiredQuantity} Artworks)`,
          image: '/src/assets/images/featured_paintings_collection_1791131855630.jpg',
          price: amount,
          selectedSize: 'Mixed 18x24 & 24x36',
          selectedFraming: {
            id: 'archival-teak',
            label: 'Teak Frame & Authenticity Cards',
            priceAdded: 0,
          },
          quantity: 1,
        },
      ],
      subtotal: amount,
      discount: 0,
      shipping: 0,
      total: amount,
      paymentMethod: 'NetBanking',
      paymentStatus: 'Paid',
      orderStatus: 'Order Confirmed',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      trackingNumber: `CONSIGN-RN-${orderNumber}`,
      courierPartner: 'SafeXpress Dedicated Art Freight',
    };

    setOrders((prev) => [newOrder, ...prev]);

    setWholesaleEnquiries((prev) =>
      prev.map((w) =>
        w.id === enquiryId
          ? {
              ...w,
              status: 'Order Confirmed',
              convertedOrderId: orderId,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : w
      )
    );

    logAdminAction('Wholesale Converted to B2B Order', 'wholesale', `Converted Wholesale #${enquiryId} (${ws.businessName}) to B2B Order #${orderId}`);
    showToast('B2B Order Generated!', `Wholesale enquiry converted into commercial order #${orderId}.`);
    return newOrder;
  };

  // Coupons Management
  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usageCount'>) => {
    const id = `coup-${Date.now()}`;
    const newCoupon: Coupon = {
      ...couponData,
      id,
      code: couponData.code.trim().toUpperCase(),
      usageCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    logAdminAction('Coupon Created', 'coupon', `Created promotional coupon code "${newCoupon.code}"`);
    showToast('Coupon Created', `Discount code "${newCoupon.code}" is now active.`);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...updates,
              ...(updates.code ? { code: updates.code.trim().toUpperCase() } : {}),
            }
          : c
      )
    );
    logAdminAction('Coupon Updated', 'coupon', `Updated coupon ID ${id}`);
    showToast('Coupon Updated', 'Promotional offer saved.');
  };

  const deleteCoupon = (id: string) => {
    const c = coupons.find((item) => item.id === id);
    setCoupons((prev) => prev.filter((item) => item.id !== id));
    logAdminAction('Coupon Deleted', 'coupon', `Deleted coupon code "${c?.code || id}"`);
    showToast('Coupon Deleted', 'Offer code deleted.', 'info');
  };

  const toggleCouponActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    showToast('Coupon Status Toggled', 'Offer availability updated.');
  };

  // CMS Content Management
  const updateCMSContent = (updates: Partial<CMSContent>) => {
    setCmsContent((prev) => ({
      ...prev,
      ...updates,
    }));
    logAdminAction('Website Content Updated', 'cms', 'Updated storefront content, announcement banners, or policy copy');
    showToast('Website Content Updated', 'Changes are live across the customer storefront!');
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'verifiedPurchase'>) => {
    const id = `rev-${Date.now()}`;
    const newRev: Review = {
      ...reviewData,
      id,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      verifiedPurchase: true,
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Review Submitted', 'Thank you! Your verified feedback helps keep Mithila traditions alive.');
  };

  // Derived Customers CRM (Aggregated from Orders & Accounts)
  const customers: CustomerRecord[] = React.useMemo(() => {
    const customerMap = new Map<string, CustomerRecord>();

    orders.forEach((order) => {
      const email = order.email.toLowerCase();
      const existing = customerMap.get(email);

      const addressObj = order.shippingAddress;

      if (!existing) {
        customerMap.set(email, {
          id: `cust-${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
          name: order.customerName,
          email: order.email,
          phone: order.phone,
          totalOrders: 1,
          totalSpent: order.total,
          firstOrderDate: order.createdAt,
          lastOrderDate: order.createdAt,
          addresses: [addressObj],
          orders: [order],
          customRequests: [],
        });
      } else {
        existing.totalOrders += 1;
        existing.totalSpent += order.total;
        if (order.createdAt > existing.lastOrderDate) {
          existing.lastOrderDate = order.createdAt;
        }
        if (order.createdAt < existing.firstOrderDate) {
          existing.firstOrderDate = order.createdAt;
        }
        existing.orders.push(order);

        // Deduplicate address
        const hasAddr = existing.addresses.some(
          (a) => a.street === addressObj.street && a.postalCode === addressObj.postalCode
        );
        if (!hasAddr) {
          existing.addresses.push(addressObj);
        }
      }
    });

    // Also link custom requests by email
    customRequests.forEach((req) => {
      const email = req.email.toLowerCase();
      const existing = customerMap.get(email);
      if (existing) {
        existing.customRequests.push(req);
      } else {
        customerMap.set(email, {
          id: `cust-${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
          name: req.customerName,
          email: req.email,
          phone: req.mobile,
          totalOrders: 0,
          totalSpent: 0,
          firstOrderDate: req.createdAt,
          lastOrderDate: req.createdAt,
          addresses: [
            {
              street: req.deliveryAddress,
              city: 'Address from Custom Order',
              state: 'India',
              postalCode: '',
              country: 'India',
            },
          ],
          orders: [],
          customRequests: [req],
        });
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders, customRequests]);

  return (
    <StoreContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        paintings,
        selectedPainting,
        setSelectedPainting,
        quickViewPainting,
        setQuickViewPainting,
        filters,
        setFilters,
        resetFilters,
        filteredPaintings,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        cartSubtotal,
        appliedDiscount,
        applyDiscountCode,
        removeDiscountCode,
        cartTotal,
        wishlist,
        toggleWishlist,
        isWishlisted,
        customRequests,
        submitCustomRequest,
        updateCustomRequestStatus,
        convertCustomToOrder,
        wholesaleEnquiries,
        submitWholesaleEnquiry,
        updateWholesaleStatus,
        addWholesaleNote,
        convertWholesaleToOrder,
        orders,
        createOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        updateOrderShipping,
        cancelOrder,
        reviews,
        addReview,
        isAdminOpen,
        setIsAdminOpen,
        isAccountOpen,
        setIsAccountOpen,
        isCustomOrderModalOpen,
        setIsCustomOrderModalOpen,
        isWholesaleModalOpen,
        setIsWholesaleModalOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isStyleGuideOpen,
        setIsStyleGuideOpen,
        selectedInvoiceOrder,
        setSelectedInvoiceOrder,
        addNewPainting,
        updatePainting,
        deletePainting,
        duplicatePainting,
        togglePublishPainting,
        togglePaintingStock,
        updatePaintingPrice,
        updatePaintingStock,
        stockLogs,
        adjustStockWithReason,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponActive,
        cmsContent,
        updateCMSContent,
        adminAuth,
        adminLogin,
        adminLogout,
        changeAdminPin,
        adminAuditLogs,
        logAdminAction,
        customers,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
