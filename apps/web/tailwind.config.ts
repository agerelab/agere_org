import type { Config } from "tailwindcss";
import agere from "../../packages/design-system/tailwind.preset";

const ds = "../../packages/design-system";

export default {
  presets: [agere],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    `${ds}/src/components/**/*.{ts,tsx}`,
    `${ds}/src/lib/**/*.ts`,
    `${ds}/src/brand/**/*.{ts,tsx}`,
    `${ds}/src/icons/**/*.{ts,tsx}`,
    `${ds}/src/blocks/**/*.{ts,tsx}`,
  ],
} satisfies Config;
