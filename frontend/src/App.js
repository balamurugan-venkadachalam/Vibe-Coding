import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { TaskProvider } from './context/TaskContext';
import TaskList from './components/TaskList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          marginBottom: '1rem',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TaskProvider>
        <TaskList />
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
