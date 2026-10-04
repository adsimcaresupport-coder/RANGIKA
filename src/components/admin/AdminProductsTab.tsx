import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Check,
  X,
  AlertTriangle,
  Upload,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Painting, PaintingCategory, ArtworkStyle, MotifType, ColorPaletteType } from '../../types';

export const AdminProductsTab: React.FC = () => {
  const {
    paintings,
    addNewPainting,
    updatePainting,
    deletePainting,
    duplicatePainting,
    togglePublishPainting,
    togglePaintingStock,
    showToast,
  } = useStore();

  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState<PaintingCategory>('traditional-mithila');
  const [formArtist, setFormArtist] = useState('Vidya Devi Jha');
  const [formArtistLineage, setFormArtistLineage] = useState('Madhubani Senior Master Artisan Guild');
  const [formStyle, setFormStyle] = useState<ArtworkStyle>('Kachni (Fine Line Hatching)');
  const [formMotif, setFormMotif] = useState<MotifType>('Peacock (Mayur)');
  const [formColorPalette, setFormColorPalette] = useState<ColorPaletteType>('Earthy Terracotta & Ochre');
  const [formPrice, setFormPrice] = useState<number>(1850);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(2500);
  const [formStockQuantity, setFormStockQuantity] = useState<number>(5);
  const [formLowStockThreshold, setFormLowStockThreshold] = useState<number>(3);
  const [formSku, setFormSku] = useState('');
  const [formWeight, setFormWeight] = useState('450g');
  const [formDimensions, setFormDimensions] = useState('18 x 24 inches');
  const [formMaterials, setFormMaterials] = useState('Handmade 280 GSM Lokta paper, bamboo pen nib, natural pigments');
  const [formDescription, setFormDescription] = useState('Authentic hand-painted Mithila artwork created with ancestral fine-line techniques.');
  const [formCulturalStory, setFormCulturalStory] = useState('Preserves traditional Bihar folk symbols of auspicious harmony and prosperity.');
  const [formIsPublished, setFormIsPublished] = useState<boolean>(true);
  const [formFeatured, setFormFeatured] = useState<boolean>(false);
  const [formIsNewArrival, setFormIsNewArrival] = useState<boolean>(false);
  const [formMainImage, setFormMainImage] = useState<string>('/src/assets/images/cat_peacock_art_1791132030684.jpg');
  const [formAdditionalImages, setFormAdditionalImages] = useState<string[]>([]);
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');

  // Open Editor for New Product
  const handleOpenNew = () => {
    setEditingId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormCategory('traditional-mithila');
    setFormArtist('Vidya Devi Jha');
    setFormArtistLineage('Madhubani Senior Master Artisan Guild');
    setFormStyle('Kachni (Fine Line Hatching)');
    setFormMotif('Peacock (Mayur)');
    setFormColorPalette('Earthy Terracotta & Ochre');
    setFormPrice(1850);
    setFormOriginalPrice(2500);
    setFormStockQuantity(5);
    setFormLowStockThreshold(3);
    setFormSku(`RNG-MITH-${Math.floor(100 + Math.random() * 900)}`);
    setFormWeight('450g');
    setFormDimensions('18 x 24 inches');
    setFormMaterials('Handmade 280 GSM Lokta paper, natural mineral pigments');
    setFormDescription('Authentic handcrafted Mithila painting created by Bihar master artisans.');
    setFormCulturalStory('Symbolizes blessings, harmony, and eternal joy in traditional Mithila folk lore.');
    setFormIsPublished(true);
    setFormFeatured(true);
    setFormIsNewArrival(true);
    setFormMainImage('/src/assets/images/cat_peacock_art_1791132030684.jpg');
    setFormAdditionalImages([]);
    setIsEditorOpen(true);
  };

  // Open Editor for Existing Product
  const handleOpenEdit = (p: Painting) => {
    setEditingId(p.id);
    setFormTitle(p.title);
    setFormSubtitle(p.subtitle);
    setFormCategory(p.category);
    setFormArtist(p.artist);
    setFormArtistLineage(p.artistLineage);
    setFormStyle(p.style);
    setFormMotif(p.motif);
    setFormColorPalette(p.colorPalette);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice || Math.round(p.price * 1.3));
    setFormStockQuantity(p.stockQuantity ?? 5);
    setFormLowStockThreshold(p.lowStockThreshold ?? 3);
    setFormSku(p.sku || `RNG-${p.id.slice(-4).toUpperCase()}`);
    setFormWeight(p.weight || '500g');
    setFormDimensions(p.dimensions || '18 x 24 inches');
    setFormMaterials(p.materials);
    setFormDescription(p.description);
    setFormCulturalStory(p.culturalStory);
    setFormIsPublished(p.isPublished ?? true);
    setFormFeatured(p.featured ?? false);
    setFormIsNewArrival(p.isNewArrival ?? false);
    setFormMainImage(p.image);
    setFormAdditionalImages(p.additionalImages || []);
    setIsEditorOpen(true);
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Validation Error', 'Product title is required', 'error');
      return;
    }

    const categoryName =
      formCategory === 'traditional-mithila'
        ? 'Traditional Mithila Art'
        : formCategory === 'radha-krishna'
        ? 'Radha Krishna Paintings'
        : formCategory === 'nature-wildlife'
        ? 'Nature & Wildlife'
        : formCategory === 'wedding-couple'
        ? 'Wedding & Couple Art'
        : 'Modern Madhubani Art';

    const payload = {
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || `${formStyle} painting by ${formArtist}`,
      category: formCategory,
      categoryName,
      artist: formArtist,
      artistLineage: formArtistLineage,
      style: formStyle,
      motif: formMotif,
      colorPalette: formColorPalette,
      price: Number(formPrice),
      originalPrice: Number(formOriginalPrice),
      stockQuantity: Number(formStockQuantity),
      lowStockThreshold: Number(formLowStockThreshold),
      sku: formSku.trim() || `RNG-${Date.now().toString().slice(-4)}`,
      weight: formWeight.trim(),
      dimensions: formDimensions.trim(),
      materials: formMaterials.trim(),
      description: formDescription.trim(),
      culturalStory: formCulturalStory.trim(),
      isPublished: formIsPublished,
      inStock: Number(formStockQuantity) > 0,
      featured: formFeatured,
      isNewArrival: formIsNewArrival,
      image: formMainImage,
      additionalImages: formAdditionalImages,
      sizes: ['12x16 in', '18x24 in', '24x36 in'],
      defaultSize: '18x24 in',
      framingOptions: [
        { id: 'unframed', label: 'Unframed Rolled in Archival Tube', priceAdded: 0 },
        { id: 'teak', label: 'Handcrafted Teak Wood Frame', priceAdded: 450 },
        { id: 'museum-black', label: 'Museum Grade Matte Black Frame', priceAdded: 350 },
      ],
      rating: 5.0,
      reviewCount: 1,
    };

    if (editingId) {
      updatePainting(editingId, payload);
    } else {
      addNewPainting(payload);
    }

    setIsEditorOpen(false);
  };

  // Image Upload handler (File Reader -> Base64 Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          if (!formMainImage) {
            setFormMainImage(dataUrl);
          } else {
            setFormAdditionalImages((prev) => [...prev, dataUrl]);
          }
          showToast('Image Loaded', `Added "${file.name}" to painting gallery.`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (!customImageUrlInput.trim()) return;
    if (!formMainImage) {
      setFormMainImage(customImageUrlInput.trim());
    } else {
      setFormAdditionalImages((prev) => [...prev, customImageUrlInput.trim()]);
    }
    setCustomImageUrlInput('');
    showToast('Image Added', 'New image URL added to artwork gallery.');
  };

  // Filtering
  const filteredList = paintings.filter((p) => {
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.artist.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.motif.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category
    if (selectedCat !== 'all' && p.category !== selectedCat) {
      return false;
    }

    // Stock Status
    const qty = p.stockQuantity ?? 5;
    const threshold = p.lowStockThreshold ?? 3;
    if (stockFilter === 'in_stock' && (!p.inStock || qty <= 0)) return false;
    if (stockFilter === 'low_stock' && (qty <= 0 || qty > threshold)) return false;
    if (stockFilter === 'out_of_stock' && (p.inStock && qty > 0)) return false;

    // Published
    if (statusFilter === 'published' && p.isPublished === false) return false;
    if (statusFilter === 'draft' && (p.isPublished ?? true)) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#1E2D22]">
            Mithila Paintings Catalog
          </h3>
          <p className="text-xs text-[#8E7B6C]">
            Manage all original artworks, inventory counts, pricing, and visibility without touching code.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C85A32] hover:bg-[#A94924] text-white rounded-2xl text-xs font-semibold tracking-wider transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Painting</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3D5] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, SKU, artist, or motif..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl text-xs text-[#1E2D22] focus:outline-none focus:border-[#C85A32]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-[#FAF7F2] border border-[#E5DAC8] text-xs text-[#1E2D22] rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="traditional-mithila">Traditional Mithila</option>
            <option value="radha-krishna">Radha Krishna</option>
            <option value="nature-wildlife">Nature & Wildlife</option>
            <option value="wedding-couple">Wedding & Couple</option>
            <option value="modern-madhubani">Modern Madhubani</option>
          </select>

          {/* Stock status */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="bg-[#FAF7F2] border border-[#E5DAC8] text-xs text-[#1E2D22] rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Stock Levels</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock (≤ 3 units)</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* Published */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#FAF7F2] border border-[#E5DAC8] text-xs text-[#1E2D22] rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published (Live in Shop)</option>
            <option value="draft">Unpublished (Draft)</option>
          </select>
        </div>
      </div>

      {/* Paintings Table */}
      <div className="bg-white rounded-3xl border border-[#EAE3D5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EAE3D5] text-[#8E7B6C] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Artwork</th>
                <th className="py-3 px-3">SKU & Category</th>
                <th className="py-3 px-3">Master Artist</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3 text-center">Stock</th>
                <th className="py-3 px-3 text-center">Shop Visibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6]">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No paintings match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredList.map((p) => {
                  const qty = p.stockQuantity ?? 5;
                  const threshold = p.lowStockThreshold ?? 3;
                  const isLow = qty > 0 && qty <= threshold;
                  const isOut = qty <= 0 || !p.inStock;
                  const isLive = p.isPublished ?? true;

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      {/* Image & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-12 h-12 object-cover rounded-xl border border-[#EAE3D5] flex-shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-sm text-[#1E2D22] block line-clamp-1">
                              {p.title}
                            </span>
                            <span className="text-[11px] text-[#8E7B6C] line-clamp-1">
                              {p.style} · {p.motif}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU & Category */}
                      <td className="py-3 px-3">
                        <span className="font-mono text-xs font-semibold text-[#1E2D22] block">
                          {p.sku || `RNG-${p.id.slice(-4).toUpperCase()}`}
                        </span>
                        <span className="text-[11px] text-[#8E7B6C]">{p.categoryName}</span>
                      </td>

                      {/* Artist */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-[#1E2D22] block">{p.artist}</span>
                        <span className="text-[10px] text-gray-500">{p.artistLineage.split(',')[0]}</span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-3 font-mono">
                        <span className="font-bold text-sm text-[#1E2D22] block">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      {/* Stock Quantity & Badge */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isOut
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : isLow
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isOut ? 'Out of Stock' : `${qty} in stock`}
                          </span>
                        </div>
                      </td>

                      {/* Published Toggle */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => togglePublishPainting(p.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                            isLive
                              ? 'bg-emerald-100/70 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={isLive ? 'Live in Shop (Click to Unpublish)' : 'Unpublished Draft (Click to Publish)'}
                        >
                          {isLive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{isLive ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-gray-600 hover:text-[#C85A32] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Painting"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => duplicatePainting(p.id)}
                            className="p-1.5 text-gray-600 hover:text-[#1E2D22] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="Duplicate as Draft"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Painting"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E5DAC8] my-6 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#EAE3D5] flex items-center justify-between bg-[#1E2D22] text-[#FAF7F2]">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4943E] text-[#1E2D22] flex items-center justify-center font-bold">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium">
                    {editingId ? 'Edit Mithila Painting' : 'Add New Mithila Painting'}
                  </h3>
                  <p className="text-xs text-[#D3C7B5]">
                    Changes reflect live across your public online storefront immediately upon saving
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
              
              {/* Row 1: Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3E342B] mb-1.5">
                    Painting Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Gaja in Kamal Sanctuary"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] focus:border-[#C85A32] rounded-xl px-3.5 py-2.5 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3E342B] mb-1.5">
                    Subtitle / Art Lore Heading
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fine line Kachni art with lotus pond"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] focus:border-[#C85A32] rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Category, Style, Motif */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3E342B] mb-1.5">
                    Artwork Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as PaintingCategory)}
                    className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="traditional-mithila">Traditional Mithila Art</option>
                    <option value="radha-krishna">Radha Krishna Paintings</option>
                    <option value="nature-wildlife">Nature & Wildlife</option>
                    <option value="wedding-couple">Wedding & Couple Art</option>
                    <option value="modern-madhubani">Modern Madhubani Art</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3E342B] mb-1.5">
                    Art Style *
                  </label>
                  <select
                    value={formStyle}
                    onChange={(e) => setFormStyle(e.target.value as ArtworkStyle)}
                    className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="Bharni (Filled Mineral Colors)">Bharni (Filled Mineral Colors)</option>
                    <option value="Kachni (Fine Line Hatching)">Kachni (Fine Line Hatching)</option>
                    <option value="Tantrik & Sacred">Tantrik & Sacred</option>
                    <option value="Kohbar (Wedding Blessing)">Kohbar (Wedding Blessing)</option>
                    <option value="Contemporary Madhubani">Contemporary Madhubani</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3E342B] mb-1.5">
                    Central Motif *
                  </label>
                  <select
                    value={formMotif}
                    onChange={(e) => setFormMotif(e.target.value as MotifType)}
                    className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="Peacock (Mayur)">Peacock (Mayur)</option>
                    <option value="Fish (Matsya)">Fish (Matsya)</option>
                    <option value="Tree of Life (Kalpavriksha)">Tree of Life (Kalpavriksha)</option>
                    <option value="Radha Krishna">Radha Krishna</option>
                    <option value="Lotus (Kamal)">Lotus (Kamal)</option>
                    <option value="Sun & Moon (Surya-Chandra)">Sun & Moon (Surya-Chandra)</option>
                    <option value="Elephant (Gaja)">Elephant (Gaja)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Artist, Lineage, Color Palette */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3E342B] mb-1.5">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    value={formArtist}
                    onChange={(e) => setFormArtist(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3E342B] mb-1.5">
                    Artist Guild / Lineage
                  </label>
                  <input
                    type="text"
                    value={formArtistLineage}
                    onChange={(e) => setFormArtistLineage(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3E342B] mb-1.5">
                    Color Palette
                  </label>
                  <select
                    value={formColorPalette}
                    onChange={(e) => setFormColorPalette(e.target.value as ColorPaletteType)}
                    className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="Earthy Terracotta & Ochre">Earthy Terracotta & Ochre</option>
                    <option value="Vibrant Natural Mineral">Vibrant Natural Mineral</option>
                    <option value="Monochrome Black & White">Monochrome Black & White</option>
                    <option value="Indigo & Mustard">Indigo & Mustard</option>
                    <option value="Heritage Crimson & Gold">Heritage Crimson & Gold</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Pricing, SKU, Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D5]">
                <div>
                  <label className="block text-xs font-bold text-[#1E2D22] mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full text-sm bg-white border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B5B4E] mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full text-sm bg-white border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none font-mono text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E2D22] mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formStockQuantity}
                    onChange={(e) => setFormStockQuantity(Number(e.target.value))}
                    className="w-full text-sm bg-white border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B5B4E] mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value.toUpperCase())}
                    className="w-full text-sm bg-white border border-[#E5DAC8] rounded-xl px-3 py-2 outline-none font-mono uppercase font-semibold"
                  />
                </div>
              </div>

              {/* Row 5: Weight, Dimensions, Materials */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3E342B] mb-1.5">
                    Weight (with packaging)
                  </label>
                  <input
                    type="text"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    placeholder="e.g. 500g"
                    className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3E342B] mb-1.5">
                    Dimensions (LxW)
                  </label>
                  <input
                    type="text"
                    value={formDimensions}
                    onChange={(e) => setFormDimensions(e.target.value)}
                    placeholder="e.g. 18 x 24 inches"
                    className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3E342B] mb-1.5">
                    Materials & Medium
                  </label>
                  <input
                    type="text"
                    value={formMaterials}
                    onChange={(e) => setFormMaterials(e.target.value)}
                    placeholder="e.g. Handmade Lokta paper, bamboo reed pen"
                    className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>
              </div>

              {/* Row 6: Description & Cultural Lore */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3E342B] mb-1.5">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl p-3 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3E342B] mb-1.5">
                    Cultural Lore & Story
                  </label>
                  <textarea
                    rows={3}
                    value={formCulturalStory}
                    onChange={(e) => setFormCulturalStory(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl p-3 outline-none"
                  />
                </div>
              </div>

              {/* Row 7: Images Manager */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D5] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2D22]">
                    Product Images Gallery
                  </label>
                  <span className="text-[11px] text-[#8E7B6C]">
                    Click any thumbnail below to set as Primary Image
                  </span>
                </div>

                {/* Upload & URL Input */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1E2D22] hover:bg-[#2C3E30] text-white rounded-xl text-xs font-medium cursor-pointer transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Or paste external image URL..."
                      value={customImageUrlInput}
                      onChange={(e) => setCustomImageUrlInput(e.target.value)}
                      className="flex-1 text-xs bg-white border border-[#E5DAC8] rounded-xl px-3 py-1.5 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE3D5] border border-[#E5DAC8] text-xs font-medium rounded-xl text-[#1E2D22] cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Thumbnails preview */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {/* Main Image */}
                  {formMainImage && (
                    <div className="relative group rounded-xl overflow-hidden border-2 border-[#C85A32] shadow-sm">
                      <img
                        src={formMainImage}
                        alt="Main"
                        className="w-20 h-20 object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-[#C85A32] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                        MAIN
                      </span>
                    </div>
                  )}

                  {/* Additional Images */}
                  {formAdditionalImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden border border-[#E5DAC8] hover:border-[#1E2D22] cursor-pointer"
                      onClick={() => {
                        // Switch with main
                        const oldMain = formMainImage;
                        setFormMainImage(img);
                        setFormAdditionalImages((prev) =>
                          prev.map((item, i) => (i === idx ? oldMain : item))
                        );
                        showToast('Main Image Changed', 'Selected image set as primary storefront display.');
                      }}
                    >
                      <img
                        src={img}
                        alt={`Additional ${idx}`}
                        className="w-20 h-20 object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormAdditionalImages((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 8: Status & Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#EAE3D5]">
                <div className="flex flex-wrap items-center gap-6">
                  {/* Published */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPublished}
                      onChange={(e) => setFormIsPublished(e.target.checked)}
                      className="w-4 h-4 accent-[#C85A32] rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-[#1E2D22]">
                      Publish Live on Storefront
                    </span>
                  </label>

                  {/* Featured */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#C85A32] rounded cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[#1E2D22]">
                      Show in Featured Collection
                    </span>
                  </label>

                  {/* New Arrival */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsNewArrival}
                      onChange={(e) => setFormIsNewArrival(e.target.checked)}
                      className="w-4 h-4 accent-[#C85A32] rounded cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[#1E2D22]">
                      Mark as New Arrival
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E5DAC8] text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1E2D22] hover:bg-[#2C3E30] text-white rounded-xl text-xs font-semibold tracking-wider cursor-pointer shadow-sm"
                  >
                    {editingId ? 'Save Changes' : 'Publish Painting'}
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-red-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="font-serif text-lg font-bold text-[#1E2D22]">
                Confirm Permanent Removal
              </h4>
              <p className="text-xs text-[#8E7B6C] mt-1 leading-relaxed">
                Are you sure you want to delete this painting from your collection? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Keep Painting
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePainting(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
