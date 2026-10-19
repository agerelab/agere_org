import path from "node:path";
import { fileURLToPath } from "node:url";

const webDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(webDir, "../../..");

/** DS source is compiled from the sibling folder. The app itself never opens a database. */
const nextConfig = {
  reactStrictMode: true,
  agentRules: false,
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: ["@agere/contracts"],
  turbopack: { root: workspaceRoot },
  outputFileTracingRoot: workspaceRoot,
  async rewrites() {
    const api = process.env.API_URL ?? "http://127.0.0.1:3001";
    return [{ source: "/api/:path*", destination: `${api}/api/:path*` }];
  },
};

export default nextConfig;
