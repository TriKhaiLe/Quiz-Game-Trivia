import { type QuizQuestion } from '../types';
import { API_BASE_URL } from './apiConfig';

// Gọi API backend để lấy câu hỏi
export const generateQuizQuestions = async (
  topic: string,
  difficulty: number,
  options?: { signal?: AbortSignal }
): Promise<QuizQuestion[]> => {
  const difficultyStr = `${difficulty}/10 (trong đó 1 là dễ nhất và 10 là khó nhất)`;
  const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, difficulty: difficultyStr }),
    signal: options?.signal
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Không thể tạo câu hỏi');
  }
  return response.json();
};
