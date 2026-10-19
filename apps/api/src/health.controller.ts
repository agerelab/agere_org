import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { healthSchema } from "@agere/contracts";
import { pingDatabase } from "./database.js";

@Controller("v1")
export class HealthController {
  @Get("health")
  async health() {
    try {
      const database = await pingDatabase();
      return healthSchema.parse({ status: "ok", database });
    } catch {
      throw new ServiceUnavailableException("Database tidak terjangkau");
    }
  }
}
