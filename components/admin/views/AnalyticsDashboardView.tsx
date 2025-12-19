import React from 'react';
import { ChartBarIcon } from '../../icons/ChartBarIcon';
import { UserIcon } from '../../icons/UserIcon';
import { PhotoIcon } from '../../icons/PhotoIcon'; // For photo stats
import { CurrencyDollarIcon } from '../../icons/CurrencyDollarIcon'; // For revenue/conversion
import { EyeIcon } from '../../icons/EyeIcon'; // For view counts
import Button from '../../ui/Button'; // Added import


// Mock icons if they don't exist
const ArrowTrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);
const ArrowsRightLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18M16.5 3L21 7.5m0 0L16.5 12M21 7.5H3" />
  </svg>
);


const AnalyticsDashboardView: React.FC = () => {
  const mockAnalyticsData = [
    { label: 'Daily Signups', value: '85', trend: '+8%', icon: <UserIcon className="w-6 h-6 text-green-400"/> },
    { label: 'Daily Active Users (DAU)', value: '550', trend: '+5%', icon: <UserIcon className="w-6 h-6 text-teal-400"/> },
    { label: 'Daily Logins', value: '720', trend: '+3%', icon: <UserIcon className="w-6 h-6 text-blue-400"/> },
    { label: 'Match View Counts (Today)', value: '1,250', trend: '+10%', icon: <EyeIcon className="w-6 h-6 text-indigo-400"/> },
    { label: 'Photo Upload Stats (Today)', value: '45 new', trend: '', icon: <PhotoIcon className="w-6 h-6 text-purple-400"/> },
    { label: 'Payment Conversion Rate', value: '2.5%', trend: '+0.2%', icon: <CurrencyDollarIcon className="w-6 h-6 text-lime-400"/> },
    { label: 'Bounce Rate', value: '35%', trend: '+1%', icon: <ArrowTrendingUpIcon className="w-6 h-6 text-red-400 transform scale-y-[-1]"/> }, // Trend icon implies change
    { label: 'Avg. Session Duration', value: '12 min', trend: '-2%', icon: <ChartBarIcon className="w-6 h-6 text-orange-400"/> },
  ];
  
  const mockSuspiciousLogins = [
      { id: 'sl_001', userId: 'usr_temp01', ip: '203.0.113.100', location: 'Unknown Country', time: '2024-07-30 02:15 AM', reason: 'IP Mismatch' },
      { id: 'sl_002', userId: 'usr_beta02', ip: '198.51.100.50', location: 'City, Different State', time: '2024-07-30 03:45 AM', reason: 'Unusual Login Time & Location' },
  ];

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <ChartBarIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>
      <p className="text-gray-300">
        Monitor key metrics: user activity (signups, logins, DAU), growth, match view counts, photo uploads, payment conversion, revenue, engagement, and suspicious login attempts.
      </p>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {mockAnalyticsData.map(data => (
          <div key={data.label} className="bg-gray-700 p-5 rounded-lg shadow-xl flex items-start space-x-3">
            <div className="p-2 bg-gray-800 rounded-full">{data.icon}</div>
            <div>
                <p className="text-2xl font-semibold text-white my-0.5">{data.value}</p>
                <p className="text-sm text-gray-400">{data.label}</p>
                {data.trend && <p className={`text-xs mt-0.5 ${data.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{data.trend} vs last period</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-700 p-6 rounded-lg shadow-xl h-80 flex flex-col items-center justify-center">
          <ChartBarIcon className="w-12 h-12 text-gray-500 mb-3"/>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">User Signup & Growth Chart</h3>
          <p className="text-gray-400 text-sm">(Placeholder for Daily/Monthly trends)</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg shadow-xl h-80 flex flex-col items-center justify-center">
          <ChartBarIcon className="w-12 h-12 text-gray-500 mb-3"/>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Revenue Graphs</h3>
           <p className="text-gray-400 text-sm">(Placeholder for Plan-wise & Time-based revenue)</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg shadow-xl h-80 flex flex-col items-center justify-center lg:col-span-2">
          <ArrowsRightLeftIcon className="w-12 h-12 text-gray-500 mb-3"/>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">User Journey Flowchart</h3>
           <p className="text-gray-400 text-sm">(Placeholder: Signup → Profile → Match → Payment stages)</p>
        </div>
      </div>
      
      <div className="bg-gray-700 p-6 rounded-lg shadow-xl overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Suspicious Login Attempts</h2>
         <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-750">
                <tr>
                    {['User ID', 'IP Address', 'Location', 'Time', 'Reason', 'Actions'].map(header => (
                        <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
                {mockSuspiciousLogins.map(log => (
                    <tr key={log.id} className="hover:bg-gray-650">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{log.userId}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{log.ip}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{log.location}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{log.time}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-400">{log.reason}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <Button size="sm" variant="secondary" className="!text-xs !py-1 !px-2 !bg-red-600 hover:!bg-red-700 !text-white" onClick={() => alert(`Investigating suspicious login for ${log.userId}`)}>Investigate</Button>
                        </td>
                    </tr>
                ))}
                 {mockSuspiciousLogins.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-6 text-gray-400">No suspicious login attempts flagged recently.</td></tr>
                )}
            </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 text-center">Data visualization libraries (e.g., Chart.js, Recharts) will be used for dynamic graphs and charts.</p>
    </div>
  );
};

export default AnalyticsDashboardView;
