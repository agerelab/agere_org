import Link from "next/link";
import { PageHeader, PageHeaderContent, PageHeaderDescription, PageHeaderTitle } from "@/components/ui/page-header";
import { t } from "~/lib/i18n";
import { getOrgClient } from "~/lib/org";

export default async function SpaceIndexPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const spaces = await getOrgClient().spaces(slug);
  return (
    <div className="grid gap-6">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>{t("space.title")}</PageHeaderTitle>
          <PageHeaderDescription>{t("space.description")}</PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>
      {spaces.length === 0 ? <p className="text-sm text-muted-foreground">{t("space.empty")}</p> : null}
      <ul className="grid gap-2">
        {spaces.map((space) => (
          <li key={space.id}>
            <Link href={`/${slug}/space/${space.id}`} className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
              {space.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
