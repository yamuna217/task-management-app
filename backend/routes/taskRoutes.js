const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all task routes
router.use(authMiddleware);

// GET /api/tasks
router.get('/', taskController.getTasks);

// POST /api/tasks
router.post('/', taskController.createTask);

// GET /api/tasks/:id
router.get('/:id', taskController.getTaskById);

// PUT /api/tasks/:id
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', taskController.deleteTask);

module.exports = router;
