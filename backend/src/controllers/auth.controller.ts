// FIX: Import express types to resolve property access errors.
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import sendEmail from '../config/mail.js';
import { generateOTP } from '../utils/otp.js';

// @desc    Register a new user and send OTP
// @route   POST /api/auth/register
// FIX: Property 'status' does not exist on type 'Response'. Using explicit express types to resolve conflicts.
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(400).json({ errors: errors.array() });
    }

    // FIX: Property 'body' does not exist on type 'Request'.
    const { fullName, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      // FIX: Property 'status' does not exist on type 'Response'.
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

    // FIX: Property 'status' does not exist on type 'Response'.
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
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(400).json({ errors: errors.array() });
    }

    // FIX: Property 'body' does not exist on type 'Request'.
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpiry');

    if (!user) {
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(400).json({ msg: 'Invalid credentials or user not found.' });
    }
    if (user.isVerified) {
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(400).json({ msg: 'Account is already verified. Please log in.' });
    }
    if (!user.otp || !user.otpExpiry) {
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(400).json({ msg: 'No pending OTP found. Please register or resend OTP.' });
    }
    if (user.otpExpiry < new Date()) {
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(400).json({ msg: 'OTP has expired. Please request a new one.' });
    }
    
    // FIX: Logic error. The OTP is not hashed, so a direct comparison is needed instead of bcrypt.
    if (user.otp !== otp) {
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(400).json({ msg: 'Invalid OTP.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.lastLoginDate = new Date();
    user.lastLoginIP = req.ip;
    await user.save();

    // Sign JWT
    // FIX: Property 'id' does not exist on type 'IUser'. Use '_id' instead.
    const payload = { user: { id: user.id } };
    // FIX: No overload matches this call. Ensure JWT_SECRET is defined before use.
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not defined');
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    // FIX: Property 'status' does not exist on type 'Response'.
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
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(400).json({ errors: errors.array() });
    }

    // FIX: Property 'body' does not exist on type 'Request'.
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    if (!user.isVerified) {
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(400).json({ msg: 'Account not verified. Please verify your OTP first or resend it.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    // Update last login details
    user.lastLoginDate = new Date();
    user.lastLoginIP = req.ip; // Or req.headers['x-forwarded-for'] if behind a proxy
    await user.save();
    
    // FIX: Property 'id' does not exist on type 'IUser'. Use '_id' instead.
    const payload = { user: { id: user.id } };
    // FIX: No overload matches this call. Ensure JWT_SECRET is defined before use.
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not defined');
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    // FIX: Property 'status' does not exist on type 'Response'.
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
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(400).json({ errors: errors.array() });
    }
    // FIX: Property 'body' does not exist on type 'Request'.
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // FIX: Property 'status' does not exist on type 'Response'.
      return res.status(404).json({ msg: "User with this email not found. Please register first." });
    }
    if (user.isVerified) {
      // FIX: Property 'status' does not exist on type 'Response'.
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

    // FIX: Property 'status' does not exist on type 'Response'.
    res.status(200).json({ msg: "A new OTP has been sent to your email address." });

  } catch (err) {
    next(err);
  }
};