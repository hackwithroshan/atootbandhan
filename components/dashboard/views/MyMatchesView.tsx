import React, { useState, useEffect, useMemo } from 'react';
import Button from '../../ui/Button';
import Select from '../../ui/Select';
import { UserIcon } from '../../icons/UserIcon';
import { UserPlusIcon } from '../../icons/UserPlusIcon';
import { BookmarkIcon } from '../../icons/BookmarkIcon';
import ProfileViewModal from '../matches/ProfileViewModal';
import { Gender, MembershipTier, UserFeatures, MatchProfile } from '../../../types';
import { MembershipBadge } from '../../common/MembershipBadge';
import UpgradePrompt from '../../common/UpgradePrompt';
import { API_URL } from '../../../utils/config';
import { NEW_FEMALE_PROFILE_IMAGE_URL, NEW_MALE_PROFILE_IMAGE_URL } from '../../../constants';

const filterOptions = {
  age: [{value: '', label: 'Any Age'}, { value: '25-30', label: '25-30' }, { value: '30-35', label: '30-35' }],
  location: [{value: '', label: 'Any Location'}, { value: 'bangalore', label: 'Bangalore' }, { value: 'pune', label: 'Pune' }],
  religion: [{value: '', label: 'Any Religion'}, { value: 'hindu', label: 'Hindu' }, { value: 'muslim', label: 'Muslim' }, { value: 'sikh', label: 'Sikh'}],
};

const MatchCard: React.FC<MatchProfile & { onViewProfile: (profile: MatchProfile) => void; canViewFull: boolean; onUpgrade: () => void; onSendInterest: (profileId: string) => void; onShortlist: (profileId: string) => void; }> = ({ 
  id, name, age, location, profession, photoUrl, matchPercentage, religion, caste, education, gender, membershipTier, onViewProfile, canViewFull, onUpgrade, onSendInterest, onShortlist, ...profileData 
}) => {
  const displayPhotoUrl = photoUrl || (gender === Gender.FEMALE ? NEW_FEMALE_PROFILE_IMAGE_URL : NEW_MALE_PROFILE_IMAGE_URL);
  
  const handleViewProfileClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if(canViewFull) {
          onViewProfile({id, name, age, location, profession, photoUrl, matchPercentage, religion, caste, education, gender, membershipTier, ...profileData } as MatchProfile);
      } else {
          onUpgrade();
      }
  };

  return (
    <div 
      className="relative rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300 h-[480px]"
      onClick={handleViewProfileClick}
    >
      <img src={displayPhotoUrl} alt={name} className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${!canViewFull ? 'blur-sm' : ''}`} />
      {!canViewFull && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Button variant="primary" onClick={(e) => {e.stopPropagation(); onUpgrade();}} className="opacity-90">Upgrade to View</Button>
        </div>
      )}
      
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
        <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
            {matchPercentage}% Match
        </div>
        <div>
          <h3 className="text-xl font-semibold leading-tight flex items-center">{name}<MembershipBadge tier={membershipTier} size="sm" className="ml-1.5" /></h3>
          <p className="text-sm">{age} yrs, {location}</p>
          <p className="text-xs text-gray-300 truncate mt-0.5">{education} &bull; {profession}</p>
          <p className="text-xs text-gray-300 truncate">{religion}{caste ? `, ${caste}` : ''}</p>
          
          <div className="mt-3 flex items-center space-x-2">
            <Button variant="primary" size="sm" className="flex-1 !text-xs !py-2 !bg-rose-500/80 group-hover:!bg-rose-500 !backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onSendInterest(id); }}>
              <UserPlusIcon className="w-4 h-4 mr-1" /> Interest
            </Button>
            <Button variant="secondary" size="sm" className="flex-1 !text-xs !py-2 !bg-white/20 group-hover:!bg-white/30 !backdrop-blur-sm" onClick={handleViewProfileClick}>
              <UserIcon className="w-4 h-4 mr-1" /> View Profile
            </Button>
             <Button variant="secondary" size="sm" className="!p-2 !text-xs !bg-white/20 group-hover:!bg-white/30 !backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onShortlist(id); }}>
              <BookmarkIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard: React.FC = () => ( <div className="bg-gray-200 rounded-xl shadow-lg overflow-hidden animate-pulse h-[480px]"><div className="w-full h-full bg-gray-300"></div></div> );

const ITEMS_PER_PAGE = 8;

interface MyMatchesViewProps {
  loggedInUserGender: Gender;
  userFeatures: UserFeatures;
  onUpgradeClick: () => void;
}

const MyMatchesView: React.FC<MyMatchesViewProps> = ({ loggedInUserGender, userFeatures, onUpgradeClick }) => {
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ age: '', location: '', religion: '' });
  const [selectedProfile, setSelectedProfile] = useState<MatchProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMatches = async () => {
      // Fetching logic from previous step...
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/api/matches`, { headers: { 'x-auth-token': token || '' } });
        if (!res.ok) throw new Error('Failed to fetch matches.');
        const data = await res.json();
        const formattedData = data.map((user: any): MatchProfile => ({
            id: user._id, name: user.fullName, age: user.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : 0, location: user.city || 'N/A',
            profession: user.occupation || 'N/A', photoUrl: user.profilePhotoUrl, matchPercentage: user.matchPercentage || 0, religion: user.religion || 'N/A', caste: user.caste || 'N/A', education: user.education || 'N/A', gender: user.gender,
            membershipTier: user.membershipTier, bio: user.profileBio || 'No bio provided.', galleryImages: user.photos?.map((p: any) => p.url) || [], familyDetails: {}, preferencesBio: 'Not specified.', isContactVisible: false,
        }));
        setMatches(formattedData);
      } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
    };
    fetchMatches();
  }, []);

  const handleSendInterest = async (profileId: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/interests/${profileId}`, {
        method: 'POST',
        headers: { 'x-auth-token': token || '' },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Failed to send interest.');
      }
      alert('Interest sent successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleShortlist = async (profileId: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/users/shortlist/${profileId}`, {
        method: 'PUT',
        headers: { 'x-auth-token': token || '' },
      });
      if (!res.ok) throw new Error('Failed to update shortlist.');
      alert('Profile added to/removed from your shortlist!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleViewProfile = (profile: MatchProfile) => {
    if (!userFeatures.canViewFullProfiles) { onUpgradeClick(); return; }
    setSelectedProfile(profile);
    setIsProfileModalOpen(true);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1); 
  };
  
  const displayedMatches = useMemo(() => {
    let matchesToDisplay = matches.filter(match => {
        const ageMatch = !filters.age || (match.age >= parseInt(filters.age.split('-')[0]) && match.age <= parseInt(filters.age.split('-')[1]));
        const locationMatch = !filters.location || match.location.toLowerCase().includes(filters.location);
        const religionMatch = !filters.religion || match.religion.toLowerCase() === filters.religion;
        return ageMatch && locationMatch && religionMatch;
    });
    matchesToDisplay.sort((a, b) => b.matchPercentage - a.matchPercentage);
    return userFeatures.matchesPerDay !== 'unlimited' ? matchesToDisplay.slice(0, userFeatures.matchesPerDay) : matchesToDisplay;
  }, [matches, filters, userFeatures.matchesPerDay]);
  
  const totalPages = Math.ceil(displayedMatches.length / ITEMS_PER_PAGE);
  const currentDisplayMatches = displayedMatches.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const canViewMoreMatches = userFeatures.matchesPerDay !== 'unlimited' && matches.length > userFeatures.matchesPerDay;

  // The rest of the component's JSX remains largely the same
  if (isLoading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{[...Array(ITEMS_PER_PAGE)].map((_, i) => <SkeletonCard key={i} />)}</div>;
  if (error) return <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">My Matches for You ({displayedMatches.length})</h2>
      {/* Filters... */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-end">
            <Select id="filter-age-matches" name="age" label="Age" options={filterOptions.age} value={filters.age} onChange={handleFilterChange} />
            <Select id="filter-location-matches" name="location" label="Location" options={filterOptions.location} value={filters.location} onChange={handleFilterChange}/>
            <Select id="filter-religion-matches" name="religion" label="Religion" options={filterOptions.religion} value={filters.religion} onChange={handleFilterChange}/>
        </div>
      </div>
      {/* Match Cards... */}
      {currentDisplayMatches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentDisplayMatches.map(profile => (
            <MatchCard key={profile.id.toString()} {...profile} onViewProfile={handleViewProfile} canViewFull={userFeatures.canViewFullProfiles} onUpgrade={onUpgradeClick} onSendInterest={handleSendInterest} onShortlist={handleShortlist} />
          ))}
        </div>
      ) : <p className="text-center text-gray-500 py-10">No matches found with current filters.</p>}
      {/* Pagination... */}
      {totalPages > 1 && !canViewMoreMatches && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="secondary">Previous</Button>
          <span>Page {page} of {totalPages}</span>
          <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} variant="secondary">Next</Button>
        </div>
      )}
      {canViewMoreMatches && <UpgradePrompt featureName="seeing all your potential matches" onUpgradeClick={onUpgradeClick} layout="banner" className="mt-4"/>}
      {isProfileModalOpen && selectedProfile && (
        <ProfileViewModal profile={selectedProfile} isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userFeatures={userFeatures} onUpgradeClick={onUpgradeClick} onSendInterest={handleSendInterest} onShortlist={handleShortlist} />
      )}
    </div>
  );
};

export default MyMatchesView;