/*
 * Ingests medicine records from the NAFDAC Greenbook DataTables endpoint.
 *
 * DISCOVERY NOTES (so future-you remembers how this was found):
 * The Greenbook UI (greenbook.nafdac.gov.ng) is a jQuery DataTables grid.
 * Every search/page interaction fires a GET request back to the same
 * origin with `draw`, `start`, `length`, `columns[]`, `order[]` and
 * `search[value]` query params (standard DataTables server-side
 * processing convention) and gets back JSON: { draw, recordsTotal,
 * recordsFiltered, data: [...] }. `columns[3]` is `product_category_id`
 * — set its search value to filter by category. `1` = "Drugs", confirmed
 * from a live response. Other category IDs (Vaccines & Biologics,
 * Veterinary, Medical Services, Herbals & Nutraceuticals, Disinfectants)
 * are NOT yet confirmed — grab them the same way (DevTools → Network →
 * pick that category in the UI filter → read `product_category_id` off
 * the request) and add them to CATEGORY_IDS below.
 *
 * ETIQUETTE: this hits a government server that was never built to serve
 * a bulk export — it's a paginated admin-style grid. Ingest runs are
 * rate-limited (REQUEST_DELAY_MS) and use a realistic page size (100) to
 * keep total requests low (~90 requests for all 8,941 Drugs records,
 * instead of ~895 at the UI's default page size of 10). Don't drop the
 * delay to "go faster" — that's how you get the endpoint blocked or
 * rate-limited for everyone, including the public Greenbook UI itself.
 *
 * NOT YET DONE: checking greenbook.nafdac.gov.ng/robots.txt and NAFDAC's
 * terms of use for this endpoint specifically. Do that (in a browser,
 * manually) before running this against the full dataset in anything
 * other than a one-off/dev context. This script assumes you've already
 * made that call.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { Medicine } from "../models/Medicine.js";

dotenv.config();

const BASE_URL = "https://greenbook.nafdac.gov.ng/";
const PAGE_LENGTH = 100; // records per request — drop to 10-25 if the server 400s/timeouts on 100
const REQUEST_DELAY_MS = 400; // pause between requests — be polite to a government server
const MAX_RETRIES = 3;

// product_category_id → our internal category label.
// Only "Drugs" (1) is confirmed. Add more once you've captured their IDs.
const CATEGORY_IDS = [{ id: 1, label: "Drugs" }];

// Mirrors the exact `columns[]` shape from the captured request, since the
// server's DataTables handler likely expects the full column definition
// set, not just the ones we filter/sort on.
function buildColumns(categoryId) {
  const cols = [
    { data: "product_name", name: "product_name", search: "" },
    { data: "ingredient.ingredient_name", name: "ingredient.ingredient_name", search: "" },
    { data: "product_category.name", name: "product_category.name", search: "", orderable: false },
    { data: "product_category_id", name: "product_category_id", search: String(categoryId) },
    { data: "ingredient.synonym", name: "ingredient.synonym", search: "" },
    { data: "NAFDAC", name: "NAFDAC", search: "" },
    { data: "form.name", name: "form.name", search: "" },
    { data: "route.name", name: "route.name", search: "" },
    { data: "strength", name: "strength", search: "" },
    { data: "applicant.name", name: "applicant.name", search: "" },
    { data: "approval_date", name: "approval_date", search: "" },
    { data: "status", name: "status", search: "" },
  ];

  const params = new URLSearchParams();
  cols.forEach((col, i) => {
    params.append(`columns[${i}][data]`, col.data);
    params.append(`columns[${i}][name]`, col.name);
    params.append(`columns[${i}][searchable]`, "true");
    params.append(`columns[${i}][orderable]`, col.orderable === false ? "false" : "true");
    params.append(`columns[${i}][search][value]`, col.search);
    params.append(`columns[${i}][search][regex]`, "false");
  });
  return params;
}

async function fetchPage({ categoryId, start, draw }) {
  const params = buildColumns(categoryId);
  params.append("order[0][column]", "0");
  params.append("order[0][dir]", "asc");
  params.append("start", String(start));
  params.append("length", String(PAGE_LENGTH));
  params.append("search[value]", "");
  params.append("search[regex]", "false");
  params.append("search_ingredient", "");
  params.append("draw", String(draw));
  params.append("_", String(Date.now()));

  const url = `${BASE_URL}?${params.toString()}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json, text/javascript, */*; q=0.01",
          Referer: BASE_URL,
          "User-Agent": "DrugGuard-ingest/1.0 (+https://drug-guard-kappa.vercel.app/)",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      if (!Array.isArray(json.data)) {
        throw new Error("Unexpected response shape — no `data` array. Endpoint may have changed.");
      }
      return json;
    } catch (err) {
      console.warn(`  attempt ${attempt}/${MAX_RETRIES} failed (start=${start}): ${err.message}`);
      if (attempt === MAX_RETRIES) throw err;
      await sleep(REQUEST_DELAY_MS * attempt * 2); // back off
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapStatus(rawStatus) {
  const s = (rawStatus || "").trim().toLowerCase();
  if (s === "active") return "registered";
  if (s === "inactive") return "expired";
  if (s === "suspended") return "suspended";
  return "expired"; // conservative default — never default to "registered" on an unrecognized status
}

function cleanProductName(name) {
  // Strips the trailing "##" artifact seen in some Greenbook entries.
  return (name || "").replace(/#+$/g, "").trim();
}

function mapRecord(record, categoryLabel) {
  const nafdacNumber = (record.NAFDAC || "").trim().toUpperCase();
  if (!nafdacNumber) return null; // skip anything without a registration number — it's our unique key

  return {
    productName: cleanProductName(record.product_name),
    activeIngredients: record.ingredient?.ingredient_name
      ? [record.ingredient.ingredient_name]
      : [],
    category: categoryLabel,
    form: record.form?.name || record.form_name || "",
    route: record.route?.name || record.route_name || "",
    strength: record.strength || "",
    manufacturer: record.applicant?.name || record.applicant_name || "",
    nafdacNumber,
    registrationStatus: mapStatus(record.status),
    approvalDate: record.approval_date ? new Date(record.approval_date) : undefined,
    expiryDate: record.expiry_date ? new Date(record.expiry_date) : undefined,
    compositionText: record.composition || "",
    atcCode: record.atc || "",
    // Intentionally left unset — NAFDAC doesn't provide these; backfill
    // from a separate trusted medical reference before relying on them.
    indication: undefined,
    dosageReference: undefined,
    warnings: undefined,
    dataSource: "nafdac-greenbook",
  };
}

async function ingestCategory({ id: categoryId, label: categoryLabel }) {
  console.log(`\n--- Ingesting category "${categoryLabel}" (product_category_id=${categoryId}) ---`);

  let start = 0;
  let draw = 1;
  let total = null;
  let upserted = 0;
  let skipped = 0;

  do {
    const page = await fetchPage({ categoryId, start, draw });
    total = page.recordsFiltered ?? page.recordsTotal;

    const ops = [];
    for (const record of page.data) {
      const doc = mapRecord(record, categoryLabel);
      if (!doc) {
        skipped++;
        continue;
      }
      ops.push({
        updateOne: {
          filter: { nafdacNumber: doc.nafdacNumber },
          update: { $set: doc },
          upsert: true,
        },
      });
    }

    if (ops.length > 0) {
      const result = await Medicine.bulkWrite(ops, { ordered: false });
      upserted += (result.upsertedCount || 0) + (result.modifiedCount || 0);
    }

    console.log(
      `  page start=${start}: fetched ${page.data.length}, running total upserted=${upserted}, skipped=${skipped} / ${total}`
    );

    start += PAGE_LENGTH;
    draw += 1;
    await sleep(REQUEST_DELAY_MS);
  } while (start < total);

  console.log(`Done with "${categoryLabel}": ${upserted} upserted, ${skipped} skipped (no NAFDAC number).`);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set. Aborting.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  for (const category of CATEGORY_IDS) {
    await ingestCategory(category);
  }

  await mongoose.disconnect();
  console.log("\nAll categories ingested. Disconnected.");
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});