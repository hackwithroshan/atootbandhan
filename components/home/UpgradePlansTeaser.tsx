import React from 'react';
import Button from '../ui/Button';
import { StarIcon } from '../icons/StarIcon';
import { CheckIcon } from '../icons/CheckIcon';

interface UpgradePlansTeaserProps {
  onViewPlansClick: () => void;
}

const UpgradePlansTeaser: React.FC<UpgradePlansTeaserProps> = ({ onViewPlansClick }) => {
  return (
    <section id="upgrade-plans" className="py-16 md:py-24 bg-rose-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <StarIcon className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Unlock Premium Benefits
        </h2>
        <p className="mt-4 text-lg text-rose-100 max-w-2xl mx-auto mb-8">
          Elevate your partner search experience with our premium plans. Get more profile views, send unlimited interests, and access exclusive features.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10 text-left">
            <div className="flex items-start space-x-2 p-3 bg-rose-500/50 rounded-lg">
                <CheckIcon className="w-5 h-5 text-yellow-300 mt-1 flex-shrink-0" />
                <span className="text-rose-50">View contact details</span>
            </div>
            <div className="flex items-start space-x-2 p-3 bg-rose-500/50 rounded-lg">
                <CheckIcon className="w-5 h-5 text-yellow-300 mt-1 flex-shrink-0" />
                <span className="text-rose-50">Enhanced chat options</span>
            </div>
             <div className="flex items-start space-x-2 p-3 bg-rose-500/50 rounded-lg">
                <CheckIcon className="w-5 h-5 text-yellow-300 mt-1 flex-shrink-0" />
                <span className="text-rose-50">Profile boost & visibility</span>
            </div>
        </div>
        <Button 
            variant="secondary" 
            size="lg" 
            onClick={onViewPlansClick}
            className="!bg-white !text-rose-600 hover:!bg-rose-100 !font-semibold !px-10 !py-4 transform hover:scale-105"
        >
          View Membership Plans
        </Button>
      </div>
    </section>
  );
};

export default UpgradePlansTeaser;