import { GenerateInput, GenerateResult, ImageProvider, ProviderError } from "./types";

const SIZE_FOR_RATIO: Record<string, [number, number]> = {
  "1:3": [512, 1536],
  "2:3": [768, 1152],
  "1:1": [1024, 1024],
};

const MAX_RETRIES = 4;
const BASE_DELAY_MS = 1800;

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchOne(
  prompt: string,
  width: number,
  height: number,
  seed: number,
  attempt = 0,
): Promise<string> {
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true&enhance=true`;

  const res = await fetch(url, { cache: "no-store" });

  // Free tier returns 429 when its 1-per-IP queue is full, or 5xx under load.
  // Back off and retry — these are transient.
  if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRIES) {
    const wait = BASE_DELAY_MS * Math.pow(1.8, attempt) + Math.random() * 500;
    await delay(wait);
    return fetchOne(prompt, width, height, seed, attempt + 1);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ProviderError(`Pollinations: ${res.status} ${text.slice(0, 200)}`, res.status);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  return buf.toString("base64");
}

export const pollinationsProvider: ImageProvider = {
  id: "pollinations",
  label: "Pollinations · Flux (free, no key)",
  supportsTallPortrait: true,

  isConfigured() {
    return true;
  },

  async generate(input: GenerateInput): Promise<GenerateResult> {
    const [w, h] = SIZE_FOR_RATIO[input.aspectRatio] ?? SIZE_FOR_RATIO["1:3"];
    const n = Math.min(input.count, 4);

    // Free tier enforces a 1-concurrent-request-per-IP limit, so we generate
    // sequentially with a small pause between calls to stay below the queue
    // threshold.
    const images: { base64: string; width: number; height: number; seed: number }[] = [];
    for (let i = 0; i < n; i++) {
      const seed = Math.floor(Math.random() * 2 ** 31);
      const base64 = await fetchOne(input.prompt, w, h, seed);
      images.push({ base64, width: w, height: h, seed });
      if (i < n - 1) await delay(800);
    }

    return { providerModel: "pollinations-flux", images };
  },
};
