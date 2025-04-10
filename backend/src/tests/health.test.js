const request = require('supertest');
const mongoose = require('mongoose');
const { app, connectDB } = require('../server');

jest.setTimeout(30000); // Increase timeout to 30 seconds

describe('Health Check Endpoints', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/v1/health/liveness', () => {
    it('should return 200 OK with a message indicating the service is alive', async () => {
      const res = await request(app).get('/api/v1/health/liveness');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('message', 'Service is alive');
    });
  });

  describe('GET /api/v1/health/readiness', () => {
    it('should return 200 OK with a message indicating the service is ready when MongoDB is connected', async () => {
      const res = await request(app).get('/api/v1/health/readiness');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('message', 'Service is ready');
    });

    it('should return 503 Service Unavailable when MongoDB is not connected', async () => {
      // Disconnect from MongoDB
      await mongoose.connection.close();
      
      const res = await request(app).get('/api/v1/health/readiness');
      expect(res.statusCode).toBe(503);
      expect(res.body).toHaveProperty('status', 'error');
      expect(res.body).toHaveProperty('message', 'Service is not ready');
      
      // Reconnect to MongoDB for other tests
      await connectDB();
    });
  });
}); 