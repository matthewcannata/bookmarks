"use client";

import { CSSProperties } from "react";

type Decoration =
  | "corners"
  | "mandala"
  | "stars"
  | "deco"
  | "frame"
  | "line"
  | "floral"
  | "geo"
  | "riso"
  | "waves"
  | "grid"
  | "halftone"
  | "none";

type FontFamily = "serif" | "sans" | "script";

type PreviewStyle = {
  bg: string;
  accent: string;
  textColor: string;
  font: FontFamily;
  decoration: Decoration;
  showQuote: boolean;
  /** Optional caption shown at the bottom for non-quote styles */
  captionPrefix?: string;
};

const DEFAULT_STYLE: PreviewStyle = {
  bg: "linear-gradient(180deg, #fde7c1 0%, #f3a8a8 50%, #c4b5fd 100%)",
  accent: "#1a1a1a",
  textColor: "#1a1a1a",
  font: "serif",
  decoration: "none",
  showQuote: false,
  captionPrefix: "preview",
};

const STYLES: Record<string, PreviewStyle> = {
  // ── Quote / Typography ───────────────────────────────────────────
  "quote-elegant-serif": {
    bg: "linear-gradient(180deg, #fbf6ea 0%, #f3e9cf 100%)",
    accent: "#8a6e2a",
    textColor: "#2a1f10",
    font: "serif",
    decoration: "corners",
    showQuote: true,
  },
  "quote-modern-bold": {
    bg: "linear-gradient(180deg, #e8a23a 0%, #c2410c 45%, #1e3a8a 100%)",
    accent: "#fef3c7",
    textColor: "#fff8ec",
    font: "sans",
    decoration: "none",
    showQuote: true,
  },
  "quote-handlettered": {
    bg:
      "radial-gradient(circle at 25% 18%, rgba(255,178,128,.55) 0%, transparent 45%), " +
      "radial-gradient(circle at 75% 80%, rgba(255,168,168,.55) 0%, transparent 45%), " +
      "#fbf6ea",
    accent: "#5a3e1b",
    textColor: "#2a1f10",
    font: "script",
    decoration: "floral",
    showQuote: true,
  },
  "quote-typewriter": {
    bg: "linear-gradient(180deg, #f6e9c9 0%, #e8d6a5 100%)",
    accent: "#4a2f1a",
    textColor: "#2a1f10",
    font: "sans",
    decoration: "none",
    showQuote: true,
  },
  "quote-neon": {
    bg: "linear-gradient(180deg, #0f0a1e 0%, #1a0f2e 100%)",
    accent: "#f0abfc",
    textColor: "#ec4899",
    font: "sans",
    decoration: "stars",
    showQuote: true,
  },
  "quote-chalkboard": {
    bg: "linear-gradient(180deg, #1a2e1a 0%, #142214 100%)",
    accent: "#e5e7eb",
    textColor: "#f5f5f5",
    font: "script",
    decoration: "corners",
    showQuote: true,
  },
  "quote-watercolor-script": {
    bg:
      "radial-gradient(circle at 30% 20%, rgba(251,207,232,.7) 0%, transparent 50%), " +
      "radial-gradient(circle at 70% 80%, rgba(196,181,253,.7) 0%, transparent 50%), " +
      "#fef9f0",
    accent: "#4338ca",
    textColor: "#312e81",
    font: "script",
    decoration: "floral",
    showQuote: true,
  },
  "quote-linocut": {
    bg: "linear-gradient(180deg, #fbf6ea 0%, #ead9b3 100%)",
    accent: "#1a1a1a",
    textColor: "#1a1a1a",
    font: "sans",
    decoration: "frame",
    showQuote: true,
  },

  // ── Illustrated ─────────────────────────────────────────────────
  "illus-watercolor-floral": {
    bg:
      "radial-gradient(ellipse at 50% 0%, #fbcfe8 0%, transparent 55%), " +
      "radial-gradient(ellipse at 50% 100%, #a7d4d4 0%, transparent 55%), " +
      "#fef3e7",
    accent: "#9d174d",
    textColor: "#4a044e",
    font: "serif",
    decoration: "floral",
    showQuote: false,
    captionPrefix: "Watercolor of",
  },
  "illus-mandala": {
    bg: "linear-gradient(180deg, #f6efd9 0%, #ead9b3 100%)",
    accent: "#3a2718",
    textColor: "#3a2718",
    font: "serif",
    decoration: "mandala",
    showQuote: false,
    captionPrefix: "Mandala of",
  },
  "illus-vintage-engraving": {
    bg: "linear-gradient(180deg, #e7d6b3 0%, #c9b283 100%)",
    accent: "#3a2718",
    textColor: "#3a2718",
    font: "serif",
    decoration: "frame",
    showQuote: false,
    captionPrefix: "Engraving of",
  },
  "illus-fantasy": {
    bg: "linear-gradient(180deg, #1e1b4b 0%, #6d28d9 60%, #f59e0b 100%)",
    accent: "#fbbf24",
    textColor: "#fef3c7",
    font: "serif",
    decoration: "stars",
    showQuote: false,
    captionPrefix: "Fantasy scene:",
  },
  "illus-ukiyoe": {
    bg: "linear-gradient(180deg, #e8d5b5 0%, #c4b078 100%)",
    accent: "#1e3a8a",
    textColor: "#1e3a8a",
    font: "serif",
    decoration: "waves",
    showQuote: false,
    captionPrefix: "Ukiyo-e of",
  },
  "illus-art-nouveau": {
    bg: "linear-gradient(180deg, #e7d6b3 0%, #c9a87a 100%)",
    accent: "#8a6e2a",
    textColor: "#3e2914",
    font: "serif",
    decoration: "floral",
    showQuote: false,
    captionPrefix: "Nouveau:",
  },
  "illus-stained-glass": {
    bg: "linear-gradient(180deg, #1e3a8a 0%, #c2410c 50%, #166534 100%)",
    accent: "#0a0a0a",
    textColor: "#fef3c7",
    font: "serif",
    decoration: "frame",
    showQuote: false,
    captionPrefix: "Stained glass:",
  },
  "illus-papercut": {
    bg: "linear-gradient(180deg, #fef3c7 0%, #fbbf24 50%, #c2410c 100%)",
    accent: "#4a044e",
    textColor: "#1c1917",
    font: "sans",
    decoration: "none",
    showQuote: false,
    captionPrefix: "Papercut of",
  },
  "illus-embroidery": {
    bg: "linear-gradient(180deg, #f4e8d4 0%, #e6d4b8 100%)",
    accent: "#7c2d12",
    textColor: "#422006",
    font: "sans",
    decoration: "floral",
    showQuote: false,
    captionPrefix: "Stitched:",
  },
  "illus-storybook": {
    bg: "linear-gradient(180deg, #fcd34d 0%, #fb7185 50%, #a78bfa 100%)",
    accent: "#1e3a8a",
    textColor: "#1c1917",
    font: "serif",
    decoration: "stars",
    showQuote: false,
    captionPrefix: "Storybook:",
  },
  "illus-comic-pop": {
    bg: "linear-gradient(180deg, #fde047 0%, #fb7185 100%)",
    accent: "#0a0a0a",
    textColor: "#0a0a0a",
    font: "sans",
    decoration: "halftone",
    showQuote: false,
    captionPrefix: "Comic:",
  },

  // ── Themed ───────────────────────────────────────────────────────
  "themed-cottagecore": {
    bg: "linear-gradient(180deg, #f0d9b5 0%, #d8b894 100%)",
    accent: "#7a4f1d",
    textColor: "#3e2914",
    font: "serif",
    decoration: "floral",
    showQuote: false,
    captionPrefix: "Cottage:",
  },
  "themed-darkacademia": {
    bg: "linear-gradient(180deg, #1c2a1c 0%, #2b1414 100%)",
    accent: "#b48a3c",
    textColor: "#e7d9b8",
    font: "serif",
    decoration: "frame",
    showQuote: false,
    captionPrefix: "Academia:",
  },
  "themed-anime": {
    bg: "linear-gradient(180deg, #fde68a 0%, #fb7185 50%, #6366f1 100%)",
    accent: "#fff",
    textColor: "#fff",
    font: "sans",
    decoration: "stars",
    showQuote: false,
    captionPrefix: "Anime:",
  },
  "themed-celestial": {
    bg: "radial-gradient(circle at 50% 30%, #6366f1 0%, #1e1b4b 70%)",
    accent: "#fbbf24",
    textColor: "#fef3c7",
    font: "serif",
    decoration: "stars",
    showQuote: false,
    captionPrefix: "Celestial:",
  },
  "themed-noir": {
    bg: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)",
    accent: "#e5e5e5",
    textColor: "#f5f5f5",
    font: "serif",
    decoration: "frame",
    showQuote: false,
    captionPrefix: "Noir:",
  },
  "themed-cyberpunk": {
    bg: "linear-gradient(180deg, #0a0a23 0%, #4a044e 50%, #0e7490 100%)",
    accent: "#f0abfc",
    textColor: "#f0abfc",
    font: "sans",
    decoration: "stars",
    showQuote: false,
    captionPrefix: "Cyberpunk:",
  },
  "themed-retro-scifi": {
    bg: "linear-gradient(180deg, #312e81 0%, #c2410c 50%, #fbbf24 100%)",
    accent: "#fef3c7",
    textColor: "#fef3c7",
    font: "sans",
    decoration: "stars",
    showQuote: false,
    captionPrefix: "Retro sci-fi:",
  },
  "themed-pirate-map": {
    bg: "linear-gradient(180deg, #e7d6b3 0%, #b58a4b 100%)",
    accent: "#3a2718",
    textColor: "#3a2718",
    font: "serif",
    decoration: "frame",
    showQuote: false,
    captionPrefix: "Map of",
  },
  "themed-gothic": {
    bg: "linear-gradient(180deg, #0f0a1a 0%, #2a1a2a 100%)",
    accent: "#b48a3c",
    textColor: "#d4af37",
    font: "serif",
    decoration: "frame",
    showQuote: false,
    captionPrefix: "Gothic:",
  },
  "themed-tropical": {
    bg: "linear-gradient(180deg, #166534 0%, #047857 50%, #fcd34d 100%)",
    accent: "#fef3c7",
    textColor: "#fff8ec",
    font: "sans",
    decoration: "floral",
    showQuote: false,
    captionPrefix: "Tropical:",
  },

  // ── Pattern / Minimal ────────────────────────────────────────────
  "pattern-geometric": {
    bg: "linear-gradient(180deg, #fbbf24 0%, #0d9488 50%, #b45309 100%)",
    accent: "#1a1a1a",
    textColor: "#1a1a1a",
    font: "sans",
    decoration: "geo",
    showQuote: false,
    captionPrefix: "Geometric:",
  },
  "pattern-minimal-line": {
    bg: "#faf7ef",
    accent: "#1a1a1a",
    textColor: "#1a1a1a",
    font: "sans",
    decoration: "line",
    showQuote: false,
    captionPrefix: "Line art of",
  },
  "pattern-art-deco": {
    bg: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)",
    accent: "#d4af37",
    textColor: "#d4af37",
    font: "serif",
    decoration: "deco",
    showQuote: false,
    captionPrefix: "Art Deco:",
  },
  "pattern-risograph": {
    bg:
      "radial-gradient(circle at 30% 30%, rgba(236,72,153,.85) 0%, transparent 55%), " +
      "radial-gradient(circle at 70% 70%, rgba(59,130,246,.85) 0%, transparent 55%), " +
      "#fef9e7",
    accent: "#0a0a0a",
    textColor: "#0a0a0a",
    font: "sans",
    decoration: "riso",
    showQuote: false,
    captionPrefix: "Riso print:",
  },
  "pattern-seigaiha": {
    bg: "linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)",
    accent: "#fef3c7",
    textColor: "#fef3c7",
    font: "sans",
    decoration: "waves",
    showQuote: false,
    captionPrefix: "Seigaiha:",
  },
  "pattern-bauhaus": {
    bg: "linear-gradient(180deg, #fef3c7 0%, #fde047 100%)",
    accent: "#dc2626",
    textColor: "#1e3a8a",
    font: "sans",
    decoration: "geo",
    showQuote: false,
    captionPrefix: "Bauhaus:",
  },
  "pattern-terrazzo": {
    bg:
      "radial-gradient(circle at 25% 20%, #fbcfe8 0%, #fbcfe8 4%, transparent 5%), " +
      "radial-gradient(circle at 75% 40%, #a7f3d0 0%, #a7f3d0 5%, transparent 6%), " +
      "radial-gradient(circle at 35% 70%, #fcd34d 0%, #fcd34d 3%, transparent 4%), " +
      "radial-gradient(circle at 65% 85%, #fda4af 0%, #fda4af 4%, transparent 5%), " +
      "#fef3e7",
    accent: "#1c1917",
    textColor: "#1c1917",
    font: "sans",
    decoration: "none",
    showQuote: false,
    captionPrefix: "Terrazzo:",
  },
  "pattern-isometric-grid": {
    bg: "#fafafa",
    accent: "#93c5fd",
    textColor: "#1e3a8a",
    font: "sans",
    decoration: "grid",
    showQuote: false,
    captionPrefix: "Isometric:",
  },
  "pattern-marble": {
    bg:
      "linear-gradient(135deg, #fafafa 0%, #e5e7eb 25%, #fafafa 50%, #d1d5db 75%, #fafafa 100%)",
    accent: "#525252",
    textColor: "#1c1917",
    font: "serif",
    decoration: "none",
    showQuote: false,
    captionPrefix: "Marble:",
  },
};

const fontClass: Record<FontFamily, string> = {
  serif: "font-display",
  sans: "font-sans tracking-tight",
  script: "font-display italic",
};

export function LivePreview({
  idea,
  presetId,
  presetLabel,
  providerLabel,
}: {
  idea: string;
  presetId?: string;
  presetLabel?: string;
  providerLabel?: string;
}) {
  const style = (presetId && STYLES[presetId]) || DEFAULT_STYLE;
  const trimmed = idea.trim();

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-medium">Live preview</h2>
        <span className="text-xs text-neutral-500">
          {presetLabel ? presetLabel : "Pick a style"}
          {providerLabel ? ` · ${providerLabel}` : ""}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <div
          className="bookmark-frame w-64 relative overflow-hidden"
          style={{ background: style.bg } as CSSProperties}
        >
          <Decorations decoration={style.decoration} accent={style.accent} />

          {style.showQuote && trimmed && (
            <div className="absolute inset-x-5 inset-y-10 flex items-center justify-center text-center">
              <p
                className={`text-[15px] leading-snug ${fontClass[style.font]}`}
                style={{ color: style.textColor }}
              >
                &ldquo;{trimmed}&rdquo;
              </p>
            </div>
          )}

          {style.showQuote && !trimmed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs uppercase tracking-widest opacity-50" style={{ color: style.textColor }}>
                your quote
              </span>
            </div>
          )}

          {!style.showQuote && (
            <div className="absolute bottom-4 left-3 right-3 text-center">
              <div
                className={`text-[10px] uppercase tracking-widest opacity-60 ${fontClass[style.font]}`}
                style={{ color: style.textColor }}
              >
                {style.captionPrefix ?? "preview"}
              </div>
              <div
                className={`text-[13px] leading-tight mt-0.5 ${fontClass[style.font]}`}
                style={{ color: style.textColor }}
              >
                {trimmed || "your idea"}
              </div>
            </div>
          )}
        </div>
        <p className="text-[11px] text-neutral-500 mt-2">2&quot; × 6&quot; · 600 × 1800 px @ 300 DPI</p>
      </div>
    </div>
  );
}

function Decorations({ decoration, accent }: { decoration: Decoration; accent: string }) {
  switch (decoration) {
    case "corners":
      return (
        <>
          <Corner pos="tl" color={accent} />
          <Corner pos="tr" color={accent} />
          <Corner pos="bl" color={accent} />
          <Corner pos="br" color={accent} />
        </>
      );
    case "frame":
      return (
        <div
          className="absolute inset-2 border pointer-events-none"
          style={{ borderColor: accent, borderWidth: 1 }}
        />
      );
    case "mandala":
      return (
        <svg viewBox="0 0 100 300" className="absolute inset-0 w-full h-full opacity-70">
          {[60, 90, 150, 210, 240].map((cy) => (
            <g key={cy} stroke={accent} strokeWidth={0.6} fill="none">
              <circle cx={50} cy={cy} r={28} />
              <circle cx={50} cy={cy} r={20} />
              <circle cx={50} cy={cy} r={12} />
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * Math.PI) / 6;
                return (
                  <line
                    key={i}
                    x1={50}
                    y1={cy}
                    x2={50 + Math.cos(a) * 28}
                    y2={cy + Math.sin(a) * 28}
                  />
                );
              })}
            </g>
          ))}
        </svg>
      );
    case "stars":
      return (
        <svg viewBox="0 0 100 300" className="absolute inset-0 w-full h-full">
          {Array.from({ length: 24 }).map((_, i) => {
            const x = (i * 47) % 100;
            const y = (i * 83) % 300;
            const r = (i % 3) * 0.6 + 0.6;
            return <circle key={i} cx={x} cy={y} r={r} fill={accent} opacity={0.85} />;
          })}
        </svg>
      );
    case "deco":
      return (
        <svg viewBox="0 0 100 300" className="absolute inset-0 w-full h-full">
          {[40, 260].map((cy) => (
            <g key={cy} stroke={accent} strokeWidth={0.8} fill="none">
              {Array.from({ length: 9 }).map((_, i) => {
                const a = (Math.PI * i) / 8 - Math.PI / 2;
                return (
                  <line
                    key={i}
                    x1={50}
                    y1={cy}
                    x2={50 + Math.cos(a) * 36}
                    y2={cy + Math.sin(a) * 36}
                  />
                );
              })}
              <circle cx={50} cy={cy} r={8} />
            </g>
          ))}
          <rect x={6} y={140} width={88} height={20} stroke={accent} fill="none" />
        </svg>
      );
    case "line":
      return (
        <svg viewBox="0 0 100 300" className="absolute inset-0 w-full h-full">
          <path
            d="M30 50 C 70 80, 30 130, 70 160 S 30 230, 70 260"
            stroke={accent}
            strokeWidth={1.2}
            fill="none"
          />
        </svg>
      );
    case "floral":
      return (
        <svg viewBox="0 0 100 300" className="absolute inset-0 w-full h-full opacity-80">
          {[40, 100, 170, 250].map((cy, idx) => (
            <g key={cy} transform={`translate(${idx % 2 ? 70 : 20} ${cy})`}>
              {Array.from({ length: 6 }).map((_, i) => {
                const a = (i * Math.PI) / 3;
                return (
                  <ellipse
                    key={i}
                    cx={Math.cos(a) * 8}
                    cy={Math.sin(a) * 8}
                    rx={6}
                    ry={3}
                    transform={`rotate(${(i * 60)} ${Math.cos(a) * 8} ${Math.sin(a) * 8})`}
                    fill={accent}
                    opacity={0.45}
                  />
                );
              })}
              <circle cx={0} cy={0} r={3} fill={accent} />
            </g>
          ))}
        </svg>
      );
    case "geo":
      return (
        <svg viewBox="0 0 100 300" className="absolute inset-0 w-full h-full">
          <circle cx={50} cy={70} r={28} fill={accent} opacity={0.18} />
          <rect x={20} y={140} width={60} height={60} fill={accent} opacity={0.18} />
          <polygon points="50,220 80,280 20,280" fill={accent} opacity={0.18} />
        </svg>
      );
    case "riso":
      return (
        <svg viewBox="0 0 100 300" className="absolute inset-0 w-full h-full mix-blend-multiply opacity-40">
          {Array.from({ length: 200 }).map((_, i) => {
            const x = (i * 37) % 100;
            const y = (i * 71) % 300;
            return <circle key={i} cx={x} cy={y} r={0.6} fill="#0a0a0a" />;
          })}
        </svg>
      );
    case "waves":
      return (
        <svg viewBox="0 0 100 300" className="absolute inset-0 w-full h-full opacity-80">
          {Array.from({ length: 14 }).map((_, row) => (
            <g key={row} stroke={accent} strokeWidth={0.8} fill="none" opacity={0.85}>
              {Array.from({ length: 7 }).map((_, col) => {
                const cx = col * 18 + (row % 2 ? 9 : 0);
                const cy = row * 22 + 10;
                return (
                  <g key={col}>
                    <path d={`M${cx - 10},${cy} A10,10 0 0 1 ${cx + 10},${cy}`} />
                    <path d={`M${cx - 6},${cy} A6,6 0 0 1 ${cx + 6},${cy}`} />
                    <path d={`M${cx - 2},${cy} A2,2 0 0 1 ${cx + 2},${cy}`} />
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 100 300" className="absolute inset-0 w-full h-full">
          <g stroke={accent} strokeWidth={0.4} opacity={0.7} fill="none">
            {Array.from({ length: 10 }).map((_, i) => {
              const v = i * 11;
              return (
                <g key={i}>
                  <line x1={v} y1={0} x2={v + 60} y2={300} />
                  <line x1={100 - v} y1={0} x2={100 - v - 60} y2={300} />
                </g>
              );
            })}
          </g>
        </svg>
      );
    case "halftone":
      return (
        <svg viewBox="0 0 100 300" className="absolute inset-0 w-full h-full opacity-70">
          {Array.from({ length: 18 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => {
              const cx = col * 11 + (row % 2 ? 5.5 : 0) + 2;
              const cy = row * 17 + 6;
              return <circle key={`${row}-${col}`} cx={cx} cy={cy} r={2} fill={accent} />;
            }),
          )}
        </svg>
      );
    default:
      return null;
  }
}

function Corner({ pos, color }: { pos: "tl" | "tr" | "bl" | "br"; color: string }) {
  const rotate = { tl: 0, tr: 90, br: 180, bl: 270 }[pos];
  const cls = {
    tl: "top-1.5 left-1.5",
    tr: "top-1.5 right-1.5",
    bl: "bottom-1.5 left-1.5",
    br: "bottom-1.5 right-1.5",
  }[pos];
  return (
    <svg
      viewBox="0 0 24 24"
      className={`absolute w-5 h-5 ${cls}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M2 14 V2 H14" stroke={color} strokeWidth={1.1} fill="none" />
      <path d="M5 11 V5 H11" stroke={color} strokeWidth={0.8} fill="none" />
    </svg>
  );
}
