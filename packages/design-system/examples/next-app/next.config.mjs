import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** Example venture app consuming Agere DS straight from source (monorepo-style). */
const nextConfig = {
  reactStrictMode: true,
  // DS source lives in ../../src — let Turbopack and file tracing see the repo root.
  turbopack: { root: repoRoot },
  outputFileTracingRoot: repoRoot,
};
export default nextConfig;
