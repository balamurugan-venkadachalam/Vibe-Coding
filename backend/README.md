# Todo App Backend

This is the backend for the Todo App, built with Node.js, Express, and MongoDB.

## Features

- RESTful API with versioning (v1)
- MongoDB database integration
- Health check endpoints (liveness and readiness)
- Task management (CRUD operations)
- Error handling
- Unit and integration tests

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
NODE_ENV=development
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## Running Tests

```bash
npm test
```

For test coverage:

```bash
npm run test:coverage
```

## API Endpoints

### Health Check

- `GET /api/v1/health/liveness` - Check if the service is alive
- `GET /api/v1/health/readiness` - Check if the service is ready

### Tasks (Coming Soon)

- `GET /api/v1/tasks` - Get all tasks
- `GET /api/v1/tasks/:id` - Get a task by ID
- `POST /api/v1/tasks` - Create a new task
- `PUT /api/v1/tasks/:id` - Update a task
- `DELETE /api/v1/tasks/:id` - Delete a task

## Docker

To build and run the application using Docker:

```bash
docker build -t todo-app-backend .
docker run -p 5000:5000 todo-app-backend
``` 