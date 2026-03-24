# Implementation Plan: feat: User management

> Spec: [spec.md](./spec.md)
> Status: Draft

## Technical Approach

The repository currently contains workflow automation, generated specs, and static documentation assets, but it does not yet include an application runtime, authentication layer, or persistence model for end-user features. To implement this feature in a way that is testable and consistent with the existing Python-based repository, the work should introduce a small self-contained Flask application under a dedicated package rather than trying to force the behavior into the existing `presentation.html` slide deck.

The implementation should use server-rendered templates plus a thin service layer:

- Session-backed authentication determines the current user.
- A role guard restricts the user management page to `Admin` and `Owner` users.
- All mutations flow through a `UserService` so validation, duplicate checks, role-transition rules, self-protection rules, and enable/disable/delete behavior are enforced server-side.
- The initial persistence layer should be file-backed for local demo use, with an in-memory test repository used by automated tests.

To resolve open product-policy questions conservatively, the first implementation should assume:

- only `Owner` users can grant or remove the `Owner` role;
- users cannot change, disable, or delete their own account from the admin page;
- disabling a user blocks future logins but does not require full session-revocation support in the first pass.

## Technology Stack

- **Framework:** Python 3 + Flask for a lightweight server-rendered admin interface
- **Database:** File-backed JSON storage in the Flask instance directory for local/demo persistence, plus in-memory storage for tests
- **Libraries:** `Flask`, `pytest`
- **Patterns:** App factory, service/repository split, POST-Redirect-GET for form actions, server-side validation, flash-message feedback

## Architecture

### Components

1. **`user_admin/__init__.py`** - Flask app factory, configuration, and route registration
2. **`user_admin/auth.py`** - Session login/logout helpers, current-user lookup, and `Admin`/`Owner` access guard
3. **`user_admin/models.py`** - User dataclass plus role/status constants used across the app
4. **`user_admin/store.py`** - File-backed and in-memory user repositories with a shared interface
5. **`user_admin/service.py`** - Business logic for add/change-role/enable-disable/delete flows and policy enforcement
6. **`user_admin/routes.py`** - Login and user-management route handlers that translate form input into service calls
7. **`user_admin/templates/base.html`** - Shared layout and success/error feedback surface
8. **`user_admin/templates/login.html`** - Minimal login form for exercising role-based access and disabled-login behavior
9. **`user_admin/templates/admin/users.html`** - User list, add-user form, role controls, status toggle, delete confirmation UI
10. **`tests/test_user_management.py`** - End-to-end behavior coverage using the Flask test client and real service/store code paths

### Data Model

The user management feature can be supported with a single `User` record:

- `id` - stable unique identifier
- `email` - normalized lowercase email used for lookup and duplicate prevention
- `role` - one of `member`, `admin`, or `owner`
- `disabled` - boolean controlling login eligibility and UI state
- `created_at` - optional timestamp for stable ordering and future auditing

Derived application rules:

- newly added users always start as `member`;
- duplicate email addresses are rejected after normalization;
- disabled users remain visible in the admin list and cannot establish a new session;
- delete removes the user record after explicit confirmation.

### API Contracts

The first implementation can stay server-rendered while still using clear HTTP contracts:

- `GET /` - redirect to login or the admin page depending on session state
- `GET /login` - render login form
- `POST /login` - authenticate by email against the local user store; reject disabled users
- `POST /logout` - clear the session
- `GET /admin/users` - render the protected user-management page for `Admin`/`Owner` users only
- `POST /admin/users` - add a user by email; default role is `member`
- `POST /admin/users/<user_id>/role` - update a user's role, enforcing owner-only owner-role changes
- `POST /admin/users/<user_id>/status` - toggle a user between enabled and disabled
- `POST /admin/users/<user_id>/delete` - delete a user only when an explicit confirmation field is present

All mutating routes should return redirects back to `/admin/users` with flash messages for success and validation failures.

## File Changes

### New Files
- `requirements.txt` - Minimal runtime and test dependencies for the new Flask app
- `user_admin/__init__.py` - App factory and configuration bootstrap
- `user_admin/auth.py` - Session and authorization helpers
- `user_admin/models.py` - Shared user model and role constants
- `user_admin/store.py` - JSON-backed and in-memory repository implementations
- `user_admin/service.py` - Centralized user-management business rules
- `user_admin/routes.py` - Login and admin route handlers
- `user_admin/templates/base.html` - Shared layout and flash messaging
- `user_admin/templates/login.html` - Login form used by acceptance tests
- `user_admin/templates/admin/users.html` - Protected user management UI
- `tests/test_user_management.py` - Integration-style tests for the feature using real code paths

### Modified Files
- `.gitignore` - Ignore Flask runtime state such as `instance/`
- `README.md` - Document how to install dependencies, run the app, and execute tests

## Integration Points

- The new application code remains isolated from the existing GitHub automation files under `.github/` and `.agents/`.
- The feature reuses the repository's existing Python footprint instead of introducing a separate Node or frontend build toolchain.
- The auth layer and user service provide a stable seam for future replacement if the repository later adopts a real database or external identity provider.
- Tests will exercise the same Flask routes and service logic that the browser UI uses, keeping the implementation aligned with the constitution's testing requirement.

## Testing Strategy

- Unit-style tests for email normalization, duplicate detection, owner-only owner-role changes, self-protection rules, and delete confirmation handling
- Integration tests with the Flask test client for:
  - member access denial to `/admin/users`
  - admin access to the page
  - add-user success with default `member` role
  - invalid email rejection
  - role updates reflected in the rendered page
  - disable and re-enable flows affecting login eligibility
  - delete confirmation requirement and successful deletion path
- No mocks unless absolutely necessary; prefer the in-memory repository implementation to exercise real service and route logic

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| The repository has no existing product app, auth stack, or persistence layer. | Keep the implementation self-contained in a new Flask package and document assumptions clearly in code and README. |
| Open questions around owner-role assignment and self-service destructive actions could change product behavior later. | Implement conservative defaults now and keep the policy logic centralized in `UserService` for easy revision. |
| File-backed JSON storage is not suitable for concurrent production use. | Hide persistence behind `store.py` so a database-backed repository can replace it without changing routes or templates. |
| UI-only access restrictions could drift from actual authorization behavior. | Enforce role checks server-side in `auth.py` and cover unauthorized cases with route tests. |
| Disabled users might still appear authenticated if future session behavior changes. | Keep login eligibility and session checks centralized so immediate session invalidation can be added in one place later. |

## Dependencies

- Add `Flask` for the web application runtime
- Add `pytest` for automated test coverage
- Confirm whether the conservative owner-role/self-protection assumptions should become permanent product policy before implementation is finalized
