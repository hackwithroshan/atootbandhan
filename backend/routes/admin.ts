import express from 'express';
import { check, validationResult } from 'express-validator';
// FIX: Corrected import path for auth middleware and AuthRequest type.
import { protect as auth, AuthRequest } from '../src/middlewares/auth.middleware.js';
// FIX: Corrected import path for adminAuth middleware.
import adminAuth from '../src/middlewares/adminAuth.middleware.js';
// FIX: Corrected import path for User model.
import User from '../src/models/User.js';
// FIX: Corrected import path for SuccessStory model.
import SuccessStory from '../src/models/SuccessStory.js';
// FIX: Corrected import path for Ticket model.
import Ticket from '../src/models/Ticket.js';
// FIX: Corrected import path for setupDatabase util.
import { setupDatabase } from '../src/utils/setup.js';
import { SupportTicketStatus } from '../../types.js';

const router = express.Router();
router.use(auth, adminAuth);

// FIX: Use express.Response
// FIX: Handler type mismatch.
router.get('/stats', async (req: express.Request, res: express.Response) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const totalUsers = await User.countDocuments();
    const paidMembers = await User.countDocuments({ membershipTier: { $ne: 'Free' } });
    const activeToday = await User.countDocuments({ lastLoginDate: { $gte: today } });
    const newThisWeek = await User.countDocuments({ createdAt: { $gte: oneWeekAgo } });
    const pendingStories = await SuccessStory.countDocuments({ status: 'Pending' });
    const openComplaints = await Ticket.countDocuments({ status: { $in: [SupportTicketStatus.OPEN, SupportTicketStatus.IN_PROGRESS]} });

    // FIX: Property 'json' does not exist.
    res.json({
        totalUsers,
        activeToday,
        newThisWeek,
        paidMembers,
        freeMembers: totalUsers - paidMembers,
        reportedAccounts: 0,
        dailyRevenue: '₹0',
        pendingModerations: 0,
        pendingStories,
        openComplaints,
    });
});

// FIX: Use express.Response
router.get('/users', async (req: AuthRequest, res: express.Response) => {
    const users = await User.find().sort({ createdAt: -1 });
    // FIX: Property 'json' does not exist.
    res.json(users);
});

// FIX: Use express.Response
router.put(
    '/users/:userId/password',
    [
        check('newPassword', 'New password is required and must be at least 6 characters').isLength({ min: 6 })
    ],
    async (req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // FIX: Property 'status' does not exist.
            return res.status(400).json({ msg: errors.array()[0].msg });
        }

        try {
            // FIX: Property 'params' does not exist.
            const user = await User.findById(req.params.userId);

            if (!user) {
                // FIX: Property 'status' does not exist.
                return res.status(404).json({ msg: 'User not found' });
            }

            // FIX: Property 'body' does not exist.
            const { newPassword } = req.body;
            user.password = newPassword; // The pre-save hook in User.ts will hash this
            await user.save();

            // FIX: Property 'json' does not exist.
            res.json({ msg: 'User password updated successfully.' });
        } catch (err: any) {
            console.error('Admin change password error:', err.message);
            // FIX: Property 'status' does not exist.
            res.status(500).json({ msg: 'Server Error' });
        }
    }
);


// FIX: Use express.Request and express.Response
router.get('/setup-database', async (req: express.Request, res: express.Response) => {
    // FIX: Property 'query' does not exist.
    const { secret } = req.query;
    if (!process.env.SETUP_SECRET_KEY || secret !== process.env.SETUP_SECRET_KEY) {
        // FIX: Property 'status' does not exist.
        return res.status(401).json({ msg: 'Unauthorized: Invalid secret key.' });
    }
    try {
        await setupDatabase();
        // FIX: Property 'status' does not exist.
        res.status(200).json({ msg: 'Database setup completed successfully.' });
    } catch (err: any) {
        // FIX: Property 'status' does not exist.
        res.status(500).json({ msg: 'Database setup failed.', error: err.message });
    }
});

export default router;