import { openaiProvider } from "./openai";
import { pollinationsProvider } from "./pollinations";
import { replicateProvider } from "./replicate";
import { stabilityProvider } from "./stability";
import { ImageProvider } from "./types";

export const providers: ImageProvider[] = [
  pollinationsProvider,
  openaiProvider,
  replicateProvider,
  stabilityProvider,
];

export function getProvider(id: string): ImageProvider | undefined {
  return providers.find((p) => p.id === id);
}

export function listProviders() {
  return providers.map((p) => ({
    id: p.id,
    label: p.label,
    configured: p.isConfigured(),
    supportsTallPortrait: p.supportsTallPortrait,
  }));
}

export * from "./types";
