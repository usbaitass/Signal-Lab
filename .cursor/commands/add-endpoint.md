# Add Endpoint

Create a new NestJS endpoint for Signal Lab using existing conventions.

## Inputs
- Endpoint intent and route path.
- Expected request payload and response shape.
- Whether persistence is required.

## Execution
1. Scaffold controller method and DTO validation.
2. Use `PrismaService` for data access (no alternate ORM).
3. Add Swagger annotations.
4. Add observability touches:
   - metric update via `MetricsService`
   - structured logs for success/failure
   - Sentry capture for unexpected system failures only
5. If frontend contract is affected, update corresponding types/calls.

## Output
- List changed files.
- Manual verification curl command for the new endpoint.
- Brief note on observability coverage.
