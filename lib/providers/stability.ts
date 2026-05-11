import { GenerateInput, GenerateResult, ImageProvider, ProviderError } from "./types";

const RATIO_MAP: Record<string, string> = {
  "1:3": "9:21",
  "2:3": "2:3",
  "1:1": "1:1",
};

export const stabilityProvider: ImageProvider = {
  id: "stability",
  label: "Stability · SD3.5 (cheapest)",
  supportsTallPortrait: true,

  isConfigured() {
    return Boolean(process.env.STABILITY_API_KEY);
  },

  async generate(input: GenerateInput): Promise<GenerateResult> {
    if (!this.isConfigured()) {
      throw new ProviderError("STABILITY_API_KEY not set", 400);
    }

    const aspect = RATIO_MAP[input.aspectRatio] ?? "9:21";

    const form = new FormData();
    form.append("prompt", input.prompt);
    if (input.negativePrompt) form.append("negative_prompt", input.negativePrompt);
    form.append("aspect_ratio", aspect);
    form.append("output_format", "png");
    form.append("model", "sd3.5-large");

    const calls = Array.from({ length: Math.min(input.count, 4) }, async () => {
      const res = await fetch("https://api.stability.ai/v2beta/stable-image/generate/sd3", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
        body: form,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new ProviderError(`Stability: ${res.status} ${text}`, res.status);
      }
      const buf = Buffer.from(await res.arrayBuffer());
      return { base64: buf.toString("base64"), width: 0, height: 0 };
    });

    const images = await Promise.all(calls);
    return { providerModel: "sd3.5-large", images };
  },
};
