import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "apps/api/db/migrations");
const files = fs.readdirSync(dir).filter((name) => name.endsWith(".sql"));
const hits = [];
for (const name of files) {
  const sql = fs.readFileSync(path.join(dir, name), "utf8");
  if (!sql.includes("organization_id")) hits.push(name);
}
if (hits.length > 0) {
  console.error("Every migration must mention organization_id:");
  for (const hit of hits) console.error(`  ${hit}`);
  process.exit(1);
}
console.log(files.length === 0 ? "Migrations: none yet" : `Migrations: ${files.length} checked`);
