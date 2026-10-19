import { z } from "zod";
export declare const organizationSchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    slug: string;
    name: string;
}, {
    id: string;
    slug: string;
    name: string;
}>;
export declare const spaceSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
}, {
    id: string;
    name: string;
}>;
export declare const healthSchema: z.ZodObject<{
    status: z.ZodLiteral<"ok">;
    database: z.ZodEnum<["not-configured", "ok"]>;
}, "strip", z.ZodTypeAny, {
    status: "ok";
    database: "ok" | "not-configured";
}, {
    status: "ok";
    database: "ok" | "not-configured";
}>;
export declare const errorEnvelopeSchema: z.ZodObject<{
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
    }, {
        code: string;
        message: string;
    }>;
}, "strip", z.ZodTypeAny, {
    error: {
        code: string;
        message: string;
    };
}, {
    error: {
        code: string;
        message: string;
    };
}>;
export type Organization = z.infer<typeof organizationSchema>;
export type Space = z.infer<typeof spaceSchema>;
export type Health = z.infer<typeof healthSchema>;
export interface OrgClient {
    health(): Promise<Health>;
    organization(slug: string): Promise<Organization | null>;
    spaces(organizationSlug: string): Promise<Space[]>;
}
/** Only same-origin paths. Anything else falls back to the demo desk. */
export declare function safeReturnPath(value: string | null | undefined, fallback?: string): string;
