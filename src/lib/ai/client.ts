// Server-only. Never import this from a Client Component — it reads
// ANTHROPIC_API_KEY, which must never reach the browser bundle.

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
// Vision-capable, cost-effective for structured extraction tasks like these.
// Swap to a larger model here if accuracy on tricky photos needs improving.
const MODEL = "claude-sonnet-5";

export class AIConfigError extends Error {}

interface ImageBlock {
  type: "image";
  source: { type: "base64"; media_type: string; data: string };
}

interface TextBlock {
  type: "text";
  text: string;
}

/**
 * Calls Claude with an optional image and returns the raw text response.
 * Callers that need structured data should instruct the model (via
 * `system`) to respond with JSON only, then parse the result themselves —
 * kept out of this helper so it stays reusable for plain-text use cases too.
 */
export async function callClaude(params: {
  system: string;
  text: string;
  image?: { base64: string; mediaType: string };
  maxTokens?: number;
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AIConfigError(
      "AI features aren't configured yet — ANTHROPIC_API_KEY is missing from the environment."
    );
  }

  const content: (ImageBlock | TextBlock)[] = [];
  if (params.image) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: params.image.mediaType, data: params.image.base64 },
    });
  }
  content.push({ type: "text", text: params.text });

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: params.maxTokens ?? 1024,
      system: params.system,
      messages: [{ role: "user", content }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Anthropic API error (${res.status}): ${detail.slice(0, 300)}`);
  }

  const data = (await res.json()) as { content: { type: string; text?: string }[] };
  const textBlock = data.content.find((b) => b.type === "text" && b.text);
  if (!textBlock?.text) throw new Error("Anthropic API returned no text content");
  return textBlock.text;
}

/** Strips markdown code fences the model sometimes wraps JSON in, then parses. */
export function parseJSONResponse<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "");
  return JSON.parse(cleaned) as T;
}
