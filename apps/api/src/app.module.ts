import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller.js";
import { OrganizationsController } from "./organizations.controller.js";

@Module({
  controllers: [HealthController, OrganizationsController],
})
export class AppModule {}
