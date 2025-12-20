import React, { useState } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { GiftIcon } from '../../icons/GiftIcon';
import { ShareIcon } from '../../icons/ShareIcon';
import { MailIcon } from '../../icons/MailIcon';
import { useToast } from '../../../hooks/useToast';

interface ReferralProgramWidgetProps {
  userId: string;
}

const ReferralProgramWidget: React.FC<ReferralProgramWidgetProps> = ({ userId }) => {
  const [friendEmail, setFriendEmail] = useState('');
  const referralCode = `ATUT${userId.substring(userId.length - 6).toUpperCase()}`;
  const bonusEarned = 0; // Backend for this is not implemented yet.
  const { showToast } = useToast();

  const handleSendInvite = () => {
    if (!friendEmail) {
      showToast('Please enter your friend\'s email.', 'error');
      return;
    }
    showToast(`Invite sent to ${friendEmail}! (Feature coming soon)`, 'success');
    setFriendEmail('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <GiftIcon className="w-6 h-6 text-rose-500 mr-2" />
        Invite Friends, Earn Rewards!
      </h2>
      <p className="text-sm text-gray-600 mb-3">
        Share your unique referral code with friends. When they join and complete their profile, you earn rewards!
      </p>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Your Referral Code:</p>
        <div className="bg-rose-50 text-rose-700 font-mono text-lg p-3 rounded-md text-center tracking-wider">
          {referralCode}
        </div>
      </div>

      <div className="mb-4">
        <Input
          id="friendEmail"
          name="friendEmail"
          type="email"
          label="Friend's Email Address"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          placeholder="Enter friend's email"
          icon={<MailIcon className="w-5 h-5 text-gray-400" />}
        />
      </div>
      
      <Button 
        variant="primary" 
        onClick={handleSendInvite} 
        className="w-full !bg-rose-500 hover:!bg-rose-600"
        disabled={!friendEmail}
      >
        <ShareIcon className="w-5 h-5 mr-2" />
        Send Invite
      </Button>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Bonus Earned: <span className="font-semibold text-green-600">₹{bonusEarned}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Referral history and rewards are coming soon.
        </p>
      </div>
    </div>
  );
};

export default ReferralProgramWidget;