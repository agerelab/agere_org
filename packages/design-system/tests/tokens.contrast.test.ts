import { describe, expect, it } from "vitest";
import { lightTokens, darkTokens } from "@/tokens";
import { apcaContrast, contrastRatio } from "@/lib/theme";

/**
 * Automated WCAG audit of the token system. Any token edit that breaks a required
 * pair fails CI before it can reach a component.
 */
const get = (t: any, path: string): string => path.split(".").reduce((o, k) => o[k], t);
/** HSL saturation (0–100) of a #rrggbb colour. */
const saturation = (hex: string): number => {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return 0;
  return ((max - min) / (l > 0.5 ? 2 - max - min : max + min)) * 100;
};

const TEXT: [string, string][] = [
  ["fg.emphasis", "bg.default"], ["fg.default", "bg.default"], ["fg.default", "bg.muted"], ["fg.default", "bg.subtle"],
  ["fg.subtle", "bg.default"], ["fg.subtle", "bg.muted"], ["fg.subtle", "bg.subtle"], ["fg.muted", "bg.default"],
  ["fg.inverted", "bg.inverted"], ["brand.fg", "brand.default"],
  ...(["info", "success", "attention", "error", "special"] as const).flatMap((s) => [
    [`${s}.fg`, `${s}.bg`], [`${s}.fg`, "bg.default"], [`${s}.on-solid`, `${s}.solid`],
  ] as [string, string][]),
];
/** v6.4 — status text on neutral surfaces must pass AA on every neutral canvas. */
const ON_SURFACE: [string, string][] = (["info", "success", "attention", "error", "special"] as const).flatMap((s) =>
  (["bg.default", "bg.muted", "bg.surface"] as const).map((bg) => [`${s}.on-surface`, bg] as [string, string]));
const NON_TEXT: [string, string][] = [
  ["border.control", "bg.default"], ["border.control", "bg.muted"], ["focus.ring", "bg.default"], ["focus.ring", "bg.muted"],
  ["brand.default", "bg.default"],
  ...(["info", "success", "attention", "error"] as const).map((s) => [`${s}.icon`, "bg.default"] as [string, string]),
];

describe.each([["light", lightTokens], ["dark", darkTokens]])("%s theme contrast", (_name, tokens) => {
  it.each(TEXT)("%s on %s ≥ 4.5:1 (WCAG 1.4.3)", (fg, bg) => {
    expect(contrastRatio(get(tokens, fg), get(tokens, bg))).toBeGreaterThanOrEqual(4.5);
  });
  it.each(ON_SURFACE)("%s on %s ≥ 4.5:1 (WCAG 1.4.3)", (fg, bg) => {
    expect(contrastRatio(get(tokens, fg), get(tokens, bg))).toBeGreaterThanOrEqual(4.5);
  });
  it.each(ON_SURFACE.filter(([, bg]) => bg === "bg.default"))("%s keeps its hue (saturation ≥ 40%%) — never collapses to near-white", (fg) => {
    expect(saturation(get(tokens, fg))).toBeGreaterThanOrEqual(40);
  });
  it.each(NON_TEXT)("%s vs %s ≥ 3:1 (WCAG 1.4.11)", (fg, bg) => {
    expect(contrastRatio(get(tokens, fg), get(tokens, bg))).toBeGreaterThanOrEqual(3);
  });
});

/**
 * v7 — APCA gate (AGENTS.md: "prefer APCA"). WCAG 2.1 AA above stays the compliance gate; APCA catches
 * dark-mode text that passes WCAG's ratio but reads weak (WCAG overstates contrast on dark backgrounds).
 * Body copy |Lc| ≥ 60, UI labels and status text |Lc| ≥ 45.
 */
const APCA_BODY: [string, string][] = [
  ["fg.emphasis", "bg.default"], ["fg.default", "bg.default"], ["fg.default", "bg.muted"], ["fg.default", "bg.subtle"],
  ["fg.subtle", "bg.default"], ["fg.subtle", "bg.muted"],
];
const APCA_UI: [string, string][] = [
  ["fg.subtle", "bg.subtle"], ["fg.muted", "bg.default"], ["fg.inverted", "bg.inverted"], ["brand.fg", "brand.default"],
  ...(["info", "success", "attention", "error", "special"] as const).flatMap((s) => [
    [`${s}.fg`, `${s}.bg`], [`${s}.on-solid`, `${s}.solid`], [`${s}.on-surface`, "bg.default"], [`${s}.on-surface`, "bg.muted"],
  ] as [string, string][]),
];
/** v7 — pairs v6.4 did not cover: status text on the subtle fill, task-status chips, the focus ring on subtle fills. */
const V7_TEXT: [string, string][] = [
  ...(["info", "success", "attention", "error", "special"] as const).map((s) => [`${s}.on-surface`, "bg.subtle"] as [string, string]),
  ...(["backlog", "todo", "in-progress", "review", "blocked", "complete"] as const).map((k) => [`task-status.${k}.fg`, `task-status.${k}.bg`] as [string, string]),
  ["sidebar.fg", "sidebar.bg"], ["sidebar.primary-fg", "sidebar.primary"], ["sidebar.accent-fg", "sidebar.accent"],
];
const V7_NON_TEXT: [string, string][] = [["focus.ring", "bg.subtle"], ["border.control", "bg.subtle"], ["sidebar.ring", "sidebar.bg"]];

describe.each([["light", lightTokens], ["dark", darkTokens]])("%s theme · v7 gates", (_name, tokens) => {
  it.each(APCA_BODY)("%s on %s |Lc| ≥ 60 (APCA body)", (fg, bg) => {
    expect(Math.abs(apcaContrast(get(tokens, fg), get(tokens, bg)))).toBeGreaterThanOrEqual(60);
  });
  it.each(APCA_UI)("%s on %s |Lc| ≥ 45 (APCA UI)", (fg, bg) => {
    expect(Math.abs(apcaContrast(get(tokens, fg), get(tokens, bg)))).toBeGreaterThanOrEqual(45);
  });
  it.each(V7_TEXT)("%s on %s ≥ 4.5:1 (WCAG 1.4.3)", (fg, bg) => {
    expect(contrastRatio(get(tokens, fg), get(tokens, bg))).toBeGreaterThanOrEqual(4.5);
  });
  it.each(V7_NON_TEXT)("%s vs %s ≥ 3:1 (WCAG 1.4.11)", (fg, bg) => {
    expect(contrastRatio(get(tokens, fg), get(tokens, bg))).toBeGreaterThanOrEqual(3);
  });
  it("hover moves toward more contrast: brand.emphasis beats brand.default against the page", () => {
    expect(contrastRatio(get(tokens, "brand.emphasis"), get(tokens, "bg.default")))
      .toBeGreaterThan(contrastRatio(get(tokens, "brand.default"), get(tokens, "bg.default")));
  });
});

describe("apcaContrast", () => {
  it("matches the APCA reference values", () => {
    expect(apcaContrast("#000000", "#ffffff")).toBeCloseTo(106.04, 1);
    expect(apcaContrast("#ffffff", "#000000")).toBeCloseTo(-107.88, 1);
    expect(apcaContrast("#888888", "#ffffff")).toBeCloseTo(63.06, 1);
  });
});
