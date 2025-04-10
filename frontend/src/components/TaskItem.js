import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
} from '@mui/material';
import { MoreVert, Edit, Delete } from '@mui/icons-material';
import { useTaskContext } from '../context/TaskContext';

const TaskItem = ({ task }) => {
  const { toggleComplete, deleteTask } = useTaskContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleComplete = async () => {
    try {
      await toggleComplete(task._id);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task._id);
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'success';
      default:
        return 'default';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'info';
      case 'TODO':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        opacity: task.completed ? 0.7 : 1,
        textDecoration: task.completed ? 'line-through' : 'none',
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={task.completed}
          onChange={handleToggleComplete}
          color="primary"
        />
        <Box sx={{ flexGrow: 1, ml: 1 }}>
          <Typography variant="h6" component="div">
            {task.title}
          </Typography>
          {task.description && (
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
          )}
          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
            <Chip
              label={task.priority}
              size="small"
              color={getPriorityColor(task.priority)}
            />
            <Chip
              label={task.status}
              size="small"
              color={getStatusColor(task.status)}
            />
            {task.dueDate && (
              <Chip
                label={new Date(task.dueDate).toLocaleDateString()}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
        <IconButton onClick={handleMenuClick}>
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default TaskItem; 