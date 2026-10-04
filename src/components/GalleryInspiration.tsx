import React, { useState } from 'react';
import { Maximize2, X, Sparkles, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface GalleryItem {
  id: string;
  title: string;
  motif: string;
  artist: string;
  image: string;
  style: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'The Divine Mayur of Madhubani',
    motif: 'Peacock & Sacred Floral Vines',
    artist: 'Vidya Devi Jha',
    image: '/src/assets/images/cat_peacock_art_1791132030684.jpg',
    style: 'Kachni (Fine Line)',
    description: 'Rhythmic double-line pen work depicting the majestic peacock, an omen of monsoon showers and prosperity.',
  },
  {
    id: 'g-2',
    title: 'Eternal Milan under Kadamba',
    motif: 'Radha Krishna Divine Romance',
    artist: 'Sunita Bharti',
    image: '/src/assets/images/cat_radhakrishna_art_1791132045679.jpg',
    style: 'Bharni (Mineral Colors)',
    description: 'Vibrant natural turmeric and crushed indigo pigments illustrating eternal celestial harmony.',
  },
  {
    id: 'g-3',
    title: 'Kalpavriksha & Fertile Waters',
    motif: 'Tree of Life & Sacred Fish',
    artist: 'Baua Devi Lineage',
    image: '/src/assets/images/cat_treeoflife_art_1791132060397.jpg',
    style: 'Tantrik & Sacred',
    description: 'The ancient cosmic tree connecting heavens and fertile river plains, painted on textured Lokta paper.',
  },
  {
    id: 'g-4',
    title: 'Ceremonial Kohbar Bridal Blessing',
    motif: 'Sun, Moon & Auspicious Bamboo',
    artist: 'Smt. Godavari Devi Heritage',
    image: '/src/assets/images/hero_mithila_art_1791131818866.jpg',
    style: 'Kohbar Wedding Art',
    description: 'Ritual wall motifs traditionally created in bridal suites to bless matrimonial unions with joy and endurance.',
  },
  {
    id: 'g-5',
    title: 'Contemporary Surya Dev Mandala',
    motif: 'Solar Deity Geometry',
    artist: 'Anandita Jha & Collective',
    image: '/src/assets/images/cat_modern_mithila_1791132075917.jpg',
    style: 'Modern Madhubani',
    description: 'A stylized interpretation of the benevolent sun god, tailored for modern architectural spaces.',
  },
  {
    id: 'g-6',
    title: 'Living Traditions at the Hearth',
    motif: 'Artisan Hands at Work',
    artist: 'Madhubani Master Women Guild',
    image: '/src/assets/images/artisan_hands_painting_1791131837940.jpg',
    style: 'Handcraft Heritage',
    description: 'A rare intimate glimpse into the painstaking patience required to create authentic Madhubani strokes.',
  },
];

export const GalleryInspiration: React.FC = () => {
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);
  const { setSelectedCategory, setActiveTab } = useStore();

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#EAE3D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C85A32] font-semibold block mb-2 font-sans">
            VISUAL ARCHIVE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1E2D22] mb-3">
            Gallery & Art Inspiration
          </h2>
          <p className="text-sm sm:text-base text-[#6B5B4E] font-light">
            Immerse in the diverse schools of Mithila art—from sacred line-work Kachni to vivid mineral Bharni. Click any artwork to view details in high resolution.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightbox(item)}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F0E9DC] border border-[#E5DAC8] shadow-xs hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay with info */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E2D22]/90 via-[#1E2D22]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-wider text-[#D4943E] font-semibold mb-1">
                  {item.style} · {item.artist}
                </span>
                <h3 className="font-serif text-xl font-medium mb-1 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#D3C7B5] line-clamp-2 font-light mb-3">
                  {item.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#D4943E]">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View in High Resolution</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-4xl w-full bg-[#1E2D22] text-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#3E5343] flex flex-col lg:flex-row">
            {/* Close button */}
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Left */}
            <div className="lg:w-3/5 bg-black flex items-center justify-center min-h-[350px] lg:min-h-[500px]">
              <img
                src={activeLightbox.image}
                alt={activeLightbox.title}
                className="max-h-[500px] w-auto max-w-full object-contain"
              />
            </div>

            {/* Content Right */}
            <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#D4943E] font-semibold block mb-2 font-sans">
                  {activeLightbox.style}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#FAF7F2] mb-3 leading-snug">
                  {activeLightbox.title}
                </h3>
                <p className="text-xs text-[#C5B7A2] mb-4">
                  Master Artisan: <span className="text-[#FAF7F2] font-semibold">{activeLightbox.artist}</span>
                </p>
                <p className="text-xs text-[#D3C7B5] leading-relaxed mb-6 font-light">
                  {activeLightbox.description}
                </p>
                <div className="bg-[#283C2E] p-4 rounded-xl border border-[#3E5343] text-xs text-[#D3C7B5] space-y-1.5">
                  <p><strong>Motif Lore:</strong> {activeLightbox.motif}</p>
                  <p><strong>Medium:</strong> Pure natural dyes & bamboo stylus on handmade paper</p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#3E5343] mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setActiveLightbox(null);
                    setActiveTab('shop');
                  }}
                  className="w-full bg-[#D4943E] hover:bg-[#C85A32] text-white py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
