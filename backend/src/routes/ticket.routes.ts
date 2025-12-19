import express from 'express';
import { AuthRequest, protect as auth } from '../middlewares/auth.middleware.js';
import Ticket from '../models/Ticket.js';
import { SupportTicketStatus } from '../../types.js';

const router = express.Router();
router.use(auth);

router.post('/', async (req: AuthRequest, res: express.Response) => {
    const { subject, category, description } = req.body;
    const ticket = new Ticket({
        user: req.user!.id,
        subject,
        category,
        description,
        messages: [{ sender: 'user', text: description }]
    });
    await ticket.save();
    res.status(201).json(ticket);
});

router.get('/', async (req: AuthRequest, res: express.Response) => {
    const tickets = await Ticket.find({ user: req.user?.id }).sort({ lastUpdatedDate: -1 });
    res.json(tickets);
});

router.put('/:id/reply', async (req: AuthRequest, res: express.Response) => {
    const ticket = await Ticket.findOne({ _id: req.params.id, user: req.user!.id });
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found.' });

    (ticket.messages as any).push({ sender: 'user', text: req.body.text });
    ticket.status = SupportTicketStatus.AWAITING_USER_REPLY;
    ticket.lastUpdatedDate = new Date();
    await ticket.save();
    res.json(ticket);
});

export default router;