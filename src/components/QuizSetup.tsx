
import React, { useState } from 'react';
import { BrainIcon } from './icons/BrainIcon';

interface QuizSetupProps {
  onStartGame: (topic: string, difficulty: number) => void;
  error: string | null;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStartGame, error }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<number>(5);

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
            Độ khó: <span className="font-bold text-indigo-400">{difficulty}</span>/10
          </label>
          <input
            type="range"
            id="difficulty"
            min="1"
            max="10"
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500"
          />
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
