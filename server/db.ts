import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.resolve(DATA_DIR, 'rangika_database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface ProductRecord {
  id: string;
  sku: string;
  title: string;
  subtitle: string;
  category: string;
  categoryName: string;
  artist: string;
  artistLineage: string;
  style: string;
  motif: string;
  colorPalette: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  sizes: string[];
  defaultSize: string;
  framingOptions: { id: string; label: string; priceAdded: number }[];
  materials: string;
  dimensions: string;
  weightKg?: number;
  image: string;
  additionalImages?: string[];
  description: string;
  culturalStory: string;
  inStock: boolean;
  status: 'published' | 'draft';
  featured?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  orderDate: string;
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
  items: {
    id: string;
    productId: string;
    title: string;
    image: string;
    price: number;
    selectedSize: string;
    selectedFraming: { id: string; label: string; priceAdded: number };
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'Pending Verification' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus:
    | 'New Order'
    | 'Confirmed'
    | 'Processing'
    | 'Ready for Dispatch'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled'
    | 'Returned';
  cancellationReason?: string;
  courierPartner?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  totalOrders: number;
  totalSpent: number;
  savedAddresses: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }[];
}

export interface CustomRequestRecord {
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
  status:
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
  quotationAmount?: number;
  adminNotes?: string;
  convertedOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WholesaleRecord {
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
  status:
    | 'New'
    | 'Contacted'
    | 'Discussion in Progress'
    | 'Quotation Sent'
    | 'Negotiation'
    | 'Order Confirmed'
    | 'Closed';
  internalNotes?: string;
  quotationAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CouponRecord {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  status: 'active' | 'inactive';
}

export interface StockMovementRecord {
  id: string;
  productId: string;
  productTitle: string;
  change: number; // +10 or -1
  previousStock: number;
  newStock: number;
  reason: string;
  date: string;
  adminUser: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
}

export interface BusinessSettingsRecord {
  brandName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  physicalAddress: string;
  studioAddress: string;
  gstin: string;
  currencySymbol: string;
  announcementNotice: string;
  heroAnnouncement: string;
  returnPolicyDays: number;
  freeShippingThreshold: number;
  standardShippingFee: number;
  instagramUrl: string;
  facebookUrl: string;
}

export interface DatabaseSchema {
  products: ProductRecord[];
  orders: OrderRecord[];
  customers: CustomerRecord[];
  customRequests: CustomRequestRecord[];
  wholesaleEnquiries: WholesaleRecord[];
  coupons: CouponRecord[];
  stockMovements: StockMovementRecord[];
  auditLogs: AuditLogRecord[];
  settings: BusinessSettingsRecord;
  adminCredentials: {
    username: string;
    passwordHash: string; // SHA-256
    salt: string;
    updatedAt: string;
  };
}

// Initial seed helper
function getInitialSeedData(): DatabaseSchema {
  const salt = 'rangika_salt_2026';
  const defaultPassword = 'admin'; // User can change this in the Admin Panel
  const passwordHash = crypto.createHash('sha256').update(defaultPassword + salt).digest('hex');

  const products: ProductRecord[] = [
    {
      id: 'rangika-01',
      sku: 'RNG-MAYUR-01',
      title: 'The Dancing Mayur under Kadamba',
      subtitle: 'Intricate Kachni line-art with lotus pond motifs',
      category: 'nature-wildlife',
      categoryName: 'Nature & Wildlife',
      artist: 'Vidya Devi Jha',
      artistLineage: 'Madhubani Senior Master Artisan Guild',
      style: 'Kachni (Fine Line Hatching)',
      motif: 'Peacock (Mayur)',
      colorPalette: 'Earthy Terracotta & Ochre',
      price: 1850,
      originalPrice: 2800,
      stockQuantity: 12,
      sizes: ['12x16 in', '18x24 in', '24x36 in'],
      defaultSize: '18x24 in',
      framingOptions: [
        { id: 'unframed', label: 'Unframed Rolled in Archival Tube', priceAdded: 0 },
        { id: 'teak', label: 'Handcrafted Teak Wood Frame', priceAdded: 450 },
        { id: 'museum-black', label: 'Museum Grade Matte Black Frame', priceAdded: 350 },
      ],
      materials: 'Handmade 280 GSM Lokta paper, bamboo reed pen nib, natural soot & terracotta mineral pigments',
      dimensions: '18 x 24 inches',
      weightKg: 1.2,
      image: '/src/assets/images/cat_peacock_art_1791132030684.jpg',
      description: 'An iconic representation of the royal peacock in Mithila lore, symbolizing prosperity, grace, and divine beauty. Every feather is rendered with rhythmic fine-line kachni hatching.',
      culturalStory: 'In the Mithila region of northern Bihar, the peacock is revered as an emissary of monsoons and joy. Traditional lore says peacock feathers guard the home against negativity and bring peace.',
      inStock: true,
      status: 'published',
      featured: true,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 28,
      createdAt: '2026-09-15',
      updatedAt: '2026-10-01',
    },
    {
      id: 'rangika-02',
      sku: 'RNG-RADHAKRISHNA-02',
      title: 'Radha Krishna Eternal Milan',
      subtitle: 'Vibrant Bharni style with divine floral canopy',
      category: 'radha-krishna',
      categoryName: 'Radha Krishna Paintings',
      artist: 'Sunita Bharti',
      artistLineage: 'Sita Devi School of Folk Art, Jitwarpur',
      style: 'Bharni (Filled Mineral Colors)',
      motif: 'Radha Krishna',
      colorPalette: 'Vibrant Natural Mineral',
      price: 2450,
      originalPrice: 3500,
      stockQuantity: 8,
      sizes: ['18x24 in', '24x36 in', '36x48 in'],
      defaultSize: '24x36 in',
      framingOptions: [
        { id: 'unframed', label: 'Unframed Rolled in Archival Tube', priceAdded: 0 },
        { id: 'teak', label: 'Handcrafted Teak Wood Frame', priceAdded: 550 },
        { id: 'museum-black', label: 'Museum Grade Matte Black Frame', priceAdded: 400 },
      ],
      materials: 'Organic raw Tussar silk stretched on acid-free mount, natural turmeric yellow, crushed indigo and lac dye',
      dimensions: '24 x 36 inches',
      weightKg: 1.5,
      image: '/src/assets/images/cat_radhakrishna_art_1791132045679.jpg',
      description: 'A masterpiece of divine romance. Radha and Krishna stand enveloped in sacred Kadamba blossoms, accompanied by gentle sacred cows and soaring parrots.',
      culturalStory: 'Bharni paintings were historically created by women during weddings and celebrations to bless households with harmony, unconditional love, and spiritual warmth.',
      inStock: true,
      status: 'published',
      featured: true,
      isNewArrival: true,
      rating: 5.0,
      reviewCount: 34,
      createdAt: '2026-09-18',
      updatedAt: '2026-10-02',
    },
    {
      id: 'rangika-03',
      sku: 'RNG-TREE-03',
      title: 'Kalpavriksha & Sacred Matsya',
      subtitle: 'Sacred Tree of Life surrounded by fertile waters',
      category: 'traditional-mithila',
      categoryName: 'Traditional Mithila Art',
      artist: 'Baua Devi Style Lineage',
      artistLineage: 'Padma Shri Baua Devi Disciple Circle',
      style: 'Tantrik & Sacred',
      motif: 'Tree of Life (Kalpavriksha)',
      colorPalette: 'Earthy Terracotta & Ochre',
      price: 2100,
      originalPrice: 3200,
      stockQuantity: 4, // Low stock example (<5)
      sizes: ['16x20 in', '20x30 in', '30x42 in'],
      defaultSize: '20x30 in',
      framingOptions: [
        { id: 'unframed', label: 'Unframed Rolled in Archival Tube', priceAdded: 0 },
        { id: 'teak', label: 'Handcrafted Teak Wood Frame', priceAdded: 490 },
        { id: 'museum-black', label: 'Museum Grade Matte Black Frame', priceAdded: 380 },
      ],
      materials: 'Aged rice paste & natural plant dyes on handmade rag parchment paper',
      dimensions: '20 x 30 inches',
      weightKg: 1.3,
      image: '/src/assets/images/cat_treeoflife_art_1791132060397.jpg',
      description: 'The cosmic Tree of Life connecting earth, heaven, and waters. Deep roots are surrounded by pairs of sacred fish (Matsya), representing vitality, abundance, and fertility.',
      culturalStory: 'In Mithila folklore, Kalpavriksha fulfills the heartfelt desires of pure hearts. Placing this artwork in east-facing living spaces is believed to invite clarity and flourishing growth.',
      inStock: true,
      status: 'published',
      featured: true,
      isNewArrival: false,
      rating: 4.8,
      reviewCount: 19,
      createdAt: '2026-09-20',
      updatedAt: '2026-10-01',
    },
    {
      id: 'rangika-04',
      sku: 'RNG-KOHBAR-04',
      title: 'Auspicious Kohbar Bridal Blessing',
      subtitle: 'Sacred wedding chambers ritual art with bamboo groves',
      category: 'wedding-couple',
      categoryName: 'Wedding & Couple Art',
      artist: 'Smt. Godavari Devi Heritage',
      artistLineage: 'Master Artisan Lineage of Ranti Village',
      style: 'Kohbar (Wedding Blessing)',
      motif: 'Sun & Moon (Surya-Chandra)',
      colorPalette: 'Heritage Crimson & Gold',
      price: 2950,
      originalPrice: 4200,
      stockQuantity: 6,
      sizes: ['24x36 in', '30x45 in', '36x54 in'],
      defaultSize: '24x36 in',
      framingOptions: [
        { id: 'unframed', label: 'Unframed Rolled in Archival Tube', priceAdded: 0 },
        { id: 'teak', label: 'Handcrafted Teak Wood Frame', priceAdded: 600 },
        { id: 'museum-black', label: 'Museum Grade Matte Black Frame', priceAdded: 450 },
      ],
      materials: 'Fine hand-spun khadi cotton treated with cow-dung wash, sindoor red, marigold yellow, and lampblack',
      dimensions: '24 x 36 inches',
      weightKg: 1.8,
      image: '/src/assets/images/hero_mithila_art_1791131818866.jpg',
      description: 'The sacred Kohbar was historically painted on the walls of the wedding chamber to bless newlyweds with long life, marital harmony, and prosperity.',
      culturalStory: 'Featuring the Surya (Sun), Chandra (Moon), sacred bamboo grove (lineage strength), and lotus (purity), this artwork carries deep celebratory blessings for couples.',
      inStock: true,
      status: 'published',
      featured: true,
      isNewArrival: true,
      rating: 5.0,
      reviewCount: 42,
      createdAt: '2026-09-22',
      updatedAt: '2026-10-03',
    },
    {
      id: 'rangika-05',
      sku: 'RNG-SURYA-05',
      title: 'Surya Dev Cosmological Mandala',
      subtitle: 'Modern minimalist interpretation of the Mithila Sun God',
      category: 'modern-madhubani',
      categoryName: 'Modern Madhubani Art',
      artist: 'Anandita Jha & Collective',
      artistLineage: 'New Age Mithila Studio, Patna & Darbhanga',
      style: 'Contemporary Madhubani',
      motif: 'Sun & Moon (Surya-Chandra)',
      colorPalette: 'Indigo & Mustard',
      price: 1450,
      originalPrice: 2100,
      stockQuantity: 15,
      sizes: ['16x16 in', '24x24 in', '32x32 in'],
      defaultSize: '24x24 in',
      framingOptions: [
        { id: 'unframed', label: 'Unframed Rolled in Archival Tube', priceAdded: 0 },
        { id: 'teak', label: 'Handcrafted Teak Wood Frame', priceAdded: 390 },
        { id: 'museum-black', label: 'Museum Grade Matte Black Frame', priceAdded: 300 },
      ],
      materials: 'Belgian fine-grain archival canvas, natural indigo and mineral ochres',
      dimensions: '24 x 24 inches square',
      weightKg: 1.1,
      image: '/src/assets/images/cat_modern_mithila_1791132075917.jpg',
      description: 'A radiant contemporary representation of Surya Dev. Bold geometric rays merge with traditional floral borders, designed seamlessly for modern architectural spaces.',
      culturalStory: 'Surya is the giver of life and wisdom in Vedic thought. Mithila painters depict the sun with a calm, benevolent facial expression framed by 108 micro-strokes.',
      inStock: true,
      status: 'published',
      featured: false,
      isNewArrival: true,
      rating: 4.7,
      reviewCount: 16,
      createdAt: '2026-09-25',
      updatedAt: '2026-10-02',
    },
    {
      id: 'rangika-06',
      sku: 'RNG-GAJA-06',
      title: 'Royal Gaja in Lotus Sanctuary',
      subtitle: 'Fine line Kachni art celebrating wisdom and regal peace',
      category: 'nature-wildlife',
      categoryName: 'Nature & Wildlife',
      artist: 'Vidya Devi Jha',
      artistLineage: 'Madhubani Senior Master Artisan Guild',
      style: 'Kachni (Fine Line Hatching)',
      motif: 'Elephant (Gaja)',
      colorPalette: 'Monochrome Black & White',
      price: 1950,
      originalPrice: 2800,
      stockQuantity: 9,
      sizes: ['18x24 in', '24x36 in'],
      defaultSize: '18x24 in',
      framingOptions: [
        { id: 'unframed', label: 'Unframed Rolled in Archival Tube', priceAdded: 0 },
        { id: 'teak', label: 'Handcrafted Teak Wood Frame', priceAdded: 450 },
        { id: 'museum-black', label: 'Museum Grade Matte Black Frame', priceAdded: 350 },
      ],
      materials: 'Heavy handmade textured mulberry paper, pure lampblack ink with double-line hatching',
      dimensions: '18 x 24 inches',
      weightKg: 1.2,
      image: '/src/assets/images/artisan_hands_painting_1791131837940.jpg',
      description: 'An elephant adorned with ceremonial howdah blankets and floral headdress, stepping through a serene lotus forest. The fine black ink cross-hatching requires days of patient devotion.',
      culturalStory: 'The elephant (Gaja) in Mithila culture signifies royal dignity, intellect, and steadfast loyalty. Pairs of elephants are traditionally placed at entranceways for good fortune.',
      inStock: true,
      status: 'published',
      featured: false,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 22,
      createdAt: '2026-09-21',
      updatedAt: '2026-10-01',
    },
    {
      id: 'rangika-07',
      sku: 'RNG-KAMAL-07',
      title: 'Kamal Pushpa & Twin Matsya',
      subtitle: 'Auspicious water lilies with sacred swimming fish',
      category: 'traditional-mithila',
      categoryName: 'Traditional Mithila Art',
      artist: 'Smt. Godavari Devi Heritage',
      artistLineage: 'Master Artisan Lineage of Ranti Village',
      style: 'Bharni (Filled Mineral Colors)',
      motif: 'Lotus (Kamal)',
      colorPalette: 'Vibrant Natural Mineral',
      price: 1250,
      originalPrice: 1800,
      stockQuantity: 18,
      sizes: ['12x16 in', '16x20 in', '20x28 in'],
      defaultSize: '16x20 in',
      framingOptions: [
        { id: 'unframed', label: 'Unframed Rolled in Archival Tube', priceAdded: 0 },
        { id: 'teak', label: 'Handcrafted Teak Wood Frame', priceAdded: 380 },
        { id: 'museum-black', label: 'Museum Grade Matte Black Frame', priceAdded: 290 },
      ],
      materials: 'Handmade hemp paper, natural crushed stone colors and plant gum binder',
      dimensions: '16 x 20 inches',
      weightKg: 0.9,
      image: '/src/assets/images/cat_treeoflife_art_1791132060397.jpg',
      description: 'Graceful swimming fish encircling a blooming lotus blossom. Fish in Madhubani art represent life in balance, good luck, and quiet wisdom.',
      culturalStory: 'In the river plains of Mithila, water is the mother of all life. Fish motifs are painted to invite uninterrupted abundance and happiness into the hearth.',
      inStock: true,
      status: 'published',
      featured: false,
      isNewArrival: false,
      rating: 4.8,
      reviewCount: 15,
      createdAt: '2026-09-24',
      updatedAt: '2026-10-01',
    },
    {
      id: 'rangika-08',
      sku: 'RNG-RASLEELA-08',
      title: 'Divine Rasleela in Sharad Purnima',
      subtitle: 'Grand ceremonial artwork with circular gopi mandalas',
      category: 'radha-krishna',
      categoryName: 'Radha Krishna Paintings',
      artist: 'Sunita Bharti',
      artistLineage: 'Sita Devi School of Folk Art, Jitwarpur',
      style: 'Bharni (Filled Mineral Colors)',
      motif: 'Radha Krishna',
      colorPalette: 'Heritage Crimson & Gold',
      price: 3850,
      originalPrice: 5500,
      stockQuantity: 3, // Low stock (<5)
      sizes: ['30x40 in', '36x48 in', '48x60 in'],
      defaultSize: '36x48 in',
      framingOptions: [
        { id: 'unframed', label: 'Unframed Rolled in Archival Tube', priceAdded: 0 },
        { id: 'teak', label: 'Handcrafted Teak Wood Frame', priceAdded: 750 },
        { id: 'museum-black', label: 'Museum Grade Matte Black Frame', priceAdded: 550 },
      ],
      materials: 'Hand-woven raw tussar silk, 24k gold leaf foil accents, lac and mineral pigments',
      dimensions: '36 x 48 inches',
      weightKg: 2.2,
      image: '/src/assets/images/featured_paintings_collection_1791131855630.jpg',
      description: 'A grand collector-grade centerpiece. Over 60 individual figures dance in rhythmic harmony under the autumn full moon, framed by intricate five-tier ceremonial borders.',
      culturalStory: 'The Rasleela expresses the union of the individual soul with the infinite divine. Each circle represents cyclical cosmic time and celestial joy.',
      inStock: true,
      status: 'published',
      featured: true,
      isNewArrival: false,
      rating: 5.0,
      reviewCount: 38,
      createdAt: '2026-09-12',
      updatedAt: '2026-10-02',
    },
  ];

  const orders: OrderRecord[] = [
    {
      id: 'RNG-74910',
      orderNumber: 'INV-2026-001',
      orderDate: '2026-10-02',
      customerName: 'Aditi Mathur',
      email: 'aditi.mathur@gmail.com',
      phone: '+91 98450 11223',
      shippingAddress: {
        street: '45, Palm Avenue, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
      },
      items: [
        {
          id: 'cart-init-1',
          productId: 'rangika-01',
          title: 'The Dancing Mayur under Kadamba',
          image: '/src/assets/images/cat_peacock_art_1791132030684.jpg',
          price: 2300,
          selectedSize: '18x24 in',
          selectedFraming: { id: 'teak', label: 'Handcrafted Teak Wood Frame', priceAdded: 450 },
          quantity: 1,
        },
      ],
      subtotal: 2300,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 2300,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      orderStatus: 'Confirmed',
      courierPartner: 'Delhivery Express Art Care',
      trackingNumber: 'DELHIVERY-RN-883921',
      createdAt: '2026-10-02T10:15:00Z',
      updatedAt: '2026-10-02T14:30:00Z',
    },
    {
      id: 'RNG-74911',
      orderNumber: 'INV-2026-002',
      orderDate: '2026-10-03',
      customerName: 'Vikramaditya Roy',
      email: 'vikram.roy@mumbai.co',
      phone: '+91 98200 44991',
      shippingAddress: {
        street: '12-B, Sagar Tarang, Worli Sea Face',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400030',
        country: 'India',
      },
      items: [
        {
          id: 'cart-init-2',
          productId: 'rangika-05',
          title: 'Surya Dev Cosmological Mandala',
          image: '/src/assets/images/cat_modern_mithila_1791132075917.jpg',
          price: 1750,
          selectedSize: '24x24 in',
          selectedFraming: { id: 'museum-black', label: 'Museum Grade Matte Black Frame', priceAdded: 300 },
          quantity: 1,
        },
      ],
      subtotal: 1750,
      discount: 175,
      couponCode: 'MITHILA10',
      shipping: 0,
      tax: 0,
      total: 1575,
      paymentMethod: 'Card',
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      courierPartner: 'Blue Dart Art Logistics',
      trackingNumber: 'BD-ART-992104',
      createdAt: '2026-10-03T11:20:00Z',
      updatedAt: '2026-10-03T16:00:00Z',
    },
  ];

  const customers: CustomerRecord[] = [
    {
      id: 'CUST-001',
      name: 'Aditi Mathur',
      email: 'aditi.mathur@gmail.com',
      phone: '+91 98450 11223',
      registeredAt: '2026-09-10',
      totalOrders: 1,
      totalSpent: 2300,
      savedAddresses: [
        {
          street: '45, Palm Avenue, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          isDefault: true,
        },
      ],
    },
    {
      id: 'CUST-002',
      name: 'Vikramaditya Roy',
      email: 'vikram.roy@mumbai.co',
      phone: '+91 98200 44991',
      registeredAt: '2026-09-15',
      totalOrders: 1,
      totalSpent: 1575,
      savedAddresses: [
        {
          street: '12-B, Sagar Tarang, Worli Sea Face',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400030',
          country: 'India',
          isDefault: true,
        },
      ],
    },
  ];

  const customRequests: CustomRequestRecord[] = [
    {
      id: 'CR-8201',
      customerName: 'Aarav & Meera Sharma',
      mobile: '+91 98201 44321',
      email: 'aarav.sharma@example.com',
      theme: 'Wedding Kohbar Blessing',
      designRequirements: 'Custom family wedding blessing with sacred lotus, couple names in Maithili script, and two dancing peacocks.',
      preferredSize: '24x36 in',
      preferredColors: 'Natural sindoor red, turmeric and earthy ochre',
      materialPreference: 'Handmade 280 GSM Lokta paper',
      framingPreference: 'Handcrafted Teak Wood Frame',
      quantity: 1,
      budget: '₹2,500 - ₹4,000',
      deliveryDate: '2026-11-15',
      deliveryAddress: 'B-402, Heritage Palms, Worli Sea Face, Mumbai 400030',
      status: 'Painting in Progress',
      quotationAmount: 3200,
      adminNotes: 'Artisan collective is executing the central Kohbar on Lokta paper with natural dyes.',
      createdAt: '2026-09-28',
      updatedAt: '2026-10-01',
    },
  ];

  const wholesaleEnquiries: WholesaleRecord[] = [
    {
      id: 'WS-1042',
      businessName: 'Ananda Living Craft Boutique',
      contactPerson: 'Sonia Kapoor',
      phone: '+91 98112 39988',
      email: 'sonia@anandaliving.in',
      businessType: 'Home Decor & Heritage Boutique',
      requiredQuantity: 25,
      categories: ['Traditional Mithila Art', 'Modern Madhubani Art'],
      budget: '₹45,000',
      deliveryLocation: 'Connaught Place, New Delhi',
      additionalRequirements: 'Curated mix of 18x24 framed works with individual certificates of authenticity.',
      status: 'Discussion in Progress',
      internalNotes: 'Offered 25% bulk artisan discount. Preparing shipment sample catalogue.',
      quotationAmount: 38000,
      createdAt: '2026-09-30',
      updatedAt: '2026-10-02',
    },
  ];

  const coupons: CouponRecord[] = [
    {
      id: 'cpn-01',
      code: 'MITHILA10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 1000,
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      usageLimit: 500,
      usageCount: 14,
      status: 'active',
    },
    {
      id: 'cpn-02',
      code: 'HERITAGE15',
      discountType: 'percentage',
      discountValue: 15,
      minOrderValue: 2000,
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      usageLimit: 200,
      usageCount: 8,
      status: 'active',
    },
  ];

  const stockMovements: StockMovementRecord[] = [
    {
      id: 'sm-01',
      productId: 'rangika-01',
      productTitle: 'The Dancing Mayur under Kadamba',
      change: 15,
      previousStock: 0,
      newStock: 15,
      reason: 'Initial master artisan workshop intake batch',
      date: '2026-09-15',
      adminUser: 'Admin Owner',
    },
    {
      id: 'sm-02',
      productId: 'rangika-01',
      productTitle: 'The Dancing Mayur under Kadamba',
      change: -1,
      previousStock: 15,
      newStock: 14,
      reason: 'Customer Order #RNG-74910 fulfillment deduction',
      date: '2026-10-02',
      adminUser: 'System Automation',
    },
  ];

  const auditLogs: AuditLogRecord[] = [
    {
      id: 'log-01',
      timestamp: '2026-10-02 14:30:00',
      adminUser: 'Admin Owner',
      action: 'ORDER_STATUS_UPDATE',
      entity: 'Order',
      entityId: 'RNG-74910',
      details: 'Status changed from New Order to Confirmed',
    },
    {
      id: 'log-02',
      timestamp: '2026-10-03 16:00:00',
      adminUser: 'Admin Owner',
      action: 'ORDER_PROCESSING',
      entity: 'Order',
      entityId: 'RNG-74911',
      details: 'Assigned courier tracking BD-ART-992104',
    },
  ];

  const settings: BusinessSettingsRecord = {
    brandName: 'RANGIKA',
    tagline: 'ART THAT TELLS STORIES',
    contactEmail: 'namaste@rangika-art.in',
    contactPhone: '+91 98765 43210',
    whatsappNumber: '+91 98765 43210',
    physicalAddress: 'Hauz Khas Heritage Design Enclave, New Delhi 110016',
    studioAddress: 'Ranti & Jitwarpur Craft Clusters, Madhubani District, Bihar 847211',
    gstin: '10AAACR1234F1Z8',
    currencySymbol: '₹',
    announcementNotice: 'Authentic Handcrafted Mithila & Madhubani Artistry · Direct from Master Artisans of Bihar',
    heroAnnouncement: 'Rooted in Culture · Created by Hand · Made for Today',
    returnPolicyDays: 7,
    freeShippingThreshold: 0, // Free insured shipping across India
    standardShippingFee: 0,
    instagramUrl: 'https://instagram.com/rangika_art',
    facebookUrl: 'https://facebook.com/rangika.art',
  };

  return {
    products,
    orders,
    customers,
    customRequests,
    wholesaleEnquiries,
    coupons,
    stockMovements,
    auditLogs,
    settings,
    adminCredentials: {
      username: 'admin',
      passwordHash,
      salt,
      updatedAt: '2026-10-01',
    },
  };
}

// In-memory cache synced with JSON file
let dbCache: DatabaseSchema | null = null;

export function getDatabase(): DatabaseSchema {
  if (dbCache) return dbCache;

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(data);
      return dbCache!;
    } catch (err) {
      console.error('Error reading database file, using seed data:', err);
    }
  }

  // If no DB exists, initialize with seed
  dbCache = getInitialSeedData();
  saveDatabase(dbCache);
  return dbCache;
}

export function saveDatabase(data: DatabaseSchema): void {
  try {
    dbCache = data;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database to file:', err);
  }
}

// Authentication helpers
export function verifyAdminPassword(password: string): boolean {
  const db = getDatabase();
  const { passwordHash, salt } = db.adminCredentials;
  const hash = crypto.createHash('sha256').update(password + salt).digest('hex');
  return hash === passwordHash;
}

export function updateAdminPassword(newPassword: string): void {
  const db = getDatabase();
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.createHash('sha256').update(newPassword + salt).digest('hex');
  db.adminCredentials = {
    username: 'admin',
    passwordHash,
    salt,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase(db);
}

// Audit log helper
export function recordAuditLog(action: string, entity: string, entityId: string, details: string, adminUser = 'Admin'): void {
  const db = getDatabase();
  const log: AuditLogRecord = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    adminUser,
    action,
    entity,
    entityId,
    details,
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  saveDatabase(db);
}
