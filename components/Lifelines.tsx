
import React from 'react';

interface LifelinesProps {
  used: {
    fiftyFifty: boolean;
    askPublic: boolean;
    callFriend: boolean;
  };
  onUse: (type: 'fiftyFifty' | 'askPublic' | 'callFriend') => void;
  disabled: boolean;
}

const Lifelines: React.FC<LifelinesProps> = ({ used, onUse, disabled }) => {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <button 
        onClick={() => onUse('fiftyFifty')}
        disabled={disabled || used.fiftyFifty}
        className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl transition-all ${
          used.fiftyFifty 
            ? 'border-red-900 text-red-900 cursor-not-allowed' 
            : 'border-blue-500 text-blue-400 hover:bg-blue-900/40 hover:text-white hover:border-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'
        }`}
        title="50:50"
      >
        <span className="font-bold">50:50</span>
      </button>

      <button 
        onClick={() => onUse('askPublic')}
        disabled={disabled || used.askPublic}
        className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl transition-all ${
          used.askPublic 
            ? 'border-red-900 text-red-900 cursor-not-allowed' 
            : 'border-blue-500 text-blue-400 hover:bg-blue-900/40 hover:text-white hover:border-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'
        }`}
        title="Perguntar ao Público"
      >
        <i className="fa-solid fa-users"></i>
      </button>

      <button 
        onClick={() => onUse('callFriend')}
        disabled={disabled || used.callFriend}
        className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl transition-all ${
          used.callFriend 
            ? 'border-red-900 text-red-900 cursor-not-allowed' 
            : 'border-blue-500 text-blue-400 hover:bg-blue-900/40 hover:text-white hover:border-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'
        }`}
        title="Telefonar a um Amigo"
      >
        <i className="fa-solid fa-phone"></i>
      </button>
    </div>
  );
};

export default Lifelines;
