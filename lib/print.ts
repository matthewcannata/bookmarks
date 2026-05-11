import sharp from "sharp";

export const PRINT_WIDTH = 600;   // 2 inches at 300 DPI
export const PRINT_HEIGHT = 1800; // 6 inches at 300 DPI
export const PRINT_DPI = 300;

/**
 * Convert a generated image (any aspect, base64 PNG/JPEG) into a
 * print-ready 600x1800px PNG with 300 DPI metadata.
 *
 * We center-crop to a 1:3 portrait, scale up if needed, embed DPI so
 * print shops treat it as 2"x6" at 300 DPI.
 */
export async function toPrintReady(base64: string): Promise<Buffer> {
  const input = Buffer.from(base64, "base64");

  const img = sharp(input, { failOn: "none" });
  const meta = await img.metadata();
  if (!meta.width || !meta.height) {
    throw new Error("Could not read image dimensions");
  }

  // Target aspect ratio = 1:3 (portrait, height = 3*width)
  const targetRatio = PRINT_WIDTH / PRINT_HEIGHT; // 1/3
  const srcRatio = meta.width / meta.height;

  let cropW = meta.width;
  let cropH = meta.height;

  if (srcRatio > targetRatio) {
    // Source is wider than 1:3 — crop the sides.
    cropW = Math.round(meta.height * targetRatio);
  } else if (srcRatio < targetRatio) {
    // Source is taller than 1:3 — crop top/bottom.
    cropH = Math.round(meta.width / targetRatio);
  }

  const left = Math.round((meta.width - cropW) / 2);
  const top = Math.round((meta.height - cropH) / 2);

  return await img
    .extract({ left, top, width: cropW, height: cropH })
    .resize(PRINT_WIDTH, PRINT_HEIGHT, { kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .withMetadata({ density: PRINT_DPI })
    .toBuffer();
}

/** Build a square (or arbitrary) preview thumbnail for the gallery. */
export async function toThumbnail(base64: string, maxSide = 480): Promise<string> {
  const input = Buffer.from(base64, "base64");
  const buf = await sharp(input, { failOn: "none" })
    .resize(maxSide, maxSide * 3, { fit: "cover" })
    .png()
    .toBuffer();
  return buf.toString("base64");
}
