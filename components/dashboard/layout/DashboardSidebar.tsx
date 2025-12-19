
import React, { useMemo } from 'react';
import { HomeIcon } from '../../icons/HomeIcon';
import { UserIcon } from '../../icons/UserIcon';
import { HeartIcon } from '../../icons/HeartIcon';
import { SearchIcon } from '../../icons/SearchIcon';
import { StarIcon } from '../../icons/StarIcon';
import { ChatBubbleBottomCenterTextIcon } from '../../icons/ChatBubbleBottomCenterTextIcon';
import { CreditCardIcon } from '../../icons/CreditCardIcon';
import { QueueListIcon } from '../../icons/QueueListIcon';
import { ArrowLeftIcon } from '../../icons/ArrowLeftIcon';
import { TicketIcon } from '../../icons/TicketIcon'; 
import { PencilIcon } from '../../icons/PencilIcon';
import { UsersIcon } from '../../icons/UsersIcon'; 
import { SparklesIcon } from '../../icons/SparklesIcon'; 
import { Cog6ToothIcon } from '../../icons/Cog6ToothIcon'; 
import { ShieldCheckIcon } from '../../icons/ShieldCheckIcon'; 
import { QuestionMarkCircleIcon } from '../../icons/QuestionMarkCircleIcon'; 
import { LockClosedIcon } from '../../icons/LockClosedIcon'; // For locked features

import { DashboardViewKey } from '../../../pages/DashboardPage'; 
import { UserFeatures, MembershipTier } from '../../../types';

interface NavItem {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  viewKey: DashboardViewKey; 
  count?: number;
  requiredTier?: MembershipTier; // Optional: For a quick check
  featureCheck?: (features: UserFeatures) => boolean; // More granular check
}

interface DashboardSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeView: DashboardViewKey;
  setActiveView: (viewKey: DashboardViewKey) => void;
  userFeatures: UserFeatures;
  onUpgradeClick: () => void;
}

const navItemsConfig: NavItem[] = [
  { name: 'Dashboard', icon: HomeIcon, viewKey: 'DashboardHome' },
  { name: 'My Profile', icon: UserIcon, viewKey: 'MyProfile' },
  { name: 'Partner Preferences', icon: UsersIcon, viewKey: 'PartnerPreferences' }, 
  { name: 'My Matches', icon: HeartIcon, viewKey: 'MyMatches', featureCheck: (f) => f.matchesPerDay !== 0 },
  { name: 'Search Matches', icon: SearchIcon, viewKey: 'SearchMatches' }, // Access controlled within view
  { name: 'Expressed Interests', icon: StarIcon, viewKey: 'ExpressedInterests', featureCheck: (f) => f.expressInterestPerDay !== 0 }, 
  { name: 'Shortlisted Profiles', icon: StarIcon, viewKey: 'ShortlistedProfiles' },
  { name: 'Messages', icon: ChatBubbleBottomCenterTextIcon, viewKey: 'Messages', count: 3, featureCheck: (f) => f.canChat || f.chatLimit !== undefined },
  { name: 'Astrology Services', icon: SparklesIcon, viewKey: 'AstrologyServices', featureCheck: (f) => f.astrologyAccess !== 'none' }, 
  { name: 'Phonebook', icon: QueueListIcon, viewKey: 'Phonebook', featureCheck: (f) => f.canViewPhone }, 
  { name: 'Membership', icon: CreditCardIcon, viewKey: 'Membership' },
  { name: 'Activity Log', icon: QueueListIcon, viewKey: 'ActivityLog' },
  { name: 'Account & Settings', icon: Cog6ToothIcon, viewKey: 'AccountSettings' }, 
  { name: 'Safety Centre', icon: ShieldCheckIcon, viewKey: 'SafetyCentre' }, 
  { name: 'Support / Help', icon: QuestionMarkCircleIcon, viewKey: 'SupportHelp' },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, toggleSidebar, activeView, setActiveView, userFeatures, onUpgradeClick }) => {
  
  const visibleNavItems = useMemo(() => {
    return navItemsConfig.map(item => {
      const isAccessible = item.featureCheck ? item.featureCheck(userFeatures) : true;
      return { ...item, isAccessible };
    });
  }, [userFeatures]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-gradient-to-b from-rose-700 to-rose-600 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } custom-scrollbar`} 
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-rose-500/50">
          <span className="text-2xl font-semibold">Atut Bandhan</span>
          <button onClick={toggleSidebar} className="md:hidden text-rose-200 hover:text-white">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {visibleNavItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.isAccessible) {
                  setActiveView(item.viewKey);
                  if (isOpen && window.innerWidth < 768) { 
                    toggleSidebar();
                  }
                } else {
                  onUpgradeClick(); 
                   if (isOpen && window.innerWidth < 768) { 
                    toggleSidebar();
                  }
                }
              }}
              className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left
                ${activeView === item.viewKey && item.isAccessible ? 'bg-rose-500 text-white shadow-lg' 
                 : item.isAccessible ? 'text-rose-100 hover:bg-rose-500/80 hover:text-white'
                 : 'text-rose-300 opacity-70 cursor-not-allowed hover:bg-rose-500/50'}
              `}
              aria-disabled={!item.isAccessible}
              title={!item.isAccessible ? "Upgrade to access this feature" : item.name}
            >
              <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${!item.isAccessible && activeView !== item.viewKey ? 'text-rose-400' : ''}`} />
              <span className="flex-1">{item.name}</span>
              {!item.isAccessible && <LockClosedIcon className="w-4 h-4 text-yellow-300" />}
              {item.isAccessible && item.count && (
                <span className="ml-auto bg-pink-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-rose-500/50">
          <p className="text-xs text-rose-200">© {new Date().getFullYear()} Atut Bandhan</p>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
