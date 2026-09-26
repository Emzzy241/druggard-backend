import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
  })
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", service: "drugguard-backend" });
});

app.use("/api/v1/medicines", medicineRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`DrugGuard backend running on port ${PORT}`);
  });
});
