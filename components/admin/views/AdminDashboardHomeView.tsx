import React, { useState, useEffect } from 'react';
import { HomeIcon } from '../../icons/HomeIcon';
import { UserGroupIcon } from '../../icons/UserGroupIcon';
import { ChartBarIcon } from '../../icons/ChartBarIcon';
import { Cog6ToothIcon } from '../../icons/Cog6ToothIcon';
import { BellAlertIcon } from '../../icons/BellAlertIcon';
import { LinkIcon } from '../../icons/LinkIcon';
import { CurrencyDollarIcon } from '../../icons/CurrencyDollarIcon';
import { ShieldCheckIcon } from '../../icons/ShieldCheckIcon';
import { ExclamationTriangleIcon } from '../../icons/ExclamationTriangleIcon';
import { DocumentTextIcon } from '../../icons/DocumentTextIcon'; 
import { MegaphoneIcon } from '../../icons/MegaphoneIcon'; 
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string, note?: string }> = ({ title, value, icon, color, note }) => (
  <div className={`bg-gray-700 p-5 rounded-lg shadow-xl border-l-4 ${color}`}>
    <div className="flex items-center">
      <div className="p-2.5 rounded-full bg-gray-800 mr-3">{icon}</div>
      <div>
        <p className="text-2xl sm:text-3xl font-semibold text-white">{value}</p>
        <p className="text-gray-400 text-sm sm:text-base">{title}</p>
        {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
      </div>
    </div>
  </div>
);

const AdminDashboardHomeView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const data = await apiClient('/api/admin/stats');
        setStats(data);
      } catch (error: any) {
        showToast(error.message, 'error');
      } finally {
          setIsLoading(false);
      }
    };
    fetchStats();
  }, [showToast]);

  const quickLinks = [
    { label: 'Manage Users', view: 'UserManagement', icon: <UserGroupIcon className="w-5 h-5 mr-2"/> },
    { label: 'Profile Moderation', view: 'ProfileModeration', icon: <ShieldCheckIcon className="w-5 h-5 mr-2"/> },
    { label: 'Site Settings', view: 'SiteSettings', icon: <Cog6ToothIcon className="w-5 h-5 mr-2"/> },
    { label: 'Analytics', view: 'AnalyticsDashboard', icon: <ChartBarIcon className="w-5 h-5 mr-2"/> },
    { label: 'Content Management', view: 'ContentManagement', icon: <DocumentTextIcon className="w-5 h-5 mr-2"/> },
    { label: 'Notification Tool', view: 'NotificationTool', icon: <MegaphoneIcon className="w-5 h-5 mr-2"/> },
  ];

  if (isLoading || !stats) {
    return <div className="text-center p-10">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <HomeIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold text-gray-100">Admin Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={<UserGroupIcon className="w-7 h-7 text-blue-400" />} color="border-blue-500" />
        <StatCard title="Active Users Today" value={stats.activeToday.toLocaleString()} icon={<UserGroupIcon className="w-7 h-7 text-teal-400" />} color="border-teal-500" />
        <StatCard title="New Signups (Week)" value={stats.newThisWeek.toLocaleString()} icon={<UserGroupIcon className="w-7 h-7 text-green-400" />} color="border-green-500" />
        <StatCard title="Paid Members" value={stats.paidMembers.toLocaleString()} icon={<UserGroupIcon className="w-7 h-7 text-purple-400" />} color="border-purple-500" />
        <StatCard title="Free Members" value={stats.freeMembers.toLocaleString()} icon={<UserGroupIcon className="w-7 h-7 text-indigo-400" />} color="border-indigo-500" />
        <StatCard title="Reported Accounts" value={`${stats.reportedAccounts}`} icon={<ExclamationTriangleIcon className="w-7 h-7 text-red-400" />} color="border-red-500" note="Pending review" />
        <StatCard title="Daily Revenue" value={stats.dailyRevenue} icon={<CurrencyDollarIcon className="w-7 h-7 text-lime-400" />} color="border-lime-500" note="Mock data" />
        <StatCard title="Pending Moderations" value={`${stats.pendingModerations}`} icon={<ShieldCheckIcon className="w-7 h-7 text-yellow-400" />} color="border-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-700 p-6 rounded-lg shadow-xl h-72 flex flex-col items-center justify-center">
          <ChartBarIcon className="w-12 h-12 text-gray-500 mb-3"/>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Signups Over Time</h3>
          <p className="text-gray-400 text-sm">(Graph Placeholder)</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg shadow-xl h-72 flex flex-col items-center justify-center">
          <ChartBarIcon className="w-12 h-12 text-gray-500 mb-3"/>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Gender/Caste Distribution</h3>
           <p className="text-gray-400 text-sm">(Graph Placeholder)</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg shadow-xl h-72 flex flex-col items-center justify-center lg:col-span-2">
          <ChartBarIcon className="w-12 h-12 text-gray-500 mb-3"/>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Match Activity Trends</h3>
           <p className="text-gray-400 text-sm">(Graph Placeholder)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-gray-700 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
            <BellAlertIcon className="w-6 h-6 mr-2 text-yellow-400" />
            Key Pending Actions
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between items-center">
              <span className="text-gray-300">Profile Moderations:</span>
              <span className="font-semibold text-yellow-300 bg-yellow-700/50 px-2 py-0.5 rounded">{stats.pendingModerations}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-300">Success Story Approvals:</span>
              <span className="font-semibold text-yellow-300 bg-yellow-700/50 px-2 py-0.5 rounded">{stats.pendingStories}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-300">Open Complaints:</span>
              <span className="font-semibold text-yellow-300 bg-yellow-700/50 px-2 py-0.5 rounded">{stats.openComplaints}</span>
            </li>
             <li className="flex justify-between items-center">
              <span className="text-gray-300">Offline Payment Approvals:</span>
              <span className="font-semibold text-yellow-300 bg-yellow-700/50 px-2 py-0.5 rounded">1</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2 bg-gray-700 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
            <LinkIcon className="w-6 h-6 mr-2 text-rose-400" />
            Quick Links
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickLinks.map(link => (
              <button
                key={link.label}
                onClick={() => alert(`Navigate to ${link.label} (mock functionality - use sidebar for actual navigation)`)}
                className="flex items-center text-left p-3 bg-gray-650 hover:bg-gray-600 rounded-md text-sm text-rose-300 hover:text-rose-200 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {link.icon} {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
       <p className="text-xs text-gray-500 text-center mt-8">Full functionality for each section will be built out progressively. Real-time search, column sorting, pagination, and filter save presets are planned general UI enhancements.</p>
    </div>
  );
};

export default AdminDashboardHomeView;
