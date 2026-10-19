import * as React from "react";
import { Columns3, GalleryHorizontal, Menu as MenuIcon, MousePointerClick } from "lucide-react";

import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem,
  ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut,
  MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger,
} from "@/components/ui/menubar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import type { ComponentDoc } from "./types";

export const shadcnV62Docs: ComponentDoc[] = [
  {
    id: "carousel", name: "Carousel", category: "Display", level: "Organism", status: "new", icon: GalleryHorizontal,
    summary: "Embla 8 carousel with the APG pattern: named region, “slide n of m” groups, Previous/Next, ←/→, polite live status and optional dots. Never auto-advances.",
    demo: () => (
      <Carousel label="Numbers" className="w-full max-w-xs">
        <CarouselContent>
          {[1, 2, 3, 4, 5].map((n, i) => (
            <CarouselItem key={n} index={i}><div className="grid aspect-square place-items-center rounded-xl border border-border bg-card text-4xl font-semibold">{n}</div></CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious /><CarouselNext /><CarouselDots />
      </Carousel>
    ),
    code: `<Carousel label="Featured products" opts={{ align: "start", loop: true }}>
  <CarouselContent>
    {items.map((it, i) => <CarouselItem key={it.id} index={i} className="basis-1/2 lg:basis-1/3">…</CarouselItem>)}
  </CarouselContent>
  <CarouselPrevious /><CarouselNext /><CarouselDots />
</Carousel>`,
    specs: [["Buttons", "outline · size-8 · rounded-full · outside the track (-left-12 / -right-12)"], ["Gap", "-ml-4 on content, pl-4 on items"], ["Reduced motion", "duration 1 (jump)"]],
    dos: ["Pass `label` — it names the region.", "Pass `index` to CarouselItem so each slide is announced as “n of m”.", "Keep the key message outside the carousel; slides 2+ are often never seen."],
    donts: ["Don't autoplay without a visible pause control (WCAG 2.2.2).", "Don't put the only copy of important content on a later slide."],
    a11y: { role: "region (aria-roledescription=carousel)", keyboard: [["← / →", "Previous / next slide (focus inside)"], ["Tab", "Buttons and slide content"]], notes: ["A polite live region announces “Slide n of m” on change.", "Dots are buttons “Go to slide n” with aria-current."] },
  },
  {
    id: "context-menu", name: "Context menu", category: "Feedback & Overlay", level: "Molecule", status: "new", icon: MousePointerClick,
    summary: "Right-click / long-press menu (Radix) with the DropdownMenu anatomy: items, checkbox and radio items, sub-menus, shortcuts, destructive variant.",
    demo: () => {
      const [grid, setGrid] = React.useState(true);
      const [who, setWho] = React.useState("nadia");
      return (
        <ContextMenu>
          <ContextMenuTrigger className="grid h-40 w-full max-w-sm place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">Right-click (or Shift+F10) here</ContextMenuTrigger>
          <ContextMenuContent className="w-60">
            <ContextMenuItem>Back<ContextMenuShortcut>⌘[</ContextMenuShortcut></ContextMenuItem>
            <ContextMenuItem disabled>Forward<ContextMenuShortcut>⌘]</ContextMenuShortcut></ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-44"><ContextMenuItem>Copy link</ContextMenuItem><ContextMenuItem>Email</ContextMenuItem></ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked={grid} onCheckedChange={setGrid}>Show grid</ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuLabel inset>Assign to</ContextMenuLabel>
            <ContextMenuRadioGroup value={who} onValueChange={setWho}>
              <ContextMenuRadioItem value="nadia">Nadia</ContextMenuRadioItem>
              <ContextMenuRadioItem value="raka">Raka</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    },
    code: `<ContextMenu>
  <ContextMenuTrigger>…</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Rename<ContextMenuShortcut>F2</ContextMenuShortcut></ContextMenuItem>
    <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
    dos: ["Mirror every action in a visible place — a ⋯ DropdownMenu, a toolbar or a shortcut (see Blocks → Apps → Inbox)."],
    donts: ["Don't make the context menu the only way to do something — touch and keyboard users rarely find it."],
    a11y: { role: "menu", keyboard: [["Shift+F10 / Menu key", "Open on the focused trigger"], ["↑ / ↓", "Move"], ["→ / ←", "Open / close sub-menu"], ["Esc", "Close"]], notes: ["Checkbox items expose aria-checked; radio items are menuitemradio."] },
  },
  {
    id: "menubar", name: "Menubar", category: "Navigation", level: "Organism", status: "new", icon: MenuIcon,
    summary: "Desktop-application menu bar (File · Edit · View) for editor-like tools. Same item anatomy as ContextMenu.",
    demo: () => {
      const [bm, setBm] = React.useState(true);
      const [profile, setProfile] = React.useState("bubus");
      return (
        <Menubar aria-label="Editor">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New tab<MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
              <MenubarItem>New window<MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
              <MenubarSeparator />
              <MenubarSub><MenubarSubTrigger>Share</MenubarSubTrigger><MenubarSubContent><MenubarItem>Email link</MenubarItem><MenubarItem>Messages</MenubarItem></MenubarSubContent></MenubarSub>
              <MenubarSeparator />
              <MenubarItem>Print…<MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent><MenubarItem>Undo<MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem><MenubarItem>Redo<MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem></MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent><MenubarCheckboxItem checked={bm} onCheckedChange={setBm}>Always show bookmarks bar</MenubarCheckboxItem></MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Profiles</MenubarTrigger>
            <MenubarContent><MenubarRadioGroup value={profile} onValueChange={setProfile}><MenubarRadioItem value="bubus">Bubus</MenubarRadioItem><MenubarRadioItem value="team">agere team</MenubarRadioItem></MenubarRadioGroup></MenubarContent>
          </MenubarMenu>
        </Menubar>
      );
    },
    code: `<Menubar aria-label="Editor">
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent><MenubarItem>New tab<MenubarShortcut>⌘T</MenubarShortcut></MenubarItem></MenubarContent>
  </MenubarMenu>
</Menubar>`,
    specs: [["Bar", "h-9 · border · p-1 · shadow-xs"], ["Trigger", "px-2 py-1 · rounded-sm · open = bg-accent"], ["Content", "min-w-12rem · sideOffset 8"]],
    dos: ["Use only where users expect an application menu (editors, builders). Give it an aria-label."],
    donts: ["Don't use a Menubar for site navigation — that's NavigationMenu."],
    a11y: { role: "menubar", keyboard: [["← / →", "Move between menus (opens the neighbour if one is open)"], ["↓ / Enter", "Open"], ["Esc", "Close"]], notes: ["One tab stop for the whole bar (roving tabindex)."] },
  },
  {
    id: "resizable", name: "Resizable", category: "Data & Complex", level: "Molecule", status: "new", icon: Columns3,
    summary: "Resizable panel groups on react-resizable-panels v4. ⚠ v4 units: numbers are pixels, strings are percent — defaultSize=\"30\" is 30%.",
    demo: () => (
      <div className="h-64 w-full max-w-xl overflow-hidden rounded-xl border border-border">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize="30" minSize="20"><div className="grid h-full place-items-center text-sm font-medium">Sidebar</div></ResizablePanel>
          <ResizableHandle withHandle aria-label="Resize sidebar" />
          <ResizablePanel defaultSize="70">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="60"><div className="grid h-full place-items-center text-sm font-medium">Editor</div></ResizablePanel>
              <ResizableHandle withHandle aria-label="Resize console" />
              <ResizablePanel defaultSize="40"><div className="grid h-full place-items-center text-sm font-medium">Console</div></ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    ),
    code: `<ResizablePanelGroup orientation="horizontal">          {/* v4: orientation, not direction */}
  <ResizablePanel defaultSize="30" minSize="20">…</ResizablePanel>   {/* strings = %, numbers = px */}
  <ResizableHandle withHandle aria-label="Resize sidebar" />
  <ResizablePanel defaultSize="70">…</ResizablePanel>
</ResizablePanelGroup>`,
    specs: [["Handle", "1px bg-border · 8px hit area · focus/active = ring"], ["Grip", "optional withHandle (h-4 w-3)"]],
    dos: ["Label every handle (aria-label=\"Resize …\").", "Set minSize so panels can't collapse into unusable slivers.", "Switch to a single pane (or tabs) on phones."],
    donts: ["Don't port v2/v3 snippets blindly: defaultSize={50} now means 50px.", "Don't nest more than two levels."],
    a11y: { role: "separator", keyboard: [["← → / ↑ ↓", "Resize"], ["Home / End", "Min / max"], ["Enter", "Collapse / expand (collapsible panels)"]], notes: ["Handles expose aria-valuenow / min / max and aria-controls."] },
  },
];
