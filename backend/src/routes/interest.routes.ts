import { Router } from 'express';
import { AuthRequest, protect as auth } from '../middlewares/auth.middleware.js';
import { getSentInterests, getReceivedInterests, sendInterest, updateInterestStatus } from '../controllers/interest.controller.js';

const router = Router();

router.use(auth);

router.get('/sent', getSentInterests);
router.get('/received', getReceivedInterests);
router.post('/:toUserId', sendInterest);
router.put('/:id', updateInterestStatus);

export default router;