import express from 'express';
import { check, validationResult } from 'express-validator';
import { AuthRequest, protect as auth } from '../middlewares/auth.middleware.js';
import adminAuth from '../middlewares/adminAuth.middleware.js';
import User from '../models/User.js';
import SuccessStory from '../models/SuccessStory.js';
import Ticket from '../models/Ticket.js';
import { setupDatabase } from '../utils/setup.js';
import { SupportTicketStatus, UserStatus } from '../../types.js';

const router = express.Router();

// All routes in this file are protected by auth and adminAuth middleware
router.use(auth, adminAuth);

router.get('/stats', async (req: AuthRequest, res: express.Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const totalUsers = await User.countDocuments();
        const paidMembers = await User.countDocuments({ membershipTier: { $ne: 'Free' } });
        const activeToday = await User.countDocuments({ lastLoginDate: { $gte: today } });
        const newThisWeek = await User.countDocuments({ createdAt: { $gte: oneWeekAgo } });
        const pendingStories = await SuccessStory.countDocuments({ status: 'Pending' });
        const openComplaints = await Ticket.countDocuments({ status: { $in: [SupportTicketStatus.OPEN, SupportTicketStatus.IN_PROGRESS]} });

        res.json({
            totalUsers,
            activeToday,
            newThisWeek,
            paidMembers,
            freeMembers: totalUsers - paidMembers,
            reportedAccounts: 0, // Placeholder
            dailyRevenue: '₹0', // Placeholder
            pendingModerations: 0, // Placeholder
            pendingStories,
            openComplaints,
        });
    } catch (err: any) {
        console.error("Admin stats error:", err);
        res.status(500).json({ msg: 'Server error fetching admin stats.' });
    }
});

router.get('/users', async (req: AuthRequest, res: express.Response) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
});

router.put(
    '/users/:userId/password',
    [
        check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
    ],
    async (req: AuthRequest, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg });
        }

        try {
            const user = await User.findById(req.params.userId);

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            const { newPassword } = req.body;
            user.password = newPassword; // The pre-save hook in User.ts will hash this
            await user.save();

            res.json({ msg: 'User password updated successfully.' });
        } catch (err: any) {
            console.error('Admin change password error:', err.message);
            res.status(500).json({ msg: 'Server Error' });
        }
    }
);

router.get('/setup-database', async (req: express.Request, res: express.Response) => {
    const { secret } = req.query;
    if (!process.env.SETUP_SECRET_KEY || secret !== process.env.SETUP_SECRET_KEY) {
        return res.status(401).json({ msg: 'Unauthorized: Invalid secret key.' });
    }
    try {
        await setupDatabase();
        res.status(200).json({ msg: 'Database setup completed successfully.' });
    } catch (err: any) {
        res.status(500).json({ msg: 'Database setup failed.', error: err.message });
    }
});

export default router;