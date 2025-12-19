import { MembershipTier, UserFeatures } from '../types';

export function getUserFeatures(membershipTier?: MembershipTier): UserFeatures {
  switch (membershipTier) {
    case MembershipTier.FREE:
      return {
        matchesPerDay: 5,
        expressInterestPerDay: 3,
        canViewFullProfiles: false, 
        canChat: false,
        canViewPhone: false,
        canVoiceCall: false,
        canVideoCall: false,
        canShareMedia: false,
        canShareVideo: false, 
        canUploadProfileVideo: false, // New
        astrologyAccess: 'none',
        canSeeWhoViewedMe: false,
        profileBoostPerMonth: 0,
        hasProfilePriorityInSearch: false,
        supportType: 'ticket',
        hasAdvancedSearchFilters: false,
        canHidePhoneEmail: false,
      };
    case MembershipTier.SILVER:
      return {
        matchesPerDay: 'unlimited',
        expressInterestPerDay: 20,
        canViewFullProfiles: true, 
        canChat: true,
        chatLimit: 5, 
        canViewPhone: false, 
        canVoiceCall: false,
        canVideoCall: false,
        canShareMedia: true, 
        canShareVideo: false, 
        canUploadProfileVideo: false, // New
        astrologyAccess: 'basic', 
        canSeeWhoViewedMe: false,
        profileBoostPerMonth: 0,
        hasProfilePriorityInSearch: false,
        supportType: 'ticket', 
        hasAdvancedSearchFilters: false, 
        canHidePhoneEmail: true, 
      };
    case MembershipTier.GOLD:
      return {
        matchesPerDay: 'unlimited',
        expressInterestPerDay: 'unlimited',
        canViewFullProfiles: true,
        canChat: true, 
        canViewPhone: true,
        phoneViewLimitPerDay: 10,
        canVoiceCall: true,
        voiceCallDailyMinutesLimit: 5,
        voiceCallSessionMinutesLimit: 5,
        canVideoCall: true,
        videoCallsPerDayLimit: 1,
        videoCallSessionMinutesLimit: 5,
        canShareMedia: true,
        canShareVideo: true, 
        canUploadProfileVideo: true, // New
        astrologyAccess: 'advanced', 
        canSeeWhoViewedMe: true,
        profileBoostPerMonth: 1,
        hasProfilePriorityInSearch: false, 
        supportType: 'priority_ticket', 
        hasAdvancedSearchFilters: true,
        canHidePhoneEmail: true,
      };
    case MembershipTier.DIAMOND:
      return {
        matchesPerDay: 'unlimited',
        expressInterestPerDay: 'unlimited',
        canViewFullProfiles: true,
        canChat: true, 
        canViewPhone: true,
        phoneViewLimitPerDay: 'unlimited',
        canVoiceCall: true,
        voiceCallDailyMinutesLimit: 'unlimited',
        voiceCallSessionMinutesLimit: 30, 
        canVideoCall: true,
        videoCallsPerDayLimit: 'unlimited',
        videoCallSessionMinutesLimit: 30, 
        canShareMedia: true,
        canShareVideo: true, 
        canUploadProfileVideo: true, // New
        astrologyAccess: 'premium', 
        canSeeWhoViewedMe: true, 
        profileBoostPerMonth: 1, 
        hasProfilePriorityInSearch: true,
        supportType: 'livechat',
        hasAdvancedSearchFilters: true, 
        canHidePhoneEmail: true,
      };
    default: 
      return getUserFeatures(MembershipTier.FREE);
  }
}