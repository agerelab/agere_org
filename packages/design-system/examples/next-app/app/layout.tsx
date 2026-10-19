import type { Metadata } from "next";
import { cookies } from "next/headers";

import "@/styles/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = { title: "Kulina — agere venture", description: "Example venture app built on agere DS" };

/** Server Component. Theme + density come from cookies so there is no flash on first paint. */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const theme = jar.get("theme")?.value === "dark" ? "dark" : undefined;
  const density = jar.get("density")?.value === "comfortable" ? "comfortable" : "compact";
  return (
    <html lang="id" className={theme} data-density={density} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
