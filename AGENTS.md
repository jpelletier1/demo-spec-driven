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

## Spec workflow patterns
- Feature specs live under `.specify/specs/<issue-number>-<slug>/spec.md`.
- Existing product-spec precedent for user administration: `.specify/specs/006-feat-user-management-page/spec.md`.

## Repository constraints
- The repo currently contains workflow automation, generated specs, README content, and `presentation.html`, but no standalone product application or auth stack.
- Issue #11 planning assumes any eventual user-management implementation will need to introduce a self-contained app surface rather than extending the slide deck alone.
