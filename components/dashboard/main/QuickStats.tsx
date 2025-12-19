
import React from 'react';
import { HeartIcon } from '../../icons/HeartIcon';
import { EyeIcon } from '../../icons/EyeIcon';
import { ChatBubbleBottomCenterTextIcon } from '../../icons/ChatBubbleBottomCenterTextIcon';
import { StarIcon } from '../../icons/StarIcon';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  colorClass: string;
}

interface QuickStatsProps {
  stats: {
    interestsReceived: number;
    profileViews: number;
    newMessages: number;
    shortlistedBy: number;
  } | null;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, colorClass }) => (
  <div className={`bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4 border-l-4 ${colorClass}`}>
    <div className={`p-3 rounded-full ${colorClass.replace('border-', 'bg-').replace('500', '100')} text-${colorClass.split('-')[1]}-500`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  const statsData = [
    { icon: <HeartIcon className="w-6 h-6" />, label: 'Interests Received', value: stats?.interestsReceived ?? 0, colorClass: 'border-pink-500' },
    { icon: <EyeIcon className="w-6 h-6" />, label: 'Profile Views', value: stats?.profileViews ?? 0, colorClass: 'border-blue-500' },
    { icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />, label: 'New Messages', value: stats?.newMessages ?? 0, colorClass: 'border-green-500' },
    { icon: <StarIcon className="w-6 h-6" />, label: 'Shortlisted By', value: stats?.shortlistedBy ?? 0, colorClass: 'border-yellow-500' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Activity Snapshot</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default QuickStats;