/**
 * Crop a base64 image to a target aspect ratio by trimming sides (horizontal center crop),
 * then upscale to true 300 DPI for the target print size.
 * Injects a pHYs chunk into the PNG output so image viewers report 300 DPI.
 * Returns a Promise that resolves to the cropped+upscaled base64 data URL.
 */

// Aspect ratios and print sizes in inches
const PHOTO_SPECS: Record<string, { ratio: number; widthIn: number; heightIn: number }> = {
  passport: { ratio: 4 / 6, widthIn: 4, heightIn: 6 },
  visa:     { ratio: 1,     widthIn: 2, heightIn: 2 },
  id:       { ratio: 5 / 7, widthIn: 2.5, heightIn: 3.5 },
};

const TARGET_DPI = 300;

// 300 DPI = 11811 pixels per meter (300 / 0.0254)
const DPI_300_PPM = 11811;

/**
 * Inject a pHYs chunk into a PNG data URL to set DPI to 300.
 */
function setPngDpi(dataUrl: string): string {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  // Build pHYs chunk data: 4 bytes X ppm + 4 bytes Y ppm + 1 byte unit (1 = meter)
  const physData = new Uint8Array(9);
  const view = new DataView(physData.buffer);
  view.setUint32(0, DPI_300_PPM);
  view.setUint32(4, DPI_300_PPM);
  physData[8] = 1;

  // CRC32 over type + data
  const physType = new Uint8Array([0x70, 0x48, 0x59, 0x73]); // "pHYs"
  const crcInput = new Uint8Array(physType.length + physData.length);
  crcInput.set(physType, 0);
  crcInput.set(physData, physType.length);
  const crc = crc32(crcInput);

  // Complete chunk: length(4) + type(4) + data(9) + crc(4) = 21 bytes
  const physChunk = new Uint8Array(21);
  const chunkView = new DataView(physChunk.buffer);
  chunkView.setUint32(0, 9);
  physChunk.set(physType, 4);
  physChunk.set(physData, 8);
  chunkView.setUint32(17, crc);

  // Insert after IHDR: signature(8) + IHDR chunk(25) = offset 33
  const insertAt = 33;

  // Remove existing pHYs if present
  let cleanBytes = bytes;
  let offset = insertAt;
  while (offset < cleanBytes.length - 8) {
    const chunkLen = (cleanBytes[offset] << 24) | (cleanBytes[offset + 1] << 16) |
                     (cleanBytes[offset + 2] << 8) | cleanBytes[offset + 3];
    const chunkType = String.fromCharCode(
      cleanBytes[offset + 4], cleanBytes[offset + 5],
      cleanBytes[offset + 6], cleanBytes[offset + 7]
    );
    const totalChunkSize = 4 + 4 + chunkLen + 4;
    if (chunkType === 'IDAT') break;
    if (chunkType === 'pHYs') {
      const before = cleanBytes.slice(0, offset);
      const after = cleanBytes.slice(offset + totalChunkSize);
      cleanBytes = new Uint8Array(before.length + after.length);
      cleanBytes.set(before, 0);
      cleanBytes.set(after, before.length);
      break;
    }
    offset += totalChunkSize;
  }

  // Insert new pHYs chunk
  const result = new Uint8Array(cleanBytes.length + physChunk.length);
  result.set(cleanBytes.slice(0, insertAt), 0);
  result.set(physChunk, insertAt);
  result.set(cleanBytes.slice(insertAt), insertAt + physChunk.length);

  let binaryStr = '';
  for (let i = 0; i < result.length; i++) binaryStr += String.fromCharCode(result[i]);
  return 'data:image/png;base64,' + btoa(binaryStr);
}

/** CRC32 table + function for PNG chunk validation */
const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = crcTable[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

export function cropToAspectRatio(
  dataUrl: string,
  documentType: string,
): Promise<string> {
  const spec = PHOTO_SPECS[documentType];

  // No spec found or already square (visa) — return as-is
  if (!spec || spec.ratio === 1) {
    return Promise.resolve(dataUrl);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const srcW = img.naturalWidth;
      const srcH = img.naturalHeight;
      const srcRatio = srcW / srcH;

      // If source is already narrower than or equal to target ratio, no crop needed
      if (srcRatio <= spec.ratio) {
        resolve(dataUrl);
        return;
      }

      // Step 1: Crop — keep full height, trim white margins from sides
      const cropW = Math.round(srcH * spec.ratio);
      const offsetX = Math.round((srcW - cropW) / 2);

      // Step 2: Calculate true 300 DPI output dimensions
      const finalW = Math.round(spec.widthIn * TARGET_DPI);   // e.g. 4" * 300 = 1200px
      const finalH = Math.round(spec.heightIn * TARGET_DPI);  // e.g. 6" * 300 = 1800px

      // Step 3: Crop + upscale in one draw call (browser uses bilinear interpolation)
      const canvas = document.createElement('canvas');
      canvas.width = finalW;
      canvas.height = finalH;
      const ctx = canvas.getContext('2d')!;

      // Enable high-quality image smoothing for the upscale
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw: source region (cropped) → destination (full canvas at 300 DPI size)
      ctx.drawImage(img, offsetX, 0, cropW, srcH, 0, 0, finalW, finalH);

      // Step 4: Export PNG and inject 300 DPI metadata
      const pngDataUrl = canvas.toDataURL('image/png');
      const withDpi = setPngDpi(pngDataUrl);
      resolve(withDpi);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
