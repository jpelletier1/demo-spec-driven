export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function createTodo(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error('Todo text must be a non-empty string');
  }

  return {
    id: generateId(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
  };
}

export function isValidTodo(todo) {
  return (
    todo !== null &&
    typeof todo === 'object' &&
    typeof todo.id === 'string' &&
    todo.id.length > 0 &&
    typeof todo.text === 'string' &&
    todo.text.length > 0 &&
    typeof todo.completed === 'boolean' &&
    typeof todo.createdAt === 'number'
  );
}
