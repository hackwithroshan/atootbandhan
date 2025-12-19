import express from 'express';
// FIX: Corrected import path for auth middleware and AuthRequest type.
import { protect as auth, AuthRequest } from '../src/middlewares/auth.middleware.js';
// FIX: Corrected import path for Ticket model.
import Ticket from '../src/models/Ticket.js';
import { SupportTicketStatus } from '../../types.js';

const router = express.Router();

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.post('/', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    // FIX: Property 'body' does not exist.
    const { subject, category, description } = req.body;
    const ticket = new Ticket({
        user: authReq.user!.id,
        subject,
        category,
        description,
        messages: [{ sender: 'user', text: description }]
    });
    await ticket.save();
    // FIX: Property 'status' does not exist.
    res.status(201).json(ticket);
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.get('/', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    const tickets = await Ticket.find({ user: authReq.user?.id }).sort({ lastUpdatedDate: -1 });
    // FIX: Property 'json' does not exist.
    res.json(tickets);
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.put('/:id/reply', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    // FIX: Property 'params' does not exist.
    const ticket = await Ticket.findOne({ _id: req.params.id, user: authReq.user!.id });
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found.' });

    // FIX: Property 'body' does not exist.
    (ticket.messages as any).push({ sender: 'user', text: req.body.text });
    ticket.status = SupportTicketStatus.AWAITING_USER_REPLY;
    ticket.lastUpdatedDate = new Date();
    await ticket.save();
    // FIX: Property 'json' does not exist.
    res.json(ticket);
});

export default router;