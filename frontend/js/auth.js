// API base URL
const API_BASE_URL = 'https://task-management-app-5px4.onrender.com/api';
// Display message function
function showMessage(message, type = 'success') {
  const messageDiv = document.getElementById('message');
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
  }
}

// Hide message function
function hideMessage() {
  const messageDiv = document.getElementById('message');
  if (messageDiv) {
    messageDiv.style.display = 'none';
  }
}

// Register User
async function registerUser(event) {
  event.preventDefault();
  hideMessage();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Registration failed', 'error');
      return;
    }

    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    showMessage('Registration successful! Redirecting...', 'success');

    // Redirect to dashboard after 1.5 seconds
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  } catch (error) {
    console.error('Error:', error);
    showMessage('An error occurred. Please try again.', 'error');
  }
}

// Login User
async function loginUser(event) {
  event.preventDefault();
  hideMessage();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Login failed', 'error');
      return;
    }

    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    showMessage('Login successful! Redirecting...', 'success');

    // Redirect to dashboard after 1.5 seconds
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  } catch (error) {
    console.error('Error:', error);
    showMessage('An error occurred. Please try again.', 'error');
  }
}

// Check if user is authenticated
function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}

// Logout User
function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// Get auth token
function getToken() {
  return localStorage.getItem('token');
}

// Get user info
function getUser() {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}
