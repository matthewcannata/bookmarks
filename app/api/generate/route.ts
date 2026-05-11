import { NextRequest, NextResponse } from "next/server";
import { getProvider, ProviderError } from "@/lib/providers";
import { getPreset } from "@/lib/presets";
import { toPrintReady } from "@/lib/print";

export const runtime = "nodejs";
export const maxDuration = 120;

interface Body {
  providerId: string;
  presetId?: string;
  idea: string;
  count?: number;
  /** if true, also return print-ready 600x1800 PNG bytes for each image */
  includePrint?: boolean;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.idea?.trim()) {
    return NextResponse.json({ error: "Missing 'idea'" }, { status: 400 });
  }

  const provider = getProvider(body.providerId);
  if (!provider) return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  if (!provider.isConfigured()) {
    return NextResponse.json(
      { error: `${provider.label} is missing its API key. Add it to .env.local.` },
      { status: 400 },
    );
  }

  const preset = body.presetId ? getPreset(body.presetId) : undefined;
  const prompt = preset ? preset.buildPrompt(body.idea) : body.idea;
  const aspect = provider.supportsTallPortrait ? "1:3" : "2:3";

  try {
    const result = await provider.generate({
      prompt,
      negativePrompt: preset?.negativePrompt,
      aspectRatio: aspect,
      count: body.count ?? 2,
    });

    const images = await Promise.all(
      result.images.map(async (img) => {
        const printB64 = body.includePrint
          ? (await toPrintReady(img.base64)).toString("base64")
          : undefined;
        return {
          previewBase64: img.base64,
          printBase64: printB64,
          width: img.width,
          height: img.height,
        };
      }),
    );

    return NextResponse.json({
      prompt,
      preset: preset?.id,
      providerModel: result.providerModel,
      images,
    });
  } catch (err) {
    const e = err as ProviderError;
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
