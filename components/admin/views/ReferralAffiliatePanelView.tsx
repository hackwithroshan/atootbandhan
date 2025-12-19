import React, { useState } from 'react';
import { LinkIcon } from '../../icons/LinkIcon';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { ArrowDownTrayIcon } from '../../icons/ArrowDownTrayIcon'; // For Export
import { CheckCircleIcon } from '../../icons/CheckCircleIcon'; // For Approve
import { XCircleIcon } from '../../icons/XCircleIcon'; // For Reject

interface Affiliate {
  id: string;
  name: string; 
  referralLink: string;
  usersJoined: number;
  commissionRate: string; 
  totalRevenueGenerated: string; // New
  status: 'Active' | 'Inactive';
  expiryDate?: string; // New
}

const ReferralAffiliatePanelView: React.FC = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAffiliateName, setNewAffiliateName] = useState('');
  const [commissionRate, setCommissionRate] = useState('');
  const [linkExpiryDate, setLinkExpiryDate] = useState('');


  const handleCreateAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mock: Affiliate "${newAffiliateName}" created. Commission: "${commissionRate}". Expiry: ${linkExpiryDate || 'None'}. Link: atutbandhan.com/join?ref=${newAffiliateName.replace(/\s+/g, '').toLowerCase()}`);
    setNewAffiliateName('');
    setCommissionRate('');
    setLinkExpiryDate('');
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <LinkIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Referral & Affiliate Panel</h1>
      </div>
      <p className="text-gray-300">
        Track users referred by members, create/manage affiliate links for partners, view performance (joined users, revenue), and manage commissions.
      </p>

      <div className="flex justify-end">
        <Button onClick={() => setShowCreateForm(!showCreateForm)} variant="primary" className="!bg-green-600 hover:!bg-green-700">
          {showCreateForm ? 'Cancel Affiliate Creation' : '+ Create New Affiliate Link'}
        </Button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateAffiliate} className="bg-gray-700 p-6 rounded-lg shadow-xl space-y-4">
          <h2 className="text-xl font-semibold text-gray-100 mb-2">New Affiliate Partner Setup</h2>
          <Input id="newAffiliateName" name="newAffiliateName" label="Affiliate/Agent Name" value={newAffiliateName} onChange={(e) => setNewAffiliateName(e.target.value)} placeholder="e.g., Elite Matchmakers Co." className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" required />
          <Input id="commissionRate" name="commissionRate" label="Commission Rate / Details" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} placeholder="e.g., 10% of first payment or Rs. 100 per signup" className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" required />
          <Input type="date" id="linkExpiryDate" name="linkExpiryDate" label="Affiliate Link Expiry Date (Optional)" value={linkExpiryDate} onChange={(e) => setLinkExpiryDate(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500"/>
          <Button type="submit" variant="primary" className="!bg-rose-500 hover:!bg-rose-600">Generate Affiliate Link</Button>
        </form>
      )}

      {/* Affiliate/Partner Table */}
      <div className="bg-gray-700 shadow-xl rounded-lg overflow-x-auto">
        <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-semibold text-gray-100">Affiliate Partner Performance</h2>
            <Button onClick={() => alert("Exporting referral report (mock).")} variant="secondary" className="!bg-blue-600 hover:!bg-blue-700 !text-white !text-xs">
                <ArrowDownTrayIcon className="w-4 h-4 mr-1"/> Export Report
            </Button>
        </div>
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-750">
            <tr>
              {['Partner Name', 'Referral Link', 'Users Joined', 'Revenue Generated', 'Commission Details', 'Status', 'Expiry', 'Actions'].map(header => (
                <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {affiliates.length > 0 ? affiliates.map(aff => (
              <tr key={aff.id} className="hover:bg-gray-650 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{aff.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-rose-300 hover:underline cursor-pointer" title="Copy link (mock)">{aff.referralLink}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-center">{aff.usersJoined}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400 font-semibold">{aff.totalRevenueGenerated}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{aff.commissionRate}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    aff.status === 'Active' ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'
                  }`}>
                    {aff.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{aff.expiryDate || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-1">
                  <Button onClick={() => alert(`Approving commissions for ${aff.name} (mock)`)} size="sm" variant="secondary" className="!text-xs !py-0.5 !px-1.5 !bg-green-500 hover:!bg-green-600" title="Approve Commissions"><CheckCircleIcon className="w-4 h-4"/></Button>
                  <Button onClick={() => alert(`Rejecting/Reviewing commissions for ${aff.name} (mock)`)} size="sm" variant="secondary" className="!text-xs !py-0.5 !px-1.5 !bg-red-500 hover:!bg-red-600" title="Reject Commissions"><XCircleIcon className="w-4 h-4"/></Button>
                  <Button size="sm" variant="secondary" className="!text-xs !py-1 !px-2 !bg-blue-600 hover:!bg-blue-700 !text-white">Edit</Button>
                  <Button size="sm" variant={aff.status === 'Active' ? 'danger' : 'primary'} className={`!text-xs !py-1 !px-2 ${aff.status === 'Active' ? '!bg-yellow-600 hover:!bg-yellow-700 !text-black' : '!bg-green-600 hover:!bg-green-700'}`}>
                    {aff.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </td>
              </tr>
            )) : (
                <tr><td colSpan={8} className="text-center py-4 text-gray-400">No affiliate partners found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
       <div className="bg-gray-700 p-4 rounded-lg shadow-xl mt-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-2">User Referrals (Placeholder)</h2>
          <p className="text-gray-400">A list of users who joined via member-to-member referrals and their referral bonus status (e.g., bonus credited) will be shown here.</p>
       </div>
      <p className="text-xs text-gray-500 text-center">Referral tracking and commission payouts are mock functionalities for this demonstration.</p>
    </div>
  );
};

export default ReferralAffiliatePanelView;