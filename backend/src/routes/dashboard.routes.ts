import express from 'express';
import { AuthRequest, protect as auth } from '../middlewares/auth.middleware.js';
import User from '../models/User.js';
import Interest from '../models/Interest.js';
import Notification from '../models/Notification.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { InterestStatus, NotificationType } from '../../../types.js';

const router = express.Router();

// All routes are protected
router.use(auth);

router.get('/stats', async (req: AuthRequest, res: express.Response) => {
    const interestsReceived = await Interest.countDocuments({ toUser: req.user!.id, status: InterestStatus.PENDING });
    const profileViews = await Notification.countDocuments({ user: req.user!.id, type: NotificationType.PROFILE_VIEW });
    const shortlistedBy = await User.countDocuments({ shortlistedProfiles: req.user!.id });
    const conversations = await Conversation.find({ participants: req.user!.id });
    const newMessages = await Message.countDocuments({
        conversation: { $in: conversations.map(c => c._id) },
        sender: { $ne: req.user!.id },
        status: { $ne: 'seen' }
    });

    res.json({ interestsReceived, profileViews, newMessages, shortlistedBy });
});

router.get('/activity', async (req: AuthRequest, res: express.Response) => {
    const activities = await Notification.find({ user: req.user?.id }).sort({ createdAt: -1 }).limit(10);
    res.json(activities.map(a => ({ id: a._id, title: a.title, createdAt: (a as any).createdAt })));
});

router.get('/profile-completion', async (req: AuthRequest, res: express.Response) => {
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    let completedFields = 0;
    const fields = ['fullName', 'profileBio', 'profilePhotoUrl', 'caste', 'city', 'education', 'occupation', 'hobbies', 'familyType', 'fatherOccupation'];
    fields.forEach(f => { if ((user as any)[f]) completedFields++; });
    const percentage = Math.round((completedFields / fields.length) * 100);

    if (user.profileCompletion !== percentage) {
        user.profileCompletion = percentage;
        await user.save();
    }
    res.json({ percentage });
});

router.get('/notifications', async (req: AuthRequest, res: express.Response) => {
    const notifications = await Notification.find({ user: req.user?.id }).populate('senderProfile', 'fullName profilePhotoUrl').sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
});

router.put('/notifications/read-all', async (req: AuthRequest, res: express.Response) => {
    await Notification.updateMany({ user: req.user?.id, isRead: false }, { isRead: true });
    res.status(204).send();
});

router.put('/notifications/:id/read', async (req: AuthRequest, res: express.Response) => {
    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user?.id }, { isRead: true }, { new: true });
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    res.json(notification);
});

export default router;