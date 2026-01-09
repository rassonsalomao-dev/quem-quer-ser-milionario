
import React from 'react';
import { UserStats } from '../types';

interface GameOverProps {
  score: number;
  hasWon: boolean;
  onRestart: () => void;
  explanation?: string;
  stats: UserStats;
}

const GameOver: React.FC<GameOverProps> = ({ score, hasWon, onRestart, explanation, stats }) => {
  const getWinnings = () => {
    if (hasWon) return "1.000.000 MT";
    if (score >= 10) return "32.000 MT";
    if (score >= 5) return "1.000 MT";
    return "0 MT";
  };

  const winPercentage = stats.totalGamesPlayed > 0 
    ? Math.round((stats.totalGamesWon / stats.totalGamesPlayed) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 bg-slate-950/95 flex items-center justify-center z-50 p-4 md:p-6 animate-in fade-in duration-500 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-yellow-500 p-6 md:p-10 rounded-2xl max-w-xl w-full text-center shadow-[0_0_50px_rgba(234,179,8,0.3)] my-auto">
        {hasWon ? (
          <div className="mb-6">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <i className="fa-solid fa-trophy text-slate-950 text-4xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2 uppercase">Milionário!</h1>
            <p className="text-lg text-blue-300">Você é um mestre da cultura moçambicana!</p>
          </div>
        ) : (
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-xmark text-white text-4xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 uppercase">Fim de Jogo</h1>
            {explanation && (
              <div className="mt-2 p-4 bg-slate-800 rounded-lg text-blue-200 text-sm italic mb-2 border-l-4 border-yellow-500 text-left">
                <span className="block font-bold text-yellow-500 uppercase text-[10px] mb-1">Explicação:</span>
                "{explanation}"
              </div>
            )}
          </div>
        )}

        <div className="bg-slate-800 p-4 md:p-6 rounded-xl mb-6 border border-blue-900/50">
          <p className="text-blue-400 uppercase tracking-widest text-xs mb-1">Prémio Final</p>
          <p className="text-4xl md:text-5xl font-black text-yellow-500">{getWinnings()}</p>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <div className="bg-slate-950/50 p-3 rounded-lg border border-blue-900/30">
            <p className="text-blue-400 text-[10px] uppercase font-bold mb-1">Respostas Correctas</p>
            <p className="text-xl font-bold text-white">{stats.totalCorrectAnswers}</p>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-lg border border-blue-900/30">
            <p className="text-blue-400 text-[10px] uppercase font-bold mb-1">Recorde Pontuação</p>
            <p className="text-xl font-bold text-white">{stats.bestScore}/15</p>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-lg border border-blue-900/30">
            <p className="text-blue-400 text-[10px] uppercase font-bold mb-1">Taxa de Vitória</p>
            <p className="text-xl font-bold text-white">{winPercentage}%</p>
          </div>
        </div>

        <button 
          onClick={onRestart}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-4 px-8 rounded-lg text-lg md:text-xl transition-all hover:scale-105 active:scale-95 shadow-lg uppercase tracking-wider"
        >
          Jogar Novamente
        </button>
      </div>
    </div>
  );
};

export default GameOver;
