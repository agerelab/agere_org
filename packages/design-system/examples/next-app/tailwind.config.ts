import type { Config } from "tailwindcss";
import agere from "../../tailwind.preset";

export default {
  presets: [agere],
  content: ["./app/**/*.{ts,tsx}", "../../src/components/**/*.{ts,tsx}", "../../src/lib/**/*.ts", "../../src/brand/**/*.{ts,tsx}", "../../src/icons/**/*.{ts,tsx}"],
} satisfies Config;
