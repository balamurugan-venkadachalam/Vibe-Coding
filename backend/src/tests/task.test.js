const request = require('supertest');
const mongoose = require('mongoose');
const { app, connectDB } = require('../server');
const Task = require('../models/Task');

// Increase timeout for tests
jest.setTimeout(30000);

describe('Task API Endpoints', () => {
  let taskId;

  // Connect to test database before all tests
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
  });

  // Clear database after each test
  afterEach(async () => {
    await Task.deleteMany({});
  });

  // Close database connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH'
      };

      const res = await request(app)
        .post('/api/v1/tasks')
        .send(taskData);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.title).toBe(taskData.title);
      expect(res.body.data.description).toBe(taskData.description);
      expect(res.body.data.priority).toBe(taskData.priority);
      expect(res.body.data.status).toBe('TODO');
      expect(res.body.data.completed).toBe(false);

      // Save taskId for later tests
      taskId = res.body.data._id;
    });

    it('should return 400 if title is missing', async () => {
      const taskData = {
        description: 'Test Description',
        priority: 'HIGH'
      };

      const res = await request(app)
        .post('/api/v1/tasks')
        .send(taskData);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('error');
    });

    it('should return 400 if priority is invalid', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'INVALID'
      };

      const res = await request(app)
        .post('/api/v1/tasks')
        .send(taskData);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });

  describe('GET /api/v1/tasks', () => {
    beforeEach(async () => {
      // Create test tasks
      await Task.create([
        { title: 'Task 1', priority: 'HIGH', status: 'TODO' },
        { title: 'Task 2', priority: 'MEDIUM', status: 'IN_PROGRESS' },
        { title: 'Task 3', priority: 'LOW', status: 'COMPLETED' }
      ]);
    });

    it('should get all tasks', async () => {
      const res = await request(app).get('/api/v1/tasks');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.length).toBe(3);
    });

    it('should filter tasks by status', async () => {
      const res = await request(app)
        .get('/api/v1/tasks')
        .query({ status: 'TODO' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].status).toBe('TODO');
    });

    it('should filter tasks by priority', async () => {
      const res = await request(app)
        .get('/api/v1/tasks')
        .query({ priority: 'HIGH' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].priority).toBe('HIGH');
    });

    it('should search tasks by title', async () => {
      const res = await request(app)
        .get('/api/v1/tasks')
        .query({ search: 'Task 1' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe('Task 1');
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    beforeEach(async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH'
      });
      taskId = task._id;
    });

    it('should get a task by id', async () => {
      const res = await request(app).get(`/api/v1/tasks/${taskId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data._id.toString()).toBe(taskId.toString());
      expect(res.body.data.title).toBe('Test Task');
    });

    it('should return 404 if task not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/v1/tasks/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    beforeEach(async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH'
      });
      taskId = task._id;
    });

    it('should update a task', async () => {
      const updateData = {
        title: 'Updated Task',
        priority: 'LOW'
      };

      const res = await request(app)
        .put(`/api/v1/tasks/${taskId}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.title).toBe(updateData.title);
      expect(res.body.data.priority).toBe(updateData.priority);
    });

    it('should return 404 if task not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/v1/tasks/${fakeId}`)
        .send({ title: 'Updated Task' });

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    beforeEach(async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH'
      });
      taskId = task._id;
    });

    it('should delete a task', async () => {
      const res = await request(app).delete(`/api/v1/tasks/${taskId}`);

      expect(res.statusCode).toBe(204);

      // Verify task is deleted
      const deletedTask = await Task.findById(taskId);
      expect(deletedTask).toBeNull();
    });

    it('should return 404 if task not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/v1/tasks/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });

  describe('PUT /api/v1/tasks/:id/toggle', () => {
    beforeEach(async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH'
      });
      taskId = task._id;
    });

    it('should toggle task completion status', async () => {
      const res = await request(app).put(`/api/v1/tasks/${taskId}/toggle`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.completed).toBe(true);
      expect(res.body.data.status).toBe('COMPLETED');

      // Toggle again
      const res2 = await request(app).put(`/api/v1/tasks/${taskId}/toggle`);
      expect(res2.body.data.completed).toBe(false);
      expect(res2.body.data.status).toBe('TODO');
    });

    it('should return 404 if task not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).put(`/api/v1/tasks/${fakeId}/toggle`);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });
}); 