import * as React from "react";
import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TooltipProvider } from "@/components/agere-ds";
import { BentoGrid, InboxApp, WorkflowBuilder } from "@/blocks";
import { expectNoA11yViolations } from "./utils/axe";

const wrap = (ui: React.ReactElement) => render(<TooltipProvider>{ui}</TooltipProvider>);

/*
 * react-resizable-panels v4 hit-tests every pointerdown (capture phase) against separator rectangles.
 * jsdom has no layout: every rect is 0×0 at (0,0) — exactly where user-event clicks — so every click would
 * "hit" a separator and be swallowed. Move separators off-screen for these tests only. (Verified in Chromium
 * that tabs/menus inside panels work; see the browser pass in the release notes.)
 */
let rectSpy: ReturnType<typeof vi.spyOn>;
beforeAll(() => {
  const orig = Element.prototype.getBoundingClientRect;
  rectSpy = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    return this.hasAttribute("data-separator") ? new DOMRect(-10000, -10000, 1, 1) : orig.call(this);
  });
});
afterAll(() => rectSpy.mockRestore());

describe("InboxApp", () => {
  it("has named folder nav, message list and reader; selecting a mail opens it and marks it read", async () => {
    const user = userEvent.setup();
    const { container } = wrap(<InboxApp />);
    expect(screen.getByRole("navigation", { name: "Mail folders" })).toBeInTheDocument();
    const list = screen.getByRole("list", { name: "Messages" });
    await user.click(within(list).getByRole("button", { name: /Raka Pratama/ }));
    expect(screen.getByRole("heading", { level: 2, name: "Clinic portal — booking bug on iOS" })).toBeInTheDocument();
    expect(within(list).getByRole("button", { name: /Raka Pratama/ })).toHaveAttribute("aria-current", "true");
    expect(screen.getAllByRole("separator", { name: /Resize/ })).toHaveLength(2);
    await expectNoA11yViolations(container);
  });
  it("Unread tab filters, search narrows, and the count is announced", async () => {
    const user = userEvent.setup();
    wrap(<InboxApp />);
    await user.click(screen.getByRole("radio", { name: /Unread/ }));
    expect(within(screen.getByRole("list", { name: "Messages" })).getAllByRole("listitem")).toHaveLength(1); // m1 was opened (read) on mount
    await user.click(screen.getByRole("radio", { name: "All" }));
    await user.type(screen.getByRole("searchbox", { name: "Search mail" }), "invoices");
    expect(screen.getByText("1 messages")).toBeInTheDocument();
  });
  it("offers the same actions via right-click and the visible ⋯ menu", async () => {
    const user = userEvent.setup();
    wrap(<InboxApp />);
    const item = within(screen.getByRole("list", { name: "Messages" })).getByRole("button", { name: /Sekar Ayu/ });
    fireEvent.contextMenu(item);
    const ctx = await screen.findByRole("menu");
    const ctxItems = within(ctx).getAllByRole("menuitem").map((m) => m.textContent?.replace(/[A-Z#]$/, "").trim());
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Actions for “Branch rollout: week 3 summary”" }));
    const dd = await screen.findByRole("menu");
    const ddItems = within(dd).getAllByRole("menuitem").map((m) => m.textContent?.replace(/[A-Z#]$/, "").trim());
    expect(ddItems).toEqual(ctxItems);
    await user.click(within(dd).getByRole("menuitem", { name: /Archive/ }));
    expect(within(screen.getByRole("list", { name: "Messages" })).queryByRole("button", { name: /Sekar Ayu/ })).toBeNull();
  });
});

describe("WorkflowBuilder", () => {
  it("renders an ordered list of steps with a menubar and a step inspector", async () => {
    const { container } = wrap(<WorkflowBuilder />);
    expect(screen.getByRole("menubar", { name: "Workflow" })).toBeInTheDocument();
    const steps = within(screen.getByRole("list", { name: "Workflow steps" })).getAllByRole("listitem");
    expect(steps).toHaveLength(5);
    expect(screen.getByRole("complementary", { name: "Step settings" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
  it("adds a step via the + popover and announces it", async () => {
    const user = userEvent.setup();
    wrap(<WorkflowBuilder />);
    await user.click(screen.getByRole("button", { name: "Add a step after “Invite to interview”" }));
    await user.keyboard("email");
    await user.click(await screen.findByRole("option", { name: /Send email/ }));
    expect(within(screen.getByRole("list", { name: "Workflow steps" })).getAllByRole("listitem")).toHaveLength(6);
    expect(screen.getByText("Send email added as step 4")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Step 4 · Send email/ })).toBeInTheDocument();
  });
  it("blocks a test run while a step is incomplete and points to it", async () => {
    const user = userEvent.setup();
    wrap(<WorkflowBuilder />);
    await user.click(screen.getByRole("button", { name: "Add a step after “Invite to interview”" }));
    await user.click(await screen.findByRole("option", { name: /Notify channel/ }));
    expect(screen.getByRole("switch", { name: "Active" })).toBeDisabled();
    expect(screen.getByText("This step needs content before it can run.")).toBeInTheDocument();
  });
  it("the trigger (step 1) cannot be deleted or moved", async () => {
    const user = userEvent.setup();
    wrap(<WorkflowBuilder />);
    await user.click(screen.getByRole("button", { name: /Actions for step 1,/ }));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getByRole("menuitem", { name: /Delete step/ })).toHaveAttribute("aria-disabled", "true");
    expect(within(menu).getByRole("menuitem", { name: /Move down/ })).toHaveAttribute("aria-disabled", "true");
  });
});

describe("BentoGrid", () => {
  it("is a list of named feature tiles with one heading each", async () => {
    const { container } = wrap(<BentoGrid />);
    const tiles = [...screen.getByRole("list", { name: "Features" }).children];
    expect(tiles).toHaveLength(7);
    for (const t of tiles) expect(t).toHaveAccessibleName();
    expect(screen.getByRole("region", { name: "Illustration samples" })).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getByRole("figure", { name: /Screens shipped per month/ })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
