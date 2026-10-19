import { notFound } from "next/navigation";
import { PageHeader, PageHeaderContent, PageHeaderDescription, PageHeaderTitle } from "@/components/ui/page-header";
import { t } from "~/lib/i18n";
import { getOrgClient } from "~/lib/org";

export default async function SpaceDetailPage({ params }: { params: Promise<{ slug: string; spaceId: string }> }) {
  const { slug, spaceId } = await params;
  const space = (await getOrgClient().spaces(slug)).find((item) => item.id === spaceId);
  if (!space) notFound();
  return (
    <PageHeader>
      <PageHeaderContent>
        <PageHeaderTitle>{space.name}</PageHeaderTitle>
        <PageHeaderDescription>{t("space.description")}</PageHeaderDescription>
      </PageHeaderContent>
    </PageHeader>
  );
}
