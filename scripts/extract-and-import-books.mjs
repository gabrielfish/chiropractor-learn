/**
 * Extract text from Ryan's 4 PDF books and import into books_content table.
 *
 * Each book is chunked into ~3000-character sections. Each section becomes
 * one row: { book_title, chapter_title, content_text, order_index }.
 *
 * Usage: node scripts/extract-and-import-books.mjs
 *
 * Requires .env with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * Requires pdf-parse (npm install pdf-parse --save-dev in project root).
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const __dir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dir, "..");

// ── Load .env ─────────────────────────────────────────────────────────────────
const envText = readFileSync(resolve(rootDir, ".env"), "utf8");
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

// ── PDF files ─────────────────────────────────────────────────────────────────
const BOOKS_DIR = "C:\\Users\\gabri\\Downloads\\Ryan's Books";
const BOOKS = [
  {
    file: `${BOOKS_DIR}\\New Patient Avalanche Pages_Reviced.pdf`,
    title: "New Patient Avalanche",
  },
  {
    file: `${BOOKS_DIR}\\The Patient Retention FULL BOOK_Final_Digital (1).pdf`,
    title: "The Patient Retention System",
  },
  {
    file: `${BOOKS_DIR}\\Practice Growth Speaking Secrets.pdf`,
    title: "Practice Growth Speaking Secrets",
  },
  {
    file: `${BOOKS_DIR}\\Conversion Alchemy Pages_Additional Chapter.pdf`,
    title: "Conversion Alchemy",
  },
];

const CHUNK_SIZE = 3000;   // characters per chunk
const CHUNK_OVERLAP = 200; // overlap to avoid cutting mid-sentence


// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extract full text from a PDF file using pdf2json */
async function extractPdfText(filePath) {
  const PDFParser = require("pdf2json");
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, 1); // 1 = raw text mode
    parser.on("pdfParser_dataError", (err) => reject(new Error(err.parserError)));
    parser.on("pdfParser_dataReady", () => {
      // getRawTextContent() returns all text with form feeds between pages
      const raw = parser.getRawTextContent();
      resolve(raw.replace(/\f/g, "\n\n"));
    });
    parser.loadPDF(filePath);
  });
}

/**
 * Split text into overlapping chunks of ~CHUNK_SIZE chars.
 * Tries to break at paragraph or sentence boundaries.
 */
function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  // Normalise whitespace
  const cleaned = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const chunks = [];
  let start = 0;

  while (start < cleaned.length) {
    let end = start + chunkSize;

    if (end >= cleaned.length) {
      chunks.push(cleaned.slice(start).trim());
      break;
    }

    // Try to break at double-newline (paragraph)
    let breakAt = cleaned.lastIndexOf("\n\n", end);
    if (breakAt <= start + chunkSize / 2) {
      // Fall back to single newline
      breakAt = cleaned.lastIndexOf("\n", end);
    }
    if (breakAt <= start + chunkSize / 2) {
      // Fall back to sentence end
      breakAt = cleaned.lastIndexOf(". ", end);
      if (breakAt > start) breakAt += 1; // include the period
    }
    if (breakAt <= start) {
      breakAt = end; // hard cut
    }

    chunks.push(cleaned.slice(start, breakAt).trim());
    start = breakAt - overlap;
    if (start < 0) start = 0;
  }

  return chunks.filter((c) => c.length > 50);
}

/** Detect a chapter heading from the first line of a chunk */
function detectChapter(chunk, index) {
  const firstLine = chunk.split("\n")[0].trim();
  // Chapter headings are typically short and start with "Chapter", a number, or ALL CAPS
  if (
    firstLine.length < 80 &&
    (/^chapter\s+\d+/i.test(firstLine) ||
      /^(part|section)\s+\d+/i.test(firstLine) ||
      /^\d+[\.\s]/.test(firstLine) ||
      (firstLine === firstLine.toUpperCase() && firstLine.length > 3 && firstLine.length < 60))
  ) {
    return firstLine;
  }
  return `Section ${index + 1}`;
}

// ── Supabase insert ────────────────────────────────────────────────────────────
const SB_HEADERS = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal,resolution=ignore-duplicates",
};

async function insertChunks(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/books_content`, {
    method: "POST",
    headers: SB_HEADERS,
    body: JSON.stringify(rows),
  });
  if (!res.ok && res.status !== 201 && res.status !== 204) {
    const body = await res.text();
    throw new Error(`Supabase insert failed (${res.status}): ${body.slice(0, 300)}`);
  }
  return rows.length;
}

// ── Main ───────────────────────────────────────────────────────────────────────
let totalInserted = 0;
let totalSkipped = 0;

for (const book of BOOKS) {
  if (!existsSync(book.file)) {
    console.warn(`\n⚠  File not found, skipping: ${book.file}`);
    totalSkipped++;
    continue;
  }

  console.log(`\n📖  Processing: ${book.title}`);
  console.log(`    File: ${basename(book.file)}`);

  let text;
  try {
    text = await extractPdfText(book.file);
    console.log(`    Extracted ${text.length.toLocaleString()} characters`);
  } catch (err) {
    console.error(`    ERROR extracting PDF: ${err.message}`);
    totalSkipped++;
    continue;
  }

  const chunks = chunkText(text);
  console.log(`    Split into ${chunks.length} chunks`);

  // Derive slug from book title (lowercase, hyphens)
  const bookSlug = book.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Build rows
  const rows = chunks.map((chunk, i) => ({
    book_title: book.title,
    book_slug: bookSlug,
    chapter_title: detectChapter(chunk, i),
    content_text: chunk,
    order_index: i,
  }));

  // Insert in batches of 20
  const BATCH = 20;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    process.stdout.write(`    Inserting chunks ${i + 1}–${Math.min(i + BATCH, rows.length)} / ${rows.length}… `);
    try {
      await insertChunks(batch);
      inserted += batch.length;
      process.stdout.write("✓\n");
    } catch (err) {
      process.stdout.write(`ERROR: ${err.message}\n`);
    }
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`    ✅  ${inserted} chunks imported for "${book.title}"`);
  totalInserted += inserted;
}

console.log(`\n${"─".repeat(50)}`);
console.log(`Total chunks imported : ${totalInserted}`);
console.log(`Books skipped         : ${totalSkipped}`);

if (totalInserted > 0) {
  console.log(`\n✅ Done! Books are now searchable via the get_book_content MCP tool.`);
}
