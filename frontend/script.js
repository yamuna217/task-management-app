const API_URL = 'https://task-management-backend-vpv8.onrender.com/api';
const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');
const dashboardView = document.getElementById('dashboardView');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const userName = document.getElementById('userName');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const dashboardMessage = document.getElementById('dashboardMessage');
const taskFormTitle = document.getElementById('taskFormTitle');
const taskSubmitBtn = document.getElementById('taskSubmitBtn');

let editingTaskId = null;
let currentTasks = [];

function setMessage(element, type, text) {
  if (!element) return;
  element.className = `message ${type}`;
  element.textContent = text;
}

function clearMessage(element) {
  if (!element) return;
  element.className = 'message';
  element.textContent = '';
}

function showAuthView(viewName) {
  const showLogin = viewName === 'login';
  loginView.classList.toggle('hidden', !showLogin);
  registerView.classList.toggle('hidden', showLogin);
  dashboardView.classList.add('hidden');

  clearMessage(loginMessage);
  clearMessage(registerMessage);
  clearMessage(dashboardMessage);
}

function showDashboardView() {
  loginView.classList.add('hidden');
  registerView.classList.add('hidden');
  dashboardView.classList.remove('hidden');

  clearMessage(loginMessage);
  clearMessage(registerMessage);
  clearMessage(dashboardMessage);
}

function setButtonLoading(button, loading, text) {
  if (!button) return;
  button.disabled = loading;
  button.textContent = loading ? text : button.dataset.originalText || text;
}

function getToken() {
  return localStorage.getItem('token');
}

function saveUser(user) {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

function getStoredUser() {
  const rawUser = localStorage.getItem('user');
  return rawUser ? JSON.parse(rawUser) : null;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  editingTaskId = null;
  resetTaskForm();
  userName.textContent = 'User';
  showAuthView('login');
}

function resetTaskForm() {
  taskForm.reset();
  taskFormTitle.textContent = 'Add Task';
  taskSubmitBtn.textContent = 'Add Task';
  editingTaskId = null;
}

function showDashboard() {
  const savedUser = getStoredUser();
  if (savedUser && savedUser.name) {
    userName.textContent = savedUser.name;
  }
  showDashboardView();
  fetchTasks();
}

async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = (formData.get('email') || '').trim();
  const password = (formData.get('password') || '').trim();

  if (!email || !password) {
    setMessage(loginMessage, 'error', 'Please enter email and password.');
    return;
  }

  const button = loginForm.querySelector('button[type="submit"]');
  setButtonLoading(button, true, 'Logging in...');

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed.');
    }

    localStorage.setItem('token', data.token);
    saveUser(data.user);
    userName.textContent = data.user?.name || 'User';
    showDashboardView();
    loginForm.reset();
    await fetchTasks();
  } catch (error) {
    setMessage(loginMessage, 'error', error.message || 'Unable to login.');
  } finally {
    setButtonLoading(button, false, 'Login');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const formData = new FormData(registerForm);
  const name = (formData.get('name') || '').trim();
  const email = (formData.get('email') || '').trim();
  const password = (formData.get('password') || '').trim();

  if (!name || !email || !password) {
    setMessage(registerMessage, 'error', 'Please fill in all registration fields.');
    return;
  }

  const button = registerForm.querySelector('button[type="submit"]');
  setButtonLoading(button, true, 'Creating account...');

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed.');
    }

    localStorage.setItem('token', data.token);
    saveUser(data.user);
    userName.textContent = data.user?.name || 'User';
    showDashboardView();
    registerForm.reset();
    await fetchTasks();
  } catch (error) {
    setMessage(registerMessage, 'error', error.message || 'Unable to register.');
  } finally {
    setButtonLoading(button, false, 'Register');
  }
}

async function fetchTasks() {
  const token = getToken();

  if (!token) {
    logout();
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return;
      }
      throw new Error(data.message || 'Unable to fetch tasks.');
    }

    const tasks = Array.isArray(data) ? data : data.tasks || [];
    renderTasks(tasks);
  } catch (error) {
    setMessage(dashboardMessage, 'error', error.message || 'Unable to load tasks.');
  }
}

// ================================
// DASHBOARD STATISTICS
// ================================

function updateDashboardStats(tasks) {
  const total = tasks.length;

  const pending = tasks.filter(
    (task) => task.status === 'pending'
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === 'in-progress'
  ).length;

  const completed = tasks.filter(
    (task) => task.status === 'completed'
  ).length;

  const completionRate =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  setText('totalTasks', total);
  setText('pendingTasks', pending);
  setText('inProgressTasks', inProgress);
  setText('completedTasks', completed);

  setText('overviewTotal', total);
  setText('overviewPending', pending);
  setText('overviewProgress', inProgress);
  setText('overviewCompleted', completed);

  setText('completionRate', `${completionRate}%`);
  setText('productivityPercent', `${completionRate}%`);
    const pendingPercent =
    total === 0 ? 0 : Math.round((pending / total) * 100);

  const progressPercent =
    total === 0 ? 0 : Math.round((inProgress / total) * 100);

  const completedPercent =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  setText('pendingPercent', `${pendingPercent}%`);
  setText('progressPercent', `${progressPercent}%`);
  setText('completedPercent', `${completedPercent}%`);

  const pendingBar = document.getElementById('pendingBar');
  const progressBar = document.getElementById('progressBar');
  const completedBar = document.getElementById('completedBar');
  const productivityBar = document.getElementById('productivityBar');

  if (pendingBar) {
    pendingBar.style.width = `${pendingPercent}%`;
  }

  if (progressBar) {
    progressBar.style.width = `${progressPercent}%`;
  }

  if (completedBar) {
    completedBar.style.width = `${completedPercent}%`;
  }

  if (productivityBar) {
    productivityBar.style.width = `${completionRate}%`;
  }
}
function renderTasks(tasks) {
  updateDashboardStats(tasks);
    currentTasks = tasks;
  taskList.innerHTML = '';

  if (!tasks.length) {
    taskList.innerHTML = '<div class="task-empty">No tasks yet. Add your first task.</div>';
    return;
  }

  tasks.forEach((task) => {
    const card = document.createElement('div');
    card.className = 'task-card';

    const statusClass = `pill-${task.status || 'pending'}`;
    const priorityClass = `pill-${task.priority || 'medium'}`;

    card.innerHTML = `
      <div class="task-card-header">
        <h4>${escapeHtml(task.title || 'Untitled Task')}</h4>
      </div>
      <div class="task-meta">
        <span class="task-pill ${statusClass}">${task.status || 'pending'}</span>
        <span class="task-pill ${priorityClass}">${task.priority || 'medium'}</span>
      </div>
      <p>${escapeHtml(task.description || 'No description available.')}</p>
      <p><strong>Due date:</strong> ${task.dueDate ? formatDate(task.dueDate) : 'No due date'}</p>
      <div class="task-actions">
        <button type="button" class="btn btn-secondary" data-action="edit" data-id="${task._id}">Edit</button>
        <button type="button" class="btn btn-danger" data-action="delete" data-id="${task._id}">Delete</button>
      </div>
    `;

    taskList.appendChild(card);
  });
}

function formatDate(dateString) {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'No due date';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function handleTaskSubmit(event) {
  event.preventDefault();

  const formData = new FormData(taskForm);
  const title = (formData.get('title') || '').trim();
  const description = (formData.get('description') || '').trim();
  const status = formData.get('status') || 'pending';
  const priority = formData.get('priority') || 'medium';
  const dueDate = formData.get('dueDate') || '';

  if (!title) {
    setMessage(dashboardMessage, 'error', 'Task title is required.');
    return;
  }

  const payload = {
    title,
    description,
    status,
    priority,
    dueDate: dueDate || null
  };

  const token = getToken();
  if (!token) {
    logout();
    return;
  }

  const button = taskSubmitBtn;
  const isEditing = Boolean(editingTaskId);
  setButtonLoading(button, true, isEditing ? 'Updating...' : 'Adding...');

  try {
    const url = `${API_URL}/tasks${isEditing ? `/${editingTaskId}` : ''}`;
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return;
      }
      throw new Error(data.message || 'Could not save task.');
    }

    const savedTask = data.task || data;
    if (!savedTask || !savedTask._id) {
      throw new Error('Task saved but no data returned.');
    }

    setMessage(dashboardMessage, 'success', isEditing ? 'Task updated successfully!' : 'Task added successfully!');
    resetTaskForm();
    await fetchTasks();
  } catch (error) {
    setMessage(dashboardMessage, 'error', error.message || 'Unable to save task.');
  } finally {
    setButtonLoading(button, false, isEditing ? 'Update Task' : 'Add Task');
  }
}

async function deleteTask(taskId) {
  const confirmed = window.confirm('Are you sure you want to delete this task?');
  if (!confirmed) return;

  const token = getToken();
  if (!token) {
    logout();
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return;
      }
      throw new Error(data.message || 'Unable to delete task.');
    }

    setMessage(dashboardMessage, 'success', data.message || 'Task deleted successfully.');
    await fetchTasks();
  } catch (error) {
    setMessage(dashboardMessage, 'error', error.message || 'Unable to delete task.');
  }
}

function startEditingTask(taskId) {
  const task = Array.from(taskList.children).find((card) => {
    const button = card.querySelector('[data-action="edit"]');
    return button && button.dataset.id === taskId;
  });

  if (!task) return;

  const title = task.querySelector('h4')?.textContent || '';
  const description = task.querySelector('p')?.textContent || '';
  const status = task.querySelector('.pill-pending, .pill-in-progress, .pill-completed')?.textContent.trim() || 'pending';
  const priority = task.querySelector('.pill-low, .pill-medium, .pill-high')?.textContent.trim() || 'medium';

  const dueDateText = task.querySelector('p:last-of-type')?.textContent.replace('Due date:', '').trim();
  const dueDateValue = dueDateText && dueDateText !== 'No due date' ? new Date(dueDateText).toISOString().split('T')[0] : '';

  taskForm.elements.title.value = title === 'Untitled Task' ? '' : title;
  taskForm.elements.description.value = description === 'No description available.' ? '' : description;
  taskForm.elements.status.value = status;
  taskForm.elements.priority.value = priority;
  taskForm.elements.dueDate.value = dueDateValue;

  editingTaskId = taskId;
  taskFormTitle.textContent = 'Edit Task';
  taskSubmitBtn.textContent = 'Update Task';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

taskList.addEventListener('click', async (event) => {
  const target = event.target.closest('button');
  if (!target) return;

  const taskId = target.dataset.id;
  const action = target.dataset.action;

  if (!taskId) return;

  if (action === 'edit') {
    startEditingTask(taskId);
    return;
  }

  if (action === 'delete') {
    await deleteTask(taskId);
  }
});

loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
taskForm.addEventListener('submit', handleTaskSubmit);
document.getElementById('showRegisterBtn').addEventListener('click', () => showAuthView('register'));
document.getElementById('showLoginBtn').addEventListener('click', () => showAuthView('login'));
document.getElementById('logoutBtn').addEventListener('click', logout);

document.querySelectorAll('button').forEach((button) => {
  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent;
  }
});

const savedToken = getToken();
const savedUser = getStoredUser();

if (savedToken && savedUser) {
  userName.textContent = savedUser.name || 'User';
  showDashboardView();
  fetchTasks();
} else {
  showAuthView('login');
}
// ================================
// THEME TOGGLE
// ================================

const themeToggle = document.getElementById('themeToggle');

function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('light-mode');
    themeToggle.textContent = '🌙';
  }
}

themeToggle?.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light-mode');

  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
});

applySavedTheme();
// ================================
// COLLAPSE BUTTON
// ================================

const collapseBtn = document.getElementById('collapseBtn');
const dashboardViewElement = document.getElementById('dashboardView');

collapseBtn?.addEventListener('click', () => {
  dashboardViewElement.classList.toggle('collapsed');

  collapseBtn.textContent =
    dashboardViewElement.classList.contains('collapsed') ? '☰' : '☰';
});
// ================================
// TASK SEARCH + FILTERS
// ================================

const taskSearch = document.getElementById('taskSearch');
const statusFilter = document.getElementById('statusFilter');
const priorityFilter = document.getElementById('priorityFilter');

function applyTaskFilters() {
  const searchTerm = (taskSearch?.value || '').trim().toLowerCase();
  const selectedStatus = statusFilter?.value || 'all';
  const selectedPriority = priorityFilter?.value || 'all';

  const filteredTasks = currentTasks.filter((task) => {
    const title = String(task.title || '').toLowerCase();
    const description = String(task.description || '').toLowerCase();

    const matchesSearch =
      !searchTerm ||
      title.includes(searchTerm) ||
      description.includes(searchTerm);

    const matchesStatus =
      selectedStatus === 'all' ||
      task.status === selectedStatus;

    const matchesPriority =
      selectedPriority === 'all' ||
      task.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  renderFilteredTasks(filteredTasks);
}

function renderFilteredTasks(tasks) {
  taskList.innerHTML = '';

  if (!tasks.length) {
    taskList.innerHTML =
      '<div class="task-empty">No matching tasks found.</div>';
    return;
  }

  tasks.forEach((task) => {
    const card = document.createElement('div');
    card.className = 'task-card';

    const statusClass = `pill-${task.status || 'pending'}`;
    const priorityClass = `pill-${task.priority || 'medium'}`;

    card.innerHTML = `
      <div class="task-card-header">
        <h4>${escapeHtml(task.title || 'Untitled Task')}</h4>
      </div>

      <div class="task-meta">
        <span class="task-pill ${statusClass}">
          ${task.status || 'pending'}
        </span>

        <span class="task-pill ${priorityClass}">
          ${task.priority || 'medium'}
        </span>
      </div>

      <p>${escapeHtml(task.description || 'No description available.')}</p>

      <p>
        <strong>Due date:</strong>
        ${task.dueDate ? formatDate(task.dueDate) : 'No due date'}
      </p>

      <div class="task-actions">
        <button
          type="button"
          class="btn btn-secondary"
          data-action="edit"
          data-id="${task._id}"
        >
          Edit
        </button>

        <button
          type="button"
          class="btn btn-danger"
          data-action="delete"
          data-id="${task._id}"
        >
          Delete
        </button>
      </div>
    `;

    taskList.appendChild(card);
  });
}

taskSearch?.addEventListener('input', applyTaskFilters);
statusFilter?.addEventListener('change', applyTaskFilters);
priorityFilter?.addEventListener('change', applyTaskFilters);