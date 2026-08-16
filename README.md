# Task Management Application

A complete full-stack task management web application built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Project Overview

This is an internship task management application where users can:
- Register and create an account
- Login securely with JWT authentication
- Create, read, update, and delete tasks
- Filter tasks by status (Pending, In Progress, Completed)
- Search tasks by title
- Change task status and priority
- View task statistics on the dashboard
- Works on desktop, tablet, and mobile devices

## Technology Stack

### Frontend
- HTML5
- CSS3 (Responsive Design)
- Vanilla JavaScript (ES6+)
- Fetch API for backend communication

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose ODM
- JWT (JSON Web Tokens) for authentication
- bcryptjs for password hashing

### Other Tools
- dotenv for environment variables
- cors for cross-origin requests
- nodemon for development

## Project Structure

```
task-management-app/
│
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection configuration
│   │
│   ├── controllers/
│   │   ├── authController.js  # User registration and login logic
│   │   └── taskController.js  # Task CRUD operations
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification middleware
│   │   └── errorMiddleware.js # Error handling middleware
│   │
│   ├── models/
│   │   ├── userModel.js       # User database schema
│   │   └── taskModel.js       # Task database schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── taskRoutes.js      # Task endpoints
│   │
│   └── server.js              # Express server setup
│
├── frontend/
│   ├── css/
│   │   └── style.css          # All styling (responsive)
│   │
│   ├── js/
│   │   ├── auth.js            # Authentication functions
│   │   └── dashboard.js       # Task management functions
│   │
│   ├── index.html             # Landing page
│   ├── register.html          # User registration page
│   ├── login.html             # User login page
│   └── dashboard.html         # Main dashboard
│
├── .env                       # Environment variables (NOT in git)
├── .gitignore                 # Git ignore rules
├── package.json               # NPM dependencies and scripts
└── README.md                  # This file
```

## Prerequisites

Before you start, make sure you have installed:
- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- MongoDB Atlas account (free tier) - [Sign up](https://www.mongodb.com/cloud/atlas)
- A code editor (VS Code recommended)
- Git (optional)

## Setup Instructions

### 1. MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new project
4. Create a cluster (M0 free tier)
5. Create a database user with a password
6. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/taskdb?retryWrites=true&w=majority`

### 2. Install Dependencies

Open terminal in the project root directory and run:

```bash
npm install
```

This will install all required packages listed in package.json.

### 3. Configure Environment Variables

Edit the `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskdb?retryWrites=true&w=majority
JWT_SECRET=task_management_secret_2026
```

Replace `username`, `password`, and `cluster` with your MongoDB Atlas credentials.

## How to Run the Application

### Start the Backend Server

Open terminal in the project root and run:

```bash
npm run dev
```

You should see:
```
✓ MongoDB connected successfully
✓ Server running on port 5000
```

### Open the Frontend

1. Open a new terminal window/tab
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Start a simple HTTP server (you can use any method):
   - Using Python 3:
     ```bash
     python -m http.server 8000
     ```
   - Using Python 2:
     ```bash
     python -m SimpleHTTPServer 8000
     ```
   - Using Node.js (install http-server first):
     ```bash
     npm install -g http-server
     http-server
     ```
   - Using VS Code Live Server extension (recommended)

4. Open your browser and go to:
   ```
   http://localhost:8000
   ```
   (or whatever port your server is using)

## Complete Testing Guide

### Step 1: Access the Application

1. Open `http://localhost:8000/` in your browser
2. You should see the welcome page with Login and Register buttons

### Step 2: Register a New User

1. Click the **Register** button
2. Fill in the form:
   - **Full Name**: John Doe
   - **Email**: john@example.com
   - **Password**: password123
3. Click **Register**
4. You should be automatically redirected to the dashboard

### Step 3: View the Dashboard

1. You should see:
   - Welcome message with your name
   - Statistics cards (Total Tasks: 0, Pending: 0, In Progress: 0, Completed: 0)
   - Add Task form
   - Filter buttons
   - Empty tasks list

### Step 4: Create Your First Task

1. In the "Add New Task" section, fill in:
   - **Task Title**: Complete Project Report (required)
   - **Description**: Write a detailed report for the internship project
   - **Priority**: High
   - **Due Date**: Select a date from tomorrow onwards
2. Click **Add Task**
3. The task should appear in the task list below
4. Statistics should update (Total Tasks: 1, Pending: 1)

### Step 5: Create More Tasks

Create 2-3 more tasks with different priorities and statuses:

**Task 2:**
- Title: Review Code
- Description: Review team code changes
- Priority: Medium
- Status: Pending

**Task 3:**
- Title: Bug Fixing
- Description: Fix critical bugs
- Priority: High
- Status: Pending

### Step 6: Filter Tasks

1. In the "Filter Tasks" section, click:
   - **All** - should show all 3 tasks
   - **Pending** - should show 3 tasks (all are pending)
   - **In Progress** - should show 0 tasks
   - **Completed** - should show 0 tasks

### Step 7: Search Tasks

1. In the search box, type: "Report"
2. Only the "Complete Project Report" task should appear
3. Clear the search box to see all tasks again

### Step 8: Change Task Status

1. Click **Change Status** button on any task
2. The status cycles: Pending → In Progress → Completed → (repeats)
3. Try changing "Complete Project Report" to "In Progress"
4. Check the statistics - In Progress should now be 1
5. Click filter buttons to verify filtering works

### Step 9: Edit a Task

1. Click the **Edit** button on any task
2. A modal dialog should appear with editable fields
3. Change the task title to: "Complete Project Report - UPDATED"
4. Change the description
5. Change priority to "Low"
6. Change status to "Completed"
7. Click **Save Changes**
8. The task should update immediately
9. Verify the statistics changed

### Step 10: Delete a Task

1. Click the **Delete** button on any task
2. A confirmation dialog should appear: "Are you sure you want to delete this task?"
3. Click **OK** to confirm
4. The task should be removed from the list
5. Statistics should update

### Step 11: Logout

1. Click the **Logout** button in the top-right corner
2. You should be redirected to the index page (login page)

### Step 12: Login Again

1. Click the **Login** button
2. Enter your email and password from Step 2
3. Click **Login**
4. You should be redirected to the dashboard
5. **Verify that all your tasks are still there** (data is persisted in MongoDB)

### Step 13: Test Edge Cases

1. Try registering with the same email again:
   - You should see error: "Email already registered"

2. Try logging in with wrong password:
   - You should see error: "Invalid email or password"

3. Leave required fields blank:
   - Registration: Leave name/email/password empty → error
   - Add Task: Leave title empty → error
   - Forms should show validation

4. Try creating tasks with very long titles/descriptions:
   - Should work fine and display correctly

5. Test on mobile by resizing browser window:
   - All elements should be responsive
   - Tasks should stack vertically on small screens

## API Endpoints Reference

### Authentication Endpoints

**POST /api/auth/register**
- Register a new user
- Body: `{ name, email, password }`
- Returns: `{ token, user }`

**POST /api/auth/login**
- Login user
- Body: `{ email, password }`
- Returns: `{ token, user }`

### Task Endpoints (Protected - Require JWT Token)

**GET /api/tasks**
- Get all tasks for logged-in user
- Returns: `{ tasks: [...] }`

**POST /api/tasks**
- Create a new task
- Body: `{ title, description, priority, dueDate, status }`
- Returns: `{ task }`

**GET /api/tasks/:id**
- Get a specific task
- Returns: `{ task }`

**PUT /api/tasks/:id**
- Update a task
- Body: `{ title, description, priority, dueDate, status }`
- Returns: `{ task }`

**DELETE /api/tasks/:id**
- Delete a task
- Returns: `{ message }`

## Key Features Implemented

✅ **User Authentication**
- Register with name, email, password
- Login with email and password
- Password hashing using bcryptjs
- JWT token generation and verification
- Secure token storage in localStorage

✅ **Task Management**
- Create tasks with title, description, priority, due date
- Read all user tasks
- Update tasks with all fields
- Delete tasks
- Change task status (Pending → In Progress → Completed)
- Set task priority (Low, Medium, High)

✅ **Dashboard**
- Welcome message with user's name
- Task statistics (total, pending, in progress, completed)
- Add task form
- Task list with all details
- Edit modal for detailed editing
- Quick status change buttons

✅ **Filtering & Search**
- Filter by status (All, Pending, In Progress, Completed)
- Search tasks by title
- Combined filtering and search

✅ **User Experience**
- Responsive design (desktop, tablet, mobile)
- Clean and modern UI
- Error messages for validation
- Loading indicators
- Confirmation dialogs for delete
- Auto-redirect after login/register

✅ **Security**
- Passwords are hashed (never stored in plain text)
- JWT token for authentication
- Token sent in Authorization header
- Users can only access their own tasks
- Input validation on frontend and backend

✅ **Error Handling**
- Validation for required fields
- Duplicate email prevention
- Invalid login handling
- Task not found handling
- Unauthorized access prevention
- Clear error messages to users

## Troubleshooting

### Backend won't start
- Make sure MongoDB connection string is correct in .env
- Check if MongoDB Atlas cluster is active
- Ensure port 5000 is not in use by another application

### Frontend can't connect to backend
- Check if backend server is running on port 5000
- Check browser console for CORS errors
- Make sure API_BASE_URL is set to `http://localhost:5000/api`

### Tasks don't save
- Check MongoDB connection
- Check browser console for API errors
- Verify JWT token is being sent with requests
- Check if user is properly authenticated

### Login/Register not working
- Check if email already exists in database
- Verify password is correct (case-sensitive)
- Check if .env file has correct MongoDB and JWT secret

### Responsive design issues
- Clear browser cache
- Resize browser window to test
- Check CSS media queries in style.css

## Important Notes

1. **Never commit .env file to Git** - It contains sensitive information
2. **Keep your MongoDB password secure** - Don't share it
3. **Change JWT_SECRET for production** - Use a strong random string
4. **Test on real mobile devices** - Browser resize is not the same as real mobile
5. **Regular backups** - MongoDB Atlas provides free backups for M0 tier

## Submitting as Internship Project

When submitting this as an internship project:

1. ✅ All source code is included
2. ✅ Working backend and frontend
3. ✅ Complete authentication system
4. ✅ Full CRUD functionality for tasks
5. ✅ Responsive design
6. ✅ Error handling
7. ✅ Clean code with comments
8. ✅ Database integration (MongoDB)
9. ✅ Security (password hashing, JWT)
10. ✅ Testing guide provided

## Future Enhancements (Optional)

- Add task categories/tags
- Task due date reminders/notifications
- Task comments or notes
- Share tasks with team members
- Real-time updates with WebSockets
- Export tasks to PDF/CSV
- Dark mode
- Multiple language support

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Look at browser console for errors (F12)
3. Check terminal/server logs
4. Verify all configuration is correct
5. Test API endpoints using Postman if needed

---

**Happy Coding! 🚀**

Good luck with your internship project!
