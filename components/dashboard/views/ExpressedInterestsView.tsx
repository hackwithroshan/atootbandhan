import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Button from '../../ui/Button';
import Select from '../../ui/Select';
import { UserIcon } from '../../icons/UserIcon';
import { ArrowUpRightIcon } from '../../icons/ArrowUpRightIcon';
import { ArrowDownLeftIcon } from '../../icons/ArrowDownLeftIcon';
import { CheckIcon } from '../../icons/CheckIcon';
import { XMarkIcon } from '../../icons/XMarkIcon';
import { PaperAirplaneIcon } from '../../icons/PaperAirplaneIcon';
import { RefreshIcon } from '../../icons/RefreshIcon'; 
import { StarIcon } from '../../icons/StarIcon';
import ProfileViewModal from '../matches/ProfileViewModal';
import { Interest, InterestStatus, InterestUser, UserFeatures, MatchProfile } from '../../../types'; 
import { MembershipBadge } from '../../common/MembershipBadge';
import UpgradePrompt from '../../common/UpgradePrompt'; 
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';

const ITEMS_PER_PAGE = 5;

interface InterestCardProps {
    interest: any; // Using any for populated user data
    type: 'sent' | 'received';
    onAction: (action: 'accept' | 'decline' | 'withdraw' | 'viewProfile' | 'message', interestId: string, userProfile: InterestUser) => void;
    userFeatures: UserFeatures; 
    onUpgradeClick: () => void; 
}

const InterestCard: React.FC<InterestCardProps> = ({ interest, type, onAction, userFeatures, onUpgradeClick }) => {
  const user = type === 'sent' ? interest.toUser : interest.fromUser;
  if (!user) return null; // Don't render if user data is missing

  const getStatusClass = (status: InterestStatus) => {
    if (status === InterestStatus.ACCEPTED || status === InterestStatus.MUTUAL) return 'bg-green-100 text-green-700';
    if (status === InterestStatus.DECLINED || status === InterestStatus.WITHDRAWN) return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700'; // Pending
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
      <img src={user.profilePhotoUrl || 'https://via.placeholder.com/80/CCCCCC/FFFFFF?Text=?'} alt={user.fullName} className="w-16 h-16 rounded-full object-cover" />
      <div className="flex-grow min-w-0">
        <h4 className="font-semibold text-gray-800 flex items-center">{user.fullName}<MembershipBadge tier={user.membershipTier} size="sm" className="ml-1.5" /></h4>
        <p className="text-xs text-gray-500 truncate">{user.occupation || 'N/A'} at {user.city || 'N/A'}</p>
        <p className="text-xs text-gray-500">Date: {new Date(interest.createdAt).toLocaleDateString()}</p>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${getStatusClass(interest.status)}`}>{interest.status}</span>
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Button variant="secondary" size="sm" className="!text-xs" onClick={() => onAction('viewProfile', interest.id, user)}>Profile</Button>
        {type === 'received' && interest.status === InterestStatus.PENDING && (
          <>
            <Button variant="primary" size="sm" className="!text-xs !bg-green-500" onClick={() => onAction('accept', interest.id, user)}>Accept</Button>
            <Button variant="danger" size="sm" className="!text-xs" onClick={() => onAction('decline', interest.id, user)}>Decline</Button>
          </>
        )}
        {interest.status === InterestStatus.ACCEPTED || interest.status === InterestStatus.MUTUAL && (
          <Button variant="primary" size="sm" className="!text-xs !bg-rose-500" onClick={() => onAction('message', interest.id, user)} disabled={!userFeatures.canChat}>Message</Button>
        )}
        {type === 'sent' && interest.status === InterestStatus.PENDING && (
          <Button variant="secondary" size="sm" className="!text-xs" onClick={() => onAction('withdraw', interest.id, user)}>Withdraw</Button>
        )}
      </div>
    </div>
  );
};

interface ExpressedInterestsViewProps {
  userFeatures: UserFeatures;
  onUpgradeClick: () => void;
  currentUserId: string;
}

const ExpressedInterestsView: React.FC<ExpressedInterestsViewProps> = ({ userFeatures, onUpgradeClick, currentUserId }) => {
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
  const [sentInterests, setSentInterests] = useState<any[]>([]);
  const [receivedInterests, setReceivedInterests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<InterestStatus | ''>('');
  const [page, setPage] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState<MatchProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { showToast } = useToast();

  const fetchInterests = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sentData, receivedData] = await Promise.all([
        apiClient('/api/interests/sent'),
        apiClient('/api/interests/received'),
      ]);
      setSentInterests(sentData);
      setReceivedInterests(receivedData);
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);

  const handleAction = async (action: 'accept' | 'decline' | 'withdraw' | 'viewProfile' | 'message', interestId: string, userProfile: InterestUser) => {
    if (action === 'viewProfile') {
        const profileForModal: MatchProfile = { ...userProfile, id: userProfile.id || interestId, matchPercentage: 0, name: userProfile.name || 'Unknown', age: userProfile.age || 0, photoUrl: userProfile.photoUrl || null, location: userProfile.location || '' };
        setSelectedProfile(profileForModal);
        setIsProfileModalOpen(true);
        return;
    }
     if (action === 'message') {
        showToast(`Navigating to messages with ${userProfile.name}. (This needs full router implementation)`, 'info');
        return;
    }
    
    const newStatus = action === 'accept' ? InterestStatus.ACCEPTED : action === 'decline' ? InterestStatus.DECLINED : InterestStatus.WITHDRAWN;
    
    try {
        await apiClient(`/api/interests/${interestId}`, {
            method: 'PUT',
            body: { status: newStatus },
        });
        await fetchInterests(); // Re-fetch all interests to update UI
        showToast(`Interest ${action}ed successfully.`, 'success');
    } catch (err: any) {
        showToast(err.message, 'error');
    }
  };

  const interestsToDisplay = activeTab === 'sent' ? sentInterests : receivedInterests;
  const filteredInterests = useMemo(() => filterStatus ? interestsToDisplay.filter(i => i.status === filterStatus) : interestsToDisplay, [interestsToDisplay, filterStatus]);
  const totalPages = Math.ceil(filteredInterests.length / ITEMS_PER_PAGE);
  const currentDisplayData = filteredInterests.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const statusFilterOptions = [{value: '', label: 'All Statuses'}, ...Object.values(InterestStatus).map(s => ({value: s, label: s}))];

  if(isLoading) return <p>Loading interests...</p>;
  if(error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center"><StarIcon className="w-6 h-6 mr-2 text-rose-500" />Expressed Interests</h2>
      <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
        <div className="flex space-x-1 border rounded-lg p-0.5 bg-gray-50">
          <Button variant={activeTab === 'received' ? 'primary' : 'secondary'} size="sm" onClick={() => setActiveTab('received')}><ArrowDownLeftIcon className="w-4 h-4 mr-1"/> Received</Button>
          <Button variant={activeTab === 'sent' ? 'primary' : 'secondary'} size="sm" onClick={() => setActiveTab('sent')}><ArrowUpRightIcon className="w-4 h-4 mr-1"/> Sent</Button>
        </div>
        <Select id="interest-status-filter" label="Filter by Status" options={statusFilterOptions} value={filterStatus} onChange={e => setFilterStatus(e.target.value as InterestStatus | '')} className="w-48 [&_label]:sr-only" />
      </div>
      {currentDisplayData.length > 0 ? (
        <div className="space-y-4">
          {currentDisplayData.map(interest => (
            <InterestCard key={interest.id} interest={interest} type={activeTab} onAction={handleAction} userFeatures={userFeatures} onUpgradeClick={onUpgradeClick}/>
          ))}
        </div>
      ) : <p className="text-center text-gray-500 py-10">No interests to display in this category.</p>}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="secondary">Previous</Button>
          <span>Page {page} of {totalPages}</span>
          <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} variant="secondary">Next</Button>
        </div>
      )}
      {isProfileModalOpen && selectedProfile && (
        <ProfileViewModal profile={selectedProfile} isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userFeatures={userFeatures} onUpgradeClick={onUpgradeClick} onSendInterest={() => {}} onShortlist={() => {}} />
      )}
    </div>
  );
};

export default ExpressedInterestsView;