
import React from 'react';
import Button from '../../ui/Button';
import { XMarkIcon } from '../../icons/XMarkIcon';
import { UserIcon } from '../../icons/UserIcon'; 
import { PencilIcon } from '../../icons/PencilIcon'; 
import { UsersIcon } from '../../icons/UsersIcon'; 
import { SparklesIcon } from '../../icons/SparklesIcon'; 
import { QueueListIcon } from '../../icons/QueueListIcon'; 
import { Cog6ToothIcon } from '../../icons/Cog6ToothIcon'; 
import { ShieldCheckIcon } from '../../icons/ShieldCheckIcon'; 
import { QuestionMarkCircleIcon } from '../../icons/QuestionMarkCircleIcon'; 
import { Offer, DashboardDrawerItemKey, UserFeatures, MembershipTier } from '../../../types'; 
import { DashboardViewKey } from '../../../pages/DashboardPage'; 

export interface ProfileDrawerProps { // Exporting for DashboardPage to use
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; id: string; photoUrl: string | null; membershipTier: MembershipTier }; 
  activeOffer?: Offer | null;
  setActiveView: (viewKey: DashboardViewKey) => void; 
  userFeatures: UserFeatures; // Added
  onUpgradeClick: () => void; // Added
}

interface DrawerItem {
  key: DashboardDrawerItemKey;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  targetView: DashboardViewKey; 
}

const drawerItems: DrawerItem[] = [
  { key: 'EditProfile', label: 'Edit Profile', icon: PencilIcon, targetView: 'MyProfile' },
  { key: 'PartnerPreferences', label: 'Partner Preferences', icon: UsersIcon, targetView: 'PartnerPreferences' }, // Updated
  { key: 'AstrologyServices', label: 'Astrology Services', icon: SparklesIcon, targetView: 'AstrologyServices' }, // Updated
  { key: 'Phonebook', label: 'Phonebook', icon: QueueListIcon, targetView: 'Phonebook' }, // Updated
  { key: 'AccountSettings', label: 'Account & Settings', icon: Cog6ToothIcon, targetView: 'AccountSettings' }, // Updated
  { key: 'SafetyCentre', label: 'Safety Centre', icon: ShieldCheckIcon, targetView: 'SafetyCentre' }, // Updated
  { key: 'HelpSupport', label: 'Help & Support', icon: QuestionMarkCircleIcon, targetView: 'SupportHelp' },
];

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose, user, activeOffer, setActiveView, userFeatures, onUpgradeClick }) => {
  const handleNavigation = (viewKey: DashboardViewKey) => {
    setActiveView(viewKey);
    onClose(); 
  };

  const today = new Date().toISOString().split('T')[0];
  const isOfferValid = activeOffer && activeOffer.startDate <= today && activeOffer.endDate >= today && activeOffer.status === 'Published';

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[55] transition-opacity duration-300 ease-in-out md:hidden"
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-gradient-to-b from-rose-50 to-pink-100 shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out flex flex-col
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profileDrawerHeader"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-rose-200">
          <h2 id="profileDrawerHeader" className="text-lg font-semibold text-rose-700">My Account</h2>
          <Button
            onClick={onClose}
            variant="secondary"
            size="sm"
            className="!p-1.5 !rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            aria-label="Close profile drawer"
          >
            <XMarkIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* User Info */}
        <div className="p-4 text-center border-b border-rose-200">
          <img
            src={user.photoUrl || 'https://via.placeholder.com/80/CCCCCC/FFFFFF?Text=User'}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-rose-300"
          />
          <h3 className="font-semibold text-gray-800">{user.name}</h3>
          <p className="text-xs text-gray-500">ID: {user.id}</p>
        </div>

        {/* CTA & Offer */}
        <div className="p-4 space-y-2 border-b border-rose-200">
          <Button 
            variant="danger" 
            className="w-full !bg-red-500 hover:!bg-red-600 !text-white"
            onClick={() => { onUpgradeClick(); onClose(); }} // Use onUpgradeClick and close drawer
          >
            Upgrade Membership
          </Button>
          {isOfferValid && activeOffer && (
            <p className="text-xs text-center text-green-600">
              Offer: {activeOffer.title} (Valid till {new Date(activeOffer.endDate  + 'T00:00:00').toLocaleDateString()})
            </p>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <ul className="space-y-1">
            {drawerItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => handleNavigation(item.targetView)}
                  className="w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-rose-200 hover:text-rose-700 transition-colors text-left"
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5 mr-3 text-rose-500 flex-shrink-0" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-rose-200 text-center mt-auto">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Atut Bandhan</p>
        </div>
      </div>
    </>
  );
};

export default ProfileDrawer;
