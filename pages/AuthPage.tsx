import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { FacebookIcon } from '../components/icons/FacebookIcon';
import { AppleIcon } from '../components/icons/AppleIcon';
import Button from '../components/ui/Button';
import { AdminRole, LoggedInUserSessionData } from '../types'; 

interface AuthPageProps {
  onAuthSuccess: (authData: { token: string }) => void; 
  onClose: () => void; 
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  const handleSocialLogin = (provider: string) => {
    console.log(`Attempting ${provider} login...`);
    // Mock success:
    // For social logins, we'd typically not differentiate admin/user here
    // unless the social provider gives us role info, which is uncommon.
    // So, social login will proceed as a regular user login.
    // onAuthSuccess(); // This would use the default user (Priya Sharma) if App.tsx fallback is hit
                      // Or, ideally, this would involve a proper social login flow that returns LoggedInUserSessionData
  };

  const signupFormWidthClasses = 'max-w-xl md:w-3/4 md:max-w-4xl lg:w-3/4 lg:max-w-5xl';
  const loginFormWidthClasses = 'max-w-md';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 p-4">
      <div className={`w-full ${isLoginView ? loginFormWidthClasses : signupFormWidthClasses} bg-white p-8 md:p-10 rounded-xl shadow-2xl relative transition-all duration-300 ease-in-out`}>
        <Button 
            onClick={onClose} 
            variant="secondary" 
            size="sm"
            className="absolute top-4 right-4 !p-2 !rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            aria-label="Close authentication"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </Button>

        <div className="text-center mb-8">
          <a href="#" onClick={(e) => { e.preventDefault(); onClose();}} className="text-4xl font-bold tracking-tight text-rose-600">
            Atut Bandhan
          </a>
          <p className="text-gray-600 mt-2">
            {isLoginView ? 'Welcome back! Please login to your account.' : 'Create your account to find your perfect match.'}
          </p>
        </div>

        {isLoginView ? <LoginForm onAuthSuccess={onAuthSuccess} /> : <SignupForm onAuthSuccess={onAuthSuccess} />} 

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or {isLoginView ? 'login' : 'sign up'} with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button variant="secondary" onClick={() => handleSocialLogin('Google')} className="w-full !justify-start !text-sm !py-3">
              <GoogleIcon className="w-5 h-5 mr-2" /> Google
            </Button>
            <Button variant="secondary" onClick={() => handleSocialLogin('Facebook')} className="w-full !justify-start !text-sm !py-3">
              <FacebookIcon className="w-5 h-5 mr-2 text-[#1877F2]" /> Facebook
            </Button>
            <Button variant="secondary" onClick={() => handleSocialLogin('Apple')} className="w-full !justify-start !text-sm !py-3">
              <AppleIcon className="w-5 h-5 mr-2" /> Apple
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm">
          {isLoginView ? (
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => setIsLoginView(false)} className="font-medium text-rose-600 hover:text-rose-500">
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Already have an account?{' '}
              <button onClick={() => setIsLoginView(true)} className="font-medium text-rose-600 hover:text-rose-500">
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;