"use client";

import * as React from "react";
import { Bell, Moon, Search, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Kbd } from "@/components/ui/kbd";
import { setTheme } from "@/lib/theme";
import { activity } from "./data";

/**
 * Block · Dashboard header (shadcnstudio "Dashboard Header").
 * Sidebar trigger · page title · search (⌘K) · theme toggle · notifications popover.
 * Sticky, 56px (h-14), border-b. The title is the page <h1>.
 */
export function SiteHeader({ title = "Dashboard", onSearch }: { title?: string; onSearch?: () => void }) {
  const [dark, setDark] = React.useState(() => typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    setTheme(next ? "dark" : "light");
    document.documentElement.dataset.theme = next ? "dark" : "light";
  };
  return (
    <header data-slot="site-header" className="sticky top-0 z-header flex h-14 shrink-0 items-center gap-2 rounded-t-[inherit] border-b border-border bg-background/95 backdrop-blur-glass">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 !h-4" />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSearch}
            className="hidden w-56 justify-start gap-2 bg-muted/40 font-normal text-muted-foreground shadow-none md:inline-flex"
            aria-label="Search (Command K)"
          >
            <Search aria-hidden />
            <span className="flex-1 text-left">Search…</span>
            <Kbd>⌘K</Kbd>
          </Button>
          <Button variant="ghost" size="icon" className="size-8 md:hidden" onClick={onSearch} aria-label="Search">
            <Search aria-hidden />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
            {dark ? <Sun aria-hidden /> : <Moon aria-hidden />}
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative size-8" aria-label={`Notifications, ${activity.length} new`}>
                <Bell aria-hidden />
                <span aria-hidden className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-background" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                <Button variant="link" size="sm" className="h-auto text-xs">Mark all read</Button>
              </div>
              <ul className="max-h-72 divide-y divide-border overflow-y-auto">
                {activity.map((a) => (
                  <li key={a.id} className="px-4 py-3 text-sm">
                    <p><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span> <span className="font-medium">{a.target}</span></p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.when}</p>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
