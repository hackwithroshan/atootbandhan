import express from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
// FIX: Corrected import path for User model
import User from '../src/models/User.js';
// FIX: Corrected import path for auth middleware and AuthRequest type.
import { protect as auth, AuthRequest } from '../src/middlewares/auth.middleware.js';
import { UserStatus } from '../../types.js';

const router = express.Router();

// Helper to check if email config is present
const isEmailConfigured = () => process.env.EMAIL_USER && process.env.EMAIL_PASS;

const createTransporter = () => {
    if (!isEmailConfigured()) return null;
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '465'),
        secure: (process.env.EMAIL_PORT === '465'),
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
};

// FIX: Use express.Request and express.Response
router.post('/send-otp', [check('email').isEmail()], async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // FIX: Property 'status' does not exist.
        return res.status(400).json({ msg: 'Invalid email address.' });
    }

    try {
        // FIX: Property 'body' does not exist.
        const { email } = req.body;
        let user = await User.findOne({ email });

        if (user && (user as any).isEmailVerified) {
            // FIX: Property 'status' does not exist.
            return res.status(400).json({ msg: 'This email is already registered and verified.' });
        }
        
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        if (user) {
            (user as any).emailOtp = otp;
            (user as any).emailOtpExpires = otpExpires;
            await user.save();
        } else {
            user = new User({ email, emailOtp: otp, emailOtpExpires: otpExpires });
            await user.save();
        }

        if (isEmailConfigured()) {
            await createTransporter()!.sendMail({
                to: email,
                subject: 'Your Verification Code for Atut Bandhan',
                html: `<p>Your One-Time Password (OTP) for registration is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
            });
            // FIX: Property 'status' does not exist.
            return res.status(200).json({ msg: 'OTP has been sent to your email.' });
        } else {
            // For local development without email configured
            // FIX: Property 'status' does not exist.
            return res.status(200).json({ msg: 'OTP sent (Mock Mode).', debug_otp: otp });
        }
    } catch (err: any) {
        console.error("Send OTP Error:", err.message);
        // FIX: Property 'status' does not exist.
        res.status(500).json({ msg: 'Server Error' });
    }
});


// FIX: Use express.Request and express.Response
router.post('/verify-otp', [check('email').isEmail(), check('otp').isLength({ min: 6, max: 6 })], async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // FIX: Property 'status' does not exist.
        return res.status(400).json({ msg: 'Invalid email or OTP format.' });
    }
    try {
        // FIX: Property 'body' does not exist.
        const { email, otp } = req.body;
        const user = await User.findOne({ email, otp: otp, otpExpiry: { $gt: Date.now() } });
        
        if (!user) {
            // FIX: Property 'status' does not exist.
            return res.status(400).json({ msg: 'Invalid or expired OTP. Please try again.' });
        }
        
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        
        // FIX: Property 'status' does not exist.
        res.status(200).json({ msg: 'Email verified successfully.' });
    } catch (err: any) {
        console.error("Verify OTP Error:", err.message);
        // FIX: Property 'status' does not exist.
        res.status(500).json({ msg: 'Server Error' });
    }
});


// FIX: Use express.Request and express.Response
router.post('/register', [], async (req: express.Request, res: express.Response) => {
    try {
        // FIX: Property 'body' does not exist.
        const { email, mobileNumber, password } = req.body;
      
        let user = await User.findOne({ email });

        if (!user || !user.isVerified) {
            // FIX: Property 'status' does not exist.
            return res.status(400).json({ msg: 'Email not verified. Please complete OTP verification first.' });
        }

        if (user.password) { // If password is set, account is fully registered
            // FIX: Property 'status' does not exist.
            return res.status(400).json({ msg: 'A user with this email has already completed registration.' });
        }
        
        if (mobileNumber) {
            const existingMobile = await User.findOne({ mobileNumber, _id: { $ne: user._id } });
            if (existingMobile) {
                // FIX: Property 'status' does not exist.
                return res.status(400).json({ msg: 'A user with this mobile number already exists.' });
            }
        }
        
        // Update the existing user document with full registration details
        // FIX: Property 'body' does not exist.
        Object.assign(user, req.body);
        user.password = password; // Ensure password gets hashed
        user.status = UserStatus.ACTIVE; // Set status to active
        
        await user.save();
      
        const payload = { user: { id: (user as any)._id } };
        // FIX: Property 'json' does not exist on type 'Response'.
        jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '5d' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err: any) {
        console.error("Registration Error:", err);
        if (err.code === 11000) {
            // FIX: Property 'status' does not exist.
            return res.status(400).json({ msg: 'A user with this email or mobile number already exists.' });
        }
        // FIX: Property 'status' does not exist.
        res.status(500).json({ msg: 'Server Error during registration.' });
    }
});

// FIX: Use express.Request and express.Response
router.post('/login', [check('email').isEmail(), check('password').exists()], async (req: express.Request, res: express.Response) => {
    try {
        // FIX: Property 'body' does not exist.
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !user.password) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await (user as any).comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
        
        const payload = { user: { id: (user as any)._id } };
        jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '5d' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err: any) {
        console.error("Login Error:", err.message);
        // FIX: Property 'status' does not exist.
        res.status(500).json({ msg: 'Server Error' });
    }
});

// FIX: Use express.Response
// FIX: No overload matches this call. Cast req to AuthRequest inside.
router.get('/me', auth, async (req: express.Request, res: express.Response) => {
    try {
        const authReq = req as AuthRequest;
        const user = await User.findById(authReq.user?.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        // FIX: Property 'json' does not exist on type 'Response'.
        res.json(user);
    } catch (err: any) {
        console.error("Me Route Error:", err.message);
        // FIX: Property 'status' does not exist.
        res.status(500).json({ msg: 'Server Error' });
    }
});

// FIX: Use express.Request and express.Response
router.post('/forgot-password', [check('email').isEmail()], async (req: express.Request, res: express.Response) => {
    try {
        // FIX: Property 'body' does not exist.
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found.' });

        const otp = crypto.randomInt(100000, 999999).toString();
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        if (isEmailConfigured()) {
            await createTransporter()!.sendMail({ to: email, subject: 'Password Reset OTP', html: `<p>Your reset OTP is <strong>${otp}</strong></p>` });
            // FIX: Property 'status' does not exist.
            return res.status(200).json({ msg: 'Password reset OTP sent.' });
        }
        // FIX: Property 'status' does not exist.
        return res.status(200).json({ msg: 'OTP Sent (Mock Mode)', debug_otp: otp });
    } catch (err: any) {
        console.error("Forgot Password Error:", err.message);
        // FIX: Property 'status' does not exist.
        res.status(500).json({ msg: 'Server Error' });
    }
});

// FIX: Use express.Request and express.Response
router.post('/reset-password', [check('email').isEmail(), check('otp').not().isEmpty(), check('newPassword').isLength({ min: 6 })], async (req: express.Request, res: express.Response) => {
    try {
        // FIX: Property 'body' does not exist.
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email, resetPasswordOtp: otp, resetPasswordOtpExpires: { $gt: Date.now() } });

        if (!user) return res.status(400).json({ msg: 'Invalid or expired OTP.' });

        user.password = newPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;
        await user.save();
        
        // FIX: Property 'status' does not exist.
        res.status(200).json({ msg: 'Password has been reset successfully.' });
    } catch (err: any) {
        console.error("Reset Password Error:", err.message);
        // FIX: Property 'status' does not exist.
        res.status(500).json({ msg: 'Server Error' });
    }
});

export default router;