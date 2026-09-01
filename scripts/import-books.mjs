/**
 * Import book content from supabase/books_content.sql into the books_content table.
 *
 * The SQL file should contain INSERT statements like:
 *   INSERT INTO public.books_content (book_title, chapter_title, content_text, order_index)
 *   VALUES ('Book Title', 'Chapter 1', 'Full chapter text...', 0);
 *
 * Usage: node scripts/import-books.mjs [path/to/books_content.sql]
 * Default SQL file: supabase/books_content.sql
 *
 * Requires .env to contain SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dir, "..");

// ── Load .env ────────────────────────────────────────────────────────────────
const envPath = resolve(rootDir, ".env");
const envText = readFileSync(envPath, "utf8");
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

// ── Resolve SQL file path ─────────────────────────────────────────────────────
const sqlArg = process.argv[2];
const sqlPath = sqlArg
  ? resolve(process.cwd(), sqlArg)
  : resolve(rootDir, "supabase", "books_content.sql");

if (!existsSync(sqlPath)) {
  console.error(`SQL file not found: ${sqlPath}`);
  console.error("Create supabase/books_content.sql or pass a path as the first argument.");
  process.exit(1);
}

const sql = readFileSync(sqlPath, "utf8");
console.log(`Reading SQL from: ${sqlPath}`);
console.log(`File size: ${(sql.length / 1024).toFixed(1)} KB\n`);

// ── Execute via Supabase SQL API (service role) ───────────────────────────────
async function runSQL(statement) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: statement }),
  });

  // Supabase doesn't expose a generic exec_sql RPC by default — use the pg endpoint
  if (res.status === 404) {
    return { notSupported: true };
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SQL error (${res.status}): ${text}`);
  }
  return res.json().catch(() => ({}));
}

// Try the Supabase Management API SQL endpoint instead
async function runSQLViaManagementAPI(statement) {
  // Extract project ref from SUPABASE_URL: https://<ref>.supabase.co
  const match = SUPABASE_URL.match(/https?:\/\/([^.]+)\.supabase\.co/);
  if (!match) throw new Error("Could not parse project ref from SUPABASE_URL");
  const projectRef = match[1];

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: statement }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Management API error (${res.status}): ${text}`);
  }
  return res.json().catch(() => ({}));
}

// ── Parse SQL into individual statements ──────────────────────────────────────
function parseStatements(sql) {
  // Split on semicolons that are NOT inside single-quoted strings
  const statements = [];
  let current = "";
  let inString = false;
  let i = 0;

  while (i < sql.length) {
    const ch = sql[i];

    if (ch === "'" && sql[i - 1] !== "\\") {
      // Check for escaped quote ''
      if (inString && sql[i + 1] === "'") {
        current += "''";
        i += 2;
        continue;
      }
      inString = !inString;
    }

    if (ch === ";" && !inString) {
      const stmt = current.trim();
      if (stmt && !stmt.startsWith("--")) {
        statements.push(stmt + ";");
      }
      current = "";
    } else {
      current += ch;
    }
    i++;
  }

  // Catch any trailing statement without semicolon
  const last = current.trim();
  if (last && !last.startsWith("--")) statements.push(last);

  return statements.filter((s) => s.replace(/^--.*/gm, "").trim().length > 1);
}

const statements = parseStatements(sql);
console.log(`Found ${statements.length} SQL statement(s) to execute.\n`);

if (statements.length === 0) {
  console.log("Nothing to execute.");
  process.exit(0);
}

// ── Show preview of what will be inserted ────────────────────────────────────
const insertCount = statements.filter((s) => /^INSERT/i.test(s.trim())).length;
console.log(`  INSERT statements: ${insertCount}`);
console.log(`  Other statements : ${statements.length - insertCount}\n`);

// ── Run each statement via the pg REST endpoint ───────────────────────────────
// Supabase exposes /rest/v1/ for table ops but not raw SQL.
// We use the Postgres REST endpoint which accepts raw SQL from service_role.
async function execStatement(stmt) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      "X-Supabase-Direct": "true",
    },
    body: JSON.stringify({ query: stmt }),
  });
  return res;
}

// Supabase doesn't support raw SQL via REST — we need to use the JS client.
// Fall back to individual inserts via the REST API if the SQL is INSERT statements.

console.log("Parsing INSERT statements to import via Supabase REST API...\n");

const SB_HEADERS = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal,resolution=ignore-duplicates",
};

// Parse VALUES from INSERT INTO books_content ... VALUES (...)
function parseInsertValues(stmt) {
  // Match: INSERT INTO ... (col1, col2, ...) VALUES ('val1', 'val2', ...) [, ...]
  const colMatch = stmt.match(/INSERT\s+INTO\s+\S+\s*\(([^)]+)\)/i);
  if (!colMatch) return null;

  const columns = colMatch[1].split(",").map((c) => c.trim().replace(/^"|"$/g, "").replace(/^`|`$/g, ""));

  // Extract all VALUES tuples
  const valuesSection = stmt.replace(/.*VALUES\s*/is, "").replace(/;?\s*$/, "");
  const rows = [];

  // Parse each tuple
  let i = 0;
  while (i < valuesSection.length) {
    if (valuesSection[i] === "(") {
      // Read until matching closing paren, respecting quoted strings
      let j = i + 1;
      let depth = 1;
      let inStr = false;
      while (j < valuesSection.length && depth > 0) {
        const c = valuesSection[j];
        if (c === "'" && !inStr) inStr = true;
        else if (c === "'" && inStr) {
          if (valuesSection[j + 1] === "'") { j++; } // escaped ''
          else inStr = false;
        }
        if (!inStr) {
          if (c === "(") depth++;
          else if (c === ")") depth--;
        }
        j++;
      }
      const tuple = valuesSection.slice(i + 1, j - 1);
      rows.push(parseTuple(tuple, columns));
      i = j;
    } else {
      i++;
    }
  }
  return rows;
}

function parseTuple(tuple, columns) {
  const values = [];
  let current = "";
  let inStr = false;
  let i = 0;

  while (i < tuple.length) {
    const c = tuple[i];
    if (c === "'" && !inStr) {
      inStr = true;
      i++;
      continue;
    }
    if (c === "'" && inStr) {
      if (tuple[i + 1] === "'") {
        current += "'";
        i += 2;
        continue;
      }
      inStr = false;
      i++;
      continue;
    }
    if (c === "," && !inStr) {
      values.push(parseValue(current.trim()));
      current = "";
      i++;
      continue;
    }
    current += c;
    i++;
  }
  values.push(parseValue(current.trim()));

  const row = {};
  columns.forEach((col, idx) => {
    row[col] = values[idx] ?? null;
  });
  return row;
}

function parseValue(v) {
  if (v === "NULL" || v === "null") return null;
  if (/^-?\d+$/.test(v)) return parseInt(v, 10);
  if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v);
  return v; // already unquoted by parseTuple
}

let imported = 0;
let skipped = 0;
let errors = 0;

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  const isInsert = /^INSERT\s+INTO\s+public\.books_content/i.test(stmt.trim());

  if (!isInsert) {
    console.log(`[${i + 1}/${statements.length}] Skipping non-INSERT statement.`);
    skipped++;
    continue;
  }

  const rows = parseInsertValues(stmt);
  if (!rows || rows.length === 0) {
    console.warn(`[${i + 1}/${statements.length}] Could not parse INSERT — skipping.`);
    skipped++;
    continue;
  }

  process.stdout.write(`[${i + 1}/${statements.length}] Inserting ${rows.length} row(s) into books_content… `);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/books_content`, {
      method: "POST",
      headers: SB_HEADERS,
      body: JSON.stringify(rows.length === 1 ? rows[0] : rows),
    });

    if (res.ok || res.status === 201 || res.status === 204) {
      console.log("✓");
      imported += rows.length;
    } else {
      const body = await res.text();
      console.log(`ERROR (${res.status}): ${body.slice(0, 200)}`);
      errors++;
    }
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    errors++;
  }
}

console.log(`\n─────────────────────────────────────`);
console.log(`Rows imported : ${imported}`);
console.log(`Statements skipped: ${skipped}`);
console.log(`Errors       : ${errors}`);

if (errors > 0) {
  console.log("\nSome rows failed. Check that:");
  console.log("  1. The books_content table exists (run supabase/migrations/20260901020000_add_books_content.sql)");
  console.log("  2. Column names in the SQL match: book_title, chapter_title, content_text, order_index");
}
