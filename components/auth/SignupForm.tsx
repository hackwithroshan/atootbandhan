import React, { useState, useCallback, useEffect } from 'react';
import {
  SignupFormData, Gender, MaritalStatus, Religion, MotherTongue,
  EducationLevel, OccupationCategory, HeightUnit, WeightUnit,
  FormStep
} from '../../types';
import {
  GENDER_OPTIONS, RELIGION_OPTIONS, MARITAL_STATUS_OPTIONS, MOTHER_TONGUE_OPTIONS,
  EDUCATION_OPTIONS, OCCUPATION_OPTIONS, HEIGHT_UNIT_OPTIONS, 
  MANGLIK_STATUS_OPTIONS, PROFILE_CREATED_BY_OPTIONS, WEIGHT_UNIT_OPTIONS
} from '../../constants';
// FIX: Module '"../MultiStepForm"' has no exported member 'FormStep'.
import MultiStepForm from '../MultiStepForm';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { UserIcon } from '../icons/UserIcon';
import { MailIcon } from '../icons/MailIcon';
import { PhoneIcon } from '../icons/PhoneIcon';
import { CalendarIcon } from '../icons/CalendarIcon';
import { LockClosedIcon } from '../icons/LockClosedIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeSlashIcon } from '../icons/EyeSlashIcon';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { LanguageIcon } from '../icons/LanguageIcon';
import { CameraIcon } from '../icons/CameraIcon';
import { BuildingOfficeIcon } from '../icons/BuildingOfficeIcon';
import { IdentificationIcon } from '../icons/IdentificationIcon';
import Button from '../ui/Button';
import apiClient from '../../utils/apiClient';
import { useToast } from '../../hooks/useToast';


interface SignupFormProps {
  onAuthSuccess: (authData: { token: string }) => void;
}

// Redefined and simplified steps for a more logical flow
const SIGNUP_STEPS: FormStep[] = [
  { id: 1, name: 'Account Creation', title: 'Create Your Account', fields: ['fullName', 'email', 'password', 'confirmPassword'] },
  { id: 2, name: 'Verify Email', title: 'Verify Your Email Address', fields: ['otpEmail'] },
  { id: 3, name: 'Profile Details', title: 'Tell us more about yourself', fields: ['gender', 'dateOfBirth', 'mobileNumber', 'maritalStatus', 'religion', 'caste', 'city', 'motherTongue'] },
  { id: 4, name: 'Career & Photo', title: 'Career, Photo & Bio', fields: ['education', 'occupation', 'photo', 'profileBio', 'termsAccepted'] },
];

const SignupForm: React.FC<SignupFormProps> = ({ onAuthSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    mobileNumber: '',
    otpEmail: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    marketingConsent: false,
    maritalStatus: '',
    religion: '',
    caste: '',
    subCaste: '',
    manglikStatus: '',
    profileCreatedBy: '',
    city: '',
    state: '',
    country: '',
    motherTongue: '',
    education: '',
    occupation: '',
    heightValue: '',
    heightUnit: HeightUnit.FEET_INCHES,
    weightValue: '',
    weightUnit: WeightUnit.KG,
    photo: null,
    profileBio: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendOtp = useCallback(async () => {
      setIsLoading(true);
      try {
          await apiClient('/api/auth/resend-otp', { body: { email: formData.email }});
          showToast('A new OTP has been sent.', 'success');
          setResendTimer(30);
      } catch (err: any) {
          showToast(err.message, 'error');
      } finally {
          setIsLoading(false);
      }
  }, [formData.email, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};
    const stepFields = SIGNUP_STEPS[step - 1].fields;

    if (stepFields) {
        for (const field of stepFields) {
            if (field === 'confirmPassword' || field === 'termsAccepted') continue;
            const value = formData[field as keyof SignupFormData];
            if (!value) {
                (newErrors as any)[field] = 'This field is required';
            }
        }
    }
    
    if (step === 1) {
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'A valid email is required';
      if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return false;

      setIsLoading(true);
      try {
        await apiClient('/api/auth/register', { body: { fullName: formData.fullName, email: formData.email, password: formData.password } });
        showToast('Registration initiated. Please check your email for an OTP.', 'success');
        setResendTimer(30);
        return true;
      } catch (err: any) {
        showToast(err.message, 'error');
        setErrors({ email: err.message });
        return false;
      } finally {
        setIsLoading(false);
      }
    } else if (step === 2) {
      if (!formData.otpEmail || formData.otpEmail.length !== 6) {
        newErrors.otpEmail = 'Please enter the 6-digit OTP.';
        setErrors(newErrors);
        return false;
      }
      setIsLoading(true);
      try {
        const data = await apiClient('/api/auth/verify-otp', { body: { email: formData.email, otp: formData.otpEmail } });
        showToast('Email verified successfully!', 'success');
        setAuthToken(data.token);
        localStorage.setItem('token', data.token); // Temporarily set for profile update
        setErrors({});
        return true;
      } catch (err: any) {
        showToast(err.message, 'error');
        setErrors({ otpEmail: err.message });
        return false;
      } finally {
        setIsLoading(false);
      }
    } else if (step === 4) {
        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) {
        showToast("Authentication token not found. Please complete email verification.", 'error');
        setCurrentStep(2);
        return;
    }
    
    setIsLoading(true);
    
    try {
        const payload = { ...formData };
        
        if (payload.photo) {
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append('file', payload.photo);
            cloudinaryFormData.append('upload_preset', 'attut_bandhan'); // Make sure this preset exists in your Cloudinary account

            const cloudinaryData = await apiClient('https://api.cloudinary.com/v1_1/dvrqft9ov/image/upload', {
                method: 'POST',
                body: cloudinaryFormData
            });
            payload.profilePhotoUrl = cloudinaryData.secure_url;
        }

        // Clean up data not needed for the profile update
        delete (payload as any).photo;
        delete (payload as any).password;
        delete (payload as any).confirmPassword;
        delete (payload as any).otpEmail;
        
        // apiClient will use the token from localStorage
        await apiClient('/api/users/profile', {
            method: 'PUT',
            body: payload,
        });

        showToast('Profile created successfully! Welcome aboard.', 'success');
        onAuthSuccess({ token: authToken });

    } catch (err: any) {
        showToast(err.message, 'error');
    } finally {
        setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <Input type="text" id="fullName" name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} error={errors.fullName} icon={<UserIcon className="w-5 h-5 text-gray-400" />} required />
      <Input type="email" id="email" name="email" label="Email Address" value={formData.email} onChange={handleChange} error={errors.email} icon={<MailIcon className="w-5 h-5 text-gray-400" />} required />
      <Input type={showPassword ? 'text' : 'password'} id="password" name="password" label="Password" value={formData.password} onChange={handleChange} error={errors.password} icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />} rightIcon={showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />} onRightIconClick={() => setShowPassword(!showPassword)} required />
      <Input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />} rightIcon={showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />} onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)} required />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <p className="text-sm text-center text-gray-600">We've sent a 6-digit verification code to <br /><strong className="text-gray-800">{formData.email}</strong></p>
      <Input type="text" id="otpEmail" name="otpEmail" label="Enter OTP" value={formData.otpEmail || ''} onChange={handleChange} error={errors.otpEmail} required maxLength={6} inputMode="numeric" pattern="\d{6}" className="text-center [&_input]:text-center [&_input]:tracking-[1em]"/>
      <div className="text-center text-sm">
        <Button type="button" onClick={handleResendOtp} disabled={resendTimer > 0 || isLoading} variant="secondary">
          {isLoading ? 'Sending...' : resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
        </Button>
      </div>
       <p className="text-xs text-center">Entered the wrong email? <button type="button" onClick={() => { setCurrentStep(1); setErrors({}); }} className="text-rose-600 hover:underline">Go Back</button></p>
    </div>
  );
  
  const renderStep3 = () => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select id="gender" name="gender" label="Gender" options={GENDER_OPTIONS} value={formData.gender} onChange={handleChange} error={errors.gender} placeholder="Select Gender" required />
            <Input type="date" id="dateOfBirth" name="dateOfBirth" label="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} required />
        </div>
        <Input id="mobileNumber" name="mobileNumber" label="Mobile Number" value={formData.mobileNumber || ''} onChange={handleChange} error={errors.mobileNumber} placeholder="Enter your mobile number" icon={<PhoneIcon className="w-5 h-5 text-gray-400" />} type="tel" required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select id="maritalStatus" name="maritalStatus" label="Marital Status" options={MARITAL_STATUS_OPTIONS} value={formData.maritalStatus} onChange={handleChange} error={errors.maritalStatus} required />
            <Select id="religion" name="religion" label="Religion" options={RELIGION_OPTIONS} value={formData.religion} onChange={handleChange} error={errors.religion} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="caste" name="caste" label="Caste / Community" value={formData.caste} onChange={handleChange} error={errors.caste} icon={<IdentificationIcon className="w-5 h-5 text-gray-400" />} required />
            <Input id="subCaste" name="subCaste" label="Sub-caste (Optional)" value={formData.subCaste || ''} onChange={handleChange} error={errors.subCaste} icon={<IdentificationIcon className="w-5 h-5 text-gray-400" />} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select id="manglikStatus" name="manglikStatus" label="Manglik Status (Optional)" options={MANGLIK_STATUS_OPTIONS} value={formData.manglikStatus || ''} onChange={handleChange} error={errors.manglikStatus} placeholder="Select Status" />
            <Select id="profileCreatedBy" name="profileCreatedBy" label="Profile Created By (Optional)" options={PROFILE_CREATED_BY_OPTIONS} value={formData.profileCreatedBy || ''} onChange={handleChange} error={errors.profileCreatedBy} placeholder="Select Creator" />
        </div>
        <Input id="city" name="city" label="City" value={formData.city} onChange={handleChange} error={errors.city} icon={<BuildingOfficeIcon className="w-5 h-5 text-gray-400" />} required />
        <Select id="motherTongue" name="motherTongue" label="Mother Tongue" options={MOTHER_TONGUE_OPTIONS} value={formData.motherTongue} onChange={handleChange} error={errors.motherTongue} icon={<LanguageIcon className="w-5 h-5 text-gray-400" />} required />
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <Select id="education" name="education" label="Highest Education" options={EDUCATION_OPTIONS} value={formData.education} onChange={handleChange} error={errors.education} icon={<AcademicCapIcon className="w-5 h-5 text-gray-400" />} required />
             <Select id="occupation" name="occupation" label="Occupation" options={OCCUPATION_OPTIONS} value={formData.occupation} onChange={handleChange} error={errors.occupation} icon={<BriefcaseIcon className="w-5 h-5 text-gray-400" />} required />
        </div>
        <Input type="file" id="photo" name="photo" label="Upload Profile Photo" onChange={handleFileChange} error={errors.photo} icon={<CameraIcon className="w-5 h-5 text-gray-400"/>} accept="image/*" />
        <div>
            <label htmlFor="profileBio" className="block text-xs font-medium text-gray-600 mb-0.5">About Yourself (Bio)</label>
            <textarea id="profileBio" name="profileBio" value={formData.profileBio || ''} onChange={handleChange} rows={3} className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Write a few lines about yourself..."></textarea>
        </div>
        <div className="flex items-start">
            <input id="termsAccepted" name="termsAccepted" type="checkbox" checked={!!formData.termsAccepted} onChange={handleChange} className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded mt-0.5" />
            <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">I accept the <a href="#" className="text-rose-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-rose-600 hover:underline">Privacy Policy</a>.</label>
        </div>
        {errors.termsAccepted && <p className="text-xs text-red-600">{errors.termsAccepted}</p>}
    </div>
  );

  return (
    <>
      <MultiStepForm steps={SIGNUP_STEPS} onFormSubmit={handleSubmit} validateStep={validateStep} currentStep={currentStep} setCurrentStep={setCurrentStep}>
        {renderStep1()}
        {renderStep2()}
        {renderStep3()}
        {renderStep4()}
      </MultiStepForm>
    </>
  );
};

export default SignupForm;