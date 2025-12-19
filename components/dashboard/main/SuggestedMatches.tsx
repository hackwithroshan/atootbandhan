
import React from 'react';
import { MatchProfile } from '../../../types';
import Button from '../../ui/Button';

interface SuggestedMatchesProps {
  matches: MatchProfile[];
}

const SuggestedMatches: React.FC<SuggestedMatchesProps> = ({ matches }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Suggested Matches for You</h2>
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {matches.map(profile => (
            <div key={profile.id} className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <img src={profile.photoUrl || 'https://via.placeholder.com/150'} alt={profile.name} className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"/>
              <h3 className="font-semibold text-gray-800">{profile.name}</h3>
              <p className="text-xs text-gray-500">{profile.age} yrs, {profile.location}</p>
              <div className="mt-3 flex justify-around">
                  <Button size="sm" variant="secondary" className="!text-xs">View Profile</Button>
                  <Button size="sm" variant="primary" className="!text-xs !bg-rose-500">Interest</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-4 text-center">No suggested matches available right now. Check back later!</p>
      )}
    </div>
  );
};

export default SuggestedMatches;