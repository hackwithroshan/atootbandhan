import React, { useState, ChangeEvent, FormEvent, useCallback, useMemo, useEffect } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { UserIcon } from '../../icons/UserIcon';
import { PencilIcon } from '../../icons/PencilIcon';
import { PhotoIcon } from '../../icons/PhotoIcon';
import { UserGroupIcon } from '../../icons/UserGroupIcon';
import { BookOpenIcon } from '../../icons/BookOpenIcon';
import { AcademicCapIcon } from '../../icons/AcademicCapIcon';
import { XMarkIcon } from '../../icons/XMarkIcon';
import { MembershipBadge } from '../../common/MembershipBadge';

import { 
  Gender, Religion, MaritalStatus, MotherTongue, HeightUnit, UserPhoto,
  ProfileCreatedBy, DietaryHabits, YesNoOccasionally, FamilyType, FamilyValues, ManglikStatus, WeightUnit, EducationLevel, OccupationCategory, LoggedInUserSessionData, UserProfileData, MembershipTier, UserFeatures
} from '../../../types';
import { 
  GENDER_OPTIONS, RELIGION_OPTIONS, MARITAL_STATUS_OPTIONS, MOTHER_TONGUE_OPTIONS, HEIGHT_UNIT_OPTIONS,
  PROFILE_CREATED_BY_OPTIONS, DIETARY_HABITS_OPTIONS, YES_NO_OCCASIONALLY_OPTIONS, FAMILY_TYPE_OPTIONS, FAMILY_VALUES_OPTIONS, MANGLIK_STATUS_OPTIONS, WEIGHT_UNIT_OPTIONS, EDUCATION_OPTIONS, OCCUPATION_OPTIONS
} from '../../../constants';
import UpgradePrompt from '../../common/UpgradePrompt'; 
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';

type EditableSectionData = UserProfileData['basicInfo'] | UserProfileData['familyDetails'] | UserProfileData['lifestyle'] | UserProfileData['educationAndCareer'] | UserProfileData['partnerPreferences'];
type ProfileSectionName = 'My Photos' | 'My Profile Video' | 'Basic Information' | 'Family Details' | 'Lifestyle & Hobbies' | 'Education & Career' | 'Partner Preferences' | 'About Me' | 'Profile Photo';
const ProfileSection: React.FC<{ title: ProfileSectionName; icon: React.ReactNode; children: React.ReactNode; onEdit?: (section: ProfileSectionName) => void; isLocked?: boolean; featureName?: string; requiredTier?: MembershipTier; onUpgradeClick?: () => void; }> = ({ title, icon, children, onEdit, isLocked, featureName, requiredTier, onUpgradeClick }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">{icon}{title}</h3>
        {onEdit && !isLocked && <Button variant="secondary" size="sm" onClick={() => onEdit(title)} className="!text-xs !py-1 !px-2"><PencilIcon className="w-4 h-4 mr-1" /> Edit</Button>}
        {isLocked && featureName && requiredTier && onUpgradeClick && <UpgradePrompt featureName={featureName} requiredTier={requiredTier} onUpgradeClick={onUpgradeClick} size="small" layout="inline" />}
      </div>
      {children}
    </div>
);
const InfoItem: React.FC<{ label: string; value: string | number | undefined | null; isBoolean?: boolean }> = ({ label, value, isBoolean }) => (
    <div className="grid grid-cols-3 gap-2 py-1.5 text-sm">
      <span className="text-gray-500 font-medium col-span-1">{label}:</span>
      <span className="text-gray-700 col-span-2">{value === undefined || value === null || value === '' ? 'N/A' : isBoolean ? (value ? 'Yes' : 'No') : String(value)}</span>
    </div>
);

interface MyProfileViewProps {
  loggedInUser: LoggedInUserSessionData;
  userFeatures: UserFeatures;
  onUpgradeClick: () => void;
}

export const MyProfileView: React.FC<MyProfileViewProps> = ({ loggedInUser, userFeatures, onUpgradeClick }) => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const [editingSection, setEditingSection] = useState<ProfileSectionName | null>(null);
  const [editableSectionData, setEditableSectionData] = useState<any>({});
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const fetchUserProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiClient('/api/users/profile');
      
      const formattedData: UserProfileData = {
          fullName: data.fullName,
          age: calculateAge(data.dateOfBirth),
          location: `${data.city || 'N/A'}, ${data.state || 'N/A'}`,
          profilePhotoUrl: data.profilePhotoUrl || '',
          photos: data.photos || [],
          membershipTier: data.membershipTier,
          profileBio: data.profileBio || '',
          basicInfo: {
              gender: data.gender, dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '', heightValue: data.heightValue, heightUnit: data.heightUnit,
              weightValue: data.weightValue, weightUnit: data.weightUnit, religion: data.religion, caste: data.caste, subCaste: data.subCaste,
              motherTongue: data.motherTongue, maritalStatus: data.maritalStatus, manglikStatus: data.manglikStatus, profileCreatedBy: data.profileCreatedBy,
              city: data.city, state: data.state, country: data.country
          } as any, 
          familyDetails: {
              fatherOccupation: data.fatherOccupation, motherOccupation: data.motherOccupation, brothers: data.brothers,
              marriedBrothers: data.marriedBrothers, sisters: data.sisters, marriedSisters: data.marriedSisters,
              familyType: data.familyType, familyValues: data.familyValues, familyIncome: data.familyIncome
          },
          lifestyle: { dietaryHabits: data.dietaryHabits, smokingHabits: data.smokingHabits, drinkingHabits: data.drinkingHabits, hobbies: data.hobbies, generalHabits: data.generalHabits },
          educationAndCareer: {
              highestEducation: data.education, college: data.college, occupation: data.occupation, jobTitle: data.jobTitle,
              companyName: data.companyName, companyLocation: data.companyLocation, annualIncome: data.annualIncome, isAnnualIncomeVisible: data.isAnnualIncomeVisible ?? false
          },
          partnerPreferences: data.partnerPreferences || {},
      };
      setUser(formattedData);
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', file);
        cloudinaryFormData.append('upload_preset', 'attut_bandhan');

        const cloudinaryData = await apiClient('https://api.cloudinary.com/v1_1/dvrqft9ov/image/upload', {
            method: 'POST',
            body: cloudinaryFormData
        });
        
        const newUrl = cloudinaryData.secure_url;

        await apiClient('/api/users/profile', {
            method: 'PUT',
            body: { profilePhotoUrl: newUrl },
        });

        setUser(prev => prev ? { ...prev, profilePhotoUrl: newUrl } : null);
        showToast('Profile photo updated successfully!', 'success');
    } catch (err: any) {
        showToast(err.message, 'error');
    } finally {
        setIsUploadingPhoto(false);
    }
  };
  
  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingSection || !user) return;
    
    let payload = { ...editableSectionData };
    
    try {
        await apiClient('/api/users/profile', {
            method: 'PUT',
            body: payload,
        });

        await fetchUserProfile();
        showToast(`${editingSection} updated successfully!`, 'success');
        handleCloseModal();
    } catch (err: any) {
        showToast(err.message, 'error');
    }
  };

  const handleEditClick = (sectionName: ProfileSectionName) => {
    if (!user) return;
    setEditingSection(sectionName);
    switch (sectionName) {
      case 'Basic Information': 
        setEditableSectionData({ 
            ...user.basicInfo, 
            fullName: user.fullName,
            city: (user.basicInfo as any).city, 
            state: (user.basicInfo as any).state, 
            country: (user.basicInfo as any).country 
        }); 
        break;
      case 'Family Details': setEditableSectionData({ ...user.familyDetails }); break;
      case 'Lifestyle & Hobbies': setEditableSectionData({ ...user.lifestyle }); break;
      case 'Education & Career': 
        setEditableSectionData({ 
            ...user.educationAndCareer, 
            education: user.educationAndCareer.highestEducation // Map back to backend field name
        }); 
        break;
      case 'About Me': setEditableSectionData({ profileBio: user.profileBio }); break; 
      default: setEditableSectionData({});
    }
  };

  const handleCloseModal = () => { setEditingSection(null); setEditableSectionData({}); };
  
  const handleSectionDataChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setEditableSectionData((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const renderEditForm = () => {
      switch(editingSection) {
          case 'Basic Information':
              return (
                <div className="space-y-4">
                    <Input id="fullName" name="fullName" label="Full Name" value={editableSectionData.fullName || ''} onChange={handleSectionDataChange} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select id="gender" name="gender" label="Gender" options={GENDER_OPTIONS} value={editableSectionData.gender || ''} onChange={handleSectionDataChange} />
                        <Input type="date" id="dateOfBirth" name="dateOfBirth" label="Date of Birth" value={editableSectionData.dateOfBirth || ''} onChange={handleSectionDataChange} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="flex space-x-2">
                            <Input id="heightValue" name="heightValue" label="Height" value={editableSectionData.heightValue || ''} onChange={handleSectionDataChange} className="flex-grow" placeholder="e.g. 5.5" type="number" step="0.01"/>
                            <Select id="heightUnit" name="heightUnit" label="Unit" options={HEIGHT_UNIT_OPTIONS} value={editableSectionData.heightUnit || ''} onChange={handleSectionDataChange} className="w-24 min-w-[80px]"/>
                         </div>
                         <div className="flex space-x-2">
                            <Input id="weightValue" name="weightValue" label="Weight" value={editableSectionData.weightValue || ''} onChange={handleSectionDataChange} className="flex-grow" placeholder="e.g. 65" type="number"/>
                            <Select id="weightUnit" name="weightUnit" label="Unit" options={WEIGHT_UNIT_OPTIONS} value={editableSectionData.weightUnit || ''} onChange={handleSectionDataChange} className="w-24 min-w-[80px]"/>
                         </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select id="maritalStatus" name="maritalStatus" label="Marital Status" options={MARITAL_STATUS_OPTIONS} value={editableSectionData.maritalStatus || ''} onChange={handleSectionDataChange} />
                        <Select id="profileCreatedBy" name="profileCreatedBy" label="Profile Created By" options={PROFILE_CREATED_BY_OPTIONS} value={editableSectionData.profileCreatedBy || ''} onChange={handleSectionDataChange} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select id="religion" name="religion" label="Religion" options={RELIGION_OPTIONS} value={editableSectionData.religion || ''} onChange={handleSectionDataChange} />
                        <Select id="manglikStatus" name="manglikStatus" label="Manglik Status" options={MANGLIK_STATUS_OPTIONS} value={editableSectionData.manglikStatus || ''} onChange={handleSectionDataChange} />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input id="caste" name="caste" label="Caste" value={editableSectionData.caste || ''} onChange={handleSectionDataChange} />
                        <Input id="subCaste" name="subCaste" label="Sub-Caste" value={editableSectionData.subCaste || ''} onChange={handleSectionDataChange} />
                    </div>
                    <Select id="motherTongue" name="motherTongue" label="Mother Tongue" options={MOTHER_TONGUE_OPTIONS} value={editableSectionData.motherTongue || ''} onChange={handleSectionDataChange} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Input id="city" name="city" label="City" value={editableSectionData.city || ''} onChange={handleSectionDataChange} />
                        <Input id="state" name="state" label="State" value={editableSectionData.state || ''} onChange={handleSectionDataChange} />
                        <Input id="country" name="country" label="Country" value={editableSectionData.country || ''} onChange={handleSectionDataChange} />
                    </div>
                </div>
              );
          case 'Family Details':
              return (
                  <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input id="fatherOccupation" name="fatherOccupation" label="Father's Occupation" value={editableSectionData.fatherOccupation || ''} onChange={handleSectionDataChange} />
                          <Input id="motherOccupation" name="motherOccupation" label="Mother's Occupation" value={editableSectionData.motherOccupation || ''} onChange={handleSectionDataChange} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <Input type="number" id="brothers" name="brothers" label="No. of Brothers" value={editableSectionData.brothers || 0} onChange={handleSectionDataChange} />
                          <Input type="number" id="marriedBrothers" name="marriedBrothers" label="Married Brothers" value={editableSectionData.marriedBrothers || 0} onChange={handleSectionDataChange} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <Input type="number" id="sisters" name="sisters" label="No. of Sisters" value={editableSectionData.sisters || 0} onChange={handleSectionDataChange} />
                          <Input type="number" id="marriedSisters" name="marriedSisters" label="Married Sisters" value={editableSectionData.marriedSisters || 0} onChange={handleSectionDataChange} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Select id="familyType" name="familyType" label="Family Type" options={FAMILY_TYPE_OPTIONS} value={editableSectionData.familyType || ''} onChange={handleSectionDataChange} />
                          <Select id="familyValues" name="familyValues" label="Family Values" options={FAMILY_VALUES_OPTIONS} value={editableSectionData.familyValues || ''} onChange={handleSectionDataChange} />
                      </div>
                      <Input id="familyIncome" name="familyIncome" label="Family Income" value={editableSectionData.familyIncome || ''} onChange={handleSectionDataChange} />
                  </div>
              );
          case 'Lifestyle & Hobbies':
              return (
                  <div className="space-y-4">
                      <Select id="dietaryHabits" name="dietaryHabits" label="Dietary Habits" options={DIETARY_HABITS_OPTIONS} value={editableSectionData.dietaryHabits || ''} onChange={handleSectionDataChange} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Select id="smokingHabits" name="smokingHabits" label="Smoking Habits" options={YES_NO_OCCASIONALLY_OPTIONS} value={editableSectionData.smokingHabits || ''} onChange={handleSectionDataChange} />
                          <Select id="drinkingHabits" name="drinkingHabits" label="Drinking Habits" options={YES_NO_OCCASIONALLY_OPTIONS} value={editableSectionData.drinkingHabits || ''} onChange={handleSectionDataChange} />
                      </div>
                      <Input id="hobbies" name="hobbies" label="Hobbies" value={editableSectionData.hobbies || ''} onChange={handleSectionDataChange} placeholder="Reading, Traveling, Cooking..." />
                      <Input id="generalHabits" name="generalHabits" label="Other Habits" value={editableSectionData.generalHabits || ''} onChange={handleSectionDataChange} />
                  </div>
              );
          case 'Education & Career':
              return (
                  <div className="space-y-4">
                      <Select id="education" name="education" label="Highest Education" options={EDUCATION_OPTIONS} value={editableSectionData.education || ''} onChange={handleSectionDataChange} />
                      <Input id="college" name="college" label="College / University" value={editableSectionData.college || ''} onChange={handleSectionDataChange} />
                      <Select id="occupation" name="occupation" label="Occupation Category" options={OCCUPATION_OPTIONS} value={editableSectionData.occupation || ''} onChange={handleSectionDataChange} />
                      <Input id="jobTitle" name="jobTitle" label="Job Title" value={editableSectionData.jobTitle || ''} onChange={handleSectionDataChange} />
                      <Input id="companyName" name="companyName" label="Company Name" value={editableSectionData.companyName || ''} onChange={handleSectionDataChange} />
                      <Input id="companyLocation" name="companyLocation" label="Work Location" value={editableSectionData.companyLocation || ''} onChange={handleSectionDataChange} />
                      <Input id="annualIncome" name="annualIncome" label="Annual Income" value={editableSectionData.annualIncome || ''} onChange={handleSectionDataChange} />
                       <div className="flex items-center">
                          <input type="checkbox" id="isAnnualIncomeVisible" name="isAnnualIncomeVisible" checked={!!editableSectionData.isAnnualIncomeVisible} onChange={handleSectionDataChange} className="h-4 w-4 text-rose-500 bg-gray-100 border-gray-300 rounded focus:ring-rose-500" />
                          <label htmlFor="isAnnualIncomeVisible" className="ml-2 text-sm text-gray-700">Make Income Visible</label>
                      </div>
                  </div>
              );
          case 'About Me':
              return (
                  <div className="space-y-4">
                       <label htmlFor="profileBio" className="block text-sm font-medium text-gray-700">About Yourself</label>
                       <textarea id="profileBio" name="profileBio" rows={6} value={editableSectionData.profileBio || ''} onChange={handleSectionDataChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500" placeholder="Write about your personality, interests, and what you are looking for..." />
                  </div>
              );
          default: return <p>Form not available for this section.</p>;
      }
  };

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!user) return <div>No profile data found.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
         <img src={user.profilePhotoUrl || 'https://via.placeholder.com/96'} alt={user.fullName} className="w-24 h-24 rounded-full object-cover border-2 border-rose-500" />
         <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold text-rose-600 flex items-center justify-center sm:justify-start">
                {user.fullName} <MembershipBadge tier={user.membershipTier} className="ml-2"/>
            </h3>
            <p className="text-gray-600">{user.age} yrs, {user.location}</p>
            <p className="text-sm text-gray-500">Profile ID: {loggedInUser.id}</p>
         </div>
      </div>
      
      {/* Profile Photo Uploader Section */}
      <ProfileSection title="Profile Photo" icon={<PhotoIcon className="w-5 h-5 mr-2 text-rose-500" />}>
        <div className="flex items-center space-x-4">
            <img src={user.profilePhotoUrl || 'https://via.placeholder.com/80'} alt="Current profile" className="w-20 h-20 rounded-full object-cover" />
            <div className="flex-grow">
                <Input
                    type="file"
                    id="profilePhotoUpload"
                    name="profilePhotoUpload"
                    label="Change your profile photo"
                    onChange={handleProfilePhotoChange}
                    disabled={isUploadingPhoto}
                    accept="image/*"
                />
                {isUploadingPhoto && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
            </div>
        </div>
      </ProfileSection>

      {/* About Me Section */}
      <ProfileSection title="About Me" icon={<UserIcon className="w-5 h-5 mr-2 text-rose-500" />} onEdit={() => handleEditClick("About Me")}>
        <p className="text-gray-700 whitespace-pre-line">{user.profileBio || 'N/A'}</p>
      </ProfileSection>

      {/* Basic Information */}
      <ProfileSection title="Basic Information" icon={<UserIcon className="w-5 h-5 mr-2 text-rose-500" />} onEdit={() => handleEditClick("Basic Information")}>
        {Object.entries(user.basicInfo).filter(([key]) => !['city','state','country'].includes(key)).map(([key, value]) => <InfoItem key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} value={String(value)} />)}
        <InfoItem label="Location" value={user.location} />
      </ProfileSection>

      {/* Family Details */}
      <ProfileSection title="Family Details" icon={<UserGroupIcon className="w-5 h-5 mr-2 text-rose-500" />} onEdit={() => handleEditClick("Family Details")}>
        <InfoItem label="Father's Occupation" value={user.familyDetails.fatherOccupation} />
        <InfoItem label="Mother's Occupation" value={user.familyDetails.motherOccupation} />
        <InfoItem label="Brothers" value={`${user.familyDetails.brothers} (${user.familyDetails.marriedBrothers} married)`} />
        <InfoItem label="Sisters" value={`${user.familyDetails.sisters} (${user.familyDetails.marriedSisters} married)`} />
        <InfoItem label="Family Type" value={user.familyDetails.familyType} />
        <InfoItem label="Family Values" value={user.familyDetails.familyValues} />
        <InfoItem label="Family Income" value={user.familyDetails.familyIncome} />
      </ProfileSection>

      {/* Lifestyle & Hobbies */}
      <ProfileSection title="Lifestyle & Hobbies" icon={<BookOpenIcon className="w-5 h-5 mr-2 text-rose-500" />} onEdit={() => handleEditClick("Lifestyle & Hobbies")}>
         <InfoItem label="Dietary Habits" value={user.lifestyle.dietaryHabits} />
         <InfoItem label="Smoking Habits" value={user.lifestyle.smokingHabits} />
         <InfoItem label="Drinking Habits" value={user.lifestyle.drinkingHabits} />
         <InfoItem label="Hobbies" value={user.lifestyle.hobbies} />
         <InfoItem label="Other Habits" value={user.lifestyle.generalHabits} />
      </ProfileSection>

      {/* Education & Career */}
      <ProfileSection title="Education & Career" icon={<AcademicCapIcon className="w-5 h-5 mr-2 text-rose-500" />} onEdit={() => handleEditClick("Education & Career")}>
         <InfoItem label="Highest Education" value={user.educationAndCareer.highestEducation} />
         <InfoItem label="College" value={user.educationAndCareer.college} />
         <InfoItem label="Occupation" value={user.educationAndCareer.occupation} />
         <InfoItem label="Job Title" value={user.educationAndCareer.jobTitle} />
         <InfoItem label="Company Name" value={user.educationAndCareer.companyName} />
         <InfoItem label="Work Location" value={user.educationAndCareer.companyLocation} />
         <InfoItem label="Annual Income" value={user.educationAndCareer.isAnnualIncomeVisible ? user.educationAndCareer.annualIncome : 'Hidden'} />
      </ProfileSection>

      {/* Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSaveChanges} className="bg-white p-5 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                     <h3 className="text-xl font-semibold text-gray-800">Edit {editingSection}</h3>
                     <Button type="button" variant="secondary" size="sm" onClick={handleCloseModal} className="!p-1.5 !rounded-full"><XMarkIcon className="w-4 h-4"/></Button>
                </div>
                <div className="overflow-y-auto pr-2 space-y-4 flex-grow custom-scrollbar p-1">
                    {renderEditForm()}
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t mt-2">
                    <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                    <Button type="submit" variant="primary" className="!bg-rose-500 hover:!bg-rose-600">Save Changes</Button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
};
