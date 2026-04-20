import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { ScenarioController } from "./scenario.controller";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  imports: [],
  controllers: [HealthController, ScenarioController],
  providers: [PrismaService],
})
export class AppModule {}
