/**
 * Curated supplement content. Factual, standard consumer-product
 * information (what you'd find on a real supplement label plus general,
 * widely-accepted usage context) -- not personalized medical or dosing
 * advice, and not scraped from or attributed to any specific external
 * database.
 */

export type SupplementCategorySeed = "PROTEIN" | "VITAMIN" | "MINERAL" | "OMEGA3" | "PERFORMANCE" | "OTHER";

export interface SupplementSeedDef {
  name: string;
  category: SupplementCategorySeed;
  servingLabel: string;
  activeIngredient: string;
  caloriesPerServing?: number;
  proteinPerServing?: number;
  summary: string;
}

export const CURATED_SUPPLEMENTS: SupplementSeedDef[] = [
  // --- Protein ---
  {
    name: "Whey Protein Isolate",
    category: "PROTEIN",
    servingLabel: "1 scoop (30g)",
    activeIngredient: "25g whey protein isolate",
    caloriesPerServing: 110,
    proteinPerServing: 25,
    summary:
      "A fast-digesting, low-lactose form of whey with most of the fat and carbs filtered out. Commonly taken after training or as a convenient way to hit a daily protein target.",
  },
  {
    name: "Whey Protein Concentrate",
    category: "PROTEIN",
    servingLabel: "1 scoop (33g)",
    activeIngredient: "24g whey protein concentrate",
    caloriesPerServing: 130,
    proteinPerServing: 24,
    summary:
      "Less filtered than isolate, so it retains a little more fat, carbs and naturally-occurring nutrients from milk. Usually cheaper than isolate for a similar protein dose.",
  },
  {
    name: "Plant-Based Protein (Pea & Rice Blend)",
    category: "PROTEIN",
    servingLabel: "1 scoop (33g)",
    activeIngredient: "21g pea and rice protein blend",
    caloriesPerServing: 130,
    proteinPerServing: 21,
    summary:
      "Combining pea and rice protein gives a fuller amino acid profile than either alone. A common dairy-free option for vegans, vegetarians, or anyone avoiding whey.",
  },
  {
    name: "Casein Protein",
    category: "PROTEIN",
    servingLabel: "1 scoop (33g)",
    activeIngredient: "24g micellar casein",
    caloriesPerServing: 120,
    proteinPerServing: 24,
    summary:
      "Digests much more slowly than whey, releasing amino acids gradually over several hours. Often taken before bed for this reason, though it works fine at any time protein is needed.",
  },

  // --- Performance ---
  {
    name: "Creatine Monohydrate",
    category: "PERFORMANCE",
    servingLabel: "1 scoop (5g)",
    activeIngredient: "5g creatine monohydrate",
    summary:
      "One of the most researched supplements available. Increases the muscle's stored energy for short, high-intensity efforts, supporting strength and power output over a training block. Effects build up with consistent daily use rather than a single dose, and don't depend on taking it at any particular time of day.",
  },
  {
    name: "Beta-Alanine",
    category: "PERFORMANCE",
    servingLabel: "1 serving (3.2g)",
    activeIngredient: "3.2g beta-alanine",
    summary:
      "Helps buffer acid build-up in muscle during sustained high-intensity work, which can support performance in efforts lasting roughly 1-4 minutes. A harmless tingling sensation (paraesthesia) is a common, expected side effect at typical doses.",
  },
  {
    name: "Citrulline Malate",
    category: "PERFORMANCE",
    servingLabel: "1 serving (6g)",
    activeIngredient: "6g citrulline malate",
    summary:
      "Supports nitric oxide production, which can improve blood flow to working muscles. Typically taken 30-60 minutes before training.",
  },
  {
    name: "BCAA (Branched-Chain Amino Acids)",
    category: "PERFORMANCE",
    servingLabel: "1 serving (5g)",
    activeIngredient: "5g BCAAs (2:1:1 leucine:isoleucine:valine)",
    summary:
      "Leucine, isoleucine and valine specifically. If daily protein intake is already adequate from food and/or a protein powder, BCAAs add little on top -- most useful for people training fasted or genuinely short on total protein.",
  },

  // --- Vitamins ---
  {
    name: "Multivitamin",
    category: "VITAMIN",
    servingLabel: "1 tablet",
    activeIngredient: "Broad-spectrum vitamins and minerals at standard daily-value amounts",
    summary:
      "A general nutritional safety net covering a wide range of vitamins and minerals at modest doses. Most useful for filling small gaps in a varied diet rather than replacing whole foods.",
  },
  {
    name: "Vitamin D3",
    category: "VITAMIN",
    servingLabel: "1 capsule",
    activeIngredient: "2,000 IU (50mcg) vitamin D3",
    summary:
      "Supports bone health, immune function and mood. Since the body's main source is sunlight on skin, supplementation is commonly considered by people with limited sun exposure, particularly over autumn and winter at higher latitudes.",
  },
  {
    name: "Vitamin D3 + K2 Spray",
    category: "VITAMIN",
    servingLabel: "2 sprays",
    activeIngredient: "1,000 IU (25mcg) vitamin D3 + 45mcg vitamin K2 (MK-7)",
    summary:
      "Combines D3 with K2, which helps direct the calcium D3 helps absorb toward bone rather than soft tissue. The spray format is a fast-absorbing alternative for anyone who finds capsules inconvenient.",
  },
  {
    name: "Vitamin C",
    category: "VITAMIN",
    servingLabel: "1 tablet",
    activeIngredient: "1,000mg vitamin C (ascorbic acid)",
    summary:
      "An antioxidant that supports immune function and collagen formation. Well above typical dietary requirements at this dose, with any excess simply excreted rather than stored.",
  },
  {
    name: "B-Complex",
    category: "VITAMIN",
    servingLabel: "1 capsule",
    activeIngredient: "Full spectrum of B1, B2, B3, B5, B6, B9 (folate) and B12",
    summary:
      "B vitamins are involved in converting food into usable energy. Vegans and vegetarians in particular are often advised to pay attention to B12 specifically, since it's found almost exclusively in animal products.",
  },

  // --- Minerals ---
  {
    name: "Magnesium Glycinate",
    category: "MINERAL",
    servingLabel: "2 capsules",
    activeIngredient: "200mg elemental magnesium (as glycinate)",
    summary:
      "The glycinate form is generally well tolerated and less likely to cause digestive upset than cheaper magnesium forms like oxide. Magnesium is involved in muscle function, energy metabolism and sleep quality, and is often taken in the evening.",
  },
  {
    name: "Zinc",
    category: "MINERAL",
    servingLabel: "1 tablet",
    activeIngredient: "15mg zinc",
    summary:
      "Supports immune function, wound healing and testosterone production. Best taken with food, since it can cause nausea on an empty stomach.",
  },
  {
    name: "Iron",
    category: "MINERAL",
    servingLabel: "1 tablet",
    activeIngredient: "18mg iron (as ferrous sulfate)",
    summary:
      "Essential for oxygen transport in the blood. Menstruating women, vegans/vegetarians and endurance athletes are the groups most commonly at risk of low iron -- a blood test is the reliable way to confirm need before supplementing long-term.",
  },
  {
    name: "Calcium + Vitamin D",
    category: "MINERAL",
    servingLabel: "1 tablet",
    activeIngredient: "500mg calcium + 400 IU vitamin D3",
    summary:
      "Calcium for bone density, paired with D3 to support its absorption. Most relevant for anyone with limited dairy or calcium-fortified foods in their diet.",
  },

  // --- Omega-3 ---
  {
    name: "Fish Oil (Omega-3)",
    category: "OMEGA3",
    servingLabel: "2 softgels",
    activeIngredient: "600mg EPA + 400mg DHA",
    summary:
      "EPA and DHA are the two omega-3 fatty acids most studied for heart, brain and joint health. Best absorbed when taken with a meal that contains some fat.",
  },
  {
    name: "Algae Oil (Vegan Omega-3)",
    category: "OMEGA3",
    servingLabel: "2 softgels",
    activeIngredient: "500mg DHA + 250mg EPA (from algae)",
    summary:
      "The same EPA/DHA fatty acids as fish oil, sourced from algae instead -- fish get their omega-3s from algae in the first place, so this is a direct, marine-animal-free equivalent.",
  },

  // --- Other ---
  {
    name: "Collagen Peptides",
    category: "OTHER",
    servingLabel: "1 scoop (10g)",
    activeIngredient: "9g hydrolysed collagen protein",
    caloriesPerServing: 36,
    proteinPerServing: 9,
    summary:
      "Collagen is the main structural protein in skin, tendons and joints. It's an incomplete protein (low in some essential amino acids), so it's better thought of as a targeted addition than a replacement for whey or other complete protein sources.",
  },
  {
    name: "Probiotic",
    category: "OTHER",
    servingLabel: "1 capsule",
    activeIngredient: "10 billion CFU, multi-strain blend",
    summary:
      "Live bacterial cultures intended to support gut microbiome diversity. Response varies a lot between individuals and strains; consistency over several weeks matters more than any single dose.",
  },
  {
    name: "Electrolyte Mix",
    category: "OTHER",
    servingLabel: "1 scoop",
    activeIngredient: "Sodium, potassium and magnesium blend",
    summary:
      "Replaces salts lost through sweat during longer or hotter training sessions, when water alone may not be enough to maintain hydration and performance.",
  },
];
