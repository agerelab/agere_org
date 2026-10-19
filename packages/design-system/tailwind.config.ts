import type { Config } from "tailwindcss";
import agerePreset from "./tailwind.preset";

/** Repo config = the published preset + this repo's content globs. */
export default {
  presets: [agerePreset],
  content: ["./index.html", "./src/**/*.{ts,tsx,mdx}", "./.storybook/**/*.{ts,tsx}"],
} satisfies Config;
