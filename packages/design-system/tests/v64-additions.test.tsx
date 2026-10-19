import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PageHeader, PageHeaderActions, PageHeaderContent, PageHeaderTitle, SaveStatus, Toaster, canDrop, getDropZone, moveTreeItem, siblingsOf, type TreeItem } from "@/components/agere-ds";
import { TooltipProvider } from "@/components/ui/tooltip";
import { expectNoA11yViolations } from "./utils/axe";

afterEach(() => vi.restoreAllMocks());

/* A: status column, T: top-level task, s: subtask */
const base = (): (TreeItem & { t: string })[] => [
  { id: "T1", group: "todo", t: "Banner" },
  { id: "s1", parentId: "T1", group: "todo", t: "Blue" },
  { id: "s2", parentId: "T1", group: "doing", t: "Cream" },
  { id: "T2", group: "todo", t: "Moodboard" },
  { id: "T3", group: "doing", t: "Deck" },
];
const ids = (xs: TreeItem[]) => xs.map((x) => x.id);

describe("tree helpers", () => {
  it("getDropZone: 30 / 40 / 30, and before/after only when nesting is not allowed", () => {
    const r = { top: 100, height: 40 };
    expect(getDropZone(105, r, true)).toBe("before");
    expect(getDropZone(120, r, true)).toBe("inside");
    expect(getDropZone(135, r, true)).toBe("after");
    expect(getDropZone(118, r, false)).toBe("before");
    expect(getDropZone(122, r, false)).toBe("after");
  });

  it("canDrop blocks self, own subtree, a second level, and a no-op nest", () => {
    const xs = base();
    expect(canDrop(xs, "T1", { id: "T1", zone: "after" })).toBe(false);
    expect(canDrop(xs, "T1", { id: "s1", zone: "after" })).toBe(false); // into its own subtree
    expect(canDrop(xs, "T1", { id: "T2", zone: "inside" })).toBe(false); // T1 has subtasks → would make level 2
    expect(canDrop(xs, "s1", { id: "T1", zone: "inside" })).toBe(false); // already its parent
    expect(canDrop(xs, "T2", { id: "s1", zone: "inside" })).toBe(false); // subtask of a subtask
    expect(canDrop(xs, "T2", { id: "T1", zone: "inside" })).toBe(true);
    expect(canDrop(xs, "T3", { group: "todo" })).toBe(true);
    expect(canDrop(xs, "nope", { group: "todo" })).toBe(false);
  });

  it("before / after a top-level row reorders and takes that row's group", () => {
    const next = moveTreeItem(base(), "T3", { id: "T1", zone: "before" });
    expect(ids(next)).toEqual(["T3", "T1", "s1", "s2", "T2"]);
    expect(next.find((x) => x.id === "T3")).toMatchObject({ parentId: null, group: "todo" });
  });

  it("inside appends after the parent's last subtask and keeps the moved task's own group", () => {
    const next = moveTreeItem(base(), "T3", { id: "T1", zone: "inside" });
    expect(ids(next)).toEqual(["T1", "s1", "s2", "T3", "T2"]);
    expect(next.find((x) => x.id === "T3")).toMatchObject({ parentId: "T1", group: "doing" });
  });

  it("before / after a subtask makes a sibling subtask without changing its group", () => {
    const next = moveTreeItem(base(), "T2", { id: "s1", zone: "after" });
    expect(ids(next)).toEqual(["T1", "s1", "T2", "s2", "T3"]);
    expect(next.find((x) => x.id === "T2")).toMatchObject({ parentId: "T1", group: "todo" });
  });

  it("dropping on a group header un-nests and appends to the end of that group", () => {
    const next = moveTreeItem(base(), "s1", { group: "doing" });
    expect(next.find((x) => x.id === "s1")).toMatchObject({ parentId: null, group: "doing" });
    expect(ids(next).indexOf("s1")).toBe(ids(next).indexOf("T3") + 1);
  });

  it("returns the same array for an invalid move, and never mutates the input", () => {
    const xs = base();
    const snapshot = JSON.stringify(xs);
    expect(moveTreeItem(xs, "T1", { id: "s2", zone: "before" })).toBe(xs);
    moveTreeItem(xs, "T3", { id: "T1", zone: "inside" });
    expect(JSON.stringify(xs)).toBe(snapshot);
  });

  it("siblingsOf respects parent and, at the top level, the group", () => {
    const xs = base();
    expect(ids(siblingsOf(xs, "T1"))).toEqual(["T1", "T2"]);
    expect(ids(siblingsOf(xs, "s2"))).toEqual(["s1", "s2"]);
  });
});

describe("SaveStatus", () => {
  it("is a polite status with the right copy per state, and no a11y violations", async () => {
    const { container, rerender } = render(<SaveStatus state="saved" />);
    const s = screen.getByRole("status");
    expect(s).toHaveAttribute("aria-live", "polite");
    expect(s).toHaveTextContent("Saved");
    rerender(<SaveStatus state="saving" messages={{ saving: "Menyimpan…" }} />);
    expect(screen.getByRole("status")).toHaveTextContent("Menyimpan…");
    await expectNoA11yViolations(container);
  });

  it("offers Try again only in the error state and only with onRetry", async () => {
    const onRetry = vi.fn();
    const { rerender } = render(<SaveStatus state="saved" onRetry={onRetry} />);
    expect(screen.queryByRole("button")).toBeNull();
    rerender(<SaveStatus state="error" />);
    expect(screen.queryByRole("button")).toBeNull();
    rerender(<SaveStatus state="error" onRetry={onRetry} retryLabel="Coba lagi" />);
    await userEvent.click(screen.getByRole("button", { name: "Coba lagi" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe("Toaster position (6.4)", () => {
  it("defaults to bottom-center, unchanged from 6.3", () => {
    render(<Toaster />);
    const vp = document.querySelector('[data-position]') as HTMLElement;
    expect(vp.dataset.position).toBe("bottom-center");
    expect(vp.className).toContain("left-1/2");
    expect(vp.style.bottom).toBe("");
  });
  it("supports bottom-left with an offset above a SaveBar", () => {
    render(<Toaster position="bottom-left" offset={64} />);
    const vp = document.querySelector('[data-position]') as HTMLElement;
    expect(vp.dataset.position).toBe("bottom-left");
    expect(vp.className).toContain("left-0");
    expect(vp.className).not.toContain("left-1/2");
    expect(vp.style.bottom).toBe("64px");
  });
});

describe("PageHeaderActions dev warning (6.4)", () => {
  const H = (menu: string[]) => (
    <TooltipProvider>
      <PageHeader>
        <PageHeaderContent><PageHeaderTitle>Project</PageHeaderTitle></PageHeaderContent>
        <PageHeaderActions primary={{ label: "New task" }} secondary={[{ label: "Share" }]} menu={menu.map((label) => ({ label }))} />
      </PageHeader>
    </TooltipProvider>
  );
  it("warns when an action is both a button and a ⋯ item", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(H(["Share", "Archive project"]));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"Share" is both a button and a ⋯ item'));
  });
  it("stays silent when every action has one place", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(H(["Project status", "Archive project"]));
    expect(warn).not.toHaveBeenCalled();
  });
});

describe("v7 — deprecation lifecycle step 2 (Warn)", () => {
  it("warns once per deprecated Button variant and icon alias, and still renders the v6 equivalent", async () => {
    const { Button } = await import("@/components/agere-ds");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<><Button variant="primary">a</Button><Button variant="primary">b</Button><Button startIcon={<span />}>c</Button></>);
    const msgs = warn.mock.calls.map((c) => String(c[0]));
    expect(msgs.filter((m) => m.includes('variant="primary"'))).toHaveLength(1);
    expect(msgs.some((m) => m.includes("startIcon is deprecated"))).toBe(true);
    expect(screen.getByRole("button", { name: "a" })).toHaveAttribute("data-variant", "default");
    warn.mockRestore();
  });
});

describe("v7 — AppShell skip link", () => {
  it("moves focus to main without changing the URL (hash routers keep their route)", async () => {
    const { AppShell } = await import("@/components/ui/sidebar");
    window.location.hash = "#/guidelines/interface-rules";
    render(<AppShell sidebar={<nav aria-label="Docs" />}><h1>Interface rules</h1></AppShell>);
    await userEvent.click(screen.getByRole("link", { name: "Skip to content" }));
    expect(window.location.hash).toBe("#/guidelines/interface-rules");
    expect(document.activeElement?.id).toBe("main-content");
  });
});

describe("v7 — no lint annotations rendered as text", () => {
  it("Toaster renders no stray // comment text", () => {
    const { container } = render(<Toaster />);
    expect(container.textContent ?? "").not.toMatch(/agere-guidelines|\/\//);
  });
});
