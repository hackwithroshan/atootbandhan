import React, { useState, useEffect } from 'react';
import { MagnifyingGlassChartIcon } from '../../icons/MagnifyingGlassChartIcon';
import { ChartBarIcon } from '../../icons/ChartBarIcon';
import Button from '../../ui/Button';
import { SearchAnalyticsData, TopSearchTerm } from '../../../types';
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';

const TermList: React.FC<{ terms: TopSearchTerm[], isLoading: boolean }> = ({ terms, isLoading }) => {
    if (isLoading) {
        return <li className="text-gray-400">Loading...</li>;
    }
    if (terms.length > 0) {
        return (
            <>
                {terms.map((item) => (
                    <li key={item._id} className="flex justify-between items-center text-gray-300 hover:bg-gray-650 p-1 rounded">
                        <span className="capitalize">{item._id}</span>
                        <span className="font-semibold text-rose-400">{item.count.toLocaleString()}</span>
                    </li>
                ))}
            </>
        );
    }
    return <li className="text-gray-400">No data available.</li>;
};

const SearchLogAnalyzerView: React.FC = () => {
    const [analytics, setAnalytics] = useState<SearchAnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchSearchAnalytics = async () => {
            setIsLoading(true);
            try {
                const data = await apiClient('/api/admin/analytics/search-logs');
                setAnalytics(data);
            } catch (err: any) {
                showToast(err.message, 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSearchAnalytics();
    }, [showToast]);

    const analyticsCategories = [
        { title: 'Top Searched Keywords', data: analytics?.topKeywords },
        { title: 'Top Searched Cities', data: analytics?.topCities },
        { title: 'Top Searched Castes', data: analytics?.topCastes },
        { title: 'Top Searched Religions', data: analytics?.topReligions },
    ];

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <MagnifyingGlassChartIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Search Log Analyzer</h1>
      </div>
      <p className="text-gray-300">
        Track what users are searching for (top keywords, cities, castes), and identify searches that yield no results to improve match algorithms or marketing strategies.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCategories.map((category) => (
          <div key={category.title} className="bg-gray-700 p-5 rounded-lg shadow-xl">
            <h2 className="text-lg font-semibold text-gray-100 mb-2 capitalize flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2 text-rose-300"/>
                {category.title}
            </h2>
            <ul className="space-y-1 text-sm max-h-48 overflow-y-auto custom-scrollbar">
              <TermList terms={category.data || []} isLoading={isLoading} />
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-3">Keywords with Zero Results</h2>
        <ul className="space-y-1 text-sm mb-3 max-h-48 overflow-y-auto custom-scrollbar">
            <TermList terms={analytics?.zeroResultSearches || []} isLoading={isLoading} />
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
      <p className="text-xs text-gray-500 text-center">Data is aggregated from user search logs. Analysis may have a slight delay.</p>
    </div>
  );
};

export default SearchLogAnalyzerView;