# Sources: sensitive data

A field is sensitive if its name matches one of these, case-insensitively. Match snake_case, camelCase and similar variants too (`date_of_birth`, `dateOfBirth`, `DateOfBirth`).

## Identity
- `cnic`, `national_id`
- `passport`
- `dob`, `date_of_birth`
- `address`

## Contact
- `email`
- `phone`, `mobile`

## Financial
- `card_number`, `pan`
- `cvv`
- `iban`
- `account_number`

## Credentials
- `password`, `password_hash`
- `api_key`, `token`, `secret`
- `session`, `cookie`

## Whole objects
An object that contains any of these fields is sensitive as a whole. For example, a `customer` or `user` object is sensitive because it has `cnic`, `email` and so on. Passing, spreading (`{ ...customer }`) or serialising the whole object sends every field it contains.

### Only report fields that really exist
Before reporting the fields of a whole object, read where that object is defined (its model, fixture, schema or type) and report ONLY the sensitive fields that actually exist there.

- Never assume or guess fields. A `customer` object does not have `password_hash` just because many customer objects do.
- If you can't find the definition, report the object itself once, with `field` set to e.g. `"Customer (whole object)"`, instead of guessing its fields. Give it the severity of the most sensitive field it probably holds, and say in `explanation` that the definition wasn't found.

## Your own fields
Teams can add fields that are sensitive to their business. Add them to the list below and the reviewer will treat them like the fields above.

- (example) `profit_margin`
- (example) `salary`
