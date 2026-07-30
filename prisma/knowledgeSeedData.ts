/**
 * Curated "Learn" articles. Written for this app specifically -- real,
 * accurate nutrition and training education grounded in well-established
 * science, framed as general education rather than personalized medical
 * or dosing advice. Not scraped from or attributed to any external
 * source.
 */

export type KnowledgeCategorySeed = "NUTRITION_BASICS" | "SUPPLEMENTS" | "TRAINING" | "RECOVERY";

export interface KnowledgeArticleSeedDef {
  slug: string;
  title: string;
  category: KnowledgeCategorySeed;
  summary: string;
  content: string;
  /** Matches a Supplement.name from supplementSeedData.ts, if this article has one. */
  relatedSupplementName?: string;
}

export const CURATED_ARTICLES: KnowledgeArticleSeedDef[] = [
  // --- Nutrition basics ---
  {
    slug: "calories-and-energy-balance",
    title: "Understanding Calories and Energy Balance",
    category: "NUTRITION_BASICS",
    summary: "The single idea underneath every fat-loss or muscle-gain plan: energy in versus energy out.",
    content: `A calorie is simply a unit of energy. Your body needs energy to breathe, think, digest food, and move -- and every food you eat supplies some amount of it. Energy balance is the relationship between how many calories you consume and how many you burn.

When you consistently eat more calories than you burn, the surplus gets stored, mostly as body fat, and you gain weight over time. When you consistently eat fewer calories than you burn, your body draws on stored energy to make up the difference, and you lose weight. Eat roughly the same as you burn, and your weight stays stable. This is the whole mechanism behind every diet approach that actually works -- low-carb, intermittent fasting, and everything else are really just different strategies for controlling how many calories you end up eating.

Total calories burned (often called TDEE, or Total Daily Energy Expenditure) comes from four things: your basal metabolic rate (energy needed just to stay alive, which is the majority of most people's total burn), the energy cost of digesting food, non-exercise movement like walking and fidgeting, and deliberate exercise.

A practical takeaway: hitting a calorie target consistently matters far more than which specific foods you eat to get there, at least for weight change itself. What you eat still matters enormously for health, satiety, muscle retention, and how sustainable the whole thing feels -- but the number on the scale is governed by the energy balance equation first.`,
  },
  {
    slug: "macronutrients-explained",
    title: "Macronutrients Explained: Protein, Carbs, and Fat",
    category: "NUTRITION_BASICS",
    summary: "What each macronutrient actually does in the body, and roughly how much you need.",
    content: `Protein, carbohydrate, and fat are called macronutrients because your body needs relatively large amounts of them, unlike vitamins and minerals (micronutrients), which are needed in much smaller quantities.

Protein is built from amino acids and is the primary material your body uses to build and repair muscle, skin, hair, enzymes, and hormones. It provides 4 calories per gram. Most active adults do well somewhere in the range of 1.6-2.2g per kilogram of bodyweight per day, with higher intakes generally more useful when the goal is building muscle or preserving it during a calorie deficit.

Carbohydrates are your body's preferred, fastest-access fuel source, particularly for the brain and for high-intensity exercise. They also provide 4 calories per gram. Despite their reputation in some diet trends, carbohydrates aren't inherently fattening -- total calories still govern weight change. Whole-food carb sources (oats, rice, potatoes, fruit, legumes) also bring fibre and micronutrients that heavily refined carbs don't.

Fat provides 9 calories per gram, making it the most calorie-dense macronutrient. It's essential for hormone production (including testosterone and estrogen), absorbing fat-soluble vitamins (A, D, E, K), and long-term energy storage. A reasonable floor is around 0.5-1g per kilogram of bodyweight per day -- going much lower than this for extended periods can affect hormone health.

There's no single "correct" macro split that applies to everyone -- the right balance depends on your goals, training style, and what you can actually stick to consistently.`,
  },
  {
    slug: "why-fibre-matters",
    title: "Why Fibre Matters",
    category: "NUTRITION_BASICS",
    summary: "The macronutrient that isn't fully digested, and why that's exactly the point.",
    content: `Fibre is a type of carbohydrate your body can't fully break down. Instead of being absorbed for energy, it passes largely intact through the digestive system -- and that's precisely what makes it useful.

Soluble fibre (found in oats, beans, and fruit) dissolves in water to form a gel-like substance that can help slow digestion, moderate blood sugar spikes after meals, and support healthy cholesterol levels. Insoluble fibre (found in whole grains, nuts, and vegetable skins) adds bulk to stool and supports regular digestion.

Fibre also feeds the bacteria living in your gut, which is increasingly understood to matter for immune function and overall health, not just digestion. And because high-fibre foods tend to be bulky and slow to digest, they support feeling fuller for longer on fewer calories -- genuinely useful if fat loss is a goal.

Most adults fall well short of typical fibre recommendations (commonly cited around 25-30g per day). Practical ways to close the gap: choosing whole grains over refined ones, keeping the skin on fruit and vegetables where practical, and including legumes (beans, lentils, chickpeas) regularly. If you're not used to much fibre, increasing intake gradually rather than all at once helps avoid digestive discomfort.`,
  },
  {
    slug: "hydration-how-much-water",
    title: "Hydration: How Much Water Do You Actually Need?",
    category: "NUTRITION_BASICS",
    summary:
      "The real answer is less rigid than 'eight glasses a day' -- here's what actually determines it.",
    content: `The common "8 glasses a day" guideline is a reasonable rough starting point, but your actual water needs depend heavily on body size, activity level, climate, and diet -- there's no single number that's right for everyone.

Water plays a role in nearly every bodily process: regulating temperature, transporting nutrients, lubricating joints, and supporting kidney function. Even mild dehydration (as little as 1-2% of body weight in fluid loss) has been linked to reduced concentration, mood, and physical performance.

A practical way to gauge hydration without obsessing over exact volumes: pale yellow urine generally indicates adequate hydration, while dark yellow suggests you could use more fluid. Thirst itself is also a reasonably reliable signal for most people, contrary to the idea that you need to drink before feeling thirsty.

Food contributes meaningfully too -- fruits and vegetables in particular are often 80-95% water by weight, so a diet rich in them contributes real hydration alongside plain drinking water. Exercise, heat, and altitude all increase fluid needs, sometimes substantially, so it's worth drinking more deliberately around longer or harder training sessions rather than relying on thirst alone in those situations.`,
  },

  // --- Supplements ---
  {
    slug: "creatine-benefits-dosing",
    title: "Creatine: Benefits, Dosing, and What to Expect",
    category: "SUPPLEMENTS",
    summary:
      "One of the most studied supplements available, and one of the few with genuinely strong evidence behind it.",
    relatedSupplementName: "Creatine Monohydrate",
    content: `Creatine is a compound your body already produces naturally and stores mostly in muscle, where it helps regenerate ATP -- the immediate energy source muscles use for short, high-intensity effort like a heavy lift or a sprint. Supplementing increases your muscle's creatine stores beyond what diet alone typically achieves.

What it does: with fuller creatine stores, muscles can produce slightly more force over short, repeated high-intensity efforts. Over weeks of consistent training, this can translate into being able to complete a few more reps or a bit more total training volume than you otherwise would -- and more training volume, sustained over time, is a meaningful driver of strength and muscle growth. Creatine also draws a small amount of water into muscle cells, which is why people often notice a bit of extra scale weight (not fat) in the first couple of weeks.

How and when to take it: the standard, well-supported approach is 3-5g of creatine monohydrate per day, taken consistently -- timing relative to your workout doesn't appear to matter much based on the evidence, so pick whatever's easiest to remember. Some people choose to "load" with a higher dose (around 20g/day split across the day) for the first 5-7 days to saturate muscle stores faster, then drop to the standard daily dose -- this isn't necessary, just faster.

Expected results: benefits build up gradually over 2-4 weeks of consistent use as muscle creatine stores fill up, rather than from a single dose. It's one of the few supplements with decades of research behind both its effectiveness and its safety profile in healthy adults at standard doses.`,
  },
  {
    slug: "whey-protein-why-popular",
    title: "Whey Protein: Why It's So Popular",
    category: "SUPPLEMENTS",
    summary: "Not magic -- just a convenient, fast-digesting, complete protein source.",
    relatedSupplementName: "Whey Protein Isolate",
    content: `Whey is a protein derived from milk during cheese production. Its popularity comes down to three practical things: it's a "complete" protein (containing all nine essential amino acids your body can't produce itself), it digests quickly, and it's genuinely convenient -- a scoop in water or milk is far faster than cooking a meal.

What it does: like any quality protein source, whey supplies the amino acids your body needs to repair and build muscle tissue after training, and to support general daily protein needs. It doesn't build muscle by itself -- that still requires a training stimulus (typically resistance training) and being in a calorie state that supports muscle growth or retention. Whey is simply one convenient way to hit your daily protein target, not fundamentally different from chicken, eggs, or fish in terms of what it contributes.

How and when to take it: there's no strict requirement to consume it immediately after training -- total daily protein intake matters far more than precise timing for most people. That said, having a source on hand for right after a workout, or whenever a meal isn't practical, is exactly the convenience whey is good for.

Isolate versus concentrate: isolate is more filtered, so it's slightly higher in protein per scoop and lower in lactose, fat and carbs -- useful for anyone lactose-sensitive. Concentrate retains a little more of milk's natural fat and lactose and is usually cheaper for a similar protein amount. Neither is objectively "better" -- it comes down to budget, digestion, and preference.`,
  },
  {
    slug: "do-you-need-a-multivitamin",
    title: "Do You Need a Multivitamin?",
    category: "SUPPLEMENTS",
    summary: "A reasonable insurance policy for some people -- not a replacement for eating well.",
    relatedSupplementName: "Multivitamin",
    content: `A multivitamin is designed to cover a broad range of vitamins and minerals at modest doses, intended to fill small gaps rather than meet your entire nutritional needs on its own.

What it does: for someone eating a genuinely varied diet with plenty of fruit, vegetables, whole grains, and protein sources, a multivitamin likely adds little on top -- most micronutrient needs are already being met through food. Where it tends to be more useful is for people with restrictive diets (very low-calorie diets, certain eliminations, or picky eating patterns), older adults with reduced nutrient absorption, or anyone whose diet genuinely lacks variety for whatever reason.

What it doesn't do: a multivitamin can't compensate for a poor overall diet, isn't a source of meaningful energy or protein, and won't replace the benefits of whole foods, which bring fibre, phytonutrients, and other compounds that a pill simply doesn't contain.

How to think about it: it's reasonable to view a multivitamin as a low-cost nutritional safety net rather than something with dramatic, noticeable effects -- most people supplementing one won't feel a specific difference, because it's addressing gaps that may or may not exist for that individual in the first place. If you suspect a specific deficiency (very tired, particular symptoms), a blood test to check specific markers like iron or vitamin D is more informative than a generic multivitamin.`,
  },
  {
    slug: "omega-3-fish-oil-research",
    title: "Omega-3 and Fish Oil: What the Research Shows",
    category: "SUPPLEMENTS",
    summary: "EPA and DHA are the two fatty acids that matter most -- here's what they're linked to.",
    relatedSupplementName: "Fish Oil (Omega-3)",
    content: `Omega-3s are a family of polyunsaturated fats, and EPA and DHA -- found in fatty fish and fish oil supplements -- are the two forms most studied for health benefits. A third form, ALA, comes from plant sources like flaxseed and walnuts, but the body converts it to EPA/DHA only inefficiently.

What it's linked to: omega-3 intake is most consistently associated with cardiovascular health (supporting healthy triglyceride levels in particular), and there's meaningful evidence for roles in brain function and reducing inflammation. Some research also points to benefits for joint health and recovery from exercise-induced inflammation, though the evidence here is less conclusive than for heart health.

Who tends to benefit most from supplementing: people who eat oily fish (salmon, mackerel, sardines) less than twice a week are the clearest candidates, since that's the main dietary source. Vegans and vegetarians relying on ALA alone from plant sources may also want to consider an algae-oil supplement, which provides EPA/DHA directly without relying on the body's inefficient conversion process.

How to take it: fish oil is fat-soluble, so taking it with a meal that contains some fat improves absorption. Typical supplemental doses provide somewhere in the range of 500mg-1g of combined EPA/DHA per serving -- well above what most diets provide without deliberately eating fish or supplementing.`,
  },
  {
    slug: "vitamin-d-sunshine-vitamin",
    title: "Vitamin D: The Sunshine Vitamin",
    category: "SUPPLEMENTS",
    summary: "The one micronutrient most people genuinely can't get enough of from diet alone.",
    relatedSupplementName: "Vitamin D3",
    content: `Vitamin D is unusual among vitamins because your body can produce it itself -- when skin is exposed to UVB sunlight. Very few foods naturally contain meaningful amounts (fatty fish and egg yolks are among the best sources), which is why deficiency is genuinely common, particularly at higher latitudes, during winter months, or for anyone who spends most of their time indoors.

What it does: vitamin D is essential for calcium absorption and bone health, and also plays a role in immune function and muscle function. Low levels have been associated with increased risk of bone density issues over time and have been studied (with mixed but suggestive results) in relation to mood and immune resilience.

Who's most likely to benefit from supplementing: people living further from the equator, those with limited sun exposure, people with darker skin (which produces vitamin D less efficiently from a given amount of sunlight), and older adults. Many national health bodies specifically recommend supplementation during autumn and winter for populations at higher latitudes.

How to take it: vitamin D3 (cholecalciferol) is the form most efficiently used by the body, more so than D2. It's fat-soluble, so taking it with a meal containing some fat improves absorption. A blood test measuring 25-hydroxyvitamin D is the most reliable way to know your actual level and whether supplementation is genuinely needed, rather than guessing.`,
  },
  {
    slug: "probiotics-and-gut-health",
    title: "Probiotics and Gut Health",
    category: "SUPPLEMENTS",
    summary: "Live bacteria, taken deliberately -- what the evidence actually supports.",
    relatedSupplementName: "Probiotic",
    content: `Probiotics are live microorganisms, usually bacteria, taken with the intent of supporting a healthy balance of gut flora. Your digestive system naturally hosts trillions of bacteria that play a role in digestion, immune function, and increasingly-understood connections to mood and overall health.

What the evidence supports: probiotic research is more mixed and strain-specific than for something like creatine -- different bacterial strains have different, often narrow effects, and results don't always generalize across products. The clearest, most consistent evidence is for specific strains helping with certain digestive complaints (like antibiotic-associated diarrhoea) rather than a blanket "improves gut health" claim.

Who might consider one: people who've recently taken antibiotics (which can disrupt gut bacteria), anyone with diagnosed digestive conditions under a doctor's guidance, or people wanting to experiment with gut health support alongside a fibre-rich diet, which feeds beneficial bacteria naturally.

How to think about it: response to probiotics varies significantly between individuals, and effects are generally most noticeable with weeks of consistent daily use rather than immediately. A diet rich in fibre and fermented foods (yoghurt, kefir, sauerkraut) provides both probiotics and the fibre that feeds them, and is a reasonable foundation regardless of whether you also choose to supplement.`,
  },

  // --- Training ---
  {
    slug: "progressive-overload-foundation",
    title: "Progressive Overload: The Foundation of Getting Stronger",
    category: "TRAINING",
    summary: "The single training principle underneath virtually every strength and muscle-building program.",
    content: `Progressive overload is the gradual increase of stress placed on the body during training. In practice, this usually means lifting a bit more weight, doing a few more reps, or adding an extra set over time, rather than repeating the exact same workout indefinitely.

Why it matters: your body adapts to the specific demands placed on it. If you lift the same weight for the same reps every single session, your muscles have no reason to keep adapting once they've adjusted to that stimulus -- progress stalls. Progressively increasing the challenge is what keeps giving your body a reason to get stronger or build more muscle.

How to apply it practically: you don't need to increase every single session -- that's neither necessary nor realistic. Common approaches include adding a small amount of weight every week or two once a lift starts to feel manageable, adding one extra rep per set before increasing weight, or adding an additional set to an exercise over the course of several weeks. Tracking your workouts (weights, reps, sets) makes it far easier to actually notice when you're ready to push a bit further, rather than guessing.

A common mistake: trying to progress too many things at once (weight, reps, and frequency simultaneously) tends to lead to poor form or burnout. Picking one dimension to progress at a time, while keeping the others stable, tends to work better and is easier to sustain.`,
  },
  {
    slug: "protein-timing-does-it-matter",
    title: "Protein Timing: Does It Really Matter?",
    category: "TRAINING",
    summary: "The 'anabolic window' myth, and what actually matters more.",
    content: `For years, a popular idea held that you had a narrow 30-60 minute "anabolic window" right after training in which to consume protein, or you'd miss out on most of the muscle-building benefit. More recent research has significantly softened this claim.

What the evidence actually shows: total daily protein intake is a far stronger predictor of muscle growth than the precise timing of any individual protein serving. The body's process of using amino acids to repair and build muscle tissue continues for many hours after a workout, not just in a narrow window immediately after. Having a meal within a few hours before or after training (rather than the exact minute after finishing) appears to be perfectly adequate for the vast majority of people.

When timing does matter a bit more: if you train fasted, or if a long gap separates your last meal from your workout and your next one, getting some protein in reasonably soon afterward is more sensible -- not because of a narrow biological window, but simply because you've gone a longer stretch without any.

Practical takeaway: focus first on hitting a consistent total daily protein target that fits your goals. Once that's solid and consistent, worrying about precise timing down to the minute offers little additional benefit for most people -- that effort is better spent on training consistency and overall diet quality.`,
  },

  // --- Recovery ---
  {
    slug: "sleep-as-a-performance-tool",
    title: "Why Sleep Is a Performance Tool",
    category: "RECOVERY",
    summary: "Often the single most under-rated variable in both training results and general health.",
    content: `Sleep is when a large amount of the body's physical repair and recovery happens -- muscle protein synthesis, hormone regulation (including growth hormone and testosterone), and memory consolidation all rely heavily on adequate, quality sleep.

What poor sleep affects: research consistently links insufficient sleep to reduced strength and endurance performance, slower recovery between training sessions, increased perceived exertion during exercise (workouts feel harder than they should), impaired appetite regulation (often increasing hunger and cravings), and reduced ability to build or retain muscle even when training and diet are otherwise well-managed.

How much is "enough": most adults need somewhere between 7-9 hours per night, though individual variation exists. Consistency of sleep timing (going to bed and waking at similar times) also appears to matter for sleep quality, not just total duration.

Practical steps that reliably help: keeping a consistent sleep and wake schedule, even on weekends; limiting caffeine in the 6-8 hours before bed, since it has a longer half-life than many people realize; getting natural light exposure during the day, which helps regulate your body's internal clock; and keeping the bedroom cool, dark, and used primarily for sleep. None of these are complicated, but consistency with the basics tends to matter more than any single "hack."`,
  },
  {
    slug: "recovery-basics-rest-days-doms",
    title: "Recovery Basics: Rest Days, DOMS, and Overtraining",
    category: "RECOVERY",
    summary: "Understanding muscle soreness, why rest days matter, and the warning signs of doing too much.",
    content: `Delayed Onset Muscle Soreness (DOMS) is the stiffness and tenderness that shows up 24-72 hours after unfamiliar or unusually intense exercise. It's caused by microscopic damage to muscle fibres, which is a normal and expected part of the adaptation process -- the muscle repairs itself slightly stronger than before, which is the whole basis of how training works.

Rest days serve a genuine purpose: they give muscles, connective tissue, and the nervous system time to recover and adapt to the training stress you've placed on them. Training the same muscle groups intensely with no recovery time between sessions can actually reduce progress rather than accelerate it, since the body needs time to complete the repair-and-adapt process.

Signs you might be overtraining: persistent fatigue that doesn't improve with a normal night's sleep, declining performance despite consistent effort, elevated resting heart rate, frequent illness or injury, irritability, and disrupted sleep. These are different from normal, expected tiredness after a hard session -- overtraining is a pattern that builds up over weeks, not a single tough workout.

Practical guidance: DOMS itself isn't a sign you need to do more or less -- it's simply part of adapting to new or increased training stress and typically eases as your body adjusts to a given routine. Structuring training so that any given muscle group gets at least 48 hours before being worked intensely again is a reasonable general guideline, and building in at least one genuinely lower-intensity day or full rest day per week supports longer-term consistency far more than pushing hard every single day.`,
  },
];
