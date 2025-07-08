
import React, { useState, useEffect, useCallback } from 'react';
import type { QuizQuestion } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface QuizGameProps {
  questions: QuizQuestion[];
  onGameEnd: (answers: string[]) => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ questions, onGameEnd }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answer);
    setUserAnswers(prev => [...prev, answer]);
  };
  
  const handleNextQuestion = useCallback(() => {
    if (isLastQuestion) {
      onGameEnd(userAnswers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  }, [isLastQuestion, onGameEnd, userAnswers]);
  
  useEffect(() => {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      // Progress reflects the number of *answered* questions.
      const progress = (userAnswers.length / questions.length) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }, [userAnswers.length, questions.length]);


  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-slate-700 hover:bg-slate-600 border-slate-600 hover:border-indigo-500';
    }
    const isCorrect = option === currentQuestion.correctAnswer;
    const isSelected = option === selectedAnswer;

    if (isCorrect) {
      return 'bg-green-500/80 scale-105 border-green-400';
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-500/80 border-red-400';
    }
    return 'bg-slate-700 opacity-50 border-slate-700';
  };
  
  return (
    <div className="animate-fade-in flex flex-col justify-between min-h-[420px]">
      <div>
        <div className="mb-6">
            <p className="text-sm text-indigo-300 font-medium">Câu hỏi {currentQuestionIndex + 1} trên {questions.length}</p>
            <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                <div id="progress-bar" className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"></div>
            </div>
        </div>

        <h2 className="text-xl md:text-2xl font-semibold mb-8 min-h-[6rem] flex items-center">{currentQuestion.question}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={isAnswered}
                    className={`p-4 rounded-lg text-left font-medium transition-all duration-300 flex items-center justify-between border-2 ${getButtonClass(option)}`}
                >
                    <span>{option}</span>
                    {isAnswered && option === currentQuestion.correctAnswer && <CheckIcon className="h-6 w-6 text-white" />}
                    {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && <XIcon className="h-6 w-6 text-white" />}
                </button>
            ))}
        </div>
      </div>
        
      <div className="mt-8 flex justify-end h-14">
        {isAnswered && (
            <button
                onClick={handleNextQuestion}
                className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 animate-fade-in"
            >
                {isLastQuestion ? 'Xem kết quả' : 'Câu tiếp theo'}
            </button>
        )}
      </div>
    </div>
  );
};

export default QuizGame;
