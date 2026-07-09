import { z } from "zod";

export const onboardingSchema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal("")),
  sex: z.enum(["male", "female"], { required_error: "Select a sex for BMR calculation" }),
  age: z.coerce.number({ invalid_type_error: "Enter your age" }).int().min(13, "Must be 13+").max(120),
  heightCm: z.coerce.number({ invalid_type_error: "Enter your height" }).min(90).max(250),
  weightKg: z.coerce.number({ invalid_type_error: "Enter your weight" }).min(30).max(300),
  targetWeightKg: z.coerce
    .number()
    .min(30)
    .max(300)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"], {
    required_error: "Select an activity level",
  }),
  primaryGoal: z.enum(
    [
      "lose_fat",
      "build_muscle",
      "maintain_weight",
      "improve_health",
      "increase_protein",
      "athletic_performance",
      "body_recomposition",
    ],
    { required_error: "Select a goal" }
  ),
  dietaryPreference: z
    .enum(["none", "vegetarian", "vegan", "keto", "low_carb", "mediterranean"])
    .default("none"),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
