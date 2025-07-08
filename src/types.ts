
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export type GameState = 'setup' | 'loading' | 'playing' | 'results';
