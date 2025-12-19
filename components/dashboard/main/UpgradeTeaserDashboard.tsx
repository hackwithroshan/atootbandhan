
import React from 'react';
import Button from '../../ui/Button';

interface UpgradeTeaserDashboardProps {
  onUpgradeClick: () => void;
}

const UpgradeTeaserDashboard: React.FC<UpgradeTeaserDashboardProps> = ({ onUpgradeClick }) => {
  return (
    <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 rounded-lg shadow-xl text-white">
      <h2 className="text-2xl font-semibold mb-2">Unlock Premium Benefits!</h2>
      <p className="text-rose-100 mb-4">
        Upgrade your plan to connect with more profiles, get unlimited views, and boost your visibility.
      </p>
      <Button 
        variant="secondary" 
        className="!bg-white !text-rose-600 hover:!bg-rose-50 font-semibold"
        onClick={onUpgradeClick}
      >
        View Upgrade Options
      </Button>
    </div>
  );
};

export default UpgradeTeaserDashboard;
