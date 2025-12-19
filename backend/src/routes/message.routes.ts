import express from 'express';
import { AuthRequest, protect as auth } from '../middlewares/auth.middleware.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import mongoose from 'mongoose';

const router = express.Router();

router.use(auth);

router.get('/conversations', async (req: AuthRequest, res: express.Response) => {
    const conversations = await Conversation.find({ participants: req.user?.id })
        .populate('participants', 'fullName profilePhotoUrl')
        .sort({ 'lastMessage.timestamp': -1 });
    const formatted = conversations.map(c => ({
        id: c._id,
        otherParticipant: (c.participants as any[]).find(p => p._id.toString() !== req.user!.id),
        lastMessage: c.lastMessage
    }));
    res.json(formatted);
});

router.get('/:userId', async (req: AuthRequest, res: express.Response) => {
    const conversation = await Conversation.findOne({ participants: { $all: [req.user!.id, req.params.userId] } });
    if (!conversation) return res.json([]);
    const messages = await Message.find({ conversation: conversation._id }).sort({ createdAt: 1 });
    res.json(messages);
});

router.post('/:userId', async (req: AuthRequest, res: express.Response) => {
    let conversation = await Conversation.findOneAndUpdate(
        { participants: { $all: [req.user!.id, req.params.userId] } },
        { $setOnInsert: { participants: [req.user!.id, req.params.userId] } },
        { upsert: true, new: true }
    );
    const newMessage = new Message({
        conversation: conversation._id,
        sender: new mongoose.Types.ObjectId(req.user!.id),
        text: req.body.text
    });
    conversation.lastMessage = { text: req.body.text, sender: new mongoose.Types.ObjectId(req.user!.id), timestamp: new Date() };
    await Promise.all([newMessage.save(), conversation.save()]);
    res.status(201).json(newMessage);
});

export default router;