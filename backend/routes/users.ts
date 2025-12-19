import express from 'express';
// FIX: Corrected import path for auth middleware and AuthRequest type.
import { protect as auth, AuthRequest } from '../src/middlewares/auth.middleware.js';
// FIX: Corrected import path for User model.
import User from '../src/models/User.js';
// FIX: Corrected import path for Interest model.
import Interest from '../src/models/Interest.js';
import { Gender, UserStatus, InterestStatus } from '../../types.js';

const router = express.Router();

// FIX: Use express.Request and express.Response
router.get('/featured', async (req: express.Request, res: express.Response) => {
    const users = await User.find({ status: UserStatus.ACTIVE }).sort({ createdAt: -1 }).limit(4).select('-password');
    // FIX: Property 'json' does not exist.
    res.json(users);
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.get('/profile', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    const user = await User.findById(authReq.user?.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    // FIX: Property 'json' does not exist.
    res.json(user);
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.put('/profile', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    let user = await User.findById(authReq.user?.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const allowedUpdates = [
        'fullName', 'dateOfBirth', 'gender', 'heightValue', 'heightUnit', 'weightValue', 'weightUnit', 'religion', 'caste', 'subCaste', 'motherTongue', 'maritalStatus', 'manglikStatus', 'profileCreatedBy', 'fatherOccupation', 'motherOccupation', 'brothers', 'marriedBrothers', 'sisters', 'marriedSisters', 'familyType', 'familyValues', 'familyIncome', 'dietaryHabits', 'smokingHabits', 'drinkingHabits', 'hobbies', 'generalHabits', 'education', 'college', 'occupation', 'jobTitle', 'companyName', 'companyLocation', 'annualIncome', 'isAnnualIncomeVisible', 'partnerPreferences', 'profileBio', 'photos', 'profilePhotoUrl', 'city', 'state', 'country'
    ];
    // FIX: Property 'body' does not exist.
    allowedUpdates.forEach(key => { if (req.body[key] !== undefined) (user as any)[key] = req.body[key]; });
    
    await user.save();
    // FIX: Property 'json' does not exist.
    res.json(user);
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.post('/search', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    const currentUser = await User.findById(authReq.user?.id);
    if (!currentUser) return res.status(404).json({ msg: 'User not found' });
    
    // FIX: Property 'body' does not exist.
    const query: any = { _id: { $ne: authReq.user!.id }, gender: currentUser.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE };
    const { keyword, religion, city, caste } = req.body;
    if (keyword) query.$or = [{ fullName: { $regex: keyword, $options: 'i' } }];
    if (religion) query.religion = religion;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (caste) query.caste = { $regex: caste, $options: 'i' };

    const users = await User.find(query).limit(50).select('-password');
    // FIX: Property 'json' does not exist.
    res.json(users);
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.get('/shortlisted', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    const user = await User.findById(authReq.user?.id).populate('shortlistedProfiles', 'fullName dateOfBirth city profilePhotoUrl occupation');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    // FIX: Property 'json' does not exist.
    res.json(user.shortlistedProfiles);
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.put('/shortlist/:profileId', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    const user = await User.findById(authReq.user?.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    // FIX: Property 'params' does not exist.
    const { profileId } = req.params;
    const index = (user.shortlistedProfiles as any[]).indexOf(profileId);
    if (index > -1) (user.shortlistedProfiles as any[]).splice(index, 1);
    else (user.shortlistedProfiles as any[]).push(profileId);
    
    await user.save();
    // FIX: Property 'json' does not exist.
    res.json(user.shortlistedProfiles);
});

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.get('/phonebook', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
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
    // FIX: Property 'json' does not exist.
    res.json(contacts);
});

export default router;