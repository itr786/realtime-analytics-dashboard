# Realtime Analytics Dashboard

A full-stack realtime analytics product demonstrating live KPI monitoring, event streaming, historical metrics, WebSocket reconnects, dashboard filtering, and backend aggregation. The project is intentionally structured like a small production monitoring application rather than a static chart demo.

## Product overview

```text
Django metrics API ───────► historical charts
       │
       └─ WebSocket ──────► live KPI cards
                              │
                              ├── event feed
                              ├── connection health
                              └── time-window filters
```

## Features

- Live KPI cards with connection state
- WebSocket event stream with automatic reconnect
- Historical metrics API for charts
- Time-window filtering
- Endpoint/service separation for metric aggregation
- Event normalization before sending data to clients
- Graceful handling of malformed/stale updates
- Responsive Next.js dashboard layout
- PostgreSQL-ready metric persistence
- Tests around the realtime message contract

## Architecture

```text
Next.js / React / TypeScript
          │
     ┌────┴────┐
     │ REST    │ WebSocket
     ▼         ▼
 Django API   ASGI consumer
     │         │
     └────┬────┘
          ▼
   Metrics service
          │
          ▼
      PostgreSQL
```

## Project structure

```text
frontend/
  app/                     dashboard entry point
  components/              KPI, chart and event-feed UI
  lib/                     API/WebSocket clients
backend/
  config/                  Django + ASGI configuration
  analytics/
    consumers.py           realtime WebSocket consumer
    services/              aggregation and event generation
    api.py                 historical metric endpoints
    tests/                 contract and service tests
```

## Realtime design

The browser treats the WebSocket as a disposable connection: it can reconnect when the server restarts or the network changes, while the backend remains responsible for the current metric state. This keeps transient connection failures from becoming application-state failures.

## Stack

- Next.js + React + TypeScript
- Python + Django
- Django Channels / ASGI
- PostgreSQL
- WebSockets
- Pytest

## Running locally

```bash
cd backend
python manage.py migrate
python manage.py runserver
```

Run the Next.js application from `frontend/` in a second terminal.

## Portfolio note

The dashboard uses generated/sample analytics data and is an original portfolio implementation. It does not represent proprietary production code or private telemetry.
