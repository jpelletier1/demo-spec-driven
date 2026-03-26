# Implementation Plan: Add Phone number field to payroll app

> Spec: [spec.md](./spec.md)
> Status: Draft

## Technical Approach

Extend the existing payroll employee flow end-to-end by adding a persisted `phone` attribute to employee records, validating it in the existing `parseEmployeeInput()` path, and rendering it anywhere employee data is displayed. The implementation should preserve compatibility with already-created SQLite databases by performing a lightweight additive migration that introduces a nullable `phone` column when missing. Create and update requests will require a digits-only value of at most 10 digits, while legacy rows without a phone number will continue to load until an admin edits them.

## Technology Stack

- **Framework:** Existing Express server-rendered Node.js app
- **Database:** Existing SQLite database via `better-sqlite3`
- **Libraries:** Existing `express`, `better-sqlite3`; add minimal test support only if needed for real integration coverage
- **Patterns:** Centralized request validation in `parseEmployeeInput()`, SQL statement helpers in `src/db.js`, HTML rendering in `src/render.js`

## Architecture

### Components

1. **Input validation layer (`parseEmployeeInput`)** - Accept, normalize, and validate the new `phone` field for create/update flows with clear error messages.
2. **Database access layer (`src/db.js`)** - Add schema support, select/insert/update mappings, and a startup migration for existing databases missing the new column.
3. **Dashboard rendering (`src/render.js`)** - Add `Phone` inputs to create/edit forms and display stored values consistently in roster and management views.
4. **HTTP responses (`src/server.js`)** - Expose phone values through existing HTML and `/api/employees` responses without introducing new endpoints.
5. **Integration tests** - Verify the feature through real request paths, covering successful persistence plus validation failures.

### Data Model

Add a new employee attribute:

- `phone: string | null`
  - Stored in SQLite as `phone TEXT`
  - Nullable at the schema level so pre-existing rows remain readable after migration
  - Required for new create/update submissions at the application layer
  - Accepted format: digits only, maximum length 10
  - Display format: preserve the stored digits as entered (no additional formatting)

Migration approach:

- On startup, inspect `employees` table columns with `PRAGMA table_info(employees)`
- If `phone` is missing, run `ALTER TABLE employees ADD COLUMN phone TEXT`
- Keep legacy rows with `NULL` phone values until they are manually updated

### API Contracts

No new endpoints are needed. Update existing payloads and form contracts:

- `POST /employees`
  - New required form field: `phone`
  - Validation errors for missing phone, non-digit characters, or values longer than 10 digits
- `POST /employees/:id/update`
  - New required form field: `phone`
  - Same validation behavior as create
- `GET /api/employees`
  - Each employee object includes `phone` (string when set, otherwise `null`/blank per renderer handling)
- `GET /`
  - New create/edit form field labeled `Phone`
  - Roster and record-management UI display stored phone values

## File Changes

### New Files
- `test/employee-phone.test.js` - Integration coverage for create/update validation, persistence, legacy row behavior, and API exposure

### Modified Files
- `package.json` - Add a `test` script and any minimal test dependency needed for real HTTP/integration testing
- `src/db.js` - Add column migration, include `phone` in seed/select/insert/update statements, and preserve legacy null values
- `src/server.js` - Extend `parseEmployeeInput()` to validate `phone` and pass it through create/update handlers
- `src/render.js` - Add `Phone` fields to forms and display phone numbers in the roster table and edit cards
- `AGENTS.md` - Record any new repo-specific testing or migration insight if implementation introduces one

## Integration Points

- Reuse the current server-rendered dashboard rather than adding client-side state or JavaScript
- Keep validation messages flowing through the existing `redirectWithMessage()` banner behavior
- Ensure `listEmployees()` continues to power both the HTML dashboard and `/api/employees`, so adding `phone` there updates both surfaces together
- Preserve compatibility with local `data/payroll.sqlite` files that were created before the phone field existed

## Testing Strategy

- Add real integration tests for the Express app covering:
  - Create form submission with a valid 10-digit phone number
  - Update form submission changing an existing employee phone number
  - Rejection of blank phone values
  - Rejection of non-digit phone values
  - Rejection of phone numbers longer than 10 digits
  - Rendering of blank phone fields for legacy rows with no stored phone value
  - Inclusion of `phone` in `/api/employees` responses
- Use an isolated temporary SQLite database for tests so production data is not modified
- Avoid mocks; exercise the real request, validation, rendering, and persistence paths

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Existing local SQLite databases do not automatically gain the new column | Add a startup migration using `PRAGMA table_info` plus `ALTER TABLE` |
| Legacy rows without phone values could fail to render | Keep schema nullable and render blank values safely until users update records |
| Tests could mutate the checked-in local database | Route tests to a temporary database path/environment override |
| UI and API drift if only one representation is updated | Source both from the same `listEmployees()` data including the new `phone` field |

## Dependencies

- No production dependency changes expected beyond the current stack
- Likely add minimal test tooling and a `test` script if the repo does not already provide integration test infrastructure
