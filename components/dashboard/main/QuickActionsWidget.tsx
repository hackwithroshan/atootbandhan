import React from 'react';
import Button from '../../ui/Button';
import { WifiIcon } from '../../icons/WifiIcon';
import { RocketLaunchIcon } from '../../icons/RocketLaunchIcon';
import { SearchIcon } from '../../icons/SearchIcon'; // Changed from MagnifyingGlassIcon


const QuickActionsWidget: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Quick Actions
      </h2>
      <div className="space-y-3">
        <Button 
          variant="primary" 
          onClick={() => console.log("See who's online clicked (mock)")} 
          className="w-full !justify-start !text-sm !bg-green-500 hover:!bg-green-600"
        >
          <WifiIcon className="w-5 h-5 mr-3" />
          See Who's Online Now
        </Button>
        <Button 
          variant="primary" 
          onClick={() => console.log("Boost profile clicked (mock)")} 
          className="w-full !justify-start !text-sm !bg-blue-500 hover:!bg-blue-600"
        >
          <RocketLaunchIcon className="w-5 h-5 mr-3" />
          Boost Your Profile
        </Button>
         <Button 
          variant="secondary" 
          onClick={() => console.log("Advanced Search clicked (mock)")} 
          className="w-full !justify-start !text-sm"
        >
          <SearchIcon className="w-5 h-5 mr-3 text-gray-500" /> {/* Changed from MagnifyingGlassIcon */}
          Advanced Search
        </Button>
      </div>
       <p className="text-xs text-gray-400 mt-3 text-center">
        Take control of your matchmaking journey.
       </p>
    </div>
  );
};

export default QuickActionsWidget;