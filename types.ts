

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum Religion {
  HINDU = 'Hindu',
  MUSLIM = 'Muslim',
  CHRISTIAN = 'Christian',
  SIKH = 'Sikh',
  BUDDHIST = 'Buddhist',
  JAIN = 'Jain',
  OTHER = 'Other',
  PREFER_NOT_TO_SAY = 'Prefer not to say'
}

export enum MaritalStatus {
  NEVER_MARRIED = 'Never Married',
  DIVORCED = 'Divorced',
  WIDOWED = 'Widowed',
  AWAITING_DIVORCE = 'Awaiting Divorce',
  ANNULLED = 'Annulled'
}

export enum MotherTongue {
  HINDI = 'Hindi',
  ENGLISH = 'English',
  BENGALI = 'Bengali',
  MARATHI = 'Marathi',
  TELUGU = 'Telugu',
  TAMIL = 'Tamil',
  GUJARATI = 'Gujarati',
  URDU = 'Urdu',
  KANNADA = 'Kannada',
  ODIA = 'Odia',
  MALAYALAM = 'Malayalam',
  PUNJABI = 'Punjabi',
  OTHER = 'Other'
}

export enum EducationLevel {
  HIGH_SCHOOL = 'High School',
  DIPLOMA = 'Diploma',
  BACHELORS = 'Bachelor\'s Degree',
  MASTERS = 'Master\'s Degree',
  DOCTORATE = 'Doctorate/PhD',
  OTHER = 'Other'
}

export enum OccupationCategory {
  STUDENT = 'Student',
  GOVERNMENT_JOB = 'Government Job',
  PRIVATE_JOB = 'Private Job',
  BUSINESS_OWNER = 'Business Owner',
  SELF_EMPLOYED = 'Self-Employed',
  NOT_WORKING = 'Not Working',
  OTHER = 'Other'
}

export enum HeightUnit {
  FEET_INCHES = 'ft/in',
  CENTIMETERS = 'cm'
}

export enum WeightUnit {
  KG = 'kg',
  LBS = 'lbs'
}

export enum ManglikStatus {
  YES = 'Yes',
  NO = 'No',
  DONT_KNOW = "Don't Know",
  NOT_APPLICABLE = "Not Applicable"
}

export enum ProfileCreatedBy {
  SELF = 'Self',
  PARENT = 'Parent/Guardian',
  SIBLING = 'Sibling',
  FRIEND = 'Friend',
  OTHER = 'Other'
}

export enum FamilyType {
  JOINT = 'Joint Family',
  NUCLEAR = 'Nuclear Family',
  OTHER = 'Other'
}

export enum FamilyValues {
  TRADITIONAL = 'Traditional',
  MODERATE = 'Moderate',
  LIBERAL = 'Liberal',
  OTHER = 'Other'
}

export enum DietaryHabits {
  VEGETARIAN = 'Vegetarian',
  NON_VEGETARIAN = 'Non-Vegetarian',
  EGGETARIAN = 'Eggetarian',
  VEGAN = 'Vegan',
  JAIN_DIET = 'Jain Diet',
  OTHER = 'Other'
}

export enum YesNoOccasionally {
  YES = 'Yes',
  NO = 'No',
  OCCASIONALLY = 'Occasionally'
}

export enum MembershipTier {
  FREE = 'Free',
  SILVER = 'Silver',
  GOLD = 'Gold',
  DIAMOND = 'Diamond',
}

export interface UserPhoto {
  id: string;
  url: string;
  isPublic: boolean;
  isPrimary: boolean;
  file?: File | null; 
  requiresModeration?: boolean; // New for blurring photos
}

export interface SignupFormData {
  // Step 1: Basic Info
  fullName: string;
  gender: Gender | '';
  dateOfBirth: string; 
  email: string;
  mobileNumber?: string; // Added mobile number field

  // Step 2: Verification
  otpEmail?: string;

  // Step 3: Account Credentials
  password?: string;
  confirmPassword?: string;
  termsAccepted?: boolean;
  marketingConsent?: boolean; 

  // Step 4: Profile Setup Wizard
  maritalStatus: MaritalStatus | '';
  religion: Religion | '';
  caste: string; 
  subCaste?: string; 
  manglikStatus?: ManglikStatus | ''; 
  profileCreatedBy?: ProfileCreatedBy | ''; 
  city: string;
  state: string;
  country: string;
  motherTongue: MotherTongue | '';
  education: EducationLevel | '';
  occupation: OccupationCategory | '';
  heightValue?: string; 
  heightUnit?: HeightUnit | '';
  weightValue?: string; 
  weightUnit?: WeightUnit | ''; 
  photo?: File | null; 
  profilePhotoUrl?: string; 
  profileBio?: string; 
  membershipTier?: MembershipTier; 

  // Family Details (can be part of profile setup or separate)
  fatherOccupation?: string;
  motherOccupation?: string;
  brothers?: number | string; 
  marriedBrothers?: number | string;
  sisters?: number | string;
  marriedSisters?: number | string;
  familyType?: FamilyType | '';
  familyValues?: FamilyValues | '';
  familyIncome?: string; 

  // Lifestyle & Hobbies
  dietaryHabits?: DietaryHabits | '';
  smokingHabits?: YesNoOccasionally | '';
  drinkingHabits?: YesNoOccasionally | '';
  hobbies?: string; 
  generalHabits?: string; 

  // Education & Career (more details)
  jobTitle?: string;
  companyName?: string;
  companyLocation?: string;
  annualIncome?: string;
  isAnnualIncomeVisible?: boolean;

  // Partner Preferences
  partnerAgeMin?: number | string;
  partnerAgeMax?: number | string;
  partnerHeightMin?: string;
  partnerHeightMax?: string;
  partnerReligion?: string; 
  partnerCaste?: string; 
  partnerEducation?: string;
  partnerOccupation?: string;
  partnerIncomeRange?: string;
  partnerLocations?: string; 
  
  // Shared
}

export interface FormStep {
  id: number;
  name: string;
  fields?: (keyof SignupFormData)[]; 
  title: string; 
}

export interface SelectOption<T = string | number | ManglikStatus | ProfileCreatedBy | FamilyType | FamilyValues | DietaryHabits | YesNoOccasionally | WeightUnit> {
  value: T;
  label:string;
}

export interface LoggedInUserSessionData {
  id: string;
  email: string;
  gender: Gender;
  name: string;
  photoUrl: string;
  membershipTier: MembershipTier; 
}


// Admin Dashboard Types
export enum AdminRole {
  SUPER_ADMIN = 'Super Admin',
  PROFILE_MODERATOR = 'Profile Moderator',
  FINANCE_ADMIN = 'Finance Admin',
  MATCHMAKER = 'Matchmaker',
  CONTENT_MANAGER = 'Content Manager',
  SUPPORT_LEAD = 'Support Lead', 
  TECHNICAL_ADMIN = 'Technical Admin' 
}

export type AdminViewKey =
  | 'AdminDashboardHome'
  | 'UserManagement'
  | 'ProfileModeration'
  | 'InterestMatchManagement'
  | 'MembershipPayments'
  | 'MessagingComplaints'
  | 'NotificationTool'
  | 'ContentManagement'
  | 'AnalyticsDashboard'
  | 'SiteSettings'
  | 'RoleAccessManagement'
  | 'SearchLogAnalyzer'      
  | 'ABTestingPanel'         
  | 'ReferralAffiliatePanel' 
  | 'ProfileRecycleBin'
  | 'OffersPopups';

// Expressed Interests Types
export enum InterestStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  DECLINED = 'Declined',
  WITHDRAWN = 'Withdrawn',
  MUTUAL = 'Mutual', 
}

export interface InterestUser {
  id: string; 
  name: string;
  age: number;
  photoUrl: string | null;
  location: string;
  caste?: string;
  religion?: Religion;
  education?: EducationLevel;
  profession?: OccupationCategory;
  gender?: Gender;
  bio?: string;
  galleryImages?: string[];
  familyDetails?: object; 
  horoscopeDetails?: {
    rashi?: string;
    nakshatra?: string;
    manglik?: ManglikStatus | ''; // Updated for filter
  };
  preferencesBio?: string;
  isContactVisible?: boolean; 
  contactInfo?: { email?: string; phone?: string }; 
  aiPlaceholderType?: 'male' | 'female'; 
  membershipTier?: MembershipTier; 
  profileVideoUrl?: string;
  profileVideoRequiresModeration?: boolean;
  behavioralTrustScore?: number;
  isVoiceVerified?: boolean;
  isVideoVerified?: boolean;
  isAiTrusted?: boolean;
  lastActivity?: string;
  dietaryHabits?: DietaryHabits;
  smokingHabits?: YesNoOccasionally;
  drinkingHabits?: YesNoOccasionally;
}

export interface Interest {
  id: number; 
  user: InterestUser; 
  date: string; 
  status: InterestStatus;
  matchPercentage?: number; 
}

// Support Ticket System Types
export enum SupportTicketCategory {
  LOGIN_ISSUE = 'Login Issue',
  PAYMENT_QUERY = 'Payment Query',
  PROFILE_UPDATE = 'Profile Update Request',
  TECHNICAL_GLITCH = 'Technical Glitch',
  FEEDBACK_SUGGESTION = 'Feedback & Suggestion',
  REPORT_ABUSE_SPAM = 'Report Abuse/Spam',
  OTHER = 'Other',
}

export enum SupportTicketStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  AWAITING_USER_REPLY = 'Awaiting User Reply',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
}

export interface SupportTicketMessage {
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: SupportTicketCategory;
  description: string; 
  attachmentName?: string; 
  status: SupportTicketStatus;
  createdDate: string;
  lastUpdatedDate: string;
  messages: SupportTicketMessage[];
}

// Chat System Types for MessagesView
export type ChatMessageStatus = 'sent' | 'delivered' | 'seen';

export interface ChatMessage {
  id: number | string; 
  sender: 'user' | 'other' | 'agent' | 'ai' | 'system'; 
  text: string;
  timestamp: string;
  status?: ChatMessageStatus;
  reactions?: { [emoji: string]: { count: number; users: string[] } }; 
  replyTo?: string; 
  originalMessageSnippet?: string; 
  isVoiceMessage?: boolean; 
  voiceMessageDuration?: string; 
  file?: { 
    name: string;
    url?: string; 
    type: 'image' | 'pdf' | 'audio' | 'video' | 'other'; 
    size?: string; 
  };
}
export interface ChatContact {
  id: number;
  name: string;
  photoUrl: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean; 
  isMutualMatch?: boolean; 
  membershipTier?: MembershipTier; 
  behavioralTrustScore?: number; // New
  lastActivity?: string; // New
}


// User Management Specific Types (Admin View)
export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive', 
  PENDING_APPROVAL = 'Pending Approval', 
  SUSPENDED = 'Suspended', 
  BANNED = 'Banned', 
}

export interface LoginAttempt {
  id: string;
  timestamp: string;
  ipAddress: string;
  deviceInfo: string; 
  location: string; 
  status: 'Success' | 'Failed';
}

// Profile Moderation Specific Types
export enum ModerationItemType {
  PHOTO = 'Photo',
  PROFILE_CONTENT = 'Profile Content',
  HOROSCOPE_DETAILS = 'Horoscope Details',
  REPORTED_PROFILE = 'Reported Profile',
  VIDEO = 'Video', // New for video moderation
}

export enum ModerationStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  ACTION_TAKEN = 'Action Taken', 
}

export enum ReportCategory {
  SPAM = 'Spam',
  FAKE_PROFILE = 'Fake Profile',
  INAPPROPRIATE_CONTENT = 'Inappropriate Content',
  MISBEHAVIOR = 'Misbehavior',
  PAYMENT_ISSUE = 'Payment Issue',
  OTHER = 'Other',
}

export enum VerificationType {
  ID_VERIFIED = 'ID Verified',
  PHONE_VERIFIED = 'Phone Verified',
  HOROSCOPE_VERIFIED = 'Horoscope Verified',
  VOICE_VERIFIED = 'Voice Verified', // New
  VIDEO_VERIFIED = 'Video Verified', // New
}

export interface UserVerificationStatus {
  [VerificationType.ID_VERIFIED]?: { isVerified: boolean; notes?: string; verifiedBy?: string; dateVerified?: string };
  [VerificationType.PHONE_VERIFIED]?: { isVerified: boolean; notes?: string; verifiedBy?: string; dateVerified?: string };
  [VerificationType.HOROSCOPE_VERIFIED]?: { isVerified: boolean; notes?: string; verifiedBy?: string; dateVerified?: string };
  [VerificationType.VOICE_VERIFIED]?: { isVerified: boolean; notes?: string; verifiedBy?: string; dateVerified?: string };
  [VerificationType.VIDEO_VERIFIED]?: { isVerified: boolean; notes?: string; verifiedBy?: string; dateVerified?: string };
}

export interface ModerationQueueItemBase {
  id: string; 
  userId: string;
  userName: string; 
  userPhotoUrl?: string; 
  itemType: ModerationItemType;
  dateSubmitted: string; 
  status: ModerationStatus;
  adminNotes?: string; 
  isAutoFlagged?: boolean;
}

export interface ModerationPhotoItem extends ModerationQueueItemBase {
  itemType: ModerationItemType.PHOTO;
  photoUrl: string; 
  reasonForFlag?: string; 
}

export interface ModerationVideoItem extends ModerationQueueItemBase { // New
  itemType: ModerationItemType.VIDEO;
  videoUrl: string; // or reference to video
  reasonForFlag?: string;
}

export interface ModerationContentItem extends ModerationQueueItemBase {
  itemType: ModerationItemType.PROFILE_CONTENT;
  profileSection: keyof SignupFormData | 'Profile Bio' | 'Hobbies' | string; 
  contentSnippet: string; 
  reasonForFlag?: string;
}

export interface ModerationHoroscopeItem extends ModerationQueueItemBase {
  itemType: ModerationItemType.HOROSCOPE_DETAILS;
  submittedData: { 
    dateOfBirth?: string;
    timeOfBirth?: string;
    placeOfBirth?: string;
    manglikStatus?: ManglikStatus | '';
  };
  reasonForFlag?: string;
}

export interface ProfileReportItem extends ModerationQueueItemBase {
  itemType: ModerationItemType.REPORTED_PROFILE;
  reporterUserId: string;
  reporterName: string;
  reportCategory: ReportCategory;
  reportReason: string; 
  reportedContentLink?: string; 
  resolutionDetails?: string; 
}

export type AnyModerationItem = ModerationPhotoItem | ModerationContentItem | ModerationHoroscopeItem | ProfileReportItem | ModerationVideoItem;


export interface ProfileEditLogEntry {
  logId: string;
  userId: string;
  userName: string;
  fieldName: string; 
  oldValue: string | null;
  newValue: string | null;
  changedBy: 'user' | string; 
  timestamp: string;
  adminNotes?: string; 
}


export interface AdminManagedUser extends SignupFormData {
  id: string; 
  status: UserStatus;
  profileCompletion: number; 
  aiTrustScore?: number; 
  lastLoginDate?: string;
  lastLoginIP?: string;
  internalNotes?: string;
  adminTags?: string[];
  isVerified?: boolean; 
  suspensionReason?: string;
  suspensionEndDate?: string; 
  banReason?: string;
  loginActivity?: LoginAttempt[]; 
  membershipPlan?: string; 
  verificationStatus?: UserVerificationStatus; 
  profileEditLogs?: ProfileEditLogEntry[]; 
  membershipTier: MembershipTier; 
  behavioralTrustScore?: number; // New
  isVoiceVerified?: boolean; // New
  isVideoVerified?: boolean; // New
  isAiTrusted?: boolean; // New
  lastActivity?: string; // New
}

// Notification System Types
export enum NotificationType {
  NEW_MATCH = 'New Match',
  INTEREST_RECEIVED = 'Interest Received',
  MESSAGE_RECEIVED = 'Message Received',
  MEMBERSHIP_EXPIRY = 'Membership Expiry Reminder',
  ADMIN_ANNOUNCEMENT = 'Admin Announcement',
  PROFILE_VIEW = 'Profile View',
  INTEREST_ACCEPTED = 'Interest Accepted',
  DAILY_MATCH_DIGEST = 'Daily Match Digest', // New
}

export interface Notification {
  id: string;
  userId: string; 
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date; 
  redirectTo?: string; 
  senderProfile?: { 
    id: string;
    name: string;
    photoUrl?: string;
  };
}

// Offer Popup Types
export interface Offer {
  id: string;
  title: string;
  image: string; 
  description: string;
  buttonText: string;
  link: string; 
  startDate: string; 
  endDate: string;   
  status: 'Draft' | 'Published';
}

// User Dashboard Drawer Navigation Types
export type DashboardDrawerItemKey =
  | 'EditProfile'
  | 'PartnerPreferences'
  | 'AstrologyServices'
  | 'Phonebook'
  | 'AccountSettings'
  | 'SafetyCentre'
  | 'HelpSupport';

// User Dashboard View Keys - For new sections
export type DashboardViewKey = 
  | 'DashboardHome' 
  | 'MyProfile' 
  | 'MyMatches' 
  | 'SearchMatches' 
  | 'ExpressedInterests' 
  | 'ShortlistedProfiles' 
  | 'Messages' 
  | 'Membership' 
  | 'ActivityLog' 
  | 'SupportHelp'
  | 'PartnerPreferences'    
  | 'AstrologyServices'     
  | 'Phonebook'             
  | 'AccountSettings'       
  | 'SafetyCentre';         


// Partner Preferences Data Structure (can be part of User's main data or separate)
export interface PartnerPreferencesData {
  ageMin?: number | string;
  ageMax?: number | string;
  heightMin?: string; 
  heightMax?: string; 
  maritalStatus?: MaritalStatus[];
  religion?: Religion[];
  caste?: string; 
  education?: EducationLevel[];
  occupation?: OccupationCategory[];
  incomeRange?: string; 
  locations?: string; 
  smokingHabits?: YesNoOccasionally;
  drinkingHabits?: YesNoOccasionally;
  languagesSpoken?: string; 
  manglikStatus?: ManglikStatus | ''; // New for search filter
  dietaryHabits?: DietaryHabits | ''; // New for search filter
}

// Astrology Details Data Structure
export interface AstrologyDetails {
  name?: string; 
  gender?: Gender | ''; 
  dateOfBirth?: string; 
  timeOfBirth?: string; 
  placeOfBirth?: string;
}

// Phonebook Contact Data Structure
export interface PhonebookContact {
  id: string; 
  profileId: string; 
  name: string;
  photoUrl?: string | null;
  city?: string;
  status?: 'Mutual Interest' | 'Connected' | 'Interest Sent' | 'Interest Received'; 
  notes?: string;
}

// Account Settings Structures
export enum PhotoVisibility {
  ALL = 'All Members',
  MATCHES_ONLY = 'Only My Matches',
  VERIFIED_ONLY = 'Only Verified Members',
  HIDDEN = 'Hidden (Private)',
}

export interface PrivacySettings {
  photoVisibility?: PhotoVisibility;
  blockedUserIds?: string[]; 
  showOnlineStatus?: boolean; // New
  showLastSeen?: boolean; // New
}

export interface NotificationPreferences {
  newInterestEmail?: boolean;
  newInterestSms?: boolean;
  newInterestPush?: boolean;
  newMatchEmail?: boolean;
  newMatchSms?: boolean; 
  newMatchPush?: boolean;
  newMessageEmail?: boolean;
  newMessageSms?: boolean; // Added
  newMessagePush?: boolean;
  profileViewEmail?: boolean;
  profileViewPush?: boolean; // Added
  membershipExpiryEmail?: boolean;
  membershipExpirySms?: boolean; // Added
  membershipExpiryPush?: boolean; // Added
  promotionalOffersEmail?: boolean;
  promotionalOffersSms?: boolean; // Added
  promotionalOffersPush?: boolean; // Added
  adminAnnouncementsEmail?: boolean; // Added
  adminAnnouncementsPush?: boolean;
  dailyHoroscopeEmail?: boolean; 
  dailyHoroscopePush?: boolean; 
  supportTicketEmail?: boolean;
  supportTicketPush?: boolean;
  monthlySummaryEmail?: boolean; 
  dailyMatchDigestPush?: boolean; // New
  dailyMatchDigestEmail?: boolean; // New
}

export enum DeleteAccountReason {
  FOUND_MATCH_HERE = 'Found my match on Atut Bandhan',
  FOUND_MATCH_ELSEWHERE = 'Found my match elsewhere',
  NOT_SATISFIED = 'Not satisfied with the platform',
  TAKING_BREAK = 'Taking a break from search',
  PRIVACY_CONCERNS = 'Privacy concerns',
  OTHER = 'Other',
}

// Astrology Service Specific Types
export interface AstrologyKundaliData {
  lagnaChart?: string; 
  moonChart?: string;
  navamsaChart?: string;
  planetaryPositions?: { planet: string; position: string }[];
  interpretation?: {
    personality?: string;
    career?: string;
    marriage?: string;
    health?: string;
  };
}

export interface AstrologyMatchMakingData {
  compatibilityScore?: number; 
  gunMilan?: { aspect: string; points: string }[]; 
  doshas?: { name: string; present: boolean; remarks?: string }[]; 
  summary?: string;
}

export interface AstrologyHoroscopeData {
  moonSign?: string;
  daily?: {
    love?: string;
    health?: string;
    career?: string;
    finance?: string;
  };
}

export interface AstrologyPredictionData {
  monthly?: {
    marriage?: string;
    finance?: string;
    health?: string;
    family?: string;
  };
  yearly?: {
    marriage?: string;
    finance?: string;
    health?: string;
    family?: string;
  };
}

export interface AstrologyChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

// User Profile Data structure used by MyProfileView
export interface UserProfileData {
  fullName: string;
  age: number;
  location: string;
  profilePhotoUrl: string;
  photos: UserPhoto[];
  membershipTier: MembershipTier; 
  basicInfo: {
    gender: Gender;
    dateOfBirth: string;
    heightValue: string;
    heightUnit: HeightUnit;
    weightValue: string;
    weightUnit: WeightUnit;
    religion: Religion;
    caste: string;
    subCaste?: string;
    motherTongue: MotherTongue;
    maritalStatus: MaritalStatus;
    manglikStatus: ManglikStatus;
    profileCreatedBy: ProfileCreatedBy;
  };
  familyDetails: {
    fatherOccupation: string;
    motherOccupation: string;
    brothers: number;
    marriedBrothers: number;
    sisters: number;
    marriedSisters: number;
    familyType: FamilyType;
    familyValues: FamilyValues;
    familyIncome?: string;
  };
  lifestyle: {
    dietaryHabits: DietaryHabits;
    smokingHabits: YesNoOccasionally;
    drinkingHabits: YesNoOccasionally;
    hobbies: string;
    generalHabits?: string;
  };
  educationAndCareer: {
    highestEducation: EducationLevel;
    college?: string;
    occupation: OccupationCategory;
    jobTitle?: string;
    companyName?: string;
    companyLocation?: string;
    annualIncome?: string;
    isAnnualIncomeVisible: boolean;
  };
  partnerPreferences: PartnerPreferencesData; // Using the defined interface
  profileBio: string;
  isProfileLocked?: boolean; 
  mockStats?: { 
    matchPercentage: number;
    profileViews: number;
    trustScore: number; // Will be replaced by behavioralTrustScore
    badges: string[];
  };
  profileVideoUrl?: string; // New
  profileVideoRequiresModeration?: boolean; // New
  behavioralTrustScore?: number; // New: 0-100
  isVoiceVerified?: boolean; // New
  isVideoVerified?: boolean; // New
  isAiTrusted?: boolean; // New
  lastActivity?: string; // New: e.g., "Active 2h ago"
}

// Feature Access Control
export interface UserFeatures {
  // Matches & Interests
  matchesPerDay: number | 'unlimited';
  expressInterestPerDay: number | 'unlimited';
  canViewFullProfiles: boolean; 

  // Communication
  canChat: boolean;
  chatLimit?: number; 
  canViewPhone: boolean;
  phoneViewLimitPerDay?: number | 'unlimited';
  canVoiceCall: boolean;
  voiceCallDailyMinutesLimit?: number | 'unlimited';
  voiceCallSessionMinutesLimit?: number | 'unlimited';
  canVideoCall: boolean;
  videoCallsPerDayLimit?: number | 'unlimited';
  videoCallSessionMinutesLimit?: number | 'unlimited';
  canShareMedia: boolean; 
  canShareVideo: boolean; 
  canUploadProfileVideo: boolean; // New

  // Astrology
  astrologyAccess: 'none' | 'basic' | 'advanced' | 'premium';
  
  // Profile Enhancements
  canSeeWhoViewedMe: boolean; 
  profileBoostPerMonth: number; 
  hasProfilePriorityInSearch: boolean; 

  // Support
  supportType: 'ticket' | 'priority_ticket' | 'livechat';

  // Search
  hasAdvancedSearchFilters: boolean; 

  // General (Example, can be expanded)
  canHidePhoneEmail?: boolean; 
}
// Simplified Match Profile for card displays and modal
export interface MatchProfile extends InterestUser {
  matchPercentage: number;
  // Other fields like familyDetails, horoscopeDetails are inherited from InterestUser
}