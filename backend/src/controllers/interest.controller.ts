import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import Interest from '../models/Interest.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Conversation from '../models/Conversation.js';
import { InterestStatus, NotificationType } from '../../../types.js';

export const getSentInterests = async (req: AuthRequest, res: Response) => {
    const interests = await Interest.find({ fromUser: req.user?.id }).populate('toUser', 'fullName city profilePhotoUrl gender occupation membershipTier');
    res.json(interests);
};

export const getReceivedInterests = async (req: AuthRequest, res: Response) => {
    const interests = await Interest.find({ toUser: req.user?.id }).populate('fromUser', 'fullName city profilePhotoUrl gender occupation membershipTier');
    res.json(interests);
};

export const sendInterest = async (req: AuthRequest, res: Response) => {
    const fromUserId = req.user?.id;
    const { toUserId } = req.params;

    if (fromUserId === toUserId) return res.status(400).json({ msg: 'You cannot send an interest to yourself.' });

    const existingInterest = await Interest.findOne({ fromUser: fromUserId, toUser: toUserId });
    if (existingInterest) return res.status(400).json({ msg: 'Interest already sent.' });

    const newInterest = new Interest({ fromUser: fromUserId, toUser: toUserId, status: InterestStatus.PENDING });
    await newInterest.save();

    const sender = await User.findById(fromUserId);
    if (sender) {
        await Notification.create({
            user: toUserId,
            type: NotificationType.INTEREST_RECEIVED,
            title: `${sender.fullName} has expressed interest in you!`,
            message: 'Review their profile and respond.',
            senderProfile: fromUserId,
            isRead: false,
            redirectTo: 'ExpressedInterests',
        });
    }
    res.status(201).json({ msg: 'Interest sent successfully.' });
};

export const updateInterestStatus = async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    const interest = await Interest.findById(req.params.id);
    if (!interest) return res.status(404).json({ msg: 'Interest not found.' });

    if (interest.toUser.toString() !== req.user?.id && interest.fromUser.toString() !== req.user?.id) {
        return res.status(401).json({ msg: 'Not authorized to update this interest.' });
    }

    interest.status = status;

    if (status === InterestStatus.ACCEPTED) {
        const accepter = await User.findById(req.user?.id);
        if (accepter) {
            await Notification.create({
                user: interest.fromUser,
                type: NotificationType.INTEREST_ACCEPTED,
                title: `${accepter.fullName} accepted your interest!`,
                message: 'You can now start a conversation.',
                senderProfile: interest.toUser,
                isRead: false,
                redirectTo: 'Messages',
            });
        }
        
        // Create a conversation for them
        const existingConversation = await Conversation.findOne({
            participants: { $all: [interest.fromUser, interest.toUser] }
        });

        if (!existingConversation) {
            const newConversation = await Conversation.create({
                participants: [interest.fromUser, interest.toUser]
            });
            // Notify both users via sockets that a new conversation is ready
            const io = req.app.get('io');
            if(io) {
                const populatedConvo = await Conversation.findById(newConversation._id).populate('participants', 'fullName profilePhotoUrl');
                io.to(interest.fromUser.toString()).emit('conversation_updated', populatedConvo);
                io.to(interest.toUser.toString()).emit('conversation_updated', populatedConvo);
            }
        }
    }
    
    await interest.save();
    res.json(interest);
};
