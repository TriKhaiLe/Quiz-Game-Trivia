import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import AuthLayout from '../common/AuthLayout';
import AvatarPicker from './AvatarPicker';
import { avatarIds } from '../../icons/Avatars';

const ProfileSetupScreen: React.FC = () => {
  const { updateProfile, user } = useAuth();
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarIds[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setLoading(true);
    try {
      await updateProfile(username, selectedAvatar);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Hoàn tất hồ sơ của bạn">
      <p className="text-center text-slate-400 mb-6">
        Chào mừng bạn! Chỉ cần thêm một vài chi tiết nữa thôi.
      </p>
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 w-full text-center">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Chọn Avatar
          </label>
          <AvatarPicker selectedAvatar={selectedAvatar} onSelectAvatar={setSelectedAvatar} />
        </div>
        <div>
          <label htmlFor="username-setup" className="block text-sm font-medium text-slate-300 mb-2">
            Tên người dùng
          </label>
          <input
            type="text"
            id="username-setup"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            required
            autoComplete="username"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Đang lưu...' : 'Lưu và tiếp tục'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ProfileSetupScreen;
