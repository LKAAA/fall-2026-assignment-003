import { Router, Request, Response } from 'express';
import { getAllTickets, createTicket, getTicketById, updateTicketStatus } from '../dal/tickets.js';

const router = Router();

router.get('/', async function (req, res) {
    const { limit, offset, status } = req.query;

    const tickets = await getAllTickets({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      status: status ? String(status) : undefined,
    });

    return res.json(tickets);
});

router.get('/:id', async function (req, res) {
    const { id } = req.params;
    const ticketIdNum = +id;
    if (Number.isNaN(ticketIdNum)) {
        return res.status(400).json({ error: 'ticketIdNum must be a number'})
    }

    const ticket = await getTicketById(ticketIdNum);
    if (!ticket) {
        return res.status(404).json({ error: 'ticket not found' });
    }
    return res.json(ticket);
});

router.post('/', async function(req, res) {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required'});
    }

    const newTicket = await createTicket({
        title,
        description,
        created_by: res.locals.userId,
    });

    return res.status(201).json(newTicket);
});

router.patch('/:id/status', async function (req: Request, res: Response) {
  try {
    const ticketIdNum = Number(req.params.id);
    if (Number.isNaN(ticketIdNum)) {
      return res.status(400).json({ error: 'Ticket ID must be a number' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status field is required' });
    }

    const updatedTicket = await updateTicketStatus(ticketIdNum, status);
    if (!updatedTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    return res.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

// TODO: Student implementation - Part 1: Ticket Routes
// GET /tickets
// GET /tickets/:id
// POST /tickets
// PATCH /tickets/:id/status

// TODO: Student implementation - Part 2: Time Log Routes
// POST /tickets/:id/time
// GET /tickets/:id/time

export default router;
