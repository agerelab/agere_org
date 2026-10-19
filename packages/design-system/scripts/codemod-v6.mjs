#!/usr/bin/env node
/**
 * Agere DS v5 → v6 codemod — Button variant names move to shadcn/ui semantics.
 *
 *   v5 (cal.com)            v6 (shadcn)
 *   primary            →    default
 *   secondary          →    outline              (bordered button; v6 `secondary` = filled gray)
 *   minimal            →    ghost
 *   destructive        →    destructive-outline  (bordered red; v6 `destructive` = solid red)
 *   destructive-solid  →    destructive
 *
 * Only touches <Button>, <IconButton>, <ButtonGroup> (and any tag listed in --tags) plus
 * buttonVariants({ variant: "…" }) calls. Badge / Tabs / Card variants are left alone.
 *
 * Usage:  node scripts/codemod-v6.mjs [--dry] [--tags=MyButton,LinkButton] <dir|file>…
 */
import fs from "node:fs";
import path from "node:path";

const MAP = { primary: "default", secondary: "outline", minimal: "ghost", destructive: "destructive-outline", "destructive-solid": "destructive" };
const args = process.argv.slice(2);
const dry = args.includes("--dry");
const extra = (args.find((a) => a.startsWith("--tags=")) ?? "--tags=").slice(7).split(",").filter(Boolean);
const TAGS = ["Button", "IconButton", "ButtonGroup", ...extra];
const roots = args.filter((a) => !a.startsWith("--"));
if (!roots.length) roots.push("src");

function walk(p, out = []) {
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    if (/node_modules|dist|\.git/.test(p)) return out;
    for (const f of fs.readdirSync(p)) walk(path.join(p, f), out);
  } else if (/\.(tsx|jsx|ts|js|mdx)$/.test(p)) out.push(p);
  return out;
}

/** Return [start, end) of every opening tag for the given component names (brace-aware). */
function openingTags(src) {
  const re = new RegExp(`<(${TAGS.join("|")})(?=[\\s/>])`, "g");
  const spans = [];
  let m;
  while ((m = re.exec(src))) {
    let i = m.index + m[0].length, depth = 0, quote = null;
    for (; i < src.length; i++) {
      const c = src[i];
      if (quote) { if (c === quote && src[i - 1] !== "\\") quote = null; continue; }
      if (c === '"' || c === "'" || c === "`") { if (depth > 0 || c !== "`") quote = c; continue; }
      if (c === "{") depth++;
      else if (c === "}") depth--;
      else if (c === ">" && depth === 0) { i++; break; }
    }
    spans.push([m.index, i]);
  }
  return spans;
}

let files = 0, edits = 0;
for (const file of roots.flatMap((r) => walk(r))) {
  const src = fs.readFileSync(file, "utf8");
  let out = "", last = 0, n = 0;
  for (const [a, b] of openingTags(src)) {
    const tag = src.slice(a, b).replace(/\bvariant=(["'])([a-z-]+)\1/g, (full, q, v) => (MAP[v] ? (n++, `variant=${q}${MAP[v]}${q}`) : full));
    out += src.slice(last, a) + tag;
    last = b;
  }
  out += src.slice(last);
  out = out.replace(/(buttonVariants\(\{[^}]*?variant:\s*)(["'])([a-z-]+)\2/g, (full, pre, q, v) => (MAP[v] ? (n++, `${pre}${q}${MAP[v]}${q}`) : full));
  if (n) {
    files++; edits += n;
    if (!dry) fs.writeFileSync(file, out);
    console.log(`${dry ? "[dry] " : ""}${file}: ${n}`);
  }
}
console.log(`\n${dry ? "Would update" : "Updated"} ${edits} variant(s) in ${files} file(s).`);
