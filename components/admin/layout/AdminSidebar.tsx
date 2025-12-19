import React from 'react';
import { AdminRole, AdminViewKey } from '../../../types';
import { HomeIcon } from '../../icons/HomeIcon'; // Dashboard Home
import { UserGroupIcon } from '../../icons/UserGroupIcon'; // User Management, Role & Access
import { ShieldCheckIcon } from '../../icons/ShieldCheckIcon'; // Profile Moderation, Site Settings
import { HeartIcon } from '../../icons/HeartIcon'; // Interest & Match Management
import { CreditCardIcon } from '../../icons/CreditCardIcon'; // Membership & Payments
import { ChatBubbleBottomCenterTextIcon } from '../../icons/ChatBubbleBottomCenterTextIcon'; // Messaging & Complaints
import { MegaphoneIcon } from '../../icons/MegaphoneIcon'; // Notification Tool
import { DocumentTextIcon } from '../../icons/DocumentTextIcon'; // Content Management
import { ChartBarIcon } from '../../icons/ChartBarIcon'; // Analytics Dashboard
import { ArrowLeftIcon } from '../../icons/ArrowLeftIcon'; // For closing sidebar on mobile
import { MagnifyingGlassChartIcon } from '../../icons/MagnifyingGlassChartIcon'; 
import { BeakerIcon } from '../../icons/BeakerIcon'; 
import { LinkIcon } from '../../icons/LinkIcon'; 
import { ArchiveBoxArrowDownIcon } from '../../icons/ArchiveBoxArrowDownIcon'; 
import { TagIcon } from '../../icons/TagIcon'; // New Icon for Offers & Popups


interface AdminNavItem {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  viewKey: AdminViewKey;
  requiredRole?: AdminRole[]; // Optional: for future role-based visibility
}

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeView: AdminViewKey;
  setActiveView: (viewKey: AdminViewKey) => void;
  adminRole: AdminRole;
}

const navItemsConfig: AdminNavItem[] = [
  { name: 'Dashboard', icon: HomeIcon, viewKey: 'AdminDashboardHome' },
  { name: 'User Management', icon: UserGroupIcon, viewKey: 'UserManagement' },
  { name: 'Profile Moderation', icon: ShieldCheckIcon, viewKey: 'ProfileModeration' },
  { name: 'Interests & Matches', icon: HeartIcon, viewKey: 'InterestMatchManagement' },
  { name: 'Membership & Payments', icon: CreditCardIcon, viewKey: 'MembershipPayments' },
  { name: 'Offers & Popups', icon: TagIcon, viewKey: 'OffersPopups'}, // New Item
  { name: 'Messaging & Complaints', icon: ChatBubbleBottomCenterTextIcon, viewKey: 'MessagingComplaints' },
  { name: 'Notification Tool', icon: MegaphoneIcon, viewKey: 'NotificationTool' },
  { name: 'Content Management', icon: DocumentTextIcon, viewKey: 'ContentManagement' },
  { name: 'Analytics', icon: ChartBarIcon, viewKey: 'AnalyticsDashboard' },
  { name: 'Search Log Analyzer', icon: MagnifyingGlassChartIcon, viewKey: 'SearchLogAnalyzer' },
  { name: 'A/B Testing Panel', icon: BeakerIcon, viewKey: 'ABTestingPanel' },
  { name: 'Referral & Affiliate', icon: LinkIcon, viewKey: 'ReferralAffiliatePanel' },
  { name: 'Site Settings', icon: ShieldCheckIcon, viewKey: 'SiteSettings' }, 
  { name: 'Roles & Access', icon: UserGroupIcon, viewKey: 'RoleAccessManagement' },
  { name: 'Profile Recycle Bin', icon: ArchiveBoxArrowDownIcon, viewKey: 'ProfileRecycleBin' },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, toggleSidebar, activeView, setActiveView, adminRole }) => {
  // Basic role check (can be expanded)
  const canView = (item: AdminNavItem) => {
    if (!item.requiredRole || item.requiredRole.length === 0) return true;
    return item.requiredRole.includes(adminRole);
  };

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
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-gray-900 text-gray-300 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } custom-scrollbar`} // Added custom-scrollbar
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
          <span className="text-xl font-semibold text-rose-500">Admin Menu</span>
          <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar"> {/* Added custom-scrollbar */}
          {navItemsConfig.map((item) => (
            canView(item) && (
              <button
                key={item.name}
                onClick={() => {
                  setActiveView(item.viewKey);
                  if (isOpen && window.innerWidth < 768) { // Close sidebar on mobile after click
                    toggleSidebar();
                  }
                }}
                className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left
                  ${
                    activeView === item.viewKey
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }
                `}
                aria-current={activeView === item.viewKey ? 'page' : undefined}
              >
                <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${activeView === item.viewKey ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <span className="flex-1">{item.name}</span>
              </button>
            )
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 mt-auto"> {/* Ensure footer is at bottom */}
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Atut Bandhan Admin</p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;