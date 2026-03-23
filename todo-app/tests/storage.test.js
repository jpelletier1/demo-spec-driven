import { load, save, clear, STORAGE_KEY, CURRENT_VERSION, setMemoryFallbackForTesting } from '../js/storage.js';
import { createTodo } from '../js/models.js';

describe('Storage Module', () => {
  beforeEach(() => {
    localStorage.clear();
    setMemoryFallbackForTesting(false);
  });

  describe('load()', () => {
    it('should return empty data when storage is empty', () => {
      const data = load();
      expect(data).toEqual({ todos: [], version: CURRENT_VERSION });
    });

    it('should load valid data from storage', () => {
      const todo = createTodo('Test todo');
      const storedData = { todos: [todo], version: CURRENT_VERSION };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));

      const data = load();
      expect(data.todos).toHaveLength(1);
      expect(data.todos[0].text).toBe('Test todo');
      expect(data.version).toBe(CURRENT_VERSION);
    });

    it('should return empty data for corrupted JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not valid json{{{');

      const data = load();
      expect(data).toEqual({ todos: [], version: CURRENT_VERSION });
    });

    it('should return empty data for invalid data structure', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ invalid: 'data' }));

      const data = load();
      expect(data).toEqual({ todos: [], version: CURRENT_VERSION });
    });

    it('should return empty data if todos array contains invalid items', () => {
      const invalidData = {
        todos: [{ id: '123', text: 'valid' }],
        version: CURRENT_VERSION
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidData));

      const data = load();
      expect(data).toEqual({ todos: [], version: CURRENT_VERSION });
    });

    it('should migrate data from older versions', () => {
      const todo = createTodo('Old todo');
      const oldData = { todos: [todo], version: 0 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(oldData));

      const data = load();
      expect(data.version).toBe(CURRENT_VERSION);
      expect(data.todos).toHaveLength(1);
    });
  });

  describe('save()', () => {
    it('should save data to storage', () => {
      const todo = createTodo('Test todo');
      const data = { todos: [todo], version: CURRENT_VERSION };

      const result = save(data);
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored.todos).toHaveLength(1);
      expect(stored.todos[0].text).toBe('Test todo');
    });

    it('should return false for null data', () => {
      const result = save(null);
      expect(result).toBe(false);
    });

    it('should handle missing todos array', () => {
      const result = save({ version: 1 });
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored.todos).toEqual([]);
    });

    it('should use current version if version is missing', () => {
      const result = save({ todos: [] });
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored.version).toBe(CURRENT_VERSION);
    });
  });

  describe('clear()', () => {
    it('should remove data from storage', () => {
      const todo = createTodo('Test todo');
      save({ todos: [todo], version: CURRENT_VERSION });

      clear();

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should work when storage is already empty', () => {
      expect(() => clear()).not.toThrow();
    });
  });

  describe('memory fallback', () => {
    beforeEach(() => {
      setMemoryFallbackForTesting(true);
    });

    afterEach(() => {
      setMemoryFallbackForTesting(false);
    });

    it('should save and load using memory fallback', () => {
      const todo = createTodo('Memory todo');
      save({ todos: [todo], version: CURRENT_VERSION });

      const data = load();
      expect(data.todos).toHaveLength(1);
      expect(data.todos[0].text).toBe('Memory todo');
    });

    it('should clear memory fallback', () => {
      const todo = createTodo('Memory todo');
      save({ todos: [todo], version: CURRENT_VERSION });

      clear();

      const data = load();
      expect(data.todos).toEqual([]);
    });
  });
});
