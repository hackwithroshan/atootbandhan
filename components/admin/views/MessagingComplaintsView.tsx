import React, { useState } from 'react';
import { ChatBubbleBottomCenterTextIcon } from '../../icons/ChatBubbleBottomCenterTextIcon';
import { ExclamationTriangleIcon } from '../../icons/ExclamationTriangleIcon';
import Button from '../../ui/Button';
import Input from '../../ui/Input'; // Assuming Input component

const MessagingComplaintsView: React.FC = () => {
    const [complaints, setComplaints] = useState<any[]>([]);
  
  const [activeComplaint, setActiveComplaint] = useState<any | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const handleViewDetails = (complaint: any) => {
    setActiveComplaint(complaint);
    setResolutionNotes(complaint.resolutionNotes || '');
  };
  
  const handleSaveResolution = () => {
      if(activeComplaint){
          alert(`Resolution notes for complaint ${activeComplaint.id} saved: "${resolutionNotes}" (mock). Status would be updated.`);
          // Here you would update the complaint status and notes in your backend
          setActiveComplaint(null); 
      }
  };

  const complaintCategories = ['All', 'Fake Profile', 'Spam', 'Misbehavior', 'Payment Issue'];
  const filteredComplaints = filterCategory === 'All' || !filterCategory 
    ? complaints 
    : complaints.filter(c => c.category === filterCategory);

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Messaging & Complaints</h1>
      </div>
      <p className="text-gray-300">
        Monitor flagged message logs, handle abuse reports, manage user complaints, and take appropriate actions like warnings or suspensions.
      </p>

      {/* Category Filters */}
      <div className="bg-gray-700 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-200 mb-2">Filter Complaints by Category:</h3>
        <div className="flex flex-wrap gap-2">
            {complaintCategories.map(cat => (
                <Button 
                    key={cat}
                    variant={filterCategory === cat || (cat === 'All' && !filterCategory) ? "primary" : "secondary"}
                    onClick={() => setFilterCategory(cat === 'All' ? '' : cat)}
                    className={`!text-xs ${filterCategory === cat || (cat === 'All' && !filterCategory) ? '!bg-rose-500' : '!bg-gray-600 hover:!bg-gray-500'}`}
                >
                    {cat}
                </Button>
            ))}
        </div>
      </div>

      {/* Abuse Reports / Complaints Table */}
      <div className="bg-gray-700 p-4 md:p-6 rounded-lg shadow-xl overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
            <ExclamationTriangleIcon className="w-6 h-6 mr-2 text-yellow-400" />
            Abuse Reports & Complaints
        </h2>
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-750">
            <tr>
              {['ID', 'Reporter', 'Reported User', 'Reason', 'Category', 'Date', 'Status', 'Actions'].map(header => (
                <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {filteredComplaints.map(complaint => (
              <tr key={complaint.id} className="hover:bg-gray-650 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{complaint.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{complaint.reporterId}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{complaint.reportedUserId}</td>
                <td className="px-4 py-3 text-sm text-gray-300 max-w-xs truncate" title={complaint.reason}>{complaint.reason}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{complaint.category}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{complaint.date}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    complaint.status === 'Open' ? 'bg-yellow-700 text-yellow-100' : 
                    complaint.status === 'In Progress' ? 'bg-blue-700 text-blue-100' :
                    'bg-green-700 text-green-100'
                  }`}>
                    {complaint.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button onClick={() => handleViewDetails(complaint)} size="sm" variant="secondary" className="!text-xs !py-1 !px-2 !bg-blue-600 hover:!bg-blue-700 !text-white">View Details</Button>
                  {complaint.status !== 'Resolved' && <Button onClick={() => handleViewDetails(complaint)} size="sm" variant="primary" className="!text-xs !py-1 !px-2 !bg-yellow-600 hover:!bg-yellow-700 !text-black">Resolve</Button>}
                </td>
              </tr>
            ))}
            {filteredComplaints.length === 0 && (
                <tr><td colSpan={8} className="text-center py-6 text-gray-400">No complaints match the current filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal or section for handling a specific complaint */}
      {activeComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-lg text-gray-100">
                <h3 className="text-lg font-semibold mb-4">Complaint Details: {activeComplaint.id}</h3>
                <p><span className="font-medium text-gray-400">Reporter:</span> {activeComplaint.reporterId}</p>
                <p><span className="font-medium text-gray-400">Reported User:</span> {activeComplaint.reportedUserId}</p>
                <p><span className="font-medium text-gray-400">Reason:</span> {activeComplaint.reason}</p>
                <p><span className="font-medium text-gray-400">Category:</span> {activeComplaint.category}</p>
                <p><span className="font-medium text-gray-400">Status:</span> {activeComplaint.status}</p>
                <div className="mt-4">
                    <label htmlFor="resolutionNotes" className="block text-sm font-medium text-gray-300 mb-1">Resolution Notes:</label>
                    <textarea id="resolutionNotes" value={resolutionNotes} onChange={(e)=>setResolutionNotes(e.target.value)} rows={3}
                        className="block w-full bg-gray-600 border-gray-500 rounded-md shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2 text-white"
                        placeholder="Enter notes on action taken..."
                    ></textarea>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={() => setActiveComplaint(null)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveResolution} className="!bg-green-600 hover:!bg-green-700">Mark as Resolved & Save Notes</Button>
                    {/* Add buttons for "Warn User", "Suspend User" here */}
                </div>
                 <p className="text-xs text-gray-500 mt-3">Mock actions: Warn User, Suspend User, Add internal notes per user profile (via User Management).</p>
            </div>
        </div>
      )}

      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Message Logs (Flagged Conversations Only - Placeholder)</h2>
        <p className="text-gray-400">
            Access to user conversations should be strictly limited to flagged content for moderation purposes, respecting user privacy.
            A system to review flagged messages would appear here. This feature requires careful legal and ethical review before implementation.
        </p>
      </div>

    </div>
  );
};

export default MessagingComplaintsView;