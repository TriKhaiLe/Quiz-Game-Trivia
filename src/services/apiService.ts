// UNCOMMENT THIS ENTIRE FILE TO USE

// Make sure to set this in your environment variables (.env file)
const API_BASE_URL = import.meta.env.API_BASE_URL || 'https://localhost:7195';

interface ProfileData {
  username: string;
  avatarId: string;
}

const handleResponse = async (response: Response) => {
    if (response.ok) {
        // For 204 No Content, return null or an empty object
        if (response.status === 204) {
            return null;
        }
        return response.json();
    } else {
        const errorBody = await response.json().catch(() => ({ message: 'An unknown API error occurred' }));
        const errorMessage = errorBody.message || errorBody.error || `API request failed with status ${response.status}`;
        // Special handling for 404 to distinguish "not found" from other errors
        if (response.status === 404) {
            throw new Error('Profile not found');
        }
        throw new Error(errorMessage);
    }
}

export const apiService = {
  async getProfile(token: string): Promise<ProfileData> {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  async updateProfile(token: string, username: string, avatarId: string): Promise<ProfileData> {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, avatarId }),
    });
    return handleResponse(response);
  },
};

