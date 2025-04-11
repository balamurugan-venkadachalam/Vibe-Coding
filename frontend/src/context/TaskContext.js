import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const TaskContext = createContext();

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      setTasks(prevTasks => [...prevTasks, response.data.data]);
      return response.data.data;
    } catch (err) {
      console.error('Error adding task:', err);
      setError(err.response?.data?.message || 'Failed to add task. Please try again.');
      throw err;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      setError(null);
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskData);
      setTasks(prevTasks =>
        prevTasks.map(task => (task._id === taskId ? response.data.data : task))
      );
      return response.data.data;
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.response?.data?.message || 'Failed to update task. Please try again.');
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setError(null);
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.response?.data?.message || 'Failed to delete task. Please try again.');
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext; 