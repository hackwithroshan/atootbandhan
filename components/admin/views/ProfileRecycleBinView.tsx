import React, {useState} from 'react';
import { ArchiveBoxArrowDownIcon } from '../../icons/ArchiveBoxArrowDownIcon';
import Button from '../../ui/Button';
import { ArrowPathIcon } from '../../icons/ArrowPathIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import Input from '../../ui/Input';

interface DeletedProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  dateDeleted: string;
  deletedBy: string; 
  reasonForDeletion?: string; // New
  daysUntilPermanentDeletion: number;
}

const ProfileRecycleBinView: React.FC = () => {
  const [deletedProfiles, setDeletedProfiles] = useState<DeletedProfile[]>([]);
  const [reason, setReason] = useState(''); // For logging restore/delete reason

  const handleRestore = (userId: string) => {
    const restoreReason = prompt(`Enter reason for restoring profile ${userId} (optional):`) || "Admin decision";
    alert(`Mock: User profile ${userId} restored. Reason: ${restoreReason}.`);
    // Logic to remove from this list and update status
  };

  const handlePermanentDelete = (userId: string) => {
    const deleteReason = prompt(`Enter reason for PERMANENTLY deleting profile ${userId} (optional):`) || "Cleanup policy";
    if (window.confirm(`Are you sure you want to permanently delete profile ${userId}? This action cannot be undone. Reason: ${deleteReason}`)) {
      alert(`Mock: User profile ${userId} permanently deleted. Reason: ${deleteReason}.`);
      // Logic to permanently remove data
    }
  };

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <ArchiveBoxArrowDownIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Profile Recycle Bin</h1>
      </div>
      <p className="text-gray-300">
        View and manage soft-deleted user profiles. Profiles are restorable within 30 days (configurable). Log reasons for deletion/restoration.
      </p>
      {/* Add general UI enhancement comments here */}
      {/* E.g. Real-time Search, Column Sorting, Pagination, Filter Save Presets are planned for this table. */}

      {/* Deleted Profiles Table */}
      <div className="bg-gray-700 shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-750">
            <tr>
              {['User Name (ID)', 'Email', 'Date Deleted', 'Deleted By', 'Reason', 'Restore In', 'Actions'].map(header => (
                <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {deletedProfiles.length > 0 ? deletedProfiles.map(profile => (
              <tr key={profile.id} className={`hover:bg-gray-650 transition-colors ${profile.daysUntilPermanentDeletion <= 0 ? 'opacity-60' : ''}`}>
                <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{profile.name}</div>
                    <div className="text-xs text-gray-400">({profile.userId})</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{profile.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{profile.dateDeleted}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{profile.deletedBy}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400 max-w-[150px] truncate" title={profile.reasonForDeletion}>{profile.reasonForDeletion || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {profile.daysUntilPermanentDeletion > 0 ? 
                        <span className="text-yellow-400">{profile.daysUntilPermanentDeletion} days</span> :
                        <span className="text-red-400">Past Due</span>
                    }
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-1">
                  {profile.daysUntilPermanentDeletion > 0 && (
                    <Button 
                        size="sm" 
                        variant="primary" 
                        className="!text-xs !py-1 !px-2 !bg-green-600 hover:!bg-green-700"
                        onClick={() => handleRestore(profile.userId)}
                        title="Restore User Profile"
                    >
                      <ArrowPathIcon className="w-4 h-4 mr-1" /> Restore
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="danger" 
                    className="!text-xs !py-1 !px-2 !bg-red-700 hover:!bg-red-800"
                    onClick={() => handlePermanentDelete(profile.userId)}
                    title="Delete User Profile Permanently"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" /> Delete Permanently
                  </Button>
                </td>
              </tr>
            )) : (
                <tr><td colSpan={7} className="text-center py-6 text-gray-400">Recycle bin is empty.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 text-center">
        This is a mock implementation. Real systems require robust data handling for soft deletes, audit logging reasons, and GDPR-compliant permanent deletion.
      </p>
    </div>
  );
};

export default ProfileRecycleBinView;