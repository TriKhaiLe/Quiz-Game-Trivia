import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { QuizQuestion } from '../types';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';
import { quizService } from '../services/quizService';
import { ShareIcon } from '../icons/ShareIcon';
import { CopyIcon } from '../icons/CopyIcon';

interface QuizGameProps {
  questions: QuizQuestion[];
  onGameEnd: (answers: string[]) => void;
  topic: string;
  difficulty: number;
  startIndex?: number;

}

const QuizGame: React.FC<QuizGameProps> = ({ questions, onGameEnd, topic, difficulty, startIndex = 0 }) => {
  // Sắp xếp lại các câu hỏi để bắt đầu từ `startIndex` và sau đó quay vòng
  const { orderedQuestions, originalIndexMap } = useMemo(() => {
    if (!startIndex || startIndex === 0 || startIndex >= questions.length) {
      return {
        orderedQuestions: questions,
        originalIndexMap: questions.map((_, i) => i)
      };
    }
    
    const questionsAfter = questions.slice(startIndex);
    const questionsBefore = questions.slice(0, startIndex);
    
    const indicesAfter = Array.from({ length: questionsAfter.length }, (_, i) => startIndex + i);
    const indicesBefore = Array.from({ length: questionsBefore.length }, (_, i) => i);

    return {
      orderedQuestions: [...questionsAfter, ...questionsBefore],
      originalIndexMap: [...indicesAfter, ...indicesBefore]
    };
  }, [questions, startIndex]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Luôn bắt đầu từ 0 của danh sách đã sắp xếp
  const [userAnswers, setUserAnswers] = useState<string[]>([]); // Lưu câu trả lời theo thứ tự chơi
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const [shareState, setShareState] = useState<'idle' | 'sharing' | 'shared' | 'error'>('idle');
  const [shareUrl, setShareUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const currentQuestion = orderedQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === orderedQuestions.length - 1;

  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answer);
  };
  
  const handleNextQuestion = useCallback(() => {
    if (selectedAnswer === null) return;

    const newAnswersInPlayOrder = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswersInPlayOrder);

    if (isLastQuestion) {
      // Sắp xếp lại câu trả lời về đúng thứ tự ban đầu trước khi kết thúc
      const finalAnswers = new Array(questions.length).fill(null);
      newAnswersInPlayOrder.forEach((answer, playIndex) => {
          const originalIndex = originalIndexMap[playIndex];
          finalAnswers[originalIndex] = answer;
      });
      onGameEnd(finalAnswers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  }, [isLastQuestion, onGameEnd, userAnswers, selectedAnswer, questions.length, originalIndexMap]);
  
  const handleShareQuiz = useCallback(async () => {
    setShareState('sharing');
    try {
      // Lấy chỉ mục gốc của câu hỏi hiện tại để chia sẻ
      const originalCurrentIndex = originalIndexMap[currentQuestionIndex];
      const result = await quizService.shareQuiz({
        questions, // Luôn dùng mảng câu hỏi gốc
        topic,
        difficulty,
        currentQuestionIndex: originalCurrentIndex,
      });
      const url = quizService.getShareableLink(result.id);
      setShareUrl(url);
      setShareState('shared');
    } catch (error) {
      console.error("Failed to share quiz:", error);
      setShareState('error');
      setTimeout(() => setShareState('idle'), 3000);
    }
  }, [questions, topic, difficulty, currentQuestionIndex, originalIndexMap]);

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  useEffect(() => {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      const progress = ((currentQuestionIndex) / orderedQuestions.length) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }, [currentQuestionIndex, orderedQuestions.length]);


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
            {/* Hiển thị tiến trình dựa trên thứ tự chơi */}
            <p className="text-sm text-indigo-300 font-medium">Câu hỏi {currentQuestionIndex + 1} trên {orderedQuestions.length}</p>
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
        
      <div className="mt-8 flex justify-between items-center min-h-[56px]">
        {/* Share Button Area (Left) */}
        <div className="flex-1">
          {shareState === 'idle' && (
            <button
              onClick={handleShareQuiz}
              className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors"
              title="Chia sẻ bộ câu hỏi này"
            >
              <ShareIcon className="w-5 h-5" />
              <span className="text-sm font-semibold">Chia sẻ</span>
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
            <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-700 max-w-xs animate-fade-in-fast">
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

        {/* Next Button Area (Right) */}
        <div className="flex justify-end">
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
    </div>
  );
};

export default QuizGame;
