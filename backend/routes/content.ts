import express from 'express';
// FIX: Corrected import path for Faq model.
import Faq from '../src/models/Faq.js';
// FIX: Corrected import path for SuccessStory model.
import SuccessStory from '../src/models/SuccessStory.js';
// FIX: Corrected import path for BlogPost model.
import BlogPost from '../src/models/BlogPost.js';
// FIX: Corrected import path for Offer model.
import Offer from '../src/models/Offer.js';
// FIX: Corrected import path for Plan model.
import Plan from '../src/models/Plan.js';
// FIX: Corrected import path for auth middleware.
import { protect as auth, AuthRequest } from '../src/middlewares/auth.middleware.js';
// FIX: Corrected import path for adminAuth middleware.
import adminAuth from '../src/middlewares/adminAuth.middleware.js';

const router = express.Router();

// Public routes
// FIX: Use express.Request and express.Response
router.get('/faqs', async (req: express.Request, res: express.Response) => res.json(await Faq.find()));
// FIX: Use express.Request and express.Response
router.get('/success-stories', async (req: express.Request, res: express.Response) => res.json(await SuccessStory.find({ status: 'Approved' }).limit(3)));
// FIX: Use express.Request and express.Response
router.get('/blog-posts/preview', async (req: express.Request, res: express.Response) => res.json(await BlogPost.find().sort({ createdAt: -1 }).limit(3)));
// FIX: Use express.Request and express.Response
router.get('/plans', async (req: express.Request, res: express.Response) => res.json(await Plan.find().sort({ priceMonthly: 1 })));
// FIX: Use express.Request and express.Response
router.get('/offers/active', async (req: express.Request, res: express.Response) => {
    const today = new Date();
    res.json(await Offer.find({ status: 'Published', startDate: { $lte: today }, endDate: { $gte: today } }).sort({ createdAt: -1 }));
});

// Admin routes for content management
// FIX: Use express.Request and express.Response
// FIX: Handler type mismatch.
router.get('/offers/all', auth, adminAuth, async (req: express.Request, res: express.Response) => res.json(await Offer.find().sort({ createdAt: -1 })));

// FIX: Use express.Request and express.Response
// FIX: Handler type mismatch.
router.post('/offers', auth, adminAuth, async (req: express.Request, res: express.Response) => {
    try {
        // FIX: Property 'body' does not exist.
        const newOffer = new Offer(req.body);
        await newOffer.save();
        // FIX: Property 'status' does not exist.
        res.status(201).json(newOffer);
    } catch (err: any) {
        // FIX: Property 'status' does not exist.
        res.status(500).json({ msg: 'Server error creating offer.', error: err.message });
    }
});

// FIX: Use express.Request and express.Response
// FIX: Handler type mismatch.
router.put('/offers/:id', auth, adminAuth, async (req: express.Request, res: express.Response) => {
    try {
        // FIX: Property 'params' and 'body' do not exist.
        const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOffer) return res.status(404).json({ msg: 'Offer not found.' });
        // FIX: Property 'json' does not exist.
        res.json(updatedOffer);
    } catch (err: any) {
        // FIX: Property 'status' does not exist.
        res.status(500).json({ msg: 'Server error updating offer.', error: err.message });
    }
});

// FIX: Use express.Request and express.Response
// FIX: Handler type mismatch.
router.delete('/offers/:id', auth, adminAuth, async (req: express.Request, res: express.Response) => {
    try {
        // FIX: Property 'params' does not exist.
        const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
        if (!deletedOffer) return res.status(404).json({ msg: 'Offer not found.' });
        // FIX: Property 'json' does not exist.
        res.json({ msg: 'Offer deleted successfully.' });
    } catch (err: any) {
        // FIX: Property 'status' does not exist.
        res.status(500).json({ msg: 'Server error deleting offer.', error: err.message });
    }
});


export default router;