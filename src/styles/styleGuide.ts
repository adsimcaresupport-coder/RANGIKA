/**
 * RANGIKA Visual Style Guide & Design System
 * Inspired by traditional Mithila craftsmanship & luxury editorial aesthetics
 */

export interface ColorSwatch {
  name: string;
  role: string;
  hex: string;
  rgb: string;
  usage: string;
}

export const STYLE_GUIDE = {
  brand: {
    name: "RANGIKA",
    tagline: "ART THAT TELLS STORIES",
    essence: "Rooted in Culture · Created by Hand · Made for Today",
  },

  colorPalettes: {
    primary: [
      {
        name: "Deep Forest Green",
        role: "Hero Backgrounds, Dark Accent Banners, Editorial Anchors",
        hex: "#1E2D22",
        rgb: "rgb(30, 45, 34)",
        usage: "Dominant dark tone for hero banner and collection highlights; conveys heritage depth and timeless luxury."
      },
      {
        name: "Forest Spruce (Mid-tone)",
        role: "Secondary Dark Elements, Hover states for Forest components",
        hex: "#283C2E",
        rgb: "rgb(40, 60, 46)",
        usage: "Card borders, footer background layers, badge outlines."
      },
      {
        name: "Warm Cream / Ivory",
        role: "Primary Page Background & Canvas",
        hex: "#FAF7F2",
        rgb: "rgb(250, 247, 242)",
        usage: "Base canvas background across the site, echoing aged handmade Lokta and Tussar silk textures."
      },
      {
        name: "Warm Oatmeal Cream",
        role: "Card Surfaces, Header Background, Subtle Strips",
        hex: "#F4EFE6",
        rgb: "rgb(244, 239, 230)",
        usage: "Header background, values strip, form input backgrounds, secondary surfaces."
      },
    ] as ColorSwatch[],

    secondary: [
      {
        name: "Mithila Terracotta",
        role: "Primary Accent, Badges, Alert / Focus",
        hex: "#C85A32",
        rgb: "rgb(200, 90, 50)",
        usage: "Derived from clay kiln pottery and sacred earth pigments; used for badges, sale highlights, active states."
      },
      {
        name: "Warm Caramel / Ochre",
        role: "Call-to-Action Buttons, Star Ratings, Highlights",
        hex: "#D4943E",
        rgb: "rgb(212, 148, 62)",
        usage: "Primary CTA buttons (e.g. 'Shop Paintings →'), star ratings, gold decorative flourishes."
      },
      {
        name: "Muted Antique Gold",
        role: "Borders, Badges, Luxury Accents",
        hex: "#E5B869",
        rgb: "rgb(229, 184, 105)",
        usage: "Framing accents, circular seals, subtle gilded borders."
      },
      {
        name: "Deep Earth Brown / Charcoal",
        role: "Headings and Primary Body Typography",
        hex: "#2E251E",
        rgb: "rgb(46, 37, 30)",
        usage: "High-contrast reading typography on cream backgrounds, softer and richer than pure #000."
      },
      {
        name: "Muted Bark / Warm Gray",
        role: "Secondary Metadata, Captions, Dividers",
        hex: "#6B5B4E",
        rgb: "rgb(107, 91, 78)",
        usage: "Subheadings, artist notes, specifications, border lines."
      },
    ] as ColorSwatch[],

    traditionalMithilaPigments: [
      {
        name: "Kachni Ink (Lampblack)",
        hex: "#1A1A1A",
        usage: "Intricate fine-line double contours, traditional Madhubani hatching."
      },
      {
        name: "Peepal Crimson (Sindoor)",
        hex: "#9E2A2B",
        usage: "Sacred bridal Kohbar paintings, floral petals, auspicious rituals."
      },
      {
        name: "Haldi (Turmeric Yellow)",
        hex: "#E5A93C",
        usage: "Bharni style filling, sunlight, marigold motifs, divine garments."
      },
      {
        name: "Neel (Natural Indigo)",
        hex: "#264653",
        usage: "Krishna iconography, peacock plumage, sacred river waters."
      },
    ]
  },

  typography: {
    fontFamilies: {
      serifHeading: "'Cormorant Garamond', Georgia, serif",
      sansBody: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      scriptAccent: "'Caveat', cursive",
    },
    hierarchy: [
      {
        level: "Display Hero (H1)",
        font: "Cormorant Garamond (Serif), Semi-bold / Light-italic mix",
        size: "3.25rem - 4.5rem (52px - 72px)",
        lineHeight: "1.1",
        letterSpacing: "-0.02em",
        example: "More Than Art. A Story of Mithila. A Tradition You Carry.",
        usage: "Hero section centerpiece only."
      },
      {
        level: "Section Title (H2)",
        font: "Cormorant Garamond (Serif), Medium",
        size: "2.25rem - 3rem (36px - 48px)",
        lineHeight: "1.2",
        letterSpacing: "-0.01em",
        example: "Explore the Art of Mithila",
        usage: "Homepage and major landing section headers."
      },
      {
        level: "Subsection / Card Title (H3)",
        font: "Cormorant Garamond (Serif), Semi-bold",
        size: "1.35rem - 1.75rem (22px - 28px)",
        lineHeight: "1.3",
        letterSpacing: "normal",
        example: "Radha Krishna Under Kadamba",
        usage: "Product titles, story headings, modal headers."
      },
      {
        level: "Eyebrow / Overline",
        font: "Plus Jakarta Sans (Sans), Medium, Uppercase",
        size: "0.75rem - 0.85rem (12px - 14px)",
        lineHeight: "1.4",
        letterSpacing: "0.2em",
        example: "TRADITIONAL MITHILA ART",
        usage: "Top category identifiers above main headings."
      },
      {
        level: "Body Large",
        font: "Plus Jakarta Sans (Sans), Regular",
        size: "1.05rem - 1.15rem (17px - 18px)",
        lineHeight: "1.65",
        letterSpacing: "normal",
        example: "Discover the timeless beauty of handcrafted Mithila paintings...",
        usage: "Editorial lead paragraphs and hero descriptions."
      },
      {
        level: "Body Regular",
        font: "Plus Jakarta Sans (Sans), Regular / Medium",
        size: "0.925rem - 1rem (15px - 16px)",
        lineHeight: "1.6",
        letterSpacing: "normal",
        example: "Intricate double-line borders drawn using natural bamboo twigs...",
        usage: "General copy, product descriptions, reviews."
      },
      {
        level: "Script Annotation",
        font: "Caveat (Handwritten Script), Regular / Medium",
        size: "1.25rem - 1.6rem (20px - 26px)",
        lineHeight: "1.2",
        letterSpacing: "normal",
        example: "Rooted in Culture · Created by Hand",
        usage: "Poetic artisanal notes, floating badges, stamp accents."
      },
    ]
  },

  spacing: {
    system: "8pt grid based rhythm (8px, 16px, 24px, 32px, 48px, 64px, 96px, 128px)",
    rules: [
      "Section vertical padding: 4rem (64px) on mobile, 6rem (96px) to 7.5rem (120px) on desktop.",
      "Card gap: 1.5rem (24px) to 2rem (32px) for airy editorial breathing space.",
      "Inline icon-to-text spacing: 0.5rem (8px).",
      "Container max-width: 1280px (7xl) centered with px-4 sm:px-6 lg:px-8.",
    ]
  },

  buttonStyles: [
    {
      name: "Primary CTA (Hero / Lead Action)",
      classes: "bg-[#D4943E] hover:bg-[#C85A32] text-white font-medium px-8 py-3.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md inline-flex items-center gap-2",
      description: "Warm ochre rounded button with smooth hover transition to terracotta."
    },
    {
      name: "Secondary Ghost / Bordered",
      classes: "border border-white/40 hover:border-white text-white hover:bg-white/10 font-medium px-7 py-3 rounded-full transition-all duration-300 inline-flex items-center gap-2",
      description: "Subtle translucent border button for dark backgrounds (Hero secondary action)."
    },
    {
      name: "Tertiary / Editorial Link",
      classes: "text-[#2E251E] hover:text-[#C85A32] font-medium text-sm tracking-wider uppercase inline-flex items-center gap-1.5 transition-colors group",
      description: "Minimalist text link with arrow icon ('View All →', 'Discover Our Story →')."
    },
    {
      name: "Cart / Checkout Action",
      classes: "bg-[#1E2D22] hover:bg-[#283C2E] text-white font-medium px-6 py-3 rounded-lg transition-colors w-full flex items-center justify-center gap-2",
      description: "Forest green high-contrast button for commercial conversions."
    }
  ],

  formElements: {
    inputStyle: "bg-white border border-[#E2D7C5] focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] rounded-md px-4 py-2.5 text-[#2E251E] placeholder:text-[#8E7B6C] text-sm transition-all outline-none",
    selectStyle: "bg-white border border-[#E2D7C5] focus:border-[#C85A32] rounded-md px-4 py-2.5 text-[#2E251E] text-sm transition-all outline-none",
    labelStyle: "block text-xs font-semibold tracking-wider uppercase text-[#6B5B4E] mb-1.5",
    checkboxStyle: "accent-[#C85A32] w-4 h-4 rounded border-[#E2D7C5]",
    fileUploadStyle: "border-2 border-dashed border-[#E2D7C5] hover:border-[#C85A32] rounded-lg p-6 text-center cursor-pointer transition-colors bg-[#FAF7F2]/50"
  },

  imageTreatment: {
    philosophy: "Authentic, high-fidelity cultural realism with tactile texture, natural sunlight, warm organic tones, and no synthetic digital gloss.",
    aspectRatios: {
      categoryCards: "3:4 vertical portrait ratio (mimicking hanging wall paintings)",
      heroLifestyle: "3:4 or 4:5 editorial lifestyle format with model holding artwork",
      storyMacro: "4:3 focused close-up on artisan hands and natural pigments",
      collectionInterior: "16:9 cinematic warm interior gallery wall",
      productThumbnails: "4:5 standardized clean framed photography with drop shadow"
    },
    hoverEffect: "Subtle smooth 1.03x scale zoom (duration 600ms ease) with natural warm vignette.",
    framingBorder: "Soft 1px border (#EDE5D8) and 12px rounded or sharp gallery corners."
  }
};
