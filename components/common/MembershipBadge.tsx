
import React from 'react';
import { MembershipTier } from '../../types';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';

interface MembershipBadgeProps {
  tier?: MembershipTier;
  size?: 'sm' | 'md' | 'lg'; // sm: 16px, md: 20px, lg: 24px
  className?: string;
}

export const MembershipBadge: React.FC<MembershipBadgeProps> = ({ tier, size = 'sm', className = '' }) => {
  if (!tier || tier === MembershipTier.FREE) return null;

  let iconColor = '';
  let tooltipText = '';
  
  let iconSizeClass = 'w-4 h-4'; // Default to 'sm'
  if (size === 'md') iconSizeClass = 'w-5 h-5';
  if (size === 'lg') iconSizeClass = 'w-6 h-6';


  switch (tier) {
    case MembershipTier.SILVER:
      iconColor = 'text-blue-500'; // Tailwind blue-500
      tooltipText = 'Silver Member';
      break;
    case MembershipTier.GOLD:
      iconColor = 'text-yellow-500'; // Tailwind yellow-500 (can be amber or gold if available)
      tooltipText = 'Gold Verified';
      break;
    case MembershipTier.DIAMOND:
      iconColor = 'text-purple-600'; // Tailwind purple-600
      tooltipText = 'Diamond Verified';
      break;
    default:
      return null;
  }

  return (
    <span title={tooltipText} className={`inline-flex items-center ${className}`}>
      <CheckBadgeIcon className={`${iconSizeClass} ${iconColor}`} />
    </span>
  );
};
