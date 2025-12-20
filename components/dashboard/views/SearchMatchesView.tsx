import React, { useState } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { SearchIcon } from '../../icons/SearchIcon';
import { FunnelIcon } from '../../icons/FunnelIcon'; 
import { UserFeatures, MembershipTier, MatchProfile } from '../../../types'; 
import UpgradePrompt from '../../common/UpgradePrompt'; 
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';
import { UserPlusIcon } from '../../icons/UserPlusIcon';
import { BookmarkIcon } from '../../icons/BookmarkIcon';
import ProfileViewModal from '../matches/ProfileViewModal';

const religionOptions = [{value: '', label: 'Any'}, { value: 'Hindu', label: 'Hindu' }, { value: 'Muslim', label: 'Muslim' }];
const educationOptions = [{value: '', label: 'Any'},{ value: 'Masters', label: "Master's" }, { value: 'Bachelors', label: "Bachelor's" }];
const professionOptions = [{value: '', label: 'Any'},{ value: 'Private Job', label: 'Private Job' }, { value: 'Government Job', label: 'Government Job' }];

const SearchResultCard: React.FC<MatchProfile & {
  onViewProfile: (profile: MatchProfile) => void;
  onSendInterest: (profileId: string) => void;
  onShortlist: (profileId: string) => void;
}> = (props) => {
  const { id, name, age, location, profession, photoUrl, onViewProfile, onSendInterest, onShortlist } = props;
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row items-center p-4 space-x-4">
      <img src={photoUrl || 'https://via.placeholder.com/80/CCCCCC/FFFFFF?Text=?'} alt={name} className="w-24 h-24 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0" />
      <div className="flex-grow text-center sm:text-left mt-3 sm:mt-0">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600">{age} yrs, {location}</p>
        <p className="text-sm text-gray-500 truncate">{profession}</p>
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-3 sm:mt-0">
        <Button variant="secondary" size="sm" className="!text-xs !py-1.5" onClick={() => onViewProfile(props)}>View Profile</Button>
        <Button variant="primary" size="sm" className="!text-xs !py-1.5 !bg-rose-500 hover:!bg-rose-600" onClick={() => onSendInterest(id)}>Interest</Button>
        <Button variant="secondary" size="sm" className="!text-xs !py-1.5" onClick={() => onShortlist(id)} title="Shortlist"><BookmarkIcon className="w-4 h-4"/></Button>
      </div>
    </div>
  );
};

interface SearchMatchesViewProps {
  userFeatures: UserFeatures;
  onUpgradeClick: () => void;
}

const SearchMatchesView: React.FC<SearchMatchesViewProps> = ({ userFeatures, onUpgradeClick }) => {
  const [searchParams, setSearchParams] = useState({
    keyword: '', religion: '', city: '', caste: ''
  });
  const [results, setResults] = useState<MatchProfile[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  
  const [selectedProfile, setSelectedProfile] = useState<MatchProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleViewProfile = (profile: MatchProfile) => {
    if (!userFeatures.canViewFullProfiles) {
        onUpgradeClick();
        return;
    }
    setSelectedProfile(profile);
    setIsProfileModalOpen(true);
  };

  const handleSendInterest = async (profileId: string) => {
    try {
        await apiClient(`/api/interests/${profileId}`, { method: 'POST' });
        showToast('Interest sent successfully!', 'success');
    } catch (err: any) {
        showToast(err.message, 'error');
    }
  };

  const handleShortlist = async (profileId: string) => {
    try {
        await apiClient(`/api/users/shortlist/${profileId}`, { method: 'PUT' });
        showToast('Shortlist updated!', 'success');
    } catch (err: any) {
        showToast(err.message, 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await apiClient('/api/users/search', {
        method: 'POST',
        body: searchParams,
      });
      const formattedResults = data.map((user: any): MatchProfile => ({ 
          ...user, 
          id: user.id, 
          name: user.fullName, 
          age: user.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : 0, 
          location: user.city, 
          profession: user.occupation, 
          photoUrl: user.profilePhotoUrl, 
          matchPercentage: 0 
      }));
      setResults(formattedResults);
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const canUseAdvancedFilters = userFeatures.hasAdvancedSearchFilters;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FunnelIcon className="w-7 h-7 text-rose-500" />
        <h2 className="text-2xl font-semibold text-gray-800">Search Matches</h2>
      </div>
      
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md space-y-4">
         <Input 
            id="keywordSearch" 
            name="keyword" 
            label="Keyword Search (Name, Profession, etc.)" 
            value={searchParams.keyword} 
            onChange={handleChange} 
            placeholder="Enter keywords..."
            icon={<SearchIcon className="w-5 h-5 text-gray-400"/>}
        />
        
        <h3 className="text-lg font-semibold text-gray-700 pt-3 border-t mt-4">Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select id="religion" name="religion" label="Religion" options={religionOptions} value={searchParams.religion} onChange={handleChange} />
          <Input id="caste" name="caste" type="text" label="Caste" value={searchParams.caste} onChange={handleChange} placeholder="Enter caste" />
          <Input id="city" name="city" type="text" label="City" value={searchParams.city} onChange={handleChange} placeholder="Enter city" />
        </div>
        <div className="pt-2 text-right">
          <Button type="submit" variant="primary" className="!bg-rose-500 hover:!bg-rose-600" isLoading={isLoading}>
            <SearchIcon className="w-5 h-5 mr-2" /> Search Matches
          </Button>
        </div>
      </form>

      {/* Search Results */}
      {hasSearched && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Search Results {isLoading ? '' : `(${results.length})`}</h3>
          {isLoading ? (
            <p className="text-center text-gray-500 py-6">Searching...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-6">{error}</p>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map(profile => (
                <SearchResultCard key={profile.id} {...profile} onViewProfile={handleViewProfile} onSendInterest={handleSendInterest} onShortlist={handleShortlist} />
              ))}
            </div>
          ) :  (
            <p className="text-center text-gray-500 py-6">No profiles found matching your criteria. Try broadening your search.</p>
          )}
        </div>
      )}

      {isProfileModalOpen && selectedProfile && (
        <ProfileViewModal 
          profile={selectedProfile} 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
          userFeatures={userFeatures} 
          onUpgradeClick={onUpgradeClick} 
          onSendInterest={handleSendInterest} 
          onShortlist={handleShortlist} 
        />
      )}
    </div>
  );
};

export default SearchMatchesView;