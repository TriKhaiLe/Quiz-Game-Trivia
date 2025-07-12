import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { TrophyIcon } from '../../icons/TrophyIcon';
import { LogoutIcon } from '../../icons/LogoutIcon';
import { Avatars } from '../../icons/Avatars';
import { UserIcon } from '../../icons/UserIcon';


const Header: React.FC = () => {
  const { user, logout, setView } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const UserAvatar = user ? Avatars[user.avatarId] : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <TrophyIcon className="h-10 w-10 text-yellow-400" />
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
          Trivia Master
        </h1>
      </div>
      {user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <span className="font-semibold hidden sm:inline">{user.username}</span>
            {UserAvatar ? (
                 <UserAvatar className="h-10 w-10 rounded-full bg-slate-700 p-1" />
            ) : (
                <UserIcon className="h-10 w-10 rounded-full bg-slate-700 p-1 text-slate-400" />
            )}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 animate-fade-in-fast">
              <div className="p-2 border-b border-slate-700">
                <p className="font-bold text-white">{user.username}</p>
                <p className="text-sm text-slate-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={async () => {
                    await logout();
                    setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <LogoutIcon className="h-5 w-5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      ) : (
         <button
          onClick={() => setView('login')}
          className="bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
        >
          Đăng nhập / Đăng ký
        </button>
      )}
    </header>
  );
};

export default Header;
