import { healthSchema, organizationSchema, spaceSchema, type OrgClient } from "./schemas";

async function readJson(response: Response): Promise<unknown> {
  return response.json() as Promise<unknown>;
}

export function createHttpClient(baseUrl: string): OrgClient {
  const root = baseUrl.replace(/\/$/, "");
  return {
    async health() {
      const response = await fetch(`${root}/api/v1/health`);
      if (!response.ok) throw new Error(`health ${response.status}`);
      return healthSchema.parse(await readJson(response));
    },
    async organization(slug) {
      const response = await fetch(`${root}/api/v1/organizations/${encodeURIComponent(slug)}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`organization ${response.status}`);
      return organizationSchema.parse(await readJson(response));
    },
    async spaces(organizationSlug) {
      const response = await fetch(`${root}/api/v1/organizations/${encodeURIComponent(organizationSlug)}/spaces`);
      if (response.status === 404) return [];
      if (!response.ok) throw new Error(`spaces ${response.status}`);
      return spaceSchema.array().parse(await readJson(response));
    },
  };
}
