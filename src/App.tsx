import React from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import GameContainer from './components/GameContainer';
import LoginScreen from './components/auth/LoginScreen';
import ProfileSetupScreen from './components/auth/ProfileSetupScreen';
import SignupScreen from './components/auth/SignupScreen';
import Loader from './components/common/Loader';

const AppContent: React.FC = () => {
  const { loading, view } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <Loader message="Đang tải..." />
      </div>
    );
  }

  switch (view) {
    case 'login':
      return <LoginScreen />;
    case 'signup':
      return <SignupScreen />;
    case 'profile-setup':
      return <ProfileSetupScreen />;
    case 'game':
    default:
      return <GameContainer />;
  }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
