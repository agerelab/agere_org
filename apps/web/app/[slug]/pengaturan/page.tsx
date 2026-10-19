import { Button } from "@/components/ui/button";
import { PageHeader, PageHeaderContent, PageHeaderDescription, PageHeaderTitle } from "@/components/ui/page-header";
import { t } from "~/lib/i18n";
import { endDemoSession } from "./actions";

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>{t("settings.title")}</PageHeaderTitle>
          <PageHeaderDescription>{t("settings.description")}</PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>
      <form action={endDemoSession}>
        <Button type="submit" variant="outline">
          {t("settings.signOut")}
        </Button>
      </form>
    </div>
  );
}
