import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button';
import { UserIcon } from '../../icons/UserIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { StarIcon } from '../../icons/StarIcon';
import { UserFeatures, MatchProfile } from '../../../types'; 
import { API_URL } from '../../../utils/config';

const ShortlistedProfileCard: React.FC<MatchProfile & { onRemove: (profileId: string) => void }> = ({ id, name, age, location, profession, photoUrl, onRemove }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-4 space-y-3 sm:space-y-0">
    <img src={photoUrl || 'https://via.placeholder.com/80/CCCCCC/FFFFFF?Text=?'} alt={name} className="w-16 h-16 rounded-full object-cover self-center sm:self-start" />
    <div className="flex-grow">
      <h4 className="font-semibold text-gray-800">{name} <span className="text-sm text-gray-500">({age}, {location})</span></h4>
      <p className="text-sm text-gray-600 truncate">{profession}</p>
    </div>
    <div className="flex space-x-2 self-end sm:self-center">
      <Button variant="primary" size="sm" className="!text-xs !py-1 !px-2 !bg-rose-500 hover:!bg-rose-600" onClick={() => alert(`View profile of ${name} (mock)`)}>
        <UserIcon className="w-4 h-4 mr-1" /> Profile
      </Button>
      <Button variant="danger" size="sm" className="!text-xs !py-1 !px-2" onClick={() => onRemove(id)}>
        <TrashIcon className="w-4 h-4 mr-1" /> Remove
      </Button>
    </div>
  </div>
);

interface ShortlistedProfilesViewProps {
  userFeatures: UserFeatures;
  onUpgradeClick: () => void;
}

const ShortlistedProfilesView: React.FC<ShortlistedProfilesViewProps> = ({ userFeatures, onUpgradeClick }) => {
  const [shortlisted, setShortlisted] = useState<MatchProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShortlisted = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication error.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/users/shortlisted`, {
          headers: { 'x-auth-token': token },
        });
        if (!res.ok) throw new Error('Failed to fetch shortlisted profiles.');
        
        const data = await res.json();
        const formattedData = data.map((user: any) => ({
            id: user._id,
            name: user.fullName,
            age: user.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : 0,
            location: user.city || 'N/A',
            profession: user.occupation || 'N/A',
            photoUrl: user.profilePhotoUrl,
            matchPercentage: 0, // Not available in this route, default to 0
        }));
        setShortlisted(formattedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShortlisted();
  }, []);

  const handleRemove = async (profileId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Authentication error.");
        return;
    }

    if (window.confirm('Are you sure you want to remove this profile from your shortlist?')) {
        try {
            const res = await fetch(`${API_URL}/api/users/shortlist/${profileId}`, {
                method: 'PUT',
                headers: { 'x-auth-token': token },
            });

            if (!res.ok) throw new Error('Failed to remove from shortlist.');

            setShortlisted(prev => prev.filter(p => p.id !== profileId));
            alert('Profile removed from shortlist.');
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
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
            <ShortlistedProfileCard key={profile.id} {...profile} onRemove={handleRemove} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <StarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">You haven't shortlisted any profiles yet.</p>
            <p className="text-xs text-gray-400 mt-1">Start browsing matches and shortlist profiles you like!</p>
        </div>
      )}
    </div>
  );
};

export default ShortlistedProfilesView;