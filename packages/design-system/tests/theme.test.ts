import { describe, expect, it } from "vitest";
import { applyBrandColor, contrastRatio, hexToHslChannels } from "@/lib/theme";

describe("theme runtime", () => {
  it("computes WCAG contrast", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
    expect(contrastRatio("#111827", "#ffffff")).toBeGreaterThan(17);
  });
  it("converts hex to HSL channels", () => {
    expect(hexToHslChannels("#ffffff")).toBe("0.0 0.0% 100.0%");
  });
  it("applyBrandColor picks accessible text and reports AA", () => {
    const el = document.createElement("div");
    const dark = applyBrandColor(el, "#4f46e5");
    expect(dark.foreground).toBe("#ffffff");
    expect(dark.passesAA).toBe(true);
    expect(el.style.getPropertyValue("--ag-brand-default")).toContain("%");
    const light = applyBrandColor(el, "#fde047");
    expect(light.foreground).toBe("#000000");
    expect(light.canvasContrast).toBeLessThan(3);
    expect(light.passesAA).toBe(false);
  });
});
