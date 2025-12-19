import React, { useState } from 'react';
import { BeakerIcon } from '../../icons/BeakerIcon';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';

interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'Running' | 'Paused' | 'Completed' | 'Draft';
  testGroup: string; // e.g., 'Homepage Design', 'Match View Layout', 'CTA Text'
  metricsTracked: string[]; // e.g., ['CTR', 'Conversion Rate', 'Engagement Time']
  variantAConversion: string;
  variantBConversion: string;
  startDate: string;
}

const testGroupOptions = [
    {value: '', label: 'Select Test Group'},
    {value: 'Homepage Design', label: 'Homepage Design (A vs B)'},
    {value: 'Match View Layouts', label: 'Match View Layouts (Grid vs List)'},
    {value: 'CTA Text', label: 'CTA Text (e.g., "Upgrade Now" vs "View More")'},
    {value: 'Pricing Page Layout', label: 'Pricing Page Layout'},
];

const metricOptions = [
    {value: 'CTR', label: 'Clickthrough Rate (CTR)'},
    {value: 'ConversionRate', label: 'Conversion Rate (Signups, Payments)'},
    {value: 'EngagementTime', label: 'Engagement Time'},
    {value: 'BounceRate', label: 'Bounce Rate'},
];


const ABTestingPanelView: React.FC = () => {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestDescription, setNewTestDescription] = useState('');
  const [selectedTestGroup, setSelectedTestGroup] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);


  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mock: A/B Test "${newTestName}" created. Group: "${selectedTestGroup}", Metrics: ${selectedMetrics.join(', ')}`);
    setNewTestName('');
    setNewTestDescription('');
    setSelectedTestGroup('');
    setSelectedMetrics([]);
    setShowCreateForm(false);
  };
  
  const handleMetricChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMetrics(prev => 
        prev.includes(value) ? prev.filter(m => m !== value) : [...prev, value]
    );
  };


  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <BeakerIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">A/B Testing Panel</h1>
      </div>
      <p className="text-gray-300">
        Create, manage, and analyze A/B tests for different site elements (Homepage Design, Match View Layouts, CTA Text) to optimize conversion rates (CTR, Conversion, Engagement).
      </p>

      <div className="flex justify-end">
        <Button onClick={() => setShowCreateForm(!showCreateForm)} variant="primary" className="!bg-green-600 hover:!bg-green-700">
          {showCreateForm ? 'Cancel Test Creation' : 'Create New A/B Test'}
        </Button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateTest} className="bg-gray-700 p-6 rounded-lg shadow-xl space-y-4">
          <h2 className="text-xl font-semibold text-gray-100 mb-2">New A/B Test Setup</h2>
          <Input id="newTestName" name="newTestName" label="Test Name" value={newTestName} onChange={(e) => setNewTestName(e.target.value)} placeholder="e.g., Homepage Hero Image Test" className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" required />
          <div>
            <label htmlFor="newTestDescription" className="block text-sm font-medium text-gray-400 mb-1">Test Description / Hypothesis</label>
            <textarea id="newTestDescription" name="newTestDescription" rows={3} value={newTestDescription} onChange={(e) => setNewTestDescription(e.target.value)} className="block w-full bg-gray-600 border-gray-500 rounded-md shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2 text-white" placeholder="Describe what you are testing and what you expect to happen..." required></textarea>
          </div>
          <Select id="testGroup" name="testGroup" label="Test Group (Element to Test)" options={testGroupOptions} value={selectedTestGroup} onChange={e => setSelectedTestGroup(e.target.value)} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500" required/>
          <div>
            <label htmlFor="metricsTracked" className="block text-sm font-medium text-gray-400 mb-1">Metrics to Track (Select multiple if applicable)</label>
            {/* For a real multi-select, you'd use a library or custom component. This is a simplified mock. */}
            <Select id="metricsTracked" name="metricsTracked" label="Metrics (Hold Ctrl/Cmd to select multiple - mock)" options={metricOptions} multiple value={selectedMetrics} onChange={handleMetricChange} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500 h-24" required/>
            <p className="text-xs text-gray-500 mt-1">Selected metrics: {selectedMetrics.join(', ') || 'None'}</p>
          </div>
          <p className="text-xs text-gray-400">Further configuration for defining Variant A & B, traffic allocation, and duration would be here.</p>
          <Button type="submit" variant="primary" className="!bg-rose-500 hover:!bg-rose-600">Save Test Setup</Button>
        </form>
      )}

      {/* A/B Tests Table */}
      <div className="bg-gray-700 shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-750">
            <tr>
              {['Test Name', 'Test Group', 'Status', 'Metrics', 'Variant A', 'Variant B', 'Start Date', 'Actions'].map(header => (
                <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {tests.map(test => (
              <tr key={test.id} className="hover:bg-gray-650 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{test.name}</div>
                    <div className="text-xs text-gray-400 max-w-xs truncate" title={test.description}>{test.description}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{test.testGroup}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    test.status === 'Running' ? 'bg-green-700 text-green-100' :
                    test.status === 'Paused' ? 'bg-yellow-700 text-yellow-100' :
                    test.status === 'Draft' ? 'bg-gray-500 text-gray-100' :
                    'bg-blue-700 text-blue-100' // Completed
                  }`}>
                    {test.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400 max-w-xs truncate" title={test.metricsTracked.join(', ')}>{test.metricsTracked.join(', ')}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{test.variantAConversion}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{test.variantBConversion}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{test.startDate}</td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-1">
                  <Button onClick={() => alert(`Viewing results for ${test.name}`)} size="sm" variant="secondary" className="!text-xs !py-1 !px-2 !bg-blue-600 hover:!bg-blue-700 !text-white">Results</Button>
                  {test.status === 'Running' && <Button onClick={() => alert(`Pausing test ${test.name}`)} size="sm" variant="secondary" className="!text-xs !py-1 !px-2 !bg-yellow-600 hover:!bg-yellow-700 !text-black">Pause</Button>}
                  {test.status === 'Paused' && <Button onClick={() => alert(`Resuming test ${test.name}`)} size="sm" variant="secondary" className="!text-xs !py-1 !px-2 !bg-green-600 hover:!bg-green-700">Resume</Button>}
                </td>
              </tr>
            ))}
             {tests.length === 0 && !showCreateForm && (
                <tr><td colSpan={8} className="text-center py-6 text-gray-400">No A/B tests currently configured.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 text-center">This panel demonstrates A/B testing concepts. Integration with analytics and feature flagging systems is crucial for real implementation.</p>
    </div>
  );
};

export default ABTestingPanelView;