import React from 'react';
import Button from '../../ui/Button';
import { ShieldCheckIcon } from '../../icons/ShieldCheckIcon';
import { CheckBadgeIcon } from '../../icons/CheckBadgeIcon';
import { InformationCircleIcon } from '../../icons/InformationCircleIcon';
import { CheckIcon } from '../../icons/CheckIcon'; // For completed items
import { XCircleIcon } from '../../icons/XCircleIcon'; // For pending items
import { UserProfileData, DashboardViewKey } from '../../../types';
import { useToast } from '../../../hooks/useToast';

interface TrustFactorProps {
  label: string;
  isCompleted: boolean;
  actionText?: string;
  onAction?: () => void;
}

const TrustFactorItem: React.FC<TrustFactorProps> = ({ label, isCompleted, actionText, onAction }) => (
  <li className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center">
      {isCompleted ? (
        <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
      ) : (
        <XCircleIcon className="w-5 h-5 text-red-400 mr-2" />
      )}
      <span className={`text-sm ${isCompleted ? 'text-gray-700' : 'text-gray-500'}`}>{label}</span>
    </div>
    {!isCompleted && actionText && onAction && (
      <Button variant="secondary" size="sm" onClick={onAction} className="!text-xs !py-1 !px-2">
        {actionText}
      </Button>
    )}
  </li>
);

interface TrustScoreWidgetProps {
    profileCompletion: number;
    userProfile: Partial<UserProfileData & { isVerified: boolean, profilePhotoUrl: string }>;
    setActiveView: (viewKey: DashboardViewKey) => void;
}

const TrustScoreWidget: React.FC<TrustScoreWidgetProps> = ({ profileCompletion, userProfile, setActiveView }) => {
  const { showToast } = useToast();
  const isEmailVerified = userProfile?.isVerified || false;
  const isPhotoUploaded = !!userProfile?.profilePhotoUrl;
  const isIdVerified = false; // This remains mock as backend doesn't provide it yet.

  const factors = [
    { completed: isPhotoUploaded, points: 25 },
    { completed: isEmailVerified, points: 20 },
    { completed: profileCompletion > 90, points: 30 },
    { completed: isIdVerified, points: 25 },
  ];

  const score = factors.reduce((total, factor) => total + (factor.completed ? factor.points : 0), 0);

  const trustFactors = [
    { label: 'Photo Uploaded', isCompleted: isPhotoUploaded, actionText: 'Upload', onAction: () => setActiveView('MyProfile') },
    { label: 'Email Verified', isCompleted: isEmailVerified },
    { label: `Profile ${profileCompletion}% Complete`, isCompleted: profileCompletion > 90, actionText: 'Complete Now', onAction: () => setActiveView('MyProfile') },
    { label: 'ID Verified', isCompleted: isIdVerified, actionText: 'Verify ID', onAction: () => showToast('ID Verification feature is coming soon!', 'info') },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <ShieldCheckIcon className="w-6 h-6 text-rose-500 mr-2" />
          Your Trust Level
        </h2>
        {score > 70 && (
          <div className="flex items-center text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
            <CheckBadgeIcon className="w-5 h-5 mr-1" />
            Trusted Member
          </div>
        )}
      </div>

      <div className="text-center mb-5">
        <div className="relative inline-block">
          {/* A simple score display, can be replaced with a circular progress bar later */}
          <div className="text-5xl font-bold text-rose-600">{score}<span className="text-2xl text-gray-400">/100</span></div>
          <p className="text-sm text-gray-500 mt-1">Trust Score</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
          How to improve your score
          <InformationCircleIcon className="w-4 h-4 text-gray-400 ml-1" title="Completing these actions increases your trustworthiness on the platform." />
        </h3>
        <ul className="space-y-1">
          {trustFactors.map(factor => (
            <TrustFactorItem key={factor.label} {...factor} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrustScoreWidget;