import React, { useState } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { SearchIcon } from '../../icons/SearchIcon';
import { UserIcon } from '../../icons/UserIcon';
import { FunnelIcon } from '../../icons/FunnelIcon'; 
import { UserFeatures, MembershipTier, MatchProfile } from '../../../types'; 
import UpgradePrompt from '../../common/UpgradePrompt'; 
import { API_URL } from '../../../utils/config';

const religionOptions = [{value: '', label: 'Any'}, { value: 'hindu', label: 'Hindu' }, { value: 'muslim', label: 'Muslim' }];
const educationOptions = [{value: '', label: 'Any'},{ value: 'masters', label: "Master's" }, { value: 'bachelors', label: "Bachelor's" }];
const professionOptions = [{value: '', label: 'Any'},{ value: 'engineer', label: 'Engineer' }, { value: 'doctor', label: 'Doctor' }];

const SearchResultCard: React.FC<MatchProfile> = ({ id, name, age, location, profession, photoUrl }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row items-center p-4 space-x-4">
    <img src={photoUrl || 'https://via.placeholder.com/80/CCCCCC/FFFFFF?Text=?'} alt={name} className="w-24 h-24 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0" />
    <div className="flex-grow text-center sm:text-left mt-3 sm:mt-0">
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-sm text-gray-600">{age} yrs, {location}</p>
      <p className="text-sm text-gray-500 truncate">{profession}</p>
    </div>
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-3 sm:mt-0">
      <Button variant="primary" size="sm" className="!text-xs !py-1.5 !bg-rose-500 hover:!bg-rose-600" onClick={() => console.log(`View profile of ${name}`)}>View Profile</Button>
      <Button variant="secondary" size="sm" className="!text-xs !py-1.5" onClick={() => console.log(`Interest in ${name}`)}>Send Interest</Button>
    </div>
  </div>
);

interface SearchMatchesViewProps {
  userFeatures: UserFeatures;
  onUpgradeClick: () => void;
}

const SearchMatchesView: React.FC<SearchMatchesViewProps> = ({ userFeatures, onUpgradeClick }) => {
  const [searchParams, setSearchParams] = useState({
    keyword: '', // Basic search term
    ageMin: '', ageMax: '', heightMin: '', heightMax: '', religion: '', caste: '',
    education: '', profession: '', city: '', state: '', country: '', horoscopeMatch: false
  });
  const [results, setResults] = useState<MatchProfile[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching with params:", searchParams);
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/users/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify(searchParams),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch search results.');
      }

      const data = await res.json();
      // Format data to MatchProfile if needed
      setResults(data.map((user: any) => ({ ...user, id: user._id, name: user.fullName, age: user.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : 0, location: user.city, profession: user.occupation, photoUrl: user.profilePhotoUrl, matchPercentage: 0 })));
    } catch (err: any) {
      setError(err.message);
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
        
        <h3 className="text-lg font-semibold text-gray-700 pt-3 border-t mt-4">Advanced Filters</h3>
        
        {!canUseAdvancedFilters && (
             <UpgradePrompt 
                featureName="Advanced Search Filters" 
                requiredTier={MembershipTier.GOLD} 
                onUpgradeClick={onUpgradeClick} 
                layout="banner"
                className="my-2"
            />
        )}

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${!canUseAdvancedFilters ? 'opacity-50 pointer-events-none' : ''}`}>
          <Input id="ageMin" name="ageMin" type="number" label="Min Age" value={searchParams.ageMin} onChange={handleChange} placeholder="e.g., 25" disabled={!canUseAdvancedFilters} />
          <Input id="ageMax" name="ageMax" type="number" label="Max Age" value={searchParams.ageMax} onChange={handleChange} placeholder="e.g., 35" disabled={!canUseAdvancedFilters} />
          <Input id="heightMin" name="heightMin" type="text" label="Min Height (e.g. 5'2&quot;)" value={searchParams.heightMin} onChange={handleChange} placeholder="e.g., 5 ft 2 in" disabled={!canUseAdvancedFilters} />
          <Input id="heightMax" name="heightMax" type="text" label="Max Height (e.g. 6'0&quot;)" value={searchParams.heightMax} onChange={handleChange} placeholder="e.g., 6 ft 0 in" disabled={!canUseAdvancedFilters} />
          <Select id="religion" name="religion" label="Religion" options={religionOptions} value={searchParams.religion} onChange={handleChange} disabled={!canUseAdvancedFilters} />
          <Input id="caste" name="caste" type="text" label="Caste" value={searchParams.caste} onChange={handleChange} placeholder="Enter caste" disabled={!canUseAdvancedFilters} />
          <Select id="education" name="education" label="Education" options={educationOptions} value={searchParams.education} onChange={handleChange} disabled={!canUseAdvancedFilters} />
          <Select id="profession" name="profession" label="Profession" options={professionOptions} value={searchParams.profession} onChange={handleChange} disabled={!canUseAdvancedFilters} />
          <Input id="city" name="city" type="text" label="City" value={searchParams.city} onChange={handleChange} placeholder="Enter city" disabled={!canUseAdvancedFilters} />
          <Input id="state" name="state" type="text" label="State" value={searchParams.state} onChange={handleChange} placeholder="Enter state" disabled={!canUseAdvancedFilters} />
          <Input id="country" name="country" type="text" label="Country" value={searchParams.country} onChange={handleChange} placeholder="Enter country" disabled={!canUseAdvancedFilters} />
          <div className="flex items-center pt-5">
            <input type="checkbox" id="horoscopeMatch" name="horoscopeMatch" checked={searchParams.horoscopeMatch} onChange={handleChange} className="h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500" disabled={!canUseAdvancedFilters} />
            <label htmlFor="horoscopeMatch" className="ml-2 text-sm text-gray-700">Horoscope Match Required (Optional)</label>
          </div>
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
                <SearchResultCard key={profile.id} {...profile} />
              ))}
            </div>
          ) :  (
            <p className="text-center text-gray-500 py-6">No profiles found matching your criteria. Try broadening your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchMatchesView;