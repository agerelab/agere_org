import { notFound } from "next/navigation";
import { OrgShell } from "~/components/org-shell";
import { getOrgClient } from "~/lib/org";

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getOrgClient();
  const organization = await client.organization(slug);
  if (!organization) notFound();
  const spaces = await client.spaces(slug);
  return (
    <OrgShell organization={organization} spaces={spaces}>
      {children}
    </OrgShell>
  );
}
