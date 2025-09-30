import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { GameState, QuizQuestion } from '../types';
import QuizSetup from './QuizSetup';
import QuizGame from './QuizGame';
import QuizResults from './QuizResults';
import Loader from './common/Loader';
import Header from './common/Header';
import { generateQuizQuestions } from '../services/geminiService';
import { logEvent } from '../services/analyticsService';
import { quizService } from '../services/quizService';

const hasInitialHash = () => window.location.hash.startsWith('#/quiz/') || window.location.hash.startsWith('#/result/');

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [isSharedView, setIsSharedView] = useState<boolean>(hasInitialHash());
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadSharedQuiz = useCallback(async (id: string) => {
    setIsSharedView(true);
    setGameState('loading');
    setError(null);
    setQuestions([]);
    try {
      const { questions, topic, difficulty, startIndex } = await quizService.getQuiz(id);
      if (questions && questions.length > 0) {
        setQuestions(questions);
        setCurrentTopic(topic);
        setCurrentDifficulty(difficulty);
        setStartIndex(startIndex);
        setGameState('playing');
      } else {
        throw new Error("Shared quiz data is invalid.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.";
      setError(`Không thể tải quiz đã chia sẻ: ${errorMessage}`);
      setGameState('setup');
      setIsSharedView(false);
      window.location.hash = ''; // Clear invalid hash
    }
  }, []);

  const loadSharedResult = useCallback(async (id: string) => {
    setIsSharedView(true);
    setGameState('loading');
    setError(null);
    try {
      const { questions, userAnswers, topic, difficulty } = await quizService.getResults(id);
      if (questions && userAnswers) {
        setQuestions(questions);
        setUserAnswers(userAnswers);
        setCurrentTopic(topic);
        setCurrentDifficulty(difficulty);
        setGameState('results');
      } else {
        throw new Error("Shared result data is invalid.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.";
      setError(`Không thể tải kết quả đã chia sẻ: ${errorMessage}`);
      setGameState('setup');
      setIsSharedView(false);
      window.location.hash = ''; // Clear invalid hash
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('/quiz/')) {
        const id = hash.split('/')[2];
        if (id) {
          loadSharedQuiz(id);
        }
      } else if (hash.startsWith('/result/')) {
        const id = hash.split('/')[2];
        if (id) {
          loadSharedResult(id);
        }
      }
    };
    
    window.addEventListener('hashchange', handleHashChange, false);
    handleHashChange(); // Check on initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [loadSharedQuiz, loadSharedResult]);

  const handleStartGame = useCallback(async (topic: string, difficulty: number) => {
    logEvent('start_game', { 'topic': topic, 'difficulty': difficulty });
    setIsSharedView(false);
    setCurrentTopic(topic);
    setCurrentDifficulty(difficulty);
    setStartIndex(0);
    // Clear hash if user starts a new game
    if (window.location.hash) {
      window.location.hash = '';
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setGameState('loading');
    setError(null);
    try {
      const quizData = await generateQuizQuestions(topic, difficulty, { signal: controller.signal });

      if (controller.signal.aborted) {
        console.log("Generation was cancelled by user. Ignoring results.");
        return;
      }

      if (quizData && quizData.length > 0) {
        setQuestions(quizData);
        setUserAnswers([]);
        setGameState('playing');
      } else {
        throw new Error("Không thể tạo câu hỏi. Vui lòng thử lại với chủ đề khác.");
      }
    } catch (err) {
      if (controller.signal.aborted) {
        console.log("Generation was cancelled by user. Ignoring error.");
        return;
      }
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.";
      setError(errorMessage);
      setGameState('setup');
    }
  }, []);

  const handleGameEnd = useCallback((answers: string[]) => {
    setUserAnswers(answers);
    setGameState('results');

    // Tính điểm bằng cách so sánh câu trả lời của người dùng với câu trả lời đúng
    // Hàm reduce thực hiện việc tính điểm bằng cách cộng dồn điểm cho mỗi câu trả lời đúng
    const score = questions.reduce((acc, question, index) => {
        return question.correctAnswer === answers[index] ? acc + 1 : acc;
    }, 0);

    logEvent('game_end', {
        score: score,
        total_questions: questions.length,
    });
  }, [questions]);

  const handlePlayAgain = useCallback(() => {
    setIsSharedView(false);
    setGameState('setup');
    setQuestions([]);
    setUserAnswers([]);
    setError(null);
    setStartIndex(0);
    if(window.location.hash) {
      window.location.hash = '';
    }
  }, []);
  
  const handleReplayQuiz = useCallback(() => {
    setUserAnswers([]);
    setStartIndex(0);
    setGameState('playing');
    setIsSharedView(false); // Go back to normal mode
    if (window.location.hash) {
      window.location.hash = ''; // Clear the URL
    }
  }, []);

  const handleCancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    logEvent('cancel_quiz_generation', { 'topic': currentTopic, 'difficulty': currentDifficulty });
    setGameState('setup');
    setError(null);
  }, [currentTopic, currentDifficulty]);

  const renderContent = () => {
    switch (gameState) {
      case 'loading':
        return <Loader message="Đang tải..." onCancel={handleCancelGeneration} />;
      case 'playing':
        return <QuizGame 
                  questions={questions} 
                  onGameEnd={handleGameEnd} 
                  topic={currentTopic}
                  difficulty={currentDifficulty}
                  startIndex={startIndex}
                />;
      case 'results':
        return <QuizResults 
                  questions={questions} 
                  userAnswers={userAnswers} 
                  onPlayAgain={handlePlayAgain}
                  onReplayQuiz={handleReplayQuiz}
                  topic={currentTopic}
                  difficulty={currentDifficulty}
                  isSharedView={isSharedView}
                />;
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