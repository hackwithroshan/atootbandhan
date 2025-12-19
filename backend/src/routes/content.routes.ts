import express from 'express';
import Faq from '../models/Faq.js';
import SuccessStory from '../models/SuccessStory.js';
import BlogPost from '../models/BlogPost.js';
import Offer from '../models/Offer.js';
import Plan from '../models/Plan.js';
import { protect as auth, AuthRequest } from '../middlewares/auth.middleware.js';
import adminAuth from '../middlewares/adminAuth.middleware.js';

const router = express.Router();

// --- Public Routes ---
router.get('/faqs', async (req: express.Request, res: express.Response) => res.json(await Faq.find()));
router.get('/success-stories', async (req: express.Request, res: express.Response) => res.json(await SuccessStory.find({ status: 'Approved' }).limit(3)));
router.get('/blog-posts/preview', async (req: express.Request, res: express.Response) => res.json(await BlogPost.find().sort({ createdAt: -1 }).limit(3)));
router.get('/plans', async (req: express.Request, res: express.Response) => res.json(await Plan.find().sort({ 'priceMonthly': 1 })));
router.get('/offers/active', async (req: express.Request, res: express.Response) => {
    const today = new Date();
    res.json(await Offer.find({ status: 'Published', startDate: { $lte: today }, endDate: { $gte: today } }).sort({ createdAt: -1 }));
});

// --- Admin-only Routes for Content Management ---
router.get('/offers/all', auth, adminAuth, async (req: express.Request, res: express.Response) => res.json(await Offer.find().sort({ createdAt: -1 })));

router.post('/offers', auth, adminAuth, async (req: express.Request, res: express.Response) => {
    try {
        const newOffer = new Offer(req.body);
        await newOffer.save();
        res.status(201).json(newOffer);
    } catch (err: any) {
        res.status(400).json({ msg: 'Server error creating offer.', error: err.message });
    }
});

router.put('/offers/:id', auth, adminAuth, async (req: express.Request, res: express.Response) => {
    try {
        const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOffer) return res.status(404).json({ msg: 'Offer not found.' });
        res.json(updatedOffer);
    } catch (err: any) {
        res.status(400).json({ msg: 'Server error updating offer.', error: err.message });
    }
});

router.delete('/offers/:id', auth, adminAuth, async (req: express.Request, res: express.Response) => {
    try {
        const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
        if (!deletedOffer) return res.status(404).json({ msg: 'Offer not found.' });
        res.json({ msg: 'Offer deleted successfully.' });
    } catch (err: any) {
        res.status(500).json({ msg: 'Server error deleting offer.', error: err.message });
    }
});

export default router;