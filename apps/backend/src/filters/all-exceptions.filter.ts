import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import * as Sentry from "@sentry/node";
import { Request, Response } from "express";
import { logEvent } from "../observability/structured-log";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorPayload = isHttpException
      ? exception.getResponse()
      : "Internal server error";
    const path = request.url;
    const isSystemError = status >= 500;

    if (isSystemError) {
      Sentry.captureException(exception);
    }
    logEvent(isSystemError ? "error" : "warn", "HTTP exception captured", {
      context: "AllExceptionsFilter",
      duration: undefined,
      error: exception,
    });

    response.status(status).json({
      statusCode: status,
      path,
      method: request.method,
      timestamp: new Date().toISOString(),
      error: errorPayload,
    });
  }
}
