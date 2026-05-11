# Bookmark Studio

AI-powered design tool for printable bookmarks. Output is print-ready
**600×1800 px PNG at 300 DPI** — exactly 2" × 6", the standard bookmark size.

## Setup

```bash
npm install
cp .env.local.example .env.local   # then fill in at least one key
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Providers

You don't need all three — the dropdown disables any without a key.

| Provider | Best for | Env var |
|---|---|---|
| OpenAI · gpt-image-1 | Typography / quote bookmarks (legible text) | `OPENAI_API_KEY` |
| Replicate · Ideogram v2 | Mixed — best at text *and* art, native 9:16 | `REPLICATE_API_TOKEN` |
| Stability · SD3.5 | Illustrations, cheapest per image | `STABILITY_API_KEY` |

## Adding a style preset

Edit `lib/presets.ts`. Each preset has a category, a label, a hint, and a
`buildPrompt(idea)` function that wraps your idea in a prompt template.
The closing instruction `TALL_FRAME` is shared and tells the model to compose
for a 1:3 bookmark.

## Adding another provider

Implement `ImageProvider` in `lib/providers/types.ts` and register it in
`lib/providers/index.ts`. The UI auto-discovers it via `/api/providers`.

## Print pipeline

`lib/print.ts` center-crops the generated image to 1:3, resizes to
600×1800, and embeds 300 DPI in the PNG metadata. Send the file straight
to a print shop (Sticker Mule, Printful, Vistaprint, etc.).
