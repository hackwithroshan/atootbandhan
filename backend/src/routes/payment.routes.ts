import { Router } from 'express';
import { check } from 'express-validator';
import { protect as auth } from '../middlewares/auth.middleware.js';
import { createOrder, verifyPayment } from '../controllers/payment.controller.js';

const router = Router();

// All routes in this file are protected by auth middleware
router.use(auth);

// @route   POST /api/payments/create-order
// @desc    Create a Razorpay order for a membership plan
router.post(
  '/create-order',
  [
    check('planId', 'Plan ID is required').not().isEmpty(),
    check('duration', 'Duration (monthly/yearly) is required').isIn(['monthly', 'yearly']),
  ],
  createOrder
);

// @route   POST /api/payments/verify-payment
// @desc    Verify Razorpay payment and upgrade user membership
router.post(
  '/verify-payment',
  [
    check('razorpay_order_id', 'Razorpay Order ID is required').not().isEmpty(),
    check('razorpay_payment_id', 'Razorpay Payment ID is required').not().isEmpty(),
    check('razorpay_signature', 'Razorpay Signature is required').not().isEmpty(),
    check('planId', 'Plan ID is required').not().isEmpty(),
  ],
  verifyPayment
);

export default router;