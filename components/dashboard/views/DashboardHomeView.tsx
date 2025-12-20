import React, { useState, useEffect } from 'react';
import ProfileCompletionWidget from '../main/ProfileCompletionWidget';
import QuickStats from '../main/QuickStats';
import SuggestedMatches from '../main/SuggestedMatches';
import RecentActivity from '../main/RecentActivity';
import UpgradeTeaserDashboard from '../main/UpgradeTeaserDashboard';
import TrustScoreWidget from '../main/TrustScoreWidget';
import ReferralProgramWidget from '../main/ReferralProgramWidget';
import ProfileActionsWidget from '../main/ProfileActionsWidget';
import BadgesWidget from '../main/BadgesWidget';
import IcebreakerWidget from '../main/IcebreakerWidget';
import QuickActionsWidget from '../main/QuickActionsWidget';
import { UserFeatures, MatchProfile, UserProfileData, DashboardViewKey, LoggedInUserSessionData } from '../../../types'; 
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';

interface DashboardHomeViewProps {
  loggedInUser: LoggedInUserSessionData;
  userFeatures: UserFeatures;
  onUpgradeClick: () => void;
  setActiveView: (viewKey: DashboardViewKey) => void;
  onViewProfile: (profile: MatchProfile) => void;
  onSendInterest: (profileId: string) => void;
  onShortlist: (profileId: string) => void;
}

interface DashboardStats {
  interestsReceived: number;
  profileViews: number;
  newMessages: number;
  shortlistedBy: number;
}

const DashboardHomeView: React.FC<DashboardHomeViewProps> = ({ loggedInUser, userFeatures, onUpgradeClick, setActiveView, onViewProfile, onSendInterest, onShortlist }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [suggestedMatches, setSuggestedMatches] = useState<MatchProfile[]>([]);
  const [userProfile, setUserProfile] = useState<Partial<UserProfileData & { isVerified: boolean, profilePhotoUrl: string, photos: any[] }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsData, completionData, activityData, matchesData, profileData] = await Promise.all([
          apiClient('/api/dashboard/stats'),
          apiClient('/api/dashboard/profile-completion'),
          apiClient('/api/dashboard/activity'),
          apiClient('/api/matches'),
          apiClient('/api/users/profile'),
        ]);

        setStats(statsData);
        setProfileCompletion(completionData.percentage);
        setRecentActivity(activityData);
        const formattedMatches = matchesData.map((user: any): MatchProfile => ({
            id: user.id, name: user.fullName, age: user.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : 0, location: user.city || 'N/A',
            profession: user.occupation || 'N/A', photoUrl: user.profilePhotoUrl, matchPercentage: user.matchPercentage || 0, religion: user.religion || 'N/A', caste: user.caste || 'N/A', education: user.education || 'N/A', gender: user.gender,
            membershipTier: user.membershipTier, bio: user.profileBio || 'No bio provided.', galleryImages: user.photos?.map((p: any) => p.url) || [], familyDetails: {}, preferencesBio: 'Not specified.', isContactVisible: false,
        }));
        setSuggestedMatches(formattedMatches);
        setUserProfile(profileData);

      } catch (error: any) {
        showToast(error.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [showToast]);


  const showUpgradeTeaser = !userFeatures.hasProfilePriorityInSearch; 

  if (isLoading) {
      return <div className="text-center p-8">Loading your dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <ProfileCompletionWidget percentage={profileCompletion} onCompleteNowClick={() => setActiveView('MyProfile')} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuickStats stats={stats} />
          <TrustScoreWidget profileCompletion={profileCompletion} userProfile={userProfile} setActiveView={setActiveView} /> 
          <IcebreakerWidget />
        </div>
        <div className="space-y-6">
          <ReferralProgramWidget userId={loggedInUser.id} />
          <ProfileActionsWidget setActiveView={setActiveView} />
          <BadgesWidget userProfile={userProfile} profileCompletion={profileCompletion} />
          <QuickActionsWidget setActiveView={setActiveView} />
        </div>
      </div>
      <SuggestedMatches matches={suggestedMatches.slice(0, 6)} onViewProfile={onViewProfile} onSendInterest={onSendInterest} />
      <RecentActivity activities={recentActivity} />
      {showUpgradeTeaser && <UpgradeTeaserDashboard onUpgradeClick={onUpgradeClick} />}
    </div>
  );
};

export default DashboardHomeView;