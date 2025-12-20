import React, { useState, useEffect, useCallback } from 'react';
import { HeartIcon } from '../../icons/HeartIcon';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { EyeIcon } from '../../icons/EyeIcon';
import { ExclamationTriangleIcon } from '../../icons/ExclamationTriangleIcon';
import { UserPlusIcon } from '../../icons/UserPlusIcon';
import { useToast } from '../../../hooks/useToast';
import apiClient from '../../../utils/apiClient';


interface InterestEntry {
    _id: string;
    fromUser: { _id: string, fullName: string };
    toUser: { _id: string, fullName: string };
    createdAt: string;
    status: 'Pending' | 'Accepted' | 'Declined' | 'Mutual';
}

const InterestMatchManagementView: React.FC = () => {
  const [algorithmParams, setAlgorithmParams] = useState({
    ageWeight: 0.8, locationWeight: 0.7, interestOverlapThreshold: 50,
  });
  
  const [interests, setInterests] = useState<InterestEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  
  const [interestFilters, setInterestFilters] = useState({
      dateFrom: '', dateTo: '', planType: '', gender: '', status: ''
  });

  const fetchInterests = useCallback(async () => {
    setIsLoading(true);
    try {
        const data = await apiClient('/api/admin/interests');
        setInterests(data);
    } catch(err: any) {
        showToast(err.message, 'error');
    } finally {
        setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
      fetchInterests();
  }, [fetchInterests]);


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
      
      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Match Algorithm Parameters (Mock)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input type="number" id="ageWeight" name="ageWeight" label="Age Proximity Weight (0-1):" value={algorithmParams.ageWeight} onChange={handleParamChange} step="0.1" min="0" max="1" className="mt-1 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500" />
          <Input type="number" id="locationWeight" name="locationWeight" label="Location Match Weight (0-1):" value={algorithmParams.locationWeight} onChange={handleParamChange} step="0.1" min="0" max="1" className="mt-1 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500" />
          <Input type="number" id="interestOverlapThreshold" name="interestOverlapThreshold" label="Min. Interest Overlap (%):" value={algorithmParams.interestOverlapThreshold} onChange={handleParamChange} step="5" min="0" max="100" className="mt-1 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500" />
        </div>
        <Button onClick={() => showToast("Algorithm settings saved (mock).", 'info')} variant="primary" className="!bg-rose-500 hover:!bg-rose-600 mt-4">Save Algorithm Settings</Button>
      </div>
      
      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">View Interests</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-750">
                    <tr>{['Sender', 'Receiver', 'Date', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody className="bg-gray-700 divide-y divide-gray-600">
                    {isLoading ? (
                        <tr><td colSpan={5} className="text-center py-4 text-gray-400">Loading interests...</td></tr>
                    ) : interests.length > 0 ? interests.map(interest => (
                        <tr key={interest._id} className="hover:bg-gray-650">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{interest.fromUser.fullName}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{interest.toUser.fullName}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{new Date(interest.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${interest.status === 'Accepted' || interest.status === 'Mutual' ? 'bg-green-700 text-green-100' : interest.status === 'Pending' ? 'bg-yellow-700 text-yellow-100' : 'bg-red-700 text-red-100'}`}>{interest.status}</span></td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm space-x-1">
                                <Button onClick={() => showToast(`Flagging interest ${interest._id} as spam`, 'info')} size="sm" variant="secondary" className="!text-xs !py-1 !px-2 !bg-yellow-600 hover:!bg-yellow-700 !text-black" title="Flag Spammy Behavior"><ExclamationTriangleIcon className="w-4 h-4"/></Button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan={5} className="text-center py-4 text-gray-400">No interest data to display.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default InterestMatchManagementView;
