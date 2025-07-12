import React, { useState, useCallback } from 'react';
import type { GameState, QuizQuestion } from '../types';
import QuizSetup from './QuizSetup';
import QuizGame from './QuizGame';
import QuizResults from './QuizResults';
import Loader from './common/Loader';
import Header from './common/Header';
import { generateQuizQuestions } from '../services/geminiService';

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStartGame = useCallback(async (topic: string, difficulty: number) => {
    setGameState('loading');
    setError(null);
    try {
      const quizData = await generateQuizQuestions(topic, difficulty);
      if (quizData && quizData.length > 0) {
        setQuestions(quizData);
        setUserAnswers([]);
        setGameState('playing');
      } else {
        throw new Error("Không thể tạo câu hỏi. Vui lòng thử lại với chủ đề khác.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.";
      setError(errorMessage);
      setGameState('setup');
    }
  }, []);

  const handleGameEnd = useCallback((answers: string[]) => {
    setUserAnswers(answers);
    setGameState('results');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameState('setup');
    setQuestions([]);
    setUserAnswers([]);
    setError(null);
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case 'loading':
        return <Loader message="Đang tạo bộ câu hỏi, vui lòng chờ..." />;
      case 'playing':
        return <QuizGame questions={questions} onGameEnd={handleGameEnd} />;
      case 'results':
        return <QuizResults questions={questions} userAnswers={userAnswers} onPlayAgain={handlePlayAgain} />;
      case 'setup':
      default:
        return <QuizSetup onStartGame={handleStartGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        {error && gameState === 'setup' && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg my-4 w-full text-center">
                {error}
            </div>
        )}
        <main className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-indigo-500/10 p-6 md:p-8 border border-slate-700 mt-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default GameContainer;