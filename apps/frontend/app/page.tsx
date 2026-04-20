"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

type HealthResponse = {
  status: string;
  timestamp: string;
};

type RunScenarioForm = {
  type: "success" | "validation_error" | "system_error" | "slow_request";
  name?: string;
};

type RunScenarioResponse = {
  id: string;
  type: string;
  status: string;
  duration: number;
  createdAt: string;
};

async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${apiBaseUrl}/api/health`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to load health status");
  }
  return response.json();
}

type ApiErrorResponse = {
  error?: string | { message?: string };
};

type ScenarioHistoryItem = {
  id: string;
  type: string;
  status: string;
  duration: number | null;
  error: string | null;
  createdAt: string;
};

async function runScenario(payload: RunScenarioForm): Promise<RunScenarioResponse> {
  const response = await fetch(`${apiBaseUrl}/api/scenarios/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorResponse;
    const fallback = "Scenario run failed";
    const message =
      typeof body.error === "string"
        ? body.error
        : typeof body.error?.message === "string"
          ? body.error.message
          : fallback;
    throw new Error(message);
  }
  return response.json();
}

async function fetchScenarioHistory(): Promise<ScenarioHistoryItem[]> {
  const response = await fetch(`${apiBaseUrl}/api/scenarios?limit=20`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to load scenario history");
  }
  return response.json();
}

export default function HomePage() {
  const { register, handleSubmit, reset } = useForm<RunScenarioForm>({
    defaultValues: { type: "success", name: "" },
  });
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const queryClient = useQueryClient();

  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
  });

  const historyQuery = useQuery({
    queryKey: ["scenario-history"],
    queryFn: fetchScenarioHistory,
    refetchInterval: 5000,
  });

  const runScenarioMutation = useMutation({
    mutationFn: runScenario,
    onSuccess: (result) => {
      setToast({
        type: "success",
        message: `Scenario ${result.type} completed in ${result.duration}ms`,
      });
      void queryClient.invalidateQueries({ queryKey: ["scenario-history"] });
      reset({ type: "success", name: "" });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Scenario run failed";
      setToast({ type: "error", message });
      void queryClient.invalidateQueries({ queryKey: ["scenario-history"] });
    },
  });

  const onSubmit = (values: RunScenarioForm) => {
    setToast(null);
    runScenarioMutation.mutate(values);
  };

  const getStatusVariant = (status: string): "green" | "yellow" | "red" | "neutral" => {
    if (status === "completed") return "green";
    if (status === "validation_error") return "yellow";
    if (status === "system_error") return "red";
    return "neutral";
  };

  const healthData = healthQuery.data;
  const historyItems = historyQuery.data ?? [];

  return (
    <main className="mx-auto min-h-screen max-w-3xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Signal Lab</h1>
        <p className="text-slate-600">
          Foundation stack with Next.js, NestJS, PostgreSQL and Prisma.
        </p>
      </div>

      <div className="grid gap-6">
        {toast ? (
          <div
            className={`rounded-md border px-3 py-2 text-sm ${
              toast.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-rose-300 bg-rose-50 text-rose-700"
            }`}
          >
            {toast.message}
          </div>
        ) : null}

        <Card>
          <h2 className="mb-2 text-xl font-semibold">API Health</h2>
          {healthQuery.isLoading ? (
            <p>Loading health status...</p>
          ) : healthQuery.isError ? (
            <p className="text-red-600">Unable to reach backend API.</p>
          ) : (
            <p>
              Status: <strong>{healthData?.status}</strong> at{" "}
              {healthData ? new Date(healthData.timestamp).toLocaleString() : "n/a"}
            </p>
          )}
        </Card>

        <Card>
          <h2 className="mb-2 text-xl font-semibold">Run Scenario</h2>
          <form className="grid gap-3 md:grid-cols-3" onSubmit={handleSubmit(onSubmit)}>
            <select
              className="h-10 rounded-md border border-slate-300 px-3 text-sm"
              {...register("type", { required: true })}
            >
              <option value="success">success</option>
              <option value="validation_error">validation_error</option>
              <option value="system_error">system_error</option>
              <option value="slow_request">slow_request</option>
            </select>
            <Input placeholder="Optional run name" {...register("name")} />
            <Button type="submit" disabled={runScenarioMutation.isPending}>
              {runScenarioMutation.isPending ? "Running..." : "Run Scenario"}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-2 text-xl font-semibold">Run History</h2>
          {historyQuery.isLoading ? (
            <p>Loading scenario history...</p>
          ) : historyQuery.isError ? (
            <p className="text-red-600">Failed to load run history.</p>
          ) : (
            <ul className="space-y-2">
              {historyItems.map((run) => (
                <li
                  key={run.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 p-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(run.status)}>{run.status}</Badge>
                    <span className="font-medium">{run.type}</span>
                  </div>
                  <div className="text-slate-600">
                    {run.duration ?? 0}ms - {new Date(run.createdAt).toLocaleTimeString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="mb-2 text-xl font-semibold">Observability Links</h2>
          <ul className="space-y-1 text-sm text-slate-700">
            <li>Grafana: http://localhost:3100 (admin/admin)</li>
            <li>Sentry: check your Sentry project for system_error events</li>
            <li>Loki query: {'{app="signal-lab"} | json | scenarioType!=""'}</li>
            <li>Prometheus metrics: http://localhost:3001/metrics</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}
