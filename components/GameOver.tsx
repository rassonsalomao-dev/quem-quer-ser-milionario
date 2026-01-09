
import React from 'react';
import { PRIZE_LADDER } from '../constants';

interface GameOverProps {
  score: number;
  hasWon: boolean;
  onRestart: () => void;
  explanation?: string;
}

const GameOver: React.FC<GameOverProps> = ({ score, hasWon, onRestart, explanation }) => {
  const getWinnings = () => {
    if (hasWon) return "1.000.000 MT";
    if (score >= 10) return "32.000 MT";
    if (score >= 5) return "1.000 MT";
    return "0 MT";
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 flex items-center justify-center z-50 p-6 animate-in fade-in duration-500">
      <div className="bg-slate-900 border-2 border-yellow-500 p-10 rounded-2xl max-w-xl w-full text-center shadow-[0_0_50px_rgba(234,179,8,0.3)]">
        {hasWon ? (
          <div className="mb-6">
            <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <i className="fa-solid fa-trophy text-slate-950 text-5xl"></i>
            </div>
            <h1 className="text-4xl font-bold text-yellow-500 mb-2">MILIONÁRIO!</h1>
            <p className="text-xl text-blue-300">Você provou ser um mestre da cultura moçambicana!</p>
          </div>
        ) : (
          <div className="mb-6">
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-xmark text-white text-5xl"></i>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">FIM DE JOGO</h1>
            {explanation && (
              <div className="mt-4 p-4 bg-slate-800 rounded-lg text-blue-200 italic mb-4">
                "{explanation}"
              </div>
            )}
            <p className="text-xl text-blue-300">Bom esforço! Moçambique orgulha-se de ti.</p>
          </div>
        )}

        <div className="bg-slate-800 p-6 rounded-xl mb-8">
          <p className="text-blue-400 uppercase tracking-widest text-sm mb-1">Prémio Final</p>
          <p className="text-5xl font-black text-yellow-500">{getWinnings()}</p>
        </div>

        <button 
          onClick={onRestart}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-4 px-8 rounded-lg text-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          JOGAR NOVAMENTE
        </button>
      </div>
    </div>
  );
};

export default GameOver;
