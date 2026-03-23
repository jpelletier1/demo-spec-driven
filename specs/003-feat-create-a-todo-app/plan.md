# Implementation Plan: Todo App

> Spec: [spec.md](./spec.md)
> Status: Draft

## Technical Approach

Build a lightweight, browser-based todo application using vanilla HTML, CSS, and JavaScript. This approach aligns with the user's explicit request to "keep it simple" and matches the existing project's technology stack (as seen in `presentation.html`). The app will use localStorage for persistence, eliminating the need for any backend infrastructure.

The architecture follows a modular pattern with separation of concerns: a storage layer for data persistence, a state management module for business logic, and UI components for rendering and user interaction.

## Technology Stack

- **Framework:** None (vanilla JavaScript ES6+)
- **Styling:** Vanilla CSS with CSS custom properties for theming
- **Storage:** Browser localStorage API
- **Testing:** Jest with jsdom for unit tests
- **Patterns:** Module pattern, Event-driven architecture, Single responsibility principle

## Architecture

### Components

1. **Storage Module** (`storage.js`)
   - Handles localStorage read/write operations
   - Provides abstraction layer for data persistence
   - Includes data validation and error handling

2. **Todo Model** (`models.js`)
   - Defines Todo data structure
   - Provides factory function for creating todos
   - Handles todo ID generation

3. **App Controller** (`app.js`)
   - Main application logic and state management
   - CRUD operations on todos
   - Coordinates between storage and UI

4. **UI Renderer** (`ui.js`)
   - Renders todo list to DOM
   - Handles user input and events
   - Updates view based on state changes

### Data Model

```javascript
// Todo object structure
{
  id: string,         // Unique identifier (UUID or timestamp-based)
  text: string,       // Todo description
  completed: boolean, // Completion status
  createdAt: number   // Timestamp of creation
}

// Storage key
const STORAGE_KEY = 'todos-app-data';

// Stored data format
{
  todos: Todo[],
  version: number     // For future data migrations
}
```

### Application State

```javascript
// Runtime state
{
  todos: Todo[],        // Array of all todos
  filter: 'all' | 'active' | 'completed'  // Current filter view
}
```

### API/Interface Contracts

```javascript
// Storage API
Storage.load(): { todos: Todo[], version: number } | null
Storage.save(data: { todos: Todo[], version: number }): boolean
Storage.clear(): void

// App API
App.init(): void
App.addTodo(text: string): Todo
App.editTodo(id: string, text: string): Todo | null
App.deleteTodo(id: string): boolean
App.toggleTodo(id: string): Todo | null
App.clearAll(): void
App.clearCompleted(): void
App.setFilter(filter: string): void
App.getTodos(): Todo[]
App.getActiveTodosCount(): number

// UI API
UI.render(todos: Todo[], filter: string): void
UI.bindEvents(handlers: object): void
UI.showConfirmDialog(message: string): Promise<boolean>
```

## File Changes

### New Files

```
todo-app/
├── index.html          # Main HTML entry point
├── css/
│   └── styles.css      # Application styles
├── js/
│   ├── storage.js      # LocalStorage abstraction
│   ├── models.js       # Todo data model
│   ├── app.js          # Application controller
│   └── ui.js           # UI rendering and events
└── tests/
    ├── storage.test.js # Storage module tests
    ├── app.test.js     # App logic tests
    └── setup.js        # Jest test setup
```

### New Files - Details

- `todo-app/index.html` - Single-page HTML structure with semantic markup, references CSS and JS files
- `todo-app/css/styles.css` - Complete styling with visual distinction for completed todos, responsive layout, empty state styling
- `todo-app/js/storage.js` - localStorage wrapper with error handling and data validation
- `todo-app/js/models.js` - Todo factory and ID generation utilities
- `todo-app/js/app.js` - Main application logic, event handling, state management
- `todo-app/js/ui.js` - DOM manipulation, event binding, rendering logic
- `todo-app/tests/storage.test.js` - Unit tests for storage module
- `todo-app/tests/app.test.js` - Unit tests for app business logic
- `todo-app/tests/setup.js` - Test environment configuration

### Modified Files

- `package.json` - Create if not exists, add Jest as dev dependency for testing

### Configuration Files

- `todo-app/jest.config.js` - Jest configuration for jsdom environment

## UI Design

### Layout Structure

```
┌────────────────────────────────────────┐
│           📝 Todo App                  │
├────────────────────────────────────────┤
│  ┌──────────────────────────┐ ┌─────┐  │
│  │ What needs to be done?   │ │ Add │  │
│  └──────────────────────────┘ └─────┘  │
├────────────────────────────────────────┤
│  ☐ Buy groceries                 ✏️ 🗑️ │
│  ☑ Complete project report       ✏️ 🗑️ │
│  ☐ Call mom                      ✏️ 🗑️ │
├────────────────────────────────────────┤
│  [All] [Active] [Completed]            │
│                                        │
│  2 items left          [Clear All]     │
└────────────────────────────────────────┘
```

### Visual States

- **Normal todo:** Regular text, unchecked checkbox
- **Completed todo:** Strikethrough text, muted color, checked checkbox
- **Empty state:** Centered message "No todos yet. Add one above!"
- **Edit mode:** Input field replaces todo text with save/cancel buttons

## Integration Points

This is a standalone application with no integration dependencies on existing code. It will be placed in a new `todo-app/` directory at the project root.

The app follows the same design principles visible in `presentation.html`:
- CSS custom properties for consistent theming
- Clean, modern aesthetic
- Responsive design considerations

## Testing Strategy

### Unit Tests
- **Storage module:** Test localStorage read/write, error handling, data validation
- **App logic:** Test CRUD operations, filtering, state management
- **Model:** Test todo creation, ID uniqueness

### Manual Testing Checklist
- [ ] Create new todo with text input
- [ ] Edit existing todo inline
- [ ] Delete individual todo
- [ ] Toggle todo completion
- [ ] Clear all todos with confirmation
- [ ] Verify persistence after page refresh
- [ ] Test empty state display
- [ ] Test filter functionality (all/active/completed)
- [ ] Verify completed todos visual styling

### Test Commands
```bash
cd todo-app
npm install
npm test
```

## Implementation Order

1. **Phase 1: Core Structure**
   - Create directory structure
   - Set up HTML skeleton
   - Basic CSS styling

2. **Phase 2: Data Layer**
   - Implement storage module
   - Implement todo model
   - Write storage tests

3. **Phase 3: Business Logic**
   - Implement app controller
   - Add CRUD operations
   - Write app tests

4. **Phase 4: UI Layer**
   - Implement UI renderer
   - Add event handlers
   - Wire everything together

5. **Phase 5: Polish**
   - Add confirmation dialogs
   - Implement filters
   - Final styling and responsive design

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| localStorage not available (private browsing) | Low | Medium | Add feature detection and graceful degradation with in-memory fallback |
| XSS through todo text | Medium | High | Sanitize all user input before rendering to DOM using textContent instead of innerHTML |
| Data corruption in localStorage | Low | Medium | Add version field for future migrations, validate data on load |
| Browser compatibility issues | Low | Low | Use ES6+ features supported in all modern browsers, no transpilation needed |

## Dependencies

### Runtime Dependencies
- None (vanilla browser APIs only)

### Development Dependencies
- `jest` ^29.x - Testing framework
- `jest-environment-jsdom` ^29.x - DOM simulation for tests

## Accessibility Considerations

- Semantic HTML elements (`<main>`, `<header>`, `<ul>`, `<li>`)
- Proper form labels and ARIA attributes
- Keyboard navigation support (tab order, enter to submit)
- Focus management for edit mode
- Sufficient color contrast for completed/incomplete states

## Performance Considerations

- Efficient DOM updates (update only changed elements)
- Debounce localStorage writes if needed
- Minimal JavaScript bundle (no framework overhead)
- No external API calls

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

(ES6 modules and modern CSS features are well-supported in these versions)
