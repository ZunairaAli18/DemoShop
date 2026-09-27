# Sinks: where data leaves our control

## Logs (`log`)
- JS: `console.log`, `console.error`, `winston.info`, …
- Python: `logging.info`, `print`
- Java: `SLF4J log.info`, `System.out.println`
- Go: `log.Printf`, `zap.Sugar().Info`
- C#: `ILogger.LogInformation`
- PHP: `Log::info`
- Ruby: `Rails.logger.info`

Assume logs are shipped to a third-party service.

## Third-party APIs (`third_party`)
- JS: `fetch`, `axios`, `http`/`https` requests to external URLs
- Python: `requests.post`, `httpx.post`
- Java: `HttpClient.send`, `RestTemplate.postForEntity`
- Go: `http.Post`
- C#: `HttpClient.PostAsync`
- PHP: `Http::post`
- Ruby: `Net::HTTP.post`, `Faraday.post`
- Any language: analytics SDKs, CRM SDKs (e.g. `sendToCrm`, `analytics.track`), webhooks

## API responses (`api_response`)
- JS: `res.json(...)`, `res.send(...)`
- Python: `jsonify(...)`, `JsonResponse(...)`, FastAPI `return obj`
- Java: `ResponseEntity.ok(obj)`, `@ResponseBody`
- Go: `json.NewEncoder(w).Encode(obj)`
- C#: `return Ok(obj)`
- PHP: `response()->json(...)`
- Ruby: `render json: obj`

## Error trackers (`error_tracker`)
- `Sentry.captureException`, `Sentry.setUser`, `Sentry.setContext` called with sensitive data (any language)
- Similar calls in Bugsnag, Rollbar, Datadog, or any equivalent SDK

## Storage (`storage`)
- Writing sensitive data unencrypted to files, object storage (S3, GCS, Azure Blob) or caches, in any language

These are examples, not a complete list. Any call that sends data to one of these categories counts.
