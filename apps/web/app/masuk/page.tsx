import { Button } from "@/components/ui/button";
import { Logo } from "@/brand/logo";
import { t } from "~/lib/i18n";
import { startDemoSession } from "./actions";

export default async function MasukPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const next = params.next ?? "/studio-rintis/desk";
  return (
    <main id="main-content" className="grid min-h-dvh place-items-center bg-background px-4">
      <form action={startDemoSession} className="grid w-full max-w-sm gap-4">
        <Logo variant="lockup" height={28} title={t("app.name")} />
        <h1 className="type-heading-xl text-foreground">{t("masuk.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("masuk.body")}</p>
        <input type="hidden" name="next" value={next} />
        <Button type="submit">{t("masuk.submit")}</Button>
      </form>
    </main>
  );
}
