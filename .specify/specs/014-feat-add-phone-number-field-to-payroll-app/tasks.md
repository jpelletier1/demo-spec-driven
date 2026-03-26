# Task Breakdown: Add Phone number field to payroll app

> Spec: [spec.md](./spec.md)
> Plan: [plan.md](./plan.md)
> Status: Ready for Implementation

## Prerequisites

- [ ] Run `npm install` on `feature/14-feat-add-phone-number-field-to` so any added test tooling is available locally.

## Phase 1: Foundation

### Task 1.1: Add a phone-capable test entrypoint
- **File(s):** `package.json`, `src/server.js`, `src/db.js`
- **Description:** Add the minimal test script/dependency and any app/database configuration seams needed for integration tests to boot the real Express app against an isolated SQLite file.
- **Depends on:** None
- **Parallel:** No

### Task 1.2: Extend employee schema and persistence for `phone`
- **File(s):** `src/db.js`
- **Description:** Add the startup migration for existing databases, thread `phone` through seed/select/insert/update statements, and preserve legacy rows with `NULL` phone values.
- **Depends on:** Task 1.1
- **Parallel:** No

## Phase 2: Core Implementation

### Task 2.1: Validate and accept phone numbers in create/update flows
- **File(s):** `src/server.js`
- **Description:** Update `parseEmployeeInput()` and route handlers so create/update requests require a digits-only phone number up to 10 digits and return clear validation messages.
- **Depends on:** Task 1.2
- **Parallel:** No

### Task 2.2: Add phone fields and roster displays [P]
- **File(s):** `src/render.js`
- **Description:** Add required `Phone` inputs to the add/edit forms and render stored phone values consistently in the roster and employee management views, including blank handling for legacy rows.
- **Depends on:** Task 1.2
- **Parallel:** Yes (can run with 2.1)

### Task 2.3: Expose phone on shared employee payloads
- **File(s):** `src/db.js`, `src/server.js`
- **Description:** Ensure the employee shape returned by `listEmployees()` includes `phone` so both the HTML dashboard and `/api/employees` surface the new field without separate code paths.
- **Depends on:** Tasks 2.1, 2.2
- **Parallel:** No

## Phase 3: Integration & Testing

### Task 3.1: Cover successful create/update persistence
- **File(s):** `test/employee-phone.test.js`
- **Description:** Add integration tests for creating an employee with a valid phone number, updating an existing phone number, and verifying the saved value appears in the UI/API against a temporary SQLite database.
- **Depends on:** Task 2.3
- **Parallel:** No

### Task 3.2: Cover validation and legacy-record regressions [P]
- **File(s):** `test/employee-phone.test.js`
- **Description:** Add real-path tests for blank phone values, non-digit phone values, phone numbers longer than 10 digits, and legacy rows with `NULL` phone values rendering as editable blanks.
- **Depends on:** Task 2.3
- **Parallel:** Yes (can run with 3.1)

### Task 3.3: Verify the feature and capture repo notes
- **File(s):** `package.json`, `AGENTS.md`
- **Description:** Run the new test command plus any targeted manual checks, and record any durable repo-specific testing or migration insight in `AGENTS.md` if the implementation adds one.
- **Depends on:** Tasks 3.1, 3.2
- **Parallel:** No

## Checkpoints

- [ ] After Phase 1: Verify the database migration and test harness plan are solid.
- [ ] After Phase 2: Verify create/update flows and shared employee payloads include `phone`.
- [ ] After Phase 3: Confirm all integration tests pass and the feature is ready to implement.
