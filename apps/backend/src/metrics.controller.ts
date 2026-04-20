import { Controller, Get, Header } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MetricsService } from "./observability/metrics.service";

@ApiTags("metrics")
@Controller()
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get("metrics")
  @Header("Content-Type", "text/plain; version=0.0.4; charset=utf-8")
  @ApiOperation({ summary: "Prometheus metrics endpoint" })
  async getMetrics() {
    return this.metrics.renderMetrics();
  }
}
