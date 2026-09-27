# Sources: sensitive data

A field is sensitive if its name matches one of these, case-insensitively, in any naming style: snake_case (`cnic`), camelCase (`cnicNumber`), PascalCase (`Cnic`), UPPER_CASE (`CNIC`), or similar variants (`date_of_birth`, `dateOfBirth`, `DateOfBirth`).

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

### Where to find models
Before reporting fields from a whole object, read where it is defined. Examples by language:

- **JavaScript/TypeScript:** classes, interfaces, types, Mongoose/Prisma/Sequelize models, plain object fixtures
- **Python:** Django models, Pydantic models, dataclasses, SQLAlchemy models
- **Java/Kotlin:** JPA entities, records, data classes
- **Go:** structs (check `json:` tags too)
- **C#:** classes and records, EF Core entities
- **PHP:** Eloquent models (`$fillable`, `$casts`)
- **Ruby:** ActiveRecord models and `schema.rb`

### Only report fields that really exist
Before reporting the fields of a whole object, read where that object is defined (its model, fixture, schema or type) and report ONLY the sensitive fields that actually exist there.

- Never assume or guess fields. A `customer` object does not have `password_hash` just because many customer objects do.
- If you can't find the definition, report the object itself once, with `field` set to e.g. `"Customer (whole object)"`, instead of guessing its fields. Give it the severity of the most sensitive field it probably holds, and say in `explanation` that the definition wasn't found.

Repo owners can add their own sensitive fields with the `extra-sensitive-fields` action input; those are added in a separate rule file.
