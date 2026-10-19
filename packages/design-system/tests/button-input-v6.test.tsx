import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChevronDown, Plus } from "lucide-react";

import { Button, ButtonGroup, Input, SearchInput, fieldVariants } from "@/components/agere-ds";
import { expectNoA11yViolations } from "./utils/axe";

describe("Input sizes (v7: md 40 default / lg 48, Geist)", () => {
  it("defaults to md = h-10 with 16px text on mobile, 14px from md; lg = h-12 at 16px", () => {
    render(<><Input aria-label="default" /><Input aria-label="lg" size="lg" /></>);
    const def = screen.getByLabelText("default").className;
    expect(def).toContain("h-10");
    expect(def).toContain("text-base");
    expect(def).toContain("md:text-sm");
    expect(screen.getByLabelText("lg").className).toContain("h-12");
  });
  it("uses the shadcn field anatomy: border-input, shadow-xs, rounded-md", () => {
    const cls = fieldVariants();
    for (const c of ["border-input", "shadow-xs", "rounded-md", "focus-visible:border-ring", "placeholder:text-muted-foreground"]) expect(cls).toContain(c);
  });
  it("no longer produces a small field", () => {
    // @ts-expect-error — "sm" was removed in v5
    expect(fieldVariants({ size: "sm" })).not.toMatch(/(^|\s)h-7(\s|$)/); // file:h-7 (file-input button) is fine
  });
  it("offsets the leading icon the same at both sizes", () => {
    render(<><SearchInput aria-label="s1" size="lg" /><SearchInput aria-label="s2" /></>);
    expect(screen.getByLabelText("s1").className).toContain("pl-9");
    expect(screen.getByLabelText("s2").className).toContain("pl-9");
  });
});

describe("Button icons", () => {
  it("renders decorative leading and trailing icons around the label", async () => {
    const { container } = render(<Button leadingIcon={<Plus />} trailingIcon={<ChevronDown />}>Export</Button>);
    const btn = screen.getByRole("button", { name: "Export" });
    expect(btn.querySelector('[data-slot="leading-icon"]')).toHaveAttribute("aria-hidden", "true");
    expect(btn.querySelector('[data-slot="trailing-icon"]')).toHaveAttribute("aria-hidden", "true");
    expect(btn.firstElementChild).toHaveAttribute("data-slot", "leading-icon");
    expect(btn.lastElementChild).toHaveAttribute("data-slot", "trailing-icon");
    await expectNoA11yViolations(container);
  });
  it("keeps startIcon / endIcon working as deprecated aliases", () => {
    render(<Button startIcon={<Plus />} endIcon={<ChevronDown />}>Legacy</Button>);
    const btn = screen.getByRole("button", { name: "Legacy" });
    expect(btn.querySelector('[data-slot="leading-icon"]')).not.toBeNull();
    expect(btn.querySelector('[data-slot="trailing-icon"]')).not.toBeNull();
  });
  it("loading replaces the leading icon with a spinner", () => {
    render(<Button loading leadingIcon={<Plus />}>Saving…</Button>);
    const btn = screen.getByRole("button", { name: /Saving/ });
    expect(btn.querySelector('[data-slot="leading-icon"] svg.animate-spin')).not.toBeNull();
  });
});

describe("ButtonGroup", () => {
  it("is a labelled group that passes size and variant to its buttons", async () => {
    const { container } = render(
      <ButtonGroup aria-label="Range" variant="outline" size="sm">
        <Button>Day</Button><Button>Week</Button><Button variant="default">Month</Button>
      </ButtonGroup>
    );
    const group = screen.getByRole("group", { name: "Range" });
    expect(group).toHaveAttribute("data-attached", "true");
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute("data-variant", "outline");
    expect(screen.getByRole("button", { name: "Day" }).className).toContain("h-8");
    expect(screen.getByRole("button", { name: "Month" })).toHaveAttribute("data-variant", "default"); // own prop wins
    await expectNoA11yViolations(container);
  });
  it("attached groups square the inner corners; spaced groups use a gap", () => {
    render(<>
      <ButtonGroup aria-label="a"><Button>One</Button><Button>Two</Button></ButtonGroup>
      <ButtonGroup aria-label="b" attached={false}><Button>Three</Button></ButtonGroup>
      <ButtonGroup aria-label="c" orientation="vertical"><Button>Four</Button></ButtonGroup>
    </>);
    expect(screen.getByRole("group", { name: "a" }).className).toContain("[&>*:not(:first-child)]:-ml-px");
    expect(screen.getByRole("group", { name: "b" }).className).toContain("gap-2");
    expect(screen.getByRole("group", { name: "c" })).toHaveAttribute("data-orientation", "vertical");
  });
});

describe("Input addon frame", () => {
  it("keeps addon fields at the same outer height as plain fields", () => {
    const { container } = render(<><Input aria-label="plain" /><Input aria-label="addon" addonStart="agere.id/" /></>);
    const frame = container.querySelector('[data-slot="input"][aria-label="addon"]')!.closest("div")!;
    expect(frame.className).toContain("h-10");
    expect(screen.getByLabelText("addon").className).toContain("h-full");
  });
});

describe("Button heights align with Input (v7 = Geist)", () => {
  it("sm 32 · default 40 = Input default · lg 48 = Input lg", () => {
    render(<><Button size="sm">sm</Button><Button>md</Button><Button size="lg">lg</Button><Input aria-label="field" /><Input aria-label="field-lg" size="lg" /></>);
    expect(screen.getByRole("button", { name: "sm" }).className).toContain("h-8");
    expect(screen.getByRole("button", { name: "md" }).className).toContain("h-10");
    expect(screen.getByRole("button", { name: "lg" }).className).toContain("h-12");
    expect(screen.getByLabelText("field").className).toContain("h-10");
    expect(screen.getByLabelText("field-lg").className).toContain("h-12");
  });
});

describe("Button variants (v6 = shadcn names)", () => {
  it("exposes the six shadcn variants plus destructive-outline", async () => {
    const variants = ["default", "secondary", "outline", "ghost", "destructive", "destructive-outline", "link"] as const;
    const { container } = render(<div>{variants.map((v) => <Button key={v} variant={v}>{v}</Button>)}</div>);
    for (const v of variants) expect(screen.getByRole("button", { name: v })).toHaveAttribute("data-variant", v);
    expect(screen.getByRole("button", { name: "default" }).className).toContain("bg-primary");
    expect(screen.getByRole("button", { name: "secondary" }).className).toContain("bg-secondary");
    expect(screen.getByRole("button", { name: "outline" }).className).toContain("border-border");
    expect(screen.getByRole("button", { name: "destructive" }).className).toContain("bg-destructive");
    await expectNoA11yViolations(container);
  });
  it("normalises deprecated v5 names to their v6 equivalent in data-variant", () => {
    render(<><Button variant="primary">p</Button><Button variant="minimal">m</Button><Button variant="destructive-solid">d</Button></>);
    expect(screen.getByRole("button", { name: "p" })).toHaveAttribute("data-variant", "default");
    expect(screen.getByRole("button", { name: "m" })).toHaveAttribute("data-variant", "ghost");
    expect(screen.getByRole("button", { name: "d" })).toHaveAttribute("data-variant", "destructive");
  });
  it("defaults to the default variant at 40px", () => {
    render(<Button>Save</Button>);
    const b = screen.getByRole("button", { name: "Save" });
    expect(b).toHaveAttribute("data-variant", "default");
    expect(b.className).toContain("h-10");
  });
});
