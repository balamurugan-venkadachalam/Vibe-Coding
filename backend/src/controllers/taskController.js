const Task = require('../models/Task');

// Get all tasks with optional filtering
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let query = {};

    // Apply filters if provided
    if (status) {
      query.status = status.toUpperCase();
    }
    if (priority) {
      query.priority = priority.toUpperCase();
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a single task by ID
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Toggle task completion
exports.toggleComplete = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    await task.toggleComplete();
    res.status(200).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}; 