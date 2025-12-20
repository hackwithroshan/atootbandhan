import { Response } from 'express';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import Plan from '../models/Plan.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { TransactionStatus } from '../models/Transaction.js';
import { MembershipTier } from '../../../types.js';

// Helper for Razorpay API calls without the SDK
const callRazorpayApi = async (path: string, options: RequestInit = {}) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keyId || !keySecret) {
        throw new Error('Razorpay credentials are not configured.');
    }

    // FIX: Suppress TypeScript error for 'Buffer'. 'Buffer' is a valid Node.js global, but type definitions seem to be missing in this project environment.
    // @ts-ignore
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    const response = await fetch(`https://api.razorpay.com/v1${path}`, {
        ...options,
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Razorpay API Error: ${errorData.error?.description || response.statusText}`);
    }

    return response.json();
};

export const createOrder = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { planId, duration } = req.body;
        const plan = await Plan.findById(planId);
        
        if (!plan) {
            return res.status(404).json({ msg: 'Plan not found.' });
        }

        const amount = duration === 'yearly' ? plan.priceYearly : plan.priceMonthly;
        if (amount === undefined || amount <= 0) {
            return res.status(400).json({ msg: 'Invalid plan amount for the selected duration.' });
        }
        
        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_order_${new Date().getTime()}`,
        };

        const order = await callRazorpayApi('/orders', {
            method: 'POST',
            body: JSON.stringify(options),
        });

        res.json({
            keyId: process.env.RAZORPAY_KEY_ID,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        const plan = await Plan.findById(planId);
        const user = await User.findById(req.user!.id);

        if (!plan || !user) {
            return res.status(404).json({ msg: 'Plan or User not found.' });
        }
        
        const orderDetails = await callRazorpayApi(`/orders/${razorpay_order_id}`);
        
        // Create a transaction record
        await Transaction.create({
            user: user.id,
            plan: plan.name as MembershipTier,
            amount: orderDetails.amount / 100,
            currency: orderDetails.currency,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            status: TransactionStatus.SUCCESS,
        });
        
        // Upgrade user's membership tier
        user.membershipTier = plan.name as MembershipTier;
        await user.save();

        res.json({ success: true, msg: 'Payment successful and membership upgraded.' });
    } else {
         // Optionally, create a failed transaction record
        const orderDetails = await callRazorpayApi(`/orders/${razorpay_order_id}`);
        await Transaction.create({
            user: req.user!.id,
            plan: (await Plan.findById(planId))?.name as MembershipTier,
            amount: orderDetails.amount / 100,
            currency: orderDetails.currency,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            status: TransactionStatus.FAILED,
        });
        res.status(400).json({ success: false, msg: 'Payment verification failed.' });
    }
};
