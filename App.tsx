import React, { useState, useCallback, useEffect } from 'react';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import { AdminRole, LoggedInUserSessionData } from './types';
import apiClient from './utils/apiClient';
import { useToast } from './hooks/useToast';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'auth' | 'dashboard' | 'adminDashboard'>('home');
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUserSessionData | null>(null);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await apiClient('/api/users/profile');

        if (userData.role && userData.role !== 'user' && Object.values(AdminRole).includes(userData.role as AdminRole)) {
            setAdminRole(userData.role);
            setLoggedInUser(null);
            setView('adminDashboard');
        } else {
          setLoggedInUser({
            id: userData.id,
            email: userData.email,
            gender: userData.gender,
            name: userData.fullName,
            photoUrl: userData.profilePhotoUrl,
            membershipTier: userData.membershipTier,
          });
          setAdminRole(null);
          setView('dashboard');
        }
      } catch (error: any) {
        showToast(error.message, 'error');
        localStorage.removeItem('token');
        setView('home');
      }
    } else {
        setView('home');
    }
    setIsLoading(false);
  }, [showToast]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleLoginSignupClick = useCallback(() => {
    setView('auth');
  }, []);

  const handleCloseAuth = useCallback(() => {
    setView('home');
  }, []);

  const handleAuthSuccess = useCallback((authData: { token: string }) => {
    localStorage.setItem('token', authData.token);
    setIsLoading(true); 
    loadUser();
  }, [loadUser]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setLoggedInUser(null);
    setAdminRole(null);
    setView('home');
  }, []);

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen bg-rose-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500"></div>
          <p className="ml-4 text-lg text-gray-600">Loading Your Experience...</p>
        </div>
      );
    }
    switch (view) {
      case 'auth':
        return <AuthPage onAuthSuccess={handleAuthSuccess} onClose={handleCloseAuth} />;
      case 'dashboard':
        if (loggedInUser) {
          return <DashboardPage loggedInUser={loggedInUser} onLogout={handleLogout} />;
        }
        setView('home');
        return <HomePage onLoginSignupClick={handleLoginSignupClick} onAdminLoginClick={() => {}} />;
      case 'adminDashboard':
        if (adminRole) {
          return <AdminDashboardPage adminRole={adminRole} onAdminLogout={handleLogout} />;
        }
        setView('home');
        return <HomePage onLoginSignupClick={handleLoginSignupClick} onAdminLoginClick={() => {}} />;
      case 'home':
      default:
        return <HomePage onLoginSignupClick={handleLoginSignupClick} onAdminLoginClick={() => {}} />;
    }
  };

  return (
    <div className="App">
      {renderView()}
    </div>
  );
};

export default App;