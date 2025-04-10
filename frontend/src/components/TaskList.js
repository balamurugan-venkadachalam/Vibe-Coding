import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Checkbox,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useTaskContext } from '../context/TaskContext';

const TaskList = () => {
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTaskContext();
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await addTask({ title: newTask.trim(), completed: false });
      setNewTask('');
    } catch (err) {
      // Error is handled by the context
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task._id);
    setEditText(task.title);
  };

  const handleEditSubmit = async (taskId) => {
    try {
      await updateTask(taskId, { title: editText.trim() });
      setEditingTask(null);
      setEditText('');
    } catch (err) {
      // Error is handled by the context
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await updateTask(taskId, { completed: !completed });
    } catch (err) {
      // Error is handled by the context
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Task List
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <form onSubmit={handleAddTask}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a new task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!newTask.trim()}
              >
                Add
              </Button>
            </Box>
          </form>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper>
            <List>
              {tasks.map((task) => (
                <ListItem
                  key={task._id}
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.7 : 1,
                  }}
                >
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task._id, task.completed)}
                  />
                  {editingTask === task._id ? (
                    <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                      <TextField
                        fullWidth
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleEditSubmit(task._id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setEditingTask(null)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <ListItemText primary={task.title} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEditClick(task)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => deleteTask(task._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </>
                  )}
                </ListItem>
              ))}
              {tasks.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No tasks yet"
                    sx={{ textAlign: 'center', color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default TaskList; 