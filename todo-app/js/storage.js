import { isValidTodo } from './models.js';

const STORAGE_KEY = 'todos-app-data';
const CURRENT_VERSION = 1;

let memoryFallback = null;
let useMemoryFallback = false;

export function isLocalStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

export function initStorage() {
  useMemoryFallback = !isLocalStorageAvailable();
  if (useMemoryFallback) {
    memoryFallback = { todos: [], version: CURRENT_VERSION };
  }
}

function getRawData() {
  if (useMemoryFallback) {
    return memoryFallback;
  }
  
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function setRawData(data) {
  if (useMemoryFallback) {
    memoryFallback = data;
    return true;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
}

function validateData(data) {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  if (!Array.isArray(data.todos)) {
    return false;
  }
  
  if (typeof data.version !== 'number') {
    return false;
  }
  
  return data.todos.every(isValidTodo);
}

function migrateData(data) {
  if (data.version < CURRENT_VERSION) {
    data.version = CURRENT_VERSION;
  }
  return data;
}

export function load() {
  const data = getRawData();
  
  if (!data) {
    return { todos: [], version: CURRENT_VERSION };
  }
  
  if (!validateData(data)) {
    return { todos: [], version: CURRENT_VERSION };
  }
  
  return migrateData(data);
}

export function save(data) {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const dataToSave = {
    todos: Array.isArray(data.todos) ? data.todos : [],
    version: typeof data.version === 'number' ? data.version : CURRENT_VERSION
  };
  
  return setRawData(dataToSave);
}

export function clear() {
  if (useMemoryFallback) {
    memoryFallback = { todos: [], version: CURRENT_VERSION };
    return;
  }
  
  localStorage.removeItem(STORAGE_KEY);
}

export function setMemoryFallbackForTesting(enabled) {
  useMemoryFallback = enabled;
  if (enabled) {
    memoryFallback = { todos: [], version: CURRENT_VERSION };
  }
}

export { STORAGE_KEY, CURRENT_VERSION };
