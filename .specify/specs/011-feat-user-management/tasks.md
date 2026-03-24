# Task Breakdown: feat: User management

> Spec: [spec.md](./spec.md)
> Plan: [plan.md](./plan.md)
> Status: Ready for Implementation

## Prerequisites

- [ ] Python 3 available in development environment
- [ ] Git configured for commits

## Phase 1: Project Foundation

### Task 1.1: Create requirements.txt
- **File(s):** `requirements.txt`
- **Description:** Create requirements file with Flask and pytest dependencies for the new application
- **Depends on:** None
- **Parallel:** No

### Task 1.2: Update .gitignore
- **File(s):** `.gitignore`
- **Description:** Add Flask runtime artifacts to gitignore (instance/, __pycache__/, *.pyc, .pytest_cache/)
- **Depends on:** None
- **Parallel:** Yes (can run with 1.1)

### Task 1.3: Create user_admin package directory
- **File(s):** `user_admin/__init__.py`
- **Description:** Create the Flask app factory with basic configuration, secret key setup, and route registration placeholder
- **Depends on:** Task 1.1
- **Parallel:** No

## Phase 2: Core Models & Data Layer

### Task 2.1: Create User model and role constants
- **File(s):** `user_admin/models.py`
- **Description:** Define User dataclass with id, email, role, disabled, created_at fields and role constants (MEMBER, ADMIN, OWNER)
- **Depends on:** Task 1.3
- **Parallel:** No

### Task 2.2: Create repository interface and in-memory store
- **File(s):** `user_admin/store.py`
- **Description:** Implement UserRepository base class and InMemoryUserRepository with CRUD operations (get_all, get_by_id, get_by_email, save, delete)
- **Depends on:** Task 2.1
- **Parallel:** No

### Task 2.3: Add file-backed JSON store [P]
- **File(s):** `user_admin/store.py`
- **Description:** Implement FileUserRepository that persists users to JSON file in Flask instance directory
- **Depends on:** Task 2.2
- **Parallel:** Yes (can run with 2.4)

### Task 2.4: Create UserService with validation logic [P]
- **File(s):** `user_admin/service.py`
- **Description:** Implement UserService with email normalization, duplicate detection, and basic add_user method
- **Depends on:** Task 2.2
- **Parallel:** Yes (can run with 2.3)

## Phase 3: Authentication Layer

### Task 3.1: Create auth helpers
- **File(s):** `user_admin/auth.py`
- **Description:** Implement session-based login/logout helpers, get_current_user function, and login_required decorator
- **Depends on:** Task 2.1
- **Parallel:** No

### Task 3.2: Add role-based access guard
- **File(s):** `user_admin/auth.py`
- **Description:** Add admin_required decorator that checks current user has Admin or Owner role
- **Depends on:** Task 3.1
- **Parallel:** No

### Task 3.3: Add disabled user login prevention
- **File(s):** `user_admin/auth.py`
- **Description:** Implement check to reject login attempts from disabled users
- **Depends on:** Task 3.2
- **Parallel:** No

## Phase 4: User Management Business Logic

### Task 4.1: Add role change logic to UserService
- **File(s):** `user_admin/service.py`
- **Description:** Implement change_role method with owner-only owner-role assignment rule
- **Depends on:** Task 2.4
- **Parallel:** No

### Task 4.2: Add self-protection rules to UserService
- **File(s):** `user_admin/service.py`
- **Description:** Add validation to prevent users from changing, disabling, or deleting their own account
- **Depends on:** Task 4.1
- **Parallel:** No

### Task 4.3: Add enable/disable user logic [P]
- **File(s):** `user_admin/service.py`
- **Description:** Implement toggle_user_status method to enable/disable users
- **Depends on:** Task 4.2
- **Parallel:** Yes (can run with 4.4)

### Task 4.4: Add delete user logic [P]
- **File(s):** `user_admin/service.py`
- **Description:** Implement delete_user method requiring confirmation parameter
- **Depends on:** Task 4.2
- **Parallel:** Yes (can run with 4.3)

## Phase 5: Templates

### Task 5.1: Create base template
- **File(s):** `user_admin/templates/base.html`
- **Description:** Create shared HTML layout with flash message display area for success/error feedback
- **Depends on:** Task 1.3
- **Parallel:** No

### Task 5.2: Create login template [P]
- **File(s):** `user_admin/templates/login.html`
- **Description:** Create minimal login form with email input extending base template
- **Depends on:** Task 5.1
- **Parallel:** Yes (can run with 5.3)

### Task 5.3: Create user management template [P]
- **File(s):** `user_admin/templates/admin/users.html`
- **Description:** Create admin page with user list table, add-user form, role dropdowns, status toggles, and delete buttons with confirmation
- **Depends on:** Task 5.1
- **Parallel:** Yes (can run with 5.2)

## Phase 6: Route Handlers

### Task 6.1: Create login/logout routes
- **File(s):** `user_admin/routes.py`
- **Description:** Implement GET/POST /login and POST /logout routes with session management
- **Depends on:** Task 3.3, Task 5.2
- **Parallel:** No

### Task 6.2: Create root redirect route
- **File(s):** `user_admin/routes.py`
- **Description:** Implement GET / to redirect to login or admin page based on session state
- **Depends on:** Task 6.1
- **Parallel:** No

### Task 6.3: Create user list route
- **File(s):** `user_admin/routes.py`
- **Description:** Implement GET /admin/users protected route to render user management page
- **Depends on:** Task 3.2, Task 5.3
- **Parallel:** No

### Task 6.4: Create add user route
- **File(s):** `user_admin/routes.py`
- **Description:** Implement POST /admin/users to add user by email with validation and flash feedback
- **Depends on:** Task 6.3, Task 4.2
- **Parallel:** No

### Task 6.5: Create role change route [P]
- **File(s):** `user_admin/routes.py`
- **Description:** Implement POST /admin/users/<user_id>/role to update user role with proper authorization
- **Depends on:** Task 6.4, Task 4.2
- **Parallel:** Yes (can run with 6.6, 6.7)

### Task 6.6: Create status toggle route [P]
- **File(s):** `user_admin/routes.py`
- **Description:** Implement POST /admin/users/<user_id>/status to enable/disable users
- **Depends on:** Task 6.4, Task 4.3
- **Parallel:** Yes (can run with 6.5, 6.7)

### Task 6.7: Create delete user route [P]
- **File(s):** `user_admin/routes.py`
- **Description:** Implement POST /admin/users/<user_id>/delete with confirmation requirement
- **Depends on:** Task 6.4, Task 4.4
- **Parallel:** Yes (can run with 6.5, 6.6)

### Task 6.8: Register routes in app factory
- **File(s):** `user_admin/__init__.py`
- **Description:** Update app factory to register all route blueprints
- **Depends on:** Task 6.7
- **Parallel:** No

## Phase 7: Integration & Testing

### Task 7.1: Create test fixtures
- **File(s):** `tests/test_user_management.py`
- **Description:** Set up pytest fixtures with test Flask app using in-memory repository and pre-seeded test users (member, admin, owner)
- **Depends on:** Task 6.8
- **Parallel:** No

### Task 7.2: Write access control tests [P]
- **File(s):** `tests/test_user_management.py`
- **Description:** Test member denied access to /admin/users, admin and owner granted access
- **Depends on:** Task 7.1
- **Parallel:** Yes (can run with 7.3, 7.4, 7.5)

### Task 7.3: Write add user tests [P]
- **File(s):** `tests/test_user_management.py`
- **Description:** Test add user success with default member role, duplicate email rejection, invalid email rejection
- **Depends on:** Task 7.1
- **Parallel:** Yes (can run with 7.2, 7.4, 7.5)

### Task 7.4: Write role change tests [P]
- **File(s):** `tests/test_user_management.py`
- **Description:** Test role updates reflected in page, owner-only owner-role assignment, self-role-change prevention
- **Depends on:** Task 7.1
- **Parallel:** Yes (can run with 7.2, 7.3, 7.5)

### Task 7.5: Write enable/disable tests [P]
- **File(s):** `tests/test_user_management.py`
- **Description:** Test disable flow blocks login, re-enable restores access, self-disable prevention
- **Depends on:** Task 7.1
- **Parallel:** Yes (can run with 7.2, 7.3, 7.4)

### Task 7.6: Write delete user tests
- **File(s):** `tests/test_user_management.py`
- **Description:** Test delete requires confirmation, successful deletion removes user, self-delete prevention
- **Depends on:** Task 7.5
- **Parallel:** No

### Task 7.7: Verify all tests pass
- **File(s):** N/A
- **Description:** Run full test suite and ensure 100% of tests pass
- **Depends on:** Task 7.6
- **Parallel:** No

## Phase 8: Documentation

### Task 8.1: Update README.md
- **File(s):** `README.md`
- **Description:** Document how to install dependencies, run the Flask app, and execute tests
- **Depends on:** Task 7.7
- **Parallel:** No

## Checkpoints

- [ ] After Phase 1: Project structure in place, dependencies defined
- [ ] After Phase 2: Data layer complete, can create/store users
- [ ] After Phase 3: Authentication working, role guards enforced
- [ ] After Phase 4: All business rules implemented in service layer
- [ ] After Phase 5: Templates render correctly
- [ ] After Phase 6: All routes functional, POST-Redirect-GET pattern working
- [ ] After Phase 7: All tests pass, no mocks used
- [ ] After Phase 8: Documentation complete, ready for PR
