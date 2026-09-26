# demo-shop

A small Express app that acts as a demo target for **Source to Sink**, a tool that uses IBM Bob in a GitHub Action to catch sensitive data (CNIC, phone, email, address) leaking into logs, third-party APIs and API responses in pull requests.

The `main` branch is clean. All customer data in `src/models/customer.js` is fake.

## Run

```bash
npm install
npm start
```

The app listens on `PORT` or 3000. Set `CRM_URL` to send CRM events to an endpoint; without it, CRM calls are skipped.

## Try it

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":1,"items":["tyre"]}'

curl http://localhost:3000/customers/1/summary
```

## Demo pull requests

- `leak/debug-logging`: logs the whole order and customer objects (should be blocked)
- `leak/crm-enrichment`: sends the full customer profile to the CRM through a helper that spreads all fields (should be blocked)
- `leak/api-response`: the summary endpoint returns the full customer (should be blocked)
- `feature/order-notes`: adds a note field to orders (should pass)

## Multi-language test files

`polyglot/` contains small samples in six languages (Python, Java, Go, C#, PHP and Ruby) used to test Source to Sink beyond JavaScript. Each folder has a model with sensitive fields and one function that sends only safe fields (id and name) to a sink. They are never compiled or run.
