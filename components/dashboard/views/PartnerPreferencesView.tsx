import React, { useState, FormEvent, useEffect } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { UsersIcon } from '../../icons/UsersIcon';
import { PartnerPreferencesData, MaritalStatus, Religion, EducationLevel, OccupationCategory, YesNoOccasionally } from '../../../types';
import { MARITAL_STATUS_OPTIONS, RELIGION_OPTIONS, EDUCATION_OPTIONS, OCCUPATION_OPTIONS, YES_NO_OCCASIONALLY_OPTIONS } from '../../../constants';
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';

const PartnerPreferencesView: React.FC = () => {
  const [preferences, setPreferences] = useState<PartnerPreferencesData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPreferences = async () => {
      setIsLoading(true);
      try {
        const data = await apiClient('/api/users/profile');
        setPreferences(data.partnerPreferences || {});
      } catch (error: any) {
        showToast(error.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreferences();
  }, [showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'select-multiple') {
      const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions).map(option => option.value);
      setPreferences(prev => ({ ...prev, [name]: selectedOptions }));
    } else {
      setPreferences(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await apiClient('/api/users/profile', {
          method: 'PUT',
          body: { partnerPreferences: preferences },
      });
      showToast('Partner preferences updated successfully!', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if(window.confirm('Reset all preferences to default? This will clear your current selections.')) {
        setPreferences({});
    }
  };

  if (isLoading) return <div>Loading preferences...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <UsersIcon className="w-8 h-8 text-rose-500" />
        <h2 className="text-2xl font-semibold text-gray-800">Partner Preferences</h2>
      </div>
      <p className="text-gray-600 text-sm">
        Help us find the best matches for you by specifying your preferences.
      </p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input type="number" id="ageMin" name="ageMin" label="Minimum Age" value={String(preferences.ageMin || '')} onChange={handleChange} placeholder="e.g., 25" />
          <Input type="number" id="ageMax" name="ageMax" label="Maximum Age" value={String(preferences.ageMax || '')} onChange={handleChange} placeholder="e.g., 35" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input type="text" id="heightMin" name="heightMin" label="Minimum Height" value={preferences.heightMin || ''} onChange={handleChange} placeholder="e.g., 5ft 2in" />
          <Input type="text" id="heightMax" name="heightMax" label="Maximum Height" value={preferences.heightMax || ''} onChange={handleChange} placeholder="e.g., 6ft 0in" />
        </div>
        
        <Select 
            id="maritalStatus" 
            name="maritalStatus" 
            label="Marital Status (select multiple if applicable)" 
            options={MARITAL_STATUS_OPTIONS} 
            value={preferences.maritalStatus as any || []} 
            onChange={handleChange} 
            multiple
            className="h-24"
        />
        
        <Select 
            id="religion" 
            name="religion" 
            label="Religion (select multiple if applicable)" 
            options={RELIGION_OPTIONS} 
            value={preferences.religion as any || []} 
            onChange={handleChange} 
            multiple
            className="h-24"
        />

        <Input type="text" id="caste" name="caste" label="Caste (Comma-separated or 'Any')" value={preferences.caste || ''} onChange={handleChange} placeholder="e.g., Brahmin, Kshatriya, Any" />
        
        <Select 
            id="education" 
            name="education" 
            label="Education Level (select multiple)" 
            options={EDUCATION_OPTIONS} 
            value={preferences.education as any || []} 
            onChange={handleChange} 
            multiple
            className="h-24"
        />
        
        <Select 
            id="occupation" 
            name="occupation" 
            label="Occupation (select multiple)" 
            options={OCCUPATION_OPTIONS} 
            value={preferences.occupation as any || []} 
            onChange={handleChange} 
            multiple
            className="h-24"
        />

        <Input type="text" id="incomeRange" name="incomeRange" label="Preferred Annual Income Range" value={preferences.incomeRange || ''} onChange={handleChange} placeholder="e.g., 10-20 LPA, No Preference" />
        <Input type="text" id="locations" name="locations" label="Preferred Locations (Comma-separated)" value={preferences.locations || ''} onChange={handleChange} placeholder="e.g., Mumbai, Bangalore, Any" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select id="smokingHabits" name="smokingHabits" label="Smoking Habits" options={YES_NO_OCCASIONALLY_OPTIONS} value={preferences.smokingHabits || ''} onChange={handleChange} placeholder="Select preference"/>
            <Select id="drinkingHabits" name="drinkingHabits" label="Drinking Habits" options={YES_NO_OCCASIONALLY_OPTIONS} value={preferences.drinkingHabits || ''} onChange={handleChange} placeholder="Select preference"/>
        </div>

        <Input type="text" id="languagesSpoken" name="languagesSpoken" label="Languages Spoken (Comma-separated)" value={preferences.languagesSpoken || ''} onChange={handleChange} placeholder="e.g., English, Hindi, Marathi" />
        
        <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
          <Button type="button" variant="secondary" onClick={handleReset}>Reset Form</Button>
          <Button type="submit" variant="primary" className="!bg-rose-500 hover:!bg-rose-600" isLoading={isSaving} disabled={isSaving}>Save Preferences</Button>
        </div>
        <p className="text-xs text-gray-500">Note: Hold Ctrl (Cmd on Mac) to select multiple options.</p>
      </form>
    </div>
  );
};

export default PartnerPreferencesView;
