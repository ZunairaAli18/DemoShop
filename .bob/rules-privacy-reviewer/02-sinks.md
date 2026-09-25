# Sinks: where data leaves our control

## Logs (`log`)
- `console.*` (`console.log`, `console.error`, ...)
- `log.*`, `logger.*`

Assume logs are shipped to a third-party service.

## Third-party APIs (`third_party`)
- `fetch`, `axios`, `http`/`https` requests to external URLs
- Webhooks
- CRMs and analytics, e.g. `sendToCrm`, `analytics.track`

## API responses (`api_response`)
- `res.json`, `res.send` (and similar) returning sensitive data to the client

## Error trackers (`error_tracker`)
- `Sentry.captureException`, `Sentry.setUser`, `Sentry.setContext` called with sensitive data

## Storage (`storage`)
- Writing sensitive data unencrypted to files, S3 or caches
