import React from 'react';
import Button from '../../ui/Button';
import { ArrowDownTrayIcon } from '../../icons/ArrowDownTrayIcon';
import { Cog6ToothIcon } from '../../icons/Cog6ToothIcon'; // Example for other actions

const ProfileActionsWidget: React.FC = () => {
  const handleDownloadPdf = () => {
    console.log('Mock: Downloading Profile as PDF...');
    alert('Mock: Your profile PDF would start downloading now.');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Profile Utilities
      </h2>
      <div className="space-y-3">
        <Button 
          variant="secondary" 
          onClick={handleDownloadPdf} 
          className="w-full !justify-start !text-sm"
        >
          <ArrowDownTrayIcon className="w-5 h-5 mr-3 text-gray-500" />
          Download Profile as PDF
        </Button>
        
        {/* Placeholder for other actions */}
        <Button 
          variant="secondary" 
          onClick={() => console.log("Account Settings clicked")} 
          className="w-full !justify-start !text-sm"
        >
          <Cog6ToothIcon className="w-5 h-5 mr-3 text-gray-500" />
          Account Settings (Mock)
        </Button>
      </div>
      <p className="text-xs text-gray-400 mt-4">
        More profile management tools coming soon.
      </p>
    </div>
  );
};

export default ProfileActionsWidget;