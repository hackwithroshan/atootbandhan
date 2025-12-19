import React from 'react';
import { MagnifyingGlassChartIcon } from '../../icons/MagnifyingGlassChartIcon';
import { ChartBarIcon } from '../../icons/ChartBarIcon';
import Button from '../../ui/Button';


const SearchLogAnalyzerView: React.FC = () => {
  // Data would be fetched from an analytics backend
  const mockSearches = {
    caste: [],
    city: [],
    ageGroups: [],
    occupations: [],
  };

  const mockFilterUsage: any[] = [];
  
  const mockDropOffs: any[] = [];

  const mockSearchesWithoutResults: any[] = [];

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <MagnifyingGlassChartIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Search Log Analyzer</h1>
      </div>
      <p className="text-gray-300">
        Track (conceptually real-time) what users are searching for (top castes, cities, age groups, occupations), what filters they use most, where they drop off, and searches without results to improve match algorithms or marketing strategies.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(mockSearches).map(([category, terms]) => (
          <div key={category} className="bg-gray-700 p-5 rounded-lg shadow-xl">
            <h2 className="text-lg font-semibold text-gray-100 mb-2 capitalize flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2 text-rose-300"/>
                Top Searched {category.replace(/([A-Z])/g, ' $1')}
            </h2>
            <ul className="space-y-1 text-sm max-h-48 overflow-y-auto">
              {terms.length > 0 ? terms.map((item: any) => (
                <li key={item.term} className="flex justify-between items-center text-gray-300 hover:bg-gray-650 p-1 rounded">
                  <span>{item.term}</span>
                  <span className="font-semibold text-rose-400">{item.count}</span>
                </li>
              )) : <li className="text-gray-400">No data available.</li>}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-gray-100 mb-3 flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2 text-rose-300"/>
                Most Used Filters
            </h2>
            <ul className="space-y-1 text-sm">
            {mockFilterUsage.length > 0 ? mockFilterUsage.map(filter => (
                <li key={filter.filter} className="flex justify-between items-center text-gray-300 hover:bg-gray-650 p-1 rounded">
                <span>{filter.filter}</span>
                <span className="font-semibold text-rose-400">{filter.usage} usage</span>
                </li>
            )) : <li className="text-gray-400">No data available.</li>}
            </ul>
        </div>

        <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-gray-100 mb-3 flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2 text-rose-300"/>
                Key Search Drop-off Points
            </h2>
            <ul className="space-y-1 text-sm">
            {mockDropOffs.length > 0 ? mockDropOffs.map(drop => (
                <li key={drop.point} className="flex justify-between items-center text-gray-300 hover:bg-gray-650 p-1 rounded">
                <span>{drop.point}</span>
                <span className="font-semibold text-red-400">{drop.rate} drop-off</span>
                </li>
            )) : <li className="text-gray-400">No data available.</li>}
            </ul>
        </div>
      </div>

      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-3">Searches Without Results</h2>
        <ul className="space-y-1 text-sm mb-3">
            {mockSearchesWithoutResults.length > 0 ? mockSearchesWithoutResults.map(item => (
            <li key={item.term} className="flex justify-between items-center text-gray-300 hover:bg-gray-650 p-1 rounded">
                <span>"{item.term}"</span>
                <span className="font-semibold text-yellow-400">{item.count} times</span>
            </li>
            )) : <li className="text-gray-400">No data available.</li>}
        </ul>
        <Button 
            variant="secondary" 
            className="!bg-teal-600 hover:!bg-teal-700 !text-white"
            onClick={() => alert("Mock: Triggering new user onboarding campaign for users with zero search results, or investigating new categories.")}
        >
            Trigger Actions for Zero Results (e.g., Onboarding)
        </Button>
        <p className="text-xs text-gray-400 mt-2">This data can help identify gaps in user base or suggest new categories/marketing efforts.</p>
      </div>
      <p className="text-xs text-gray-500 text-center">Data represents mock analytics. Real-time logging and dynamic chart generation are planned.</p>
    </div>
  );
};

export default SearchLogAnalyzerView;