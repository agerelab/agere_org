import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { OrganizationsController } from "./organizations.controller";

@Module({
  controllers: [HealthController, OrganizationsController],
})
export class AppModule {}
