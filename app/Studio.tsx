"use client";

import { useEffect, useMemo, useState } from "react";
import { LivePreview } from "./LivePreview";

type ProviderInfo = {
  id: string;
  label: string;
  configured: boolean;
  supportsTallPortrait: boolean;
};

type Preset = { id: string; category: string; label: string; hint: string };
type PresetGroup = { category: string; label: string; items: Preset[] };

type GeneratedImage = { previewBase64: string; printBase64?: string };
type GenerationResponse = {
  prompt: string;
  preset?: string;
  providerModel: string;
  images: GeneratedImage[];
  error?: string;
};

type GalleryItem = {
  id: string;
  createdAt: number;
  previewBase64: string;
  idea: string;
  presetId?: string;
  providerId: string;
  prompt: string;
};

const GALLERY_KEY = "bookmark-studio:gallery:v1";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadGallery(): GalleryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(GALLERY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveGallery(items: GalleryItem[]) {
  // Keep last 60 to avoid bloating localStorage.
  const trimmed = items.slice(0, 60);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(trimmed));
}

export default function Studio() {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [presetGroups, setPresetGroups] = useState<PresetGroup[]>([]);
  const [providerId, setProviderId] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("quote");
  const [presetId, setPresetId] = useState<string | undefined>();
  const [idea, setIdea] = useState<string>("");
  const [count, setCount] = useState<number>(2);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [lastPrompt, setLastPrompt] = useState<string>("");
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    setGallery(loadGallery());
    (async () => {
      const [p, pr] = await Promise.all([
        fetch("/api/providers").then((r) => r.json()),
        fetch("/api/presets").then((r) => r.json()),
      ]);
      setProviders(p.providers);
      setPresetGroups(pr.groups);

      const firstConfigured = p.providers.find((x: ProviderInfo) => x.configured);
      setProviderId(firstConfigured?.id ?? p.providers[0]?.id ?? "");
    })();
  }, []);

  const activePresets = useMemo(
    () => presetGroups.find((g) => g.category === activeCategory)?.items ?? [],
    [presetGroups, activeCategory],
  );

  const selectedProvider = providers.find((p) => p.id === providerId);
  const selectedPreset = useMemo(() => {
    for (const g of presetGroups) for (const p of g.items) if (p.id === presetId) return p;
    return undefined;
  }, [presetGroups, presetId]);
  const anyConfigured = providers.some((p) => p.configured);

  async function handleGenerate() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId, presetId, idea, count }),
      });
      const data: GenerationResponse = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResults(data.images);
      setLastPrompt(data.prompt);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function saveToGallery(img: GeneratedImage) {
    const item: GalleryItem = {
      id: uid(),
      createdAt: Date.now(),
      previewBase64: img.previewBase64,
      idea,
      presetId,
      providerId,
      prompt: lastPrompt,
    };
    const next = [item, ...gallery];
    setGallery(next);
    saveGallery(next);
  }

  function removeFromGallery(id: string) {
    const next = gallery.filter((g) => g.id !== id);
    setGallery(next);
    saveGallery(next);
  }

  function loadFromGallery(item: GalleryItem) {
    setIdea(item.idea);
    setPresetId(item.presetId);
    setProviderId(item.providerId);
    const cat = presetGroups.find((g) => g.items.some((p) => p.id === item.presetId))?.category;
    if (cat) setActiveCategory(cat);
  }

  async function downloadPrint(img: GeneratedImage, label: string) {
    if (img.printBase64) {
      triggerDownload(img.printBase64, `${label}.png`);
      return;
    }
    const res = await fetch("/api/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64: img.previewBase64, filename: label }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Print conversion failed");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${label}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink-100 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div>
            <h1 className="font-display text-2xl tracking-tight">Bookmark Studio</h1>
            <p className="text-xs text-neutral-500">
              Design printable bookmarks · 2&quot; × 6&quot; · 300 DPI
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-neutral-500">Provider</label>
            <select
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              className="border border-ink-100 bg-white px-3 py-2 rounded text-sm"
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id} disabled={!p.configured}>
                  {p.label}
                  {p.configured ? "" : " · no key"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {!anyConfigured && providers.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm px-6 py-3 text-center">
          No image-generation API keys configured. Copy <code>.env.local.example</code> to{" "}
          <code>.env.local</code> and add at least one key.
        </div>
      )}

      <div className="flex-1 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[360px_1fr_300px] gap-6 px-6 py-6">
        {/* ── Left: generator controls ─────────────────────────────────── */}
        <aside className="space-y-5">
          <section>
            <h2 className="text-sm font-medium mb-2">Your idea</h2>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={3}
              placeholder='e.g. "She believed she could so she did" — or "a fox curled around the moon"'
              className="w-full border border-ink-100 rounded p-3 text-sm bg-white"
            />
          </section>

          <section>
            <h2 className="text-sm font-medium mb-2">Style</h2>
            <div className="flex gap-1 mb-2">
              {presetGroups.map((g) => (
                <button
                  key={g.category}
                  onClick={() => setActiveCategory(g.category)}
                  className={`px-3 py-1.5 text-xs rounded-full border ${
                    activeCategory === g.category
                      ? "bg-ink-900 text-white border-ink-900"
                      : "bg-white border-ink-100 hover:border-neutral-400"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {activePresets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPresetId(presetId === p.id ? undefined : p.id)}
                  className={`text-left border rounded p-2.5 transition ${
                    presetId === p.id
                      ? "border-brand-500 bg-brand-500/5"
                      : "border-ink-100 bg-white hover:border-neutral-400"
                  }`}
                >
                  <div className="text-sm font-medium">{p.label}</div>
                  <div className="text-xs text-neutral-500">{p.hint}</div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium mb-2">Variations</h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 text-sm rounded border ${
                    count === n
                      ? "bg-ink-900 text-white border-ink-900"
                      : "bg-white border-ink-100 hover:border-neutral-400"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </section>

          <button
            onClick={handleGenerate}
            disabled={busy || !idea.trim() || !selectedProvider?.configured}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-neutral-300 text-white font-medium py-3 rounded transition"
          >
            {busy ? "Generating…" : "Generate"}
          </button>

          {error && (
            <div className="text-sm bg-red-50 border border-red-200 text-red-700 rounded p-3">
              {error}
            </div>
          )}
        </aside>

        {/* ── Center: live preview + results ──────────────────────────── */}
        <main className="space-y-8">
          <LivePreview
            idea={idea}
            presetId={presetId}
            presetLabel={selectedPreset?.label}
            providerLabel={selectedProvider?.label}
          />

          {results.length > 0 && (
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-sm font-medium">Latest generation</h2>
                <p
                  className="text-xs text-neutral-500 truncate max-w-[60%]"
                  title={lastPrompt}
                >
                  {lastPrompt}
                </p>
              </div>
              <div
                className={`grid gap-4 ${
                  results.length > 1 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1 max-w-sm"
                }`}
              >
                {results.map((img, i) => (
                  <BookmarkCard
                    key={i}
                    image={img}
                    onSave={() => saveToGallery(img)}
                    onDownload={() => downloadPrint(img, `bookmark-${Date.now()}-${i + 1}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {results.length === 0 && (
            <p className="text-xs text-neutral-500 text-center">
              Type an idea, pick a style — the preview above updates live. Click <b>Generate</b> when ready.
            </p>
          )}
        </main>

        {/* ── Right: gallery ──────────────────────────────────────────── */}
        <aside>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-sm font-medium">Gallery</h2>
            <span className="text-xs text-neutral-500">{gallery.length} saved</span>
          </div>
          {gallery.length === 0 ? (
            <p className="text-xs text-neutral-500">Saved bookmarks land here. Click one to reload its prompt.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-[80vh] overflow-y-auto pr-1">
              {gallery.map((g) => (
                <GalleryThumb
                  key={g.id}
                  item={g}
                  onClick={() => loadFromGallery(g)}
                  onRemove={() => removeFromGallery(g.id)}
                  onDownload={() =>
                    downloadPrint(
                      { previewBase64: g.previewBase64 },
                      `bookmark-${new Date(g.createdAt).toISOString().slice(0, 10)}`,
                    )
                  }
                />
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function BookmarkCard({
  image,
  onSave,
  onDownload,
}: {
  image: GeneratedImage;
  onSave: () => void;
  onDownload: () => void;
}) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="space-y-2">
      <div className="bookmark-frame">
        <img
          src={`data:image/png;base64,${image.previewBase64}`}
          alt="Generated bookmark"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            onSave();
            setSaved(true);
          }}
          disabled={saved}
          className="flex-1 text-xs py-1.5 rounded border border-ink-100 hover:border-neutral-400 disabled:text-neutral-400"
        >
          {saved ? "Saved ✓" : "Save"}
        </button>
        <button
          onClick={onDownload}
          className="flex-1 text-xs py-1.5 rounded border border-ink-100 hover:border-neutral-400"
        >
          Download
        </button>
      </div>
    </div>
  );
}

function GalleryThumb({
  item,
  onClick,
  onRemove,
  onDownload,
}: {
  item: GalleryItem;
  onClick: () => void;
  onRemove: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="group relative">
      <button onClick={onClick} className="block w-full bookmark-frame" title={item.idea || item.prompt}>
        <img
          src={`data:image/png;base64,${item.previewBase64}`}
          alt={item.idea}
          className="w-full h-full object-cover"
        />
      </button>
      <div className="absolute inset-x-0 bottom-0 p-1 flex gap-1 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/60 to-transparent">
        <button
          onClick={onDownload}
          className="flex-1 text-[10px] py-1 rounded bg-white/90 hover:bg-white"
        >
          PNG
        </button>
        <button
          onClick={onRemove}
          className="text-[10px] px-2 py-1 rounded bg-white/90 hover:bg-white"
          aria-label="Remove"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function triggerDownload(base64: string, filename: string) {
  const a = document.createElement("a");
  a.href = `data:image/png;base64,${base64}`;
  a.download = filename;
  a.click();
}
