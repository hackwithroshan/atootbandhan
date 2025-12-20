import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button';
import { TrashIcon } from '../../icons/TrashIcon';
import { StarIcon } from '../../icons/StarIcon';
import { UserFeatures, MatchProfile } from '../../../types'; 
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';
import ProfileViewModal from '../matches/ProfileViewModal';

const ShortlistedProfileCard: React.FC<MatchProfile & { 
    onRemove: (profileId: string) => void,
    onViewProfile: (profile: MatchProfile) => void
}> = (props) => {
  const { id, name, age, location, profession, photoUrl, onRemove, onViewProfile } = props;
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-4 space-y-3 sm:space-y-0">
      <img src={photoUrl || 'https://via.placeholder.com/80/CCCCCC/FFFFFF?Text=?'} alt={name} className="w-16 h-16 rounded-full object-cover self-center sm:self-start" />
      <div className="flex-grow">
        <h4 className="font-semibold text-gray-800">{name} <span className="text-sm text-gray-500">({age} yrs, {location})</span></h4>
        <p className="text-sm text-gray-600 truncate">{profession}</p>
      </div>
      <div className="flex space-x-2 self-end sm:self-center">
        <Button variant="primary" size="sm" className="!text-xs !py-1 !px-2 !bg-rose-500 hover:!bg-rose-600" onClick={() => onViewProfile(props)}>
          View Profile
        </Button>
        <Button variant="danger" size="sm" className="!text-xs !py-1 !px-2" onClick={() => onRemove(id)}>
          <TrashIcon className="w-3 h-3 mr-1" /> Remove
        </Button>
      </div>
    </div>
  )
};

interface ShortlistedProfilesViewProps {
  userFeatures: UserFeatures;
  onUpgradeClick: () => void;
}

const ShortlistedProfilesView: React.FC<ShortlistedProfilesViewProps> = ({ userFeatures, onUpgradeClick }) => {
  const [shortlisted, setShortlisted] = useState<MatchProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  
  const [selectedProfile, setSelectedProfile] = useState<MatchProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchShortlisted = async () => {
      try {
        const data = await apiClient('/api/users/shortlisted');
        const formattedData = data.map((user: any): MatchProfile => ({
            id: user.id,
            name: user.fullName,
            age: user.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : 0,
            location: user.city || 'N/A',
            profession: user.occupation || 'N/A',
            photoUrl: user.profilePhotoUrl,
            matchPercentage: 0, 
        }));
        setShortlisted(formattedData);
      } catch (err: any) {
        setError(err.message);
        showToast(err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchShortlisted();
  }, [showToast]);

  const handleRemove = async (profileId: string) => {
    if (window.confirm('Are you sure you want to remove this profile from your shortlist?')) {
        try {
            await apiClient(`/api/users/shortlist/${profileId}`, { method: 'PUT' });
            setShortlisted(prev => prev.filter(p => p.id !== profileId));
            showToast('Profile removed from shortlist.', 'success');
        } catch (err: any) {
            showToast(err.message, 'error');
        }
    }
  };
  
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
        <StarIcon className="w-6 h-6 mr-2 text-yellow-500" />
        Shortlisted Profiles
      </h2>
      
      {isLoading ? (
        <p className="text-center text-gray-500">Loading your shortlisted profiles...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : shortlisted.length > 0 ? (
        <div className="space-y-4">
          {shortlisted.map(profile => (
            <ShortlistedProfileCard key={profile.id} {...profile} onRemove={handleRemove} onViewProfile={handleViewProfile} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <StarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">You haven't shortlisted any profiles yet.</p>
            <p className="text-xs text-gray-400 mt-1">Start browsing matches and shortlist profiles you like!</p>
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
          onShortlist={handleRemove} // "Shortlist" button in modal should remove from this view
        />
      )}
    </div>
  );
};

export default ShortlistedProfilesView;