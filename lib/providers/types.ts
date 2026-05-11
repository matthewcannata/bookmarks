export type AspectRatio = "1:3" | "2:3" | "1:1";

export interface GenerateInput {
  prompt: string;
  negativePrompt?: string;
  aspectRatio: AspectRatio;
  count: number;
  seed?: number;
}

export interface GeneratedImage {
  /** PNG bytes, base64-encoded, no data: prefix */
  base64: string;
  /** Native dimensions returned by the provider before post-processing */
  width: number;
  height: number;
  seed?: number;
}

export interface GenerateResult {
  images: GeneratedImage[];
  providerModel: string;
}

export interface ImageProvider {
  id: string;
  label: string;
  /** Set true if the provider can natively render tall (1:3) portraits */
  supportsTallPortrait: boolean;
  /** Returns null if the provider isn't configured (e.g. missing API key) */
  isConfigured(): boolean;
  generate(input: GenerateInput): Promise<GenerateResult>;
}

export class ProviderError extends Error {
  constructor(message: string, public status: number = 500) {
    super(message);
    this.name = "ProviderError";
  }
}
