
import React, { useState } from 'react';
import { Difficulty } from '../types';
import { BrainIcon } from './icons/BrainIcon';

interface QuizSetupProps {
  onStartGame: (topic: string, difficulty: Difficulty) => void;
  error: string | null;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStartGame, error }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStartGame(topic.trim(), difficulty);
    }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <BrainIcon className="h-16 w-16 mb-4 text-indigo-400" />
      <h2 className="text-2xl font-bold mb-2 text-center">Tùy Chỉnh Trò Chơi</h2>
      <p className="text-slate-400 mb-6 text-center">Nhập một chủ đề và chọn độ khó để bắt đầu.</p>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 w-full text-center">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">
            Chủ đề
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ví dụ: Lịch sử Việt Nam, Vũ trụ, Phim ảnh..."
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-slate-300 mb-2">
            Độ khó
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            {Object.values(Difficulty).map((level) => (
              <option key={level} value={level} className="bg-slate-800 text-white">
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={!topic.trim()}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:transform-none"
        >
          Bắt đầu chơi
        </button>
      </form>
    </div>
  );
};

export default QuizSetup;
