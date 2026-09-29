import { Router, Request, Response, NextFunction } from 'express';
import { getAllTickets, createTicket, getTicketById, updateTicketStatus } from '../dal/tickets.js';

const router = Router();

router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { limit, offset, status } = req.query;

    const tickets = await getAllTickets({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      status: status ? String(status) : undefined,
    });

    return res.json(tickets);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const ticketIdNum = Number(id);
    if (Number.isNaN(ticketIdNum)) {
      return res.status(400).json({ error: 'ticketIdNum must be a number' });
    }

    const ticket = await getTicketById(ticketIdNum);
    if (!ticket) {
      return res.status(404).json({ error: 'ticket not found' });
    }
    return res.json(ticket);
  } catch (err) {
    next(err);
  }
});

router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // res.locals.userId was set by authMiddleware
    const newTicket = await createTicket({
      title,
      description,
      creator_id: res.locals.userId,
    });

    return res.status(201).json(newTicket);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', async function (req: Request, res: Response, next: NextFunction) {
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
  } catch (err) {
    next(err);
  }
});

export default router;