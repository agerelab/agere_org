// v7 — generates AGENTS.md (for coding agents) and GUIDELINES.md (PR review checklist)
// from src/docs/registry/interface-rules.ts, the same data the docs page renders.
// Node 22 strips the TS types natively. `--check` fails if the committed files are stale (CI).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { RULE_GROUPS, allRules, isAutomated } = await import(path.join(root, "src/docs/registry/interface-rules.ts"));
const tag = (by) => by.map((b) => (b.startsWith("lint:") ? b.slice(5) : b)).join(", ");
const all = allRules();
const auto = all.filter(isAutomated).length;

let agents = `# AGENTS.md — agere design system 7

Rules for building agere interfaces with \`@agere/design-system\`. Read before generating or reviewing UI.
MUST and NEVER are blocking; SHOULD needs a stated reason to skip. ${auto} of ${all.length} rules are enforced automatically.

The bracket after each rule says how it is enforced: G01–G12 run in \`npm run lint:guidelines\` (G12 warns);
\`built-in\` means the component or globals.css already does it; \`test\` is asserted in Vitest or \`scripts/verify-browser.py\`;
\`tokens\` is guaranteed by the token build and contrast suite (WCAG 2.1 AA + APCA); \`review\` needs your judgment.

## agere: use the system

- MUST: Build with \`@agere/design-system\` components and semantic tokens. The raw palette is removed from the preset; never hard-code a hex value.
- MUST: Status text on neutral surfaces uses \`*-on-surface\`; text on a status tint uses \`*-fg\`; fills use \`*-solid\` with \`*-on-solid\`, hover \`*-solid-hover\`.
- MUST: Type comes from \`type-*\` composite classes; Geist Sans for UI and text, Geist Mono only for the identifier itself.
- MUST: Control heights: sm 32 · md 40 (default) · lg 48; dense workspace modules follow \`data-density\`.
- MUST: Copy in Bahasa Indonesia uses sentence case, one form of address per product (“kamu” consumer, “Anda” clinical/enterprise), id-ID numbers (1.234,5), Rp with 0 decimals, 24-hour time.
- NEVER: Use \`data-contrast="geist"\` (or the deprecated \`"shadcn"\`) in production; it is outside the AA gate.

Adapted from Vercel's Web Interface Guidelines (github.com/vercel-labs/web-interface-guidelines).

`;
for (const g of RULE_GROUPS) agents += `## ${g.title}\n\n${g.rules.map((r) => `- ${r.level}: ${r.text} [${tag(r.by)}]`).join("\n")}\n\n`;
agents = agents.trimEnd() + "\n";

let guide = `# agere interface review checklist\n\nGenerated from \`src/docs/registry/interface-rules.ts\`. ${auto} of ${all.length} rules are enforced automatically; tick the rest in every UI pull request.\n\n`;
for (const g of RULE_GROUPS) {
  const rs = g.rules.filter((r) => r.by.includes("review"));
  if (rs.length) guide += `## ${g.title}\n\n${rs.map((r) => `- [ ] ${r.level}: ${r.text}`).join("\n")}\n\n`;
}
guide += "## Placeholder backlog (G12)\n\nRun `npm run lint:guidelines -- --warnings` for the current list of authoring fields that still use a placeholder.\n";

const out = { "AGENTS.md": agents, "GUIDELINES.md": guide.trimEnd() + "\n" };
if (process.argv.includes("--check")) {
  const stale = Object.entries(out).filter(([f, c]) => !fs.existsSync(path.join(root, f)) || fs.readFileSync(path.join(root, f), "utf8") !== c).map(([f]) => f);
  if (stale.length) { console.error(`stale: ${stale.join(", ")} — run npm run agents-md`); process.exit(1); }
  console.log("agents-md: up to date");
} else {
  for (const [f, c] of Object.entries(out)) fs.writeFileSync(path.join(root, f), c);
  console.log(`agents-md: AGENTS.md ${all.length} rules (${auto} automated), GUIDELINES.md written`);
}
