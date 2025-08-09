import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import GameContainer from './components/GameContainer';
import LoginScreen from './components/auth/LoginScreen';
import ProfileSetupScreen from './components/auth/ProfileSetupScreen';
import SignupScreen from './components/auth/SignupScreen';
import Loader from './components/common/Loader';
import { logPageView } from './services/analyticsService'; // BƯỚC 4: Bỏ comment dòng này

const AppContent: React.FC = () => {
  const { loading, view, user } = useAuth();
    useEffect(() => {
      // Map a view state to a page path and title for analytics
      let pagePath = '/';
      let pageTitle = 'Game';

      switch (view) {
          case 'login':
              pagePath = '/login';
              pageTitle = 'Login';
              break;
          case 'signup':
              pagePath = '/signup';
              pageTitle = 'Sign Up';
              break;
          case 'profile-setup':
              pagePath = '/profile-setup';
              pageTitle = 'Profile Setup';
              break;
          case 'game':
          default:
              pagePath = user ? '/game' : '/';
              pageTitle = 'Trivia Game';
              break;
      }
      logPageView(pagePath, pageTitle);
  }, [view, user]); // Chạy mỗi khi view hoặc user thay đổi


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
