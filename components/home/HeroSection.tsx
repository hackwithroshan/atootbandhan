import React from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { SearchIcon } from '../icons/SearchIcon';
import { UserIcon } from '../icons/UserIcon';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';
import { CalendarIcon } from '../icons/CalendarIcon';
import { MapPinIcon } from '../icons/MapPinIcon';

interface HeroSectionProps {
  onJoinNowClick: () => void;
  onBrowseMatchesClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onJoinNowClick, onBrowseMatchesClick }) => {
  const ageOptions = [
    { value: '20-25', label: '20-25 years' },
    { value: '26-30', label: '26-30 years' },
    { value: '31-35', label: '31-35 years' },
    { value: '36-40', label: '36-40 years' },
    { value: '40+', label: '40+ years' },
  ];

  const religionOptions = [
    { value: 'hindu', label: 'Hindu' },
    { value: 'muslim', label: 'Muslim' },
    { value: 'christian', label: 'Christian' },
    { value: 'sikh', label: 'Sikh' },
    { value: 'any', label: 'Any Religion' },
  ];

  return (
    <section id="hero" className="relative bg-gradient-to-br from-rose-100 via-pink-100 to-red-200 pt-32 pb-20 md:pt-48 md:pb-32 flex items-center justify-center min-h-screen md:min-h-[calc(100vh-0px)]"> {/* Adjusted min-h for header */}
      {/* Background elements (optional) */}
      <div className="absolute inset-0 opacity-30">
        {/* You could add subtle pattern or image here */}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-rose-700 tracking-tight leading-tight">
          Jodiyan Banti Hain Yahan,
          <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">Rishte Judte Hain Dil Se</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Join thousands who found their soulmate through Atut Bandhan. Your journey to a lifetime of happiness begins here.
        </p>

        {/* Search Filter Bar */}
        <div className="mt-10 md:mt-12 bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <Select
              id="hero-age"
              name="hero-age"
              label="Age"
              options={ageOptions}
              defaultValue="26-30"
              icon={<CalendarIcon className="w-5 h-5 text-gray-400" />}
              className="mb-0"
            />
            <Select
              id="hero-religion"
              name="hero-religion"
              label="Religion"
              options={religionOptions}
              defaultValue="any"
              icon={<BriefcaseIcon className="w-5 h-5 text-gray-400" />}
              className="mb-0"
            />
             <Input
              id="hero-caste"
              name="hero-caste"
              label="Caste (Optional)"
              placeholder="e.g. Brahmin"
              icon={<BriefcaseIcon className="w-5 h-5 text-gray-400" />}
              className="mb-0"
            />
            <Input
              id="hero-location"
              name="hero-location"
              label="Location"
              placeholder="e.g. Mumbai"
              icon={<MapPinIcon className="w-5 h-5 text-gray-400" />}
              className="mb-0"
            />
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full !py-3.5 lg:mt-[28px] !bg-rose-500 hover:!bg-rose-600"
              onClick={() => console.log('Hero Search Clicked - Functionality to be added')}
            >
              <SearchIcon className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button 
            variant="primary" 
            size="lg" 
            className="!px-10 !py-4 !text-base !font-semibold !bg-gradient-to-r !from-rose-500 !to-pink-600 hover:!from-rose-600 hover:!to-pink-700 !shadow-lg transform hover:scale-105"
            onClick={onJoinNowClick}
            >
            Join Now – It’s Free
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            className="!px-10 !py-4 !text-base !font-semibold !bg-white/80 hover:!bg-white !text-rose-600 !border !border-rose-300 hover:!border-rose-500 !shadow-md"
            onClick={onBrowseMatchesClick} // Or a different action if "Browse Matches" has a distinct flow
            >
            Browse Matches
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;