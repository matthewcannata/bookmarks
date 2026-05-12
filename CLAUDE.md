# Bookmark Studio

AI-powered design tool for printable bookmarks. Generates print-ready
600×1800 px PNGs @ 300 DPI (exactly 2" × 6", the standard bookmark size)
across 38 style presets and 4 swappable image-generation providers.

## Tech stack
- Next.js 15 (App Router, TypeScript)
- React 19
- Tailwind 3
- Sharp for server-side image processing
- `html-to-image` for client-side DOM-to-PNG rasterization

## Run
```bash
npm install
cp .env.local.example .env.local   # paid providers only; Pollinations works without a key
npm run dev                        # http://localhost:3001
```

Dev server runs on **3001** (not 3000) so it doesn't clash with sibling projects.

## Environment variables
All optional. The UI grays out any provider whose key is missing.

| Var | Provider | Notes |
|---|---|---|
| `OPENAI_API_KEY` | gpt-image-1 | Best at typography / quote bookmarks |
| `REPLICATE_API_TOKEN` | Ideogram v2 | Best all-rounder; native 9:16 aspect |
| `STABILITY_API_KEY` | SD3.5 | Cheapest per image |
| — | Pollinations · Flux | Free, no key, rate-limited (1 concurrent per IP) |

## Architecture

### Provider abstraction (`lib/providers/`)
Each provider implements the `ImageProvider` interface in `types.ts`:

```ts
{ id, label, supportsTallPortrait, isConfigured(), generate(input) }
```

Register a provider by importing it in `lib/providers/index.ts` and adding it
to the `providers` array. The UI auto-discovers via `/api/providers`.

Pollinations enforces a **1 concurrent request per IP** queue, so its
`generate()` runs sequentially with 800 ms pacing and retries 429/5xx with
exponential backoff (1.8s → 3.2s → 5.9s → 10.6s, max 4 tries).

### Style presets (`lib/presets.ts`)
38 presets across 4 categories (`quote`, `illustrated`, `themed`, `pattern`).
Each preset has:
- `id`, `category`, `label`, `hint`
- `buildPrompt(idea)` — wraps the user's idea in a prompt template that ends
  with the shared `TALL_FRAME` instruction (tells the model to compose for 1:3)
- `negativePrompt?` (optional)

### Print pipeline (`lib/print.ts`)
Sharp center-crops the AI-generated image to 1:3 aspect, resizes to 600×1800
with `lanczos3`, embeds 300 DPI metadata. Print shops (Sticker Mule,
Printful, etc.) read the density and place the image at the right physical
size.

### Live preview (`app/LivePreview.tsx`, `lib/png-dpi.ts`)
The on-screen preview is a **real PNG image**, not a styled DOM mockup.
Pipeline per change (debounced 300 ms):
1. Render the bookmark style in a hidden 600×1800 offscreen DOM
2. `html-to-image.toBlob` rasterizes it to a PNG
3. `injectPngDpi` (in `lib/png-dpi.ts`) writes a `pHYs` chunk so the file
   declares 300 DPI
4. Result blob is shown via `<img src={blobURL}>` — right-click → "Save
   image as…" gives the user a print-ready file directly

The Tailwind `bookmark-frame` class in `globals.css` enforces 1:3 aspect.

### Live-preview styles
Visual previews are defined in the `STYLES` map at the top of
`app/LivePreview.tsx`, keyed by preset id. Each entry: background gradient
(CSS string), accent / text color, font family, decoration type
(`corners | mandala | stars | deco | frame | line | floral | geo | riso |
waves | grid | halftone | none`), and `showQuote` (text-prominent vs. caption).
A preset can ship without a STYLES entry — it just falls back to the default
gradient.

### Gallery
LocalStorage only (`bookmark-studio:gallery:v1`, capped at 60 items). No
backend. Items store the preview base64, the prompt, the preset and provider
that produced them. Clicking a thumb reloads its prompt back into the
generator panel.

## API routes (`app/api/`)
- `GET /api/providers` — list with `configured` flag
- `GET /api/presets` — grouped by category (no `buildPrompt` exposed)
- `POST /api/generate` — `{ providerId, presetId?, idea, count, includePrint? }`
- `POST /api/print` — `{ base64, filename }` → returns 600×1800 PNG download

## Adding things

### A new preset
1. Append to `presets` in `lib/presets.ts` (required)
2. Optionally add a `STYLES` entry in `app/LivePreview.tsx` for the on-screen mockup

### A new provider
1. Create `lib/providers/<name>.ts` implementing `ImageProvider`
2. Import + push into `providers` in `lib/providers/index.ts`
3. Add the env var to `.env.local.example`

### A new decoration type (live preview)
1. Add to the `Decoration` union at the top of `app/LivePreview.tsx`
2. Add a `case` in the `Decorations` function returning the SVG markup

## Conventions
- Server-side image work happens in `lib/print.ts` (Sharp).
- Client-side image work happens in `lib/png-dpi.ts` (pure bytes, no canvas writes).
- Decoration SVGs all use a `viewBox="0 0 100 300"` so they scale via the parent.
- Position decorations and corners use **percentages**, never fixed px, so they
  render correctly at both display (256 px wide) and source (600 px wide) sizes.
- Don't introduce a real database. Gallery stays in localStorage until the user
  asks otherwise.

## Repo
GitHub: https://github.com/matthewcannata/bookmarks
