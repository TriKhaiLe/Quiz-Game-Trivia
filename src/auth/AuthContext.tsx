import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import type { AuthContextType, User, ViewState } from '../types';
// import { USE_MOCK_AUTH } from './config';
// import { mockAuthService } from './authService';

// UNCOMMENT THIS BLOCK TO USE REAL AUTH
import { supabaseAuthService } from '../services/supabaseService';
import { apiService } from '../services/apiService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('game');

  // --- MOCK AUTH SERVICE ---
  // const authService = mockAuthService;

  // const initializeAuth = useCallback(async () => {
  //   try {
  //     const currentUser = await authService.getCurrentUser();
  //     if (currentUser) {
  //       setUser(currentUser);
  //       if (!currentUser.username || !currentUser.avatarId) {
  //           setView('profile-setup');
  //       } else {
  //           setView('game');
  //       }
  //     } else {
  //       setView('game');
  //     }
  //   } catch (e) {
  //     console.error("Auth initialization failed", e);
  //     setView('game');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [authService]);

  // useEffect(() => {
  //   initializeAuth();
  // }, [initializeAuth]);

  // const login = async (email: string, password: string) => {
  //   const { user } = await authService.login(email, password);
  //   setUser(user);
  //   setView('game');
  // };

  // const signup = async (email: string, password: string, username: string, avatarId: string) => {
  //   const { user } = await authService.signup(email, password, username, avatarId);
  //   setUser(user);
  //   setView('game');
  // };

  // const loginWithGoogle = async () => {
  //   const { user, isNewUser } = await authService.loginWithGoogle();
  //   if(user){
  //       setUser(user);
  //       if (isNewUser) {
  //           setView('profile-setup');
  //       } else {
  //           setView('game');
  //       }
  //   }
  // };

  // const logout = async () => {
  //   await authService.logout();
  //   setUser(null);
  //   setView('game');
  // };
  
  // const updateProfile = async (username: string, avatarId: string) => {
  //   if(!user) throw new Error("User not logged in");
  //   const updatedUser = await authService.updateProfile(user.id, username, avatarId);
  //   setUser(updatedUser);
  //   setView('game');
  // };
  
  // --- REAL AUTH SERVICE (SUPABASE + .NET API) ---
  // UNCOMMENT THIS BLOCK AND COMMENT OUT THE MOCK BLOCK ABOVE
  
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
    } else {
        throw new Error("Signup successful, but no session returned. Please check your email for verification and log in.");
    }
  };

  const loginWithGoogle = async () => {
    // This will redirect the user, and the onAuthStateChange listener will handle the session
    await supabaseAuthService.loginWithGoogle();
  };

  const logout = async () => {
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

  // const authService = USE_MOCK_AUTH ? mockAuthService : {
  //     login,
  //     signup,
  //     loginWithGoogle,
  //     logout,
  //     updateProfile
  // };

  // const value = {
  //   user,
  //   loading,
  //   view,
  //   setView,
  //   login: USE_MOCK_AUTH ? login : () => Promise.resolve(), // Replace with real login
  //   signup: USE_MOCK_AUTH ? signup : () => Promise.resolve(), // Replace with real signup
  //   loginWithGoogle: USE_MOCK_AUTH ? loginWithGoogle : () => Promise.resolve(), // Replace with real google login
  //   logout,
  //   updateProfile,
  // };

  // When you uncomment the block above, replace the `value` object with this:
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
