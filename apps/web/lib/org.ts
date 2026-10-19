import { createFakeClient, createHttpClient, type OrgClient } from "@agere/contracts";

export function getOrgClient(): OrgClient {
  if (process.env.CONTRACTS_MODE === "http") {
    return createHttpClient(process.env.API_URL ?? "http://127.0.0.1:3001");
  }
  return createFakeClient();
}
