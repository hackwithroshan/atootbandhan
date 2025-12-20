import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DashboardHeader from '../components/dashboard/layout/DashboardHeader';
import DashboardSidebar from '../components/dashboard/layout/DashboardSidebar';
import OfferPopupModal from '../components/dashboard/common/OfferPopupModal'; 
import ProfileDrawer, { ProfileDrawerProps } from '../components/dashboard/layout/ProfileDrawer'; 
import { Offer, DashboardViewKey as AppDashboardViewKey, LoggedInUserSessionData, Gender, UserFeatures, MembershipTier, MatchProfile } from '../types'; 
import { getUserFeatures } from '../utils/featureAccess';
import apiClient from '../utils/apiClient';
import { useToast } from '../hooks/useToast';

// Import all view components
import DashboardHomeView from '../components/dashboard/views/DashboardHomeView';
import { MyProfileView } from '../components/dashboard/views/MyProfileView';
import MyMatchesView from '../components/dashboard/views/MyMatchesView';
import SearchMatchesView from '../components/dashboard/views/SearchMatchesView';
import ExpressedInterestsView from '../components/dashboard/views/ExpressedInterestsView';
import ShortlistedProfilesView from '../components/dashboard/views/ShortlistedProfilesView';
import { MessagesView } from '../components/dashboard/views/MessagesView';
import MembershipView from '../components/dashboard/views/MembershipView';
import ActivityLogView from '../components/dashboard/views/ActivityLogView';
import SupportHelpView from '../components/dashboard/views/SupportHelpView';
// New View Imports
import PartnerPreferencesView from '../components/dashboard/views/PartnerPreferencesView';
import AstrologyServicesView from '../components/dashboard/views/AstrologyServicesView';
import PhonebookView from '../components/dashboard/views/PhonebookView';
import AccountSettingsView from '../components/dashboard/views/AccountSettingsView';
import SafetyCentreView from '../components/dashboard/views/SafetyCentreView';
import ProfileViewModal from '../components/dashboard/matches/ProfileViewModal';

export type DashboardViewKey = AppDashboardViewKey; // Use the imported type

interface DashboardPageProps {
  onLogout: () => void;
  loggedInUser: LoggedInUserSessionData;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout, loggedInUser }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<DashboardViewKey>('DashboardHome');

  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [showOfferPopup, setShowOfferPopup] = useState(false);

  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const { showToast } = useToast();

  const [selectedProfile, setSelectedProfile] = useState<MatchProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const userFeatures = useMemo(() => getUserFeatures(loggedInUser.membershipTier), [loggedInUser.membershipTier]);

  const mockUserForDrawer = {
    name: loggedInUser.name,
    id: loggedInUser.id,
    photoUrl: loggedInUser.photoUrl,
    membershipTier: loggedInUser.membershipTier,
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);
  
  const toggleProfileDrawer = useCallback(() => {
    setIsProfileDrawerOpen(prev => !prev);
  }, []);

  const navigateToMembership = useCallback(() => {
    setActiveView('Membership');
    if (isProfileDrawerOpen) toggleProfileDrawer();
    if (isSidebarOpen && window.innerWidth < 768) toggleSidebar();
  }, [isProfileDrawerOpen, toggleProfileDrawer, isSidebarOpen, toggleSidebar]);

  useEffect(() => {
    const fetchAndShowOffer = async () => {
      try {
        const offers: Offer[] = await apiClient('/api/content/offers/active');
        
        if (offers.length > 0) {
          const latestOffer = offers[0];
          const offerShownKey = `offerShown_${latestOffer.id}`;
          if (sessionStorage.getItem(offerShownKey) !== 'true') {
            setActiveOffer(latestOffer);
            setShowOfferPopup(true);
          } else {
            setActiveOffer(latestOffer);
            setShowOfferPopup(false);
          }
        } else {
          setActiveOffer(null); 
          setShowOfferPopup(false);
        }
      } catch (error: any) {
        // Silently fail, no need to show a toast for a non-critical feature like offers.
        console.error("Error fetching offers:", error.message);
        setActiveOffer(null);
        setShowOfferPopup(false);
      }
    };

    const timer = setTimeout(fetchAndShowOffer, 2000);
    return () => clearTimeout(timer);
  }, []); 

  const handleCloseOfferPopup = () => {
    if (activeOffer) {
      sessionStorage.setItem(`offerShown_${activeOffer.id}`, 'true');
    }
    setShowOfferPopup(false);
  };

  const handleViewProfile = (profile: MatchProfile) => {
    if (!userFeatures.canViewFullProfiles) { navigateToMembership(); return; }
    setSelectedProfile(profile);
    setIsProfileModalOpen(true);
  };
  
  const handleSendInterest = async (profileId: string) => {
    try {
      await apiClient(`/api/interests/${profileId}`, { method: 'POST' });
      showToast('Interest sent successfully!', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleShortlist = async (profileId: string) => {
    try {
      await apiClient(`/api/users/shortlist/${profileId}`, { method: 'PUT' });
      showToast('Profile added/removed from shortlist.', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'DashboardHome': return <DashboardHomeView loggedInUser={loggedInUser} userFeatures={userFeatures} onUpgradeClick={navigateToMembership} setActiveView={setActiveView} onViewProfile={handleViewProfile} onSendInterest={handleSendInterest} onShortlist={handleShortlist} />;
      case 'MyProfile': return <MyProfileView loggedInUser={loggedInUser} userFeatures={userFeatures} onUpgradeClick={navigateToMembership} />;
      case 'MyMatches': return <MyMatchesView loggedInUserGender={loggedInUser.gender} userFeatures={userFeatures} onUpgradeClick={navigateToMembership} />;
      case 'SearchMatches': return <SearchMatchesView userFeatures={userFeatures} onUpgradeClick={navigateToMembership} />;
      case 'ExpressedInterests': return <ExpressedInterestsView userFeatures={userFeatures} onUpgradeClick={navigateToMembership} currentUserId={loggedInUser.id}/>;
      case 'ShortlistedProfiles': return <ShortlistedProfilesView userFeatures={userFeatures} onUpgradeClick={navigateToMembership} />;
      case 'Messages': return <MessagesView userFeatures={userFeatures} currentUserId={loggedInUser.id} onUpgradeClick={navigateToMembership} />;
      case 'Membership': return <MembershipView loggedInUser={loggedInUser} />;
      case 'ActivityLog': return <ActivityLogView userFeatures={userFeatures} onUpgradeClick={navigateToMembership} />;
      case 'SupportHelp': return <SupportHelpView userFeatures={userFeatures} onUpgradeClick={navigateToMembership} />;
      case 'PartnerPreferences': return <PartnerPreferencesView />;
      case 'AstrologyServices': return <AstrologyServicesView userFeatures={userFeatures} onUpgradeClick={navigateToMembership} />;
      case 'Phonebook': return <PhonebookView />;
      case 'AccountSettings': return <AccountSettingsView />;
      case 'SafetyCentre': return <SafetyCentreView />;
      default:
        return <DashboardHomeView loggedInUser={loggedInUser} userFeatures={userFeatures} onUpgradeClick={navigateToMembership} setActiveView={setActiveView} onViewProfile={handleViewProfile} onSendInterest={handleSendInterest} onShortlist={handleShortlist} />;
    }
  };

  const profileDrawerProps: ProfileDrawerProps = {
    isOpen: isProfileDrawerOpen,
    onClose: toggleProfileDrawer,
    user: mockUserForDrawer,
    activeOffer: activeOffer,
    setActiveView: setActiveView,
    userFeatures: userFeatures,
    onUpgradeClick: navigateToMembership,
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeView={activeView}
        setActiveView={setActiveView}
        userFeatures={userFeatures}
        onUpgradeClick={navigateToMembership}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          onLogout={onLogout} 
          toggleSidebar={toggleSidebar} 
          toggleProfileDrawer={toggleProfileDrawer} 
          userPhotoUrl={mockUserForDrawer.photoUrl} 
          setActiveView={setActiveView}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8 custom-scrollbar">
          {renderActiveView()}
        </main>
      </div>

      {showOfferPopup && activeOffer && (
        <OfferPopupModal offer={activeOffer} onClose={handleCloseOfferPopup} />
      )}

      <ProfileDrawer {...profileDrawerProps} />
      
      {isProfileModalOpen && selectedProfile && (
        <ProfileViewModal 
            profile={selectedProfile} 
            isOpen={isProfileModalOpen} 
            onClose={() => setIsProfileModalOpen(false)} 
            userFeatures={userFeatures} 
            onUpgradeClick={navigateToMembership} 
            onSendInterest={handleSendInterest} 
            onShortlist={handleShortlist} 
        />
      )}
    </div>
  );
};

export default DashboardPage;