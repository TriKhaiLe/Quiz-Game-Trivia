
import React, { useState, useCallback } from 'react';
import { type GameState, type QuizQuestion, Difficulty } from './types';
import QuizSetup from './components/QuizSetup';
import QuizGame from './components/QuizGame';
import QuizResults from './components/QuizResults';
import Loader from './components/common/Loader';
import { generateQuizQuestions } from './services/geminiService';
import { TrophyIcon } from './components/icons/TrophyIcon';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStartGame = useCallback(async (topic: string, difficulty: Difficulty) => {
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
        return <QuizSetup onStartGame={handleStartGame} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4">
            <TrophyIcon className="h-12 w-12 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
              Trivia Master
            </h1>
          </div>
          <p className="text-slate-400 mt-2">Thử thách kiến thức của bạn với AI</p>
        </header>
        <main className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-indigo-500/10 p-6 md:p-8 border border-slate-700">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
