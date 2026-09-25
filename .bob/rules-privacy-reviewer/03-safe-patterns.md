# Safe patterns: do NOT report

- **Only safe fields picked.** e.g. `{ id: customer.id, name: customer.name }`.
- **Masked, hashed or encrypted values.** e.g. `42101-*******-1`, `sha256(email)`.
- **Internal use only.** Sensitive data used for comparisons or lookups that never reaches a sink.
- **Test fixtures and fake data definitions** that don't flow to a sink. Defining a fake customer is not a leak; logging it is.
