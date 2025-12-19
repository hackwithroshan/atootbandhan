import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button';
import { ClipboardDocumentListIcon } from '../../icons/ClipboardDocumentListIcon';
import { ArrowDownTrayIcon } from '../../icons/ArrowDownTrayIcon';
import { UserFeatures } from '../../../types';
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';

interface ActivityLogViewProps {
  userFeatures?: UserFeatures;
  onUpgradeClick?: () => void;
}

interface ActivityItem {
    id: string;
    title: string;
    createdAt: string;
}

const formatTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days} days ago`;
};

const ActivityLogView: React.FC<ActivityLogViewProps> = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
      const fetchActivity = async () => {
          try {
              const data = await apiClient('/api/dashboard/activity');
              setActivities(data);
          } catch (error: any) {
              showToast(error.message, 'error');
          } finally {
              setIsLoading(false);
          }
      };
      fetchActivity();
  }, [showToast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <ClipboardDocumentListIcon className="w-6 h-6 mr-2 text-rose-500" />
            Activity Log
        </h2>
        <Button variant="secondary" size="sm" onClick={() => showToast('Download activity log (Coming Soon).', 'info')}>
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Download Log
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading activity...</div>
        ) : activities.length > 0 ? (
            <ul className="divide-y divide-gray-100">
                {activities.map(activity => (
                    <li key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 font-medium">{activity.title}</span>
                            <span className="text-xs text-gray-400">{formatTimeAgo(activity.createdAt)}</span>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="p-10 text-center">
                <ClipboardDocumentListIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent activity recorded.</p>
                <p className="text-xs text-gray-400 mt-1">Your actions and notifications will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogView;
