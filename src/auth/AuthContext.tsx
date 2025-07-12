import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { AuthContextType, User, ViewState } from '../types';
import { USE_MOCK_AUTH } from './config';
import { mockAuthService } from './authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('game');

  // In a real app, you would switch between mockAuthService and a real service (e.g., supabaseAuthService)
  const authService = USE_MOCK_AUTH ? mockAuthService : /* realAuthService */ mockAuthService;

  const initializeAuth = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        // If user object from session is incomplete (e.g., google signup pending profile)
        if (!currentUser.username || !currentUser.avatarId) {
            setView('profile-setup');
        } else {
            setView('game');
        }
      } else {
        setView('game');
      }
    } catch (e) {
      console.error("Auth initialization failed", e);
      setView('game');
    } finally {
      setLoading(false);
    }
  }, [authService]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (email: string, password: string) => {
    const { user } = await authService.login(email, password);
    setUser(user);
    setView('game');
  };

  const signup = async (email: string, password: string, username: string, avatarId: string) => {
    const { user } = await authService.signup(email, password, username, avatarId);
    setUser(user);
    setView('game');
  };

  const loginWithGoogle = async () => {
    const { user, isNewUser } = await authService.loginWithGoogle();
    if(user){
        setUser(user);
        if (isNewUser) {
            setView('profile-setup');
        } else {
            setView('game');
        }
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setView('game');
  };
  
  const updateProfile = async (username: string, avatarId: string) => {
    if(!user) throw new Error("User not logged in");
    const updatedUser = await authService.updateProfile(user.id, username, avatarId);
    setUser(updatedUser);
    setView('game');
  };

  const value = {
    user,
    loading,
    view,
    setView,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
