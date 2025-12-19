

import { FormStep, Gender, Religion, MaritalStatus, MotherTongue, EducationLevel, OccupationCategory, HeightUnit, SelectOption, ProfileCreatedBy, DietaryHabits, YesNoOccasionally, FamilyType, FamilyValues, ManglikStatus, WeightUnit, Offer, PhotoVisibility, DeleteAccountReason, NotificationPreferences, MembershipTier, PhonebookContact } from './types.js';

export const NEW_MALE_PROFILE_IMAGE_URL = 'https://telugubullet.com/wp-content/uploads/2023/09/v1-jpg.webp';
export const NEW_FEMALE_PROFILE_IMAGE_URL = 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export const SIGNUP_STEPS: FormStep[] = [
  {
    id: 1,
    name: 'Basic Info',
    title: 'Let\'s start with the basics',
    fields: ['fullName', 'gender', 'dateOfBirth', 'email', 'mobileNumber'],
  },
  {
    id: 2,
    name: 'Verify Email',
    title: 'Verify Your Email Address',
    fields: ['otpEmail'],
  },
  {
    id: 3,
    name: 'Account Setup',
    title: 'Secure your account',
    fields: ['password', 'confirmPassword', 'termsAccepted', 'marketingConsent'],
  },
  {
    id: 4,
    name: 'Profile Details',
    title: 'Tell us more about yourself',
    fields: ['maritalStatus', 'religion', 'caste', 'city', 'state', 'country', 'motherTongue', 'education', 'occupation', 'heightValue'],
  },
  {
    id: 5,
    name: 'Review',
    title: 'Review & Complete Your Profile',
    fields: [], 
  },
];

export const GENDER_OPTIONS: SelectOption<Gender>[] = [
  { value: Gender.MALE, label: 'Male' },
  { value: Gender.FEMALE, label: 'Female' },
  { value: Gender.OTHER, label: 'Other' },
];

export const RELIGION_OPTIONS: SelectOption<Religion>[] = [
  { value: Religion.HINDU, label: 'Hinduism' },
  { value: Religion.MUSLIM, label: 'Islam' },
  { value: Religion.CHRISTIAN, label: 'Christianity' },
  { value: Religion.SIKH, label: 'Sikhism' },
  { value: Religion.BUDDHIST, label: 'Buddhism' },
  { value: Religion.JAIN, label: 'Jainism' },
  { value: Religion.OTHER, label: 'Other' },
  { value: Religion.PREFER_NOT_TO_SAY, label: 'Prefer not to say'}
];

export const MARITAL_STATUS_OPTIONS: SelectOption<MaritalStatus>[] = [
  { value: MaritalStatus.NEVER_MARRIED, label: 'Never Married' },
  { value: MaritalStatus.DIVORCED, label: 'Divorced' },
  { value: MaritalStatus.WIDOWED, label: 'Widowed' },
  { value: MaritalStatus.AWAITING_DIVORCE, label: 'Awaiting Divorce' },
  { value: MaritalStatus.ANNULLED, label: 'Annulled' },
];

export const MOTHER_TONGUE_OPTIONS: SelectOption<MotherTongue>[] = Object.values(MotherTongue).map(val => ({ value: val, label: val }));

export const EDUCATION_OPTIONS: SelectOption<EducationLevel>[] = Object.values(EducationLevel).map(val => ({ value: val, label: val }));

export const OCCUPATION_OPTIONS: SelectOption<OccupationCategory>[] = Object.values(OccupationCategory).map(val => ({ value: val, label: val }));

export const HEIGHT_UNIT_OPTIONS: SelectOption<HeightUnit>[] = [
    { value: HeightUnit.FEET_INCHES, label: 'ft/in' },
    { value: HeightUnit.CENTIMETERS, label: 'cm' },
];

export const WEIGHT_UNIT_OPTIONS: SelectOption<WeightUnit>[] = [
  { value: WeightUnit.KG, label: 'kg' },
  { value: WeightUnit.LBS, label: 'lbs' },
];

export const MANGLIK_STATUS_OPTIONS: SelectOption<ManglikStatus>[] = Object.values(ManglikStatus).map(val => ({ value: val, label: val }));

export const PROFILE_CREATED_BY_OPTIONS: SelectOption<ProfileCreatedBy>[] = Object.values(ProfileCreatedBy).map(val => ({ value: val, label: val }));

export const FAMILY_TYPE_OPTIONS: SelectOption<FamilyType>[] = Object.values(FamilyType).map(val => ({ value: val, label: val }));

export const FAMILY_VALUES_OPTIONS: SelectOption<FamilyValues>[] = Object.values(FamilyValues).map(val => ({ value: val, label: val }));

export const DIETARY_HABITS_OPTIONS: SelectOption<DietaryHabits>[] = Object.values(DietaryHabits).map(val => ({ value: val, label: val }));

export const YES_NO_OCCASIONALLY_OPTIONS: SelectOption<YesNoOccasionally>[] = Object.values(YesNoOccasionally).map(val => ({ value: val, label: val }));


export const LANGUAGES_SPOKEN_OPTIONS: SelectOption<string>[] = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'marathi', label: 'Marathi' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'gujarati', label: 'Gujarati' },
  { value: 'urdu', label: 'Urdu' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'odia', label: 'Odia' },
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'other', label: 'Other (Specify)' },
]; 

export const PHOTO_VISIBILITY_OPTIONS: SelectOption<PhotoVisibility>[] = Object.values(PhotoVisibility).map(val => ({ value: val, label: val }));

export const DELETE_ACCOUNT_REASON_OPTIONS: SelectOption<DeleteAccountReason>[] = Object.values(DeleteAccountReason).map(val => ({ value: val, label: val }));

export const NOTIFICATION_TYPE_LABELS: { key: keyof NotificationPreferences, label: string }[] = [
    { key: 'newInterestEmail', label: 'New Interest (Email)'},
    { key: 'newInterestSms', label: 'New Interest (SMS)'}, 
    { key: 'newInterestPush', label: 'New Interest (Push)'},
    { key: 'newMatchEmail', label: 'New Match (Email)'},
    { key: 'newMatchSms', label: 'New Match (SMS)'}, 
    { key: 'newMatchPush', label: 'New Match (Push)'},
    { key: 'newMessageEmail', label: 'New Message (Email)'},
    { key: 'newMessageSms', label: 'New Message (SMS)'},
    { key: 'newMessagePush', label: 'New Message (Push)'},
    { key: 'profileViewEmail', label: 'Profile View (Email)'},
    { key: 'profileViewPush', label: 'Profile View (Push)'},
    { key: 'membershipExpiryEmail', label: 'Membership Reminders (Email)'},
    { key: 'membershipExpirySms', label: 'Membership Reminders (SMS)'},
    { key: 'membershipExpiryPush', label: 'Membership Reminders (Push)'},
    { key: 'promotionalOffersEmail', label: 'Promotional Offers (Email)'},
    { key: 'promotionalOffersSms', label: 'Promotional Offers (SMS)'},
    { key: 'promotionalOffersPush', label: 'Promotional Offers (Push)'},
    { key: 'adminAnnouncementsEmail', label: 'Platform Announcements (Email)'},
    { key: 'adminAnnouncementsPush', label: 'Platform Announcements (Push)'},
    { key: 'dailyHoroscopeEmail', label: 'Daily Horoscope (Email - Opt-in)' },
    { key: 'dailyHoroscopePush', label: 'Daily Horoscope (Push - Opt-in)' },
    { key: 'supportTicketEmail', label: 'Support Ticket Replies (Email)' },
    { key: 'supportTicketPush', label: 'Support Ticket Replies (Push)' },
    { key: 'monthlySummaryEmail', label: 'Monthly Activity Summary (Email)' },
    { key: 'dailyMatchDigestEmail', label: 'Daily Match Digest (Email)'},
    { key: 'dailyMatchDigestPush', label: 'Daily Match Digest (Push)'},
];

export const REPORT_REASON_OPTIONS: SelectOption<string>[] = [
  { value: 'fake_profile', label: 'Fake Profile' },
  { value: 'inappropriate_photos', label: 'Inappropriate Photos' },
  { value: 'abusive_language', label: 'Abusive Language / Harassment' },
  { value: 'spamming', label: 'Spamming or Solicitation' },
  { value: 'scam_attempt', label: 'Scam Attempt' },
  { value: 'other', label: 'Other (Please specify)' },
];