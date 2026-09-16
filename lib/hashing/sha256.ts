/**
 * Compute SHA-256 hash of a File object in the browser.
 * Uses the Web Crypto API — no server round-trip needed.
 */
export async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Convert a hex hash string to bytes32 format (0x-prefixed, 64 chars).
 */
export function toBytes32(hexHash: string): `0x${string}` {
  const clean = hexHash.startsWith('0x') ? hexHash.slice(2) : hexHash;
  return `0x${clean.padStart(64, '0')}` as `0x${string}`;
}

/**
 * Read file content as text (for AI analysis).
 * For images, returns base64. For text files, returns the text.
 */
export async function readFileContent(file: File): Promise<{ text: string; isImage: boolean }> {
  const isImage = file.type.startsWith('image/');

  if (isImage) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve({ text: base64, isImage: true });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Text-based files
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ text: reader.result as string, isImage: false });
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
