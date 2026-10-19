import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "apps/web");
const hex = /#[0-9a-fA-F]{3,8}\b/;
const palette = /\b(?:bg|text|border|fill|ring)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;

function files(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...files(full));
    else if (/\.(tsx|ts|css)$/.test(entry.name)) found.push(full);
  }
  return found;
}

const hits = [];
for (const file of files(root)) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    if (hex.test(line) || palette.test(line)) hits.push(`${path.relative(root, file)}:${index + 1}`);
  });
}

if (hits.length > 0) {
  console.error("Use Agere DS semantic tokens, not hex or Tailwind palette classes:");
  for (const hit of hits) console.error(`  ${hit}`);
  process.exit(1);
}
console.log("UI token check: clean");
