import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "apps/web");
const textNode = /(?<![=])>\s*[A-Za-zÀ-ÿ]/;
const labelled = /\b(?:aria-label|title|placeholder)=["'][^"']*[A-Za-zÀ-ÿ]/;

function files(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...files(full));
    else if (/\.(tsx|jsx)$/.test(entry.name)) found.push(full);
  }
  return found;
}

const hits = [];
for (const file of files(root)) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.includes("agere-i18n-ignore")) return;
    if (textNode.test(line) || labelled.test(line)) {
      hits.push(`${path.relative(root, file)}:${index + 1}`);
    }
  });
}

if (hits.length > 0) {
  console.error("UI strings must go through t():");
  for (const hit of hits) console.error(`  ${hit}`);
  process.exit(1);
}
console.log("i18n catalog check: clean");
