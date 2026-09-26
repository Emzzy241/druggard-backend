import mongoose from "mongoose";

const { Schema } = mongoose;

const safetyAlertSchema = new Schema(
  {
    medicine: { type: Schema.Types.ObjectId, ref: "Medicine", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    sourceUrl: { type: String, trim: true },
    alertDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const SafetyAlert = mongoose.model("SafetyAlert", safetyAlertSchema);
