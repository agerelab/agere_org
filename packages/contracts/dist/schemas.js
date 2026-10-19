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
    database: z.enum(["not-configured", "ok"]),
});
export const errorEnvelopeSchema = z.object({
    error: z.object({
        code: z.string().min(1),
        message: z.string().min(1),
    }),
});
/** Only same-origin paths. Anything else falls back to the demo desk. */
export function safeReturnPath(value, fallback = "/studio-rintis/desk") {
    if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) {
        return fallback;
    }
    return value;
}
