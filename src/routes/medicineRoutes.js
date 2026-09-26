import { Router } from "express";
import { searchMedicines, getByNafdacNumber, getAllMedicines } from "../controllers/medicineController.js";

const router = Router();

router.get("/", searchMedicines); // GET /api/medicines?q=
router.get("/nafdac/:number", getByNafdacNumber); // GET /api/medicines/nafdac/:number
router.get("/all", getAllMedicines)

export default router;
