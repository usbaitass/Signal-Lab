# Signal Lab — Submission Checklist

Заполни этот файл перед сдачей. Он поможет интервьюеру быстро проверить решение.

---

## Репозиторий

- **URL**: `https://github.com/usbaitass/Signal-Lab.git`
- **Ветка**: `main`
- **Время работы** (приблизительно): `3` часа

---

## Запуск

```bash
# Команда запуска:
docker compose up -d --build

# Команда проверки:
docker compose ps && curl -sS http://localhost:3001/api/health && curl -I http://localhost:3001/api/docs && curl -sS http://localhost:3001/metrics | rg "scenario_runs_total|scenario_run_duration_seconds|http_requests_total"

# Команда остановки:
docker compose down

```

**Предусловия**: (Docker version, Node version, что ещё нужно)
- Docker + Docker Compose; Node.js 20+ (для локального запуска вне контейнеров); свободные порты 3000, 3001, 5432, 9090, 3100, 3101.

---

## Стек — подтверждение использования

| Технология | Используется? | Где посмотреть |
|-----------|:------------:|----------------|
| Next.js (App Router) | ☑ | `apps/frontend/app/layout.tsx`, `apps/frontend/package.json` |
| shadcn/ui | ☑ | `apps/frontend/components/ui/*`, `apps/frontend/app/page.tsx` |
| Tailwind CSS | ☑ | `apps/frontend/package.json`, `apps/frontend/app/globals.css` |
| TanStack Query | ☑ | `apps/frontend/app/providers.tsx`, `apps/frontend/app/page.tsx` |
| React Hook Form | ☑ | `apps/frontend/app/page.tsx` |
| NestJS | ☑ | `apps/backend/src/main.ts`, `apps/backend/src/app.module.ts` |
| PostgreSQL | ☑ | `docker-compose.yml`, `prisma/schema.prisma` |
| Prisma | ☑ | `apps/backend/src/prisma/prisma.service.ts`, `prisma/schema.prisma` |
| Sentry | ☑ | `apps/backend/package.json`, `apps/backend/src/filters/all-exceptions.filter.ts` |
| Prometheus | ☑ | `apps/backend/src/metrics.controller.ts`, `observability/prometheus/prometheus.yml` |
| Grafana | ☑ | `docker-compose.yml`, `observability/grafana/dashboards/` |
| Loki | ☑ | `docker-compose.yml`, `observability/loki/loki-config.yml` |

---

## Observability Verification

Опиши, как интервьюер может проверить каждый сигнал:

| Сигнал | Как воспроизвести | Где посмотреть результат |
|--------|-------------------|------------------------|
| Prometheus metric | Выполнить `success`, `validation_error`, `system_error`, `slow_request` через UI или `POST /api/scenarios/run`, затем вызвать `curl -sS http://localhost:3001/metrics \| rg "scenario_runs_total\|scenario_run_duration_seconds\|http_requests_total"` | `http://localhost:3001/metrics` |
| Grafana dashboard | Поднять стек и выполнить сценарии; открыть Grafana и убедиться, что панели заполнены | `http://localhost:3100` -> Dashboard `Signal Lab Observability` |
| Loki log | После выполнения сценариев открыть Explore и выполнить LogQL запрос | Grafana Explore, datasource Loki, запрос `{app="signal-lab"} \| json \| scenarioType!=""` |
| Sentry exception | Указать валидный `SENTRY_DSN`, запустить сценарий `system_error` | Проект Sentry, новое событие ошибки из backend |

---

## Cursor AI Layer

### Custom Skills

| # | Skill name | Назначение |
|---|-----------|-----------|
| 1 | `observability-endpoint` | Добавление/изменение backend endpoint с обязательными метриками, structured log и Sentry для system failures |
| 2 | `nestjs-endpoint-scaffold` | Быстрое создание NestJS endpoint с DTO валидацией, Prisma и Swagger |
| 3 | `shadcn-rhf-form` | Создание и обновление frontend-форм на React Hook Form + shadcn-паттернах |

### Commands

| # | Command | Что делает |
|---|---------|-----------|
| 1 | `/add-endpoint` | Проводит через workflow добавления endpoint (DTO, Prisma, Swagger, observability, контракт) |
| 2 | `/check-obs` | Выполняет быстрый аудит observability-покрытия backend-изменений |
| 3 | `/health-check` | Проверяет базовое состояние локального стека и ключевые endpoints |

### Hooks

| # | Hook | Какую проблему решает |
|---|------|----------------------|
| 1 | `.cursor/hooks/schema-change-guard.sh` | Предупреждает о пропущенных шагах после изменения `prisma/schema.prisma` (миграции, Prisma client, контракт) |
| 2 | `.cursor/hooks/api-change-reminder.sh` | Напоминает проверить Swagger, observability и согласованность frontend API при изменениях контроллеров |

### Rules

| # | Rule file | Что фиксирует |
|---|----------|---------------|
| 1 | `.cursor/rules/stack-constraints.mdc` | Фиксирует обязательный стек и запрещает дрейф библиотек |
| 2 | `.cursor/rules/prisma-patterns.mdc` | Закрепляет доступ к БД через Prisma и обязательный процесс schema-change |
| 3 | `.cursor/rules/observability-conventions.mdc` | Унифицирует метрики, structured logging и правила Sentry |

### Marketplace Skills

| # | Skill | Зачем подключён |
|---|-------|----------------|
| 1 | `next-best-practices` | Чтобы поддерживать корректные App Router-паттерны и структуру Next.js |
| 2 | `shadcn-ui` | Чтобы соблюдать композиционные паттерны UI-компонентов |
| 3 | `tailwind-v4-shadcn` | Чтобы удерживать консистентные utility-классы и дизайн-токены |
| 4 | `nestjs-best-practices` | Чтобы держать чистые controller/service границы и API-структуру |
| 5 | `prisma-orm` | Чтобы безопасно вести schema/query/migration изменения |
| 6 | `docker-expert` | Чтобы быстрее диагностировать проблемы docker compose и локального стека |

**Что закрыли custom skills, чего нет в marketplace:**
Репозиторно-специфичные договорённости: конкретные имена метрик и log-поля (`scenarioType`, `scenarioId`, `duration`), сценарный workflow (`success/validation_error/system_error/slow_request`) и строгий orchestrator-процесс с файловым `resume`.

---

## Orchestrator

- **Путь к skill**: `.cursor/skills/signal-lab-orchestrator/SKILL.md`
- **Путь к context file** (пример): `.execution/templates/context.template.json`
- **Сколько фаз**: `7`
- **Какие задачи для fast model**: `простые атомарные задачи: DTO/валидация, базовая wiring endpoint, простые Prisma-изменения, observability-инструментирование существующих путей, базовые UI form/list правки`
- **Поддерживает resume**: да

---

## Скриншоты / видео

- [x] UI приложения
- [x] Grafana dashboard с данными
- [x] Loki logs
- [x] Sentry error

(Приложи файлы или ссылки ниже)

---

## Что не успел и что сделал бы первым при +4 часах

Не успел добавить автоматизированные e2e/интеграционные проверки для полного observability-сценария. При +4 часах в первую очередь добавил бы автотесты на `POST /api/scenarios/run` + smoke-проверку метрик/логов, чтобы убрать ручные шаги верификации.

---

## Вопросы для защиты (подготовься)

1. Почему именно такая декомпозиция skills?
2. Какие задачи подходят для малой модели и почему?
3. Какие marketplace skills подключил, а какие заменил custom — и почему?
4. Какие hooks реально снижают ошибки в повседневной работе?
5. Как orchestrator экономит контекст по сравнению с одним большим промптом?
