# Task Breakdown: Todo App

> Spec: [spec.md](./spec.md)
> Plan: [plan.md](./plan.md)
> Status: Ready for Implementation

## Prerequisites

- [ ] Ensure Node.js is available for running tests
- [ ] Review spec and plan for full understanding of requirements

## Phase 1: Project Structure & Foundation

### Task 1.1: Create Directory Structure
- **File(s):** `todo-app/`, `todo-app/css/`, `todo-app/js/`, `todo-app/tests/`
- **Description:** Create the directory structure for the todo app with folders for CSS, JavaScript, and tests
- **Depends on:** None
- **Parallel:** No

### Task 1.2: Create HTML Skeleton
- **File(s):** `todo-app/index.html`
- **Description:** Create the main HTML file with semantic markup including header, input form, todo list container, filter buttons, and footer with clear all button. Include proper ARIA attributes for accessibility.
- **Depends on:** Task 1.1
- **Parallel:** No

### Task 1.3: Create Base CSS Styles [P]
- **File(s):** `todo-app/css/styles.css`
- **Description:** Create CSS styles with custom properties for theming, layout styles for header/main/footer, input and button styling, todo list styling with visual distinction for completed items, empty state styling, and responsive design
- **Depends on:** Task 1.2
- **Parallel:** Yes (can run with 1.4)

### Task 1.4: Create Package Configuration [P]
- **File(s):** `todo-app/package.json`
- **Description:** Create package.json with project name, scripts for testing, and Jest as dev dependency
- **Depends on:** Task 1.1
- **Parallel:** Yes (can run with 1.3)

### Task 1.5: Create Jest Configuration
- **File(s):** `todo-app/jest.config.js`, `todo-app/tests/setup.js`
- **Description:** Configure Jest with jsdom environment for DOM testing, create setup file for test environment
- **Depends on:** Task 1.4
- **Parallel:** No

## Phase 2: Data Layer

### Task 2.1: Implement Todo Model
- **File(s):** `todo-app/js/models.js`
- **Description:** Create Todo data structure with factory function, UUID/timestamp-based ID generation, and properties for id, text, completed, and createdAt
- **Depends on:** Task 1.1
- **Parallel:** No

### Task 2.2: Implement Storage Module
- **File(s):** `todo-app/js/storage.js`
- **Description:** Create localStorage abstraction with load(), save(), and clear() methods. Include data validation, error handling, and version field for future migrations
- **Depends on:** Task 2.1
- **Parallel:** No

### Task 2.3: Write Storage Module Tests
- **File(s):** `todo-app/tests/storage.test.js`
- **Description:** Write unit tests for storage module covering load/save operations, error handling, data validation, and edge cases (empty storage, corrupted data)
- **Depends on:** Task 2.2, Task 1.5
- **Parallel:** No

## Phase 3: Business Logic

### Task 3.1: Implement App Controller - Core CRUD
- **File(s):** `todo-app/js/app.js`
- **Description:** Create app controller with init(), addTodo(), editTodo(), deleteTodo(), and toggleTodo() methods. Implement state management for todos array
- **Depends on:** Task 2.2
- **Parallel:** No

### Task 3.2: Implement App Controller - Bulk Operations & Filters
- **File(s):** `todo-app/js/app.js`
- **Description:** Add clearAll(), clearCompleted(), setFilter(), getTodos(), and getActiveTodosCount() methods. Implement filter state management
- **Depends on:** Task 3.1
- **Parallel:** No

### Task 3.3: Write App Controller Tests
- **File(s):** `todo-app/tests/app.test.js`
- **Description:** Write unit tests for app controller covering all CRUD operations, filtering, state management, persistence calls, and edge cases
- **Depends on:** Task 3.2, Task 2.3
- **Parallel:** No

## Phase 4: UI Layer

### Task 4.1: Implement UI Renderer - Todo List
- **File(s):** `todo-app/js/ui.js`
- **Description:** Create render() function to display todos in the DOM. Handle todo item rendering with checkbox, text, edit and delete buttons. Show empty state when no todos exist
- **Depends on:** Task 1.2
- **Parallel:** No

### Task 4.2: Implement UI Renderer - Filters & Counter
- **File(s):** `todo-app/js/ui.js`
- **Description:** Add filter button rendering with active state indication, implement active todos counter display, implement clear all button state
- **Depends on:** Task 4.1
- **Parallel:** No

### Task 4.3: Implement UI Event Binding
- **File(s):** `todo-app/js/ui.js`
- **Description:** Implement bindEvents() to attach event handlers for add todo form, toggle checkbox clicks, delete button clicks, edit button clicks, filter button clicks, and clear all button
- **Depends on:** Task 4.2
- **Parallel:** No

### Task 4.4: Implement Edit Mode UI
- **File(s):** `todo-app/js/ui.js`
- **Description:** Add inline edit functionality with input field replacing todo text, save/cancel buttons or enter/escape keyboard handling, and focus management
- **Depends on:** Task 4.3
- **Parallel:** No

### Task 4.5: Implement Confirmation Dialog
- **File(s):** `todo-app/js/ui.js`
- **Description:** Create showConfirmDialog() function for clear all confirmation. Use native confirm() or implement custom modal dialog
- **Depends on:** Task 4.4
- **Parallel:** No

## Phase 5: Integration

### Task 5.1: Wire Components Together
- **File(s):** `todo-app/js/app.js`, `todo-app/index.html`
- **Description:** Connect all modules: initialize app on DOMContentLoaded, bind UI events to app controller methods, trigger re-renders on state changes
- **Depends on:** Task 3.2, Task 4.5
- **Parallel:** No

### Task 5.2: Add XSS Protection
- **File(s):** `todo-app/js/ui.js`
- **Description:** Ensure all user input is sanitized before rendering to DOM using textContent instead of innerHTML. Review all DOM manipulation for XSS vulnerabilities
- **Depends on:** Task 5.1
- **Parallel:** No

### Task 5.3: Add LocalStorage Feature Detection
- **File(s):** `todo-app/js/storage.js`
- **Description:** Add feature detection for localStorage availability (private browsing mode). Implement graceful degradation with in-memory fallback
- **Depends on:** Task 5.1
- **Parallel:** No

## Phase 6: Polish & Testing

### Task 6.1: Final CSS Polish [P]
- **File(s):** `todo-app/css/styles.css`
- **Description:** Add hover states, transitions, focus indicators for accessibility, ensure color contrast meets WCAG guidelines, fine-tune responsive breakpoints
- **Depends on:** Task 5.1
- **Parallel:** Yes (can run with 6.2)

### Task 6.2: Add Keyboard Navigation [P]
- **File(s):** `todo-app/js/ui.js`
- **Description:** Implement keyboard shortcuts: Enter to add/save todo, Escape to cancel edit, proper tab order through all interactive elements
- **Depends on:** Task 5.1
- **Parallel:** Yes (can run with 6.1)

### Task 6.3: Manual Testing & Bug Fixes
- **File(s):** Various
- **Description:** Perform manual testing checklist from plan: create/edit/delete todos, toggle completion, clear all with confirmation, persistence after refresh, empty state, filters, completed styling
- **Depends on:** Task 6.1, Task 6.2
- **Parallel:** No

### Task 6.4: Run All Tests & Fix Failures
- **File(s):** `todo-app/tests/*.test.js`
- **Description:** Run full test suite with `npm test`, fix any failing tests, ensure all acceptance criteria are met
- **Depends on:** Task 6.3
- **Parallel:** No

## Checkpoints

- [ ] After Phase 1: Directory structure complete, HTML skeleton renders in browser
- [ ] After Phase 2: Storage module passes all tests, data persists correctly
- [ ] After Phase 3: App controller passes all tests, CRUD operations work in isolation
- [ ] After Phase 4: UI renders correctly, all user interactions work
- [ ] After Phase 5: Full app integration works end-to-end
- [ ] After Phase 6: All tests pass, manual testing complete, app is production-ready

## Summary

| Phase | Tasks | Estimated Effort |
|-------|-------|------------------|
| Phase 1: Foundation | 5 tasks | ~1.5 hours |
| Phase 2: Data Layer | 3 tasks | ~1 hour |
| Phase 3: Business Logic | 3 tasks | ~1.5 hours |
| Phase 4: UI Layer | 5 tasks | ~2 hours |
| Phase 5: Integration | 3 tasks | ~1 hour |
| Phase 6: Polish & Testing | 4 tasks | ~1.5 hours |
| **Total** | **23 tasks** | **~8.5 hours** |
