import React, { useState } from 'react';
import { UserGroupIcon } from '../../icons/UserGroupIcon';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { AdminRole } from '../../../types';

const RoleAccessManagementView: React.FC = () => {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>(AdminRole.PROFILE_MODERATOR);
  const [admins, setAdmins] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  
  const adminRoleOptions = Object.values(AdminRole).map(role => ({ value: role, label: role }));

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new admin (mock):', { email: newAdminEmail, role: newAdminRole });
    alert(`Mock: Admin ${newAdminEmail} with role ${newAdminRole} would be added. Default permissions applied.`);
    setNewAdminEmail('');
  };

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <UserGroupIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Role & Access Management</h1>
      </div>
      <p className="text-gray-300">
        Add sub-admins, assign roles (Super Admin, Finance Admin, Match Moderator, Content Manager), set permissions per module (Read/Edit/Delete), and view audit logs of admin activities including IP tracking.
      </p>

      {/* Add New Admin Form */}
      <form onSubmit={handleAddAdmin} className="bg-gray-700 p-6 rounded-lg shadow-xl space-y-4 md:flex md:space-y-0 md:space-x-4 md:items-end">
        <Input id="newAdminEmail" name="newAdminEmail" type="email" label="New Admin Email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="admin.email@example.com" className="flex-grow [&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" required />
        <Select id="newAdminRole" name="newAdminRole" label="Assign Role" options={adminRoleOptions} value={newAdminRole} onChange={(e) => setNewAdminRole(e.target.value as AdminRole)} className="md:w-1/3 [&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" required />
        <Button type="submit" variant="primary" className="!bg-green-600 hover:!bg-green-700 md:self-end md:h-[42px] mt-4 md:mt-0">Add Sub-Admin</Button>
      </form>

      {/* Existing Admins Table */}
      <div className="bg-gray-700 p-4 rounded-lg shadow-xl overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Current Admin Users</h2>
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-750">
            <tr>
              {['Email', 'Role', 'Last Login', 'IP Address', 'Location', 'Actions'].map(header => (
                <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {admins.length > 0 ? admins.map(admin => (
              <tr key={admin.id} className="hover:bg-gray-650 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{admin.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{admin.role}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{admin.lastLogin}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{admin.ip}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{admin.location}</td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-1">
                  <Button onClick={() => alert(`Editing permissions for ${admin.email}. UI for Read/Edit/Delete per module would show.`)} size="sm" variant="secondary" className="!text-xs !py-1 !px-2 !bg-blue-600 hover:!bg-blue-700 !text-white">Edit Permissions</Button>
                  {admin.role !== AdminRole.SUPER_ADMIN && <Button onClick={() => alert(`Removing admin ${admin.email}`)} size="sm" variant="danger" className="!text-xs !py-1 !px-2 !bg-red-600 hover:!bg-red-700">Remove</Button>}
                </td>
              </tr>
            )) : (
                <tr><td colSpan={6} className="text-center py-4 text-gray-400">No admin users found.</td></tr>
            )}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">Permissions are currently role-based. Fine-grained Read/Edit/Delete per module to be implemented.</p>
      </div>
      
      {/* Admin Activity Audit Log */}
      <div className="bg-gray-700 p-4 rounded-lg shadow-xl overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Admin Activity Audit Log</h2>
        <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-750">
                <tr>
                    {['Timestamp', 'Admin', 'Action', 'Target/Details', 'IP Address', 'Location'].map(header => (
                        <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
                {auditLogs.length > 0 ? auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-650">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{log.timestamp}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{log.admin}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-300">{log.action}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{log.target}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{log.ip}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{log.location}</td>
                    </tr>
                )) : (
                    <tr><td colSpan={6} className="text-center py-4 text-gray-400">No audit logs to display.</td></tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleAccessManagementView;
