import { Router } from 'express';
import { check } from 'express-validator';
import { AuthRequest, protect as auth } from '../middlewares/auth.middleware.js';
import adminAuth from '../middlewares/adminAuth.middleware.js';
import { setupDatabase } from '../utils/setup.js';

import {
    getStats,
    getUsers,
    updateUserProfile,
    updateUserStatus,
    updateUserPassword,
    bulkUpdateUserStatus,
    getComplaints,
    resolveComplaint,
    getTransactions,
    getInterests,
    updatePlan,
    getCoupons,
    createCoupon,
    deleteCoupon,
    getCampaigns,
    createCampaign,
    getReminders,
    setReminder,
    getBanners,
    createBanner,
    deleteBanner,
    getSiteSettings,
    updateSiteSettings,
    getBlogPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getStaticPages,
    updateStaticPage,
    getSuccessStories,
    updateSuccessStory,
    deleteSuccessStory,
    getAnalyticsStats,
    getSearchAnalytics,
    getABTests,
    createABTest,
    updateABTest,
    deleteABTest,
    getAffiliates,
    createAffiliate,
    updateAffiliate,
    deleteAffiliate,
    getUserReferrals,
    getAdmins,
    createAdmin,
    deleteAdmin,
    getAuditLogs,
} from '../controllers/admin.controller.js';

const router = Router();

// All routes in this file are protected by auth and adminAuth middleware
router.use(auth, adminAuth);

// --- DASHBOARD ---
router.get('/stats', getStats);

// --- USER MANAGEMENT ---
router.get('/users', getUsers);
router.put('/users/bulk-status', bulkUpdateUserStatus);
router.put('/users/:userId', updateUserProfile);
router.put('/users/:userId/status', updateUserStatus);
router.put(
    '/users/:userId/password',
    [
        check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
    ],
    updateUserPassword
);
router.delete('/users/:userId/permanent', (req, res, next) => { /* ... permanent delete logic ... */ });
router.post('/users/:userId/restore', (req, res, next) => { /* ... restore logic ... */ });


// --- COMPLAINTS ---
router.get('/complaints', getComplaints);
router.put('/complaints/:ticketId', resolveComplaint);


// --- PAYMENTS, PLANS, COUPONS ---
router.get('/transactions', getTransactions);
router.get('/interests', getInterests);
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.put('/plans/:id', updatePlan);

// --- NOTIFICATION & CAMPAIGN MANAGEMENT ---
router.get('/campaigns', getCampaigns);
router.post('/campaigns', createCampaign);
router.get('/reminders', getReminders);
router.post('/reminders', setReminder);
router.get('/banners', getBanners);
router.post('/banners', createBanner);
router.delete('/banners/:id', deleteBanner);

// --- CONTENT MANAGEMENT ---
router.get('/site-settings', getSiteSettings);
router.put('/site-settings', updateSiteSettings);
router.get('/blog-posts', getBlogPosts);
router.post('/blog-posts', createBlogPost);
router.put('/blog-posts/:id', updateBlogPost);
router.delete('/blog-posts/:id', deleteBlogPost);
router.get('/static-pages', getStaticPages);
router.put('/static-pages/:id', updateStaticPage);
router.get('/success-stories', getSuccessStories);
router.put('/success-stories/:id', updateSuccessStory);
router.delete('/success-stories/:id', deleteSuccessStory);

// --- ANALYTICS & TESTING ---
router.get('/analytics/stats', getAnalyticsStats);
router.get('/analytics/search-logs', getSearchAnalytics);
router.get('/ab-tests', getABTests);
router.post('/ab-tests', createABTest);
router.put('/ab-tests/:id', updateABTest);
router.delete('/ab-tests/:id', deleteABTest);
router.get('/affiliates', getAffiliates);
router.post('/affiliates', createAffiliate);
router.put('/affiliates/:id', updateAffiliate);
router.delete('/affiliates/:id', deleteAffiliate);
router.get('/referrals/users', getUserReferrals);

// --- ADMIN & ROLE MANAGEMENT ---
router.get('/admins', getAdmins);
router.post('/admins', [check('email').isEmail(), check('role').notEmpty()], createAdmin);
router.delete('/admins/:id', deleteAdmin);
router.get('/audit-logs', getAuditLogs);


// --- DATABASE SETUP (for development) ---
router.get('/setup-database', async (req, res) => {
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