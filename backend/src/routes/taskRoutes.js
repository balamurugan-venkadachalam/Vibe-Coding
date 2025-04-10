const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete
} = require('../controllers/taskController');

// Task routes
router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

router.route('/:id/toggle')
  .put(toggleComplete);

module.exports = router; 