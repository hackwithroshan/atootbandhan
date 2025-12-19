import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { MailIcon } from '../icons/MailIcon';
import { LockClosedIcon } from '../icons/LockClosedIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeSlashIcon } from '../icons/EyeSlashIcon';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import apiClient from '../../utils/apiClient';
import { useToast } from '../../hooks/useToast';

interface LoginFormProps {
  onAuthSuccess: (authData: { token: string }) => void;
}

type LoginView = 'LOGIN' | 'FORGOT_PASSWORD_EMAIL' | 'FORGOT_PASSWORD_RESET';

const LoginForm: React.FC<LoginFormProps> = ({ onAuthSuccess }) => {
  const [view, setView] = useState<LoginView>('LOGIN');
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await apiClient('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      onAuthSuccess(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      
      try {
          const data = await apiClient('/api/auth/forgot-password', {
              method: 'POST',
              body: { email },
          });
          
          showToast(data.msg, 'success');
          setView('FORGOT_PASSWORD_RESET');

      } catch (err: any) {
          showToast(err.message, 'error');
      } finally {
          setIsLoading(false);
      }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmNewPassword) {
          showToast("New passwords do not match.", 'error');
          return;
      }
      if (newPassword.length < 6) {
          showToast("Password must be at least 6 characters.", 'error');
          return;
      }

      setIsLoading(true);

      try {
          const data = await apiClient('/api/auth/reset-password', {
              method: 'POST',
              body: { email, otp: resetOtp, newPassword },
          });

          showToast(data.msg, 'success');
          setPassword('');
          setView('LOGIN');
      } catch (err: any) {
          showToast(err.message, 'error');
      } finally {
          setIsLoading(false);
      }
  };

  if (view === 'LOGIN') {
      return (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<MailIcon className="w-5 h-5 text-gray-400" />}
            required
            autoComplete="email"
          />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
            rightIcon={showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            onRightIconClick={() => setShowPassword(!showPassword)}
            required
            autoComplete="current-password"
          />
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-gray-700">Remember me</label>
            </div>
            <button type="button" onClick={() => setView('FORGOT_PASSWORD_EMAIL')} className="font-medium text-rose-600 hover:text-rose-500">
              Forgot your password?
            </button>
          </div>
          <Button type="submit" variant="primary" className="w-full !py-3" isLoading={isLoading} disabled={isLoading}>
            Log in
          </Button>
        </form>
      );
  }

  if (view === 'FORGOT_PASSWORD_EMAIL') {
      return (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
             <div className="flex items-center mb-4">
                <button type="button" onClick={() => setView('LOGIN')} className="text-gray-500 hover:text-gray-700 mr-2">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-gray-800">Reset Password</h2>
             </div>
             <p className="text-sm text-gray-600 mb-4">Enter your email address and we'll send you an OTP to reset your password.</p>
             <Input
                id="reset-email"
                name="email"
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<MailIcon className="w-5 h-5 text-gray-400" />}
                required
                autoComplete="email"
              />
              <Button type="submit" variant="primary" className="w-full !py-3" isLoading={isLoading} disabled={isLoading}>
                Send OTP
              </Button>
          </form>
      );
  }

  if (view === 'FORGOT_PASSWORD_RESET') {
      return (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="flex items-center mb-4">
                <button type="button" onClick={() => setView('FORGOT_PASSWORD_EMAIL')} className="text-gray-500 hover:text-gray-700 mr-2">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-gray-800">Create New Password</h2>
             </div>
             <p className="text-sm text-gray-600 mb-2">OTP sent to <strong>{email}</strong></p>
             <Input
                id="otp"
                name="otp"
                type="text"
                label="Enter OTP"
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value)}
                placeholder="6-digit code"
                required
              />
             <Input
                id="newPassword"
                name="newPassword"
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                label="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" className="w-full !py-3" isLoading={isLoading} disabled={isLoading}>
                Reset Password
              </Button>
          </form>
      );
  }

  return null;
};

export default LoginForm;