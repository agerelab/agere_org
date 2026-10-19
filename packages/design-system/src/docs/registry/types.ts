import type * as React from "react";
import type { LucideIcon } from "lucide-react";

export type Category = "Actions & Inputs" | "Display" | "Navigation" | "Feedback & Overlay" | "Data & Complex" | "Workspace" | "Domain modules";
export type Level = "Atom" | "Molecule" | "Organism";
export type Status = "stable" | "beta" | "new" | "deprecated";

export interface ComponentDoc {
  id: string;
  name: string;
  category: Category;
  level: Level;
  status: Status;
  icon: LucideIcon;
  summary: string;
  /** Primary live example. */
  demo: React.ComponentType;
  /** Variants / states gallery. */
  states?: React.ComponentType;
  code: string;
  /** Token/spec rows: [part, value]. */
  specs?: [string, string][];
  dos: string[];
  donts: string[];
  a11y: { role?: string; keyboard?: [string, string][]; notes: string[] };
  /** Micro-interactions and state transitions. */
  interaction?: string[];
  content?: string[];
}

export const CATEGORIES: Category[] = ["Actions & Inputs", "Display", "Navigation", "Feedback & Overlay", "Data & Complex", "Workspace", "Domain modules"];
