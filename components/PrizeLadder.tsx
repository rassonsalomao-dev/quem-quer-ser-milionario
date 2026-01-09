
import React from 'react';
import { PRIZE_LADDER } from '../constants';

interface PrizeLadderProps {
  currentIndex: number;
}

const PrizeLadder: React.FC<PrizeLadderProps> = ({ currentIndex }) => {
  return (
    <div className="bg-slate-900/80 p-4 rounded-lg border border-blue-900 h-full overflow-y-auto hidden md:block">
      <h3 className="text-yellow-500 font-bold mb-4 text-center border-b border-blue-800 pb-2">PRÉMIOS (MT)</h3>
      <div className="flex flex-col-reverse gap-1">
        {PRIZE_LADDER.map((prize) => {
          const isActive = prize.level === currentIndex + 1;
          const isPassed = prize.level <= currentIndex;
          
          return (
            <div 
              key={prize.level}
              className={`flex justify-between items-center px-3 py-1 rounded text-sm transition-all duration-300 ${
                isActive 
                  ? 'bg-yellow-500 text-slate-900 font-bold scale-105 shadow-[0_0_15px_rgba(234,179,8,0.5)]' 
                  : isPassed
                    ? 'text-yellow-500/50'
                    : prize.isSafety
                      ? 'text-white font-semibold'
                      : 'text-blue-400'
              }`}
            >
              <span className="w-6">{prize.level}</span>
              <span>{prize.amount}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrizeLadder;
