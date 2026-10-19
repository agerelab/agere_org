import type { Config } from "tailwindcss";
import agere from "../../../agere DS/Agere_DS_v7_0/agere-ds/tailwind.preset";

const ds = "../../../agere DS/Agere_DS_v7_0/agere-ds";

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
