import type { Metadata } from "next";
import { Providers } from "./providers";
import { t } from "~/lib/i18n";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: t("app.name"),
  description: t("app.description"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
