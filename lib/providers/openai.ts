import { GenerateInput, GenerateResult, ImageProvider, ProviderError } from "./types";

const SIZE_FOR_RATIO: Record<string, string> = {
  "1:3": "1024x1536",
  "2:3": "1024x1536",
  "1:1": "1024x1024",
};

export const openaiProvider: ImageProvider = {
  id: "openai",
  label: "OpenAI · gpt-image-1",
  supportsTallPortrait: false,

  isConfigured() {
    return Boolean(process.env.OPENAI_API_KEY);
  },

  async generate(input: GenerateInput): Promise<GenerateResult> {
    if (!this.isConfigured()) {
      throw new ProviderError("OPENAI_API_KEY not set", 400);
    }
    const size = SIZE_FOR_RATIO[input.aspectRatio] ?? "1024x1536";
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: input.prompt,
        n: Math.min(input.count, 4),
        size,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new ProviderError(`OpenAI: ${res.status} ${text}`, res.status);
    }
    const data = await res.json();
    const [w, h] = size.split("x").map(Number);

    return {
      providerModel: "gpt-image-1",
      images: (data.data ?? []).map((d: { b64_json: string }) => ({
        base64: d.b64_json,
        width: w,
        height: h,
      })),
    };
  },
};
