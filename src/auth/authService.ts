import type { User } from '../types';

// --- Mock Database ---
const DB_USERS_KEY = 'trivia_mock_users';
const DB_SESSION_KEY = 'trivia_mock_session';

const getMockUsers = (): User[] => {
  const users = localStorage.getItem(DB_USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveMockUsers = (users: User[]) => {
  localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
};

// --- Mock Service Implementation ---

export const mockAuthService = {
  async getCurrentUser(): Promise<User | null> {
    const session = localStorage.getItem(DB_SESSION_KEY);
    if (!session) return null;
    return JSON.parse(session);
  },

  async login(email: string): Promise<{ user: User }> {
    const users = getMockUsers();
    const user = users.find(u => u.email === email);
    
    // In a real app, you'd check a hashed password. Here we simplify.
    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng.');
    }
    
    localStorage.setItem(DB_SESSION_KEY, JSON.stringify(user));
    return { user };
  },

  async signup(email: string, username: string, avatarId: string): Promise<{ user: User }> {
    const users = getMockUsers();
    if (users.some(u => u.email === email)) {
      throw new Error('Email này đã được sử dụng.');
    }
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        throw new Error('Tên người dùng này đã tồn tại.');
    }

    const newUser: User = {
      id: `mock_${Date.now()}`,
      email,
      username,
      avatarId,
    };

    users.push(newUser);
    saveMockUsers(users);
    localStorage.setItem(DB_SESSION_KEY, JSON.stringify(newUser));
    
    return { user: newUser };
  },

  async loginWithGoogle(): Promise<{ user: User | null; isNewUser: boolean; }> {
    // This is a simulation. In a real app, this would involve a popup and redirects.
    const users = getMockUsers();
    const googleEmail = `user${Date.now()}@gmail.com`;
    
    let user = users.find(u => u.email === googleEmail);
    if (user) {
      localStorage.setItem(DB_SESSION_KEY, JSON.stringify(user));
      return { user, isNewUser: false };
    }

    // Simulate creating a temporary user object that needs profile setup
    const tempUser = {
        id: `mock_google_${Date.now()}`,
        email: googleEmail
    }

    // Don't save to mock users DB yet. The profile setup step will do that.
    localStorage.setItem(DB_SESSION_KEY, JSON.stringify(tempUser));

    return { user: tempUser as User, isNewUser: true };
  },

  async logout(): Promise<void> {
    localStorage.removeItem(DB_SESSION_KEY);
  },

  async updateProfile(userId: string, username: string, avatarId: string): Promise<User> {
    const users = getMockUsers();
    const sessionUser = await this.getCurrentUser();
    if (!sessionUser || sessionUser.id !== userId) {
        throw new Error("Unauthorized");
    }

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase() && u.id !== userId)) {
        throw new Error('Tên người dùng này đã tồn tại.');
    }

    let userToUpdate = users.find(u => u.id === userId);
    let updatedUser: User;

    if (userToUpdate) {
        // Update existing user
        userToUpdate.username = username;
        userToUpdate.avatarId = avatarId;
        updatedUser = userToUpdate;
    } else {
        // Create new user (case for Google sign-up completion)
        updatedUser = { ...sessionUser, username, avatarId };
        users.push(updatedUser);
    }
    
    saveMockUsers(users);
    localStorage.setItem(DB_SESSION_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },
};
