import express from 'express';
import { AuthRequest, protect as auth } from '../middlewares/auth.middleware.js';
import User from '../models/User.js';
import Interest from '../models/Interest.js';
import { Gender, UserStatus, InterestStatus } from '../../types.js';

const router = express.Router();

router.get('/featured', async (req: express.Request, res: express.Response) => {
    const users = await User.find({ status: UserStatus.ACTIVE, profilePhotoUrl: { $ne: null } }).sort({ createdAt: -1 }).limit(4).select('-password');
    res.json(users);
});

router.get('/profile', auth, async (req: AuthRequest, res: express.Response) => {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
});

router.put('/profile', auth, async (req: AuthRequest, res: express.Response) => {
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const allowedUpdates = [
        'fullName', 'dateOfBirth', 'gender', 'heightValue', 'heightUnit', 'weightValue', 'weightUnit', 'religion', 'caste', 'subCaste', 'motherTongue', 'maritalStatus', 'manglikStatus', 'profileCreatedBy', 'fatherOccupation', 'motherOccupation', 'brothers', 'marriedBrothers', 'sisters', 'marriedSisters', 'familyType', 'familyValues', 'familyIncome', 'dietaryHabits', 'smokingHabits', 'drinkingHabits', 'hobbies', 'generalHabits', 'education', 'college', 'occupation', 'jobTitle', 'companyName', 'companyLocation', 'annualIncome', 'isAnnualIncomeVisible', 'partnerPreferences', 'profileBio', 'photos', 'profilePhotoUrl', 'city', 'state', 'country'
    ];
    
    // This dynamically updates the user object
    Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
            (user as any)[key] = req.body[key];
        }
    });
    
    await user.save();
    res.json(user);
});

router.post('/search', auth, async (req: AuthRequest, res: express.Response) => {
    const currentUser = await User.findById(req.user?.id);
    if (!currentUser) return res.status(404).json({ msg: 'User not found' });
    
    const query: any = { _id: { $ne: req.user!.id }, gender: currentUser.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE };
    const { keyword, religion, city, caste } = req.body;
    if (keyword) query.$or = [{ fullName: { $regex: keyword, $options: 'i' } }, { occupation: { $regex: keyword, $options: 'i' } }];
    if (religion) query.religion = religion;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (caste) query.caste = { $regex: caste, $options: 'i' };

    const users = await User.find(query).limit(50).select('-password');
    res.json(users);
});

router.get('/shortlisted', auth, async (req: AuthRequest, res: express.Response) => {
    const user = await User.findById(req.user?.id).populate('shortlistedProfiles', 'fullName dateOfBirth city profilePhotoUrl occupation');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user.shortlistedProfiles);
});

router.put('/shortlist/:profileId', auth, async (req: AuthRequest, res: express.Response) => {
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    const { profileId } = req.params;
    const index = (user.shortlistedProfiles as any[]).map(id => id.toString()).indexOf(profileId);
    if (index > -1) {
        (user.shortlistedProfiles as any[]).splice(index, 1);
    } else {
        (user.shortlistedProfiles as any[]).push(profileId);
    }
    
    await user.save();
    res.json(user.shortlistedProfiles);
});

router.get('/phonebook', auth, async (req: AuthRequest, res: express.Response) => {
    const userId = req.user?.id;
    const mutualInterests = await Interest.find({
        $or: [{ fromUser: userId }, { toUser: userId }],
        status: InterestStatus.ACCEPTED
    }).populate('fromUser toUser', 'fullName profilePhotoUrl city');
    
    const contacts: any[] = [];
    const contactIds = new Set();
    mutualInterests.forEach(interest => {
        const from = (interest.fromUser as any);
        const to = (interest.toUser as any);
        if (from._id.toString() !== userId && !contactIds.has(from._id.toString())) {
            contacts.push({ id: from._id, profileId: from._id, name: from.fullName, photoUrl: from.profilePhotoUrl, city: from.city, status: 'Mutual Interest' });
            contactIds.add(from._id.toString());
        }
        if (to._id.toString() !== userId && !contactIds.has(to._id.toString())) {
             contacts.push({ id: to._id, profileId: to._id, name: to.fullName, photoUrl: to.profilePhotoUrl, city: to.city, status: 'Mutual Interest' });
            contactIds.add(to._id.toString());
        }
    });
    res.json(contacts);
});

export default router;