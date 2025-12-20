import { Router, Request, Response } from 'express';
import { AuthRequest, protect as auth } from '../middlewares/auth.middleware.js';
import User from '../models/User.js';
import Interest from '../models/Interest.js';
import SearchLog from '../models/SearchLog.js';
import { Gender, UserStatus, InterestStatus } from '../../../types.js';

const router = Router();

router.get('/featured', async (req: Request, res: Response) => {
    const users = await User.find({ status: UserStatus.ACTIVE, profilePhotoUrl: { $ne: null } }).sort({ createdAt: -1 }).limit(4).select('-password');
    res.json(users);
});

router.get('/profile', auth, async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
});

router.put('/profile', auth, async (req: AuthRequest, res: Response) => {
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

router.post('/search', auth, async (req: AuthRequest, res: Response) => {
    const currentUser = await User.findById(req.user?.id);
    if (!currentUser) return res.status(404).json({ msg: 'User not found' });
    
    const query: any = { _id: { $ne: req.user!.id }, gender: currentUser.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE };
    const { keyword, religion, city, caste } = req.body;
    if (keyword) query.$or = [{ fullName: { $regex: keyword, $options: 'i' } }, { occupation: { $regex: keyword, $options: 'i' } }];
    if (religion) query.religion = religion;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (caste) query.caste = { $regex: caste, $options: 'i' };

    const users = await User.find(query).limit(50).select('-password');

    // --- Add search logging here ---
    try {
        const log = new SearchLog({
            userId: req.user!.id,
            params: { keyword, religion, city, caste },
            resultCount: users.length,
        });
        await log.save(); // Fire and forget, don't let it block the response
    } catch (logError) {
        console.error("Failed to save search log:", logError); // Log error but don't fail the request
    }
    // --- End of search logging ---
    
    res.json(users);
});

router.get('/shortlisted', auth, async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?.id).populate('shortlistedProfiles', 'fullName dateOfBirth city profilePhotoUrl occupation');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user.shortlistedProfiles);
});

router.put('/shortlist/:profileId', auth, async (req: AuthRequest, res: Response) => {
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

router.get('/phonebook', auth, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const userWithNotes = await User.findById(userId).select('contactNotes');
    const notesMap = userWithNotes?.contactNotes || new Map();

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
            contacts.push({ id: from._id, profileId: from._id, name: from.fullName, photoUrl: from.profilePhotoUrl, city: from.city, status: 'Mutual Interest', notes: notesMap.get(from._id.toString()) || '' });
            contactIds.add(from._id.toString());
        }
        if (to._id.toString() !== userId && !contactIds.has(to._id.toString())) {
             contacts.push({ id: to._id, profileId: to._id, name: to.fullName, photoUrl: to.profilePhotoUrl, city: to.city, status: 'Mutual Interest', notes: notesMap.get(to._id.toString()) || '' });
            contactIds.add(to._id.toString());
        }
    });
    res.json(contacts);
});

router.put('/phonebook/notes', auth, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const { contactId, notes } = req.body;
        if (!contactId) return res.status(400).json({ msg: 'Contact ID is required' });

        user.contactNotes.set(contactId, notes);
        await user.save();

        res.json({ msg: 'Notes saved successfully.' });
    } catch (err: any) {
        console.error("Save Phonebook Notes Error:", err);
        res.status(500).json({ msg: 'Server error while saving notes' });
    }
});

export default router;