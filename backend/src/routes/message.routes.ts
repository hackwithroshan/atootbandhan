import express from 'express';
// FIX: Corrected import path for auth middleware and AuthRequest type.
import { protect as auth, AuthRequest } from '../middlewares/auth.middleware.js';
// FIX: Corrected import path for Conversation model.
import Conversation from '../models/Conversation.js';
// FIX: Corrected import path for Message model.
import Message from '../models/Message.js';
import mongoose from 'mongoose';

const router = express.Router();

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.get('/conversations', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    const conversations = await Conversation.find({ participants: authReq.user?.id })
        .populate('participants', 'fullName profilePhotoUrl')
        .sort({ 'lastMessage.timestamp': -1 });
    const formatted = conversations.map(c => ({
        id: c._id,
        // FIX: No overload matches this call. Ensure participants is treated as an array of objects.
        otherParticipant: (c.participants as any[]).find(p => p._id.toString() !== authReq.user!.id),
        lastMessage: c.lastMessage
    }));
    // FIX: Property 'json' does not exist on type 'Response'.
    res.json(formatted);
});


// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.get('/:userId', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    // FIX: Property 'params' does not exist.
    const conversation = await Conversation.findOne({ participants: { $all: [authReq.user!.id, req.params.userId] } });
    if (!conversation) return res.json([]);
    const messages = await Message.find({ conversation: conversation._id }).sort({ createdAt: 1 });
    // FIX: Property 'json' does not exist.
    res.json(messages);
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.post('/:userId', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    // FIX: Property 'params' does not exist.
    let conversation = await Conversation.findOneAndUpdate(
        { participants: { $all: [authReq.user!.id, req.params.userId] } },
        { $setOnInsert: { participants: [authReq.user!.id, req.params.userId] } },
        { upsert: true, new: true }
    );
    // FIX: Property 'body' does not exist.
    const newMessage = new Message({
        conversation: conversation._id,
        // FIX: Argument of type 'string' is not assignable. Use new mongoose.Types.ObjectId()
        sender: new mongoose.Types.ObjectId(authReq.user!.id),
        text: req.body.text
    });
    // FIX: Argument of type 'string' is not assignable. Use new mongoose.Types.ObjectId()
    conversation.lastMessage = { text: req.body.text, sender: new mongoose.Types.ObjectId(authReq.user!.id), timestamp: new Date() };
    await Promise.all([newMessage.save(), conversation.save()]);
    // FIX: Property 'status' does not exist.
    res.status(201).json(newMessage);
});


export default router;