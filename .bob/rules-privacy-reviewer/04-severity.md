# Severity

- **high**: identity, financial or credential data reaching ANY sink unmasked. This blocks the merge.
- **medium**: contact data (email, phone, mobile) reaching any sink.
- **low**: something suspicious that is probably fine.

A whole sensitive object (e.g. a full customer) reaching a sink carries the severity of the most sensitive field inside it, and is reported per field (see the output format).
