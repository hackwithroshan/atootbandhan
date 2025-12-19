import React, { useState } from 'react';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import AdminSidebar from '../../components/admin/layout/AdminSidebar';
import { AdminRole, AdminViewKey } from '../../types';

// Import all admin view components
import AdminDashboardHomeView from '../../components/admin/views/AdminDashboardHomeView';
import UserManagementView from '../../components/admin/views/UserManagementView';
import ProfileModerationView from '../../components/admin/views/ProfileModerationView';
import InterestMatchManagementView from '../../components/admin/views/InterestMatchManagementView';
import MembershipPaymentsView from '../../components/admin/views/MembershipPaymentsView';
import MessagingComplaintsView from '../../components/admin/views/MessagingComplaintsView';
import NotificationToolView from '../../components/admin/views/NotificationToolView';
import ContentManagementView from '../../components/admin/views/ContentManagementView';
import AnalyticsDashboardView from '../../components/admin/views/AnalyticsDashboardView';
import SiteSettingsView from '../../components/admin/views/SiteSettingsView';
import RoleAccessManagementView from '../../components/admin/views/RoleAccessManagementView';
import SearchLogAnalyzerView from '../../components/admin/views/SearchLogAnalyzerView'; 
import ABTestingPanelView from '../../components/admin/views/ABTestingPanelView'; 
import ReferralAffiliatePanelView from '../../components/admin/views/ReferralAffiliatePanelView'; 
import ProfileRecycleBinView from '../../components/admin/views/ProfileRecycleBinView'; 
import OffersPopupsView from '../../components/admin/views/OffersPopupsView'; // New Import


interface AdminDashboardPageProps {
  onAdminLogout: () => void;
  adminRole: AdminRole;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onAdminLogout, adminRole }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<AdminViewKey>('AdminDashboardHome');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'AdminDashboardHome': return <AdminDashboardHomeView />;
      case 'UserManagement': return <UserManagementView />;
      case 'ProfileModeration': return <ProfileModerationView />;
      case 'InterestMatchManagement': return <InterestMatchManagementView />;
      case 'MembershipPayments': return <MembershipPaymentsView />;
      case 'MessagingComplaints': return <MessagingComplaintsView />;
      case 'NotificationTool': return <NotificationToolView />;
      case 'ContentManagement': return <ContentManagementView />;
      case 'AnalyticsDashboard': return <AnalyticsDashboardView />;
      case 'SiteSettings': return <SiteSettingsView />;
      case 'RoleAccessManagement': return <RoleAccessManagementView />;
      case 'SearchLogAnalyzer': return <SearchLogAnalyzerView />; 
      case 'ABTestingPanel': return <ABTestingPanelView />; 
      case 'ReferralAffiliatePanel': return <ReferralAffiliatePanelView />; 
      case 'ProfileRecycleBin': return <ProfileRecycleBinView />; 
      case 'OffersPopups': return <OffersPopupsView />; // New Case
      default: return <AdminDashboardHomeView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-800 text-gray-100"> {/* Dark theme for admin panel */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeView={activeView}
        setActiveView={setActiveView}
        adminRole={adminRole}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
            onAdminLogout={onAdminLogout} 
            toggleSidebar={toggleSidebar} 
            adminRole={adminRole} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-4 md:p-6 lg:p-8 custom-scrollbar"> {/* Added custom-scrollbar */}
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;