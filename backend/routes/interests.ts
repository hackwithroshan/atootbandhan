import express from 'express';
// FIX: Corrected import path for auth middleware and AuthRequest type.
import { protect as auth, AuthRequest } from '../src/middlewares/auth.middleware.js';
// FIX: Corrected import path for Interest model.
import Interest from '../src/models/Interest.js';
// FIX: Corrected import path for User model.
import User from '../src/models/User.js';
// FIX: Corrected import path for Notification model.
import Notification from '../src/models/Notification.js';
import { InterestStatus, NotificationType } from '../../types.js';

const router = express.Router();

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.get('/sent', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    const interests = await Interest.find({ fromUser: authReq.user?.id }).populate('toUser', 'fullName city profilePhotoUrl gender occupation membershipTier');
    // FIX: Property 'json' does not exist.
    res.json(interests);
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.get('/received', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    const interests = await Interest.find({ toUser: authReq.user?.id }).populate('fromUser', 'fullName city profilePhotoUrl gender occupation membershipTier');
    // FIX: Property 'json' does not exist.
    res.json(interests);
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.post('/:toUserId', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    const fromUserId = authReq.user?.id;
    // FIX: Property 'params' does not exist.
    const { toUserId } = req.params;

    if (fromUserId === toUserId) return res.status(400).json({ msg: 'You cannot send an interest to yourself.' });

    const existingInterest = await Interest.findOne({ fromUser: fromUserId, toUser: toUserId });
    if (existingInterest) return res.status(400).json({ msg: 'Interest already sent.' });

    const newInterest = new Interest({ fromUser: fromUserId, toUser: toUserId, status: InterestStatus.PENDING });
    await newInterest.save();

    const sender = await User.findById(fromUserId);
    if (sender) {
        // FIX: Argument of type '{...}' is not assignable. Added missing properties.
        await Notification.create({
            user: toUserId,
            type: NotificationType.INTEREST_RECEIVED,
            title: `${sender.fullName} has expressed interest in you!`,
            message: 'Review their profile and respond.',
            senderProfile: fromUserId,
            isRead: false,
        });
    }
    // FIX: Property 'status' does not exist.
    res.status(201).json({ msg: 'Interest sent successfully.' });
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.put('/:id', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    // FIX: Property 'body' does not exist.
    const { status } = req.body;
    // FIX: Property 'params' does not exist.
    const interest = await Interest.findById(req.params.id);
    if (!interest) return res.status(404).json({ msg: 'Interest not found.' });

    if (interest.toUser.toString() !== authReq.user?.id && interest.fromUser.toString() !== authReq.user?.id) {
        // FIX: Property 'status' does not exist.
        return res.status(401).json({ msg: 'Not authorized to update this interest.' });
    }

    interest.status = status;

    if (status === InterestStatus.ACCEPTED) {
        const accepter = await User.findById(authReq.user?.id);
        if (accepter) {
            // FIX: Argument of type '{...}' is not assignable. Added missing properties.
            await Notification.create({
                user: interest.fromUser,
                type: NotificationType.INTEREST_ACCEPTED,
                title: `${accepter.fullName} accepted your interest!`,
                message: 'You can now start a conversation.',
                senderProfile: interest.toUser,
                isRead: false,
            });
        }
    }
    
    await interest.save();
    // FIX: Property 'json' does not exist.
    res.json(interest);
});

export default router;