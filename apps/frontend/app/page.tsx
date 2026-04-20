"use client";

import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

type HealthResponse = {
  status: string;
  timestamp: string;
};

type RunScenarioForm = {
  type: string;
};

type RunScenarioResponse = {
  id: string;
  type: string;
  status: string;
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

async function runScenario(type: string): Promise<RunScenarioResponse> {
  const response = await fetch(`${apiBaseUrl}/api/scenarios/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  });
  if (!response.ok) {
    throw new Error("Scenario run failed");
  }
  return response.json();
}

export default function HomePage() {
  const { register, handleSubmit, reset } = useForm<RunScenarioForm>({
    defaultValues: { type: "success" },
  });

  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
  });

  const onSubmit = async (values: RunScenarioForm) => {
    const result = await runScenario(values.type);
    window.alert(`Scenario created: ${result.id}`);
    reset();
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Signal Lab</h1>
        <p className="text-slate-600">
          Foundation stack with Next.js, NestJS, PostgreSQL and Prisma.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <h2 className="mb-2 text-xl font-semibold">API Health</h2>
          {healthQuery.isLoading ? (
            <p>Loading health status...</p>
          ) : healthQuery.isError ? (
            <p className="text-red-600">Unable to reach backend API.</p>
          ) : (
            <p>
              Status: <strong>{healthQuery.data.status}</strong> at{" "}
              {new Date(healthQuery.data.timestamp).toLocaleString()}
            </p>
          )}
        </Card>

        <Card>
          <h2 className="mb-2 text-xl font-semibold">Run Scenario</h2>
          <form className="flex gap-3" onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder="Scenario type" {...register("type", { required: true })} />
            <Button type="submit">Run</Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
