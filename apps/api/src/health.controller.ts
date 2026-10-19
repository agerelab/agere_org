import { Controller, Get } from "@nestjs/common";
import { createFakeClient } from "@agere/contracts";

const client = createFakeClient();

@Controller("v1")
export class HealthController {
  @Get("health")
  health() {
    return client.health();
  }
}
