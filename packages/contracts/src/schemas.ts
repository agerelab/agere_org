import { z } from "zod";

export const organizationSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
});

export const spaceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const healthSchema = z.object({
  status: z.literal("ok"),
  database: z.literal("not-configured"),
});

export const errorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string().min(1),
    message: z.string().min(1),
  }),
});

export type Organization = z.infer<typeof organizationSchema>;
export type Space = z.infer<typeof spaceSchema>;
export type Health = z.infer<typeof healthSchema>;

export interface OrgClient {
  health(): Promise<Health>;
  organization(slug: string): Promise<Organization | null>;
  spaces(organizationSlug: string): Promise<Space[]>;
}

/** Only same-origin paths. Anything else falls back to the demo desk. */
export function safeReturnPath(value: string | null | undefined, fallback = "/studio-rintis/desk"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) {
    return fallback;
  }
  return value;
}
