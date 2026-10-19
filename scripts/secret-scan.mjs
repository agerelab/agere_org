import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const skip = new Set(["node_modules", ".next", "dist"]);
const pattern = /(?:GOCSPX-[A-Za-z0-9_-]{10,}|sk_live_[A-Za-z0-9]+|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|"client_secret"\s*:\s*"[^"]{8,}")/;

function walk(dir, hits) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, hits);
    else if (entry.isFile() && entry.name !== "secret-scan.mjs") {
      const text = fs.readFileSync(full, "utf8");
      if (pattern.test(text)) hits.push(path.relative(root, full));
    }
  }
}

const hits = [];
walk(root, hits);
if (hits.length > 0) {
  console.error("Secret scan failed:");
  for (const hit of hits) console.error(`  ${hit}`);
  process.exit(1);
}
console.log("Secret scan: clean");
