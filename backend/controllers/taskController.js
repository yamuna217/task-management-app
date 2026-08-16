const Task = require('../models/taskModel');

// Get the logged-in user's ID from either req.user.id or req.userId
const getUserId = (req) => {
  return req.user?.id || req.userId;
};

// Create a new task
exports.createTask = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      user: userId,
      title: title.trim(),
      description: description || '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// Get all tasks for the logged-in user, newest first
exports.getTasks = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// Get one task by ID for the logged-in user
exports.getTaskById = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== userId) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// Update a task for the logged-in user
exports.updateTask = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== userId) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (title !== undefined) {
      task.title = title.trim();
    }
    if (description !== undefined) {
      task.description = description;
    }
    if (status !== undefined) {
      task.status = status;
    }
    if (priority !== undefined) {
      task.priority = priority;
    }
    if (dueDate !== undefined) {
      task.dueDate = dueDate;
    }

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// Delete a task for the logged-in user
exports.deleteTask = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== userId) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
