import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { useTaskContext } from '../context/TaskContext';

const TaskForm = ({ open, onClose, task = null }) => {
  const { createTask, updateTask } = useTaskContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});

  // Initialize form data when task is provided (edit mode)
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    } else {
      // Reset form when opening for new task
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
      });
    }
    setErrors({});
  }, [task, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (task) {
        await updateTask(task._id, formData);
      } else {
        await createTask(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      setErrors({ submit: error.message || 'Failed to save task' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                label="Priority"
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            {errors.submit && (
              <Box sx={{ color: 'error.main', mt: 1 }}>
                {errors.submit}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {task ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm; 