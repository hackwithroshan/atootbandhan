import React, { useState, FormEvent, useEffect, useCallback } from 'react';
import { MegaphoneIcon } from '../../icons/MegaphoneIcon';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { useToast } from '../../../hooks/useToast';
import apiClient from '../../../utils/apiClient';
import { NotificationCampaignLog, AutomatedReminderRule, AnnouncementBanner } from '../../../types';

const NotificationToolView: React.FC = () => {
  const { showToast } = useToast();
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState({
    location: '', gender: '', caste: '', membership: '',
  });
  const [campaignScheduledTime, setCampaignScheduledTime] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [notificationChannel, setNotificationChannel] = useState<'Email' | 'SMS' | 'Both'>('Both');

  const [reminderRule, setReminderRule] = useState('');
  const [reminderDelay, setReminderDelay] = useState('2');

  const [bannerText, setBannerText] = useState('');
  const [bannerExpiry, setBannerExpiry] = useState('');
  
  const [activeBanners, setActiveBanners] = useState<AnnouncementBanner[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<NotificationCampaignLog[]>([]);
  const [activeReminders, setActiveReminders] = useState<AutomatedReminderRule[]>([]);
  
  const [isLoading, setIsLoading] = useState({ logs: true, banners: true, reminders: true });

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, logs: true }));
    try {
      const data = await apiClient('/api/admin/campaigns');
      setNotificationLogs(data);
    } catch (err: any) { showToast(err.message, 'error'); } 
    finally { setIsLoading(prev => ({ ...prev, logs: false })); }
  }, [showToast]);

  const fetchBanners = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, banners: true }));
    try {
      const data = await apiClient('/api/admin/banners');
      setActiveBanners(data);
    } catch (err: any) { showToast(err.message, 'error'); }
     finally { setIsLoading(prev => ({ ...prev, banners: false })); }
  }, [showToast]);

  const fetchReminders = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, reminders: true }));
    try {
      const data = await apiClient('/api/admin/reminders');
      setActiveReminders(data);
    } catch (err: any) { showToast(err.message, 'error'); }
     finally { setIsLoading(prev => ({ ...prev, reminders: false })); }
  }, [showToast]);

  useEffect(() => {
    fetchCampaigns();
    fetchBanners();
    fetchReminders();
  }, [fetchCampaigns, fetchBanners, fetchReminders]);


  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const payload = {
            campaignTitle: campaignSubject,
            channel: notificationChannel,
            messageContent: campaignMessage,
            targetAudience: targetAudience,
            status: campaignScheduledTime ? 'Scheduled' : 'Sent',
            scheduledTime: campaignScheduledTime || null,
        };
        await apiClient('/api/admin/campaigns', { method: 'POST', body: payload });
        showToast(`Campaign "${campaignSubject}" ${campaignScheduledTime ? 'scheduled' : 'sent'} successfully!`, 'success');
        await fetchCampaigns();
        setCampaignSubject('');
        setCampaignMessage('');
        setSelectedTemplate('');
    } catch (err: any) {
        showToast(err.message, 'error');
    }
  };

  const handleAudienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTargetAudience(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSaveReminder = async () => {
    if (!reminderRule || !reminderDelay) {
      showToast("Please select a reminder rule and set a delay.", 'error');
      return;
    }
    try {
        await apiClient('/api/admin/reminders', {
            method: 'POST',
            body: {
                rule: reminderRule,
                delayInDays: parseInt(reminderDelay, 10),
                messageTemplate: `${reminderRule}_template` // Placeholder for template name
            }
        });
        showToast(`Auto-reminder for "${reminderRule}" saved successfully.`, 'success');
        await fetchReminders();
    } catch (err: any) {
        showToast(err.message, 'error');
    }
  };

  const handleAddBanner = async () => {
      if(!bannerText) { showToast("Banner text cannot be empty.", 'error'); return; }
      try {
        await apiClient('/api/admin/banners', {
            method: 'POST',
            body: { text: bannerText, expiryDate: bannerExpiry || null }
        });
        showToast(`Banner "${bannerText}" added successfully.`, 'success');
        await fetchBanners();
        setBannerText(''); setBannerExpiry('');
      } catch (err: any) {
        showToast(err.message, 'error');
      }
  };

  const handleRemoveBanner = async (bannerId: string) => {
      if (window.confirm('Are you sure you want to remove this banner?')) {
        try {
            await apiClient(`/api/admin/banners/${bannerId}`, { method: 'DELETE' });
            showToast('Banner removed successfully.', 'info');
            await fetchBanners();
        } catch (err: any) {
            showToast(err.message, 'error');
        }
      }
  };

  const genderOptions = [{value: '', label: 'All Genders'}, {value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}];
  const membershipOptions = [{value: '', label: 'All Members'}, {value: 'Free', label: 'Free Tier'}, {value: 'Silver', label: 'Silver Tier'}, {value: 'Gold', label: 'Gold Tier'}];
  const casteOptions = [{value: '', label: 'All Castes'}, {value: 'Brahmin', label: 'Brahmin'}, {value: 'Kshatriya', label: 'Kshatriya'}, {value: 'Patel', label: 'Patel'}, {value: 'Other', label:'Other'}];
  const reminderRuleOptions = [ { value: '', label: 'Select Rule' }, { value: 'incomplete_profile', label: 'Profile Incomplete' }, { value: 'no_photo', label: 'No Photo Uploaded' }, { value: 'inactive_user_7_days', label: 'Inactive User (7 days)' } ];
  const messageTemplateOptions = [ {value: '', label: 'Use a Template (Optional)'}, {value: 'welcome_new_user', label: 'Welcome New User Template'}, {value: 'upgrade_offer_generic', label: 'Generic Upgrade Offer Template'} ];
  const channelOptions: {value: 'Email' | 'SMS' | 'Both', label: string}[] = [ {value: 'Both', label: 'Email & SMS'}, {value: 'Email', label: 'Email Only'}, {value: 'SMS', label: 'SMS Only'} ];

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <MegaphoneIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Notification Campaign Tool</h1>
      </div>
      <p className="text-gray-300">
        Create and send announcements, offers, or automated reminders to users. Manage message templates and frontend announcement banners.
      </p>

      <form onSubmit={handleSendNotification} className="bg-gray-700 p-6 rounded-lg shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-gray-100 mb-2">Create Notification Campaign</h2>
        <Input id="notificationSubject" name="campaignTitle" label="Subject / Title" value={campaignSubject} onChange={(e) => setCampaignSubject(e.target.value)} placeholder="e.g., Navratri Special Offers!" className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" required />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select id="messageTemplate" name="messageTemplate" label="Message Template (Optional)" options={messageTemplateOptions} value={selectedTemplate} onChange={(e) => {setSelectedTemplate(e.target.value); if(e.target.value) setCampaignMessage(`Template: ${e.target.options[e.target.selectedIndex].text} (Content would populate here based on selected template)`); else setCampaignMessage('');}} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
            <Select id="notificationChannel" name="channel" label="Channel" options={channelOptions} value={notificationChannel} onChange={(e) => setNotificationChannel(e.target.value as 'Email'|'SMS'|'Both')} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
        </div>
        <div>
          <label htmlFor="notificationMessage" className="block text-sm font-medium text-gray-400 mb-1">Message Content</label>
          <textarea id="notificationMessage" name="messageContent" rows={5} value={campaignMessage} onChange={(e) => setCampaignMessage(e.target.value)} className="block w-full bg-gray-600 border-gray-500 rounded-md shadow-sm p-2 text-white custom-scrollbar" placeholder="Enter your announcement message here... (Variables like {{user.name}} would be replaced)" required></textarea>
        </div>
        <fieldset className="border border-gray-600 p-4 rounded-md">
            <legend className="text-sm font-medium text-gray-300 px-1">Target Audience Filters</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <Input id="targetLocation" name="location" label="Location (City/State)" value={targetAudience.location} onChange={handleAudienceChange} placeholder="e.g., Mumbai" className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
                <Select id="targetGender" name="gender" label="Gender" options={genderOptions} value={targetAudience.gender} onChange={handleAudienceChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
                <Select id="targetCaste" name="caste" label="Caste" options={casteOptions} value={targetAudience.caste} onChange={handleAudienceChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
                <Select id="targetMembership" name="membership" label="Membership Tier" options={membershipOptions} value={targetAudience.membership} onChange={handleAudienceChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
            </div>
        </fieldset>
        <Input id="scheduledTime" name="scheduledTime" type="datetime-local" label="Schedule Time (Optional)" value={campaignScheduledTime} onChange={(e) => setCampaignScheduledTime(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500" />
        <div className="flex justify-end pt-2"><Button type="submit" variant="primary" className="!bg-rose-500 hover:!bg-rose-600">Send / Schedule Notification</Button></div>
      </form>

      <div className="bg-gray-700 p-6 rounded-lg shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-gray-100 mb-2">Automated Reminder Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Select id="reminderRule" name="reminderRule" label="Reminder Trigger" options={reminderRuleOptions} value={reminderRule} onChange={(e) => setReminderRule(e.target.value)} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
            <Input id="reminderDelay" name="reminderDelay" type="number" label="Delay (days)" value={reminderDelay} onChange={(e) => setReminderDelay(e.target.value)} placeholder="e.g., 2" min="1" className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
            <Button onClick={handleSaveReminder} variant="primary" className="!bg-blue-600 hover:!bg-blue-700 h-10">Set Reminder Rule</Button>
        </div>
        {isLoading.reminders ? <p className="text-xs text-gray-400">Loading rules...</p> : activeReminders.length > 0 && (
          <div className="text-xs text-gray-300 mt-2">Active rules: {activeReminders.map(r => `${r.rule} (${r.delayInDays} days)`).join(', ')}</div>
        )}
      </div>

      <div className="bg-gray-700 p-6 rounded-lg shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-gray-100 mb-2">Frontend Announcement Banners</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Input id="bannerText" name="bannerText" label="Banner Text" value={bannerText} onChange={(e) => setBannerText(e.target.value)} placeholder="e.g., Flat 50% off on Gold Plan!" className="md:col-span-2 [&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
            <Input id="bannerExpiry" name="expiryDate" type="date" label="Expiry Date (Optional)" value={bannerExpiry} onChange={(e) => setBannerExpiry(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500" />
        </div>
        <Button onClick={handleAddBanner} variant="primary" className="!bg-teal-600 hover:!bg-teal-700">Add Banner</Button>
        {isLoading.banners ? <p className="text-xs text-gray-400">Loading banners...</p> : activeBanners.length > 0 && (
            <div className="mt-4"><h3 className="text-md font-semibold text-gray-200 mb-2">Active Banners:</h3><ul className="space-y-2">
                    {activeBanners.map(banner => (
                        <li key={banner.id} className="flex justify-between items-center p-2 bg-gray-600 rounded-md text-sm">
                            <span>{banner.text} {banner.expiryDate && `(Expires: ${new Date(banner.expiryDate).toLocaleDateString()})`}</span>
                            <Button onClick={() => handleRemoveBanner(banner.id)} variant="danger" size="sm" className="!text-xs !py-0.5 !px-1.5">Remove</Button>
                        </li>
                    ))}
            </ul></div>
        )}
      </div>

      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Notification Campaign Logs</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-750"><tr>{['Title', 'Channel', 'Target', 'Status', 'Date', 'Actions'].map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>))}</tr></thead>
                <tbody className="bg-gray-700 divide-y divide-gray-600">
                    {isLoading.logs ? (<tr><td colSpan={6} className="text-center py-4">Loading logs...</td></tr>) : notificationLogs.slice(0, 5).map(log => (
                        <tr key={log.id}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-white">{log.campaignTitle}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">{log.channel}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-400 max-w-xs truncate" title={Object.entries(log.targetAudience).map(([k,v]) => v ? `${k}:${v}` : '').filter(Boolean).join(', ')}>{Object.entries(log.targetAudience).map(([k,v]) => v ? `${k}:${v}` : '').filter(Boolean).join(', ') || 'All Users'}</td>
                            <td className="px-3 py-2 whitespace-nowrap"><span className={`px-2 inline-flex text-[10px] leading-5 font-semibold rounded-full ${ log.status === 'Sent' ? 'bg-green-700 text-green-100' : log.status === 'Scheduled' ? 'bg-blue-700 text-blue-100' : 'bg-gray-500 text-gray-100'}`}>{log.status}</span></td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">{new Date(log.scheduledTime || log.createdAt).toLocaleString()}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs"><Button size="sm" variant="secondary" className="!py-0.5 !px-1 !bg-gray-500">Details</Button></td>
                        </tr>
                    ))}
                    {!isLoading.logs && notificationLogs.length === 0 && (<tr><td colSpan={6} className="text-center py-4 text-gray-400">No campaign logs yet.</td></tr>)}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default NotificationToolView;