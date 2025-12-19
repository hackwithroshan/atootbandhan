import React, { useState, useMemo, ChangeEvent } from 'react';
import { ShieldCheckIcon } from '../../icons/ShieldCheckIcon';
import Button from '../../ui/Button';
import { EyeIcon } from '../../icons/EyeIcon';
import { CheckCircleIcon } from '../../icons/CheckCircleIcon';
import { XCircleIcon } from '../../icons/XCircleIcon';
import { DocumentTextIcon } from '../../icons/DocumentTextIcon';
import { CheckBadgeIcon } from '../../icons/CheckBadgeIcon';
import { PhotoIcon } from '../../icons/PhotoIcon';
import { UserCircleIcon } from '../../icons/UserCircleIcon';
import { SparklesIcon } from '../../icons/SparklesIcon'; // For Horoscope
import { ExclamationTriangleIcon } from '../../icons/ExclamationTriangleIcon'; // For Reports
import { ArrowPathIcon } from '../../icons/ArrowPathIcon'; // For Edit Logs
import { PencilIcon } from '../../icons/PencilIcon'; // For edit content
import { XMarkIcon } from '../../icons/XMarkIcon'; // For close modal

import {
  ModerationItemType,
  ModerationStatus,
  ReportCategory,
  VerificationType,
  ModerationPhotoItem,
  ModerationContentItem,
  ModerationHoroscopeItem,
  ProfileReportItem,
  ProfileEditLogEntry,
  AnyModerationItem,
  AdminManagedUser, 
  UserVerificationStatus,
  SelectOption as AppSelectOption,
  ManglikStatus, // Added import
} from '../../../types';
import Select from '../../ui/Select';
import Input from '../../ui/Input';

type ModerationTabs = 'Photo' | 'Content' | 'Horoscope' | 'Reports' | 'EditLogs';

const ProfileModerationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ModerationTabs>('Photo');
  
  const [photos, setPhotos] = useState<ModerationPhotoItem[]>([]);
  const [contentItems, setContentItems] = useState<ModerationContentItem[]>([]);
  const [horoscopeItems, setHoroscopeItems] = useState<ModerationHoroscopeItem[]>([]);
  const [reports, setReports] = useState<ProfileReportItem[]>([]);
  const [editLogs, setEditLogs] = useState<ProfileEditLogEntry[]>([]);

  // For managing verification status (simplified)
  const [userVerification, setUserVerification] = useState<Record<string, UserVerificationStatus>>({});
  
  const [selectedItem, setSelectedItem] = useState<AnyModerationItem | ProfileEditLogEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'viewDetails' | 'addNotes' | 'rejectReason' | 'editContent' | 'verifyUser'>('viewDetails');
  const [actionNotes, setActionNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [editableContent, setEditableContent] = useState('');
  
  const [filters, setFilters] = useState({
      photoStatus: '',
      contentStatus: '',
      reportStatus: '',
      reportCategory: '',
      logUser: '',
  });

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>, filterName: string) => {
    setFilters(prev => ({...prev, [filterName]: e.target.value}));
  };

  const openModal = (item: AnyModerationItem | ProfileEditLogEntry, action: typeof modalAction) => {
    setSelectedItem(item);
    setModalAction(action);
    if ('adminNotes' in item) { // Check if adminNotes property exists (it does on AnyModerationItem but not ProfileEditLogEntry by default in this structure, but could be added)
        setActionNotes(item.adminNotes || '');
    } else {
        setActionNotes(''); // Default if not applicable
    }
    if (action === 'editContent' && 'contentSnippet' in item) {
      setEditableContent((item as ModerationContentItem).contentSnippet);
    }
    if(action === 'rejectReason') setRejectReason('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setActionNotes('');
    setRejectReason('');
    setEditableContent('');
  };

  const handleModerationAction = (itemId: string, newStatus: ModerationStatus, itemType: ModerationItemType) => {
    const reason = newStatus === ModerationStatus.REJECTED ? rejectReason : undefined;
    alert(`Item ${itemId} ${newStatus.toLowerCase()}${reason ? ` (Reason: ${reason})` : ''}. Notes: ${actionNotes}`);
    
    const updateState = (setter: React.Dispatch<React.SetStateAction<any[]>>, currentItemType: ModerationItemType) => {
        if (itemType === currentItemType) {
            setter(prev => prev.map(p => p.id === itemId ? { ...p, status: newStatus, adminNotes: actionNotes } : p));
        }
    };

    updateState(setPhotos as any, ModerationItemType.PHOTO);
    updateState(setContentItems as any, ModerationItemType.PROFILE_CONTENT);
    updateState(setHoroscopeItems as any, ModerationItemType.HOROSCOPE_DETAILS);
    updateState(setReports as any, ModerationItemType.REPORTED_PROFILE);
    
    closeModal();
  };
  
  const handleSaveNotes = (itemId: string, itemType?: ModerationItemType) => { // itemType can be optional if notes are for logs too
      alert(`Notes for ${itemId} saved: "${actionNotes}"`);
      if (itemType) { // Only update moderation items if itemType is provided
        const updateState = (setter: React.Dispatch<React.SetStateAction<any[]>>, currentItemType: ModerationItemType) => {
            if (itemType === currentItemType) {
                setter(prev => prev.map(p => p.id === itemId ? { ...p, adminNotes: actionNotes } : p));
            }
        };
        updateState(setPhotos as any, ModerationItemType.PHOTO);
        updateState(setContentItems as any, ModerationItemType.PROFILE_CONTENT);
        updateState(setHoroscopeItems as any, ModerationItemType.HOROSCOPE_DETAILS);
        updateState(setReports as any, ModerationItemType.REPORTED_PROFILE);
      } else if (selectedItem && 'logId' in selectedItem && selectedItem.logId === itemId) {
        // Handle saving notes for edit logs if needed - assumes adminNotes can be added to ProfileEditLogEntry
        setEditLogs(prev => prev.map(log => log.logId === itemId ? {...log, adminNotes: actionNotes} : log));
      }
    closeModal();
  };

  const handleContentEditSave = (itemId: string) => {
      alert(`Content for ${itemId} edited and approved (mock): "${editableContent}"`);
      setContentItems(prev => prev.map(p => p.id === itemId ? { ...p, status: ModerationStatus.APPROVED, contentSnippet: editableContent, adminNotes: actionNotes } : p));
      closeModal();
  };

  const handleReportAction = (itemId: string, action: 'Warn' | 'Suspend' | 'Ban' | 'Dismiss') => {
      alert(`Report ${itemId}: Action taken - ${action}. User ${ (selectedItem as ProfileReportItem)?.userId} (mock). Notes: ${actionNotes}`);
      setReports(prev => prev.map(r => r.id === itemId ? {...r, status: ModerationStatus.ACTION_TAKEN, adminNotes: actionNotes} : r));
      closeModal();
  };
  
  const toggleUserVerification = (userId: string, verificationType: VerificationType) => {
      const notes = prompt(`Enter notes for ${verificationType} status change for user ${userId}:`, 
        userVerification[userId]?.[verificationType]?.notes || (userVerification[userId]?.[verificationType]?.isVerified ? 'Previously verified.' : 'Verification confirmed.')
      );
      if(notes === null) return; // User cancelled

      setUserVerification(prev => {
          const currentUserVerifications = prev[userId] || {};
          const typeVerification = currentUserVerifications[verificationType] || { isVerified: false };
          return {
              ...prev,
              [userId]: {
                  ...currentUserVerifications,
                  [verificationType]: {
                      isVerified: !typeVerification.isVerified,
                      notes: notes,
                      verifiedBy: 'current_admin_mock', // Replace with actual admin ID
                      dateVerified: new Date().toISOString(),
                  }
              }
          };
      });
      alert(`User ${userId} ${verificationType} status updated.`);
  };

  const renderFilters = () => {
    switch(activeTab) {
      case 'Photo': return <Select id="photoStatusFilter" name="photoStatus" label="Filter by Status" options={[{value: '', label: 'All'}, ...Object.values(ModerationStatus).map(s => ({value: s, label: s}))]} value={filters.photoStatus} onChange={e => handleFilterChange(e, 'photoStatus')} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />;
      case 'Content': return <Select id="contentStatusFilter" name="contentStatus" label="Filter by Status" options={[{value: '', label: 'All'}, ...Object.values(ModerationStatus).map(s => ({value: s, label: s}))]} value={filters.contentStatus} onChange={e => handleFilterChange(e, 'contentStatus')} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />;
      case 'Reports': return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select 
              id="reportStatusFilter" 
              name="reportStatus" 
              label="Filter by Status" 
              options={[{value: '', label: 'All'}, ...[ModerationStatus.PENDING, ModerationStatus.ACTION_TAKEN].map(statusValue => ({value: statusValue, label: statusValue}))]} 
              value={filters.reportStatus} 
              onChange={e => handleFilterChange(e, 'reportStatus')} 
              className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" 
            />
            <Select id="reportCategoryFilter" name="reportCategory" label="Filter by Category" options={[{value: '', label: 'All'}, ...Object.values(ReportCategory).map(s => ({value: s, label: s}))]} value={filters.reportCategory} onChange={e => handleFilterChange(e, 'reportCategory')} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
        </div>
      );
      case 'EditLogs': return <Input id="logUserFilter" name="logUser" label="Filter by User ID" value={filters.logUser} onChange={e => handleFilterChange(e, 'logUser')} placeholder="Enter User ID" className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />;
      default: return null;
    }
  };
  
  const filteredPhotos = photos.filter(p => !filters.photoStatus || p.status === filters.photoStatus);
  const filteredContent = contentItems.filter(c => !filters.contentStatus || c.status === filters.contentStatus);
  const filteredReports = reports.filter(r => (!filters.reportStatus || r.status === filters.reportStatus) && (!filters.reportCategory || r.reportCategory === filters.reportCategory));
  const filteredLogs = editLogs.filter(l => !filters.logUser || l.userId.includes(filters.logUser) || l.userName.toLowerCase().includes(filters.logUser.toLowerCase()));


  const renderVerificationControls = (userId: string) => {
      const currentVerifications = userVerification[userId] || {};
      return (
          <div className="mt-2 p-2 border-t border-gray-500 space-y-1">
              <h5 className="text-xs font-semibold text-gray-300">Verification Status:</h5>
              {Object.values(VerificationType).map(vType => (
                  <div key={vType} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{vType}:</span>
                      <Button
                          size="sm"
                          variant={currentVerifications[vType]?.isVerified ? "primary" : "secondary"}
                          onClick={() => toggleUserVerification(userId, vType)}
                          className={`!text-[10px] !py-0.5 !px-1.5 ${currentVerifications[vType]?.isVerified ? "!bg-green-600 hover:!bg-green-700" : "!bg-gray-500 hover:!bg-gray-400"}`}
                      >
                          {currentVerifications[vType]?.isVerified ? 'Verified' : 'Not Verified'} (Toggle)
                      </Button>
                  </div>
              ))}
          </div>
      );
  };

  const renderTable = () => {
    switch (activeTab) {
      case 'Photo':
        return (
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-750"><tr>{['User', 'Photo', 'Reason', 'Submitted', 'Status', 'Actions'].map(h=><th key={h} className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
              {filteredPhotos.map(item => (
                <tr key={item.id}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm"><img src={item.userPhotoUrl || 'https://via.placeholder.com/40/CCCCCC/FFFFFF?Text=?'} alt={item.userName} className="w-8 h-8 rounded-full inline-block mr-2"/>{item.userName} ({item.userId})</td>
                  <td className="px-3 py-2"><img src={item.photoUrl} alt="Moderation" className="w-16 h-12 rounded object-cover cursor-pointer" onClick={() => openModal(item, 'viewDetails')}/></td>
                  <td className="px-3 py-2 text-xs max-w-xs truncate" title={item.reasonForFlag}>{item.reasonForFlag}{item.isAutoFlagged && <span className="text-red-400 ml-1">(AI)</span>}</td>
                  <td className="px-3 py-2 text-xs">{item.dateSubmitted}</td>
                  <td className="px-3 py-2"><span className={`px-2 py-0.5 text-[10px] rounded-full ${item.status === ModerationStatus.PENDING ? 'bg-yellow-700 text-yellow-100' : item.status === ModerationStatus.APPROVED ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}>{item.status}</span></td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs space-x-1">
                    {item.status === ModerationStatus.PENDING && <>
                      <Button onClick={() => openModal(item, 'rejectReason')} size="sm" variant="danger" className="!py-0.5 !px-1">Reject</Button>
                      <Button onClick={() => handleModerationAction(item.id, ModerationStatus.APPROVED, item.itemType)} size="sm" variant="primary" className="!bg-green-600 !py-0.5 !px-1">Approve</Button>
                    </>}
                    <Button onClick={() => openModal(item, 'addNotes')} size="sm" variant="secondary" className="!py-0.5 !px-1">Notes</Button>
                  </td>
                </tr>
              ))}
              {filteredPhotos.length === 0 && <tr><td colSpan={6} className="text-center py-4 text-gray-400">No photos in this queue.</td></tr>}
            </tbody>
          </table>
        );
      case 'Content':
         return (
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-750"><tr>{['User', 'Section', 'Snippet', 'Reason', 'Submitted', 'Status', 'Actions'].map(h=><th key={h} className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
              {filteredContent.map(item => (
                <tr key={item.id}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm"><img src={item.userPhotoUrl || 'https://via.placeholder.com/40/CCCCCC/FFFFFF?Text=?'} alt={item.userName} className="w-8 h-8 rounded-full inline-block mr-2"/>{item.userName} ({item.userId})</td>
                  <td className="px-3 py-2 text-xs">{item.profileSection}</td>
                  <td className="px-3 py-2 text-xs max-w-sm truncate cursor-pointer" title={item.contentSnippet}  onClick={() => openModal(item, 'viewDetails')}>{item.contentSnippet}</td>
                  <td className="px-3 py-2 text-xs max-w-xs truncate" title={item.reasonForFlag}>{item.reasonForFlag}{item.isAutoFlagged && <span className="text-red-400 ml-1">(AI)</span>}</td>
                  <td className="px-3 py-2 text-xs">{item.dateSubmitted}</td>
                  <td className="px-3 py-2"><span className={`px-2 py-0.5 text-[10px] rounded-full ${item.status === ModerationStatus.PENDING ? 'bg-yellow-700 text-yellow-100' : item.status === ModerationStatus.APPROVED ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}>{item.status}</span></td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs space-x-1">
                    {item.status === ModerationStatus.PENDING && <>
                      <Button onClick={() => openModal(item, 'rejectReason')} size="sm" variant="danger" className="!py-0.5 !px-1">Reject</Button>
                      <Button onClick={() => openModal(item, 'editContent')} size="sm" variant="secondary" className="!py-0.5 !px-1">Edit & Approve</Button>
                      <Button onClick={() => handleModerationAction(item.id, ModerationStatus.APPROVED, item.itemType)} size="sm" variant="primary" className="!bg-green-600 !py-0.5 !px-1">Approve</Button>
                    </>}
                    <Button onClick={() => openModal(item, 'addNotes')} size="sm" variant="secondary" className="!py-0.5 !px-1">Notes</Button>
                  </td>
                </tr>
              ))}
              {filteredContent.length === 0 && <tr><td colSpan={7} className="text-center py-4 text-gray-400">No content items in this queue.</td></tr>}
            </tbody>
          </table>
        );
      case 'Horoscope':
        // Simplified for now
        return <p className="p-4 text-gray-400">Horoscope moderation queue placeholder. Admins would review submitted horoscope data against provided proofs or general consistency.</p>;
      case 'Reports':
         return (
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-750"><tr>{['Reported User', 'Reporter', 'Category', 'Reason', 'Date', 'Status', 'Actions'].map(h=><th key={h} className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
              {filteredReports.map(item => (
                <tr key={item.id}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm"><img src={item.userPhotoUrl || 'https://via.placeholder.com/40/CCCCCC/FFFFFF?Text=?'} alt={item.userName} className="w-8 h-8 rounded-full inline-block mr-2"/>{item.userName} ({item.userId})</td>
                  <td className="px-3 py-2 text-xs">{item.reporterName} ({item.reporterUserId})</td>
                  <td className="px-3 py-2 text-xs">{item.reportCategory}</td>
                  <td className="px-3 py-2 text-xs max-w-sm truncate cursor-pointer" title={item.reportReason} onClick={() => openModal(item, 'viewDetails')}>{item.reportReason}</td>
                  <td className="px-3 py-2 text-xs">{item.dateSubmitted}</td>
                  <td className="px-3 py-2"><span className={`px-2 py-0.5 text-[10px] rounded-full ${item.status === ModerationStatus.PENDING ? 'bg-yellow-700 text-yellow-100' : 'bg-blue-700 text-blue-100'}`}>{item.status}</span></td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs space-x-1">
                    {item.status === ModerationStatus.PENDING && <>
                      <Button onClick={() => openModal(item, 'viewDetails')} size="sm" variant="secondary" className="!py-0.5 !px-1">Details</Button>
                      {/* Mock actions, ideally link to UserManagement actions */}
                      <Button onClick={() => handleReportAction(item.id, 'Warn')} size="sm" variant="secondary" className="!bg-yellow-600 !text-black !py-0.5 !px-1">Warn</Button>
                      <Button onClick={() => handleReportAction(item.id, 'Suspend')} size="sm" variant="danger" className="!py-0.5 !px-1">Suspend</Button>
                      <Button onClick={() => handleReportAction(item.id, 'Dismiss')} size="sm" variant="primary" className="!bg-green-600 !py-0.5 !px-1">Dismiss</Button>
                    </>}
                    <Button onClick={() => openModal(item, 'addNotes')} size="sm" variant="secondary" className="!py-0.5 !px-1">Notes</Button>
                    <Button onClick={() => openModal(item, 'verifyUser')} size="sm" variant="secondary" className="!bg-teal-500 !text-white !py-0.5 !px-1">Verify User</Button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && <tr><td colSpan={7} className="text-center py-4 text-gray-400">No reports in this queue.</td></tr>}
            </tbody>
          </table>
        );
       case 'EditLogs':
         return (
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-750"><tr>{['User', 'Timestamp', 'Field', 'Old Value', 'New Value', 'Changed By', 'Notes'].map(h=><th key={h} className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
              {filteredLogs.map(log => (
                <tr key={log.logId}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{log.userName} ({log.userId})</td>
                  <td className="px-3 py-2 text-xs">{log.timestamp}</td>
                  <td className="px-3 py-2 text-xs">{log.fieldName}</td>
                  <td className="px-3 py-2 text-xs max-w-xs truncate" title={log.oldValue || 'N/A'}>{log.oldValue || 'N/A'}</td>
                  <td className="px-3 py-2 text-xs max-w-xs truncate" title={log.newValue || 'N/A'}>{log.newValue || 'N/A'}</td>
                  <td className="px-3 py-2 text-xs">{log.changedBy}</td>
                  <td className="px-3 py-2 text-xs max-w-xs truncate" title={log.adminNotes || ''}>{log.adminNotes || ''}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && <tr><td colSpan={7} className="text-center py-4 text-gray-400">No edit logs match your criteria.</td></tr>}
            </tbody>
          </table>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <ShieldCheckIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Profile Moderation</h1>
      </div>
      <p className="text-gray-300">
        Review and approve/reject profile sections, handle reported profiles, view edit history, and manage verification badges.
      </p>

      <div className="border-b border-gray-600">
        <nav className="-mb-px flex space-x-4 overflow-x-auto pb-px" aria-label="Tabs">
          {(['Photo', 'Content', 'Horoscope', 'Reports', 'EditLogs'] as ModerationTabs[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-3 px-2 sm:px-3 border-b-2 font-medium text-sm
                ${activeTab === tab ? 'border-rose-500 text-rose-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="bg-gray-700 p-4 rounded-lg shadow">
        {renderFilters()}
      </div>

      <div className="bg-gray-700 shadow-xl rounded-lg overflow-x-auto">
        {renderTable()}
      </div>

      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4" role="dialog" aria-modal="true">
          <div className="bg-gray-700 p-5 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-600 pb-2">
                <h3 className="text-xl font-semibold text-gray-100">
                    {modalAction === 'viewDetails' && `Details: ${(selectedItem as AnyModerationItem).itemType}`}
                    {modalAction === 'addNotes' && `Admin Notes for ${'id' in selectedItem ? (selectedItem as AnyModerationItem).id : (selectedItem as ProfileEditLogEntry).logId}`}
                    {modalAction === 'rejectReason' && `Reject Item: ${(selectedItem as AnyModerationItem).id}`}
                    {modalAction === 'editContent' && `Edit Content: ${(selectedItem as AnyModerationItem).id}`}
                    {modalAction === 'verifyUser' && `Verify User: ${(selectedItem as AnyModerationItem).userName}`}
                </h3>
                <Button type="button" variant="secondary" size="sm" onClick={closeModal} className="!p-1.5 !rounded-full !bg-gray-600 hover:!bg-gray-500"><XMarkIcon className="w-4 h-4"/></Button>
            </div>
            <div className="overflow-y-auto space-y-3 pr-2 flex-grow custom-scrollbar text-gray-200">
                {modalAction === 'viewDetails' && (
                    <>
                        <p><strong>User:</strong> {(selectedItem as AnyModerationItem).userName} ({(selectedItem as AnyModerationItem).userId})</p>
                        {'photoUrl' in selectedItem && <img src={(selectedItem as ModerationPhotoItem).photoUrl} alt="Full view" className="max-w-full max-h-64 rounded my-2"/>}
                        {'contentSnippet' in selectedItem && <p><strong>Content:</strong> {(selectedItem as ModerationContentItem).contentSnippet}</p>}
                        {'reportReason' in selectedItem && <p><strong>Report Reason:</strong> {(selectedItem as ProfileReportItem).reportReason}</p>}
                        <p className="text-xs text-gray-400 mt-1">Current Notes: {('adminNotes' in selectedItem && selectedItem.adminNotes) || 'None'}</p>
                    </>
                )}
                 {(modalAction === 'addNotes' || modalAction === 'rejectReason' || modalAction === 'editContent') && (
                    <div>
                        <label htmlFor="actionNotes" className="block text-sm font-medium text-gray-400 mb-1">Admin Notes:</label>
                        <textarea id="actionNotes" value={actionNotes} onChange={e => setActionNotes(e.target.value)} rows={3} className="w-full bg-gray-600 text-white border-gray-500 rounded p-2 text-sm" placeholder="Add internal notes..."></textarea>
                    </div>
                 )}
                 {modalAction === 'rejectReason' && (
                    <div>
                        <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-400 mb-1 mt-2">Reason for Rejection:</label>
                        <textarea id="rejectReason" value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={2} className="w-full bg-gray-600 text-white border-gray-500 rounded p-2 text-sm" placeholder="Provide a reason..." required></textarea>
                    </div>
                 )}
                 {modalAction === 'editContent' && 'contentSnippet' in selectedItem && (
                     <div>
                        <label htmlFor="editableContent" className="block text-sm font-medium text-gray-400 mb-1 mt-2">Edit Content:</label>
                        <textarea id="editableContent" value={editableContent} onChange={e => setEditableContent(e.target.value)} rows={4} className="w-full bg-gray-600 text-white border-gray-500 rounded p-2 text-sm"></textarea>
                    </div>
                 )}
                 {modalAction === 'verifyUser' && 'userId' in selectedItem && (
                     renderVerificationControls((selectedItem as AnyModerationItem).userId)
                 )}

            </div>
            <div className="flex justify-end space-x-3 pt-3 border-t border-gray-600 mt-3">
                <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
                {modalAction === 'addNotes' && <Button variant="primary" onClick={() => handleSaveNotes('id' in selectedItem ? (selectedItem as AnyModerationItem).id : (selectedItem as ProfileEditLogEntry).logId, 'itemType' in selectedItem ? (selectedItem as AnyModerationItem).itemType : undefined)} className="!bg-blue-600 hover:!bg-blue-700">Save Notes</Button>}
                {modalAction === 'rejectReason' && <Button variant="danger" onClick={() => handleModerationAction((selectedItem as AnyModerationItem).id, ModerationStatus.REJECTED, (selectedItem as AnyModerationItem).itemType)} disabled={!rejectReason}>Confirm Rejection</Button>}
                {modalAction === 'editContent' && <Button variant="primary" onClick={() => handleContentEditSave((selectedItem as AnyModerationItem).id)} className="!bg-green-600 hover:!bg-green-700">Save & Approve Content</Button>}
                {/* Specific actions for reports can be added here or within the table directly */}
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">Full audit logs for moderation actions will be available. Current actions are mock.</p>
    </div>
  );
};

export default ProfileModerationView;