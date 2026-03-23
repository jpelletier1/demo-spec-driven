import { 
  addTodo, 
  editTodo, 
  deleteTodo, 
  toggleTodo, 
  clearAll, 
  clearCompleted, 
  setFilter, 
  getTodos, 
  getActiveTodosCount, 
  getFilter, 
  getState, 
  setState 
} from '../js/app.js';
import { setMemoryFallbackForTesting } from '../js/storage.js';

const HTML_TEMPLATE = `
  <div class="app-container">
    <form class="todo-form" id="todo-form">
      <input type="text" id="todo-input">
      <button type="submit">Add</button>
    </form>
    <ul class="todo-list" id="todo-list"></ul>
    <div class="empty-state" id="empty-state" hidden><p></p></div>
    <footer id="todo-footer">
      <div class="filter-buttons">
        <button class="btn btn-filter active" data-filter="all">All</button>
        <button class="btn btn-filter" data-filter="active">Active</button>
        <button class="btn btn-filter" data-filter="completed">Completed</button>
      </div>
      <span id="items-left">0 items left</span>
      <button id="clear-all-btn">Clear All</button>
    </footer>
  </div>
`;

describe('App Controller', () => {
  beforeEach(() => {
    localStorage.clear();
    setMemoryFallbackForTesting(false);
    document.body.innerHTML = HTML_TEMPLATE;
    setState({ todos: [], filter: 'all' });
  });

  describe('addTodo()', () => {
    it('should add a new todo', () => {
      const todo = addTodo('Test todo');
      
      expect(todo).not.toBeNull();
      expect(todo.text).toBe('Test todo');
      expect(todo.completed).toBe(false);
      expect(getTodos()).toHaveLength(1);
    });

    it('should trim whitespace from todo text', () => {
      const todo = addTodo('  Test todo  ');
      
      expect(todo.text).toBe('Test todo');
    });

    it('should return null for empty text', () => {
      const todo = addTodo('');
      
      expect(todo).toBeNull();
      expect(getTodos()).toHaveLength(0);
    });

    it('should return null for whitespace-only text', () => {
      const todo = addTodo('   ');
      
      expect(todo).toBeNull();
      expect(getTodos()).toHaveLength(0);
    });

    it('should return null for non-string input', () => {
      const todo = addTodo(null);
      
      expect(todo).toBeNull();
    });

    it('should persist todos to storage', () => {
      addTodo('Persisted todo');
      
      const stored = JSON.parse(localStorage.getItem('todos-app-data'));
      expect(stored.todos).toHaveLength(1);
      expect(stored.todos[0].text).toBe('Persisted todo');
    });
  });

  describe('editTodo()', () => {
    it('should edit an existing todo', () => {
      const todo = addTodo('Original text');
      const updated = editTodo(todo.id, 'Updated text');
      
      expect(updated.text).toBe('Updated text');
      expect(getTodos()[0].text).toBe('Updated text');
    });

    it('should return null for non-existent todo', () => {
      const result = editTodo('non-existent-id', 'New text');
      
      expect(result).toBeNull();
    });

    it('should return null for empty text', () => {
      const todo = addTodo('Original text');
      const result = editTodo(todo.id, '');
      
      expect(result).toBeNull();
      expect(getTodos()[0].text).toBe('Original text');
    });

    it('should trim whitespace from edited text', () => {
      const todo = addTodo('Original text');
      const updated = editTodo(todo.id, '  Updated text  ');
      
      expect(updated.text).toBe('Updated text');
    });
  });

  describe('deleteTodo()', () => {
    it('should delete an existing todo', () => {
      const todo = addTodo('To be deleted');
      const result = deleteTodo(todo.id);
      
      expect(result).toBe(true);
      expect(getTodos()).toHaveLength(0);
    });

    it('should return false for non-existent todo', () => {
      const result = deleteTodo('non-existent-id');
      
      expect(result).toBe(false);
    });

    it('should persist deletion to storage', () => {
      const todo = addTodo('To be deleted');
      deleteTodo(todo.id);
      
      const stored = JSON.parse(localStorage.getItem('todos-app-data'));
      expect(stored.todos).toHaveLength(0);
    });
  });

  describe('toggleTodo()', () => {
    it('should toggle todo completion status', () => {
      const todo = addTodo('Toggle me');
      expect(todo.completed).toBe(false);
      
      const toggled = toggleTodo(todo.id);
      expect(toggled.completed).toBe(true);
      
      const toggledBack = toggleTodo(todo.id);
      expect(toggledBack.completed).toBe(false);
    });

    it('should return null for non-existent todo', () => {
      const result = toggleTodo('non-existent-id');
      
      expect(result).toBeNull();
    });

    it('should persist toggle to storage', () => {
      const todo = addTodo('Toggle me');
      toggleTodo(todo.id);
      
      const stored = JSON.parse(localStorage.getItem('todos-app-data'));
      expect(stored.todos[0].completed).toBe(true);
    });
  });

  describe('clearAll()', () => {
    it('should remove all todos', () => {
      addTodo('Todo 1');
      addTodo('Todo 2');
      addTodo('Todo 3');
      expect(getTodos()).toHaveLength(3);
      
      clearAll();
      
      expect(getTodos()).toHaveLength(0);
    });

    it('should persist cleared state to storage', () => {
      addTodo('Todo 1');
      clearAll();
      
      const stored = JSON.parse(localStorage.getItem('todos-app-data'));
      expect(stored.todos).toHaveLength(0);
    });
  });

  describe('clearCompleted()', () => {
    it('should remove only completed todos', () => {
      const todo1 = addTodo('Active todo');
      const todo2 = addTodo('Completed todo');
      toggleTodo(todo2.id);
      
      clearCompleted();
      
      expect(getTodos()).toHaveLength(1);
      expect(getTodos()[0].id).toBe(todo1.id);
    });

    it('should do nothing when no completed todos', () => {
      addTodo('Active todo 1');
      addTodo('Active todo 2');
      
      clearCompleted();
      
      expect(getTodos()).toHaveLength(2);
    });
  });

  describe('setFilter()', () => {
    it('should set filter to all', () => {
      setFilter('all');
      expect(getFilter()).toBe('all');
    });

    it('should set filter to active', () => {
      setFilter('active');
      expect(getFilter()).toBe('active');
    });

    it('should set filter to completed', () => {
      setFilter('completed');
      expect(getFilter()).toBe('completed');
    });

    it('should ignore invalid filter values', () => {
      setFilter('all');
      setFilter('invalid');
      expect(getFilter()).toBe('all');
    });
  });

  describe('getActiveTodosCount()', () => {
    it('should return count of active todos', () => {
      addTodo('Active 1');
      const todo2 = addTodo('Completed');
      toggleTodo(todo2.id);
      addTodo('Active 2');
      
      expect(getActiveTodosCount()).toBe(2);
    });

    it('should return 0 when all todos are completed', () => {
      const todo1 = addTodo('Todo 1');
      const todo2 = addTodo('Todo 2');
      toggleTodo(todo1.id);
      toggleTodo(todo2.id);
      
      expect(getActiveTodosCount()).toBe(0);
    });

    it('should return 0 when no todos exist', () => {
      expect(getActiveTodosCount()).toBe(0);
    });
  });
});
