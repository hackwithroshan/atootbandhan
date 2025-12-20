import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import mongoose from 'mongoose';
import { ChatMessage } from '../../../types.js';

export const getConversations = async (req: AuthRequest, res: Response) => {
    const conversations = await Conversation.find({ participants: req.user?.id })
        .populate('participants', 'fullName profilePhotoUrl')
        .sort({ 'lastMessage.timestamp': -1 });
    
    const formatted = conversations.map(c => ({
        id: c._id,
        otherParticipant: (c.participants as any[]).find(p => p._id.toString() !== req.user!.id),
        lastMessage: c.lastMessage
    }));
    res.json(formatted);
};

export const getMessagesForConversation = async (req: AuthRequest, res: Response) => {
    const conversation = await Conversation.findOne({ participants: { $all: [req.user!.id, req.params.userId] } });
    if (!conversation) return res.json([]);

    const messages = await Message.find({ conversation: conversation._id }).sort({ createdAt: 1 });
    
    const formattedMessages = messages.map((msg: any): ChatMessage => ({
        id: msg.id,
        sender: msg.sender.toString() === req.user!.id ? 'user' : 'other',
        text: msg.text,
        timestamp: msg.createdAt, // Send full ISO string
        status: msg.status
    }));

    res.json(formattedMessages);
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { text } = req.body;
        const fromUserId = req.user!.id;
        const toUserId = req.params.userId;

        let conversation = await Conversation.findOneAndUpdate(
            { participants: { $all: [fromUserId, toUserId] } },
            { $setOnInsert: { participants: [fromUserId, toUserId] } },
            { upsert: true, new: true }
        );

        const newMessage = new Message({
            conversation: conversation._id,
            sender: fromUserId,
            text,
        });

        conversation.lastMessage = {
            text,
            sender: new mongoose.Types.ObjectId(fromUserId),
            timestamp: new Date(),
        };

        await Promise.all([newMessage.save(), conversation.save()]);

        const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'fullName profilePhotoUrl');
        
        // Emit via socket for real-time update
        const io = req.app.get('io');
        if (io) {
            const roomName = [fromUserId, toUserId].sort().join('_');
            io.to(roomName).emit('receive_private_message', populatedMessage);
        }

        res.status(201).json(populatedMessage);
    } catch (error: any) {
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};
