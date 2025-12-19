import React, { useState, FormEvent } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { ShieldCheckIcon } from '../../icons/ShieldCheckIcon';
import { ExclamationTriangleIcon } from '../../icons/ExclamationTriangleIcon';
import { LockClosedIcon } from '../../icons/LockClosedIcon';
import { XMarkIcon } from '../../icons/XMarkIcon';
import { REPORT_REASON_OPTIONS } from '../../../constants';

const SafetyCentreView: React.FC = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportUserId, setReportUserId] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  
  const mockBlockedUsers = ['USR987', 'USR654']; // Example IDs

  const handleReportSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reportUserId || !reportReason) {
        alert("Please enter the User ID to report and select a reason.");
        return;
    }
    console.log('Reporting user (mock):', { userId: reportUserId, reason: reportReason, description: reportDescription });
    alert(`User ${reportUserId} reported successfully. Reason: ${reportReason}. (Mock)`);
    setShowReportModal(false);
    setReportUserId(''); setReportReason(''); setReportDescription('');
  };

  const safetyTips = [
    "Never share your password or OTP with anyone.",
    "Be cautious when sharing personal contact information like phone number or address.",
    "Meet in a public place for the first few times.",
    "Inform a friend or family member about your meeting plans.",
    "Trust your instincts. If something feels off, disengage.",
    "Report any suspicious or abusive behavior to us immediately.",
    "Use the platform's messaging system initially; avoid switching to external apps too soon.",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <ShieldCheckIcon className="w-8 h-8 text-rose-500" />
        <h2 className="text-2xl font-semibold text-gray-800">Safety Centre</h2>
      </div>
      <p className="text-gray-600 text-sm">
        Your safety is our priority. Find tips, guidelines, and tools to ensure a secure experience.
      </p>

      {/* Safety Tips Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Online Safety Tips</h3>
        <ul className="space-y-2 list-disc list-inside pl-2 text-sm text-gray-600">
          {safetyTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Report & Block Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Tools & Actions</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button 
              variant="danger" 
              onClick={() => setShowReportModal(true)} 
              className="!bg-red-500 hover:!bg-red-600"
            >
              <ExclamationTriangleIcon className="w-5 h-5 mr-2"/> Report Suspicious User
            </Button>
            <Button 
                variant="secondary" 
                onClick={() => alert("Navigate to Blocked Users management (mock).")}
                className="!border-gray-400"
            >
                <LockClosedIcon className="w-5 h-5 mr-2"/> Manage Blocked Users
            </Button>
        </div>
        <div className="mt-4">
            <h4 className="text-md font-medium text-gray-700">Quick Links:</h4>
            <ul className="list-disc list-inside text-sm text-rose-600 space-y-1 mt-1">
                <li><button className="hover:underline" onClick={() => alert("Displaying info on how we verify profiles (mock).")}>How We Verify Profiles</button></li>
                <li><button className="hover:underline" onClick={() => alert("Displaying info on what to do if someone misbehaves (mock).")}>Reporting Misbehavior</button></li>
                <li><button className="hover:underline" onClick={() => alert("Displaying Community Standards document (mock).")}>Community Standards</button></li>
            </ul>
        </div>
      </div>

      {/* Mock Blocked Users List (could be part of Account Settings too) */}
       <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Your Blocked Users (Mock)</h3>
        {mockBlockedUsers.length > 0 ? (
            <ul className="space-y-1 text-sm text-gray-600">
                {mockBlockedUsers.map(id => <li key={id} className="p-1.5 bg-gray-50 rounded">{id} - <button className="text-xs text-red-500 hover:underline" onClick={() => alert(`Unblocking ${id} (mock)`)}>Unblock</button></li>)}
            </ul>
        ) : <p className="text-sm text-gray-500">You haven't blocked any users.</p>}
      </div>


      {/* Report User Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleReportSubmit} className="bg-white p-5 rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Report a User</h3>
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowReportModal(false)} className="!p-1.5 !rounded-full"><XMarkIcon className="w-4 h-4"/></Button>
            </div>
            <div className="space-y-3">
              <Input 
                id="reportUserId" 
                name="reportUserId" 
                label="User ID to Report" 
                value={reportUserId} 
                onChange={(e) => setReportUserId(e.target.value)} 
                placeholder="e.g., USR12345" 
                required 
              />
              <Select 
                id="reportReason" 
                name="reportReason" 
                label="Reason for Reporting" 
                options={REPORT_REASON_OPTIONS} 
                value={reportReason} 
                onChange={(e) => setReportReason(e.target.value)} 
                required 
              />
              <div>
                <label htmlFor="reportDescription" className="block text-xs font-medium text-gray-600 mb-0.5">Description (Optional)</label>
                <textarea 
                  id="reportDescription" 
                  name="reportDescription" 
                  value={reportDescription} 
                  onChange={(e) => setReportDescription(e.target.value)} 
                  rows={3} 
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-500 text-sm custom-scrollbar" 
                  placeholder="Provide more details if necessary..."
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-5">
              <Button type="button" variant="secondary" onClick={() => setShowReportModal(false)}>Cancel</Button>
              <Button type="submit" variant="danger" className="!bg-red-500 hover:!bg-red-600">Submit Report</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SafetyCentreView;
