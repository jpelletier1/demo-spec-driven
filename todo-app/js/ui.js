let currentEditId = null;

export function renderTodos(todos, filter) {
  const todoList = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  
  if (!todoList || !emptyState) return;
  
  const filteredTodos = filterTodos(todos, filter);
  
  todoList.innerHTML = '';
  
  if (filteredTodos.length === 0) {
    emptyState.hidden = false;
    todoList.hidden = true;
    
    if (todos.length === 0) {
      emptyState.querySelector('p').textContent = 'No todos yet. Add one above!';
    } else {
      emptyState.querySelector('p').textContent = `No ${filter} todos.`;
    }
  } else {
    emptyState.hidden = true;
    todoList.hidden = false;
    
    filteredTodos.forEach(todo => {
      const li = createTodoElement(todo);
      todoList.appendChild(li);
    });
  }
}

function filterTodos(todos, filter) {
  switch (filter) {
    case 'active':
      return todos.filter(t => !t.completed);
    case 'completed':
      return todos.filter(t => t.completed);
    default:
      return todos;
  }
}

function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.completed ? ' completed' : ''}`;
  li.dataset.id = todo.id;
  
  if (currentEditId === todo.id) {
    li.innerHTML = `
      <form class="todo-edit-form" data-id="${todo.id}">
        <input type="text" class="todo-edit-input" value="${escapeHtml(todo.text)}" required>
        <button type="submit" class="btn btn-primary btn-sm">Save</button>
        <button type="button" class="btn btn-cancel btn-sm" data-action="cancel-edit">Cancel</button>
      </form>
    `;
    
    setTimeout(() => {
      const input = li.querySelector('.todo-edit-input');
      if (input) {
        input.focus();
        input.select();
      }
    }, 0);
  } else {
    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} aria-label="Mark as ${todo.completed ? 'incomplete' : 'complete'}">
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <div class="todo-actions">
        <button type="button" class="btn-icon edit" data-action="edit" aria-label="Edit todo">✏️</button>
        <button type="button" class="btn-icon delete" data-action="delete" aria-label="Delete todo">🗑️</button>
      </div>
    `;
  }
  
  return li;
}

export function renderFooter(todos, filter) {
  const footer = document.getElementById('todo-footer');
  const itemsLeft = document.getElementById('items-left');
  const filterButtons = document.querySelectorAll('.btn-filter');
  const clearAllBtn = document.getElementById('clear-all-btn');
  
  if (!footer) return;
  
  if (todos.length === 0) {
    footer.hidden = true;
    return;
  }
  
  footer.hidden = false;
  
  const activeCount = todos.filter(t => !t.completed).length;
  if (itemsLeft) {
    itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
  }
  
  filterButtons.forEach(btn => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });
  
  if (clearAllBtn) {
    clearAllBtn.disabled = todos.length === 0;
  }
}

export function render(todos, filter) {
  renderTodos(todos, filter);
  renderFooter(todos, filter);
}

export function bindEvents(handlers) {
  const form = document.getElementById('todo-form');
  const todoList = document.getElementById('todo-list');
  const filterButtons = document.querySelectorAll('.btn-filter');
  const clearAllBtn = document.getElementById('clear-all-btn');
  
  if (form && handlers.onAdd) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('todo-input');
      const text = input.value.trim();
      if (text) {
        handlers.onAdd(text);
        input.value = '';
        input.focus();
      }
    });
  }
  
  if (todoList) {
    todoList.addEventListener('click', (e) => {
      const todoItem = e.target.closest('.todo-item');
      if (!todoItem) return;
      
      const id = todoItem.dataset.id;
      
      if (e.target.classList.contains('todo-checkbox') && handlers.onToggle) {
        handlers.onToggle(id);
      }
      
      if (e.target.dataset.action === 'delete' && handlers.onDelete) {
        handlers.onDelete(id);
      }
      
      if (e.target.dataset.action === 'edit' && handlers.onStartEdit) {
        handlers.onStartEdit(id);
      }
      
      if (e.target.dataset.action === 'cancel-edit' && handlers.onCancelEdit) {
        handlers.onCancelEdit();
      }
    });
    
    todoList.addEventListener('submit', (e) => {
      if (e.target.classList.contains('todo-edit-form')) {
        e.preventDefault();
        const id = e.target.dataset.id;
        const input = e.target.querySelector('.todo-edit-input');
        const text = input.value.trim();
        if (text && handlers.onEdit) {
          handlers.onEdit(id, text);
        }
      }
    });
    
    todoList.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && currentEditId && handlers.onCancelEdit) {
        handlers.onCancelEdit();
      }
    });
  }
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (handlers.onFilter) {
        handlers.onFilter(btn.dataset.filter);
      }
    });
  });
  
  if (clearAllBtn && handlers.onClearAll) {
    clearAllBtn.addEventListener('click', () => {
      handlers.onClearAll();
    });
  }
}

export function setEditMode(id) {
  currentEditId = id;
}

export function getEditMode() {
  return currentEditId;
}

export function showConfirmDialog(message) {
  return Promise.resolve(confirm(message));
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
