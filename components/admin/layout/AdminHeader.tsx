import React, { useState, useRef, useEffect } from 'react';
import { AdminRole } from '../../../types';
import { ArrowLeftOnRectangleIcon } from '../../icons/ArrowLeftOnRectangleIcon';
import { Bars3Icon } from '../../icons/Bars3Icon'; // For mobile menu toggle
import { ShieldCheckIcon } from '../../icons/ShieldCheckIcon';


interface AdminHeaderProps {
  onAdminLogout: () => void;
  toggleSidebar: () => void;
  adminRole: AdminRole;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onAdminLogout, toggleSidebar, adminRole }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-900 shadow-md sticky top-0 z-40 text-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="md:hidden mr-4 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Toggle admin sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <span className="text-xl font-bold text-rose-500">Atut Bandhan - Admin</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 hidden sm:block">Role: {adminRole}</span>
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-600 transition p-1 bg-gray-700 hover:bg-gray-600"
              >
                <ShieldCheckIcon className="h-6 w-6 text-rose-400" />
              </button>
              {isProfileDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 text-xs text-gray-400">
                    Logged in as <span className="font-medium text-rose-400">{adminRole}</span>
                  </div>
                  <button
                    onClick={onAdminLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2 text-gray-400" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;