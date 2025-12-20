import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import SuccessStory from '../models/SuccessStory.js';
import Ticket from '../models/Ticket.js';
import Plan from '../models/Plan.js';
import Transaction from '../models/Transaction.js';
import Coupon from '../models/Coupon.js';
import Interest from '../models/Interest.js';
import Notification from '../models/Notification.js';
import NotificationCampaign from '../models/NotificationCampaign.js';
import AutomatedReminder from '../models/AutomatedReminder.js';
import AnnouncementBanner from '../models/AnnouncementBanner.js';
import SiteSetting from '../models/SiteSetting.js';
import BlogPost from '../models/BlogPost.js';
import StaticPage from '../models/StaticPage.js';
import SearchLog from '../models/SearchLog.js';
import Affiliate from '../models/Affiliate.js';
import AdminAuditLog from '../models/AdminAuditLog.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { SupportTicketStatus, UserStatus, NotificationType } from '../../types.js';
// FIX: Added missing import for ABTest model.
import ABTest from '../models/ABTest.js';

// --- DASHBOARD ---
export const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const [
            totalUsers,
            paidMembers,
            activeToday,
            newThisWeek,
            pendingStories,
            openComplaints,
            reportedAccounts,
            pendingModerations,
            dailyRevenueData
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ membershipTier: { $ne: 'Free' } }),
            User.countDocuments({ lastLoginDate: { $gte: today } }),
            User.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
            SuccessStory.countDocuments({ status: 'Pending' }),
            Ticket.countDocuments({ status: { $in: [SupportTicketStatus.OPEN, SupportTicketStatus.IN_PROGRESS]} }),
            Ticket.countDocuments({ category: 'Report Abuse/Spam', status: SupportTicketStatus.OPEN }),
            User.countDocuments({ status: UserStatus.PENDING_APPROVAL }),
            Transaction.aggregate([
              { $match: { status: 'Success', createdAt: { $gte: today } } },
              { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
            ])
        ]);

        res.json({
            totalUsers,
            activeToday,
            newThisWeek,
            paidMembers,
            freeMembers: totalUsers - paidMembers,
            reportedAccounts,
            dailyRevenue: `₹${dailyRevenueData[0]?.totalRevenue.toLocaleString('en-IN') || '0'}`,
            pendingModerations,
            pendingStories,
            openComplaints,
        });
    } catch (err) {
        next(err);
    }
};

// --- ANALYTICS ---
export const getAnalyticsStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            dailySignups,
            dailyActiveUsers,
            matchViewCountsToday,
            successfulTransactionsToday,
            photoUploadsToday,
        ] = await Promise.all([
            User.countDocuments({ createdAt: { $gte: today } }),
            User.countDocuments({ lastLoginDate: { $gte: today } }),
            Notification.countDocuments({ type: NotificationType.PROFILE_VIEW, createdAt: { $gte: today } }),
            Transaction.countDocuments({ status: 'Success', createdAt: { $gte: today } }),
            User.countDocuments({ profilePhotoUrl: { $ne: null }, createdAt: { $gte: today } }),
        ]);

        const suspiciousUsers = await User.find({
            'loginActivity.timestamp': { $gte: today.toISOString() },
            'loginActivity.status': 'Failed'
        }).limit(10);
        
        let suspiciousLogins: any[] = [];
        suspiciousUsers.forEach(user => {
            const failedLogins = user.loginActivity?.filter((log: any) => new Date(log.timestamp) >= today && log.status === 'Failed') || [];
            if (failedLogins.length > 2) {
                suspiciousLogins.push(...failedLogins);
            }
        });
        suspiciousLogins = suspiciousLogins.slice(0, 5);

        const conversionRate = dailyActiveUsers > 0 ? ((successfulTransactionsToday / dailyActiveUsers) * 100).toFixed(2) : '0.00';

        res.json({
            dailySignups,
            dailyActiveUsers,
            dailyLogins: dailyActiveUsers,
            matchViewCountsToday,
            photoUploadsToday,
            paymentConversionRate: `${conversionRate}%`,
            bounceRate: 'N/A',
            avgSessionDuration: 'N/A',
            suspiciousLogins,
        });

    } catch(err) {
        next(err);
    }
};

const getTopTerms = async (field: string, limit = 10) => {
    return SearchLog.aggregate([
        // FIX: The query `$ne: null, $ne: ''` is invalid as it uses the same operator twice.
        // Replaced with `$nin: [null, '']` to check for values that are not null and not an empty string.
        { $match: { [`params.${field}`]: { $exists: true, $nin: [null, ''] } } },
        { $group: { _id: { $toLower: `$params.${field}` }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $project: { _id: '$_id', count: 1 } }
    ]);
};

export const getSearchAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [
            topKeywords,
            topCities,
            topCastes,
            topReligions,
            zeroResultSearches
        ] = await Promise.all([
            getTopTerms('keyword'),
            getTopTerms('city'),
            getTopTerms('caste'),
            getTopTerms('religion'),
            SearchLog.aggregate([
                // FIX: The query `$ne: null, $ne: ''` is invalid as it uses the same operator twice.
                // Replaced with `$nin: [null, '']` to check for values that are not null and not an empty string.
                { $match: { resultCount: 0, 'params.keyword': { $exists: true, $nin: [null, ''] } } },
                { $group: { _id: { $toLower: '$params.keyword' }, count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
                { $project: { _id: '$_id', count: 1 } }
            ])
        ]);

        res.json({
            topKeywords,
            topCities,
            topCastes,
            topReligions,
            zeroResultSearches
        });

    } catch(err) {
        next(err);
    }
};

// --- A/B TESTING ---
export const getABTests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tests = await ABTest.find().sort({ createdAt: -1 });
        res.json(tests);
    } catch (err) {
        next(err);
    }
};

export const createABTest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const test = new ABTest(req.body);
        await test.save();
        res.status(201).json(test);
    } catch (err) {
        next(err);
    }
};

export const updateABTest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const test = await ABTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!test) return res.status(404).json({ msg: 'A/B Test not found.' });
        res.json(test);
    } catch (err) {
        next(err);
    }
};

export const deleteABTest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const test = await ABTest.findByIdAndDelete(req.params.id);
        if (!test) return res.status(404).json({ msg: 'A/B Test not found.' });
        res.json({ msg: 'A/B Test deleted.' });
    } catch (err) {
        next(err);
    }
};

// --- REFERRAL & AFFILIATE ---
export const getAffiliates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const affiliates = await Affiliate.find().sort({ createdAt: -1 });
        res.json(affiliates);
    } catch (err) { next(err); }
};

export const createAffiliate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, commissionRate, expiryDate } = req.body;
        const referralCode = (name.replace(/\s+/g, '').substring(0, 8) + Math.random().toString(36).substring(2, 6)).toUpperCase();
        const affiliate = new Affiliate({ name, commissionRate, expiryDate: expiryDate || null, referralCode });
        await affiliate.save();
        res.status(201).json(affiliate);
    } catch (err) { next(err); }
};

export const updateAffiliate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const affiliate = await Affiliate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!affiliate) return res.status(404).json({ msg: 'Affiliate not found.' });
        res.json(affiliate);
    } catch (err) { next(err); }
};

export const deleteAffiliate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const affiliate = await Affiliate.findByIdAndDelete(req.params.id);
        if (!affiliate) return res.status(404).json({ msg: 'Affiliate not found.' });
        res.json({ msg: 'Affiliate deleted.' });
    } catch (err) { next(err); }
};

export const getUserReferrals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // This is a placeholder for a more complex referral tracking system.
        // For now, it returns an empty array as the user registration flow doesn't handle referral codes yet.
        const referrals: any[] = [];
        res.json(referrals);
    } catch (err) { next(err); }
};


// --- USER MANAGEMENT ---
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query: any = {};
        // Basic filtering example
        if (req.query.status) query.status = req.query.status;
        if (req.query.membershipPlan) query.membershipTier = req.query.membershipPlan;
        if (req.query.search) {
             const searchRegex = { $regex: req.query.search, $options: 'i' };
             query.$or = [{ fullName: searchRegex }, { email: searchRegex }];
        }
        
        const users = await User.find(query).sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        next(err);
    }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const allowedUpdates = [
            'fullName', 'email', 'membershipTier', 'status', 'city', 'caste', 'isVerifiedByAdmin'
        ];

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                (user as any)[key] = req.body[key];
            }
        });

        await user.save();
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const bulkUpdateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userIds, status, reason } = req.body;
        if (!userIds || !Array.isArray(userIds) || !status) {
            return res.status(400).json({ msg: 'User IDs array and status are required.' });
        }

        const updatePayload: any = { status };
        if (status === UserStatus.SUSPENDED) updatePayload.suspensionReason = reason;
        if (status === UserStatus.BANNED) updatePayload.banReason = reason;
        
        if (status === UserStatus.ACTIVE) {
            updatePayload.suspensionReason = undefined;
            updatePayload.suspensionEndDate = undefined;
            updatePayload.banReason = undefined;
        }

        const result = await User.updateMany(
            { _id: { $in: userIds } },
            { $set: updatePayload }
        );

        res.json({ msg: `${result.modifiedCount} users updated successfully.` });
    } catch (err) {
        next(err);
    }
};


export const updateUserStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { status, reason, suspensionEndDate } = req.body;
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const performingAdmin = await User.findById(req.user!.id);
        if (!performingAdmin) return res.status(401).json({ msg: 'Could not identify acting admin.' });

        user.status = status;
        if (status === UserStatus.DELETED) {
            user.deletionReason = reason || 'Admin action';
            user.deletionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
            user.deletedBy = { id: performingAdmin._id, name: performingAdmin.fullName };
        } else if (status === UserStatus.SUSPENDED) {
            user.suspensionReason = reason;
            user.suspensionEndDate = suspensionEndDate ? new Date(suspensionEndDate) : undefined;
        } else if (status === UserStatus.BANNED) {
            user.banReason = reason;
        } else if (status === UserStatus.ACTIVE) { // Restoring
            user.deletionReason = undefined;
            user.deletionExpiresAt = undefined;
            user.deletedBy = undefined;
            user.suspensionReason = undefined;
            user.suspensionEndDate = undefined;
        }
        await user.save();
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const updateUserPassword = async (req: Request, res: Response, next: NextFunction) => {
     try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        const { newPassword } = req.body;
        user.password = newPassword; // Pre-save hook will hash it
        await user.save();

        res.json({ msg: 'User password updated successfully.' });
    } catch (err) {
        next(err);
    }
};

// --- PLAN & COUPON MANAGEMENT ---

export const updatePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ msg: 'Plan not found' });
        }
        
        if (req.body.features && typeof req.body.features === 'string') {
            req.body.features = req.body.features.split('\n').map((line: string) => {
                const [text, includedStr] = line.split('|');
                return { text: text.trim(), included: includedStr?.trim().toLowerCase() === 'true' };
            }).filter((f: any) => f.text);
        }

        Object.assign(plan, req.body);
        await plan.save();
        res.json(plan);

    } catch(err) {
        next(err);
    }
};

export const getCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (err) {
        next(err);
    }
};

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newCoupon = new Coupon(req.body);
        await newCoupon.save();
        res.status(201).json(newCoupon);
    } catch(err) {
        next(err);
    }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ msg: 'Coupon not found' });
        }
        res.json({ msg: 'Coupon deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// --- NOTIFICATION & CAMPAIGN MANAGEMENT ---

export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const campaigns = await NotificationCampaign.find().sort({ createdAt: -1 }).limit(50);
        res.json(campaigns);
    } catch (err) {
        next(err);
    }
};

export const createCampaign = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const campaign = new NotificationCampaign(req.body);
        await campaign.save();
        // In a real app, this is where you'd trigger the email/SMS sending job
        res.status(201).json(campaign);
    } catch (err) {
        next(err);
    }
};

export const getReminders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reminders = await AutomatedReminder.find({ isActive: true });
        res.json(reminders);
    } catch(err) {
        next(err);
    }
};

export const setReminder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rule, delayInDays, messageTemplate } = req.body;
        const reminder = await AutomatedReminder.findOneAndUpdate(
            { rule },
            { delayInDays, messageTemplate, isActive: true },
            { upsert: true, new: true }
        );
        res.status(201).json(reminder);
    } catch (err) {
        next(err);
    }
};

export const getBanners = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const banners = await AnnouncementBanner.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(banners);
    } catch (err) {
        next(err);
    }
};

export const createBanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const banner = new AnnouncementBanner(req.body);
        await banner.save();
        res.status(201).json(banner);
    } catch (err) {
        next(err);
    }
};

export const deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const banner = await AnnouncementBanner.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({ msg: 'Banner not found' });
        }
        res.json({ msg: 'Banner deleted successfully' });
    } catch (err) {
        next(err);
    }
};


// --- CONTENT MANAGEMENT ---

export const getSiteSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const settings = await SiteSetting.getSettings();
        res.json(settings);
    } catch(err) { next(err); }
};

export const updateSiteSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const settings = await SiteSetting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(settings);
    } catch(err) { next(err); }
};

export const getBlogPosts = async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await BlogPost.find().sort({ createdAt: -1 })); }
    catch(err) { next(err); }
};

export const createBlogPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = new BlogPost(req.body);
        await post.save();
        res.status(201).json(post);
    } catch(err) { next(err); }
};

export const updateBlogPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!post) return res.status(404).json({ msg: 'Blog post not found.' });
        res.json(post);
    } catch(err) { next(err); }
};

export const deleteBlogPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await BlogPost.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Blog post not found.' });
        res.json({ msg: 'Blog post deleted.' });
    } catch(err) { next(err); }
};

export const getStaticPages = async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await StaticPage.find()); }
    catch(err) { next(err); }
};

export const updateStaticPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = await StaticPage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!page) return res.status(404).json({ msg: 'Page not found.' });
        res.json(page);
    } catch(err) { next(err); }
};

export const getSuccessStories = async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await SuccessStory.find().populate('submittedBy', 'fullName').sort({ createdAt: -1 })); }
    catch(err) { next(err); }
};

export const updateSuccessStory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const story = await SuccessStory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!story) return res.status(404).json({ msg: 'Story not found.' });
        res.json(story);
    } catch(err) { next(err); }
};

export const deleteSuccessStory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const story = await SuccessStory.findByIdAndDelete(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found.' });
        res.json({ msg: 'Story deleted.' });
    } catch(err) { next(err); }
};


// --- MISC & PAYMENTS ---

export const getComplaints = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const complaints = await Ticket.find().populate('user', 'fullName').sort({ lastUpdatedDate: -1 });
        res.json(complaints);
    } catch(err) {
        next(err);
    }
};

export const resolveComplaint = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { resolutionNotes } = req.body;
        const ticket = await Ticket.findById(req.params.ticketId);

        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found.' });
        }

        const performingAdmin = await User.findById(req.user!.id);
        if (!performingAdmin) return res.status(401).json({ msg: 'Could not identify acting admin.' });
        
        ticket.status = SupportTicketStatus.RESOLVED;
        ticket.messages.push({
            sender: 'admin',
            text: `Resolution: ${resolutionNotes}`,
            timestamp: new Date()
        } as any);
        await ticket.save();
        
        const newLog = new AdminAuditLog({
            adminId: performingAdmin.id,
            adminName: performingAdmin.fullName,
            action: 'COMPLAINT_RESOLVED',
            targetType: 'Ticket',
            targetId: ticket.id,
            details: `Resolved complaint/ticket with notes: "${resolutionNotes}"`,
            ipAddress: req.ip,
        });
        await newLog.save();

        res.json(ticket);
    } catch (err) {
        next(err);
    }
};


export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transactions = await Transaction.find()
            .populate('user', 'fullName')
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(transactions);
    } catch(err) {
        next(err);
    }
}

export const getInterests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const interests = await Interest.find()
            .populate('fromUser', 'fullName')
            .populate('toUser', 'fullName')
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(interests);
    } catch(err) {
        next(err);
    }
}

// --- ADMIN & ROLE MANAGEMENT ---
export const getAdmins = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admins = await User.find({ role: { $ne: 'user' } }).sort({ createdAt: -1 });
        res.json(admins);
    } catch (err) { next(err); }
};

export const createAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { email, role } = req.body;

        const performingAdmin = await User.findById(req.user!.id);
        if (!performingAdmin) return res.status(401).json({ msg: 'Could not identify acting admin.' });

        let user = await User.findOne({ email });
        const userExisted = !!user;

        if (user) {
            user.role = role;
            await user.save();
        } else {
            const randomPassword = Math.random().toString(36).slice(-8);
            user = new User({
                email,
                role,
                fullName: 'New Admin (Please Update)',
                password: randomPassword, // Will be hashed on save
                isVerified: true,
                status: UserStatus.ACTIVE,
            });
            await user.save();
        }
        
        const newLog = new AdminAuditLog({
            adminId: performingAdmin.id,
            adminName: performingAdmin.fullName,
// FIX: The original logic `user ? 'ADMIN_ROLE_ASSIGNED' : 'ADMIN_CREATED'` was flawed because `user` would always be truthy. This now correctly logs whether a new admin was created or an existing user was promoted.
            action: userExisted ? 'ADMIN_ROLE_ASSIGNED' : 'ADMIN_CREATED',
            targetType: 'User',
// FIX: The `.toString()` call on `user.id` is redundant and can cause type errors. The `id` virtual on a Mongoose document is already a string.
            targetId: user.id,
            details: `Assigned role '${role}' to user ${email}.`,
            ipAddress: req.ip,
        });
        await newLog.save();

        res.status(201).json(user);
    } catch (err) { next(err); }
};

export const deleteAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const performingAdmin = await User.findById(req.user!.id);
        if (!performingAdmin) return res.status(401).json({ msg: 'Could not identify acting admin.' });

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Admin user not found.' });
        if (user.role === 'Super Admin') return res.status(403).json({ msg: 'Cannot delete a Super Admin.' });

        await User.findByIdAndDelete(req.params.id);

        const newLog = new AdminAuditLog({
            adminId: performingAdmin.id,
            adminName: performingAdmin.fullName,
            action: 'ADMIN_DELETED',
            targetType: 'User',
// FIX: The `.toString()` call on `user.id` is redundant and can cause type errors. The `id` virtual on a Mongoose document is already a string.
            targetId: user.id,
            details: `Deleted admin user ${user.email}.`,
            ipAddress: req.ip,
        });
        await newLog.save();

        res.json({ msg: 'Admin user deleted.' });
    } catch (err) { next(err); }
};

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logs = await AdminAuditLog.find().sort({ createdAt: -1 }).limit(100);
        res.json(logs);
    } catch (err) { next(err); }
};