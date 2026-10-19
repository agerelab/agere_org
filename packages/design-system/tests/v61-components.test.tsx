import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  DateCalendar, DatePicker, DateRangePicker, Combobox, Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandMenuItem,
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, Button,
  InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger,
  NavigationMenuContent, NavigationMenuLink, TooltipProvider, Label,
} from "@/components/agere-ds";
import { expectNoA11yViolations } from "./utils/axe";

const FRUITS = [
  { value: "mango", label: "Mango", keywords: ["mangga"] },
  { value: "salak", label: "Salak" },
  { value: "durian", label: "Durian", disabled: true },
];

describe("Calendar (date grid)", () => {
  it("renders a labelled month grid and selects a day", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { container } = render(<DateCalendar mode="single" month={new Date(2026, 8, 1)} onSelect={onSelect} />);
    const grid = screen.getByRole("grid", { name: /September 2026/ });
    await user.click(within(grid).getByRole("button", { name: /September 15th, 2026/ }));
    expect(onSelect).toHaveBeenCalled();
    expect((onSelect.mock.calls[0][0] as Date).getDate()).toBe(15);
    expect(container.querySelector('[data-slot="calendar"]')).not.toBeNull();
    await expectNoA11yViolations(container);
  });
  it("marks range start/middle/end for styling", () => {
    const { container } = render(<DateCalendar mode="range" month={new Date(2026, 8, 1)} selected={{ from: new Date(2026, 8, 10), to: new Date(2026, 8, 12) }} />);
    expect(container.querySelector('[data-range-start="true"]')).not.toBeNull();
    expect(container.querySelector('[data-range-middle="true"]')).not.toBeNull();
    expect(container.querySelector('[data-range-end="true"]')).not.toBeNull();
  });
});

describe("DatePicker", () => {
  it("puts the value in the trigger's name, opens a calendar, picks and closes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker label="Due date" defaultValue={new Date(2026, 8, 25)} onValueChange={onValueChange} />);
    const trigger = screen.getByRole("button", { name: "Due date: September 25th, 2026" });
    await user.click(trigger);
    const grid = await screen.findByRole("grid");
    await user.click(within(grid).getByRole("button", { name: /September 28th, 2026/ }));
    expect(onValueChange).toHaveBeenCalled();
    expect(screen.queryByRole("grid")).toBeNull();
    expect(screen.getByRole("button", { name: "Due date: September 28th, 2026" })).toBeInTheDocument();
  });
  it("DateRangePicker shows a from–to label", () => {
    render(<DateRangePicker label="Period" defaultValue={{ from: new Date(2026, 8, 1), to: new Date(2026, 8, 7) }} />);
    expect(screen.getByRole("button", { name: "Period: Sep 1, 2026 – Sep 7, 2026" })).toBeInTheDocument();
  });
});

describe("Combobox", () => {
  it("is a combobox that filters (incl. keywords) and selects", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { baseElement } = render(<Combobox aria-label="Fruit" options={FRUITS} onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("mangga");
    expect(screen.getByRole("option", { name: /Mango/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Salak/ })).toBeNull();
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("mango");
    expect(screen.getByRole("combobox", { name: "Fruit: Mango" })).toHaveAttribute("aria-expanded", "false");
    await expectNoA11yViolations(baseElement);
  });
  it("multiple keeps the list open and announces selected options", async () => {
    const user = userEvent.setup();
    render(<Combobox multiple aria-label="Fruits" options={FRUITS} />);
    await user.click(screen.getByRole("combobox", { name: "Fruits" }));
    await user.click(screen.getByRole("option", { name: /Mango/ }));
    await user.click(screen.getByRole("option", { name: /Salak/ }));
    expect(screen.getByRole("option", { name: "Mango, selected" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Fruits: Mango, Salak" })).toBeInTheDocument();
  });
  it("disabled options cannot be picked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox aria-label="Fruit" options={FRUITS} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /Durian/ }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe("Command", () => {
  it("shows the empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(
      <Command label="Menu"><CommandInput placeholder="Type a command" /><CommandList><CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages"><CommandMenuItem>Billing</CommandMenuItem><CommandMenuItem>Settings</CommandMenuItem></CommandGroup></CommandList></Command>
    );
    await user.type(screen.getByPlaceholderText("Type a command"), "zzz");
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });
});

describe("Drawer", () => {
  it("opens as a labelled modal dialog and closes with the close button", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger asChild><Button>Open</Button></DrawerTrigger>
        <DrawerContent>
          <DrawerHeader><DrawerTitle>Move goal</DrawerTitle><DrawerDescription>Set your daily activity goal.</DrawerDescription></DrawerHeader>
          <DrawerFooter><DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose></DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog", { name: "Move goal" });
    expect(dialog).toHaveAccessibleDescription("Set your daily activity goal.");
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await vi.waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});

describe("InputOTP", () => {
  it("is one labelled input with one-time-code autofill; typing fills the slots", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const { container } = render(
      <>
        <Label htmlFor="otp">Verification code</Label>
        <InputOTP id="otp" maxLength={6} onComplete={onComplete}>
          <InputOTPGroup><InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /></InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup><InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} /></InputOTPGroup>
        </InputOTP>
      </>
    );
    const input = screen.getByRole("textbox", { name: "Verification code" });
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
    expect(input).toHaveAttribute("inputmode", "numeric");
    await user.click(input);
    await user.keyboard("123456");
    expect(onComplete).toHaveBeenCalledWith("123456");
    expect(container.querySelectorAll('[data-slot="input-otp-slot"]')[5]).toHaveTextContent("6");
    await expectNoA11yViolations(container);
  });
});

describe("NavigationMenu", () => {
  it("is a nav landmark whose trigger opens a panel of links", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <TooltipProvider>
        <NavigationMenu aria-label="Main">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent><ul><li><NavigationMenuLink href="/mimo">Mimo</NavigationMenuLink></li></ul></NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem><NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink></NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </TooltipProvider>
    );
    const nav = screen.getByRole("navigation", { name: "Main" });
    const trigger = within(nav).getByRole("button", { name: "Products" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByRole("link", { name: "Mimo" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
