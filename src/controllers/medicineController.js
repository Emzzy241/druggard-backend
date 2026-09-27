import { Medicine } from "../models/Medicine.js";
import { SafetyAlert } from "../models/SafetyAlert.js";

const NOT_FOUND_GUIDANCE =
  "No matching record was found for this search. This does not automatically mean the product is fake — " +
  "verify with a pharmacist or contact NAFDAC directly before drawing any conclusion.";

function serializeMedicine(doc) {
  return {
    id: doc._id,
    productName: doc.productName,
    activeIngredients: doc.activeIngredients,
    category: doc.category,
    form: doc.form,
    route: doc.route,
    strength: doc.strength,
    manufacturer: doc.manufacturer,
    nafdacNumber: doc.nafdacNumber,
    registrationStatus: doc.registrationStatus,
    approvalDate: doc.approvalDate,
    expiryDate: doc.expiryDate,
    indication: doc.indication,
    dosageReference: doc.dosageReference,
    warnings: doc.warnings,
    compositionText: doc.compositionText,
    atcCode: doc.atcCode,
    sourceUrl: doc.sourceUrl,
    dataSource: doc.dataSource,
    updatedAt: doc.updatedAt,
  };
}

// GET /api/medicines?q=
export async function searchMedicines(req, res, next) {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({
        status: "error",
        message: "Query parameter 'q' is required.",
      });
    }

    // Try a text search first, fall back to a case-insensitive partial match
    // (text search needs exact-ish tokens; partial match covers "p-alax" style typing)
    let results = await Medicine.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(20);

    if (results.length === 0) {
      results = await Medicine.find({
        productName: { $regex: q, $options: "i" },
      }).limit(20);
    }

    if (results.length === 0) {
      return res.status(200).json({
        status: "not_found",
        query: q,
        message: NOT_FOUND_GUIDANCE,
        results: [],
      });
    }

    return res.status(200).json({
      status: "registered",
      query: q,
      results: results.map(serializeMedicine),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/medicines/nafdac/:number
export async function getByNafdacNumber(req, res, next) {
  try {
    const number = (req.params.number || "").trim().toUpperCase();

    const medicine = await Medicine.findOne({ nafdacNumber: number });

    if (!medicine) {
      return res.status(200).json({
        status: "not_found",
        nafdacNumber: number,
        message: NOT_FOUND_GUIDANCE,
      });
    }

    const alerts = await SafetyAlert.find({ medicine: medicine._id }).sort({
      alertDate: -1,
    });

    return res.status(200).json({
      status: "registered",
      medicine: serializeMedicine(medicine),
      safetyAlerts: alerts.map((a) => ({
        id: a._id,
        title: a.title,
        description: a.description,
        sourceUrl: a.sourceUrl,
        alertDate: a.alertDate,
      })),
    });
  } catch (err) {
    next(err);
  }
}


// GET /api/medicines/all?page=1&limit=50&category=Antimalarial
export async function getAllMedicines(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200); // cap at 200/page
    const skip = (page - 1) * limit;
 
    const filter = {};
    if (req.query.category) {
      filter.category = { $regex: req.query.category, $options: "i" };
    }
 
    const [medicines, total] = await Promise.all([
      Medicine.find(filter).sort({ productName: 1 }).skip(skip).limit(limit),
      Medicine.countDocuments(filter),
    ]);
 
    return res.status(200).json({
      status: "ok",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      results: medicines.map(serializeMedicine),
    });
  } catch (err) {
    next(err);
  }
}









// Before Integrating more durugs, check them branchses


// import { Medicine } from "../models/Medicine.js";
// import { SafetyAlert } from "../models/SafetyAlert.js";

// const NOT_FOUND_GUIDANCE =
//   "No matching record was found for this search. This does not automatically mean the product is fake — " +
//   "verify with a pharmacist or contact NAFDAC directly before drawing any conclusion.";

// function serializeMedicine(doc) {
//   return {
//     id: doc._id,
//     productName: doc.productName,
//     activeIngredients: doc.activeIngredients,
//     category: doc.category,
//     form: doc.form,
//     route: doc.route,
//     strength: doc.strength,
//     manufacturer: doc.manufacturer,
//     nafdacNumber: doc.nafdacNumber,
//     registrationStatus: doc.registrationStatus,
//     approvalDate: doc.approvalDate,
//     indication: doc.indication,
//     dosageReference: doc.dosageReference,
//     warnings: doc.warnings,
//     sourceUrl: doc.sourceUrl,
//     dataSource: doc.dataSource,
//     updatedAt: doc.updatedAt,
//   };
// }

// // GET /api/medicines?q=
// export async function searchMedicines(req, res, next) {
//   try {
//     const q = (req.query.q || "").trim();

//     if (!q) {
//       return res.status(400).json({
//         status: "error",
//         message: "Query parameter 'q' is required.",
//       });
//     }

//     // Try a text search first, fall back to a case-insensitive partial match
//     // (text search needs exact-ish tokens; partial match covers "p-alax" style typing)
//     let results = await Medicine.find(
//       { $text: { $search: q } },
//       { score: { $meta: "textScore" } }
//     )
//       .sort({ score: { $meta: "textScore" } })
//       .limit(20);

//     if (results.length === 0) {
//       results = await Medicine.find({
//         productName: { $regex: q, $options: "i" },
//       }).limit(20);
//     }

//     if (results.length === 0) {
//       return res.status(200).json({
//         status: "not_found",
//         query: q,
//         message: NOT_FOUND_GUIDANCE,
//         results: [],
//       });
//     }

//     return res.status(200).json({
//       status: "registered",
//       query: q,
//       results: results.map(serializeMedicine),
//     });
//   } catch (err) {
//     next(err);
//   }
// }

// // GET /api/medicines/nafdac/:number
// export async function getByNafdacNumber(req, res, next) {
//   try {
//     const number = (req.params.number || "").trim().toUpperCase();

//     const medicine = await Medicine.findOne({ nafdacNumber: number });

//     if (!medicine) {
//       return res.status(200).json({
//         status: "not_found",
//         nafdacNumber: number,
//         message: NOT_FOUND_GUIDANCE,
//       });
//     }

//     const alerts = await SafetyAlert.find({ medicine: medicine._id }).sort({
//       alertDate: -1,
//     });

//     return res.status(200).json({
//       status: "registered",
//       medicine: serializeMedicine(medicine),
//       safetyAlerts: alerts.map((a) => ({
//         id: a._id,
//         title: a.title,
//         description: a.description,
//         sourceUrl: a.sourceUrl,
//         alertDate: a.alertDate,
//       })),
//     });
//   } catch (err) {
//     next(err);
//   }
// }


// // GET /api/medicines/all?page=1&limit=50&category=Antimalarial
// export async function getAllMedicines(req, res, next) {
//   try {
//     const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
//     const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200); // cap at 200/page
//     const skip = (page - 1) * limit;
 
//     const filter = {};
//     if (req.query.category) {
//       filter.category = { $regex: req.query.category, $options: "i" };
//     }
 
//     const [medicines, total] = await Promise.all([
//       Medicine.find(filter).sort({ productName: 1 }).skip(skip).limit(limit),
//       Medicine.countDocuments(filter),
//     ]);
 
//     return res.status(200).json({
//       status: "ok",
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit),
//       results: medicines.map(serializeMedicine),
//     });
//   } catch (err) {
//     next(err);
//   }
// }
 