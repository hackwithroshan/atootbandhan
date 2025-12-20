import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import Ticket from '../models/Ticket.js';
import { SupportTicketStatus, SupportTicketMessage } from '../../../types.js';

export const createTicket = async (req: AuthRequest, res: Response) => {
    try {
        const { subject, category, description } = req.body;
        const newTicket = new Ticket({
            user: req.user!.id,
            subject,
            category,
            description,
            messages: [{ sender: 'user', text: description, timestamp: new Date() }]
        });
        await newTicket.save();

        const populatedTicket = await Ticket.findById(newTicket.id).populate('user', 'fullName');

        // Emit event to all clients (specifically for admins)
        const io = req.app.get('io');
        if (io) {
            io.emit('new_ticket_created', populatedTicket);
        }
        
        res.status(201).json(populatedTicket);
    } catch (err: any) {
        console.error("Error creating ticket:", err);
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
};

export const getTickets = async (req: AuthRequest, res: Response) => {
    try {
        const tickets = await Ticket.find({ user: req.user?.id }).sort({ lastUpdatedDate: -1 });
        res.json(tickets);
    } catch (err: any) {
        console.error("Error fetching tickets:", err);
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
};

// This is now primarily a fallback for non-websocket clients
export const replyToTicket = async (req: AuthRequest, res: Response) => {
    try {
        const ticket = await Ticket.findOne({ _id: req.params.id, user: req.user!.id });
        if (!ticket) return res.status(404).json({ msg: 'Ticket not found.' });

        const newMessage: SupportTicketMessage = { sender: 'user', text: req.body.text, timestamp: new Date().toISOString() };
        ticket.messages.push(newMessage as any); // temp any cast for mongoose subdoc
        ticket.status = SupportTicketStatus.AWAITING_USER_REPLY;
        ticket.lastUpdatedDate = new Date();
        await ticket.save();

        const io = req.app.get('io');
        if (io) {
            io.to(ticket.id).emit('message_received', { ticketId: ticket.id, message: newMessage });
            const populatedTicket = await Ticket.findById(ticket.id).populate('user', 'fullName');
            io.emit('ticket_updated', populatedTicket);
        }

        res.json(ticket);
    } catch (err: any) {
        console.error("Error replying to ticket:", err);
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
};
