export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export type GameState = 'setup' | 'loading' | 'playing' | 'results';
export type ViewState = 'login' | 'signup' | 'profile-setup' | 'game';

export interface User {
  id: string;
  email: string;
  username: string;
  avatarId: string; // e.g., 'avatar-1'
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  view: ViewState;
  setView: (view: ViewState) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    username: string,
    avatarId: string
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (username: string, avatarId: string) => Promise<void>;
}
