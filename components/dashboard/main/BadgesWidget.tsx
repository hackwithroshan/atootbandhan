import React, { useMemo } from 'react';
import { TrophyIcon } from '../../icons/TrophyIcon';
import { CheckBadgeIcon } from '../../icons/CheckBadgeIcon';
import { PhotoIcon } from '../../icons/PhotoIcon';
import { AcademicCapIcon } from '../../icons/AcademicCapIcon';
import { UserProfileData } from '../../../types';

interface BadgeItemProps {
  icon: React.ReactNode;
  name: string;
  description: string;
}

const BadgeItem: React.FC<BadgeItemProps> = ({ icon, name, description }) => (
  <div className="flex flex-col items-center text-center p-3 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors duration-200" title={description}>
    <div className="p-2 bg-white rounded-full shadow mb-2 text-rose-500">
      {icon}
    </div>
    <h4 className="text-sm font-semibold text-gray-700">{name}</h4>
  </div>
);

interface BadgesWidgetProps {
    userProfile: Partial<UserProfileData & { isVerified: boolean, photos?: any[] }>;
    profileCompletion: number;
}

const BadgesWidget: React.FC<BadgesWidgetProps> = ({ userProfile, profileCompletion }) => {
  const badges = useMemo(() => {
    const earnedBadges = [];

    if (profileCompletion >= 90) {
      earnedBadges.push({
        id: 'profile_pro',
        icon: <AcademicCapIcon className="w-6 h-6" />,
        name: 'Profile Pro',
        description: 'Your profile is over 90% complete.'
      });
    }

    if (userProfile.isVerified) {
      earnedBadges.push({
        id: 'verified_member',
        icon: <CheckBadgeIcon className="w-6 h-6" />,
        name: 'Verified Member',
        description: 'Your email address is verified.'
      });
    }

    if (userProfile.photos && userProfile.photos.length >= 3) {
        earnedBadges.push({
            id: 'photogenic',
            icon: <PhotoIcon className="w-6 h-6" />,
            name: 'Photogenic',
            description: 'You have uploaded 3 or more photos.'
        });
    }
    
    return earnedBadges;
  }, [userProfile, profileCompletion]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <TrophyIcon className="w-6 h-6 text-yellow-500 mr-2" />
        Your Achievements
      </h2>
      {badges.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
            {badges.slice(0, 4).map((badge: any) => (
            <BadgeItem key={badge.id} icon={badge.icon} name={badge.name} description={badge.description} />
            ))}
        </div>
      ) : (
          <div className="text-center text-sm text-gray-500 py-4">
              <p>No badges earned yet.</p>
              <p className="text-xs mt-1">Start exploring to unlock achievements!</p>
          </div>
      )}
    </div>
  );
};

export default BadgesWidget;