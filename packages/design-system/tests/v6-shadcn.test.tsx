import * as React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Bold, Home } from "lucide-react";

import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, Card, CardAction, CardDescription, CardHeader, CardTitle,
  Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Toggle, ToggleGroup, ToggleGroupItem, TooltipProvider, resolveChartColor, chartColor,
  Badge, lightTokens, darkTokens, contrastRatio,
} from "@/components/agere-ds";
import { AccountSettings, EmptyProjects, MultiStepForm, OrdersTable, SectionCards, RecentTransactions } from "@/blocks";
import { orders } from "@/blocks/data";
import { expectNoA11yViolations } from "./utils/axe";

const wrap = (ui: React.ReactElement) => render(<TooltipProvider>{ui}</TooltipProvider>);

describe("v7 tokens — Geist neutral base (shadcn variable names kept)", () => {
  it("maps the shadcn theme variables to Geist background-100/200 and gray-1000", () => {
    expect(lightTokens.bg.default).toBe("#ffffff"); // Geist background-100
    expect((lightTokens.bg as any).muted).toBe("#fafafa"); // Geist background-200
    expect(lightTokens.brand.default).toBe("#171717"); // Geist gray-1000
    expect(darkTokens.bg.default).toBe("#0a0a0a"); // Geist dark background-100
    expect((darkTokens.bg as any).surface).toBe("#0a0a0a"); // Geist cards sit on background-100 with a stroke (v6: #171717)
    expect((darkTokens.brand as any).emphasis).toBe("#ffffff"); // hover moves to maximum contrast
  });
  it("ships chart-1…5 in both themes", () => {
    for (const t of [lightTokens, darkTokens]) expect(Object.keys((t as any).chart)).toEqual(["1", "2", "3", "4", "5"]);
  });
  it("sidebar foreground / primary pairs are AA in both themes", () => {
    for (const t of [lightTokens, darkTokens] as any[]) {
      expect(contrastRatio(t.sidebar.fg, t.sidebar.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.sidebar["primary-fg"], t.sidebar.primary)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.sidebar["accent-fg"], t.sidebar.accent)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe("Card anatomy (shadcn)", () => {
  it("puts CardAction in the header's second column", async () => {
    const { container } = render(
      <Card><CardHeader><CardTitle>Revenue</CardTitle><CardDescription>This month</CardDescription><CardAction><Badge variant="outline">+12%</Badge></CardAction></CardHeader></Card>
    );
    const header = container.querySelector('[data-slot="card-header"]')!;
    expect(header.className).toContain("has-[>[data-slot=card-action]]:grid-cols-[1fr_auto]");
    expect(container.querySelector('[data-slot="card"]')!.className).toMatch(/rounded-xl.*py-6|py-6.*rounded-xl/);
    await expectNoA11yViolations(container);
  });
});

describe("Table", () => {
  it("renders column headers with scope and wraps in a scroll container", async () => {
    const { container } = render(
      <Table aria-label="Invoices"><TableHeader><TableRow><TableHead>Invoice</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>INV001</TableCell></TableRow></TableBody></Table>
    );
    expect(screen.getByRole("columnheader", { name: "Invoice" })).toHaveAttribute("scope", "col");
    expect(container.querySelector('[data-slot="table-container"]')!.className).toContain("overflow-x-auto");
    await expectNoA11yViolations(container);
  });
});

describe("Chart color normalisation", () => {
  it("wraps shadcn v4 theme vars for Tailwind 3 channel tokens; passes other colors through", () => {
    expect(resolveChartColor("var(--chart-1)")).toBe("hsl(var(--chart-1))");
    expect(resolveChartColor("var(--primary)")).toBe("hsl(var(--primary))");
    expect(resolveChartColor("#2563eb")).toBe("#2563eb");
    expect(resolveChartColor("var(--my-brand)")).toBe("var(--my-brand)");
    expect(chartColor(3)).toBe("hsl(var(--chart-3))");
  });
});

describe("Accordion", () => {
  it("toggles with the keyboard and exposes aria-expanded", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Accordion type="single" collapsible><AccordionItem value="a"><AccordionTrigger>Question</AccordionTrigger><AccordionContent>Answer</AccordionContent></AccordionItem></Accordion>
    );
    const trigger = screen.getByRole("button", { name: "Question" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expectNoA11yViolations(container);
  });
});

describe("Toggle & ToggleGroup", () => {
  it("Toggle exposes aria-pressed; group items carry the group variant", async () => {
    const user = userEvent.setup();
    const { container } = render(<>
      <Toggle aria-label="Bold"><Bold aria-hidden /></Toggle>
      <ToggleGroup type="single" variant="outline" aria-label="Range" defaultValue="7d"><ToggleGroupItem value="7d">7d</ToggleGroupItem><ToggleGroupItem value="30d">30d</ToggleGroupItem></ToggleGroup>
    </>);
    const bold = screen.getByRole("button", { name: "Bold" });
    expect(bold).toHaveAttribute("aria-pressed", "false");
    await user.click(bold);
    expect(bold).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("radio", { name: "30d" })).toHaveAttribute("data-variant", "outline");
    await expectNoA11yViolations(container);
  });
});

describe("Sidebar (shadcn)", () => {
  const Shell = () => (
    <SidebarProvider>
      <Sidebar collapsible="icon" label="Main">
        <SidebarContent><SidebarGroup><SidebarMenu><SidebarMenuItem>
          <SidebarMenuButton isActive tooltip="Home"><Home aria-hidden /><span>Home</span></SidebarMenuButton>
        </SidebarMenuItem></SidebarMenu></SidebarGroup></SidebarContent>
      </Sidebar>
      <SidebarInset><SidebarTrigger /></SidebarInset>
    </SidebarProvider>
  );
  it("collapses with the trigger and with ⌘B / Ctrl+B", async () => {
    const user = userEvent.setup();
    const { container } = wrap(<Shell />);
    const root = container.querySelector('[data-slot="sidebar"]')!;
    expect(root).toHaveAttribute("data-state", "expanded");
    await user.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    expect(root).toHaveAttribute("data-state", "collapsed");
    expect(root).toHaveAttribute("data-collapsible", "icon");
    fireEvent.keyDown(window, { key: "b", ctrlKey: true });
    expect(root).toHaveAttribute("data-state", "expanded");
  });
  it("is a named nav landmark with an active item, and passes axe", async () => {
    const { container } = wrap(<Shell />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("button", { name: "Home" })).toHaveAttribute("data-active", "true");
    await expectNoA11yViolations(container);
  });
  it("renders statically without a provider (v5 AppShell compatibility)", () => {
    const { container } = render(<Sidebar label="Docs"><div>content</div></Sidebar>);
    expect(container.querySelector('[data-slot="sidebar"]')!.className).toContain("bg-sidebar");
    expect(screen.getByRole("navigation", { name: "Docs" })).toBeInTheDocument();
  });
});

describe("Blocks", () => {
  it("SectionCards spell out the trend (not color only)", async () => {
    const { container } = render(<SectionCards />);
    expect(screen.getByLabelText("Down 20 percent")).toBeInTheDocument();
    expect(screen.getByText("Down 20% this period")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
  it("OrdersTable searches, sorts (aria-sort) and selects", async () => {
    const user = userEvent.setup();
    const { container } = wrap(<OrdersTable />);
    const table = screen.getByRole("table", { name: "Orders" });
    expect(within(table).getAllByRole("row")).toHaveLength(1 + 8); // header + one page
    await user.type(screen.getByRole("searchbox", { name: "Search orders" }), "nadia");
    expect(within(table).getAllByRole("row")).toHaveLength(2);
    await user.click(screen.getByRole("checkbox", { name: `Select ${orders[0].id}` }));
    expect(screen.getByText("1 of 1 row(s) selected.")).toBeInTheDocument();
    await user.clear(screen.getByRole("searchbox", { name: "Search orders" }));
    await user.click(screen.getByRole("button", { name: /Sort by customer/ }));
    expect(screen.getByRole("columnheader", { name: /Customer/ })).toHaveAttribute("aria-sort", "ascending");
    await expectNoA11yViolations(container);
  });
  it("AccountSettings validates on submit and focuses the first invalid field", async () => {
    const user = userEvent.setup();
    wrap(<AccountSettings />);
    const name = screen.getByLabelText(/Display name/);
    await user.clear(name);
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveFocus();
    expect(screen.getByText("Enter your display name.")).toBeInTheDocument();
  });
  it("MultiStepForm will not advance past an invalid step", async () => {
    const user = userEvent.setup();
    const { container } = wrap(<MultiStepForm />);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText("Use at least 2 characters.")).toBeInTheDocument();
    await user.type(screen.getByLabelText(/Workspace name/), "agere");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByRole("heading", { name: /Step 2 of 3: Choose a plan/ })).toHaveFocus();
    await expectNoA11yViolations(container);
  });
  it("EmptyProjects and RecentTransactions pass axe", async () => {
    const { container } = wrap(<><EmptyProjects /><RecentTransactions /></>);
    expect(screen.getByRole("heading", { name: "No projects yet" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("Blocks never steal focus on mount", () => {
  it("MultiStepForm leaves focus where it was until the user acts", () => {
    render(<><button>outside</button><MultiStepForm /></>);
    expect(document.body).toHaveFocus();
  });
});

describe("FormField hideLabel", () => {
  it("keeps the accessible name but takes the label wrapper out of the layout", async () => {
    const { FormField, FormControl, Input } = await import("@/components/agere-ds");
    const { container } = render(<FormField label="Email" hideLabel><FormControl><Input /></FormControl></FormField>);
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    expect(container.querySelector("label")!.parentElement!.className).toContain("sr-only");
  });
});
