export interface SupplementInfo {
  id: string;
  name: string;
  category: "vitamin" | "mineral" | "protein" | "performance" | "electrolyte";
  summary: string;
  typicalAdultRange: string;
  bestTimeToTake: string;
  possibleInteractions: string;
  evidenceSummary: string;
  sourceUrl: string;
}

/**
 * Educational content only. This is intentionally general (population-level
 * ranges from public health bodies / consensus reviews), never a dosage
 * recommendation for a specific person. Every card in the UI must render
 * alongside the disclaimer in <SupplementDisclaimer /> — never standalone.
 */
export const SUPPLEMENTS: SupplementInfo[] = [
  {
    id: "vitamin-d3",
    name: "Vitamin D3",
    category: "vitamin",
    summary:
      "Supports bone health, immune function and calcium absorption. Widely deficient in populations with low sun exposure.",
    typicalAdultRange:
      "600–2,000 IU/day is the commonly cited general population range; some clinical protocols use higher doses under supervision.",
    bestTimeToTake: "With a meal containing fat, as it is fat-soluble.",
    possibleInteractions: "May interact with corticosteroids and certain cholesterol-lowering medications.",
    evidenceSummary: "Strong evidence for bone health; ongoing research on immune and mood-related effects.",
    sourceUrl: "https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/",
  },
  {
    id: "omega-3",
    name: "Omega-3 Fish Oil",
    category: "performance",
    summary: "EPA/DHA fatty acids linked to cardiovascular and cognitive health support.",
    typicalAdultRange: "250–1,000 mg combined EPA/DHA per day in most general-health protocols.",
    bestTimeToTake: "With a meal to reduce GI upset and improve absorption.",
    possibleInteractions: "May increase bleeding risk when combined with anticoagulant medication.",
    evidenceSummary:
      "Good evidence for triglyceride reduction; mixed evidence for broader cardiovascular outcomes.",
    sourceUrl: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/",
  },
  {
    id: "creatine-monohydrate",
    name: "Creatine Monohydrate",
    category: "performance",
    summary:
      "One of the most studied sports supplements; supports strength and high-intensity exercise performance.",
    typicalAdultRange:
      "3–5 g/day maintenance dose; some protocols use a short loading phase of ~20 g/day for 5–7 days.",
    bestTimeToTake: "Any time of day; consistency matters more than timing.",
    possibleInteractions: "Generally well tolerated; ensure adequate hydration.",
    evidenceSummary:
      "Extensive evidence for strength/power performance; considered one of the best-studied supplements available.",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/28615996/",
  },
  {
    id: "magnesium",
    name: "Magnesium",
    category: "mineral",
    summary: "Involved in muscle function, energy metabolism and sleep quality.",
    typicalAdultRange: "310–420 mg/day total intake (diet + supplement), per general nutrition guidelines.",
    bestTimeToTake: "In the evening; some forms may support relaxation.",
    possibleInteractions: "May interact with certain antibiotics and diuretics.",
    evidenceSummary:
      "Well-established role in muscle/nerve function; supplementation evidence strongest in diagnosed deficiency.",
    sourceUrl: "https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/",
  },
  {
    id: "zinc",
    name: "Zinc",
    category: "mineral",
    summary: "Supports immune function and wound healing.",
    typicalAdultRange: "8–11 mg/day general population intake.",
    bestTimeToTake: "With food to reduce nausea.",
    possibleInteractions:
      "Can reduce absorption of certain antibiotics; high doses may interfere with copper absorption.",
    evidenceSummary: "Good evidence for immune support at recommended intake levels.",
    sourceUrl: "https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/",
  },
  {
    id: "multivitamin",
    name: "Multivitamin",
    category: "vitamin",
    summary: "General insurance against dietary gaps; not a substitute for a varied diet.",
    typicalAdultRange: "One standard adult serving per label directions.",
    bestTimeToTake: "With a meal to improve absorption of fat-soluble vitamins.",
    possibleInteractions: "Varies widely by formulation; check individual ingredients.",
    evidenceSummary: "Evidence for benefit is strongest in people with an existing dietary gap.",
    sourceUrl: "https://ods.od.nih.gov/factsheets/MVMS-HealthProfessional/",
  },
  {
    id: "electrolytes",
    name: "Electrolytes",
    category: "electrolyte",
    summary: "Sodium, potassium and magnesium blends supporting hydration, especially around exercise.",
    typicalAdultRange:
      "Varies by sweat rate and activity duration; general-use products typically provide 300–700mg sodium per serving.",
    bestTimeToTake: "During or after prolonged exercise, or in hot conditions.",
    possibleInteractions:
      "Those on sodium-restricted diets or blood pressure medication should check with a doctor.",
    evidenceSummary: "Well-established benefit for endurance exercise and heat exposure.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4207053/",
  },
  {
    id: "vitamin-c",
    name: "Vitamin C",
    category: "vitamin",
    summary: "Antioxidant supporting immune function and collagen synthesis.",
    typicalAdultRange: "65–90 mg/day general population intake; some protocols use higher doses short-term.",
    bestTimeToTake: "Any time; water-soluble so excess is excreted.",
    possibleInteractions: "Very high doses may cause GI upset; generally low interaction risk.",
    evidenceSummary: "Well-established role in immune and connective tissue health.",
    sourceUrl: "https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/",
  },
  {
    id: "whey-protein",
    name: "Whey Protein",
    category: "protein",
    summary: "Fast-digesting complete protein, convenient for hitting daily protein targets.",
    typicalAdultRange: "20–40 g per serving, used to fill gaps toward a total daily protein target.",
    bestTimeToTake: "Post-exercise or any time protein intake is running low for the day.",
    possibleInteractions:
      "Not suitable for those with dairy allergy; some report GI discomfort with lactose sensitivity.",
    evidenceSummary:
      "Strong evidence for supporting muscle protein synthesis when total daily protein is adequate.",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/28698222/",
  },
  {
    id: "casein",
    name: "Casein",
    category: "protein",
    summary: "Slow-digesting protein, often used before extended periods without food (e.g. overnight).",
    typicalAdultRange: "20–40 g per serving.",
    bestTimeToTake: "Before bed or before other long gaps between meals.",
    possibleInteractions: "Not suitable for those with dairy allergy.",
    evidenceSummary:
      "Evidence supports slower amino acid release compared to whey; similar long-term outcomes when total protein is matched.",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/28698222/",
  },
  {
    id: "plant-protein",
    name: "Plant Protein",
    category: "protein",
    summary: "Pea, rice, soy or blended plant proteins for vegetarian/vegan diets.",
    typicalAdultRange: "20–40 g per serving; blends are often used to achieve a fuller amino acid profile.",
    bestTimeToTake: "Any time protein intake needs topping up.",
    possibleInteractions: "Generally well tolerated; check for allergens in the specific blend.",
    evidenceSummary:
      "Comparable muscle-building outcomes to animal protein when total intake and amino acid profile are matched.",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/31504744/",
  },
  {
    id: "collagen",
    name: "Collagen",
    category: "protein",
    summary: "Structural protein marketed for skin, joint and connective tissue support.",
    typicalAdultRange: "10–15 g/day in most studied protocols.",
    bestTimeToTake: "Any time; some pair it with vitamin C to support synthesis.",
    possibleInteractions:
      "Generally well tolerated; low allergen risk outside of source (bovine/marine) sensitivities.",
    evidenceSummary:
      "Emerging evidence for skin elasticity and joint comfort; not a complete protein for muscle-building purposes.",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/31627309/",
  },
];

export const SUPPLEMENT_DISCLAIMER =
  "This section is educational and general in nature. It is not medical advice and does not replace guidance from a qualified healthcare professional. Speak with a doctor or pharmacist before starting any supplement, especially if you are pregnant, breastfeeding, taking medication, or managing a medical condition.";
