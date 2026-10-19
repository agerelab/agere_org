import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TooltipProvider } from "@/components/agere-ds";
import { EventCalendar, KanbanApp, ProjectTimeline, StoreLocator } from "@/blocks";
import { expectNoA11yViolations } from "./utils/axe";

const wrap = (ui: React.ReactElement) => render(<TooltipProvider>{ui}</TooltipProvider>);

describe("KanbanApp", () => {
  it("renders a column per status, filters by search, and passes axe", async () => {
    const user = userEvent.setup();
    const { container } = wrap(<KanbanApp />);
    expect(screen.getByRole("heading", { name: "Interview platform — Q4" })).toBeInTheDocument();
    expect(screen.getByText("MIMO-201")).toBeInTheDocument();
    await user.type(screen.getByRole("textbox", { name: "Search tasks" }), "consent");
    expect(screen.getByText("1 found")).toBeInTheDocument();
    expect(screen.queryByText("MIMO-201")).toBeNull();
    await expectNoA11yViolations(container);
  });
  it("offers a non-drag way to change status in the card sheet (WCAG 2.5.7)", async () => {
    const user = userEvent.setup();
    wrap(<KanbanApp />);
    await user.click(screen.getByRole("button", { name: "New task" }));
    const sheet = await screen.findByRole("dialog", { name: "Untitled task" });
    expect(within(sheet).getByRole("combobox", { name: "Status" })).toHaveTextContent("To do");
    expect(within(sheet).getByText("Same as dragging the card to another column.")).toBeInTheDocument();
  });
});

describe("EventCalendar", () => {
  it("has a mini date grid, calendar filters and a week view; unchecking a calendar hides its events", async () => {
    const user = userEvent.setup();
    wrap(<EventCalendar />);
    expect(screen.getByRole("group", { name: "My calendars" })).toBeInTheDocument();
    expect(screen.getAllByRole("grid").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Mimo stand-up").length).toBeGreaterThan(0);
    await user.click(screen.getByRole("checkbox", { name: "Meetings" }));
    expect(screen.queryByText("Mimo stand-up")).toBeNull();
  });
  it("New event validates and links the error to its field", async () => {
    const user = userEvent.setup();
    wrap(<EventCalendar />);
    await user.click(screen.getAllByRole("button", { name: "New event" })[0]);
    const dialog = await screen.findByRole("dialog", { name: "New event" });
    await user.click(within(dialog).getByRole("button", { name: "Save event" }));
    const title = within(dialog).getByRole("textbox", { name: "Title" });
    expect(title).toHaveAttribute("aria-invalid", "true");
    expect(title).toHaveAccessibleDescription("Give the event a title.");
    await user.type(title, "Pilot call");
    await user.click(within(dialog).getByRole("button", { name: "Save event" }));
    expect(screen.queryByRole("dialog", { name: "New event" })).toBeNull();
    expect(screen.getAllByText("Pilot call").length).toBeGreaterThan(0);
  });
  it("switches to month view with a live heading", async () => {
    const user = userEvent.setup();
    wrap(<EventCalendar />);
    await user.click(screen.getByRole("radio", { name: "Month" }));
    expect(screen.getByRole("heading", { level: 2, name: "September 2026" })).toBeInTheDocument();
  });
});

describe("ProjectTimeline", () => {
  it("shows the gantt, milestones as a list and a status legend; passes axe", async () => {
    const { container } = wrap(<ProjectTimeline />);
    expect(screen.getByRole("heading", { name: "Mimo Q4 timeline" })).toBeInTheDocument();
    expect(within(screen.getByRole("list", { name: "Milestones" })).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Beta to 5 pilot companies")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("StoreLocator", () => {
  it("lists branches by real distance from Surabaya and shares selection with the map pins", async () => {
    const user = userEvent.setup();
    const { container } = wrap(<StoreLocator />);
    const list = screen.getByRole("list", { name: "Pickup points" });
    const names = within(list).getAllByRole("button").map((b) => b.querySelector("[data-slot=item-title]")!.textContent);
    expect(names[0]).toBe("agere Hub Surabaya");
    expect(names[names.length - 1]).toBe("agere Point Jember"); // ~170 km — the farthest from Surabaya
    const pin = within(screen.getByRole("group", { name: "Pickup points on the map" })).getByRole("button", { name: /agere Point Ngawi, Open now/ });
    await user.click(pin);
    expect(pin).toHaveAttribute("aria-pressed", "true");
    expect(within(list).getByRole("button", { name: /agere Point Ngawi/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: "Directions to agere Point Ngawi (opens Google Maps in a new tab)" })).toHaveAttribute("href", expect.stringContaining("destination=-7.404,111.446"));
    await expectNoA11yViolations(container);
  });
  it("Open now hides closed branches; search narrows", async () => {
    const user = userEvent.setup();
    wrap(<StoreLocator />);
    await user.click(screen.getByRole("button", { name: "Open now" }));
    expect(screen.getByText(/^5 of 7/)).toBeInTheDocument();
    await user.type(screen.getByRole("textbox", { name: "Search pickup points" }), "malang");
    expect(screen.getByText(/^1 of 7/)).toBeInTheDocument();
  });
});

describe("Kanban module regression (found by KanbanApp)", () => {
  it("an empty column is not an empty ARIA list, and still names itself with its count", async () => {
    const { Kanban, KanbanBoard, KanbanColumn } = await import("@/components/agere-ds");
    const { container } = render(
      <Kanban columns={[{ id: "a", title: "Doing", cards: [{ id: "c1", title: "One" }] }, { id: "b", title: "Done", cards: [] }]}>
        <KanbanBoard><KanbanColumn columnId="a" /><KanbanColumn columnId="b" /></KanbanBoard>
      </Kanban>
    );
    const empty = screen.getByRole("region", { name: "Done column, 0 cards" });
    expect(within(empty).queryByRole("list")).toBeNull();
    expect(within(screen.getByRole("region", { name: "Doing column, 1 card" })).getByRole("list")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("Regressions found in the v6.3 browser pass", () => {
  it("checked checkboxes keep their primary fill in dark mode (dark:bg-input/10 used to win)", async () => {
    const { Checkbox } = await import("@/components/agere-ds");
    render(<Checkbox checked onCheckedChange={() => {}} aria-label="c" />);
    expect(screen.getByRole("checkbox", { name: "c" }).className).toContain("dark:data-[state=checked]:bg-primary");
  });
  it("FieldControl keeps the control's own data-slot (styling + forced-colors rules depend on it)", async () => {
    const { Field, FieldControl, FieldLabel, Checkbox } = await import("@/components/agere-ds");
    render(<Field><FieldControl><Checkbox /></FieldControl><FieldLabel>Terms</FieldLabel></Field>);
    const cb = screen.getByRole("checkbox", { name: "Terms" });
    expect(cb).toHaveAttribute("data-slot", "checkbox");
    expect(cb).toHaveAttribute("data-field-control");
  });
  it("CalendarTimeGrid defaults to id-ID and accepts a locale", async () => {
    const { CalendarTimeGrid } = await import("@/components/agere-ds");
    const ev = [{ id: "x", title: "Standup", start: "2026-09-25T09:00", end: "2026-09-25T09:30" }];
    const { unmount } = render(<CalendarTimeGrid view="day" date="2026-09-25" events={ev} />);
    expect(screen.getByRole("button", { name: /Standup, 09\.00–09\.30/ })).toBeInTheDocument();
    unmount();
    render(<CalendarTimeGrid view="day" date="2026-09-25" events={ev} locale="en-US" />);
    expect(screen.getByRole("button", { name: /Standup, 09:00\s?AM–09:30\s?AM/ })).toBeInTheDocument();
  });
});
