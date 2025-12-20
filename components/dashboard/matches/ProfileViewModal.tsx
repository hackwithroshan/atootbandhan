import React, { useState } from 'react';
import Button from '../../ui/Button';
import { XMarkIcon } from '../../icons/XMarkIcon';
import { UserIcon } from '../../icons/UserIcon';
import { MailIcon } from '../../icons/MailIcon';
import { SparklesIcon } from '../../icons/SparklesIcon';
import { Gender, MembershipTier, UserFeatures, MatchProfile } from '../../../types'; 
import { CarouselChevronLeftIcon } from '../../icons/CarouselChevronLeftIcon';
import { CarouselChevronRightIcon } from '../../icons/CarouselChevronRightIcon';
import { NEW_FEMALE_PROFILE_IMAGE_URL, NEW_MALE_PROFILE_IMAGE_URL } from '../../../constants';
import { MembershipBadge } from '../../common/MembershipBadge';
import UpgradePrompt from '../../common/UpgradePrompt';
import { AcademicCapIcon } from '../../icons/AcademicCapIcon';
import { BookOpenIcon } from '../../icons/BookOpenIcon';
import { BriefcaseIcon } from '../../icons/BriefcaseIcon';
import { UserGroupIcon } from '../../icons/UserGroupIcon';


interface ProfileViewModalProps {
  profile: MatchProfile | null;
  isOpen: boolean;
  onClose: () => void;
  userFeatures: UserFeatures; 
  onUpgradeClick: () => void;
  onSendInterest: (profileId: string) => void;
  onShortlist: (profileId: string) => void;
}

const ProfileSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
  <div className="mb-6">
    <h4 className="text-md font-semibold text-rose-600 flex items-center mb-2 border-b border-rose-100 pb-1">{icon}{title}</h4>
    <div className="text-sm text-gray-700 space-y-1">{children}</div>
  </div>
);
const InfoPair: React.FC<{ label: string; value: string | undefined | null }> = ({ label, value }) => ( value ? <p><span className="font-medium text-gray-500">{label}:</span> {value}</p> : null );

const ProfileViewModal: React.FC<ProfileViewModalProps> = ({ profile, isOpen, onClose, userFeatures, onUpgradeClick, onSendInterest, onShortlist }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !profile) return null;

  const displayPhotoUrl = profile.photoUrl ? profile.photoUrl : (profile.gender === Gender.FEMALE ? NEW_FEMALE_PROFILE_IMAGE_URL : NEW_MALE_PROFILE_IMAGE_URL);
  const gallery = [displayPhotoUrl, ...(profile.galleryImages || []).filter(img => img !== displayPhotoUrl)];
  
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="profileModalTitle">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="profileModalTitle" className="text-xl font-semibold text-rose-700 flex items-center">{profile.name}'s Profile <MembershipBadge tier={profile.membershipTier} size="md" className="ml-2" /></h2>
          <Button onClick={onClose} variant="secondary" size="sm" className="!p-2 !rounded-full" aria-label="Close profile view"><XMarkIcon className="w-5 h-5" /></Button>
        </div>
        <div className="overflow-y-auto p-4 md:p-6 custom-scrollbar"> 
          <div className="flex flex-col md:flex-row gap-6 mb-6 items-start">
            <div className="w-full md:w-1/3 flex-shrink-0">
                <div className="relative group">
                    <img src={gallery[currentImageIndex]} alt={`${profile.name}`} className="w-full h-auto max-h-80 object-cover rounded-lg border-2 border-rose-200" />
                    {gallery.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Previous image"><CarouselChevronLeftIcon className="w-5 h-5" /></button>
                        <button onClick={nextImage} className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Next image"><CarouselChevronRightIcon className="w-5 h-5" /></button>
                    </>
                    )}
                </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-gray-800">{profile.name}</h3>
              <p className="text-gray-600">{profile.age} years • {profile.location}</p>
              <p className="text-gray-500 text-sm">{profile.education} • {profile.profession}</p>
              <p className="text-sm text-rose-500 font-semibold mt-1">{profile.matchPercentage}% Match</p>
              <ProfileSection title="About Me" icon={<UserIcon className="w-5 h-5 mr-2 text-rose-500" />}><p className="whitespace-pre-line">{profile.bio || "Not provided."}</p></ProfileSection>
              <ProfileSection title="Contact Details" icon={<MailIcon className="w-5 h-5 mr-2 text-rose-500" />}>
                {userFeatures.canViewPhone ? (
                  <><InfoPair label="Email" value={profile.contactInfo?.email || "Not available"} /><InfoPair label="Phone" value={profile.contactInfo?.phone || "Not available"} /></>
                ) : ( <UpgradePrompt featureName="viewing contact details" onUpgradeClick={onUpgradeClick} size="small" /> )}
              </ProfileSection>
            </div>
          </div>
          {/* Detailed Sections ... */}
        </div>
        <div className="p-4 border-t flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <Button variant="secondary" onClick={() => onShortlist(profile.id)}>Shortlist</Button>
          <Button variant="primary" className="!bg-rose-500 hover:!bg-rose-600" onClick={() => onSendInterest(profile.id)}>Express Interest</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewModal;