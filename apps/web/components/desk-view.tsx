"use client";

import { Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader, PageHeaderContent, PageHeaderDescription, PageHeaderTitle } from "@/components/ui/page-header";
import { t } from "~/lib/i18n";

export function DeskView() {
  return (
    <div className="grid gap-8">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>{t("desk.title")}</PageHeaderTitle>
          <PageHeaderDescription>{t("desk.description")}</PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>
      <EmptyState icon={<Inbox />} title={t("desk.emptyTitle")} description={t("desk.emptyBody")} />
    </div>
  );
}
