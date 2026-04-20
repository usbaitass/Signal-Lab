import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PrismaService } from "./prisma/prisma.service";

class RunScenarioDto {
  @IsString()
  type!: string;

  @IsOptional()
  metadata?: Record<string, unknown>;
}

@ApiTags("scenarios")
@Controller("scenarios")
export class ScenarioController {
  constructor(private readonly prisma: PrismaService) {}

  @Post("run")
  @ApiOperation({ summary: "Create a scenario run stub" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        type: { type: "string", example: "success" },
        metadata: { type: "object", nullable: true },
      },
      required: ["type"],
    },
  })
  async runScenario(@Body() body: RunScenarioDto) {
    const scenarioRun = await this.prisma.scenarioRun.create({
      data: {
        type: body.type,
        status: "created",
        metadata: body.metadata,
      },
    });

    return {
      id: scenarioRun.id,
      type: scenarioRun.type,
      status: scenarioRun.status,
      createdAt: scenarioRun.createdAt,
    };
  }
}
