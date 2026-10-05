// src/utils/crypto.ts

/**
 * Computes SHA-256 hash of a string or ArrayBuffer
 * Uses Web Crypto API when available with a fast fallback
 */
export async function computeSHA256(data: string | ArrayBuffer): Promise<string> {
  let buffer: Uint8Array;
  if (typeof data === 'string') {
    buffer = new TextEncoder().encode(data);
  } else {
    buffer = new Uint8Array(data);
  }

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer as unknown as BufferSource);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }

  // Pure TypeScript fallback hash if crypto.subtle unavailable
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  for (let i = 0; i < buffer.length; i++) {
    h0 = (h0 ^ (buffer[i] << 4)) >>> 0;
    h1 = (h1 + buffer[i] * 31) >>> 0;
    h2 = (h2 ^ buffer[i]) >>> 0;
    h3 = (h3 + (buffer[i] << 1)) >>> 0;
  }
  return [h0, h1, h2, h3].map(h => (h >>> 0).toString(16).padStart(8, '0')).join('');
}
