import { Router } from 'express';
import { protect as auth } from '../middlewares/auth.middleware.js';
import { createTicket, getTickets, replyToTicket } from '../controllers/ticket.controller.js';

const router = Router();
router.use(auth);

router.post('/', createTicket);
router.get('/', getTickets);
router.put('/:id/reply', replyToTicket); // Fallback for non-websocket clients

export default router;
