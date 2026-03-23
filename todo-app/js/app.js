import { createTodo } from './models.js';
import { load, save, clear as clearStorage, initStorage } from './storage.js';
import { render, bindEvents, setEditMode, showConfirmDialog } from './ui.js';

let state = {
  todos: [],
  filter: 'all'
};

export function init() {
  initStorage();
  const data = load();
  state.todos = data.todos;
  state.filter = 'all';
  
  setupEventHandlers();
  updateUI();
}

function setupEventHandlers() {
  bindEvents({
    onAdd: addTodo,
    onToggle: toggleTodo,
    onDelete: deleteTodo,
    onEdit: editTodo,
    onStartEdit: startEdit,
    onCancelEdit: cancelEdit,
    onFilter: setFilter,
    onClearAll: handleClearAll
  });
}

function updateUI() {
  render(state.todos, state.filter);
}

function persist() {
  save({ todos: state.todos, version: 1 });
}

export function addTodo(text) {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return null;
  }
  
  const todo = createTodo(text);
  state.todos = [...state.todos, todo];
  persist();
  updateUI();
  return todo;
}

export function editTodo(id, text) {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return null;
  }
  
  const index = state.todos.findIndex(t => t.id === id);
  if (index === -1) {
    return null;
  }
  
  const updatedTodo = { ...state.todos[index], text: text.trim() };
  state.todos = [
    ...state.todos.slice(0, index),
    updatedTodo,
    ...state.todos.slice(index + 1)
  ];
  
  setEditMode(null);
  persist();
  updateUI();
  return updatedTodo;
}

export function deleteTodo(id) {
  const index = state.todos.findIndex(t => t.id === id);
  if (index === -1) {
    return false;
  }
  
  state.todos = state.todos.filter(t => t.id !== id);
  persist();
  updateUI();
  return true;
}

export function toggleTodo(id) {
  const index = state.todos.findIndex(t => t.id === id);
  if (index === -1) {
    return null;
  }
  
  const updatedTodo = { ...state.todos[index], completed: !state.todos[index].completed };
  state.todos = [
    ...state.todos.slice(0, index),
    updatedTodo,
    ...state.todos.slice(index + 1)
  ];
  
  persist();
  updateUI();
  return updatedTodo;
}

export async function handleClearAll() {
  if (state.todos.length === 0) {
    return;
  }
  
  const confirmed = await showConfirmDialog('Are you sure you want to clear all todos?');
  if (confirmed) {
    clearAll();
  }
}

export function clearAll() {
  state.todos = [];
  clearStorage();
  persist();
  updateUI();
}

export function clearCompleted() {
  state.todos = state.todos.filter(t => !t.completed);
  persist();
  updateUI();
}

export function setFilter(filter) {
  if (!['all', 'active', 'completed'].includes(filter)) {
    return;
  }
  
  state.filter = filter;
  updateUI();
}

export function getTodos() {
  return [...state.todos];
}

export function getActiveTodosCount() {
  return state.todos.filter(t => !t.completed).length;
}

export function getFilter() {
  return state.filter;
}

function startEdit(id) {
  setEditMode(id);
  updateUI();
}

function cancelEdit() {
  setEditMode(null);
  updateUI();
}

export function getState() {
  return { ...state, todos: [...state.todos] };
}

export function setState(newState) {
  state = { ...newState, todos: [...newState.todos] };
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}
