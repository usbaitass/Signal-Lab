type LogLevel = "info" | "warn" | "error";

type LogFields = {
  context?: string;
  scenarioType?: string;
  scenarioId?: string;
  duration?: number;
  error?: unknown;
};

export function logEvent(level: LogLevel, message: string, fields: LogFields = {}) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...fields,
    error: normalizeError(fields.error),
  };
  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }
  if (level === "warn") {
    console.warn(JSON.stringify(payload));
    return;
  }
  console.log(JSON.stringify(payload));
}

function normalizeError(error: unknown) {
  if (!error) {
    return undefined;
  }
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  if (typeof error === "string") {
    return error;
  }
  return JSON.stringify(error);
}
