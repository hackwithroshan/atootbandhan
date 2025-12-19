
import React from 'react';
import Button from '../ui/Button';
import { LockClosedIcon } from '../icons/LockClosedIcon'; 
import { MembershipTier } from '../../types';

interface UpgradePromptProps {
  featureName: string;
  requiredTier?: MembershipTier | 'a higher plan'; 
  onUpgradeClick: () => void; 
  size?: 'small' | 'medium' | 'large';
  layout?: 'inline' | 'modal' | 'banner';
  message?: string;
  className?: string;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  featureName,
  requiredTier = 'a higher plan',
  onUpgradeClick,
  size = 'medium',
  layout = 'inline',
  message,
  className = '',
}) => {
  const baseMessage = message || `Upgrade to ${requiredTier} to unlock ${featureName}.`;

  if (layout === 'modal') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] p-4" onClick={onUpgradeClick} role="dialog" aria-modal="true" aria-labelledby="upgradeModalTitle">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm" onClick={(e) => e.stopPropagation()}>
          <LockClosedIcon className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 id="upgradeModalTitle" className="text-lg font-semibold text-gray-800 mb-2">Feature Locked</h3>
          <p className="text-sm text-gray-600 mb-4">{baseMessage}</p>
          <Button variant="primary" onClick={onUpgradeClick}>View Membership Plans</Button>
        </div>
      </div>
    );
  }
  
  const containerClasses = size === 'small' ? 'p-2 text-xs' : 'p-3 md:p-4';
  const iconSizeClass = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
  const textSizeClass = size === 'small' ? 'text-xs' : 'text-sm';
  const buttonSizeClass = size === 'small' ? 'sm' : 'md';

  return (
    <div className={`bg-rose-50 border border-rose-200 rounded-lg ${containerClasses} flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center">
        <LockClosedIcon className={`${iconSizeClass} text-rose-500 mr-2 flex-shrink-0`} />
        <p className={`${textSizeClass} text-rose-700`}>{baseMessage}</p>
      </div>
      <Button variant="primary" size={buttonSizeClass} onClick={onUpgradeClick} className="!bg-rose-500 hover:!bg-rose-600 !text-xs sm:!text-sm whitespace-nowrap">
        Upgrade Plan
      </Button>
    </div>
  );
};

export default UpgradePrompt;
