
import React from 'react';

interface RecentActivityProps {
  activities: { id: string; title: string; createdAt: Date }[];
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const seconds = Math.round((now.getTime() - new Date(date).getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString();
};


const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
      {activities.length > 0 ? (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li key={activity.id} className="text-sm text-gray-600 border-b border-gray-100 pb-2 last:border-b-0 last:pb-0">
              {activity.title} <span className="text-xs text-gray-400">- {formatTimeAgo(activity.createdAt)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 mt-4 text-center">No recent activity to show.</p>
      )}
    </div>
  );
};

export default RecentActivity;