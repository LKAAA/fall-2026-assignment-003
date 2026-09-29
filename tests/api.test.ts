import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 1: API Integration Tests', () => {
  let createdUserId: number;
  let createdTicketId: number;

  beforeAll(async () => {
    // Create a shared test user for authentication
    const res = await request(app).post('/users').send({
      name: 'Edward from twilight',
      email: 'Edward@email.com'
    });
    createdUserId = res.body.id;
  });

  describe('/users routes', () => {
    it('should create and retrieve a user', async () => {
      const res = await request(app).post('/users').send({
        name: 'Bella Swan',
        email: 'Bella@email.com'
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        created_at: expect.any(String),
        id: expect.any(Number),
        name: 'Bella Swan',
        email: 'Bella@email.com'
      });

      const getRes = await request(app).get(`/users/${res.body.id}`);
      expect(getRes.statusCode).toBe(200);
      expect(getRes.body.id).toBe(res.body.id);
    });

    it('should return 404 for a non-existent user', async () => {
      const res = await request(app).get('/users/999999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('/tickets routes', () => {
    it('should return 401 when creating a ticket without X-User-Id header', async () => {
      const res = await request(app).post('/tickets').send({
        title: 'Important Ticket',
        description: 'Important ticket description about important things.'
      });

      expect(res.statusCode).toBe(401);
    });

    it('should create and retrieve a ticket with valid auth header', async () => {
      const res = await request(app)
        .post('/tickets')
        .set('X-User-Id', String(createdUserId))
        .send({
          title: 'Important Ticket',
          description: 'Important ticket description about important things.'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        created_at: expect.any(String),
        creator_id: createdUserId,
        title: 'Important Ticket',
        description: 'Important ticket description about important things.'
      });

      createdTicketId = res.body.id;

      const getRes = await request(app).get(`/tickets/${createdTicketId}`);
      expect(getRes.statusCode).toBe(200);
      expect(getRes.body.id).toBe(createdTicketId);
    });

    it('should return 404 for a non-existent ticket', async () => {
      const res = await request(app).get('/tickets/999999');
      expect(res.statusCode).toBe(404);
    });

    it('should handle pagination on GET /tickets', async () => {
      const res = await request(app)
        .get('/tickets')
        .query({ page: 1, limit: 1 });

      expect(res.statusCode).toBe(200);
      if (Array.isArray(res.body)) {
        expect(res.body.length).toBeLessThanOrEqual(1);
      } else {
        expect(res.body.data).toBeDefined();
        expect(res.body.data.length).toBeLessThanOrEqual(1);
      }
    });
  });
});