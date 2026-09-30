import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 2: Time Logs Tests', () => {
  describe('/timelog route', () => {
    it('should log the hours for a ticket', async () => {

      const createTicketRes = await request(app).post('/tickets').send({ // Create a ticket to test timelogs on
        title: 'Test Ticket',
        description: 'Testical Ticket (Does testing things)',
      });

      expect(createTicketRes.statusCode).toEqual(201);
      expect(createTicketRes.body).toEqual({
        ticket_id: expect.any(Number),
        title: 'Test Ticket',
        description: 'Testical Ticket (Does testing things)',
      });

      const { ticket_id } = createTicketRes.body;

      const logTimeRes = await request(app).post('/tickets/${ticket_id}/time').send({
        hours: 20,
      });

      expect(logTimeRes.statusCode).toEqual(201);
      expect(logTimeRes.body).toEqual({
        ticket_id: ticket_id,
        hours: 20,
      });
    });
  }); 
});
