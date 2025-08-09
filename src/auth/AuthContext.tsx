import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import type { AuthContextType, User, ViewState } from '../types';
import { supabaseAuthService } from '../services/supabaseService';
import { apiService } from '../services/apiService';
import { logEvent } from '../services/analyticsService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('game');
  
  const hasFetchedProfile = useRef(false);
  const initializeAuth = useCallback(async () => {
    try {
      if (hasFetchedProfile.current) {
        setLoading(false);
        return;
      }
      const session = await supabaseAuthService.getCurrentSession();
      if (session?.user) {
        const token = session.access_token;
        try {
          const profile = await apiService.getProfile(token);
          setUser({
            id: session.user.id,
            email: session.user.email!,
            username: profile.username,
            avatarId: profile.avatarId
          });
          setView('game');
          hasFetchedProfile.current = true;
        } catch (error) {
          // This likely means a 404, user needs to set up their profile
          console.warn("Profile not found, directing to setup.");
          setUser({
            id: session.user.id,
            email: session.user.email!,
            username: '',
            avatarId: ''
          });
          setView('profile-setup');
          hasFetchedProfile.current = true;
        }
      } else {
        setUser(null);
        setView('game');
        hasFetchedProfile.current = false;
      }
    } catch (e) {
      console.error("Auth initialization failed", e);
      setUser(null);
      setView('game');
      hasFetchedProfile.current = false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();

    const { data: authListener } = supabaseAuthService.onAuthStateChange((_event) => {
        // This handles session changes, like after a password recovery or OAuth redirect
        initializeAuth();
    });

    return () => {
        authListener?.subscription.unsubscribe();
    };
  }, [initializeAuth]);

  const login = async (email: string, password: string) => {
    const { session } = await supabaseAuthService.login(email, password);
    if (session?.user) {
        const token = session.access_token;
        try {
            const profile = await apiService.getProfile(token);
            setUser({ id: session.user.id, email: session.user.email!, ...profile });
            setView('game');
            logEvent('login', { method: 'email' });
        } catch (e) {
            setUser({ id: session.user.id, email: session.user.email!, username: '', avatarId: '' });
            setView('profile-setup');
        }
    }
  };

  const signup = async (email: string, password: string, username: string, avatarId: string) => {
    // Supabase handles the user creation. Profile is created separately.
    // NOTE: This flow assumes no email verification. If verification is on,
    // the user needs to log in *after* verifying to create their profile.
    const { session } = await supabaseAuthService.signup(email, password);
     if (session?.user) {
        const token = session.access_token;
        // After successful signup, create the profile immediately.
        const profile = await apiService.updateProfile(token, username, avatarId);
        setUser({ id: session.user.id, email: session.user.email!, ...profile });
        setView('game');
        logEvent('sign_up', { method: 'email' });
    } else {
        throw new Error("Signup successful, but no session returned. Please check your email for verification and log in.");
    }
  };

  const loginWithGoogle = async () => {
    // This will redirect the user, and the onAuthStateChange listener will handle the session
    await supabaseAuthService.loginWithGoogle();
  };

  const logout = async () => {
    if (user) {
        logEvent('logout');
    }
    await supabaseAuthService.logout();
    setUser(null);
    setView('game');
  };
  
  const updateProfile = async (username: string, avatarId: string) => {
    if(!user) throw new Error("User not logged in");
    const token = await supabaseAuthService.getToken();
    if (!token) throw new Error("No active session");
    
    const updatedProfile = await apiService.updateProfile(token, username, avatarId);
    setUser({ ...user, ...updatedProfile });
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
