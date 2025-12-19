import React, { useState, useMemo, ChangeEvent, FormEvent, useEffect } from 'react';
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

const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<AdminManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    gender: '', city: '', caste: '', membershipPlan: '', status: '', lastLoginDateRange: ''
  });
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [isLoginActivityModalOpen, setIsLoginActivityModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  
  const [currentUserForAction, setCurrentUserForAction] = useState<AdminManagedUser | null>(null);
  const [editableUserData, setEditableUserData] = useState<Partial<AdminManagedUser>>({});
  const [userNotes, setUserNotes] = useState('');
  const [userTagsInput, setUserTagsInput] = useState('');
  const [suspensionReason, setSuspensionReason] = useState('');
  const [suspensionEndDate, setSuspensionEndDate] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await apiClient('/api/admin/users');
        setUsers(data);
      } catch (error: any) {
        showToast(error.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [showToast]);

  const mockFilterOptions = {
    gender: [{value: '', label: 'Any Gender'}, ...GENDER_OPTIONS],
    caste: [{value: '', label: 'Any Caste'}, {value: 'Brahmin', label: 'Brahmin'}, {value: 'Patel', label: 'Patel'}, {value: 'Khatri', label: 'Khatri'}, {value: 'Other', label: 'Other'}],
    membershipPlan: [{value: '', label: 'Any Plan'}, {value: 'Free', label: 'Free'}, {value: 'Silver', label: 'Silver'}, {value: 'Gold', label: 'Gold'}],
    status: [{value: '', label: 'Any Status'}, ...Object.values(UserStatus).map(s => ({value: s, label: s}))],
    loginActivity: [{value:'', label:'Any Activity'}, {value:'today', label:'Logged in Today'}, {value:'this_week', label:'Logged in This Week'}, {value:'inactive_30_days', label:'Inactive >30 days'}]
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchMatch = searchTerm === '' || 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user as any)._id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const genderMatch = filters.gender === '' || user.gender === filters.gender;
      const cityMatch = filters.city === '' || user.city?.toLowerCase().includes(filters.city.toLowerCase());
      const casteMatch = filters.caste === '' || user.caste?.toLowerCase().includes(filters.caste.toLowerCase());
      const planMatch = filters.membershipPlan === '' || user.membershipTier === filters.membershipPlan;
      const statusMatch = filters.status === '' || user.status === filters.status;
      const loginActivityMatch = filters.lastLoginDateRange === '' || (filters.lastLoginDateRange === 'today' && user.lastLoginDate?.startsWith(new Date().toISOString().split('T')[0]));


      return searchMatch && genderMatch && cityMatch && casteMatch && planMatch && statusMatch && loginActivityMatch;
    });
  }, [users, searchTerm, filters]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSearch = () => {
    showToast("Filtering users locally. In production, this would trigger an API call.", 'info');
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
      setSelectedUsers(new Set(filteredUsers.map(u => (u as any)._id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const openEditModal = (user: AdminManagedUser) => {
    setCurrentUserForAction(user);
    setEditableUserData({ ...user }); 
    setIsEditModalOpen(true);
  };

  const handleProfileEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name, value, type} = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setEditableUserData(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}));
  };

  const saveProfileChanges = (e: FormEvent) => {
    e.preventDefault();
    if (!currentUserForAction) return;
    setUsers(prevUsers => prevUsers.map(u => u.id === currentUserForAction.id ? { ...u, ...editableUserData } : u));
    showToast(`Profile for ${currentUserForAction.fullName} updated (mock).`, 'success');
    setIsEditModalOpen(false);
    setCurrentUserForAction(null);
  };
  
  const toggleVerification = (user: AdminManagedUser) => {
    const verificationNote = user.isVerified ? "User un-verified." : prompt("Enter reason/note for marking as verified:", "Admin verified ID document.");
    if (!user.isVerified && verificationNote === null) return; 

    setUsers(prev => prev.map(u => u.id === user.id ? {...u, isVerified: !u.isVerified, internalNotes: `${u.internalNotes || ''}\nVerification Status Change: ${verificationNote}`.trim() } : u));
    showToast(`User ${user.fullName} verification status updated.`, 'success');
  };

  const openSuspendModal = (user: AdminManagedUser) => {
    setCurrentUserForAction(user);
    setSuspensionReason(user.suspensionReason || '');
    setSuspensionEndDate(user.suspensionEndDate || '');
    setIsSuspendModalOpen(true);
  };
  
  const handleSuspendUser = () => {
    if(!currentUserForAction) return;
    setUsers(prev => prev.map(u => u.id === currentUserForAction.id ? {...u, status: UserStatus.SUSPENDED, suspensionReason, suspensionEndDate, internalNotes: `${u.internalNotes || ''}\nSuspended: ${suspensionReason} until ${suspensionEndDate || 'further notice'}`.trim()} : u));
    showToast(`User ${currentUserForAction.fullName} suspended.`, 'info');
    setIsSuspendModalOpen(false);
    setCurrentUserForAction(null);
  };

  const handleUnsuspendUser = (user: AdminManagedUser) => {
    setUsers(prev => prev.map(u => u.id === user.id ? {...u, status: UserStatus.ACTIVE, suspensionReason: undefined, suspensionEndDate: undefined, internalNotes: `${u.internalNotes || ''}\nAccount Unsuspended.`.trim()} : u));
    showToast(`User ${user.fullName} unsuspended.`, 'success');
  };

  const handleBanUser = (user: AdminManagedUser) => {
    const reason = prompt(`Enter reason for BANNING user ${user.fullName}:`);
    if (reason) {
      setUsers(prev => prev.map(u => u.id === user.id ? {...u, status: UserStatus.BANNED, banReason: reason, internalNotes: `${u.internalNotes || ''}\nBANNED: ${reason}`.trim()} : u));
      showToast(`User ${user.fullName} BANNED.`, 'info');
    }
  };
  
  const openChangePasswordModal = (user: AdminManagedUser) => {
    setCurrentUserForAction(user);
    setIsChangePasswordModalOpen(true);
  };

  const closeChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
    setCurrentUserForAction(null);
    setNewPassword('');
    setConfirmNewPassword('');
  };
  
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUserForAction) return;

    if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters long.', 'error');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        showToast('Passwords do not match.', 'error');
        return;
    }

    try {
        const data = await apiClient(`/api/admin/users/${currentUserForAction.id}/password`, {
            method: 'PUT',
            body: { newPassword },
        });
        showToast(`Password for ${currentUserForAction.fullName} has been changed successfully.`, 'success');
        closeChangePasswordModal();
    } catch (err: any) {
        showToast(err.message, 'error');
    }
  };

  const openLoginActivityModal = (user: AdminManagedUser) => {
    setCurrentUserForAction(user);
    setIsLoginActivityModalOpen(true);
  };
  
  const openNotesModal = (user: AdminManagedUser) => {
    setCurrentUserForAction(user);
    setUserNotes(user.internalNotes || '');
    setIsNotesModalOpen(true);
  };
  
  const saveUserNotes = () => {
    if(!currentUserForAction) return;
    setUsers(prev => prev.map(u => u.id === currentUserForAction.id ? {...u, internalNotes: userNotes} : u));
    showToast(`Notes for ${currentUserForAction.fullName} saved.`, 'success');
    setIsNotesModalOpen(false);
    setCurrentUserForAction(null);
  };

  const openTagsModal = (user: AdminManagedUser) => {
    setCurrentUserForAction(user);
    setUserTagsInput((user.adminTags || []).join(', '));
    setIsTagsModalOpen(true);
  };

  const saveUserTags = () => {
    if(!currentUserForAction) return;
    const tagsArray = userTagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    setUsers(prev => prev.map(u => u.id === currentUserForAction.id ? {...u, adminTags: tagsArray} : u));
    showToast(`Tags for ${currentUserForAction.fullName} updated.`, 'success');
    setIsTagsModalOpen(false);
    setCurrentUserForAction(null);
  };

  const handleBulkImport = () => showToast("Mock: CSV import dialog would open.", 'info');
  const handleBulkExport = () => showToast(`Mock: Exporting ${selectedUsers.size > 0 ? selectedUsers.size + ' selected' : 'all ' + filteredUsers.length} users.`, 'info');
  const handleBulkTag = () => {
    if (selectedUsers.size === 0) { showToast("No users selected.", 'error'); return; }
    const tags = prompt(`Enter tags to assign to ${selectedUsers.size} users (comma-separated):`);
    if (tags) showToast(`Mock: Assigning tags "${tags}" to selected users.`, 'info');
  };
  const handleBulkSuspend = () => {
    if (selectedUsers.size === 0) { showToast("No users selected.", 'error'); return; }
    const reason = prompt(`Enter reason for suspending ${selectedUsers.size} users:`);
    if (reason) showToast(`Mock: Suspending selected users. Reason: ${reason}`, 'info');
  };
   const handleBulkMessage = () => {
    if (selectedUsers.size === 0) { showToast("No users selected.", 'error'); return; }
    showToast(`Mock: Opening bulk message tool for ${selectedUsers.size} users.`, 'info');
  };

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <UserGroupIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      <p className="text-gray-300">
        View, manage, and moderate user accounts. Approve new registrations, edit profiles, handle account statuses, view login activity, and assign tags.
      </p>

      {/* Filters and Search */}
      <div className="bg-gray-700 p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <Input id="searchTerm" name="searchTerm" label="Search Name/Email/ID" placeholder="Enter to search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
          <Input id="cityFilter" name="city" label="City" placeholder="Filter by city" value={filters.city} onChange={handleFilterChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
          <Select id="genderFilter" name="gender" label="Gender" options={mockFilterOptions.gender} value={filters.gender} onChange={handleFilterChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
          <Select id="casteFilter" name="caste" label="Caste" options={mockFilterOptions.caste} value={filters.caste} onChange={handleFilterChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
          <Select id="membershipPlanFilter" name="membershipPlan" label="Membership Plan" options={mockFilterOptions.membershipPlan} value={filters.membershipPlan} onChange={handleFilterChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
          <Select id="statusFilter" name="status" label="Status" options={mockFilterOptions.status} value={filters.status} onChange={handleFilterChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
          <Select id="loginActivityFilter" name="lastLoginDateRange" label="Login Activity" options={mockFilterOptions.loginActivity} value={filters.lastLoginDateRange} onChange={handleFilterChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
          <Button variant="primary" onClick={handleSearch} className="!bg-rose-500 hover:!bg-rose-600 h-10">Search Users</Button>
        </div>
        <div className="mt-2 text-right">
            <Button variant="secondary" size="sm" className="!text-xs" onClick={() => showToast("Mock: Saving current filter preset.", 'info')}>Save Filter Preset</Button>
        </div>
      </div>
      
      {/* Bulk Actions */}
      <div className="bg-gray-700 p-4 rounded-lg shadow flex flex-col sm:flex-row flex-wrap gap-3">
          <Button variant="secondary" onClick={handleBulkImport} className="!bg-blue-600 hover:!bg-blue-700 !text-white text-xs sm:text-sm"><CloudArrowUpIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Import (CSV)</Button>
          <Button variant="secondary" onClick={handleBulkExport} className="!bg-green-600 hover:!bg-green-700 !text-white text-xs sm:text-sm"><ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Export Users</Button>
          <Button variant="secondary" onClick={handleBulkMessage} className="!bg-purple-600 hover:!bg-purple-700 !text-white text-xs sm:text-sm"><PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Bulk Message</Button>
          <Button variant="secondary" onClick={handleBulkTag} className="!bg-indigo-600 hover:!bg-indigo-700 !text-white text-xs sm:text-sm"><TagIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Bulk Tag</Button>
          <Button variant="secondary" onClick={handleBulkSuspend} className="!bg-yellow-600 hover:!bg-yellow-700 !text-black text-xs sm:text-sm"><ShieldExclamationIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Bulk Suspend</Button>
      </div>

      {/* User Table */}
      <div className="bg-gray-700 shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-750">
            <tr>
              <th scope="col" className="px-2 py-3"><input type="checkbox" onChange={handleSelectAllUsers} className="form-checkbox h-4 w-4 text-rose-500 bg-gray-600 border-gray-500 rounded focus:ring-rose-500" /></th>
              {['User', 'Details', 'Status', 'Trust', 'Login', 'Tags', 'Actions'].map(header => (
                <th key={header} scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {isLoading ? (
              <tr><td colSpan={8} className="text-center py-10 text-gray-400">Loading users...</td></tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
              <tr key={(user as any)._id} className="hover:bg-gray-650 transition-colors">
                <td className="px-2 py-3"><input type="checkbox" checked={selectedUsers.has((user as any)._id)} onChange={() => handleSelectUser((user as any)._id)} className="form-checkbox h-4 w-4 text-rose-500 bg-gray-600 border-gray-500 rounded focus:ring-rose-500" /></td>
                <td className="px-3 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-white flex items-center">
                        {user.fullName} 
                        <MembershipBadge tier={user.membershipTier} size="sm" className="ml-1.5" />
                        {user.isVerified && <CheckBadgeIcon className="w-4 h-4 inline text-green-400 ml-1" title="Verified"/>}
                    </div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                    <div className="text-xs text-gray-500">{(user as any)._id}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-300">
                    {user.gender}, {user.city}, {user.caste} <br/>
                    Plan: <span className="font-semibold">{user.membershipTier}</span> <br/>
                    Profile: {user.profileCompletion}%
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === UserStatus.ACTIVE ? 'bg-green-700 text-green-100' :
                    user.status === UserStatus.INACTIVE ? 'bg-gray-500 text-gray-100' :
                    user.status === UserStatus.PENDING_APPROVAL ? 'bg-yellow-700 text-yellow-100' :
                    user.status === UserStatus.SUSPENDED ? 'bg-orange-700 text-orange-100' :
                    'bg-red-700 text-red-200' // Banned
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300">
                  <span className={`font-semibold ${user.aiTrustScore && user.aiTrustScore > 70 ? 'text-green-400' : user.aiTrustScore && user.aiTrustScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {user.aiTrustScore || 'N/A'}
                  </span>
                  {user.aiTrustScore && <div className="w-full bg-gray-600 rounded-full h-1 mt-0.5"><div className={`h-1 rounded-full ${user.aiTrustScore > 70 ? 'bg-green-500' : user.aiTrustScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${user.aiTrustScore}%` }}></div></div>}
                </td>
                 <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-400">
                    {user.lastLoginDate ? new Date(user.lastLoginDate).toLocaleString() : 'N/A'} <br/> {user.lastLoginIP || 'N/A'}
                 </td>
                 <td className="px-3 py-3 whitespace-nowrap max-w-xs">
                    {(user.adminTags && user.adminTags.length > 0) ? user.adminTags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 mr-1 mb-1 inline-block text-[10px] font-semibold rounded-full bg-sky-700 text-sky-200">{tag}</span>
                    )) : <span className="text-xs text-gray-500">No tags</span>}
                 </td>
                <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex flex-wrap gap-1 justify-end">
                    <Button onClick={() => openEditModal(user)} size="sm" variant="secondary" className="!text-xs !py-0.5 !px-1.5 !bg-blue-600 hover:!bg-blue-700 !text-white" title="View/Edit Profile"><PencilIcon className="w-3.5 h-3.5"/></Button>
                    <Button onClick={() => toggleVerification(user)} size="sm" variant="secondary" className={`!text-xs !py-0.5 !px-1.5 ${user.isVerified ? '!bg-green-600 hover:!bg-green-700' : '!bg-gray-500 hover:!bg-gray-400'} !text-white`} title={user.isVerified ? "Unverify User" : "Mark as Verified"}><CheckBadgeIcon className="w-3.5 h-3.5"/></Button>
                    {user.status === UserStatus.PENDING_APPROVAL && <Button onClick={() => {setUsers(prev => prev.map(u => u.id === user.id ? {...u, status: UserStatus.ACTIVE} : u)); showToast(`Approved ${user.fullName}`, 'success')}} size="sm" variant="primary" className="!text-xs !py-0.5 !px-1.5 !bg-green-600 hover:!bg-green-700" title="Approve Registration">Approve</Button>}
                    {user.status !== UserStatus.SUSPENDED && user.status !== UserStatus.BANNED && <Button onClick={() => openSuspendModal(user)} size="sm" variant="secondary" className="!text-xs !py-0.5 !px-1.5 !bg-yellow-600 hover:!bg-yellow-700 !text-black" title="Suspend Account"><ShieldExclamationIcon className="w-3.5 h-3.5"/></Button>}
                    {user.status === UserStatus.SUSPENDED && <Button onClick={() => handleUnsuspendUser(user)} size="sm" variant="secondary" className="!text-xs !py-0.5 !px-1.5 !bg-green-500 hover:!bg-green-600 !text-white" title="Unsuspend Account"><LockOpenIcon className="w-3.5 h-3.5"/></Button>}
                    {user.status !== UserStatus.BANNED && <Button onClick={() => handleBanUser(user)} size="sm" variant="danger" className="!text-xs !py-0.5 !px-1.5 !bg-red-600 hover:!bg-red-700" title="Ban Account"><ShieldExclamationIcon className="w-3.5 h-3.5"/></Button>}
                    <Button onClick={() => openChangePasswordModal(user)} size="sm" variant="secondary" className="!text-xs !py-0.5 !px-1.5 !bg-gray-500 hover:!bg-gray-400" title="Change Password"><KeyIcon className="w-3.5 h-3.5"/></Button>
                    <Button onClick={() => openLoginActivityModal(user)} size="sm" variant="secondary" className="!text-xs !py-0.5 !px-1.5 !bg-gray-500 hover:!bg-gray-400" title="View Login Activity"><EyeIcon className="w-3.5 h-3.5"/></Button>
                    <Button onClick={() => openNotesModal(user)} size="sm" variant="secondary" className="!text-xs !py-0.5 !px-1.5 !bg-gray-500 hover:!bg-gray-400" title="Internal Notes"><DocumentTextIcon className="w-3.5 h-3.5"/></Button>
                    <Button onClick={() => openTagsModal(user)} size="sm" variant="secondary" className="!text-xs !py-0.5 !px-1.5 !bg-indigo-500 hover:!bg-indigo-400" title="Assign Tags"><TagIcon className="w-3.5 h-3.5"/></Button>
                  </div>
                </td>
              </tr>
            ))
            ) : (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">No users found matching your criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 text-center">Note: Pagination, column sorting will be added. Advanced filters apply client-side for this mock.</p>

      {isEditModalOpen && currentUserForAction && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <form onSubmit={saveProfileChanges} className="bg-gray-700 p-5 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-600 pb-2">
                <h3 className="text-xl font-semibold text-gray-100">Edit Profile: {currentUserForAction.fullName}</h3>
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsEditModalOpen(false)} className="!p-1.5 !rounded-full !bg-gray-600 hover:!bg-gray-500"><XMarkIcon className="w-4 h-4"/></Button>
            </div>
            <div className="overflow-y-auto space-y-3 pr-2 flex-grow">
                <Input id="editFullName" name="fullName" label="Full Name" value={editableUserData.fullName || ''} onChange={handleProfileEditChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
                <Input id="editEmail" name="email" label="Email" type="email" value={editableUserData.email || ''} onChange={handleProfileEditChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
                <Select id="editGender" name="gender" label="Gender" options={GENDER_OPTIONS} value={editableUserData.gender || ''} onChange={handleProfileEditChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
                <Input id="editCity" name="city" label="City" value={editableUserData.city || ''} onChange={handleProfileEditChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
                <Input id="editCaste" name="caste" label="Caste" value={editableUserData.caste || ''} onChange={handleProfileEditChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
                <Select id="editMembershipPlan" name="membershipTier" label="Membership Plan" options={mockFilterOptions.membershipPlan.filter(o => o.value !== '')} value={editableUserData.membershipTier || ''} onChange={handleProfileEditChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
                <Select id="editStatus" name="status" label="Account Status" options={mockFilterOptions.status.filter(o => o.value !== '')} value={editableUserData.status || ''} onChange={handleProfileEditChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
                <Input id="editAiTrustScore" name="aiTrustScore" type="number" label="AI Trust Score (0-100)" value={String(editableUserData.aiTrustScore || '')} onChange={handleProfileEditChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
                <div className="flex items-center">
                    <input type="checkbox" id="editIsVerified" name="isVerified" checked={!!editableUserData.isVerified} onChange={handleProfileEditChange} className="h-4 w-4 text-rose-500 bg-gray-600 border-gray-500 rounded focus:ring-rose-500" />
                    <label htmlFor="editIsVerified" className="ml-2 text-sm text-gray-300">Manually Verified</label>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-3 border-t border-gray-600 mt-3">
                <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" className="!bg-rose-500 hover:!bg-rose-600">Save Changes</Button>
            </div>
          </form>
        </div>
      )}

      {isChangePasswordModalOpen && currentUserForAction && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <form onSubmit={handleChangePassword} className="bg-gray-700 p-5 rounded-lg shadow-xl w-full max-w-md flex flex-col">
                <div className="flex justify-between items-center mb-3 border-b border-gray-600 pb-2">
                    <h3 className="text-xl font-semibold text-gray-100">Set New Password for {currentUserForAction.fullName}</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={closeChangePasswordModal} className="!p-1.5 !rounded-full !bg-gray-600 hover:!bg-gray-500"><XMarkIcon className="w-4 h-4"/></Button>
                </div>
                <div className="space-y-4">
                    <Input 
                        id="newPassword" 
                        name="newPassword" 
                        type="password"
                        label="New Password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" 
                        required 
                    />
                    <Input 
                        id="confirmNewPassword" 
                        name="confirmNewPassword" 
                        type="password"
                        label="Confirm New Password" 
                        value={confirmNewPassword} 
                        onChange={(e) => setConfirmNewPassword(e.target.value)} 
                        className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" 
                        required 
                    />
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600 mt-4">
                    <Button type="button" variant="secondary" onClick={closeChangePasswordModal}>Cancel</Button>
                    <Button type="submit" variant="primary" className="!bg-rose-500 hover:!bg-rose-600">Set Password</Button>
                </div>
            </form>
        </div>
      )}

      {isLoginActivityModalOpen && currentUserForAction && (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-gray-700 p-5 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-3 border-b border-gray-600 pb-2">
                    <h3 className="text-xl font-semibold text-gray-100">Login Activity: {currentUserForAction.fullName}</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={() => setIsLoginActivityModalOpen(false)} className="!p-1.5 !rounded-full !bg-gray-600 hover:!bg-gray-500"><XMarkIcon className="w-4 h-4"/></Button>
                </div>
                <div className="overflow-y-auto space-y-2 pr-1 flex-grow">
                    {(currentUserForAction.loginActivity && currentUserForAction.loginActivity.length > 0) ? currentUserForAction.loginActivity.map(log => (
                        <div key={log.id} className="p-2 bg-gray-650 rounded text-xs">
                            <p><strong>Time:</strong> {log.timestamp} - <strong>Status:</strong> <span className={log.status === 'Success' ? 'text-green-400' : 'text-red-400'}>{log.status}</span></p>
                            <p><strong>IP:</strong> {log.ipAddress} ({log.location})</p>
                            <p><strong>Device:</strong> {log.deviceInfo}</p>
                        </div>
                    )) : <p className="text-gray-400 text-center py-4">No login activity recorded.</p>}
                </div>
            </div>
        </div>
      )}

      {isNotesModalOpen && currentUserForAction && (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-gray-700 p-5 rounded-lg shadow-xl w-full max-w-md flex flex-col">
                <div className="flex justify-between items-center mb-3 border-b border-gray-600 pb-2">
                    <h3 className="text-xl font-semibold text-gray-100">Internal Notes: {currentUserForAction.fullName}</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={() => setIsNotesModalOpen(false)} className="!p-1.5 !rounded-full !bg-gray-600 hover:!bg-gray-500"><XMarkIcon className="w-4 h-4"/></Button>
                </div>
                <textarea value={userNotes} onChange={(e) => setUserNotes(e.target.value)} rows={5} className="w-full bg-gray-600 text-white border-gray-500 rounded p-2 text-sm mb-3" placeholder="Add admin notes here..."></textarea>
                <div className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={() => setIsNotesModalOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={saveUserNotes} className="!bg-rose-500 hover:!bg-rose-600">Save Notes</Button>
                </div>
            </div>
        </div>
      )}

      {isTagsModalOpen && currentUserForAction && (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-gray-700 p-5 rounded-lg shadow-xl w-full max-w-md flex flex-col">
                <div className="flex justify-between items-center mb-3 border-b border-gray-600 pb-2">
                    <h3 className="text-xl font-semibold text-gray-100">Assign Tags: {currentUserForAction.fullName}</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={() => setIsTagsModalOpen(false)} className="!p-1.5 !rounded-full !bg-gray-600 hover:!bg-gray-500"><XMarkIcon className="w-4 h-4"/></Button>
                </div>
                <Input id="userTags" name="userTags" label="Tags (comma-separated)" value={userTagsInput} onChange={(e) => setUserTagsInput(e.target.value)} placeholder="e.g., High_Potential, Needs_Follow_Up" className="mb-3 [&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white"/>
                <div className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={() => setIsTagsModalOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={saveUserTags} className="!bg-rose-500 hover:!bg-rose-600">Save Tags</Button>
                </div>
            </div>
        </div>
      )}

      {isSuspendModalOpen && currentUserForAction && (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-gray-700 p-5 rounded-lg shadow-xl w-full max-w-md flex flex-col">
                <div className="flex justify-between items-center mb-3 border-b border-gray-600 pb-2">
                    <h3 className="text-xl font-semibold text-gray-100">Suspend User: {currentUserForAction.fullName}</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={() => setIsSuspendModalOpen(false)} className="!p-1.5 !rounded-full !bg-gray-600 hover:!bg-gray-500"><XMarkIcon className="w-4 h-4"/></Button>
                </div>
                <Input id="suspensionReason" name="suspensionReason" label="Reason for Suspension" value={suspensionReason} onChange={(e) => setSuspensionReason(e.target.value)} placeholder="e.g., Policy violation" className="mb-3 [&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" required/>
                <Input type="date" id="suspensionEndDate" name="suspensionEndDate" label="Suspension End Date (Optional)" value={suspensionEndDate} onChange={(e) => setSuspensionEndDate(e.target.value)} className="mb-3 [&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500"/>
                <div className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={() => setIsSuspendModalOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSuspendUser} className="!bg-yellow-600 hover:!bg-yellow-700 !text-black">Suspend User</Button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default UserManagementView;