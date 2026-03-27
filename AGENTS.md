# Repository Memory

## Workflow overview
- GitHub Actions workflow: `.github/workflows/openhands-agent.yml`
- Event router: `.github/openhands/runner.py`
- Step skills: `.agents/skills/{specify,plan,tasks,implement}/SKILL.md`

## Comment behavior
- The runner posts a fresh step-started acknowledgement comment for issue-opened and label-triggered steps in the format: OK, working on `{step_name}`. [Track my progress here]({conversation_url}).
- User-facing step names are `spec`, `plan`, `task`, and `implement`.
- Step completion details should be posted as new issue comments from the skill instructions; the workflow no longer relies on updating a previous tracking comment.

## Verification
- `python -m py_compile .github/openhands/runner.py`
- `npm install`
- `PORT=12000 npm start`
- `curl http://127.0.0.1:12000/health`

## Payroll app example
- Express + SQLite payroll dashboard lives in `src/`.
- Entry point: `src/server.js`.
- Database module: `src/db.js`, storing local data in `data/payroll.sqlite`.
- Renderer and styling: `src/render.js` and `src/public/styles.css`.
- Form validation for employee create/update flows is centralized in `parseEmployeeInput()` in `src/server.js`.
- The database seeds 6 employee records on first run.
- Tests run with `npm test` using Node's built-in test runner plus `supertest`.
- `PAYROLL_DB_PATH` can point the app at an alternate SQLite file for isolated integration tests.
- `src/db.js` performs a startup migration that adds a missing `phone` column with `PRAGMA table_info(employees)` and `ALTER TABLE`.

