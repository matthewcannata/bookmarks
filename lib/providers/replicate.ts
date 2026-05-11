import { GenerateInput, GenerateResult, ImageProvider, ProviderError } from "./types";

const MODEL = "ideogram-ai/ideogram-v2";

const RATIO_MAP: Record<string, string> = {
  "1:3": "9:16",
  "2:3": "2:3",
  "1:1": "1:1",
};

async function urlToBase64(url: string): Promise<{ base64: string; width: number; height: number }> {
  const r = await fetch(url);
  if (!r.ok) throw new ProviderError(`Failed to fetch image: ${r.status}`, 502);
  const buf = Buffer.from(await r.arrayBuffer());
  return { base64: buf.toString("base64"), width: 0, height: 0 };
}

export const replicateProvider: ImageProvider = {
  id: "replicate-ideogram",
  label: "Replicate · Ideogram v2 (best text)",
  supportsTallPortrait: true,

  isConfigured() {
    return Boolean(process.env.REPLICATE_API_TOKEN);
  },

  async generate(input: GenerateInput): Promise<GenerateResult> {
    if (!this.isConfigured()) {
      throw new ProviderError("REPLICATE_API_TOKEN not set", 400);
    }
    const aspect = RATIO_MAP[input.aspectRatio] ?? "9:16";

    const create = await fetch(`https://api.replicate.com/v1/models/${MODEL}/predictions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        input: {
          prompt: input.prompt,
          aspect_ratio: aspect,
          magic_prompt_option: "Auto",
          style_type: "Auto",
        },
      }),
    });

    if (!create.ok) {
      const text = await create.text();
      throw new ProviderError(`Replicate: ${create.status} ${text}`, create.status);
    }

    let prediction = await create.json();

    while (prediction.status === "starting" || prediction.status === "processing") {
      await new Promise((r) => setTimeout(r, 1500));
      const poll = await fetch(prediction.urls.get, {
        headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
      });
      prediction = await poll.json();
    }

    if (prediction.status !== "succeeded") {
      throw new ProviderError(`Replicate prediction failed: ${prediction.error ?? prediction.status}`, 502);
    }

    const outputs: string[] = Array.isArray(prediction.output) ? prediction.output : [prediction.output];
    const images = await Promise.all(outputs.map(urlToBase64));

    return { providerModel: MODEL, images };
  },
};
