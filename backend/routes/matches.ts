import express from 'express';
// FIX: Corrected import path for auth middleware and AuthRequest type.
import { protect as auth, AuthRequest } from '../src/middlewares/auth.middleware.js';
// FIX: Corrected import path for User model.
import User from '../src/models/User.js';
import { Gender } from '../../types.js';

const router = express.Router();

// FIX: Use express.Response
// FIX: Handler type mismatch. Cast req to AuthRequest inside.
router.get('/', auth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthRequest;
    try {
        const currentUser = await User.findById(authReq.user?.id);
        if (!currentUser) return res.status(404).json({ msg: 'User not found' });

        const oppositeGender = currentUser.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
        const matches = await User.find({ gender: oppositeGender, _id: { $ne: authReq.user!.id } }).select('-password').limit(20);

        const matchesWithPercentage = matches.map(match => {
            const user = match.toObject() as any;
            let score = 50 + Math.floor(Math.random() * 11) - 5;
            if (user.religion === currentUser.religion) score += 20;
            if (user.motherTongue === currentUser.motherTongue) score += 15;
            if (user.city === currentUser.city) score += 10;
            score = Math.min(98, Math.max(50, score));
            return { ...user, matchPercentage: score };
        }).sort((a, b) => b.matchPercentage - a.matchPercentage);
        
        // FIX: Property 'json' does not exist.
        res.json(matchesWithPercentage);
    } catch (err: any) {
        console.error("Match fetching error:", err);
        // FIX: Property 'status' does not exist on type 'Response'.
        res.status(500).json({ msg: 'Server error while fetching matches' });
    }
});

export default router;