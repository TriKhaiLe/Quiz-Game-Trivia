import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { GoogleIcon } from '../../icons/GoogleIcon';
import AuthLayout from '../common/AuthLayout';

const LoginScreen: React.FC = () => {
  const { login, loginWithGoogle, setView } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Đăng nhập Google thất bại.');
        setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đăng nhập tài khoản">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 w-full text-center">
          {error}
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800 text-slate-400">Hoặc tiếp tục với</span>
        </div>
      </div>
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex justify-center items-center gap-3 bg-slate-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
      >
        <GoogleIcon className="h-5 w-5" />
        <span>Đăng nhập với Google</span>
      </button>
      <p className="mt-6 text-center text-sm text-slate-400">
        Chưa có tài khoản?{' '}
        <button onClick={() => setView('signup')} className="font-semibold text-indigo-400 hover:text-indigo-300">
          Đăng ký ngay
        </button>
      </p>
    </AuthLayout>
  );
};

export default LoginScreen;
