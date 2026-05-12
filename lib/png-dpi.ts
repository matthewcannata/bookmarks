// Inject a pHYs chunk into a PNG blob to declare physical pixel density.
// This is what print services read to size the image (300 DPI → 2"x6" for a 600x1800 PNG).

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function buildPhysChunk(dpi: number): Uint8Array {
  const ppm = Math.round(dpi / 0.0254); // pixels per meter
  const data = new Uint8Array(9);
  // x pixels-per-unit (4 bytes, big-endian)
  data[0] = (ppm >>> 24) & 0xff;
  data[1] = (ppm >>> 16) & 0xff;
  data[2] = (ppm >>> 8) & 0xff;
  data[3] = ppm & 0xff;
  // y pixels-per-unit (4 bytes)
  data[4] = data[0];
  data[5] = data[1];
  data[6] = data[2];
  data[7] = data[3];
  // unit = meters
  data[8] = 1;

  const type = new Uint8Array([0x70, 0x48, 0x59, 0x73]); // "pHYs"
  const crcInput = new Uint8Array(type.length + data.length);
  crcInput.set(type, 0);
  crcInput.set(data, type.length);
  const crc = crc32(crcInput);

  const chunk = new Uint8Array(4 + 4 + data.length + 4); // length + type + data + crc
  // length (data only = 9)
  chunk[0] = 0;
  chunk[1] = 0;
  chunk[2] = 0;
  chunk[3] = data.length;
  chunk.set(type, 4);
  chunk.set(data, 8);
  chunk[chunk.length - 4] = (crc >>> 24) & 0xff;
  chunk[chunk.length - 3] = (crc >>> 16) & 0xff;
  chunk[chunk.length - 2] = (crc >>> 8) & 0xff;
  chunk[chunk.length - 1] = crc & 0xff;
  return chunk;
}

export async function injectPngDpi(blob: Blob, dpi = 300): Promise<Blob> {
  const buf = new Uint8Array(await blob.arrayBuffer());

  // PNG signature: 8 bytes
  // IHDR chunk: 4 length + 4 "IHDR" + 13 data + 4 CRC = 25 bytes, ending at offset 33
  const insertAt = 33;

  // If the file already has a pHYs chunk right after IHDR, replace it.
  const next4 = String.fromCharCode(buf[insertAt + 4], buf[insertAt + 5], buf[insertAt + 6], buf[insertAt + 7]);
  let tail: Uint8Array;
  if (next4 === "pHYs") {
    const existingLen = (buf[insertAt] << 24) | (buf[insertAt + 1] << 16) | (buf[insertAt + 2] << 8) | buf[insertAt + 3];
    const existingTotal = 4 + 4 + existingLen + 4;
    tail = buf.slice(insertAt + existingTotal);
  } else {
    tail = buf.slice(insertAt);
  }

  const chunk = buildPhysChunk(dpi);
  const out = new Uint8Array(insertAt + chunk.length + tail.length);
  out.set(buf.slice(0, insertAt), 0);
  out.set(chunk, insertAt);
  out.set(tail, insertAt + chunk.length);

  return new Blob([new Uint8Array(out)], { type: "image/png" });
}
