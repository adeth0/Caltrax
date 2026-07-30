/** Resizes to a max 1024px edge JPEG and returns base64 (no data: prefix) — keeps upload payloads small and fast. */
export async function downscaleToJpegBase64(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const maxEdge = 1024;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
  return dataUrl.split(",")[1] ?? "";
}
