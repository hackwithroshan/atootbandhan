
import React, { useState, FormEvent } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { Cog6ToothIcon } from '../../icons/Cog6ToothIcon';
import { LockClosedIcon } from '../../icons/LockClosedIcon';
import { EyeIcon } from '../../icons/EyeIcon';
import { BellIcon } from '../../icons/BellIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { PhotoVisibility, PrivacySettings, NotificationPreferences, DeleteAccountReason } from '../../../types';
import { PHOTO_VISIBILITY_OPTIONS, NOTIFICATION_TYPE_LABELS, DELETE_ACCOUNT_REASON_OPTIONS } from '../../../constants';

type SettingsTabKey = 'login' | 'privacy' | 'notifications' | 'deleteAccount';

const AccountSettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTabKey>('login');

  // Login & Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    photoVisibility: PhotoVisibility.MATCHES_ONLY,
    blockedUserIds: ['USR008', 'USR015'], // Mock blocked users
  });

  // Notification Preferences State
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    newInterestEmail: true, newInterestPush: true, newInterestSms: true,
    newMatchEmail: true, newMatchPush: true, newMatchSms: false,
    newMessageEmail: true, newMessagePush: true, newMessageSms: false,
    profileViewEmail: false, profileViewPush: true,
    membershipExpiryEmail: true, membershipExpiryPush: true, membershipExpirySms: true,
    promotionalOffersEmail: true, promotionalOffersPush: false, promotionalOffersSms: false,
    adminAnnouncementsPush: true, adminAnnouncementsEmail: true,
    // New preferences (default to false or as desired)
    dailyHoroscopeEmail: false, dailyHoroscopePush: false,
    supportTicketEmail: true, supportTicketPush: true,
    monthlySummaryEmail: true,
    dailyMatchDigestEmail: true, dailyMatchDigestPush: true
  });

  // Delete Account State
  const [deleteReason, setDeleteReason] = useState<DeleteAccountReason | ''>('');
  const [deleteFeedback, setDeleteFeedback] = useState('');


  const handlePasswordChange = (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }
    console.log('Changing password (mock):', { currentPassword, newPassword });
    alert('Password changed successfully! (Mock)');
    setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
  };

  const handlePrivacyChange = (field: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [field]: value }));
    // console.log(`Privacy setting ${field} changed to ${value}`);
  };
  
  const handleSavePrivacy = () => {
    console.log('Saving privacy settings (mock):', privacySettings);
    alert('Privacy settings saved! (Mock)');
  };

  const handleUnblockUser = (userId: string) => {
    setPrivacySettings(prev => ({
        ...prev,
        blockedUserIds: prev.blockedUserIds?.filter(id => id !== userId)
    }));
    alert(`User ${userId} unblocked. (Mock)`);
  };

  const handleNotificationPrefChange = (key: keyof NotificationPreferences) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotificationPrefs = () => {
    console.log('Saving notification preferences (mock):', notificationPrefs);
    alert('Notification preferences saved! (Mock)');
  };
  
  const handleDeleteAccount = (e: FormEvent) => {
    e.preventDefault();
    if (!deleteReason) {
        alert("Please select a reason for deleting your account.");
        return;
    }
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account (mock):', { reason: deleteReason, feedback: deleteFeedback });
      alert('Account deletion process initiated. You will be logged out. (Mock)');
      // Here, you would call an onLogout prop or similar.
    }
  };
  

  const renderTabContent = () => {
    switch (activeTab) {
      case 'login':
        return (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Change Password</h3>
            <Input type="password" id="currentPassword" name="currentPassword" label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <Input type="password" id="newPassword" name="newPassword" label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <Input type="password" id="confirmNewPassword" name="confirmNewPassword" label="Confirm New Password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
            <Button type="submit" variant="primary" className="!bg-rose-500 hover:!bg-rose-600">Change Password</Button>
            <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-medium text-gray-700">Account Security</h3>
                <p className="text-sm text-gray-500 mb-2">Last login: 2 days ago from Mumbai, India (Mock)</p>
                <Button variant="secondary" onClick={() => alert('Logged out from all other devices (mock).')}>Logout from All Other Devices</Button>
            </div>
          </form>
        );
      case 'privacy':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Privacy Settings</h3>
            <Select id="photoVisibility" name="photoVisibility" label="Who can view my photos?" options={PHOTO_VISIBILITY_OPTIONS} value={privacySettings.photoVisibility} onChange={(e) => handlePrivacyChange('photoVisibility', e.target.value as PhotoVisibility)} />
             <div className="mt-4">
                <h4 className="text-md font-medium text-gray-700">Blocked Users</h4>
                {privacySettings.blockedUserIds && privacySettings.blockedUserIds.length > 0 ? (
                    <ul className="space-y-1 text-sm mt-1">
                        {privacySettings.blockedUserIds.map(id => (
                            <li key={id} className="flex justify-between items-center p-1.5 bg-gray-100 rounded">
                                <span>{id} (Mock Name)</span>
                                <Button variant="danger" size="sm" onClick={() => handleUnblockUser(id)} className="!text-xs !py-0.5">Unblock</Button>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-xs text-gray-500">No users blocked.</p>}
            </div>
            <Button onClick={handleSavePrivacy} variant="primary" className="!bg-rose-500 hover:!bg-rose-600">Save Privacy Settings</Button>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Notification Preferences</h3>
            <p className="text-sm text-gray-500">Choose how you want to be notified.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {NOTIFICATION_TYPE_LABELS.map(pref => (
                    <div key={pref.key} className="flex items-center p-2 bg-gray-50 rounded-md">
                        <input type="checkbox" id={pref.key} name={pref.key} checked={!!notificationPrefs[pref.key as keyof NotificationPreferences]} onChange={() => handleNotificationPrefChange(pref.key as keyof NotificationPreferences)} className="h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"/>
                        <label htmlFor={pref.key} className="ml-2 text-sm text-gray-700">{pref.label}</label>
                    </div>
                ))}
            </div>
            <Button onClick={handleSaveNotificationPrefs} variant="primary" className="!bg-rose-500 hover:!bg-rose-600">Save Notification Settings</Button>
          </div>
        );
      case 'deleteAccount':
        return (
          <form onSubmit={handleDeleteAccount} className="space-y-4">
            <h3 className="text-lg font-medium text-red-600">Delete Account</h3>
            <p className="text-sm text-gray-600">We're sorry to see you go. Please note that deleting your account is permanent and cannot be undone.</p>
            <Select id="deleteReason" name="deleteReason" label="Reason for Deletion" options={DELETE_ACCOUNT_REASON_OPTIONS} value={deleteReason} onChange={(e) => setDeleteReason(e.target.value as DeleteAccountReason)} required/>
            <div>
              <label htmlFor="deleteFeedback" className="block text-xs font-medium text-gray-600 mb-0.5">Feedback (Optional)</label>
              <textarea id="deleteFeedback" name="deleteFeedback" value={deleteFeedback} onChange={(e) => setDeleteFeedback(e.target.value)} rows={3} className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 text-sm custom-scrollbar" placeholder="Help us improve..."></textarea>
            </div>
            <Button type="submit" variant="danger" className="w-full">Permanently Delete My Account</Button>
          </form>
        );
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tabKey: SettingsTabKey; label: string; icon: React.ReactNode }> = ({ tabKey, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`flex items-center space-x-2 px-3 py-2.5 text-sm font-medium rounded-md transition-colors
        ${activeTab === tabKey ? 'bg-rose-500 text-white shadow-md' : 'text-gray-600 hover:bg-rose-100 hover:text-rose-600'}`}
      role="tab"
      aria-selected={activeTab === tabKey}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Cog6ToothIcon className="w-8 h-8 text-rose-500" />
        <h2 className="text-2xl font-semibold text-gray-800">Account & Settings</h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs Navigation */}
        <div className="md:w-1/4 space-y-2" role="tablist" aria-orientation="vertical">
          <TabButton tabKey="login" label="Login & Password" icon={<LockClosedIcon className="w-5 h-5" />} />
          <TabButton tabKey="privacy" label="Privacy Settings" icon={<EyeIcon className="w-5 h-5" />} />
          <TabButton tabKey="notifications" label="Notifications" icon={<BellIcon className="w-5 h-5" />} />
          <TabButton tabKey="deleteAccount" label="Delete Account" icon={<TrashIcon className="w-5 h-5" />} />
        </div>

        {/* Tab Content */}
        <div className="md:w-3/4 bg-white p-6 rounded-lg shadow-md" role="tabpanel">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsView;
