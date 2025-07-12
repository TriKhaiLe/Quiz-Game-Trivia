import React from 'react';
import { TrophyIcon } from '../../icons/TrophyIcon';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2">
                <TrophyIcon className="h-12 w-12 text-yellow-400" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
                Trivia Master
                </h1>
            </div>
            <h2 className="text-2xl font-bold text-slate-200">{title}</h2>
        </header>
        <main className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-indigo-500/10 p-8 border border-slate-700">
            {children}
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
