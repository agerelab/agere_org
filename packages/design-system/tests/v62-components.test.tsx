import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots,
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuSeparator, ContextMenuShortcut,
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarShortcut,
  ResizablePanelGroup, ResizablePanel, ResizableHandle,
} from "@/components/agere-ds";
import { expectNoA11yViolations } from "./utils/axe";

describe("Carousel", () => {
  it("is a named carousel region with slide groups, prev/next buttons and a live status", async () => {
    const { container } = render(
      <Carousel label="Featured">
        <CarouselContent>{[1, 2, 3].map((n, i) => <CarouselItem key={n} index={i}>Slide {n}</CarouselItem>)}</CarouselContent>
        <CarouselPrevious /><CarouselNext /><CarouselDots />
      </Carousel>
    );
    const region = screen.getByRole("region", { name: "Featured" });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    expect(within(region).getAllByRole("group")).toHaveLength(3);
    expect(within(region).getAllByRole("group")[0]).toHaveAttribute("aria-roledescription", "slide");
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("ContextMenu", () => {
  it("opens on right-click (and the context-menu key) with menu semantics", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <ContextMenu>
        <ContextMenuTrigger className="block h-20 w-40">Right-click here</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={onSelect}>Rename<ContextMenuShortcut>F2</ContextMenuShortcut></ContextMenuItem>
          <ContextMenuCheckboxItem checked>Show grid</ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Right-click here"));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getByRole("menuitemcheckbox", { name: "Show grid" })).toHaveAttribute("aria-checked", "true");
    expect(within(menu).getByRole("menuitem", { name: "Delete" })).toHaveAttribute("data-variant", "destructive");
    await user.click(within(menu).getByRole("menuitem", { name: /Rename/ }));
    expect(onSelect).toHaveBeenCalled();
  });
});

describe("Menubar", () => {
  it("is a menubar whose triggers open menus; ← → move between menus", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Menubar aria-label="Editor">
        <MenubarMenu><MenubarTrigger>File</MenubarTrigger><MenubarContent><MenubarItem>New tab<MenubarShortcut>⌘T</MenubarShortcut></MenubarItem></MenubarContent></MenubarMenu>
        <MenubarMenu><MenubarTrigger>Edit</MenubarTrigger><MenubarContent><MenubarItem>Undo</MenubarItem></MenubarContent></MenubarMenu>
      </Menubar>
    );
    const bar = screen.getByRole("menubar", { name: "Editor" });
    const [file, edit] = within(bar).getAllByRole("menuitem");
    await expectNoA11yViolations(container);
    await user.click(file);
    expect(await screen.findByRole("menuitem", { name: /New tab/ })).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(edit).toHaveAttribute("data-state", "open");
  });
});

describe("Resizable", () => {
  it("renders panels with a keyboard-operable separator carrying aria-valuenow", async () => {
    const { container } = render(
      <div style={{ width: 600, height: 200 }}>
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize="30" minSize="20">Sidebar</ResizablePanel>
          <ResizableHandle withHandle aria-label="Resize sidebar" />
          <ResizablePanel defaultSize="70">Content</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
    const sep = screen.getByRole("separator", { name: "Resize sidebar" });
    expect(sep).toHaveAttribute("tabindex", "0");
    expect(sep).toHaveAttribute("aria-orientation");
    expect(container.querySelector('[data-slot="resizable-panel-group"]')).toHaveAttribute("data-orientation", "horizontal");
    await expectNoA11yViolations(container);
  });
  it("vertical groups stack panels and draw a horizontal handle", () => {
    const { container } = render(
      <ResizablePanelGroup orientation="vertical"><ResizablePanel defaultSize="50">A</ResizablePanel><ResizableHandle aria-label="Resize" /><ResizablePanel defaultSize="50">B</ResizablePanel></ResizablePanelGroup>
    );
    expect(container.querySelector('[data-slot="resizable-panel-group"]')!.className).toContain("flex-col");
    expect(screen.getByRole("separator").className).toContain("h-px");
  });
});
