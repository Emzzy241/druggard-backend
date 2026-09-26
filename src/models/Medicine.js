import mongoose from "mongoose";

const { Schema } = mongoose;

/*
 * Mirrors the PRD's `medicines` table, adapted to documents.
 * `status` reflects NAFDAC registration status ONLY — it is never used
 * to assert a product is fake. A medicine simply absent from this
 * collection is "not_found", not "counterfeit". See safetyController.
 */
const medicineSchema = new Schema(
  {
    productName: { type: String, required: true, trim: true, index: true },
    activeIngredients: [{ type: String, trim: true }],
    category: { type: String, trim: true },
    form: { type: String, trim: true }, // e.g. Tablet, Syrup, Injection
    route: { type: String, trim: true }, // e.g. Oral, Intravenous
    strength: { type: String, trim: true }, // e.g. "40mg/320mg"
    manufacturer: { type: String, trim: true },

    nafdacNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    registrationStatus: {
      type: String,
      enum: ["registered", "expired", "suspended"],
      default: "registered",
    },
    approvalDate: { type: Date },

    // Reference info only — never AI-generated or personalized (per PRD §7)
    indication: { type: String, trim: true }, // "what it's used for"
    dosageReference: { type: String, trim: true },
    warnings: [{ type: String, trim: true }],

    sourceUrl: { type: String, trim: true },
    dataSource: {
      type: String,
      default: "manual-seed", // swap to "nafdac-greenbook" / "emdex" once ingestion exists
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

medicineSchema.index({ productName: "text" });

export const Medicine = mongoose.model("Medicine", medicineSchema);
