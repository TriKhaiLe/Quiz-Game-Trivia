
export const Difficulty = {
  Easy: 'dễ',
  Medium: 'trung bình',
  Hard: 'khó',
} as const;

export type Difficulty = typeof Difficulty[keyof typeof Difficulty];

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export type GameState = 'setup' | 'loading' | 'playing' | 'results';
