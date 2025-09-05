import type { QuizQuestion } from '../types';

interface ShareQuizPayload {
    questions: QuizQuestion[];
    topic: string;
    difficulty: number;
    currentQuestionIndex: number;
}

interface ShareQuizResponse {
    id: string;
}

interface GetQuizResponse {
    questions: QuizQuestion[];
    topic: string;
    difficulty: number;
    startIndex: number;
}

interface ShareResultsPayload {
    questions: QuizQuestion[];
    userAnswers: string[];
    topic: string;
    difficulty: number;
}

interface GetResultsResponse {
    questions: QuizQuestion[];
    userAnswers: string[];
    topic: string;
    difficulty: number;
}

import { API_BASE_URL } from './apiConfig';

const handleResponse = async (response: Response) => {
    if (response.ok) {
        if (response.status === 204) return null;
        return response.json();
    }
    const errorBody = await response.json().catch(() => ({ message: 'An unknown API error occurred' }));
    const errorMessage = errorBody.message || errorBody.error || `API request failed with status ${response.status}`;
    throw new Error(errorMessage);
};

const realQuizService = {
    async shareQuiz(payload: ShareQuizPayload): Promise<ShareQuizResponse> {
        const response = await fetch(`${API_BASE_URL}/api/quizzes/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return handleResponse(response);
    },

    async getQuiz(id: string): Promise<GetQuizResponse> {
        const response = await fetch(`${API_BASE_URL}/api/quizzes/${id}`);
        return handleResponse(response);
    },

    getShareableLink(id: string, type: 'quiz' | 'result'): string {
      const path = type === 'quiz' ? 'share' : 'share-result';
      return `${API_BASE_URL}/${path}/${id}`;
    },

    async shareResults(payload: ShareResultsPayload): Promise<ShareQuizResponse> {
        const response = await fetch(`${API_BASE_URL}/api/results/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return handleResponse(response);
    },

    async getResults(id: string): Promise<GetResultsResponse> {
        const response = await fetch(`${API_BASE_URL}/api/results/${id}`);
        return handleResponse(response);
    },
    
};

export const quizService = realQuizService;
