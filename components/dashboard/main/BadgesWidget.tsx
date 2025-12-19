import React from 'react';
import { TrophyIcon } from '../../icons/TrophyIcon';
import { CheckBadgeIcon } from '../../icons/CheckBadgeIcon';
import { StarIcon } from '../../icons/StarIcon';
import { AcademicCapIcon } from '../../icons/AcademicCapIcon';


interface BadgeItemProps {
  icon: React.ReactNode;
  name: string;
  description: string;
}

const BadgeItem: React.FC<BadgeItemProps> = ({ icon, name, description }) => (
  <div className="flex flex-col items-center text-center p-3 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors duration-200">
    <div className="p-2 bg-white rounded-full shadow mb-2 text-rose-500">
      {icon}
    </div>
    <h4 className="text-sm font-semibold text-gray-700">{name}</h4>
    <p className="text-xs text-gray-500">{description}</p>
  </div>
);

const BadgesWidget: React.FC = () => {
  const mockBadges = [
    { id: 1, icon: <CheckBadgeIcon className="w-8 h-8" />, name: 'Profile Pro', description: '100% Complete Profile' },
    { id: 2, icon: <StarIcon className="w-8 h-8" />, name: 'Verified Star', description: 'ID & Photo Verified' },
    { id: 3, icon: <TrophyIcon className="w-8 h-8" />, name: 'Early Bird', description: 'Joined in First Month' },
    { id: 4, icon: <AcademicCapIcon className="w-8 h-8" />, name: 'Quick Starter', description: 'Profile setup in 24h' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <TrophyIcon className="w-6 h-6 text-yellow-500 mr-2" />
        Your Achievements
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {mockBadges.slice(0, 4).map(badge => (
          <BadgeItem key={badge.id} icon={badge.icon} name={badge.name} description={badge.description} />
        ))}
      </div>
      {mockBadges.length > 4 && (
        <p className="text-xs text-rose-500 hover:underline cursor-pointer mt-3 text-center">
          View all badges...
        </p>
      )}
       <p className="text-xs text-gray-400 mt-2 text-center">
         Unlock badges by completing tasks and engaging with the platform.
       </p>
    </div>
  );
};

export default BadgesWidget;