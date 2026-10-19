import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { expectNoA11yViolations } from "./utils/axe";

import { Logo } from "@/brand/logo";
import { LOGO } from "@/brand/logo-paths";

const svg = (c: HTMLElement) => c.querySelector("svg")!;

describe("Logo (v5 brand masters)", () => {
  it("renders the primary lockup from the master paths at the master aspect ratio", () => {
    const { container } = render(<Logo height={40} />);
    const el = svg(container);
    expect(el.getAttribute("viewBox")).toBe(`0 0 ${LOGO.primary.width} ${LOGO.primary.height}`);
    expect(el.querySelectorAll("path")).toHaveLength(LOGO.primary.paths.length);
    expect(Number(el.getAttribute("width"))).toBeCloseTo((40 * 910.95) / 219.66, 1);
    expect(el.dataset.cut).toBe("regular");
  });

  it("switches to the small-size cut below 24px unless forced", () => {
    const { container, rerender } = render(<Logo height={20} />);
    expect(svg(container).getAttribute("viewBox")).toBe(`0 0 ${LOGO.primarySmall.width} ${LOGO.primarySmall.height}`);
    rerender(<Logo height={20} cut="regular" />);
    expect(svg(container).dataset.cut).toBe("regular");
    rerender(<Logo variant="mark" height={16} />);
    expect(svg(container).getAttribute("viewBox")).toBe(`0 0 ${LOGO.symbolSmall.width} ${LOGO.symbolSmall.height}`);
    rerender(<Logo variant="stacked" height={16} />);
    expect(svg(container).dataset.cut).toBe("regular");
  });

  it.each(["lockup", "stacked", "mark", "wordmark", "app-icon"] as const)("variant %s is a single-colour vector with an accessible name", async (variant) => {
    const { container } = render(<Logo variant={variant} tone="ink" />);
    const el = svg(container);
    expect(el.getAttribute("role")).toBe("img");
    expect(el.querySelector("title")?.textContent).toBe("agere");
    expect(el.querySelector("image, text, linearGradient, filter")).toBeNull();
    const fills = new Set([...el.querySelectorAll("path")].map((p) => p.getAttribute("class")));
    expect(fills.size).toBe(1);
    await expectNoA11yViolations(container);
  });

  it("app icon has a rounded tile and inverted glyph", () => {
    const { container } = render(<Logo variant="app-icon" tone="ink" />);
    const rect = svg(container).querySelector("rect")!;
    expect(rect.getAttribute("rx")).toBe(String(LOGO.appIcon.tileRadius));
    expect(rect.getAttribute("class")).toContain("#111111");
    expect(svg(container).querySelector("path")!.getAttribute("class")).toContain("fill-white");
  });

  it("is hidden from assistive tech when title is empty", () => {
    const { container } = render(<Logo title="" />);
    expect(svg(container).getAttribute("aria-hidden")).toBe("true");
    expect(svg(container).querySelector("title")).toBeNull();
  });
});
