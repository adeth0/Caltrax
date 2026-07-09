import { z } from "zod";
import { callClaude, parseJSONResponse } from "./client";

const recognizedItemSchema = z.object({
  name: z.string().min(1).max(120),
  estimatedGrams: z.number().positive().max(3000),
  caloriesPer100g: z.number().nonnegative().max(950),
  proteinPer100g: z.number().nonnegative().max(100),
  carbsPer100g: z.number().nonnegative().max(100),
  fatPer100g: z.number().nonnegative().max(100),
});

const recognitionResponseSchema = z.object({
  items: z.array(recognizedItemSchema).min(1).max(8),
  confidence: z.enum(["low", "medium", "high"]),
  notes: z.string().max(300).optional(),
});

export type RecognizedFoodItem = z.infer<typeof recognizedItemSchema>;
export type MealRecognitionResult = z.infer<typeof recognitionResponseSchema>;

const SYSTEM_PROMPT = `You are a nutrition estimation assistant embedded in a calorie-tracking app.
Given a photo of a meal, identify each distinct food item and estimate its portion and macros.

Respond with ONLY valid JSON (no markdown fences, no commentary) matching exactly this shape:
{
  "items": [
    {
      "name": "string, concise food name",
      "estimatedGrams": number, // estimated total grams of THIS item as plated
      "caloriesPer100g": number,
      "proteinPer100g": number,
      "carbsPer100g": number,
      "fatPer100g": number
    }
  ],
  "confidence": "low" | "medium" | "high",
  "notes": "string, optional — mention anything that limits your confidence (occlusion, ambiguous portion, mixed dish, etc)"
}

Use standard nutrition-database values per 100g (raw or cooked as appropriate to what's shown), not per-portion values.
If multiple foods are mixed in a single dish you cannot separate, list it as one item with your best combined estimate.
Be conservative and realistic with portion sizes based on visible plate/container scale.`;

/** Downscaled JPEG base64 (no data: prefix) in, structured macro estimate out. */
export async function recognizeMealPhoto(
  imageBase64: string,
  mediaType: string
): Promise<MealRecognitionResult> {
  const raw = await callClaude({
    system: SYSTEM_PROMPT,
    text: "Analyze this meal photo and return the JSON described in the system prompt.",
    image: { base64: imageBase64, mediaType },
    maxTokens: 1200,
  });

  const parsed = parseJSONResponse<unknown>(raw);
  return recognitionResponseSchema.parse(parsed);
}
