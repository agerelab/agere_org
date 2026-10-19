import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import * as React from "react";

import "../src/styles/globals.css";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { Toaster } from "../src/components/ui/toast";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    // a11y violations fail the Vitest/Storybook test run and are reported in Chromatic
    a11y: { test: "error" },
    chromatic: { modes: { light: { theme: "light" }, dark: { theme: "dark" } } },
    options: { storySort: { order: ["Foundations", "Atoms", "Molecules", "Organisms", "Catalog"] } },
  },
  decorators: [
    withThemeByClassName({ themes: { light: "", dark: "dark" }, defaultTheme: "light" }),
    (Story) => (
      <TooltipProvider delayDuration={200}>
        <div className="bg-default p-6 text-default"><Story /></div>
        <Toaster />
      </TooltipProvider>
    ),
  ],
  tags: ["autodocs"],
};
export default preview;
