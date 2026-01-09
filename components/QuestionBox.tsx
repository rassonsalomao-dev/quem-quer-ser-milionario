
import React from 'react';
import { QuizQuestion } from '../types';

interface QuestionBoxProps {
  question: QuizQuestion;
  onAnswer: (key: string) => void;
  disabled: boolean;
  hiddenOptions: string[];
  lastResult: 'correct' | 'wrong' | null;
  selectedKey: string | null;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({ 
  question, 
  onAnswer, 
  disabled, 
  hiddenOptions,
  lastResult,
  selectedKey
}) => {
  const optionKeys = ['A', 'B', 'C', 'D'] as const;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Question Card */}
      <div className="relative w-full mb-10 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-900 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-slate-900 border-2 border-blue-700 p-8 text-center rounded-lg shadow-2xl">
          <p className="text-blue-400 text-xs uppercase tracking-widest mb-2 font-bold">{question.nivel}</p>
          <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
            {question.pergunta}
          </h2>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {optionKeys.map((key) => {
          const isHidden = hiddenOptions.includes(key);
          const isSelected = selectedKey === key;
          const isCorrect = lastResult && question.resposta_correta === key;
          const isWrong = lastResult === 'wrong' && isSelected;

          let btnClass = "relative overflow-hidden p-5 border-2 transition-all duration-300 text-left rounded-lg group ";
          
          if (isHidden) {
            btnClass += "invisible pointer-events-none opacity-0";
          } else if (isCorrect) {
            btnClass += "bg-green-600 border-green-400 text-white scale-105 z-10 shadow-[0_0_20px_rgba(34,197,94,0.6)]";
          } else if (isWrong) {
            btnClass += "bg-red-600 border-red-400 text-white";
          } else if (isSelected) {
            btnClass += "bg-yellow-500 border-yellow-300 text-slate-950 font-bold";
          } else {
            btnClass += "bg-slate-900 border-blue-700 text-blue-100 hover:border-yellow-500 hover:bg-blue-950/50";
          }

          if (disabled && !isSelected && !isCorrect) {
            btnClass += " opacity-50";
          }

          return (
            <button
              key={key}
              onClick={() => !disabled && onAnswer(key)}
              disabled={disabled || isHidden}
              className={btnClass}
            >
              <div className="flex items-center">
                <span className={`font-bold mr-4 text-yellow-500 ${isSelected ? 'text-slate-900' : ''}`}>
                  {key}:
                </span>
                <span className="text-lg">{question.opcoes[key as keyof typeof question.opcoes]}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionBox;
