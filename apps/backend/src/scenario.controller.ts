import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";
import { MetricsService } from "./observability/metrics.service";
import { logEvent } from "./observability/structured-log";
import { PrismaService } from "./prisma/prisma.service";

const SCENARIO_TYPES = ["success", "validation_error", "system_error", "slow_request", "teapot"] as const;
type ScenarioType = (typeof SCENARIO_TYPES)[number];

class RunScenarioDto {
  @IsString()
  @IsIn(SCENARIO_TYPES)
  type!: ScenarioType;

  @IsOptional()
  @IsString()
  name?: string;
}

class ListRunsDto {
  @IsOptional()
  limit?: string;
}

@ApiTags("scenarios")
@Controller("scenarios")
export class ScenarioController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  @Post("run")
  @ApiOperation({ summary: "Execute an observability scenario" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        type: { type: "string", example: "success" },
        name: { type: "string", nullable: true },
      },
      required: ["type"],
    },
  })
  async runScenario(@Body() body: RunScenarioDto) {
    const startedAt = Date.now();
    const metadata = body.name ? { name: body.name } : undefined;

    if (body.type === "validation_error") {
      const duration = Date.now() - startedAt;
      const run = await this.prisma.scenarioRun.create({
        data: {
          type: body.type,
          status: "validation_error",
          duration,
          error: "Validation failed for selected scenario input.",
          metadata,
        },
      });

      this.metrics.trackScenarioRun(body.type, "validation_error", duration / 1000);
      logEvent("warn", "Scenario validation failed", {
        context: "ScenarioController",
        scenarioType: body.type,
        scenarioId: run.id,
        duration,
        error: run.error,
      });
      throw new BadRequestException(run.error);
    }

    if (body.type === "system_error") {
      const duration = Date.now() - startedAt;
      const run = await this.prisma.scenarioRun.create({
        data: {
          type: body.type,
          status: "system_error",
          duration,
          error: "Simulated unhandled system exception.",
          metadata,
        },
      });

      this.metrics.trackScenarioRun(body.type, "system_error", duration / 1000);
      logEvent("error", "Scenario system error triggered", {
        context: "ScenarioController",
        scenarioType: body.type,
        scenarioId: run.id,
        duration,
        error: run.error,
      });
      throw new InternalServerErrorException(run.error);
    }

    if (body.type === "slow_request") {
      const delayMs = 2000 + Math.floor(Math.random() * 3000);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const duration = Date.now() - startedAt;
    const status = "completed";
    const run = await this.prisma.scenarioRun.create({
      data: {
        type: body.type,
        status,
        duration,
        metadata: body.type === "teapot" ? { ...(metadata ?? {}), easter: true } : metadata,
      },
    });
    this.metrics.trackScenarioRun(body.type, status, duration / 1000);

    if (body.type === "teapot") {
      logEvent("info", "Teapot scenario executed", {
        context: "ScenarioController",
        scenarioType: body.type,
        scenarioId: run.id,
        duration,
      });
      throw new HttpException(
        {
          id: run.id,
          signal: 42,
          message: "I'm a teapot",
        },
        HttpStatus.I_AM_A_TEAPOT,
      );
    }

    if (status === "completed" && duration >= 2000) {
      logEvent("warn", "Slow scenario request", {
        context: "ScenarioController",
        scenarioType: body.type,
        scenarioId: run.id,
        duration,
      });
    } else {
      logEvent("info", "Scenario completed", {
        context: "ScenarioController",
        scenarioType: body.type,
        scenarioId: run.id,
        duration,
      });
    }

    return {
      id: run.id,
      type: run.type,
      status: run.status,
      duration,
      createdAt: run.createdAt,
    };
  }

  @Get()
  @ApiOperation({ summary: "Get recent scenario runs" })
  async listScenarioRuns(@Query() query: ListRunsDto) {
    const limit = Math.max(1, Math.min(100, Number(query.limit ?? 20)));
    const runs = (await this.prisma.scenarioRun.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    })) as Array<{
      id: string;
      type: string;
      status: string;
      duration: number | null;
      error: string | null;
      createdAt: Date;
    }>;
    return runs.map((run) => ({
      id: run.id,
      type: run.type,
      status: run.status,
      duration: run.duration,
      error: run.error,
      createdAt: run.createdAt,
    }));
  }
}
