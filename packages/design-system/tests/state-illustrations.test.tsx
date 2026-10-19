import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { STATE_ILLUSTRATIONS, STATE_ILLUSTRATION_LIST, StateIllustrationNotFound, EmptyState } from "@/components/agere-ds";
import { expectNoA11yViolations } from "./utils/axe";

const ASSETS = path.resolve(__dirname, "../assets/illustrations/state");

describe("State illustrations", () => {
  it("ships 25 illustrations in 4 groups with stable ids", () => {
    expect(STATE_ILLUSTRATION_LIST).toHaveLength(25);
    expect(Object.keys(STATE_ILLUSTRATIONS)).toHaveLength(25);
    const groups = STATE_ILLUSTRATION_LIST.reduce<Record<string, number>>((a, i) => ({ ...a, [i.group]: (a[i.group] ?? 0) + 1 }), {});
    expect(groups).toEqual({ universal: 13, ledger: 4, education: 4, hiring: 4 });
  });

  it.each(STATE_ILLUSTRATION_LIST.map((i) => [i.id, i.Component] as const))("%s: artwork only (no <text>), token colors, decorative by default", (_id, Component) => {
    const { container } = render(<Component />);
    const svg = container.querySelector("svg")!;
    expect(svg.querySelector("text")).toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg.getAttribute("viewBox")).toBe("0 0 320 220");
    const classes = [...svg.querySelectorAll("[class]")].map((el) => el.getAttribute("class")!).join(" ");
    expect(classes).not.toMatch(/#[0-9a-f]{3,6}/i); // no hard-coded colors
  });

  it("becomes an image with an accessible name when titled", async () => {
    const { container } = render(<StateIllustrationNotFound title="Page not found" />);
    expect(screen.getByRole("img", { name: "Page not found" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it("slots into EmptyState", async () => {
    const { container } = render(<EmptyState illustration={<StateIllustrationNotFound />} title="Page not found" />);
    expect(container.querySelector("svg[aria-hidden]")).not.toBeNull();
    await expectNoA11yViolations(container);
  });

  it("static SVG exports exist for every illustration in both themes and contain no text", () => {
    for (const theme of ["light", "dark"]) {
      for (const { file } of STATE_ILLUSTRATION_LIST) {
        const svg = fs.readFileSync(path.join(ASSETS, theme, `${file}.svg`), "utf8");
        expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
        expect(svg).not.toMatch(/<text|class=|hsl\(var/);
      }
    }
  });
});
