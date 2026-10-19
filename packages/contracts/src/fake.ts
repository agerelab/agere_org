import { healthSchema, organizationSchema, spaceSchema, type OrgClient, type Organization, type Space } from "./schemas";

const organizations: Organization[] = [
  organizationSchema.parse({
    id: "11111111-1111-4111-8111-111111111111",
    slug: "studio-rintis",
    name: "Studio Rintis",
  }),
];

const spaces: Record<string, Space[]> = {
  "studio-rintis": [
    spaceSchema.parse({ id: "space-produk", name: "Produk" }),
    spaceSchema.parse({ id: "space-operasi", name: "Operasi" }),
  ],
};

export function createFakeClient(): OrgClient {
  return {
    async health() {
      return healthSchema.parse({ status: "ok", database: "not-configured" });
    },
    async organization(slug) {
      return organizations.find((organization) => organization.slug === slug) ?? null;
    },
    async spaces(organizationSlug) {
      return spaces[organizationSlug] ?? [];
    },
  };
}
