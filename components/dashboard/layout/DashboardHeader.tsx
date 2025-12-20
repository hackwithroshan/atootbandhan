import React, { useState, useRef, useEffect } from 'react';
import { BellIcon } from '../../icons/BellIcon';
import { Cog6ToothIcon } from '../../icons/Cog6ToothIcon';
import { ArrowLeftOnRectangleIcon } from '../../icons/ArrowLeftOnRectangleIcon';
import { Bars3Icon } from '../../icons/Bars3Icon';
import { UserIcon } from '../../icons/UserIcon'; 
import { Notification, NotificationType, DashboardViewKey } from '../../../types'; 
import { CheckIcon } from '../../icons/CheckIcon';
import { HeartIcon } from '../../icons/HeartIcon'; 
import { ChatBubbleBottomCenterTextIcon } from '../../icons/ChatBubbleBottomCenterTextIcon'; 
import { MegaphoneIcon } from '../../icons/MegaphoneIcon'; 
import { EyeIcon } from '../../icons/EyeIcon'; 
import { EllipsisVerticalIcon } from '../../icons/EllipsisVerticalIcon';
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';

interface DashboardHeaderProps {
  onLogout: () => void;
  toggleSidebar: () => void;
  toggleProfileDrawer: () => void; 
  userPhotoUrl?: string | null; 
  setActiveView: (viewKey: DashboardViewKey) => void;
}

const formatTimeAgo = (dateStr: string | Date): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
};


const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onLogout, toggleSidebar, toggleProfileDrawer, userPhotoUrl, setActiveView }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { showToast } = useToast();
  
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const data = await apiClient('/api/dashboard/notifications');
            setNotifications(data);
        } catch (error: any) {
            console.error("Failed to fetch notifications:", error.message);
            // Optionally show a subtle toast, but can be noisy.
            // showToast("Could not refresh notifications.", 'error');
        }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setIsNotificationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleToggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen((prev: boolean) => !prev);
    if (isProfileDropdownOpen && !isNotificationDropdownOpen) setIsProfileDropdownOpen(false);
  };

  const handleToggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev: boolean) => !prev);
     if (isNotificationDropdownOpen && !isProfileDropdownOpen) setIsNotificationDropdownOpen(false);
  };
  
  const markAsRead = async (notificationId: string) => {
    try {
        await apiClient(`/api/dashboard/notifications/${notificationId}/read`, { method: 'PUT' });
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
    } catch (error: any) {
        showToast(error.message, 'error');
    }
  };

  const markAllAsRead = async () => {
    try {
        await apiClient('/api/dashboard/notifications/read-all', { method: 'PUT' });
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error: any) {
        showToast(error.message, 'error');
    }
  };
  
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
        markAsRead(notification.id);
    }
    if (notification.redirectTo) {
      // The redirectTo string should be a valid DashboardViewKey
      setActiveView(notification.redirectTo as DashboardViewKey);
    }
    // Close the dropdown after clicking
    setIsNotificationDropdownOpen(false);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch(type) {
        case NotificationType.NEW_MATCH: return <UserIcon className="w-5 h-5 text-blue-500" />;
        case NotificationType.INTEREST_RECEIVED:
        case NotificationType.INTEREST_ACCEPTED:
             return <HeartIcon className="w-5 h-5 text-pink-500" />;
        case NotificationType.MESSAGE_RECEIVED: return <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-green-500" />;
        case NotificationType.MEMBERSHIP_EXPIRY: return <Cog6ToothIcon className="w-5 h-5 text-yellow-500" />;
        case NotificationType.ADMIN_ANNOUNCEMENT: return <MegaphoneIcon className="w-5 h-5 text-purple-500" />;
        case NotificationType.PROFILE_VIEW: return <EyeIcon className="w-5 h-5 text-indigo-500" />;
        default: return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };


  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="md:hidden mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <a href="#" onClick={(e) => {e.preventDefault(); setActiveView('DashboardHome')}} className="text-2xl font-bold text-rose-600">
              Atut Bandhan
            </a>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative" ref={notificationDropdownRef}>
              <button 
                onClick={handleToggleNotificationDropdown}
                className="relative text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full hover:bg-gray-100"
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                aria-haspopup="true"
                aria-expanded={isNotificationDropdownOpen}
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 min-w-[1rem] text-[10px] leading-tight rounded-full bg-rose-500 text-white ring-2 ring-white text-center flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isNotificationDropdownOpen && (
                <div 
                    className="origin-top-right absolute right-0 mt-2 w-80 sm:w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none max-h-[70vh] flex flex-col"
                    role="menu" aria-orientation="vertical" aria-labelledby="notification-button"
                >
                  <div className="flex justify-between items-center px-4 py-3 border-b">
                    <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs text-rose-600 hover:underline">
                            Mark all as read
                        </button>
                    )}
                  </div>
                  <ul className="divide-y divide-gray-100 overflow-y-auto flex-grow custom-scrollbar">
                    {notifications.length > 0 ? notifications.map(notif => (
                      <li key={notif.id} 
                          className={`p-3 hover:bg-gray-50 cursor-pointer ${!notif.isRead ? 'bg-rose-50' : ''}`}
                          onClick={() => handleNotificationClick(notif)}
                          role="menuitem"
                          tabIndex={0} 
                          onKeyPress={(e) => e.key === 'Enter' && handleNotificationClick(notif)} 
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {notif.senderProfile?.photoUrl ? 
                                <img src={notif.senderProfile.photoUrl} alt={notif.senderProfile.name} className="w-8 h-8 rounded-full object-cover"/> 
                                : getNotificationIcon(notif.type)
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notif.isRead ? 'text-gray-800 font-semibold' : 'text-gray-600'}`}>{notif.title}</p>
                            <p className={`text-xs ${!notif.isRead ? 'text-gray-600' : 'text-gray-500'}`}>{notif.message}</p>
                            <p className={`text-xs mt-0.5 ${!notif.isRead ? 'text-rose-500' : 'text-gray-400'}`}>{formatTimeAgo(notif.createdAt)}</p>
                          </div>
                          {!notif.isRead && <div className="w-2 h-2 bg-rose-500 rounded-full self-center"></div>}
                        </div>
                      </li>
                    )) : (
                        <li className="p-4 text-center text-sm text-gray-500">No new notifications.</li>
                    )}
                  </ul>
                  <div className="border-t">
                      <button onClick={() => { setActiveView('ActivityLog'); setIsNotificationDropdownOpen(false); }} className="block w-full text-center px-4 py-2 text-xs text-rose-600 hover:bg-gray-50">View all activity</button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={handleToggleProfileDropdown}
                className="flex items-center text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-rose-300 transition"
                aria-haspopup="true"
                aria-expanded={isProfileDropdownOpen}
              >
                <img
                  className="h-8 w-8 rounded-full object-cover bg-gray-200"
                  src={userPhotoUrl || undefined}
                  alt="User profile"
                />
              </button>
              {isProfileDropdownOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"
                >
                  <button onClick={toggleProfileDrawer} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <UserIcon className="w-5 h-5 mr-2 text-gray-500"/> My Account
                  </button>
                  <button onClick={() => {setActiveView('AccountSettings'); setIsProfileDropdownOpen(false);}} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <Cog6ToothIcon className="w-5 h-5 mr-2 text-gray-500"/> Settings
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2 text-gray-500"/>
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

export default DashboardHeader;