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

  // --- More supplements ---
  {
    slug: "magnesium-the-relaxation-mineral",
    title: "Magnesium: The Relaxation Mineral",
    category: "SUPPLEMENTS",
    summary: "Involved in over 300 processes in the body, and easy to fall short on.",
    relatedSupplementName: "Magnesium Glycinate",
    content: `Magnesium is involved in muscle and nerve function, blood sugar regulation, blood pressure, and making protein, bone, and DNA. Despite being needed for so much, many people don't get quite enough from diet alone, particularly if vegetables and whole grains -- the main dietary sources -- make up a small part of their meals.

What it's linked to: adequate magnesium is associated with better muscle function and recovery, more stable blood sugar, and improved sleep quality for some people. Low levels have been linked to muscle cramps and fatigue, though these symptoms have many possible causes.

Which form matters: magnesium oxide (the cheapest, most common form in generic supplements) is poorly absorbed and often causes digestive upset. Glycinate and citrate forms are absorbed considerably better and are gentler on the stomach.

How to take it: often taken in the evening, since it's commonly associated with promoting relaxation, though it works regardless of time of day. Pairing with food can help reduce any mild digestive effects.`,
  },
  {
    slug: "zinc-small-amounts-big-role",
    title: "Zinc: Small Amounts, Big Role",
    category: "SUPPLEMENTS",
    summary: "A trace mineral with an outsized role in immunity and hormone health.",
    relatedSupplementName: "Zinc",
    content: `Zinc is needed in only small amounts, but it's involved in immune function, wound healing, DNA synthesis, and testosterone production. Red meat, shellfish, and legumes are the main dietary sources.

Who's more likely to fall short: vegetarians and vegans (plant sources are less bioavailable), older adults, and anyone with a diet low in meat or shellfish. Athletes with high sweat rates may also lose more zinc than average.

What it does: adequate zinc supports normal immune response and is a genuine building block for testosterone production -- though supplementing beyond what the body needs does not raise testosterone further in someone who isn't deficient.

How to take it: best taken with food, since it can cause nausea on an empty stomach. Very high doses over long periods can interfere with copper absorption, so sticking to standard label doses rather than mega-dosing is sensible.`,
  },
  {
    slug: "iron-why-deficiency-is-common",
    title: "Iron: Why Deficiency Is So Common",
    category: "SUPPLEMENTS",
    summary: "The most common nutrient deficiency worldwide, and who's most at risk.",
    relatedSupplementName: "Iron",
    content: `Iron is essential for haemoglobin, the protein in red blood cells that carries oxygen around the body. Without enough, oxygen delivery to muscles and organs suffers, leading to fatigue, poor concentration, and reduced exercise capacity.

Who's most at risk: menstruating women (regular blood loss increases iron needs substantially), vegans and vegetarians (plant-based "non-haem" iron is absorbed far less efficiently than the haem iron in meat), endurance athletes (foot-strike impact and increased red blood cell turnover both increase losses), and pregnant women.

Getting a blood test first matters here more than with most supplements: iron overload is a genuine risk for people who don't actually need it, since the body has no efficient way to excrete excess iron. Supplementing without a confirmed deficiency isn't a "just in case" safe bet the way something like vitamin C generally is.

How to take it: taking iron with vitamin C-rich food improves absorption, while tea, coffee, and calcium-rich foods taken at the same time can meaningfully reduce it.`,
  },
  {
    slug: "collagen-what-it-can-and-cant-do",
    title: "Collagen: What It Can (and Can't) Do",
    category: "SUPPLEMENTS",
    summary: "The most abundant protein in the body -- but an incomplete one nutritionally.",
    relatedSupplementName: "Collagen Peptides",
    content: `Collagen is the main structural protein in skin, tendons, ligaments, and joints. Supplemental collagen (usually hydrolysed into smaller peptides for easier absorption) is popular for skin and joint health specifically.

What the evidence suggests: several studies point to modest improvements in skin elasticity and hydration with consistent use over 8-12 weeks, and some evidence supports a role in joint comfort, particularly for people with joint-related exercise activity. Evidence quality varies across these areas, and effects tend to be modest rather than dramatic.

An important nutritional distinction: collagen is missing or very low in some essential amino acids (notably tryptophan), making it an "incomplete" protein. It's a reasonable addition alongside your main protein sources, not a substitute for whey, meat, eggs, or other complete proteins when the goal is muscle building or general protein targets.

How to take it: typically taken as a flavourless powder mixed into coffee, smoothies, or other drinks, since consistency over weeks matters more than any specific timing.`,
  },
  {
    slug: "electrolytes-beyond-just-water",
    title: "Electrolytes: Beyond Just Water",
    category: "SUPPLEMENTS",
    summary: "Why plain water alone sometimes isn't enough during longer or harder sessions.",
    relatedSupplementName: "Electrolyte Mix",
    content: `Electrolytes -- mainly sodium, potassium, and magnesium -- are minerals lost through sweat that are essential for muscle contraction, nerve signalling, and fluid balance. During short or moderate exercise, food and normal drinking water usually replace what's lost without any special attention needed.

When they matter more: sessions lasting longer than about 60-90 minutes, particularly in heat, or anyone who sweats heavily and notices salt residue on skin or clothing after training. In these situations, water alone can actually dilute remaining sodium levels rather than fully solving the problem.

What they do: adequate electrolyte balance supports normal muscle function (low sodium and magnesium are both linked to cramping in some people) and helps the body actually retain the fluid you drink, rather than losing it straight back out.

How to use them: for most everyday training, plain water and normal meals are enough -- electrolyte drinks or tablets are most useful specifically around longer, hotter, or sweatier sessions rather than as a constant daily habit.`,
  },
  {
    slug: "b-vitamins-and-energy-metabolism",
    title: "B Vitamins and Energy Metabolism",
    category: "SUPPLEMENTS",
    summary: "A group of eight vitamins that help turn the food you eat into usable energy.",
    relatedSupplementName: "B-Complex",
    content: `The B vitamins (B1, B2, B3, B5, B6, B9/folate, and B12) each play distinct roles, but collectively they're central to converting carbohydrates, fat, and protein into energy your cells can actually use.

What deficiency looks like: fatigue is a common early sign across several B vitamins, which is part of why B-complex supplements are often marketed around "energy" -- though for someone who isn't actually deficient, supplementing won't provide extra energy beyond normal levels.

The one worth knowing about specifically: B12 is found almost exclusively in animal products, making it the B vitamin vegans and vegetarians are most commonly advised to supplement or get from fortified foods, since deficiency can take years to show symptoms but cause lasting nerve damage if left unaddressed.

How to take it: B vitamins are water-soluble, meaning excess is simply excreted rather than stored, so there's little risk of overdoing it at standard supplemental doses -- unlike fat-soluble vitamins such as A, D, E, and K.`,
  },

  // --- General topics ---
  {
    slug: "meal-timing-and-intermittent-fasting",
    title: "Meal Timing and Intermittent Fasting",
    category: "NUTRITION_BASICS",
    summary: "What fasting approaches can and can't do, separate from the calories themselves.",
    content: `Intermittent fasting describes eating within a restricted daily window (commonly 8 hours) or fasting on alternate days, rather than any specific list of foods. Its popularity comes from being a simple rule to follow rather than tracking every meal.

What the evidence shows: for weight loss specifically, intermittent fasting appears to work about as well as any other approach that results in the same calorie deficit -- the fasting window itself doesn't appear to provide a special metabolic advantage beyond making it easier for some people to naturally eat less. Some people find a restricted window genuinely easier to stick to; others find it harder, particularly around training performance if workouts fall during the fasted period.

Who it may not suit well: people with a history of disordered eating, pregnant or breastfeeding women, and anyone whose training performance noticeably suffers when fasted (strength and high-intensity performance can be blunted without adequate fuel beforehand for some individuals).

The practical takeaway: fasting windows are a tool for calorie control and personal preference, not a requirement for fat loss or health -- if it doesn't fit your life or training, a more evenly spread eating pattern works just as well for the same total calorie and protein intake.`,
  },
  {
    slug: "alcohol-and-your-fitness-goals",
    title: "Alcohol and Your Fitness Goals",
    category: "NUTRITION_BASICS",
    summary: "What alcohol actually does to recovery, sleep, and body composition.",
    content: `Alcohol provides 7 calories per gram -- nearly as much as fat -- with no nutritional value, and mixers often add substantial sugar on top. Beyond the calories themselves, it affects several things relevant to training and body composition.

Sleep quality: alcohol can help you fall asleep faster but measurably reduces sleep quality, particularly REM sleep, later in the night -- which matters given how much recovery happens during sleep.

Muscle protein synthesis: research suggests alcohol can blunt the muscle-building response to a workout and to dietary protein, particularly at higher intakes, though moderate amounts appear to have a smaller effect than heavier drinking.

Recovery and decision-making: alcohol is also associated with poorer next-day training performance and a higher likelihood of missing planned workouts or making less considered food choices.

A practical way to think about it: occasional, moderate drinking is unlikely to meaningfully derail consistent training and nutrition -- it's the combination of frequency, quantity, and how it fits into an otherwise consistent routine that determines the real impact, not any single drink.`,
  },
  {
    slug: "added-sugar-what-it-actually-means",
    title: "Added Sugar: What It Actually Means",
    category: "NUTRITION_BASICS",
    summary: "The difference between naturally occurring sugar and the kind worth paying attention to.",
    content: `"Added sugar" refers to sugars and syrups added to food during processing or preparation -- distinct from sugars naturally present in whole foods like fruit (fructose) or milk (lactose), which come packaged with fibre, protein, or other nutrients.

Why the distinction matters: a can of soda and an apple might have similar total sugar content, but the apple's fibre slows sugar absorption and adds satiety, while the soda offers neither. Most health guidance around "reducing sugar" is specifically about added sugar, not fruit.

Where it hides: added sugar isn't limited to obviously sweet foods -- pasta sauces, granola, flavoured yoghurts, and salad dressings often contain meaningful amounts. Checking ingredient lists (sugar, syrup, and words ending in "-ose" like dextrose or maltose) reveals sources that aren't obvious from a product's name or category.

Practical guidance: added sugar isn't inherently "toxic" in moderate amounts within an otherwise balanced diet -- the issue is more that sugary foods are often calorie-dense and easy to overeat, displacing more nutritious options, rather sugar itself being uniquely harmful compared to other sources of excess calories.`,
  },
  {
    slug: "how-to-read-a-nutrition-label",
    title: "How to Read a Nutrition Label",
    category: "NUTRITION_BASICS",
    summary: "The handful of numbers actually worth checking, and the ones that mislead.",
    content: `Nutrition labels can be genuinely useful once you know which numbers matter for your goals, rather than trying to evaluate everything on the panel at once.

Serving size first: every other number on the label is based on the stated serving size, which is sometimes unrealistically small compared to how much people actually eat in one sitting. Always check this before comparing calories or macros between products.

For most goals, the numbers worth prioritising are: calories per serving (for overall energy balance), protein (useful to check against your daily target), and fibre (higher is generally better for fullness and digestion). Saturated fat and sodium are worth a glance if you're managing a specific health condition.

A number that misleads more than it helps: "per 100g" comparisons are useful for comparing similar products, but meaningless on their own for foods with very different typical serving sizes -- olive oil and lettuce both have a "per 100g" calorie figure, but nobody eats 100g of olive oil in one sitting.

Ingredient lists are ordered by weight, from most to least -- if sugar or a refined oil appears in the first few ingredients, it makes up a meaningful proportion of the product regardless of front-of-pack marketing claims.`,
  },
  {
    slug: "strength-training-vs-cardio",
    title: "Strength Training vs Cardio: Do You Need Both?",
    category: "TRAINING",
    summary: "What each type of training actually does, and how they complement rather than compete.",
    content: `Strength (resistance) training and cardiovascular exercise produce different, largely complementary adaptations rather than one being categorically "better" than the other.

What strength training does: builds and preserves muscle mass, increases bone density, and improves metabolic health -- muscle tissue is metabolically active, meaning more of it modestly raises how many calories you burn at rest. It's also the primary driver of the "toned" appearance many people associate with fat loss, since that look comes from a combination of muscle and low enough body fat to see it.

What cardio does: improves heart and lung capacity, supports cardiovascular health markers like resting heart rate and blood pressure, and burns calories efficiently during the session itself.

For fat loss specifically: both contribute to the calorie deficit that actually drives fat loss, but strength training has the added benefit of helping preserve muscle mass while in a deficit, which cardio alone doesn't do as effectively.

A reasonable default: most general health and body composition goals are well served by including both -- resistance training a few times a week as the priority, with cardio added based on preference, time, and specific goals like endurance performance.`,
  },
  {
    slug: "portion-control-without-counting-every-gram",
    title: "Portion Control Without Counting Every Gram",
    category: "NUTRITION_BASICS",
    summary: "Practical estimation tools for days you don't want to weigh everything.",
    content: `Precise tracking (weighing food, logging every gram) is genuinely useful for learning realistic portion sizes, but it's not the only way to manage intake, and isn't necessary forever or for every meal.

The hand-based method: a palm-sized portion of protein, a cupped-hand portion of carbohydrates, a thumb-sized portion of fats, and a fist-sized portion of vegetables is a well-known rough visual guide that scales naturally with hand size (which roughly correlates with body size) and needs no scale.

Plate-based methods: filling half the plate with vegetables, a quarter with protein, and a quarter with carbohydrates is another simple, visual approach that tends to naturally support a reasonable calorie and nutrient balance without any counting at all.

When precision matters more: if progress has stalled and you genuinely don't know why, a short period of accurate weighing and logging is the most reliable way to find out what's actually happening -- portion estimation is a maintenance tool more than a diagnostic one.

The two approaches aren't mutually exclusive: many people track precisely for a period to calibrate their eye, then shift to portion-based estimation day-to-day once they have a realistic sense of what their target intake actually looks like on a plate.`,
  },
  {
    slug: "stress-cortisol-and-body-composition",
    title: "Stress, Cortisol, and Body Composition",
    category: "RECOVERY",
    summary: "The real, more modest relationship behind the popular 'cortisol makes you fat' claim.",
    content: `Cortisol is a hormone released in response to physical and psychological stress, including intense exercise itself. It plays a genuine role in regulating blood sugar, metabolism, and the body's stress response -- it isn't inherently "bad," despite how it's often framed.

What chronic stress is actually linked to: persistently elevated stress is associated with poorer sleep, increased cravings for high-calorie foods in some people, and reduced motivation or consistency for training and meal preparation. These behavioural effects likely explain far more of any stress-weight connection than a direct hormonal mechanism.

What the evidence does NOT strongly support: the popular claim that cortisol from a hard workout or a stressful week directly and substantially drives fat storage is not well supported by the research -- the effect size, where it exists, is small compared to the impact of consistent calorie intake and activity levels.

Practical takeaway: managing stress is worthwhile for its own sake (sleep quality, mood, consistency with healthy habits) rather than because of a dramatic direct effect on fat storage. Reasonable approaches include regular movement, adequate sleep, and whatever stress-management techniques genuinely work for you personally.`,
  },
  {
    slug: "muscle-protein-synthesis-explained",
    title: "Muscle Protein Synthesis Explained",
    category: "TRAINING",
    summary: "The actual biological process underneath 'eat protein to build muscle.'",
    content: `Muscle protein synthesis (MPS) is the process by which your body builds new muscle protein, using amino acids from the protein you eat as building blocks. Muscle tissue is constantly being broken down and rebuilt -- growth happens when synthesis outpaces breakdown over time.

What triggers it: resistance training is the strongest trigger for an elevated MPS response, which stays raised for roughly 24-48 hours after a workout in trained individuals. Eating protein, particularly sources rich in the amino acid leucine (found in meat, dairy, and eggs), independently triggers MPS as well.

Why total daily protein matters more than any single meal: since the elevated MPS window from training lasts a day or two, and protein-triggered MPS happens with every adequate protein-containing meal, what matters most is consistently hitting your daily protein target across enough meals -- not perfectly timing one "magic" post-workout meal.

A practical implication: spreading protein across 3-4 meals of 25-40g each throughout the day, rather than one very large serving, appears to support MPS slightly more efficiently, since there's a point of diminishing returns for how much protein a single meal can meaningfully use for this specific process.`,
  },
  {
    slug: "neat-calories-you-burn-without-trying",
    title: "NEAT: The Calories You Burn Without Trying",
    category: "TRAINING",
    summary: "Non-Exercise Activity Thermogenesis -- an underrated lever in weight management.",
    content: `NEAT (Non-Exercise Activity Thermogenesis) is the energy burned through everyday movement that isn't deliberate exercise -- walking, standing, fidgeting, taking the stairs, even the physical demands of some jobs.

Why it matters more than most people realise: for many people, NEAT accounts for a larger share of total daily calorie burn than structured exercise sessions do, and it varies enormously between individuals -- some naturally move far more throughout the day than others, even at similar body sizes and activity levels.

The dieting connection: NEAT tends to drop, often without someone noticing, when in a sustained calorie deficit -- the body subtly reduces spontaneous movement as an energy-conservation response, which can partly explain why weight loss sometimes slows over time even with consistent tracking.

Practical ways to support it: taking regular short walks, using stairs where practical, standing periodically during long sitting stretches, and simply staying aware that daily movement outside the gym genuinely adds up. Some fitness trackers' step counts are a reasonable proxy for tracking this if you want a number to watch.`,
  },
  {
    slug: "why-bmi-isnt-the-whole-picture",
    title: "Why BMI Isn't the Whole Picture",
    category: "NUTRITION_BASICS",
    summary: "A useful population-level screening tool, with real individual limitations.",
    content: `Body Mass Index (BMI) is calculated from height and weight alone, and was originally developed as a population-level statistical tool, not a precise measure of individual health.

What it does reasonably well: at a population level, BMI correlates fairly well with body fat percentage and health risk on average, which is why it remains widely used for public health screening and research.

Where it breaks down for individuals: BMI can't distinguish between muscle and fat mass, meaning a muscular, lean athlete can show as "overweight" or even "obese" despite having low body fat, while someone with low muscle mass and high body fat can show as "normal weight" despite carrying more health risk than the number suggests. It also doesn't account for where fat is distributed, which matters for health risk independent of total amount.

A more complete picture: waist circumference, body fat percentage (from methods like skinfold callipers, bioelectrical impedance, or DEXA scans), and simply how your clothes fit and how you feel and perform, all provide useful context that BMI alone can't.

Practical takeaway: BMI is a reasonable quick screening number for the general population, but not something to take as a precise verdict on your own individual health or progress, particularly if you train regularly.`,
  },

  // --- Round 2: more topics ---
  {
    slug: "caffeine-performance-benefits-and-limits",
    title: "Caffeine: Performance Benefits and Limits",
    category: "TRAINING",
    summary: "One of the most reliable, well-studied performance aids -- and one you likely already use.",
    content: `Caffeine is a stimulant that blocks adenosine, a chemical that builds up in the brain and contributes to feelings of tiredness. Beyond the alertness effect, it has genuine, well-documented performance benefits for exercise.

What it does: research consistently shows caffeine can improve endurance performance, reduce perceived effort during exercise (workouts feel a bit easier at the same intensity), and modestly improve strength and power output. Effects are generally most reliable at doses of roughly 3-6mg per kilogram of bodyweight, taken 45-60 minutes before training.

Diminishing returns with regular use: the body adapts to regular caffeine intake, reducing its stimulant and performance effects over time. Some people cycle their intake or reserve higher doses for important sessions specifically to preserve sensitivity.

Practical limits: doses much above the effective range don't provide additional performance benefit and increase the likelihood of side effects like jitteriness, anxiety, or digestive upset. Caffeine also has a fairly long half-life (roughly 5-6 hours on average), so afternoon or evening intake can measurably disrupt that night's sleep even if you don't feel obviously wired.`,
  },
  {
    slug: "pre-workout-nutrition",
    title: "Pre-Workout Nutrition: What to Eat Before Training",
    category: "TRAINING",
    summary: "What actually helps performance versus what's just habit or marketing.",
    content: `What you eat before training affects how much energy is available and how you feel during the session, though the effect size varies depending on training type, duration, and individual tolerance.

General guidance: a meal with carbohydrates and moderate protein, eaten 2-3 hours before training, is a reasonable default for most people doing resistance training or moderate cardio. Carbohydrates top up muscle glycogen stores (the body's stored fuel for exercise), which matters more for longer or higher-intensity sessions than very short ones.

If time is tight: something smaller and easily digested (a banana, a small amount of toast, a sports drink) 30-60 minutes before training can still help, particularly for avoiding the sluggishness some people feel training on an empty stomach. Very high-fat or high-fibre meals close to training can cause digestive discomfort for some people, so lighter, more easily digested options tend to work better the closer you are to a session.

Training fasted: some people train fasted deliberately (first thing in the morning, or as part of an intermittent fasting approach) without noticeable performance issues, particularly for lower-intensity or shorter sessions -- individual tolerance varies considerably here, and it's worth experimenting to see what works for you rather than assuming one approach is universally correct.`,
  },
  {
    slug: "post-workout-nutrition",
    title: "Post-Workout Nutrition: What Actually Matters",
    category: "TRAINING",
    summary: "Simpler than the supplement industry often makes it sound.",
    content: `The core things that matter after training are refuelling (replacing used glycogen with carbohydrates) and providing amino acids for muscle repair (protein) -- everything else is largely secondary refinement.

On timing: as covered in more depth in the dedicated article on protein timing, the old idea of a narrow "anabolic window" that must be hit within minutes has been significantly overstated by the fitness industry -- a meal within a few hours of training, containing adequate protein and carbohydrate, covers the great majority of the benefit for most people.

What's actually worth prioritising: getting a genuine meal in within a reasonable window (rather than skipping eating for hours after training), containing both protein (to support muscle repair) and carbohydrate (to support glycogen replenishment, particularly important if training again within 24 hours).

What's not necessary for most people: specific "recovery" supplement stacks, precisely timed shakes consumed within a specific number of minutes, or complex combinations of ingredients -- a normal meal with adequate protein and carbohydrate achieves the same outcome for the vast majority of training goals.`,
  },
  {
    slug: "vegetarian-and-vegan-protein-sources",
    title: "Vegetarian and Vegan Protein Sources",
    category: "NUTRITION_BASICS",
    summary: "Hitting protein targets without meat, fish, or any animal products at all.",
    content: `Getting adequate protein on a vegetarian or vegan diet is entirely achievable, though it typically requires a bit more deliberate planning than an omnivorous diet, since plant proteins are generally less protein-dense per calorie and often "incomplete" (missing or low in one or more essential amino acids) on their own.

Strong vegetarian sources: eggs and dairy (Greek yoghurt, cottage cheese, milk) are complete proteins and among the most protein-dense options available to anyone eating them.

Strong vegan sources: tofu, tempeh, edamame, and other soy products are complete proteins and among the most efficient plant-based options. Legumes (lentils, chickpeas, black beans) and grains (quinoa, oats) are excellent but often benefit from being combined across a day's meals, since many are individually lower in one or two specific amino acids -- eating a reasonable variety across the day naturally covers this without needing to carefully pair specific foods at every single meal.

Making up the gap practically: plant-based protein powders (pea, rice, or blends) are a convenient way to add meaningful protein without needing a large volume of whole food, particularly useful for anyone finding it hard to hit higher protein targets through whole foods alone.`,
  },
  {
    slug: "metabolic-adaptation-and-plateaus",
    title: "Metabolic Adaptation: Why Weight Loss Plateaus",
    category: "NUTRITION_BASICS",
    summary: "Why the same calorie deficit that worked at first can eventually stop working.",
    content: `Metabolic adaptation refers to the body's tendency to reduce energy expenditure in response to sustained calorie restriction -- a genuine, well-documented phenomenon that explains why weight loss commonly slows over time, even with consistent adherence.

What drives it: as body weight decreases, the body simply needs fewer calories to maintain itself (a smaller body burns less energy at rest). On top of this baseline effect, the body also makes some active adaptations -- subtly reducing NEAT (spontaneous daily movement), and sometimes reducing resting metabolic rate slightly beyond what weight loss alone would predict.

Why this isn't cause for alarm: this is a normal, expected physiological response, not a sign that something has gone wrong or that your metabolism is "broken." It simply means that a calorie target that worked at the start of a diet may need periodic recalculation as body weight decreases and adaptation occurs.

Practical implications: expecting weight loss to slow over time (rather than continue at a constant linear rate) helps avoid unnecessary frustration, and periodically reassessing calorie targets as weight changes is a normal part of managing a longer fat-loss phase rather than a sign of failure.`,
  },
  {
    slug: "diet-breaks-and-refeed-days",
    title: "Diet Breaks and Refeed Days",
    category: "NUTRITION_BASICS",
    summary: "Deliberately planned pauses in a calorie deficit, and what they're actually for.",
    content: `A diet break is a planned period (commonly 1-2 weeks) of eating at maintenance calories during a longer fat-loss phase, while a refeed day is a shorter, single-day increase in calories (usually from carbohydrates specifically) within an otherwise consistent deficit.

What they're for: extended calorie deficits can be mentally and physically demanding, and both approaches are tools to support longer-term adherence -- giving a physical and psychological break from restriction, which can make a longer diet more sustainable overall. There's also some evidence diet breaks may help temper the metabolic adaptations covered in the plateau article, though this effect is more modest than sometimes claimed.

What they're not: neither is a "free pass" to eat without any limit, and neither directly "boosts metabolism" in a dramatic way some marketing suggests -- the primary benefit is adherence and psychological sustainability, not a metabolic hack.

When they make sense: most useful for longer fat-loss phases (many weeks to months) where diet fatigue becomes a genuine risk to sticking with the plan, rather than something needed for every single week of a shorter or more moderate deficit.`,
  },
  {
    slug: "training-to-failure",
    title: "Training to Failure: Is It Necessary?",
    category: "TRAINING",
    summary: "The point where you genuinely can't complete another rep -- and whether you need to reach it.",
    content: `Training to failure means performing reps until you physically cannot complete another one with good form. It's a genuine training tool, but not a requirement for every set of every workout.

What the evidence suggests: training close to failure (within 1-3 reps of it) appears to be sufficient to drive muscle growth for most people, without needing to reach absolute failure on every set. Training to true failure adds significant fatigue and recovery cost without a proportional additional benefit for most training goals.

When failure training has a place: occasionally, on isolation exercises specifically, or near the end of a workout when the extra fatigue matters less for subsequent performance, some lifters do use failure sets deliberately as part of a periodised plan.

Practical guidance: leaving 1-3 reps "in the tank" (a rep or two before true failure) on most working sets is a reasonable, sustainable default that still drives progress, reserving true failure training for occasional, deliberate use rather than as a default approach to every set.`,
  },
  {
    slug: "rep-ranges-explained",
    title: "Rep Ranges Explained",
    category: "TRAINING",
    summary: "Why 'low reps for strength, high reps for size' is more of a rough guide than a strict rule.",
    content: `Rep ranges are often categorised as low (1-5, associated with strength), moderate (6-12, associated with muscle growth), and high (15+, associated with muscular endurance) -- a useful rough framework, though the real picture is less rigid than these categories suggest.

What the more recent research shows: muscle growth can occur across a wide range of rep counts (roughly 5-30 reps per set), provided sets are taken reasonably close to failure. Very low reps do have a genuine strength-specific advantage though, since they allow practising with heavier loads and refining the specific motor skill of lifting near-maximal weight.

Why the categories still have practical value: very high rep sets (20+) tend to be more uncomfortable and fatiguing per set of actual muscle growth achieved compared to moderate rep ranges, and very low reps (1-3) carry more technical demand and joint stress per session -- so while growth is possible across a wide range, moderate rep ranges (6-15) remain a practical, comfortable default for most people, most of the time.

Practical guidance: varying rep ranges across a training block, or between different exercises in the same session, is a reasonable way to get some benefit of each approach rather than rigidly committing to just one range for every single exercise.`,
  },
  {
    slug: "importance-of-a-proper-warm-up",
    title: "The Importance of a Proper Warm-Up",
    category: "TRAINING",
    summary:
      "More than just injury prevention -- a warm-up genuinely affects the quality of your working sets.",
    content: `A warm-up gradually prepares the body for the demands of a training session, and its benefits extend well beyond the commonly cited "injury prevention" framing.

What it actually does: increases blood flow and temperature in the muscles you're about to use, improves the nervous system's ability to recruit muscle fibres effectively, and lets you rehearse the movement pattern with lighter loads before adding real weight -- all of which can directly improve the quality and safety of your heaviest working sets, not just reduce injury risk in a vague, general sense.

A practical structure: a few minutes of light general movement (a short walk, easy cycling, or similar) to raise overall body temperature, followed by progressively heavier warm-up sets of the specific exercise you're about to perform, working up toward your actual working weight rather than jumping straight to it.

How much is enough: warm-up needs scale with the load and complexity of what follows -- a heavy squat or deadlift session warrants more warm-up sets than a light accessory exercise. There's no need to warm up every single exercise from scratch if you've already warmed up a similar movement pattern earlier in the same session.`,
  },
  {
    slug: "understanding-glycemic-index",
    title: "Understanding Glycemic Index",
    category: "NUTRITION_BASICS",
    summary: "What it measures, and why it matters less for total health than its reputation suggests.",
    content: `The Glycemic Index (GI) ranks carbohydrate-containing foods by how quickly they raise blood sugar compared to a reference food (usually pure glucose), on a scale from 0-100. High-GI foods cause a faster, sharper blood sugar rise; low-GI foods raise it more gradually.

What affects GI: how processed or refined a food is, its fibre content, ripeness (for fruit), and even how it's cooked and cooled (cooked-then-cooled potatoes and rice have measurably lower GI than freshly cooked, due to changes in starch structure).

Where it genuinely matters: GI is most clinically relevant for people managing blood sugar conditions like diabetes, where blood sugar spikes have direct health implications, and can be a useful concept for choosing foods around training when steady energy is preferred over a quick spike and crash.

Where it matters less than commonly assumed: for general health and weight management in people without blood sugar conditions, GI alone is a fairly weak predictor -- portion size and overall dietary pattern matter considerably more, and a food's GI value doesn't account for real-world context, like eating it alongside protein or fat, which slows absorption and blunts the blood sugar response regardless of the food's GI in isolation.`,
  },
  {
    slug: "basics-of-meal-prep",
    title: "The Basics of Meal Prep",
    category: "NUTRITION_BASICS",
    summary: "A practical system for staying consistent without cooking from scratch every single day.",
    content: `Meal prep -- cooking food in advance for the days ahead -- is less about any specific recipe and more about removing decision fatigue and last-minute takeaway temptation during a busy week.

A simple starting structure: pick one or two protein sources, one or two carbohydrate sources, and two or three vegetables, cook them in bulk (a large tray-bake or batch of a simple dish works well), and portion into containers for the days ahead. Rotating the sauce or seasoning across the week keeps the same base ingredients from feeling repetitive.

Storage basics: most cooked meals keep safely in the refrigerator for 3-4 days; freezing extends this considerably for batches you don't plan to eat within that window. Cooling food before refrigerating, and reheating thoroughly, are both worth being deliberate about for food safety.

Making it sustainable: meal prep doesn't need to mean identical meals every day -- prepping components separately (a cooked protein, a cooked grain, and raw or lightly prepped vegetables) rather than fully-assembled meals gives more flexibility to mix and match through the week while still saving the bulk of the cooking time upfront.`,
  },
  {
    slug: "water-retention-why-the-scale-fluctuates",
    title: "Water Retention: Why the Scale Fluctuates",
    category: "NUTRITION_BASICS",
    summary:
      "Why your weight can swing by a kilogram or more day to day with no fat actually gained or lost.",
    content: `Day-to-day scale weight fluctuations are overwhelmingly driven by water balance, not actual fat gain or loss -- fat loss or gain happens far too slowly to explain a 1-2kg swing overnight.

Common causes of water retention: higher sodium intake (sodium causes the body to retain more water), higher carbohydrate intake (each gram of stored glycogen holds roughly 3g of water alongside it), the luteal phase of the menstrual cycle for many women, recent intense exercise (micro-damage to muscle triggers a temporary inflammatory water retention response), and simply how much food is currently in the digestive system.

Why this matters practically: weighing daily and reacting emotionally to a single day's number is a common source of unnecessary frustration during a diet -- a single high reading rarely reflects a real setback. Tracking a weekly (or rolling) average, rather than any single day's weight, gives a far more reliable picture of the actual underlying trend.

What's NOT normal water-related fluctuation: rapid, unexplained swelling (particularly in just one limb, or alongside shortness of breath or chest discomfort) is a different matter and worth medical attention rather than being written off as routine water retention.`,
  },
  {
    slug: "body-recomposition-muscle-and-fat",
    title: "Body Recomposition: Building Muscle and Losing Fat Together",
    category: "TRAINING",
    summary: "Possible for some people, under specific conditions -- not the universal default outcome.",
    content: `Body recomposition -- building muscle and losing fat at the same time -- is a genuinely appealing goal, and it is possible under the right conditions, though it's not equally achievable for everyone.

Who it works best for: people newer to resistance training (their bodies respond especially efficiently to a new training stimulus), people returning to training after time off (partly regaining previously-held muscle, a documented phenomenon called "muscle memory"), and people carrying more body fat to begin with, who can draw on stored energy more efficiently to support muscle-building while still in a slight deficit.

Who it's harder for: experienced, already-lean trainees generally find dedicated phases (a deliberate surplus specifically for building, followed by a deliberate deficit specifically for cutting) more effective than trying to do both simultaneously, since the biological requirements of each process work somewhat against each other at that level of training experience.

Practical approach: eating at a slight deficit or right around maintenance, prioritising a solid protein intake, and following a structured resistance training programme with progressive overload gives the best chance of true recomposition for those in the more favourable groups above -- patience matters here, since visible recomposition happens more slowly than either dedicated fat loss or dedicated muscle gain alone.`,
  },
  {
    slug: "hunger-vs-appetite",
    title: "Understanding Hunger vs Appetite",
    category: "NUTRITION_BASICS",
    summary: "Two related but genuinely different signals, worth being able to tell apart.",
    content: `Hunger and appetite are often used interchangeably, but they describe different things: hunger is the physiological need for food (driven by things like blood sugar and stomach emptiness), while appetite is the psychological desire to eat, which can be influenced by sight, smell, habit, emotion, and simply the time of day, independent of genuine physical need.

Why the distinction matters: eating in response to appetite without genuine hunger (a common pattern -- seeing food, feeling stressed, or simply because "it's lunchtime") is a normal part of being human, but recognising the difference can help with more deliberate eating decisions when that's a goal, without needing to treat every urge to eat as a moral failing.

Hormones involved: ghrelin (often called the "hunger hormone") rises before meals and falls after eating; leptin signals fullness to the brain over a longer timeframe. Both are affected by sleep quality, stress, and consistency of eating patterns -- poor sleep in particular is linked to higher ghrelin and lower leptin, which is part of why sleep-deprived people tend to feel hungrier and less satisfied by the same amount of food.

Practical takeaway: checking in with genuine physical hunger before eating (rather than reflexively eating whenever the appetite/urge appears) is a skill that develops with practice, not something to expect to get perfectly right immediately -- and it's fine to eat for enjoyment or social reasons sometimes too, without needing every meal to be driven purely by physiological hunger.`,
  },
  {
    slug: "whey-vs-plant-protein",
    title: "Whey vs Plant Protein: Which Should You Choose?",
    category: "SUPPLEMENTS",
    summary: "Fewer differences than the marketing on either side suggests.",
    content: `Whey and plant-based protein powders both exist to solve the same problem -- a convenient way to hit a daily protein target -- and for most practical purposes, the differences between them matter less than people often assume.

Amino acid profile: whey is naturally a complete protein with a particularly high leucine content (the amino acid most directly linked to triggering muscle protein synthesis). Single-source plant proteins (pea alone, rice alone) are often lower in one or two essential amino acids, which is why most quality plant protein powders use a blend (commonly pea and rice together) to cover this gap.

Digestion and practical differences: whey digests slightly faster on average, though this matters far less than total daily intake for most goals, as covered in the protein timing article. Plant proteins are naturally dairy-free, making them the default choice for anyone vegan, lactose-intolerant, or otherwise avoiding dairy.

The practical bottom line: once total protein and amino acid completeness are accounted for, both support muscle building and general protein needs effectively -- the choice mostly comes down to dietary preference, digestion, cost, and taste rather than one being objectively superior for typical fitness goals.`,
  },
];
