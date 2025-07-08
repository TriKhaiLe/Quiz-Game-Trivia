import { type QuizQuestion, Difficulty } from '../types';
import { API_BASE_URL } from './apiConfig';

// Gọi API backend để lấy câu hỏi
export const generateQuizQuestions = async (topic: string, difficulty: Difficulty): Promise<QuizQuestion[]> => {
  const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, difficulty }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Không thể tạo câu hỏi');
  }
  return response.json();
};
