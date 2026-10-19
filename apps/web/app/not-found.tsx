import Link from "next/link";
import { Button } from "@/components/ui/button";
import { t } from "~/lib/i18n";

export default function NotFound() {
  return (
    <main id="main-content" className="grid min-h-dvh place-items-center bg-background px-4">
      <div className="grid max-w-sm gap-3">
        <h1 className="type-heading-xl text-foreground">{t("notFound.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("notFound.body")}</p>
        <Button asChild variant="outline">
          <Link href="/masuk">{t("notFound.back")}</Link>
        </Button>
      </div>
    </main>
  );
}
