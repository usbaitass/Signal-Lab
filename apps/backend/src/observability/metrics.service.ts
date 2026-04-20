import { Injectable } from "@nestjs/common";
import { Counter, Histogram, register } from "prom-client";

type ScenarioStatusLabel = "completed" | "validation_error" | "system_error";

@Injectable()
export class MetricsService {
  private readonly scenarioRunsTotal: Counter<"type" | "status">;
  private readonly scenarioRunDurationSeconds: Histogram<"type">;
  private readonly httpRequestsTotal: Counter<"method" | "path" | "status_code">;

  constructor() {
    this.scenarioRunsTotal =
      (register.getSingleMetric("scenario_runs_total") as Counter<"type" | "status"> | undefined) ??
      new Counter({
        name: "scenario_runs_total",
        help: "Total number of scenario runs by type and status",
        labelNames: ["type", "status"],
        registers: [register],
      });

    this.scenarioRunDurationSeconds =
      (register.getSingleMetric("scenario_run_duration_seconds") as Histogram<"type"> | undefined) ??
      new Histogram({
        name: "scenario_run_duration_seconds",
        help: "Scenario run duration in seconds",
        labelNames: ["type"],
        buckets: [0.1, 0.25, 0.5, 1, 2, 3, 5, 8],
        registers: [register],
      });

    this.httpRequestsTotal =
      (register.getSingleMetric("http_requests_total") as Counter<"method" | "path" | "status_code"> | undefined) ??
      new Counter({
        name: "http_requests_total",
        help: "Total HTTP requests by method, path and status code",
        labelNames: ["method", "path", "status_code"],
        registers: [register],
      });
  }

  trackScenarioRun(type: string, status: ScenarioStatusLabel, durationSeconds: number) {
    this.scenarioRunsTotal.inc({ type, status });
    this.scenarioRunDurationSeconds.observe({ type }, durationSeconds);
  }

  trackHttpRequest(method: string, path: string, statusCode: number) {
    this.httpRequestsTotal.inc({
      method: method.toUpperCase(),
      path,
      status_code: String(statusCode),
    });
  }

  async renderMetrics() {
    return register.metrics();
  }

  getContentType() {
    return register.contentType;
  }
}
