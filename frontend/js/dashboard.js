

// Global variables
let allTasks = [];
let filteredTasks = [];
let currentFilter = 'All';
let currentSearchTerm = '';
let currentPriority='All';
let editingTaskId = null;

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  // Display welcome message
  const user = getUser();
  if (user) {
    document.getElementById('welcomeMsg').textContent = `Welcome, ${user.name}!`;
  }

  // Add event listeners
  document.getElementById('logoutBtn').addEventListener('click', logoutUser);
  document.getElementById('addTaskForm').addEventListener('submit', addTask);
  document.getElementById('searchInput').addEventListener('input', searchTasks);
  const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.textContent = '🌙 Dark';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');

    const isLight = document.body.classList.contains('light-mode');

    localStorage.setItem(
      'theme',
      isLight ? 'light' : 'dark'
    );

    themeToggle.textContent =
      isLight ? '🌙 Dark' : '☀️ Light';
  });
}
  // Priority filter
document.getElementById('priorityFilter')
  .addEventListener('change', (e) => {
    currentPriority = e.target.value;
    filterTasks();
  });

// Clear filters
document.getElementById('clearFiltersBtn')
  .addEventListener('click', clearFilters);

  // Add filter button listeners
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.filter;
      filterTasks();
    });
  });

  // Load tasks on page load
  updateStats();
  loadTasks();
});

// Load all tasks from backend
async function loadTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    console.log("TASKS FROM BACKEND:", data);

    if (!response.ok) {
      console.error('Error loading tasks:', data.message);
      return;
    }

    allTasks = Array.isArray(data)
      ? data
      : (data.tasks || []);

    console.log("ALL TASKS:", allTasks);

    filterTasks();
    updateStats();

  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}
// Add a new task
async function addTask(event) {
  event.preventDefault();

  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const priority = document.getElementById('taskPriority').value;
  const dueDate = document.getElementById('taskDueDate').value;

  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
  title,
  description,
  priority: priority.toLowerCase(),
  dueDate: dueDate ? new Date(dueDate).toISOString() : null,
  status: 'pending'
})
    });

    const data = await response.json();
    console.log("ADD TASK RESPONSE:", response.status, data);

    if (!response.ok) {
      alert(data.message || 'Failed to add task');
      return;
    }

    // Clear form
    document.getElementById('addTaskForm').reset();

    // Reload tasks
    loadTasks();
  } catch (error) {
    console.error('Error adding task:', error);
    alert('An error occurred while adding the task');
  }
}

// Filter tasks based on current filter and search term
function filterTasks() {
  let filtered = allTasks;

  // Filter by status
  if (currentFilter !== 'All') {
    filtered = filtered.filter(task =>
      task.status.toLowerCase() === currentFilter.toLowerCase()
    );
  }

  // Filter by priority
  if (currentPriority !== 'All') {
    filtered = filtered.filter(task =>
      task.priority.toLowerCase() === currentPriority.toLowerCase()
    );
  }

  // Filter by search term
  if (currentSearchTerm) {
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(currentSearchTerm.toLowerCase())
    );
  }

  filteredTasks = filtered;
  displayTasks();
}

// Search tasks by title
function searchTasks(event) {
  currentSearchTerm = event.target.value;
  filterTasks();
}

// Display tasks on the page
function displayTasks() {
  const tasksList = document.getElementById('tasksList');

  if (filteredTasks.length === 0) {
    tasksList.innerHTML = '<p class="no-tasks">No tasks found. Create one to get started!</p>';
    return;
  }

  tasksList.innerHTML = filteredTasks.map(task => `
    <div class="task-card ${task.priority.toLowerCase()}">
      <div class="task-header">
        <h3 class="task-title">${escapeHtml(task.title)}</h3>
      </div>

      <div class="task-badges">
        <span class="badge badge-status ${task.status === 'Completed' ? 'completed' : task.status === 'In Progress' ? 'in-progress' : ''}">
          ${task.status}
        </span>
        <span class="badge badge-priority ${task.priority.toLowerCase()}">
          ${task.priority} Priority
        </span>
      </div>

      ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}

      ${task.dueDate ? `<p class="task-due-date">📅 Due: ${formatDate(task.dueDate)}</p>` : ''}

      <div class="task-actions">
        <button class="btn btn-edit" onclick="openEditModal('${task._id}')">Edit</button>
        <button class="btn btn-status" onclick="toggleTaskStatus('${task._id}', '${task.status}')">Change Status</button>
        <button class="btn btn-delete" onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Update statistics
// Update statistics
function updateStats() {
  const total = allTasks.length;

  const pending = allTasks.filter(task =>
    task.status.toLowerCase() === 'pending'
  ).length;

  const inProgress = allTasks.filter(task =>
    task.status.toLowerCase() === 'in-progress' ||
    task.status.toLowerCase() === 'in progress'
  ).length;

  const completed = allTasks.filter(task =>
    task.status.toLowerCase() === 'completed'
  ).length;

  document.getElementById('totalTasks').textContent = total;
  document.getElementById('pendingTasks').textContent = pending;
  document.getElementById('inProgressTasks').textContent = inProgress;
  document.getElementById('completedTasks').textContent = completed;
  updateProductivity(total, completed);
  updateAnalytics(total, pending, inProgress, completed);
}
function updateAnalytics(total, pending, inProgress, completed) {

  const percentage =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  const completion =
    document.getElementById('analyticsCompletion');

  const progress =
    document.getElementById('analyticsProgress');

  const completionText =
    document.getElementById('analyticsCompletionText');

  const pendingElement =
    document.getElementById('analyticsPending');

  const progressElement =
    document.getElementById('analyticsProgressCount');

  const completedElement =
    document.getElementById('analyticsCompleted');

  if (completion) {
    completion.textContent = `${percentage}%`;
  }

  if (progress) {
    progress.style.width = `${percentage}%`;
  }

  if (completionText) {
    completionText.textContent =
      `${completed} of ${total} tasks completed`;
  }

  if (pendingElement) {
    pendingElement.textContent = pending;
  }

  if (progressElement) {
    progressElement.textContent = inProgress;
  }

  if (completedElement) {
    completedElement.textContent = completed;
  }
}
function updateProductivity(total, completed) {
  const percent =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  const percentElement =
    document.getElementById('productivityPercent');

  const barElement =
    document.getElementById('productivityBar');

  const messageElement =
    document.getElementById('productivityMessage');

  if (percentElement) {
    percentElement.textContent = `${percent}%`;
  }

  if (barElement) {
    barElement.style.width = `${percent}%`;
  }

  if (messageElement) {
    if (percent === 0) {
      messageElement.textContent = '🌱 Getting Started';
    } else if (percent <= 25) {
      messageElement.textContent = '🌱 Getting Started';
    } else if (percent <= 50) {
      messageElement.textContent = '⚡ Building Momentum';
    } else if (percent <= 75) {
      messageElement.textContent = '🚀 Great Progress';
    } else if (percent < 100) {
      messageElement.textContent = '🔥 Almost There';
    } else {
      messageElement.textContent = '🏆 All Tasks Complete!';
    }
  }
}

// Open edit modal
function openEditModal(taskId) {
  const task = allTasks.find(t => t._id === taskId);
  if (!task) return;

  editingTaskId = taskId;

  // Create modal HTML
  const modal = document.createElement('div');
  modal.className = 'modal show';
  modal.id = 'editModal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit Task</h2>
        <button class="modal-close" onclick="closeEditModal()">&times;</button>
      </div>

      <form id="editTaskForm" onsubmit="updateTask(event)">
        <div class="form-group form-row full">
          <label for="editTaskTitle">Task Title *</label>
          <input type="text" id="editTaskTitle" value="${escapeHtml(task.title)}" required>
        </div>

        <div class="form-group form-row full">
          <label for="editTaskDescription">Description</label>
          <textarea id="editTaskDescription" rows="3">${escapeHtml(task.description || '')}</textarea>
        </div>

        <div class="form-group form-row">
          <div>
            <label for="editTaskStatus">Status</label>
            <select id="editTaskStatus" required>
              <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
          </div>

          <div>
            <label for="editTaskPriority">Priority</label>
            <select id="editTaskPriority" required>
              <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
              <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
              <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
            </select>
          </div>
        </div>

        <div class="form-group form-row full">
          <label for="editTaskDueDate">Due Date</label>
          <input type="date" id="editTaskDueDate" value="${task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}">
        </div>

        <button type="submit" class="btn btn-primary btn-block">Save Changes</button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeEditModal();
  });
}

// Close edit modal
function closeEditModal() {
  const modal = document.getElementById('editModal');
  if (modal) {
    modal.remove();
  }
  editingTaskId = null;
}

// Update task
async function updateTask(event) {
  event.preventDefault();

  const title = document.getElementById('editTaskTitle').value;
  const description = document.getElementById('editTaskDescription').value;
  const status = document.getElementById('editTaskStatus').value;
  const priority = document.getElementById('editTaskPriority').value;
  const dueDate = document.getElementById('editTaskDueDate').value;

  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${editingTaskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Failed to update task');
      return;
    }

    closeEditModal();
    loadTasks();
  } catch (error) {
    console.error('Error updating task:', error);
    alert('An error occurred while updating the task');
  }
}

// Toggle task status
async function toggleTaskStatus(taskId, currentStatus) {
  let newStatus = 'Pending';
  if (currentStatus === 'Pending') newStatus = 'In Progress';
  else if (currentStatus === 'In Progress') newStatus = 'Completed';

  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Failed to update task status');
      return;
    }

    loadTasks();
  } catch (error) {
    console.error('Error updating task status:', error);
    alert('An error occurred');
  }
}

// Delete task
async function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Failed to delete task');
      return;
    }

    loadTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('An error occurred while deleting the task');
  }
}
/* =========================================
   PRODUCTIVITY OVERVIEW
========================================= */

function updateProductivity(total, completed) {

  const percentElement =
    document.getElementById('completionPercent');

  const progressElement =
    document.getElementById('completionProgress');

  const messageElement =
    document.getElementById('productivityMessage');

  const summaryElement =
    document.getElementById('completionSummary');

  if (!percentElement || !progressElement) {
    return;
  }

  let percentage = 0;

  if (total > 0) {
    percentage = Math.round((completed / total) * 100);
  }

  percentElement.textContent = `${percentage}%`;

  progressElement.style.width = `${percentage}%`;

  summaryElement.textContent =
    `${completed} of ${total} completed`;

  if (total === 0) {

  messageElement.textContent =
    '🌱 Getting Started';

} else if (percentage === 100) {

  messageElement.textContent =
    '🏆 All Tasks Complete!';

} else if (percentage >= 75) {

  messageElement.textContent =
    '🔥 Almost There!';

} else if (percentage >= 50) {

  messageElement.textContent =
    '⚡ Building Momentum';

} else if (percentage >= 25) {

  messageElement.textContent =
    '🚀 Great Progress';

} else {

  messageElement.textContent =
    '🌱 Getting Started';
}
}
function clearFilters() {
  // Reset status filter
  currentFilter = 'All';

  // Reset priority filter
  currentPriority = 'All';

  // Reset search
  currentSearchTerm = '';

  // Reset search box
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = '';
  }

  // Reset priority dropdown
  const priorityFilter = document.getElementById('priorityFilter');
  if (priorityFilter) {
    priorityFilter.value = 'All';
  }

  // Reset status buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');

    if (btn.dataset.filter === 'All') {
      btn.classList.add('active');
    }
  });

  // Show all tasks
  filterTasks();
}