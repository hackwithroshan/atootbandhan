import express from 'express';
// FIX: Corrected import path for auth middleware and AuthRequest type.
import { protect as auth, AuthRequest } from '../src/middlewares/auth.middleware.js';
// FIX: Corrected import path for User model.
import User from '../src/models/User.js';
// FIX: Corrected import path for Interest model.
import Interest from '../src/models/Interest.js';
// FIX: Corrected import path for Notification model.
import Notification from '../src/models/Notification.js';
// FIX: Corrected import path for Conversation model.
import Conversation from '../src/models/Conversation.js';
// FIX: Corrected import path for Message model.
import Message from '../src/models/Message.js';
import { InterestStatus, NotificationType } from '../../types.js';

const router = express.Router();

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.get('/stats', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    const interestsReceived = await Interest.countDocuments({ toUser: authReq.user!.id, status: InterestStatus.PENDING });
    const profileViews = await Notification.countDocuments({ user: authReq.user!.id, type: NotificationType.PROFILE_VIEW });
    const shortlistedBy = await User.countDocuments({ shortlistedProfiles: authReq.user!.id });
    const conversations = await Conversation.find({ participants: authReq.user!.id });
    const newMessages = await Message.countDocuments({
        conversation: { $in: conversations.map(c => c._id) },
        sender: { $ne: authReq.user!.id },
        status: { $ne: 'seen' }
    });

    // FIX: Property 'json' does not exist.
    res.json({ interestsReceived, profileViews, newMessages, shortlistedBy });
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.get('/activity', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    const activities = await Notification.find({ user: authReq.user?.id }).sort({ createdAt: -1 }).limit(10);
    // FIX: Property 'json' does not exist.
    res.json(activities.map(a => ({ id: a._id, title: a.title, createdAt: (a as any).createdAt })));
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.get('/profile-completion', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    const user = await User.findById(authReq.user?.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    let completedFields = 0;
    const fields = ['fullName', 'profileBio', 'profilePhotoUrl', 'caste', 'city', 'education', 'occupation', 'hobbies', 'familyType', 'fatherOccupation'];
    fields.forEach(f => { if ((user as any)[f]) completedFields++; });
    const percentage = Math.round((completedFields / fields.length) * 100);

    if (user.profileCompletion !== percentage) {
        user.profileCompletion = percentage;
        await user.save();
    }
    // FIX: Property 'json' does not exist.
    res.json({ percentage });
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.get('/notifications', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    const notifications = await Notification.find({ user: authReq.user?.id }).populate('senderProfile', 'fullName profilePhotoUrl').sort({ createdAt: -1 }).limit(20);
    // FIX: Property 'json' does not exist.
    res.json(notifications);
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.put('/notifications/read-all', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    await Notification.updateMany({ user: authReq.user?.id, isRead: false }, { isRead: true });
    res.json({ msg: 'All marked as read.' });
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.put('/notifications/:id/read', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    // FIX: Property 'params' does not exist.
    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, user: authReq.user?.id }, { isRead: true }, { new: true });
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    // FIX: Property 'json' does not exist.
    res.json(notification);
});

export default router;