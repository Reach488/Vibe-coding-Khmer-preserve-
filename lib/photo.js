// Checks a chosen photo by what is inside it, not by what it is called.
// `evil.jpg.html`, a PDF renamed `photo.jpg` and an SVG all fail here because
// none of them start with the bytes of a real JPEG, PNG or WebP.
//
// The bucket repeats the type and size limits (supabase/storage.sql); this is
// the friendly version that answers before an upload starts.
export const MAX_BYTES = 5 * 1024 * 1024;

const startsWith = (bytes, signature, offset = 0) =>
  signature.every((value, i) => bytes[offset + i] === value);

function sniff(bytes) {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { type: "image/jpeg", ext: "jpg" };
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { type: "image/png", ext: "png" };
  if (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)) {
    return { type: "image/webp", ext: "webp" };
  }
  return null;
}

// Resolves to { file, type, ext } or { error } — never throws.
export default async function checkPhoto(file) {
  if (!file) return { error: "Choose a photo." };
  if (file.size > MAX_BYTES) return { error: "That photo is over 5 MB. Choose a smaller one." };

  try {
    const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const kind = sniff(head);
    if (!kind) return { error: "Use a JPEG, PNG or WebP photo." };
    return { file, ...kind };
  } catch (error) {
    console.error(error);
    return { error: "That file couldn’t be read. Choose it again." };
  }
}
