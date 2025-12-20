import React, { useState, useMemo, ChangeEvent, FormEvent, useEffect, useCallback } from 'react';
import { UserGroupIcon } from '../../icons/UserGroupIcon';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { CloudArrowUpIcon } from '../../icons/CloudArrowUpIcon';
import { ArrowDownTrayIcon } from '../../icons/ArrowDownTrayIcon';
import { DocumentTextIcon } from '../../icons/DocumentTextIcon';
import { PaperAirplaneIcon } from '../../icons/PaperAirplaneIcon';
import { TagIcon } from '../../icons/TagIcon';
import { EyeIcon } from '../../icons/EyeIcon';
import { PencilIcon } from '../../icons/PencilIcon';
import { CheckBadgeIcon } from '../../icons/CheckBadgeIcon';
import { ShieldExclamationIcon } from '../../icons/ShieldExclamationIcon';
import { KeyIcon } from '../../icons/KeyIcon';
import { XMarkIcon } from '../../icons/XMarkIcon';
import { LockOpenIcon } from '../../icons/LockOpenIcon';
import { MembershipBadge } from '../../common/MembershipBadge';
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';

import { AdminManagedUser, UserStatus, LoginAttempt, Gender, Religion, MaritalStatus, MotherTongue, EducationLevel, OccupationCategory, SelectOption as AppSelectOption, SignupFormData, MembershipTier } from '../../../types';
import { GENDER_OPTIONS, RELIGION_OPTIONS, MARITAL_STATUS_OPTIONS, EDUCATION_OPTIONS, OCCUPATION_OPTIONS, NEW_MALE_PROFILE_IMAGE_URL } from '../../../constants';
import { AcademicCapIcon } from '../../icons/AcademicCapIcon';
import { BookOpenIcon } from '../../icons/BookOpenIcon';
import { UserIcon } from '../../icons/UserIcon';

const InfoItem: React.FC<{ label: string; value: any }> = ({ label, value }) => (
    <div className="grid grid-cols-2 gap-2 py-1.5 text-sm border-b border-gray-600">
      <span className="text-gray-400 font-medium">{label}</span>
      <span className="text-gray-200 break-words">{value === undefined || value === null || value === '' ? <span className="text-gray-500 italic">Not Provided</span> : String(value)}</span>
    </div>
);

const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<AdminManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    gender: '', city: '', caste: '', membershipPlan: '', status: '', lastLoginDateRange: ''
  });
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const { showToast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  
  const [currentUserForAction, setCurrentUserForAction] = useState<AdminManagedUser | null>(null);
  const [editableUserData, setEditableUserData] = useState<Partial<AdminManagedUser>>({});
  const [suspensionReason, setSuspensionReason] = useState('');
  const [suspensionEndDate, setSuspensionEndDate] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
          search: searchTerm,
          ...filters
      }).toString();
      const data = await apiClient(`/api/admin/users?${queryParams}`);
      setUsers(data);
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast, searchTerm, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  const mockFilterOptions = {
    gender: [{value: '', label: 'Any Gender'}, ...GENDER_OPTIONS],
    caste: [{value: '', label: 'Any Caste'}, {value: 'Brahmin', label: 'Brahmin'}, {value: 'Patel', label: 'Patel'}, {value: 'Khatri', label: 'Khatri'}, {value: 'Other', label: 'Other'}],
    membershipPlan: [{value: '', label: 'Any Plan'}, ...Object.values(MembershipTier).map(t => ({value: t, label: t}))],
    status: [{value: '', label: 'Any Status'}, ...Object.values(UserStatus).map(s => ({value: s, label: s}))],
    loginActivity: [{value:'', label:'Any Activity'}, {value:'today', label:'Logged in Today'}, {value:'this_week', label:'Logged in This Week'}, {value:'inactive_30_days', label:'Inactive >30 days'}]
  };


  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };
  
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) newSet.delete(userId);
      else newSet.add(userId);
      return newSet;
    });
  };
  
  const handleSelectAllUsers = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(new Set(users.map(u => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleEditableDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setEditableUserData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openViewModal = (user: AdminManagedUser) => {
    setCurrentUserForAction(user);
    setIsViewModalOpen(true);
  };

  const openEditModal = (user: AdminManagedUser) => {
    setCurrentUserForAction(user);
    setEditableUserData({ 
      fullName: user.fullName,
      email: user.email,
      membershipTier: user.membershipTier,
      status: user.status,
      isVerifiedByAdmin: user.isVerifiedByAdmin,
     }); 
    setIsEditModalOpen(true);
  };

  const saveProfileChanges = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUserForAction) return;

    try {
        await apiClient(`/api/admin/users/${currentUserForAction.id}`, {
            method: 'PUT',
            body: editableUserData
        });
        showToast(`Profile for ${currentUserForAction.fullName} updated.`, 'success');
        setIsEditModalOpen(false);
        fetchUsers(); // Refresh the list
    } catch (err: any) {
        showToast(err.message, 'error');
    }
  };

  const openSuspendModal = (user: AdminManagedUser) => {
    setCurrentUserForAction(user);
    setSuspensionReason(user.suspensionReason || '');
    setSuspensionEndDate(user.suspensionEndDate || '');
    setIsSuspendModalOpen(true);
  };
  
  const handleStatusUpdate = async (user: AdminManagedUser, status: UserStatus, reason?: string, suspensionEndDate?: string) => {
    try {
        await apiClient(`/api/admin/users/${user.id}/status`, {
            method: 'PUT',
            body: { status, reason, suspensionEndDate }
        });
        showToast(`User ${user.fullName} status updated to ${status}.`, 'success');
        fetchUsers();
    } catch (err: any) {
        showToast(err.message, 'error');
    }
  };
  
  const handleSuspendUser = async () => {
    if(!currentUserForAction) return;
    await handleStatusUpdate(currentUserForAction, UserStatus.SUSPENDED, suspensionReason, suspensionEndDate);
    setIsSuspendModalOpen(false);
  };

  const handleBanUser = (user: AdminManagedUser) => {
    const reason = prompt(`Enter reason for BANNING user ${user.fullName}:`);
    if (reason) {
      handleStatusUpdate(user, UserStatus.BANNED, reason);
    }
  };
  
  const openChangePasswordModal = (user: AdminManagedUser) => {
    setCurrentUserForAction(user);
    setNewPassword('');
    setConfirmNewPassword('');
    setIsChangePasswordModalOpen(true);
  };
  
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUserForAction) return;
    if (newPassword !== confirmNewPassword) return showToast('Passwords do not match.', 'error');
    
    try {
        await apiClient(`/api/admin/users/${currentUserForAction.id}/password`, {
            method: 'PUT', body: { newPassword },
        });
        showToast(`Password for ${currentUserForAction.fullName} changed.`, 'success');
        setIsChangePasswordModalOpen(false);
    } catch (err: any) {
        showToast(err.message, 'error');
    }
  };

  const handleBulkSuspend = async () => {
    if (selectedUsers.size === 0) {
        showToast("No users selected.", 'error');
        return;
    }
    const reason = prompt(`Enter reason for suspending ${selectedUsers.size} users:`);
    if (reason) {
        try {
            const userIds = Array.from(selectedUsers);
            await apiClient('/api/admin/users/bulk-status', {
                method: 'PUT',
                body: { userIds, status: UserStatus.SUSPENDED, reason }
            });
            showToast(`${selectedUsers.size} users suspended.`, 'success');
            fetchUsers();
            setSelectedUsers(new Set());
        } catch (err: any) {
            showToast(err.message, 'error');
        }
    }
  };


  // Other mock handlers
  const handleBulkImport = () => showToast("Bulk Import feature coming soon.", 'info');
  const handleBulkExport = () => showToast("Bulk Export feature coming soon.", 'info');
  const handleBulkTag = () => { if (selectedUsers.size === 0) { showToast("No users selected.", 'error'); return; } showToast(`Bulk Tag feature coming soon.`, 'info'); };
  const handleBulkMessage = () => { if (selectedUsers.size === 0) { showToast("No users selected.", 'error'); return; } showToast(`Bulk Message feature coming soon.`, 'info'); };


  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <UserGroupIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      
      <form onSubmit={handleSearch} className="bg-gray-700 p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <Input id="searchTerm" name="searchTerm" label="Search Name/Email" placeholder="Enter to search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
          <Select id="statusFilter" name="status" label="Status" options={mockFilterOptions.status} value={filters.status} onChange={handleFilterChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
          <Select id="membershipPlanFilter" name="membershipPlan" label="Membership Plan" options={mockFilterOptions.membershipPlan} value={filters.membershipPlan} onChange={handleFilterChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
          <Button type="submit" variant="primary" className="!bg-rose-500 hover:!bg-rose-600 h-10">Search Users</Button>
        </div>
      </form>
      
      <div className="bg-gray-700 p-4 rounded-lg shadow flex flex-col sm:flex-row flex-wrap gap-3">
          <Button variant="secondary" onClick={handleBulkImport} className="!bg-blue-600 hover:!bg-blue-700 !text-white text-xs sm:text-sm"><CloudArrowUpIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Import (CSV)</Button>
          <Button variant="secondary" onClick={handleBulkExport} className="!bg-green-600 hover:!bg-green-700 !text-white text-xs sm:text-sm"><ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Export Users</Button>
          <Button variant="secondary" onClick={handleBulkMessage} className="!bg-purple-600 hover:!bg-purple-700 !text-white text-xs sm:text-sm"><PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Bulk Message</Button>
          <Button variant="secondary" onClick={handleBulkTag} className="!bg-indigo-600 hover:!bg-indigo-700 !text-white text-xs sm:text-sm"><TagIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Bulk Tag</Button>
          <Button variant="secondary" onClick={handleBulkSuspend} className="!bg-yellow-600 hover:!bg-yellow-700 !text-black text-xs sm:text-sm"><ShieldExclamationIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Bulk Suspend</Button>
      </div>

      <div className="bg-gray-700 shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-750">
            <tr>
              <th scope="col" className="px-2 py-3"><input type="checkbox" onChange={handleSelectAllUsers} className="form-checkbox h-4 w-4 text-rose-500 bg-gray-600 border-gray-500 rounded focus:ring-rose-500" /></th>
              {['User', 'Details', 'Status', 'Last Login', 'Actions'].map(header => (
                <th key={header} scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {isLoading ? (
              <tr><td colSpan={8} className="text-center py-10 text-gray-400">Loading users...</td></tr>
            ) : users.length > 0 ? (
              users.map(user => (
              <tr key={user.id} className="hover:bg-gray-650 transition-colors">
                <td className="px-2 py-3"><input type="checkbox" checked={selectedUsers.has(user.id)} onChange={() => handleSelectUser(user.id)} className="form-checkbox h-4 w-4 text-rose-500 bg-gray-600 border-gray-500 rounded focus:ring-rose-500" /></td>
                <td className="px-3 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-white flex items-center">
                        {user.fullName} 
                        <MembershipBadge tier={user.membershipTier} size="sm" className="ml-1.5" />
                        {user.isVerifiedByAdmin && <CheckBadgeIcon className="w-4 h-4 inline text-green-400 ml-1" title="Admin Verified"/>}
                    </div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-300">
                    {user.gender}, {user.city || 'N/A'} <br/>
                    Plan: <span className="font-semibold">{user.membershipTier}</span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === UserStatus.ACTIVE ? 'bg-green-700 text-green-100' :
                    user.status === UserStatus.INACTIVE ? 'bg-gray-500 text-gray-100' :
                    user.status === UserStatus.PENDING_APPROVAL ? 'bg-yellow-700 text-yellow-100' :
                    user.status === UserStatus.SUSPENDED ? 'bg-orange-700 text-orange-100' :
                    'bg-red-700 text-red-200'
                  }`}>
                    {user.status}
                  </span>
                </td>
                 <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-400">
                    {user.lastLoginDate ? new Date(user.lastLoginDate).toLocaleString() : 'N/A'}
                 </td>
                <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex flex-wrap gap-1 justify-end">
                    <Button onClick={() => openViewModal(user)} size="sm" variant="secondary" className="!text-xs !py-0.5 !px-1.5 !bg-teal-600 hover:!bg-teal-700 !text-white" title="View Full Details"><EyeIcon className="w-3.5 h-3.5"/></Button>
                    <Button onClick={() => openEditModal(user)} size="sm" variant="secondary" className="!text-xs !py-0.5 !px-1.5 !bg-blue-600 hover:!bg-blue-700 !text-white" title="Edit Profile"><PencilIcon className="w-3.5 h-3.5"/></Button>
                    {user.status === UserStatus.PENDING_APPROVAL && <Button onClick={() => handleStatusUpdate(user, UserStatus.ACTIVE)} size="sm" variant="primary" className="!text-xs !py-0.5 !px-1.5 !bg-green-600 hover:!bg-green-700" title="Approve Registration">Approve</Button>}
                    {user.status !== UserStatus.SUSPENDED && user.status !== UserStatus.BANNED && <Button onClick={() => openSuspendModal(user)} size="sm" variant="secondary" className="!text-xs !py-0.5 !px-1.5 !bg-yellow-600 hover:!bg-yellow-700 !text-black" title="Suspend Account"><ShieldExclamationIcon className="w-3.5 h-3.5"/></Button>}
                    {user.status === UserStatus.SUSPENDED && <Button onClick={() => handleStatusUpdate(user, UserStatus.ACTIVE)} size="sm" variant="secondary" className="!text-xs !py-0.5 !px-1.5 !bg-green-500 hover:!bg-green-600 !text-white" title="Unsuspend Account"><LockOpenIcon className="w-3.5 h-3.5"/></Button>}
                    {user.status !== UserStatus.BANNED && <Button onClick={() => handleBanUser(user)} size="sm" variant="danger" className="!text-xs !py-0.5 !px-1.5 !bg-red-600 hover:!bg-red-700" title="Ban Account"><ShieldExclamationIcon className="w-3.5 h-3.5"/></Button>}
                    <Button onClick={() => openChangePasswordModal(user)} size="sm" variant="secondary" className="!text-xs !py-0.5 !px-1.5 !bg-gray-500 hover:!bg-gray-400" title="Change Password"><KeyIcon className="w-3.5 h-3.5"/></Button>
                  </div>
                </td>
              </tr>
              ))
            ) : (
              <tr><td colSpan={8} className="text-center py-10 text-gray-400">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

       {/* View Details Modal */}
      {isViewModalOpen && currentUserForAction && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-4xl text-gray-100 max-h-[90vh] flex flex-col">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
                      <div className="flex items-center">
                          <img src={currentUserForAction.profilePhotoUrl || ''} alt={currentUserForAction.fullName} className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-rose-400"/>
                          <div>
                            <h3 className="text-xl font-semibold">{currentUserForAction.fullName}</h3>
                            <p className="text-xs text-gray-400">User ID: {currentUserForAction.id}</p>
                          </div>
                      </div>
                      <Button type="button" variant="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>
                  </div>
                  <div className="overflow-y-auto pr-2 space-y-6 flex-grow custom-scrollbar">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          {/* Basic Info */}
                          <div>
                              <h4 className="text-md font-semibold text-rose-400 mb-2 flex items-center"><UserIcon className="w-5 h-5 mr-2"/> Basic & Personal Info</h4>
                              <InfoItem label="Full Name" value={currentUserForAction.fullName} />
                              <InfoItem label="Email" value={currentUserForAction.email} />
                              <InfoItem label="Mobile" value={currentUserForAction.mobileNumber} />
                              <InfoItem label="Gender" value={currentUserForAction.gender} />
                              <InfoItem label="Date of Birth" value={currentUserForAction.dateOfBirth ? new Date(currentUserForAction.dateOfBirth).toLocaleDateString() : 'N/A'} />
                              <InfoItem label="Height" value={`${currentUserForAction.heightValue || ''} ${currentUserForAction.heightUnit || ''}`} />
                              <InfoItem label="Weight" value={`${currentUserForAction.weightValue || ''} ${currentUserForAction.weightUnit || ''}`} />
                              <InfoItem label="Marital Status" value={currentUserForAction.maritalStatus} />
                              <InfoItem label="Religion" value={currentUserForAction.religion} />
                              <InfoItem label="Caste" value={currentUserForAction.caste} />
                              <InfoItem label="Sub-caste" value={currentUserForAction.subCaste} />
                              <InfoItem label="Manglik?" value={currentUserForAction.manglikStatus} />
                              <InfoItem label="Mother Tongue" value={currentUserForAction.motherTongue} />
                              <InfoItem label="Location" value={`${currentUserForAction.city}, ${currentUserForAction.state}, ${currentUserForAction.country}`} />
                          </div>
                          {/* Admin Info */}
                          <div>
                              <h4 className="text-md font-semibold text-rose-400 mb-2 flex items-center"><ShieldExclamationIcon className="w-5 h-5 mr-2"/> Admin Information</h4>
                              <InfoItem label="Status" value={currentUserForAction.status} />
                              <InfoItem label="Membership Tier" value={currentUserForAction.membershipTier} />
                              <InfoItem label="Email Verified" value={currentUserForAction.isVerified ? 'Yes' : 'No'} />
                              <InfoItem label="Admin Verified" value={currentUserForAction.isVerifiedByAdmin ? 'Yes' : 'No'} />
                              <InfoItem label="Last Login Date" value={currentUserForAction.lastLoginDate ? new Date(currentUserForAction.lastLoginDate).toLocaleString() : 'N/A'} />
                              <InfoItem label="Last Login IP" value={currentUserForAction.lastLoginIP} />
                              <InfoItem label="Suspension Reason" value={currentUserForAction.suspensionReason} />
                              <InfoItem label="Ban Reason" value={currentUserForAction.banReason} />
                              <InfoItem label="Internal Notes" value={currentUserForAction.internalNotes} />
                          </div>
                          {/* Family & Lifestyle */}
                           <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                <div>
                                    <h4 className="text-md font-semibold text-rose-400 mb-2 mt-4 flex items-center"><UserGroupIcon className="w-5 h-5 mr-2"/> Family Details</h4>
                                    <InfoItem label="Father's Occupation" value={currentUserForAction.fatherOccupation} />
                                    <InfoItem label="Mother's Occupation" value={currentUserForAction.motherOccupation} />
                                    <InfoItem label="Brothers" value={`${currentUserForAction.brothers} (${currentUserForAction.marriedBrothers} married)`} />
                                    <InfoItem label="Sisters" value={`${currentUserForAction.sisters} (${currentUserForAction.marriedSisters} married)`} />
                                    <InfoItem label="Family Type" value={currentUserForAction.familyType} />
                                    <InfoItem label="Family Values" value={currentUserForAction.familyValues} />
                                </div>
                                <div>
                                     <h4 className="text-md font-semibold text-rose-400 mb-2 mt-4 flex items-center"><BookOpenIcon className="w-5 h-5 mr-2"/> Lifestyle & Education</h4>
                                    <InfoItem label="Diet" value={currentUserForAction.dietaryHabits} />
                                    <InfoItem label="Smoking" value={currentUserForAction.smokingHabits} />
                                    <InfoItem label="Drinking" value={currentUserForAction.drinkingHabits} />
                                    <InfoItem label="Hobbies" value={currentUserForAction.hobbies} />
                                    <InfoItem label="Education" value={currentUserForAction.education} />
                                    <InfoItem label="Occupation" value={currentUserForAction.occupation} />
                                    <InfoItem label="Annual Income" value={currentUserForAction.annualIncome} />
                                </div>
                           </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

       {/* Edit Modal */}
       {isEditModalOpen && currentUserForAction && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <form onSubmit={saveProfileChanges} className="bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-lg text-gray-100 max-h-[90vh] flex flex-col">
                  <h3 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">Edit User: {currentUserForAction.fullName}</h3>
                  <div className="overflow-y-auto pr-2 space-y-3 flex-grow custom-scrollbar">
                      <Input id="edit-fullName" name="fullName" label="Full Name" value={editableUserData.fullName || ''} onChange={handleEditableDataChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
                      <Input id="edit-email" name="email" type="email" label="Email" value={editableUserData.email || ''} onChange={handleEditableDataChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
                      <Select id="edit-membershipTier" name="membershipTier" label="Membership Tier" options={[...Object.values(MembershipTier).map(t => ({value: t, label: t}))]} value={editableUserData.membershipTier || ''} onChange={handleEditableDataChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
                      <Select id="edit-status" name="status" label="User Status" options={[...Object.values(UserStatus).map(s => ({value: s, label: s}))]} value={editableUserData.status || ''} onChange={handleEditableDataChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
                      <div className="flex items-center pt-2">
                          <input type="checkbox" id="edit-isVerifiedByAdmin" name="isVerifiedByAdmin" checked={!!editableUserData.isVerifiedByAdmin} onChange={handleEditableDataChange} className="h-4 w-4 text-rose-500 bg-gray-600 border-gray-500 rounded focus:ring-rose-500" />
                          <label htmlFor="edit-isVerifiedByAdmin" className="ml-2 text-sm text-gray-300">Mark as Admin Verified</label>
                      </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-600">
                      <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                      <Button type="submit" variant="primary" className="!bg-rose-500">Save Changes</Button>
                  </div>
              </form>
          </div>
      )}

       {/* Suspend Modal */}
      {isSuspendModalOpen && currentUserForAction && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-md text-gray-100">
                <h3 className="text-lg font-semibold mb-4">Suspend User: {currentUserForAction.fullName}</h3>
                <Input id="suspensionReason" name="suspensionReason" label="Reason for Suspension" value={suspensionReason} onChange={e => setSuspensionReason(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" required/>
                <Input type="date" id="suspensionEndDate" name="suspensionEndDate" label="Suspension End Date (Optional)" value={suspensionEndDate} onChange={e => setSuspensionEndDate(e.target.value)} className="mt-3 [&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500"/>
                <div className="flex justify-end space-x-3 mt-4">
                    <Button variant="secondary" onClick={() => setIsSuspendModalOpen(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleSuspendUser} className="!bg-yellow-600 hover:!bg-yellow-700 !text-black">Confirm Suspension</Button>
                </div>
            </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && currentUserForAction && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleChangePassword} className="bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-md text-gray-100 space-y-3">
                <h3 className="text-lg font-semibold">Change Password for: {currentUserForAction.fullName}</h3>
                <Input type="password" id="newPassword" name="newPassword" label="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" required/>
                <Input type="password" id="confirmNewPassword" name="confirmNewPassword" label="Confirm New Password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" required/>
                <div className="flex justify-end space-x-3 pt-2">
                    <Button type="button" variant="secondary" onClick={() => setIsChangePasswordModalOpen(false)}>Cancel</Button>
                    <Button type="submit" variant="primary" className="!bg-rose-500">Set New Password</Button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
};

export default UserManagementView;