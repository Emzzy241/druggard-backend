/*
 * Seed dataset for local dev / demo only.
 *
 * VERIFICATION STATUS:
 * - `verified: true` entries have a NAFDAC number confirmed from a cited
 *   public source (see sourceUrl) at the time this was written.
 * - `verified: false` entries use a NAFDAC-number-SHAPED placeholder
 *   (format: "PENDING-<slug>") because I could not confirm the real
 *   registration number from a reliable source. Product name, ingredients
 *   and manufacturer are drawn from real, commonly sold Nigerian products,
 *   but DO NOT treat the placeholder numbers as real — swap them for the
 *   actual Greenbook-listed numbers before any real user sees this data.
 *   Each placeholder is unique per product (unlike the previous version,
 *   which reused one literal string and broke the unique index on insert).
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { Medicine } from "../models/Medicine.js";
import { SafetyAlert } from "../models/SafetyAlert.js";

dotenv.config();

const medicines = [
  // ---- Verified (real NAFDAC numbers, cited source) ----
  {
    productName: "P-Alaxin TS",
    activeIngredients: ["Dihydroartemisinin 120mg", "Piperaquine Phosphate 960mg"],
    category: "Antimalarial",
    form: "Tablet",
    route: "Oral",
    strength: "120mg/960mg",
    manufacturer: "Bliss GVS Pharma Limited",
    nafdacNumber: "B4-8892",
    registrationStatus: "registered",
    indication: "Treatment of uncomplicated malaria caused by Plasmodium falciparum.",
    dosageReference: "Adults: one tablet daily for 3 consecutive days, taken with water. Complete the full course.",
    warnings: [
      "Use under medical supervision if pregnant, especially in the first trimester.",
      "Do not use to self-diagnose malaria; confirm with a test where possible.",
    ],
    sourceUrl: "https://gomed.ng/product/p-alaxin-ts",
    dataSource: "manual-seed",
    verified: true,
  },
  {
    productName: "P-Alaxin",
    activeIngredients: ["Dihydroartemisinin 40mg", "Piperaquine Phosphate 320mg"],
    category: "Antimalarial",
    form: "Tablet",
    route: "Oral",
    strength: "40mg/320mg",
    manufacturer: "Bliss GVS Pharma Ltd",
    nafdacNumber: "A4-100927",
    registrationStatus: "registered",
    indication: "Treatment of uncomplicated malaria caused by Plasmodium falciparum.",
    dosageReference: "Follow the dosing schedule on the pack insert; complete the full 3-day course.",
    warnings: ["Consult a doctor or pharmacist before use if pregnant or breastfeeding."],
    sourceUrl: "https://gomed.ng/product/p-alaxin-tab-x12",
    dataSource: "manual-seed",
    verified: true,
  },
  {
    productName: "Coartem 80/480mg",
    activeIngredients: ["Artemether 80mg", "Lumefantrine 480mg"],
    category: "Antimalarial",
    form: "Tablet",
    route: "Oral",
    strength: "80mg/480mg",
    manufacturer: "Novartis Pharma AG",
    nafdacNumber: "B4-0262",
    registrationStatus: "registered",
    indication: "Treatment of acute, uncomplicated malaria in adults and children 35kg+.",
    dosageReference:
      "6 tablets over 3 days: one immediately, one after 8 hours, then one every 12 hours for 2 more days. Take with food.",
    warnings: ["Complete the full course even if symptoms improve.", "Check the MAS scratch-off code to verify authenticity."],
    sourceUrl: "https://gomed.ng/product/coartem-adult-80-480",
    dataSource: "manual-seed",
    verified: true,
  },
  {
    productName: "Coartem Dispersible 20/120mg",
    activeIngredients: ["Artemether 20mg", "Lumefantrine 120mg"],
    category: "Antimalarial",
    form: "Dispersible Tablet",
    route: "Oral",
    strength: "20mg/120mg",
    manufacturer: "Novartis",
    nafdacNumber: "A4-1680",
    registrationStatus: "registered",
    indication: "Treatment of uncomplicated malaria in children weighing 5kg to <15kg.",
    dosageReference: "Dissolve tablet in ~10ml water; give to child immediately. Follow weight-based schedule on pack.",
    warnings: ["Weight-band specific — do not use adult dosing for children."],
    sourceUrl: "https://gomed.ng/product/coartem-20-120-by-6",
    dataSource: "manual-seed",
    verified: true,
  },
  {
    productName: "Coartem 20/120mg (Adult Pack, 24 tabs)",
    activeIngredients: ["Artemether 20mg", "Lumefantrine 120mg"],
    category: "Antimalarial",
    form: "Tablet",
    route: "Oral",
    strength: "20mg/120mg",
    manufacturer: "Novartis",
    nafdacNumber: "04-3275",
    registrationStatus: "registered",
    indication: "Treatment of acute, uncomplicated malaria in adults and adolescents 35kg+.",
    dosageReference: "24 tablets over a 3-day course; follow the schedule printed on the pack.",
    warnings: ["Verify authenticity via the Mobile Authentication Service (MAS) scratch code."],
    sourceUrl: "https://gomed.ng/product/coartem-tab-x-24",
    dataSource: "manual-seed",
    verified: true,
  },
  {
    productName: "Augmentin 457mg/5ml Suspension",
    activeIngredients: ["Amoxicillin 400mg/5ml", "Clavulanic Acid 57mg/5ml"],
    category: "Antibiotic",
    form: "Powder for Oral Suspension",
    route: "Oral",
    strength: "457mg/5ml",
    manufacturer: "GlaxoSmithKline (GSK)",
    nafdacNumber: "04-2496",
    registrationStatus: "registered",
    indication: "Treatment of bacterial infections in children (ear, nose, throat, respiratory).",
    dosageReference: "Weight/age-based dosing — follow the reconstitution and dosing chart on the pack insert.",
    warnings: ["Complete the full course even if the child feels better.", "Shake well before each use."],
    sourceUrl: "https://gomed.ng/product/augmentin-suspension-457mg-5ml",
    dataSource: "manual-seed",
    verified: true,
  },
  {
    productName: "Augmentin 625mg Tablets",
    activeIngredients: ["Amoxicillin 500mg", "Clavulanic Acid 125mg"],
    category: "Antibiotic",
    form: "Tablet",
    route: "Oral",
    strength: "625mg",
    manufacturer: "GlaxoSmithKline (GSK)",
    nafdacNumber: "04-1928",
    registrationStatus: "registered",
    indication: "Treatment of bacterial infections (respiratory, urinary, skin, dental).",
    dosageReference: "Adults and children over 12: one tablet every 12 hours for mild-to-moderate infections.",
    warnings: [
      "Check for legible manufacturing/expiry dates and a valid MAS scratch code — a falsified version of this exact product has circulated in Nigeria.",
    ],
    sourceUrl: "https://gomed.ng/product/augmentin-625mg-tabs",
    dataSource: "manual-seed",
    verified: true,
  },
  {
    productName: "Flagyl 400mg",
    activeIngredients: ["Metronidazole 400mg"],
    category: "Antibiotic/Antiprotozoal",
    form: "Tablet",
    route: "Oral",
    strength: "400mg",
    manufacturer: "Sanofi",
    nafdacNumber: "04-0130",
    registrationStatus: "registered",
    indication: "Treatment of anaerobic bacterial and protozoal infections (e.g. amoebiasis, giardiasis).",
    dosageReference: "As prescribed; typical adult dose 400mg 2-3 times daily.",
    warnings: ["Avoid alcohol during and for at least 48 hours after treatment (disulfiram-like reaction)."],
    sourceUrl: "https://gomed.ng/product/flagyl-400mg",
    dataSource: "manual-seed",
    verified: true,
  },

  // ---- Unverified placeholders — real products, PLACEHOLDER reg numbers ----
  {
    productName: "Panadol Extra",
    activeIngredients: ["Paracetamol 500mg", "Caffeine 65mg"],
    category: "Analgesic",
    form: "Tablet",
    route: "Oral",
    strength: "500mg/65mg",
    manufacturer: "Haleon (GSK Consumer Healthcare)",
    nafdacNumber: "PENDING-PANADOL-EXTRA",
    registrationStatus: "registered",
    indication: "Relief of mild to moderate pain and fever.",
    dosageReference: "Adults: 1-2 tablets every 4-6 hours, not exceeding 8 tablets in 24 hours.",
    warnings: ["Do not exceed the stated dose.", "Avoid with other paracetamol-containing products."],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Emzor Paracetamol 500mg",
    activeIngredients: ["Paracetamol 500mg"],
    category: "Analgesic",
    form: "Tablet",
    route: "Oral",
    strength: "500mg",
    manufacturer: "Emzor Pharmaceutical Industries Ltd",
    nafdacNumber: "PENDING-EMZOR-PARA-500",
    registrationStatus: "registered",
    indication: "Relief of mild to moderate pain and fever.",
    dosageReference: "Adults: 1 tablet every 4-6 hours, not exceeding 4000mg in 24 hours.",
    warnings: ["Avoid exceeding the maximum daily dose — risk of liver damage."],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Amoxil (Amoxicillin) 500mg",
    activeIngredients: ["Amoxicillin 500mg"],
    category: "Antibiotic",
    form: "Capsule",
    route: "Oral",
    strength: "500mg",
    manufacturer: "GlaxoSmithKline",
    nafdacNumber: "PENDING-AMOXIL-500",
    registrationStatus: "registered",
    indication: "Treatment of susceptible bacterial infections.",
    dosageReference: "As prescribed by a physician; typical adult dose 250-500mg every 8 hours.",
    warnings: ["Do not use if allergic to penicillin.", "Complete the full prescribed course."],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Ciprotab (Ciprofloxacin) 500mg",
    activeIngredients: ["Ciprofloxacin 500mg"],
    category: "Antibiotic",
    form: "Tablet",
    route: "Oral",
    strength: "500mg",
    manufacturer: "Chi Pharmaceuticals Ltd",
    nafdacNumber: "PENDING-CIPROTAB-500",
    registrationStatus: "registered",
    indication: "Treatment of bacterial infections including UTIs and typhoid.",
    dosageReference: "As prescribed; typical adult dose 500mg every 12 hours.",
    warnings: ["Avoid dairy products and antacids near dosing time.", "Increased sun sensitivity possible."],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Fansidar (Sulfadoxine/Pyrimethamine)",
    activeIngredients: ["Sulfadoxine 500mg", "Pyrimethamine 25mg"],
    category: "Antimalarial",
    form: "Tablet",
    route: "Oral",
    strength: "500mg/25mg",
    manufacturer: "Roche",
    nafdacNumber: "PENDING-FANSIDAR",
    registrationStatus: "registered",
    indication: "Intermittent preventive treatment of malaria in pregnancy (IPTp), as directed by a clinician.",
    dosageReference: "Single-dose regimen as prescribed; not for routine self-medication.",
    warnings: [
      "Not recommended in the first trimester of pregnancy without medical guidance.",
      "Risk of severe skin reactions in rare cases.",
    ],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Lonart DS",
    activeIngredients: ["Artemether 80mg", "Lumefantrine 480mg"],
    category: "Antimalarial",
    form: "Tablet",
    route: "Oral",
    strength: "80mg/480mg",
    manufacturer: "Greenlife Pharmaceuticals Ltd",
    nafdacNumber: "PENDING-LONART-DS",
    registrationStatus: "registered",
    indication: "Treatment of acute, uncomplicated malaria in adults.",
    dosageReference: "6 tablets over 3 days, taken with fatty food; follow the pack schedule.",
    warnings: ["Complete the full 3-day course."],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Postinor-2",
    activeIngredients: ["Levonorgestrel 0.75mg"],
    category: "Emergency Contraceptive",
    form: "Tablet",
    route: "Oral",
    strength: "0.75mg",
    manufacturer: "Gedeon Richter",
    nafdacNumber: "PENDING-POSTINOR-2",
    registrationStatus: "registered",
    indication: "Emergency contraception after unprotected intercourse or contraceptive failure.",
    dosageReference: "Two tablets: first as soon as possible, second 12 hours later — or per current pack instructions.",
    warnings: [
      "Not intended for regular/routine contraception.",
      "Effectiveness decreases the longer you wait after intercourse.",
    ],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Andrews Liver Salt",
    activeIngredients: ["Sodium Bicarbonate", "Citric Acid", "Magnesium Sulfate"],
    category: "Antacid/Laxative",
    form: "Effervescent Powder",
    route: "Oral",
    strength: "Standard formula",
    manufacturer: "Haleon (GSK Consumer Healthcare)",
    nafdacNumber: "PENDING-ANDREWS-LS",
    registrationStatus: "registered",
    indication: "Relief of indigestion, constipation, and upset stomach.",
    dosageReference: "Dissolve one dose in water as directed on the pack.",
    warnings: ["Not for prolonged use without medical advice."],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "ORS (Oral Rehydration Salts)",
    activeIngredients: ["Sodium chloride", "Potassium chloride", "Glucose", "Sodium citrate"],
    category: "Rehydration therapy",
    form: "Powder for oral solution",
    route: "Oral",
    strength: "Standard WHO formula",
    manufacturer: "Various NAFDAC-registered manufacturers",
    nafdacNumber: "PENDING-ORS-STANDARD",
    registrationStatus: "registered",
    indication: "Rehydration during diarrhoea or fluid loss.",
    dosageReference: "Dissolve one sachet in the stated volume of clean water; consume within 24 hours of mixing.",
    warnings: ["Discard prepared solution after 24 hours.", "Seek medical care if diarrhoea persists beyond 2 days."],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Zinc Sulfate 20mg (Diarrhoea adjunct)",
    activeIngredients: ["Zinc Sulfate 20mg"],
    category: "Supplement",
    form: "Dispersible Tablet",
    route: "Oral",
    strength: "20mg",
    manufacturer: "Various NAFDAC-registered manufacturers",
    nafdacNumber: "PENDING-ZINC-20",
    registrationStatus: "registered",
    indication: "Adjunct treatment for diarrhoea in children, alongside ORS.",
    dosageReference: "One tablet daily for 10-14 days, as directed.",
    warnings: ["Used alongside, not instead of, ORS."],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Vitamin C 1000mg (Ascorbic Acid)",
    activeIngredients: ["Ascorbic Acid 1000mg"],
    category: "Vitamin/Supplement",
    form: "Effervescent Tablet",
    route: "Oral",
    strength: "1000mg",
    manufacturer: "Various NAFDAC-registered manufacturers",
    nafdacNumber: "PENDING-VITC-1000",
    registrationStatus: "registered",
    indication: "Dietary supplement for vitamin C deficiency or immune support.",
    dosageReference: "One tablet daily dissolved in water, or as directed on pack.",
    warnings: ["High doses may cause stomach upset in some people."],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Multivite Syrup",
    activeIngredients: ["Multivitamin blend"],
    category: "Vitamin/Supplement",
    form: "Syrup",
    route: "Oral",
    strength: "Standard pediatric formula",
    manufacturer: "Various NAFDAC-registered manufacturers",
    nafdacNumber: "PENDING-MULTIVITE-SYR",
    registrationStatus: "registered",
    indication: "General vitamin supplementation, commonly used in children.",
    dosageReference: "Follow age-based dosing on the pack insert.",
    warnings: ["Not a substitute for a balanced diet."],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Diclofenac 50mg",
    activeIngredients: ["Diclofenac Sodium 50mg"],
    category: "NSAID/Analgesic",
    form: "Tablet",
    route: "Oral",
    strength: "50mg",
    manufacturer: "Various NAFDAC-registered manufacturers",
    nafdacNumber: "PENDING-DICLOFENAC-50",
    registrationStatus: "registered",
    indication: "Relief of pain and inflammation (e.g. musculoskeletal pain).",
    dosageReference: "As prescribed; typical adult dose 50mg 2-3 times daily with food.",
    warnings: [
      "Avoid in peptic ulcer disease or significant cardiovascular risk without medical advice.",
      "Take with food to reduce stomach irritation.",
    ],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Omeprazole 20mg",
    activeIngredients: ["Omeprazole 20mg"],
    category: "Proton Pump Inhibitor",
    form: "Capsule",
    route: "Oral",
    strength: "20mg",
    manufacturer: "Various NAFDAC-registered manufacturers",
    nafdacNumber: "PENDING-OMEPRAZOLE-20",
    registrationStatus: "registered",
    indication: "Treatment of acid reflux, ulcers, and related conditions.",
    dosageReference: "Typically one capsule daily before food, as prescribed.",
    warnings: ["Long-term use should be under medical supervision."],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Metformin 500mg",
    activeIngredients: ["Metformin Hydrochloride 500mg"],
    category: "Antidiabetic",
    form: "Tablet",
    route: "Oral",
    strength: "500mg",
    manufacturer: "Various NAFDAC-registered manufacturers",
    nafdacNumber: "PENDING-METFORMIN-500",
    registrationStatus: "registered",
    indication: "Management of type 2 diabetes, as prescribed.",
    dosageReference: "As prescribed by a physician; typically taken with meals.",
    warnings: ["Requires monitoring of kidney function.", "Not a substitute for prescribed diabetes management."],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Amlodipine 5mg",
    activeIngredients: ["Amlodipine Besylate 5mg"],
    category: "Antihypertensive",
    form: "Tablet",
    route: "Oral",
    strength: "5mg",
    manufacturer: "Various NAFDAC-registered manufacturers",
    nafdacNumber: "PENDING-AMLODIPINE-5",
    registrationStatus: "registered",
    indication: "Management of high blood pressure, as prescribed.",
    dosageReference: "As prescribed by a physician, typically once daily.",
    warnings: ["Do not stop abruptly without medical advice.", "May cause ankle swelling in some patients."],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Cetirizine 10mg",
    activeIngredients: ["Cetirizine Hydrochloride 10mg"],
    category: "Antihistamine",
    form: "Tablet",
    route: "Oral",
    strength: "10mg",
    manufacturer: "Various NAFDAC-registered manufacturers",
    nafdacNumber: "PENDING-CETIRIZINE-10",
    registrationStatus: "registered",
    indication: "Relief of allergy symptoms (hay fever, hives, itching).",
    dosageReference: "Adults: one tablet daily.",
    warnings: ["May cause drowsiness in some individuals."],
    dataSource: "manual-seed",
    verified: false,
  },
  {
    productName: "Buscopan (Hyoscine Butylbromide) 10mg",
    activeIngredients: ["Hyoscine Butylbromide 10mg"],
    category: "Antispasmodic",
    form: "Tablet",
    route: "Oral",
    strength: "10mg",
    manufacturer: "Sanofi",
    nafdacNumber: "PENDING-BUSCOPAN-10",
    registrationStatus: "registered",
    indication: "Relief of abdominal cramps and spasms.",
    dosageReference: "Adults: 1-2 tablets up to 3 times daily, as directed.",
    warnings: ["Avoid in certain bowel obstructions or glaucoma without medical advice."],
    dataSource: "manual-seed",
    verified: false,
  },
];

// A real, publicly documented NAFDAC public alert — Public Alert No. 043/2024 —
// about a falsified version of Augmentin 625mg circulating with this exact
// registration number on the fake packaging. Linked here as a demonstration
// of the safetyAlerts relationship; verify current status on NAFDAC's site
// before relying on this for a live demo.
const sampleAlertsByProductName = {
  "Augmentin 625mg Tablets": [
    {
      title: "Falsified Augmentin 625mg circulating (NAFDAC public alert)",
      description:
        "NAFDAC alerted the public to a falsified batch of Augmentin 625mg with incomplete labeling (missing 'manufactured by' line, invalid date formats, no MAS scratch code). Genuine packs carry legible manufacturing/expiry dates, batch number, and a valid MAS code.",
      sourceUrl: "https://newscentraltv.com/?p=125301",
      alertDate: new Date("2021-05-01"),
    },
  ],
  "Coartem 20/120mg (Adult Pack, 24 tabs)": [
    {
      title: "Historical fake Coartem alerts in the West/Central Africa region",
      description:
        "Regional regulators have previously flagged counterfeit Coartem batches circulating with falsified NAFDAC stamps. Always verify the Mobile Authentication Service (MAS) code on the pack.",
      sourceUrl: "https://graphiconline.com/news/health/fda-warns-of-fake-malaria-drugs-in-circulation.html",
      alertDate: new Date("2013-01-01"),
    },
  ],
};

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set. Aborting seed.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected. Clearing existing seed data...");

  await Medicine.deleteMany({});
  await SafetyAlert.deleteMany({});

  const inserted = await Medicine.insertMany(medicines);
  console.log(`Inserted ${inserted.length} medicines.`);

  let alertCount = 0;
  for (const med of inserted) {
    const alerts = sampleAlertsByProductName[med.productName];
    if (alerts) {
      await SafetyAlert.insertMany(alerts.map((a) => ({ ...a, medicine: med._id })));
      alertCount += alerts.length;
    }
  }
  console.log(`Inserted ${alertCount} safety alerts.`);

  const unverifiedCount = medicines.filter((m) => !m.verified).length;
  if (unverifiedCount > 0) {
    console.warn(
      `\nWARNING: ${unverifiedCount} of ${medicines.length} seeded medicines have PLACEHOLDER ` +
        `NAFDAC numbers ("PENDING-" prefix). Replace with real Greenbook numbers before any live demo.`
    );
  }

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
