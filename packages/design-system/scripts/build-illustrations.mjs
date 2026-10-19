#!/usr/bin/env node
/**
 * Exports every state illustration (src/brand/state-illustrations.tsx) to standalone SVG with the
 * CURRENT token hex values, so Figma / static assets never drift from the React source.
 *
 *   assets/illustrations/state/light/<id>.svg
 *   assets/illustrations/state/dark/<id>.svg
 *
 * Illustration only — no titles, descriptions or buttons (those live in <EmptyState>).
 * Run: npm run illustrations  (after npm run tokens)
 */
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "assets/illustrations/state");
const bundle = path.join(root, "node_modules/.cache/agere-state-illustrations.mjs");
fs.mkdirSync(path.dirname(bundle), { recursive: true });

await build({
  stdin: {
    contents: `
      import * as React from "react";
      import { renderToStaticMarkup } from "react-dom/server";
      import { STATE_ILLUSTRATION_LIST } from "@/brand/state-illustrations";
      import { lightTokens } from "@/tokens/generated/light";
      import { darkTokens } from "@/tokens/generated/dark";
      export const items = STATE_ILLUSTRATION_LIST.map((i) => ({ id: i.file, markup: renderToStaticMarkup(React.createElement(i.Component, { size: 320 })) }));
      export { lightTokens, darkTokens };`,
    resolveDir: root,
    loader: "tsx",
  },
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: bundle,
  jsx: "automatic",
  alias: { "@": path.join(root, "src") },
  logLevel: "silent",
  external: ["react", "react-dom"],
});

const { items, lightTokens, darkTokens } = await import(pathToFileURL(bundle).href + `?t=${Date.now()}`);

/** Token path used by the illustration classes → value in a theme. */
const TOKEN = {
  "fg-subtle": (t) => t.fg.subtle,
  "bg-default": (t) => t.bg.default,
  "bg-emphasis": (t) => t.bg.emphasis,
  "brand-accent": (t) => t.brand.accent,
  "brand-accent-subtle": (t) => t.brand["accent-subtle"],
};

function toStandalone(markup, tokens) {
  return (
    markup
      // class="stroke-[hsl(var(--ag-fg-subtle))] fill-[…]" → stroke="#…" fill="#…"
      .replace(/ class="([^"]*)"/g, (_, cls) => {
        const attrs = [];
        for (const c of cls.split(/\s+/)) {
          const m = /^(stroke|fill)-\[hsl\(var\(--ag-([a-z-]+)\)\)\]$/.exec(c);
          if (m && TOKEN[m[2]]) attrs.push(`${m[1]}="${TOKEN[m[2]](tokens)}"`);
        }
        return attrs.length ? " " + attrs.join(" ") : "";
      })
      .replace(/ aria-hidden="true"/, "")
      .replace(/<svg /, '<svg xmlns="http://www.w3.org/2000/svg" ')
      .replace(/ width="[^"]*" height="[^"]*"/, ' width="320" height="220"') + "\n"
  );
}

for (const [theme, tokens] of [["light", lightTokens], ["dark", darkTokens]]) {
  const dir = path.join(outDir, theme);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (const { id, markup } of items) {
    const svg = toStandalone(markup, tokens);
    if (/class=|hsl\(var/.test(svg)) throw new Error(`${id}: unresolved token class`);
    if (/<text/.test(svg)) throw new Error(`${id}: illustrations must not contain text`);
    fs.writeFileSync(path.join(dir, `${id}.svg`), svg);
  }
}
console.log(`✓ ${items.length} state illustrations × 2 themes → assets/illustrations/state/`);
