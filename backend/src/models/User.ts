import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { AdminRole, Gender, MaritalStatus, Religion, MotherTongue, EducationLevel, OccupationCategory, HeightUnit, WeightUnit, ManglikStatus, ProfileCreatedBy, FamilyType, FamilyValues, DietaryHabits, YesNoOccasionally, MembershipTier, UserStatus } from '../../types.js';

// Define the interface for the User document
export interface IUser extends Document {
  // --- Core Fields ---
  fullName: string;
  email: string;
  password?: string;
  isVerified: boolean; // Renamed from isEmailVerified for clarity
  otp?: string;
  otpExpiry?: Date;
  
  // --- From Signup Form ---
  gender: Gender;
  dateOfBirth: Date;
  mobileNumber?: string;
  maritalStatus: MaritalStatus;
  religion: Religion;
  caste: string;
  subCaste?: string;
  manglikStatus?: ManglikStatus;
  profileCreatedBy?: ProfileCreatedBy;
  city: string;
  state: string;
  country: string;
  motherTongue: MotherTongue;
  education: EducationLevel;
  occupation: OccupationCategory;
  heightValue?: number;
  heightUnit?: HeightUnit;
  weightValue?: number;
  weightUnit?: WeightUnit;
  profilePhotoUrl?: string;
  photos?: { url: string; isPublic: boolean }[];
  profileBio?: string;

  // --- Family Details ---
  fatherOccupation?: string;
  motherOccupation?: string;
  brothers?: number;
  marriedBrothers?: number;
  sisters?: number;
  marriedSisters?: number;
  familyType?: FamilyType;
  familyValues?: FamilyValues;
  familyIncome?: string;

  // --- Lifestyle & Hobbies ---
  dietaryHabits?: DietaryHabits;
  smokingHabits?: YesNoOccasionally;
  drinkingHabits?: YesNoOccasionally;
  hobbies?: string;
  generalHabits?: string;

  // --- Education & Career (more details) ---
  college?: string;
  jobTitle?: string;
  companyName?: string;
  companyLocation?: string;
  annualIncome?: string;
  isAnnualIncomeVisible?: boolean;

  // --- Partner Preferences ---
  partnerPreferences?: object;

  // --- Admin & Platform Fields ---
  role: string; // 'user' or AdminRole
  status: UserStatus;
  membershipTier: MembershipTier;
  profileCompletion: number;
  shortlistedProfiles: mongoose.Types.ObjectId[];
  lastLoginDate?: Date;
  lastLoginIP?: string;
  internalNotes?: string;
  adminTags?: string[];
  isVerifiedByAdmin: boolean; // Replaces isVerified
  suspensionReason?: string;
  suspensionEndDate?: Date;
  banReason?: string;
  loginActivity?: object[];
  resetPasswordOtp?: string;
  resetPasswordOtpExpires?: Date;
  
  // --- Methods ---
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    // --- Core Fields ---
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false, select: false }, // Not required initially, but set on full registration
    isVerified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },

    // --- Profile Details ---
    gender: { type: String, enum: Object.values(Gender) },
    dateOfBirth: { type: Date },
    mobileNumber: { type: String, sparse: true },
    maritalStatus: { type: String, enum: Object.values(MaritalStatus) },
    religion: { type: String, enum: Object.values(Religion) },
    caste: { type: String },
    subCaste: { type: String },
    manglikStatus: { type: String, enum: Object.values(ManglikStatus) },
    profileCreatedBy: { type: String, enum: Object.values(ProfileCreatedBy) },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    motherTongue: { type: String, enum: Object.values(MotherTongue) },
    education: { type: String, enum: Object.values(EducationLevel) },
    occupation: { type: String, enum: Object.values(OccupationCategory) },
    heightValue: { type: Number },
    heightUnit: { type: String, enum: Object.values(HeightUnit) },
    weightValue: { type: Number },
    weightUnit: { type: String, enum: Object.values(WeightUnit) },
    profilePhotoUrl: { type: String },
    photos: [{ url: String, isPublic: Boolean }],
    profileBio: { type: String },

    // --- Family, Lifestyle, Career ---
    fatherOccupation: { type: String },
    motherOccupation: { type: String },
    brothers: { type: Number, default: 0 },
    marriedBrothers: { type: Number, default: 0 },
    sisters: { type: Number, default: 0 },
    marriedSisters: { type: Number, default: 0 },
    familyType: { type: String, enum: Object.values(FamilyType) },
    familyValues: { type: String, enum: Object.values(FamilyValues) },
    familyIncome: { type: String },
    dietaryHabits: { type: String, enum: Object.values(DietaryHabits) },
    smokingHabits: { type: String, enum: Object.values(YesNoOccasionally) },
    drinkingHabits: { type: String, enum: Object.values(YesNoOccasionally) },
    hobbies: { type: String },
    generalHabits: { type: String },
    college: { type: String },
    jobTitle: { type: String },
    companyName: { type: String },
    companyLocation: { type: String },
    annualIncome: { type: String },
    isAnnualIncomeVisible: { type: Boolean, default: false },

    partnerPreferences: { type: Schema.Types.Mixed, default: {} },
    
    // --- Platform & Admin fields ---
    role: { type: String, default: 'user' },
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.PENDING_APPROVAL },
    membershipTier: { type: String, enum: Object.values(MembershipTier), default: MembershipTier.FREE },
    profileCompletion: { type: Number, default: 0 },
    shortlistedProfiles: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastLoginDate: { type: Date },
    lastLoginIP: { type: String },
    internalNotes: { type: String },
    adminTags: [String],
    isVerifiedByAdmin: { type: Boolean, default: false },
    suspensionReason: { type: String },
    suspensionEndDate: { type: Date },
    banReason: { type: String },
    loginActivity: [Object],
    resetPasswordOtp: { type: String, select: false },
    resetPasswordOtpExpires: { type: Date, select: false },
}, { timestamps: true });

// FIX: This expression is not callable. The type of `next` was being incorrectly inferred.
// Explicitly typing `this` and `next` resolves the issue, and brings isModified into scope.
UserSchema.pre<IUser>('save', async function (this: IUser & Document, next: (err?: Error) => void) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (this: IUser, candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;