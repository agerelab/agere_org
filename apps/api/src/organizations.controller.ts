import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { createFakeClient } from "@agere/contracts";

const client = createFakeClient();

@Controller("v1/organizations")
export class OrganizationsController {
  @Get(":slug")
  async organization(@Param("slug") slug: string) {
    const organization = await client.organization(slug);
    if (!organization) throw new NotFoundException("Organisasi tidak ditemukan");
    return organization;
  }

  @Get(":slug/spaces")
  async spaces(@Param("slug") slug: string) {
    const organization = await client.organization(slug);
    if (!organization) throw new NotFoundException("Organisasi tidak ditemukan");
    return client.spaces(slug);
  }
}
