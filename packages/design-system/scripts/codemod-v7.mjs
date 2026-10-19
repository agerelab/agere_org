#!/usr/bin/env node
/**
 * agere DS v6.x → v7 codemod. Run `codemod:v6` first if the code still uses v5 names
 * (v5 `secondary` meant the bordered button; this codemod deliberately leaves `secondary` alone).
 *
 *   Rewrites (inside <Button>, <IconButton>, <ButtonGroup> and buttonVariants({ … })):
 *     variant="primary" → "default" · "minimal" → "ghost" · "destructive-solid" → "destructive" · "accent" → "outline"
 *     startIcon → leadingIcon · endIcon → trailingIcon            (Button family only; DropdownMenuItem/Badge keep startIcon)
 *   Rewrites (anywhere):
 *     data-contrast="shadcn" → "geist"   ·   [data-contrast="shadcn"] → [data-contrast="geist"]
 *   Reports (no edit) — v7 changes control heights to 32 / 40 / 48:
 *     Button/Input/IconButton with an h-9 / size-9 override (the old 36 px default)
 *     size="lg" on Button/Input (40 → 48 px) inside toolbars, table rows or fixed-height headers
 *
 * Usage:  node scripts/codemod-v7.mjs [--dry] [--tags=MyButton] <dir|file>…
 */
import fs from "node:fs";
import path from "node:path";

const VARIANTS = { primary: "default", minimal: "ghost", "destructive-solid": "destructive", accent: "outline" };
const args = process.argv.slice(2);
const dry = args.includes("--dry");
const extra = (args.find((a) => a.startsWith("--tags=")) ?? "--tags=").slice(7).split(",").filter(Boolean);
const BUTTONS = ["Button", "IconButton", "ButtonGroup", ...extra];
const SIZED = [...BUTTONS, "Input", "SearchInput"];
const roots = args.filter((a) => !a.startsWith("--"));
if (!roots.length) roots.push("src");

function walk(p, out = []) {
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    if (/node_modules|dist|\.git|\.next|storybook-static/.test(p)) return out;
    for (const f of fs.readdirSync(p)) walk(path.join(p, f), out);
  } else if (/\.(tsx|jsx|ts|js|mdx|css|html)$/.test(p)) out.push(p);
  return out;
}

/** [start, end) of every opening tag for the given names (brace- and quote-aware; same scanner as codemod-v6). */
function openingTags(src, tags) {
  const re = new RegExp(`<(${tags.join("|")})(?=[\\s/>])`, "g");
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
    spans.push([m.index, i, m[1]]);
  }
  return spans;
}
const lineOf = (src, idx) => src.slice(0, idx).split("\n").length;

let files = 0, edits = 0;
const notes = [];
for (const file of roots.flatMap((r) => walk(r))) {
  const src = fs.readFileSync(file, "utf8");
  let n = 0, out = "", last = 0;
  for (const [a, b] of openingTags(src, BUTTONS)) {
    const tag = src.slice(a, b)
      .replace(/\bvariant=(["'])([a-z-]+)\1/g, (full, q, v) => (VARIANTS[v] ? (n++, `variant=${q}${VARIANTS[v]}${q}`) : full))
      .replace(/\bstartIcon=/g, () => (n++, "leadingIcon="))
      .replace(/\bendIcon=/g, () => (n++, "trailingIcon="));
    out += src.slice(last, a) + tag;
    last = b;
  }
  out += src.slice(last);
  out = out
    .replace(/(buttonVariants\(\{[^}]*?variant:\s*)(["'])([a-z-]+)\2/g, (full, pre, q, v) => (VARIANTS[v] ? (n++, `${pre}${q}${VARIANTS[v]}${q}`) : full))
    .replace(/data-contrast=(["'])shadcn\1/g, (f, q) => (n++, `data-contrast=${q}geist${q}`))
    .replace(/\[data-contrast=(["'])shadcn\1\]/g, (f, q) => (n++, `[data-contrast=${q}geist${q}]`))
    .replace(/(dataset\.contrast\s*=\s*)(["'])shadcn\2/g, (f, pre, q) => (n++, `${pre}${q}geist${q}`));
  for (const [a, b, name] of openingTags(out, SIZED)) {
    const tag = out.slice(a, b);
    if (/className=[^>]*\b(h-9|size-9|min-h-9)\b/.test(tag)) notes.push(`${file}:${lineOf(out, a)}  <${name}> pins the 6.x 36px height (h-9); v7 default is 40px — keep only if the layout really needs 36px`);
    else if (/\bsize=(["'])lg\1/.test(tag)) notes.push(`${file}:${lineOf(out, a)}  <${name} size="lg"> grows 40 → 48px in v7 — check toolbars, table rows and fixed-height headers`);
  }
  if (n) {
    files++; edits += n;
    if (!dry) fs.writeFileSync(file, out);
    console.log(`${dry ? "[dry] " : ""}${file}: ${n}`);
  }
}
for (const x of notes) console.log(`review  ${x}`);
console.log(`\n${dry ? "Would update" : "Updated"} ${edits} occurrence(s) in ${files} file(s); ${notes.length} height(s) to review.`);
