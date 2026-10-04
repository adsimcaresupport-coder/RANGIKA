export type PaintingCategory =
  | 'traditional-mithila'
  | 'radha-krishna'
  | 'nature-wildlife'
  | 'wedding-couple'
  | 'modern-madhubani';

export type ArtworkStyle =
  | 'Bharni (Filled Mineral Colors)'
  | 'Kachni (Fine Line Hatching)'
  | 'Tantrik & Sacred'
  | 'Kohbar (Wedding Blessing)'
  | 'Contemporary Madhubani';

export type MotifType =
  | 'Peacock (Mayur)'
  | 'Fish (Matsya)'
  | 'Tree of Life (Kalpavriksha)'
  | 'Radha Krishna'
  | 'Lotus (Kamal)'
  | 'Sun & Moon (Surya-Chandra)'
  | 'Elephant (Gaja)';

export type ColorPaletteType =
  | 'Earthy Terracotta & Ochre'
  | 'Vibrant Natural Mineral'
  | 'Monochrome Black & White'
  | 'Indigo & Mustard'
  | 'Heritage Crimson & Gold';

export interface Painting {
  id: string;
  sku?: string;
  title: string;
  subtitle: string;
  category: PaintingCategory;
  categoryName: string;
  artist: string;
  artistLineage: string;
  style: ArtworkStyle;
  motif: MotifType;
  colorPalette: ColorPaletteType;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  stockQuantity?: number;
  lowStockThreshold?: number;
  weight?: string;
  isPublished?: boolean;
  sizes: string[];
  defaultSize: string;
  framingOptions: {
    id: string;
    label: string;
    priceAdded: number;
  }[];
  materials: string;
  dimensions: string;
  image: string;
  additionalImages?: string[];
  description: string;
  culturalStory: string;
  inStock: boolean;
  featured?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  id: string;
  paintingId: string;
  title: string;
  image: string;
  price: number;
  selectedSize: string;
  selectedFraming: {
    id: string;
    label: string;
    priceAdded: number;
  };
  quantity: number;
}

export type OrderStatus =
  | 'New Order'
  | 'Order Confirmed'
  | 'Artwork Preparation'
  | 'Quality Check'
  | 'Ready for Dispatch'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export interface ShippingDetails {
  courierPartner: string;
  trackingNumber: string;
  trackingUrl?: string;
  dispatchDate?: string;
  estimatedDelivery?: string;
}

export interface PaymentDetails {
  method: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  status: 'Paid' | 'Pending Verification' | 'Refunded' | 'Failed';
  transactionRef?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface Order {
  id: string;
  invoiceNumber?: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending Verification' | 'Refunded' | 'Failed';
  paymentDetails?: PaymentDetails;
  orderStatus: OrderStatus;
  shippingDetails?: ShippingDetails;
  trackingNumber?: string;
  courierPartner?: string;
  cancellationReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CustomRequestStatus =
  | 'New Request'
  | 'Under Discussion'
  | 'Quotation Sent'
  | 'Awaiting Approval'
  | 'Order Confirmed'
  | 'Painting in Progress'
  | 'Quality Check'
  | 'Ready for Dispatch'
  | 'Shipped'
  | 'Completed'
  | 'Cancelled';

export interface CustomPaintingRequest {
  id: string;
  customerName: string;
  mobile: string;
  email: string;
  theme: string;
  designRequirements: string;
  preferredSize: string;
  preferredColors: string;
  materialPreference: string;
  framingPreference: string;
  quantity: number;
  budget: string;
  deliveryDate: string;
  deliveryAddress: string;
  additionalInstructions?: string;
  referenceImage?: string;
  status: CustomRequestStatus;
  quotationAmount?: number;
  estimatedDays?: number;
  adminNotes?: string;
  convertedOrderId?: string;
  createdAt: string;
  updatedAt?: string;
}

export type WholesaleStatus =
  | 'New'
  | 'Contacted'
  | 'Discussion in Progress'
  | 'Quotation Sent'
  | 'Negotiation'
  | 'Order Confirmed'
  | 'Closed';

export interface WholesaleInternalNote {
  id: string;
  note: string;
  author: string;
  date: string;
}

export interface WholesaleEnquiry {
  id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  businessType: string;
  requiredQuantity: number;
  categories: string[];
  budget: string;
  deliveryLocation: string;
  additionalRequirements: string;
  status: WholesaleStatus;
  quotationAmount?: number;
  convertedOrderId?: string;
  internalNotes?: WholesaleInternalNote[];
  createdAt: string;
  updatedAt?: string;
}

export interface StockAdjustmentLog {
  id: string;
  paintingId: string;
  paintingTitle: string;
  sku: string;
  changeType: 'add' | 'reduce' | 'correction' | 'order_deduct' | 'cancel_restore';
  quantityChanged: number;
  previousStock: number;
  newStock: number;
  reason: string;
  date: string;
  performedBy: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  eligibleCategories: string[];
  isActive: boolean;
  description: string;
}

export interface CMSContent {
  announcementText: string;
  bannerHeadline: string;
  bannerSubtitle: string;
  bannerBadge: string;
  bannerButtonText: string;
  promoBannerText: string;
  featuredPaintingIds: string[];
  newArrivalPaintingIds: string[];
  businessName: string;
  ownerName: string;
  businessEmail: string;
  businessPhone: string;
  whatsappNumber: string;
  studioAddress: string;
  gstin: string;
  pan: string;
  shippingPolicyText: string;
  returnPolicyText: string;
  authenticityGuaranteeText: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
    pinterest: string;
  };
}

export interface AdminAuditLog {
  id: string;
  action: string;
  category: 'order' | 'product' | 'inventory' | 'custom' | 'wholesale' | 'coupon' | 'cms' | 'auth';
  details: string;
  timestamp: string;
  performedBy: string;
}

export interface AdminAuth {
  isAuthenticated: boolean;
  adminRole: 'owner' | 'manager';
  adminEmail: string;
  adminName: string;
}

export interface Review {
  id: string;
  paintingId: string;
  paintingTitle: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  firstOrderDate: string;
  addresses: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }[];
  orders: Order[];
  customRequests: CustomPaintingRequest[];
}
