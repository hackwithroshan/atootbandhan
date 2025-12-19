
import React from 'react';
import Button from '../../ui/Button';

interface ProfileCompletionWidgetProps {
  percentage: number;
}

const ProfileCompletionWidget: React.FC<ProfileCompletionWidgetProps> = ({ percentage }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Complete Your Profile</h2>
          <p className="text-sm text-gray-600 mt-1">
            A complete profile attracts more relevant matches! You're almost there.
          </p>
        </div>
        <Button 
          variant="primary" 
          className="mt-4 sm:mt-0 sm:ml-4 !bg-rose-500 hover:!bg-rose-600"
          onClick={() => console.log("Complete profile clicked")} // This should navigate to MyProfile
        >
          Complete Now
        </Button>
      </div>
      <div className="mt-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-rose-600">Profile Completion</span>
          <span className="text-sm font-medium text-rose-600">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-rose-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionWidget;