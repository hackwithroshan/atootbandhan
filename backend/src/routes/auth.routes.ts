import { Router } from 'express';
import { check } from 'express-validator';
import { register, verifyOtp, login, resendOtp } from '../controllers/auth.controller.js';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post(
  '/register',
  [
    check('fullName', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  register
);

// @route   POST /api/auth/verify-otp
// @desc    Verify user's OTP
router.post(
  '/verify-otp',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('otp', 'OTP must be a 6-digit number').isLength({ min: 6, max: 6 }).isNumeric(),
  ],
  verifyOtp
);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP to an unverified email
router.post(
    '/resend-otp',
    [
        check('email', 'Please include a valid email').isEmail(),
    ],
    resendOtp
);

export default router;
