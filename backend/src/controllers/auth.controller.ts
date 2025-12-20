import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import sendEmail from '../config/mail.js';
import { generateOTP } from '../utils/otp.js';

// @desc    Register a new user and send OTP
// @route   POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ msg: 'User with this email already exists and is verified.' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user) {
      // User exists but is not verified, update their details and OTP
      user.fullName = fullName;
      user.password = password;
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      // Create a new user
      user = new User({ fullName, email, password, otp, otpExpiry });
      await user.save();
    }

    // Send OTP email
    await sendEmail({
      to: email,
      subject: 'Verify Your Atut Bandhan Account',
      html: `<h3>Your One-Time Password (OTP) is:</h3><h1>${otp}</h1><p>It is valid for 10 minutes.</p>`,
    });

    res.status(201).json({ msg: 'Registration successful. Please check your email for an OTP to verify your account.' });

  } catch (err) {
    next(err);
  }
};

// @desc    Verify OTP and log user in
// @route   POST /api/auth/verify-otp
export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpiry');

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials or user not found.' });
    }
    if (user.isVerified) {
      return res.status(400).json({ msg: 'Account is already verified. Please log in.' });
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ msg: 'No pending OTP found. Please register or resend OTP.' });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ msg: 'OTP has expired. Please request a new one.' });
    }
    
    if (user.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.lastLoginDate = new Date();
    user.lastLoginIP = req.ip;
    await user.save();

    // Sign JWT
    const payload = { user: { id: user.id } };
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    const token = jwt.sign(payload, jwtSecret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.status(200).json({ token });

  } catch (err) {
    next(err);
  }
};

// @desc    Log in an existing user
// @route   POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Account not verified. Please verify your OTP first or resend it.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    // Update last login details
    user.lastLoginDate = new Date();
    user.lastLoginIP = req.ip; // Or req.headers['x-forwarded-for'] if behind a proxy
    await user.save();
    
    const payload = { user: { id: user.id } };
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    const token = jwt.sign(payload, jwtSecret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.status(200).json({ token });

  } catch (err) {
    next(err);
  }
};


// @desc    Resend OTP for an unverified user
// @route   POST /api/auth/resend-otp
export const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User with this email not found. Please register first." });
    }
    if (user.isVerified) {
      return res.status(400).json({ msg: "This account is already verified. You can log in." });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save();
    
    // Send new OTP email
    await sendEmail({
      to: email,
      subject: 'Your New Atut Bandhan OTP',
      html: `<h3>Your new One-Time Password (OTP) is:</h3><h1>${otp}</h1><p>It is valid for 10 minutes.</p>`,
    });

    res.status(200).json({ msg: "A new OTP has been sent to your email address." });

  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password - send reset OTP
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User with that email does not exist.' });
        }

        const otp = generateOTP();
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        await sendEmail({
            to: email,
            subject: 'Your Password Reset OTP',
            html: `<h3>Your password reset OTP is:</h3><h1>${otp}</h1><p>It is valid for 10 minutes.</p>`,
        });

        res.status(200).json({ msg: 'Password reset OTP has been sent to your email.' });
    } catch (err) {
        next(err);
    }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordOtpExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired OTP.' });
        }

        user.password = newPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;
        await user.save();
        
        res.status(200).json({ msg: 'Password has been reset successfully.' });
    } catch (err) {
        next(err);
    }
};
