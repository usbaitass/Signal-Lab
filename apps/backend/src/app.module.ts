import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { MetricsController } from "./metrics.controller";
import { HttpMetricsMiddleware } from "./observability/http-metrics.middleware";
import { MetricsService } from "./observability/metrics.service";
import { ScenarioController } from "./scenario.controller";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  imports: [],
  controllers: [HealthController, MetricsController, ScenarioController],
  providers: [PrismaService, MetricsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpMetricsMiddleware).forRoutes("*");
  }
}
