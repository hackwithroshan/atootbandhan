import React, { useState, ChangeEvent } from 'react';
import { HeartIcon } from '../../icons/HeartIcon';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { EyeIcon } from '../../icons/EyeIcon';
import { ExclamationTriangleIcon } from '../../icons/ExclamationTriangleIcon';
import { UserPlusIcon } from '../../icons/UserPlusIcon';


interface InterestEntry {
    id: string;
    senderId: string;
    receiverId: string;
    senderName: string;
    receiverName: string;
    date: string;
    status: 'Pending' | 'Accepted' | 'Declined' | 'Mutual';
    planType: 'Free' | 'Gold' | 'Silver';
}

const InterestMatchManagementView: React.FC = () => {
  const [algorithmParams, setAlgorithmParams] = useState({
    ageWeight: 0.8,
    locationWeight: 0.7,
    interestOverlapThreshold: 50,
  });
  
  const [interests, setInterests] = useState<InterestEntry[]>([]);
  
  const [interestFilters, setInterestFilters] = useState({
      dateFrom: '',
      dateTo: '',
      planType: '',
      gender: '',
      status: ''
  });

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlgorithmParams(prev => ({ ...prev, [e.target.name]: parseFloat(e.target.value) }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInterestFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const planTypeOptions = [{value: '', label: 'Any Plan'}, {value: 'Free', label: 'Free'}, {value: 'Silver', label: 'Silver'}, {value: 'Gold', label: 'Gold'}];
  const genderOptions = [{value: '', label: 'Any Gender'}, {value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}];
  const statusOptions = [{value: '', label: 'Any Status'}, {value: 'Pending', label: 'Pending'}, {value: 'Accepted', label: 'Accepted'}, {value: 'Declined', label: 'Declined'}, {value: 'Mutual', label: 'Mutual'}];


  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <HeartIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Interest & Match Management</h1>
      </div>
      <p className="text-gray-300">
        View expressed interests (sent/received, mutual), manage suspicious activity, suggest matches, and adjust matchmaking algorithm parameters.
      </p>

      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Match Algorithm Parameters (Admin AI Tuner - Mock)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input type="number" id="ageWeight" name="ageWeight" label="Age Proximity Weight (0-1):" value={algorithmParams.ageWeight} onChange={handleParamChange} step="0.1" min="0" max="1" className="mt-1 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500" />
          </div>
          <div>
            <Input type="number" id="locationWeight" name="locationWeight" label="Location Match Weight (0-1):" value={algorithmParams.locationWeight} onChange={handleParamChange} step="0.1" min="0" max="1" className="mt-1 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500" />
          </div>
          <div>
            <Input type="number" id="interestOverlapThreshold" name="interestOverlapThreshold" label="Min. Interest Overlap (%):" value={algorithmParams.interestOverlapThreshold} onChange={handleParamChange} step="5" min="0" max="100" className="mt-1 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500" />
          </div>
        </div>
        <Button onClick={() => alert("Algorithm settings saved (mock).")} variant="primary" className="!bg-rose-500 hover:!bg-rose-600 mt-4">Save Algorithm Settings</Button>
        <p className="text-xs text-gray-400 mt-4">These are mock controls. Real algorithm tuning involves more complex parameters and data science.</p>
      </div>
      
      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">View Interests</h2>
        {/* Filters for Interests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 items-end">
            <Input type="date" id="dateFrom" name="dateFrom" label="Date From" value={interestFilters.dateFrom} onChange={handleFilterChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500" />
            <Input type="date" id="dateTo" name="dateTo" label="Date To" value={interestFilters.dateTo} onChange={handleFilterChange} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500" />
            <Select id="planTypeFilter" name="planType" label="Plan Type" options={planTypeOptions} value={interestFilters.planType} onChange={handleFilterChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
            <Select id="genderFilterInterest" name="gender" label="Gender (Sender)" options={genderOptions} value={interestFilters.gender} onChange={handleFilterChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
            <Select id="statusFilterInterest" name="status" label="Status" options={statusOptions} value={interestFilters.status} onChange={handleFilterChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" />
            <Button variant="primary" className="!bg-blue-500 hover:!bg-blue-600 h-10" onClick={() => alert("Filtering interests (mock)")}>Filter Interests</Button>
        </div>
        {/* Table of Interests */}
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-750">
                    <tr>
                        {['Sender', 'Receiver', 'Date', 'Status', 'Plan', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>)}
                    </tr>
                </thead>
                <tbody className="bg-gray-700 divide-y divide-gray-600">
                    {interests.length > 0 ? interests.map(interest => (
                        <tr key={interest.id} className="hover:bg-gray-650">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{interest.senderName} ({interest.senderId})</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{interest.receiverName} ({interest.receiverId})</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{interest.date}</td>
                            <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${interest.status === 'Accepted' || interest.status === 'Mutual' ? 'bg-green-700 text-green-100' : interest.status === 'Pending' ? 'bg-yellow-700 text-yellow-100' : 'bg-red-700 text-red-100'}`}>{interest.status}</span></td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{interest.planType}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm space-x-1">
                                <Button onClick={() => alert(`Viewing communication for ${interest.id}`)} size="sm" variant="secondary" className="!text-xs !py-1 !px-2 !bg-gray-500 hover:!bg-gray-400" title="View Communication Summary"><EyeIcon className="w-4 h-4"/></Button>
                                <Button onClick={() => alert(`Flagging interest ${interest.id} as spam`)} size="sm" variant="secondary" className="!text-xs !py-1 !px-2 !bg-yellow-600 hover:!bg-yellow-700 !text-black" title="Flag Spammy Behavior"><ExclamationTriangleIcon className="w-4 h-4"/></Button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan={6} className="text-center py-4 text-gray-400">No interest data to display.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
         <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Suggest Matches Manually (For Matchmaking Team - Placeholder)</h3>
            <p className="text-gray-400 text-sm">Interface for matchmaking team to manually suggest profiles to users based on detailed compatibility analysis.</p>
             <Button onClick={() => alert("Open manual match suggestion tool (mock).")} variant="secondary" className="mt-2 !bg-teal-600 hover:!bg-teal-700 !text-white">
                <UserPlusIcon className="w-5 h-5 mr-2"/> Open Match Suggestion Tool
            </Button>
        </div>
      </div>
    </div>
  );
};

export default InterestMatchManagementView;