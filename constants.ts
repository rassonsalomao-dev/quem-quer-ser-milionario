
import { PrizeLevel } from './types';

export const PRIZE_LADDER: PrizeLevel[] = [
  { level: 15, amount: '1.000.000 MT', isSafety: true },
  { level: 14, amount: '500.000 MT', isSafety: false },
  { level: 13, amount: '250.000 MT', isSafety: false },
  { level: 12, amount: '125.000 MT', isSafety: false },
  { level: 11, amount: '64.000 MT', isSafety: false },
  { level: 10, amount: '32.000 MT', isSafety: true },
  { level: 9, amount: '16.000 MT', isSafety: false },
  { level: 8, amount: '8.000 MT', isSafety: false },
  { level: 7, amount: '4.000 MT', isSafety: false },
  { level: 6, amount: '2.000 MT', isSafety: false },
  { level: 5, amount: '1.000 MT', isSafety: true },
  { level: 4, amount: '500 MT', isSafety: false },
  { level: 3, amount: '300 MT', isSafety: false },
  { level: 2, amount: '200 MT', isSafety: false },
  { level: 1, amount: '100 MT', isSafety: false },
];

export const GET_DIFFICULTY = (index: number) => {
  if (index < 5) return 'Fácil';
  if (index < 10) return 'Médio';
  return 'Difícil';
};
