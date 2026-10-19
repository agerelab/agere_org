import { describe, expect, it } from "vitest";
import { createFakeClient } from "./fake";
import { safeReturnPath } from "./schemas";

describe("fake org client", () => {
  const client = createFakeClient();

  it("returns the demo organization and its spaces", async () => {
    const organization = await client.organization("studio-rintis");
    expect(organization?.name).toBe("Studio Rintis");
    const spaces = await client.spaces("studio-rintis");
    expect(spaces.map((space) => space.id)).toEqual(["space-produk", "space-operasi"]);
  });

  it("returns null for an unknown organization", async () => {
    expect(await client.organization("bukan-org")).toBeNull();
    expect(await client.spaces("bukan-org")).toEqual([]);
  });

  it("reports that the database is not connected yet", async () => {
    expect(await client.health()).toEqual({ status: "ok", database: "not-configured" });
  });
});

describe("safeReturnPath", () => {
  it("keeps an internal path and drops external targets", () => {
    expect(safeReturnPath("/studio-rintis/space")).toBe("/studio-rintis/space");
    expect(safeReturnPath("https://evil.example")).toBe("/studio-rintis/desk");
    expect(safeReturnPath("//evil.example")).toBe("/studio-rintis/desk");
    expect(safeReturnPath(null)).toBe("/studio-rintis/desk");
  });
});
