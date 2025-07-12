import React from 'react';
import type { QuizQuestion } from '../types';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';
import { TrophyIcon } from '../icons/TrophyIcon';


interface QuizResultsProps {
  questions: QuizQuestion[];
  userAnswers: string[];
  onPlayAgain: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ questions, userAnswers, onPlayAgain }) => {
  const score = questions.reduce((acc, question, index) => {
    return question.correctAnswer === userAnswers[index] ? acc + 1 : acc;
  }, 0);

  const getRemark = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return "Tuyệt vời! Bạn là một bậc thầy!";
    if (percentage >= 80) return "Kết quả rất tốt!";
    if (percentage >= 50) return "Cũng không tệ, hãy cố gắng hơn nhé!";
    return "Cần cố gắng nhiều hơn!";
  }

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <TrophyIcon className="h-20 w-20 text-yellow-400 mb-4" />
      <h2 className="text-3xl font-bold mb-2">Hoàn Thành!</h2>
      <p className="text-xl text-slate-300 mb-2">
        Bạn đã trả lời đúng <span className="font-bold text-green-400">{score}</span> trên <span className="font-bold text-indigo-400">{questions.length}</span> câu hỏi.
      </p>
      <p className="text-lg text-yellow-400 font-semibold mb-8">{getRemark(score, questions.length)}</p>

      <div className="w-full space-y-4 mb-8 max-h-80 overflow-y-auto pr-2">
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = question.correctAnswer === userAnswer;
          return (
            <div key={index} className="bg-slate-700/50 p-4 rounded-lg border-l-4 border-slate-600">
              <p className="font-semibold mb-2">{index + 1}. {question.question}</p>
              <div className={`flex items-center gap-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? <CheckIcon className="h-5 w-5 flex-shrink-0" /> : <XIcon className="h-5 w-5 flex-shrink-0" />}
                <p>Bạn đã chọn: {userAnswer || "Chưa trả lời"}</p>
              </div>
              {!isCorrect && (
                <div className="flex items-center gap-2 text-sky-400 mt-1">
                  <CheckIcon className="h-5 w-5 flex-shrink-0" />
                  <p>Đáp án đúng: {question.correctAnswer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onPlayAgain}
        className="w-full max-w-sm bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
      >
        Chơi lại
      </button>
    </div>
  );
};

export default QuizResults;
