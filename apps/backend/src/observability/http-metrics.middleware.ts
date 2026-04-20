import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { MetricsService } from "./metrics.service";

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  constructor(private readonly metrics: MetricsService) {}

  use(request: Request, response: Response, next: NextFunction) {
    response.on("finish", () => {
      const path = request.originalUrl.split("?")[0];
      this.metrics.trackHttpRequest(request.method, path, response.statusCode);
    });
    next();
  }
}
