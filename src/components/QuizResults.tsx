import React, { useState, useCallback } from 'react';
import type { QuizQuestion } from '../types';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';
import { TrophyIcon } from '../icons/TrophyIcon';
import { quizService } from '../services/quizService';
import { ShareIcon } from '../icons/ShareIcon';
import { CopyIcon } from '../icons/CopyIcon';

interface QuizResultsProps {
  questions: QuizQuestion[];
  userAnswers: string[];
  onPlayAgain: () => void;
  onReplayQuiz: () => void;
  topic: string;
  difficulty: number;
  isSharedView?: boolean;
}

const QuizResults: React.FC<QuizResultsProps> = ({ questions, userAnswers, onPlayAgain, onReplayQuiz, topic, difficulty, isSharedView = false }) => {
  const [shareState, setShareState] = useState<'idle' | 'sharing' | 'shared' | 'error'>('idle');
  const [shareUrl, setShareUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

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

  const handleShareResults = useCallback(async () => {
    setShareState('sharing');
    try {
      const result = await quizService.shareResults({
        questions,
        userAnswers,
        topic,
        difficulty,
      });
      
      const url = quizService.getShareableLink(result.id, 'result');
      setShareUrl(url);
      setShareState('shared');
    } catch (error) {
      console.error("Failed to share results:", error);
      setShareState('error');
      setTimeout(() => setShareState('idle'), 3000);
    }
  }, [questions, userAnswers, topic, difficulty]);

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

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

      <div className="w-full max-w-sm flex flex-col gap-4 items-center">
        {isSharedView ? (
          <>
            <button
              onClick={onReplayQuiz}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              Chơi lại quiz này
            </button>
            <button
              onClick={onPlayAgain}
              className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-700 transition-all"
            >
              Tạo quiz mới
            </button>
          </>
        ) : (
          <button
            onClick={onPlayAgain}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            Chơi lại
          </button>
        )}
        
        {/* Share Section */}
        {!isSharedView && (
          <div className="w-full h-10 flex items-center justify-center">
            {shareState === 'idle' && (
              <button
                onClick={handleShareResults}
                className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors"
                title="Chia sẻ kết quả này"
              >
                <ShareIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">Chia sẻ kết quả</span>
              </button>
            )}
            {shareState === 'sharing' && (
              <div className="flex items-center gap-2 text-slate-400 animate-fade-in-fast">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-400"></div>
                <span className="text-sm">Đang tạo link...</span>
              </div>
            )}
            {shareState === 'error' && (
              <p className="text-sm text-red-400 animate-fade-in-fast">Lỗi khi chia sẻ!</p>
            )}
            {shareState === 'shared' && (
              <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-700 w-full animate-fade-in-fast">
                <input type="text" value={shareUrl} readOnly className="bg-transparent text-sm text-slate-300 w-full focus:outline-none px-2" />
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex-shrink-0"
                  title={copySuccess ? 'Đã sao chép!' : 'Sao chép link'}
                >
                  {copySuccess ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResults;