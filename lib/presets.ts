export type PresetCategory = "quote" | "illustrated" | "themed" | "pattern";

export interface StylePreset {
  id: string;
  category: PresetCategory;
  label: string;
  /** Short hint shown under the chip */
  hint: string;
  /** Wraps the user's idea/topic — use {idea} as the placeholder */
  buildPrompt: (idea: string) => string;
  negativePrompt?: string;
}

const TALL_FRAME =
  "tall vertical 1:3 bookmark composition, full-bleed design, no white border, balanced top-to-bottom layout, print-ready high resolution";

export const presets: StylePreset[] = [
  // ── Quote / Typography ─────────────────────────────────────────────
  {
    id: "quote-elegant-serif",
    category: "quote",
    label: "Elegant serif quote",
    hint: "Classic literary look",
    buildPrompt: (idea) =>
      `Typography bookmark design featuring the quote: "${idea}". Elegant serif lettering in warm ink black on a cream background, subtle gold filigree corners, classic literary style, ${TALL_FRAME}.`,
    negativePrompt: "blurry text, misspelled words, harsh colors, modern sans-serif",
  },
  {
    id: "quote-modern-bold",
    category: "quote",
    label: "Bold modern type",
    hint: "Punchy, contemporary",
    buildPrompt: (idea) =>
      `Bold modern typography bookmark with the phrase: "${idea}". Oversized sans-serif lettering, layered color blocks of mustard, terracotta and navy, contemporary editorial poster vibe, ${TALL_FRAME}.`,
    negativePrompt: "blurry text, misspelled words, cluttered",
  },
  {
    id: "quote-handlettered",
    category: "quote",
    label: "Hand-lettered script",
    hint: "Inky brushstrokes",
    buildPrompt: (idea) =>
      `Hand-lettered brush-script bookmark of the quote: "${idea}". Flowing calligraphic ink strokes, scattered watercolor splashes, soft cream paper texture, artisanal feel, ${TALL_FRAME}.`,
    negativePrompt: "digital font, generic typography, misspelled words",
  },
  {
    id: "quote-typewriter",
    category: "quote",
    label: "Vintage typewriter",
    hint: "Typed on aged paper",
    buildPrompt: (idea) =>
      `Vintage typewriter bookmark with the typed line: "${idea}". Crisp monospace typewriter font on cream paper with faint coffee stains and paper grain, dated 1940s editorial feel, ${TALL_FRAME}.`,
    negativePrompt: "color photo, modern font, misspelled words",
  },
  {
    id: "quote-neon",
    category: "quote",
    label: "Neon sign",
    hint: "Glowing tubes, night vibe",
    buildPrompt: (idea) =>
      `Neon sign bookmark with the glowing words: "${idea}". Bright pink and cyan neon tubes wired against a dark night-city backdrop, 1980s synthwave aesthetic, soft bloom, ${TALL_FRAME}.`,
    negativePrompt: "daylight, dull colors, misspelled words",
  },
  {
    id: "quote-chalkboard",
    category: "quote",
    label: "Chalkboard",
    hint: "Cafe board lettering",
    buildPrompt: (idea) =>
      `Chalkboard bookmark with hand-drawn chalk lettering: "${idea}". Slate green board background, white chalk script with playful flourishes and arrows, cafe menu aesthetic, ${TALL_FRAME}.`,
    negativePrompt: "digital font, vector clean, misspelled words",
  },
  {
    id: "quote-watercolor-script",
    category: "quote",
    label: "Watercolor script",
    hint: "Pastel wash + calligraphy",
    buildPrompt: (idea) =>
      `Watercolor bookmark with flowing calligraphic quote: "${idea}". Soft pastel watercolor wash background in peach and lavender, deep indigo brush calligraphy, delicate floral accents, ${TALL_FRAME}.`,
    negativePrompt: "digital font, harsh edges, misspelled words",
  },
  {
    id: "quote-linocut",
    category: "quote",
    label: "Linocut block print",
    hint: "Carved ink lettering",
    buildPrompt: (idea) =>
      `Linocut block-print bookmark with carved lettering: "${idea}". Bold woodcut sans-serif, ink-heavy texture, hand-pressed onto warm cream paper, indie craft aesthetic, ${TALL_FRAME}.`,
    negativePrompt: "smooth digital font, gradient, misspelled words",
  },

  // ── Illustrated ───────────────────────────────────────────────────
  {
    id: "illus-watercolor-floral",
    category: "illustrated",
    label: "Watercolor floral",
    hint: "Soft botanical wash",
    buildPrompt: (idea) =>
      `Watercolor botanical illustration bookmark inspired by: ${idea}. Soft pastel wash, delicate florals, hand-painted leaves cascading top to bottom, dreamy translucent layers, ${TALL_FRAME}.`,
    negativePrompt: "harsh lines, digital, photographic",
  },
  {
    id: "illus-mandala",
    category: "illustrated",
    label: "Mandala / linework",
    hint: "Symmetrical ink art",
    buildPrompt: (idea) =>
      `Intricate mandala-style bookmark inspired by: ${idea}. Fine black linework on warm parchment, symmetrical geometric pattern with ornamental flourishes, mehndi-inspired detail, ${TALL_FRAME}.`,
    negativePrompt: "color, gradients, photography",
  },
  {
    id: "illus-vintage-engraving",
    category: "illustrated",
    label: "Vintage engraving",
    hint: "Antique etching style",
    buildPrompt: (idea) =>
      `Vintage etched engraving bookmark of: ${idea}. Cross-hatched linework, sepia toned aged paper, antique scientific illustration aesthetic in the style of 19th century botanical plates, ${TALL_FRAME}.`,
    negativePrompt: "modern, digital, color photo",
  },
  {
    id: "illus-fantasy",
    category: "illustrated",
    label: "Fantasy painted",
    hint: "Storybook, rich color",
    buildPrompt: (idea) =>
      `Fantasy painted illustration bookmark of: ${idea}. Rich oil-painting style, magical lighting, atmospheric depth, storybook quality reminiscent of classical fantasy book covers, ${TALL_FRAME}.`,
  },
  {
    id: "illus-ukiyoe",
    category: "illustrated",
    label: "Ukiyo-e woodblock",
    hint: "Hokusai / Hiroshige",
    buildPrompt: (idea) =>
      `Japanese ukiyo-e woodblock print bookmark of: ${idea}. Indigo and beige palette, flat planes of color, traditional brushstrokes and waves in the style of Hokusai, ${TALL_FRAME}.`,
  },
  {
    id: "illus-art-nouveau",
    category: "illustrated",
    label: "Art Nouveau",
    hint: "Mucha-style flowing lines",
    buildPrompt: (idea) =>
      `Art Nouveau bookmark inspired by: ${idea}. Alphonse Mucha style, sinuous organic linework, ornate botanical border, muted earth tones with gold accents, ${TALL_FRAME}.`,
  },
  {
    id: "illus-stained-glass",
    category: "illustrated",
    label: "Stained glass",
    hint: "Leaded jewel panels",
    buildPrompt: (idea) =>
      `Stained glass window bookmark depicting: ${idea}. Bold black leading between vibrant jewel-tone glass panels, gothic cathedral style with backlit luminous glow, ${TALL_FRAME}.`,
  },
  {
    id: "illus-papercut",
    category: "illustrated",
    label: "Layered papercut",
    hint: "Cut-paper silhouettes",
    buildPrompt: (idea) =>
      `Layered papercut silhouette bookmark of: ${idea}. Multiple cut-paper layers in warm sunset hues with crisp shadow depth, modern craft aesthetic, ${TALL_FRAME}.`,
  },
  {
    id: "illus-embroidery",
    category: "illustrated",
    label: "Embroidered linen",
    hint: "Cross-stitch threads",
    buildPrompt: (idea) =>
      `Embroidered cross-stitch bookmark of: ${idea}. Visible thread texture, natural linen background, folk-art floral motifs, slow-craft handmade feel, ${TALL_FRAME}.`,
  },
  {
    id: "illus-storybook",
    category: "illustrated",
    label: "Children's storybook",
    hint: "Gouache, soft & whimsical",
    buildPrompt: (idea) =>
      `Children's picture-book illustration bookmark of: ${idea}. Gouache painted style, soft rounded shapes, warm pastel palette, whimsical and inviting, ${TALL_FRAME}.`,
  },
  {
    id: "illus-comic-pop",
    category: "illustrated",
    label: "Comic pop art",
    hint: "Halftone, ben-day dots",
    buildPrompt: (idea) =>
      `Pop-art comic book bookmark of: ${idea}. Bold black outlines, ben-day halftone dots, primary color blocks, Lichtenstein-inspired retro panel aesthetic, ${TALL_FRAME}.`,
  },

  // ── Themed ─────────────────────────────────────────────────────────
  {
    id: "themed-cottagecore",
    category: "themed",
    label: "Cottagecore",
    hint: "Cozy, pastoral",
    buildPrompt: (idea) =>
      `Cottagecore-themed bookmark featuring: ${idea}. Wildflowers, mushrooms, cozy cabin elements, muted earth tones, hand-painted illustration with warm nostalgic mood, ${TALL_FRAME}.`,
  },
  {
    id: "themed-darkacademia",
    category: "themed",
    label: "Dark academia",
    hint: "Moody, scholarly",
    buildPrompt: (idea) =>
      `Dark academia bookmark featuring: ${idea}. Antique books, candles, ravens, ivy, deep forest green and burgundy palette, oil painting style, moody scholarly aesthetic, ${TALL_FRAME}.`,
  },
  {
    id: "themed-anime",
    category: "themed",
    label: "Anime / manga",
    hint: "Cel-shaded illustration",
    buildPrompt: (idea) =>
      `Anime-style bookmark illustration of: ${idea}. Cel-shaded coloring, expressive linework, dynamic composition, Studio Ghibli to Shounen poster vibe, ${TALL_FRAME}.`,
  },
  {
    id: "themed-celestial",
    category: "themed",
    label: "Celestial / mystical",
    hint: "Stars, moons, magic",
    buildPrompt: (idea) =>
      `Celestial mystical bookmark featuring: ${idea}. Crescent moons, constellations, sacred geometry, deep indigo with shimmering gold foil accents, tarot-card aesthetic, ${TALL_FRAME}.`,
  },
  {
    id: "themed-noir",
    category: "themed",
    label: "Film noir",
    hint: "B&W, rain, mystery",
    buildPrompt: (idea) =>
      `Film noir bookmark of: ${idea}. High-contrast black and white, chiaroscuro lighting, rain-slick streets, 1940s detective movie aesthetic, ${TALL_FRAME}.`,
  },
  {
    id: "themed-cyberpunk",
    category: "themed",
    label: "Cyberpunk",
    hint: "Neon, rain, dystopia",
    buildPrompt: (idea) =>
      `Cyberpunk bookmark featuring: ${idea}. Neon magenta and cyan, rain-soaked dystopian cityscape, glitch effects and holographic UI, Blade Runner mood, ${TALL_FRAME}.`,
  },
  {
    id: "themed-retro-scifi",
    category: "themed",
    label: "Retro sci-fi",
    hint: "70s pulp paperback",
    buildPrompt: (idea) =>
      `1970s retro sci-fi pulp paperback bookmark cover of: ${idea}. Airbrushed planets and starships, neon sunset palette, vintage paperback typography, ${TALL_FRAME}.`,
  },
  {
    id: "themed-pirate-map",
    category: "themed",
    label: "Pirate treasure map",
    hint: "Aged parchment cartography",
    buildPrompt: (idea) =>
      `Pirate treasure map bookmark featuring: ${idea}. Aged parchment, hand-drawn compass rose, sea monsters and ships, X-marks-the-spot, antique cartography style, ${TALL_FRAME}.`,
  },
  {
    id: "themed-gothic",
    category: "themed",
    label: "Gothic cathedral",
    hint: "Stone, candles, ravens",
    buildPrompt: (idea) =>
      `Gothic cathedral bookmark featuring: ${idea}. Pointed stone arches, gargoyles, ravens, deep purples and blacks lit by warm candle glow, ${TALL_FRAME}.`,
  },
  {
    id: "themed-tropical",
    category: "themed",
    label: "Tropical jungle",
    hint: "Palms, hibiscus, monstera",
    buildPrompt: (idea) =>
      `Tropical jungle bookmark featuring: ${idea}. Lush palm fronds, monstera leaves, bright hibiscus blossoms, vintage Hawaiian print aesthetic, ${TALL_FRAME}.`,
  },

  // ── Pattern / Minimalist ──────────────────────────────────────────
  {
    id: "pattern-geometric",
    category: "pattern",
    label: "Geometric",
    hint: "Bold shapes & color",
    buildPrompt: (idea) =>
      `Modern geometric pattern bookmark inspired by: ${idea}. Bold interlocking shapes, mid-century color palette of mustard, teal and rust, clean vector aesthetic, ${TALL_FRAME}.`,
  },
  {
    id: "pattern-minimal-line",
    category: "pattern",
    label: "Minimal line",
    hint: "One subject, lots of space",
    buildPrompt: (idea) =>
      `Minimalist single-line-art bookmark of: ${idea}. Continuous black line drawing on bone-white background, huge negative space, gallery-print quality, ${TALL_FRAME}.`,
  },
  {
    id: "pattern-art-deco",
    category: "pattern",
    label: "Art Deco",
    hint: "Gold, symmetry, glamour",
    buildPrompt: (idea) =>
      `Art Deco bookmark inspired by: ${idea}. Symmetrical geometry, gold foil on black, sunburst and fan motifs, 1920s Gatsby luxury, ${TALL_FRAME}.`,
  },
  {
    id: "pattern-risograph",
    category: "pattern",
    label: "Risograph",
    hint: "Grainy two-tone print",
    buildPrompt: (idea) =>
      `Risograph print bookmark of: ${idea}. Two-color overlay of fluorescent pink and blue, grainy ink texture, slightly misregistered layers, indie print zine aesthetic, ${TALL_FRAME}.`,
  },
  {
    id: "pattern-seigaiha",
    category: "pattern",
    label: "Seigaiha waves",
    hint: "Japanese wave scallops",
    buildPrompt: (idea) =>
      `Japanese seigaiha wave pattern bookmark inspired by: ${idea}. Repeating indigo wave scallops on washi paper texture, traditional Japanese motif, ${TALL_FRAME}.`,
  },
  {
    id: "pattern-bauhaus",
    category: "pattern",
    label: "Bauhaus",
    hint: "Primary shapes & color",
    buildPrompt: (idea) =>
      `Bauhaus pattern bookmark inspired by: ${idea}. Primary red, yellow, and blue circles, squares, and triangles, clean modernist composition, ${TALL_FRAME}.`,
  },
  {
    id: "pattern-terrazzo",
    category: "pattern",
    label: "Terrazzo",
    hint: "Speckled stone chips",
    buildPrompt: (idea) =>
      `Terrazzo pattern bookmark inspired by: ${idea}. Speckled chips of pink, mint, and ochre embedded in cream stone, modern Italian aesthetic, ${TALL_FRAME}.`,
  },
  {
    id: "pattern-isometric-grid",
    category: "pattern",
    label: "Isometric grid",
    hint: "Drafting / blueprint",
    buildPrompt: (idea) =>
      `Isometric line-grid pattern bookmark inspired by: ${idea}. Pale blue grid forming subtle 3D cubes on white paper, technical drafting aesthetic, ${TALL_FRAME}.`,
  },
  {
    id: "pattern-marble",
    category: "pattern",
    label: "Marble",
    hint: "Polished Carrara veining",
    buildPrompt: (idea) =>
      `Marble texture bookmark inspired by: ${idea}. White Carrara marble with elegant gray veining, polished stone surface, luxurious minimal aesthetic, ${TALL_FRAME}.`,
  },
];

export const categoryLabels: Record<PresetCategory, string> = {
  quote: "Quote / Typography",
  illustrated: "Illustrated",
  themed: "Themed",
  pattern: "Pattern / Minimal",
};

export function presetsByCategory() {
  return (["quote", "illustrated", "themed", "pattern"] as PresetCategory[]).map((c) => ({
    category: c,
    label: categoryLabels[c],
    items: presets.filter((p) => p.category === c),
  }));
}

export function getPreset(id: string): StylePreset | undefined {
  return presets.find((p) => p.id === id);
}
