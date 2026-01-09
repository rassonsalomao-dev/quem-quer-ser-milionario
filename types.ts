
export enum Difficulty {
  FACIL = 'Fácil',
  MEDIO = 'Médio',
  DIFICIL = 'Difícil'
}

export interface QuizQuestion {
  nivel: Difficulty;
  pergunta: string;
  opcoes: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  resposta_correta: 'A' | 'B' | 'C' | 'D';
  explicacao: string;
}

export interface GameState {
  currentQuestionIndex: number;
  score: number;
  isGameOver: boolean;
  hasWon: boolean;
  livesUsed: {
    fiftyFifty: boolean;
    askPublic: boolean;
    callFriend: boolean;
  };
  currentQuestion: QuizQuestion | null;
  loading: boolean;
  error: string | null;
  hiddenOptions: string[];
  lastResult: 'correct' | 'wrong' | null;
}

export interface PrizeLevel {
  level: number;
  amount: string;
  isSafety: boolean;
}

export interface UserStats {
  totalCorrectAnswers: number;
  bestScore: number;
  totalGamesPlayed: number;
  totalGamesWon: number;
}
