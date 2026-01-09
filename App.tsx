
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Difficulty, QuizQuestion, UserStats } from './types';
import { GET_DIFFICULTY, PRIZE_LADDER } from './constants';
import { fetchQuizQuestion, getLifelineHelp } from './services/geminiService';
import PrizeLadder from './components/PrizeLadder';
import Lifelines from './components/Lifelines';
import QuestionBox from './components/QuestionBox';
import GameOver from './components/GameOver';

const STORAGE_KEY = 'mz_millionaire_stats';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    isGameOver: false,
    hasWon: false,
    livesUsed: {
      fiftyFifty: false,
      askPublic: false,
      callFriend: false,
    },
    currentQuestion: null,
    loading: true,
    error: null,
    hiddenOptions: [],
    lastResult: null,
  });

  const [stats, setStats] = useState<UserStats>({
    totalCorrectAnswers: 0,
    bestScore: 0,
    totalGamesPlayed: 0,
    totalGamesWon: 0
  });

  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [lifelineFeedback, setLifelineFeedback] = useState<string | null>(null);

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem(STORAGE_KEY);
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Erro ao carregar estatísticas", e);
      }
    }
  }, []);

  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
  };

  const loadQuestion = useCallback(async (index: number) => {
    setGameState(prev => ({ ...prev, loading: true, error: null, hiddenOptions: [], lastResult: null }));
    setSelectedKey(null);
    setLifelineFeedback(null);

    const difficulty = GET_DIFFICULTY(index);
    try {
      const question = await fetchQuizQuestion(difficulty, askedQuestions);
      setGameState(prev => ({ ...prev, currentQuestion: question, loading: false }));
      setAskedQuestions(prev => [...prev, question.pergunta]);
    } catch (err: any) {
      setGameState(prev => ({ ...prev, error: "Erro ao carregar pergunta. Verifique sua conexão.", loading: false }));
    }
  }, [askedQuestions]);

  useEffect(() => {
    loadQuestion(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFinalStats = (finalState: Partial<GameState>) => {
    const isWin = finalState.hasWon || false;
    const finalScore = finalState.score || 0;
    
    const newStats: UserStats = {
      totalGamesPlayed: stats.totalGamesPlayed + 1,
      totalGamesWon: stats.totalGamesWon + (isWin ? 1 : 0),
      totalCorrectAnswers: stats.totalCorrectAnswers + finalScore,
      bestScore: Math.max(stats.bestScore, finalScore)
    };
    
    saveStats(newStats);
  };

  const handleAnswer = (key: string) => {
    if (!gameState.currentQuestion || gameState.lastResult) return;
    
    setSelectedKey(key);
    
    // Simulate thinking/tension
    setTimeout(() => {
      const isCorrect = key === gameState.currentQuestion?.resposta_correta;
      
      if (isCorrect) {
        setGameState(prev => ({ ...prev, lastResult: 'correct' }));
        
        setTimeout(() => {
          if (gameState.currentQuestionIndex === 14) {
            const finalState = { ...gameState, isGameOver: true, hasWon: true, score: 15 };
            setGameState(finalState);
            updateFinalStats(finalState);
          } else {
            const nextIndex = gameState.currentQuestionIndex + 1;
            setGameState(prev => ({ 
              ...prev, 
              currentQuestionIndex: nextIndex,
              score: nextIndex 
            }));
            loadQuestion(nextIndex);
          }
        }, 2000);
      } else {
        const finalState = { ...gameState, lastResult: 'wrong', isGameOver: true };
        setGameState(finalState);
        updateFinalStats(finalState);
      }
    }, 1500);
  };

  const handleUseLifeline = async (type: 'fiftyFifty' | 'askPublic' | 'callFriend') => {
    if (!gameState.currentQuestion) return;

    if (type === 'fiftyFifty') {
      const correct = gameState.currentQuestion.resposta_correta;
      const options = ['A', 'B', 'C', 'D'].filter(o => o !== correct);
      // Pick 2 random wrong options to hide
      const shuffled = options.sort(() => 0.5 - Math.random());
      const toHide = shuffled.slice(0, 2);
      setGameState(prev => ({
        ...prev,
        hiddenOptions: toHide,
        livesUsed: { ...prev.livesUsed, fiftyFifty: true }
      }));
    } else {
      setGameState(prev => ({ ...prev, loading: true }));
      const feedback = await getLifelineHelp(type === 'askPublic' ? 'public' : 'friend', gameState.currentQuestion);
      setLifelineFeedback(feedback);
      setGameState(prev => ({
        ...prev,
        loading: false,
        livesUsed: { ...prev.livesUsed, [type === 'askPublic' ? 'askPublic' : 'callFriend']: true }
      }));
    }
  };

  const restartGame = () => {
    setGameState({
      currentQuestionIndex: 0,
      score: 0,
      isGameOver: false,
      hasWon: false,
      livesUsed: {
        fiftyFifty: false,
        askPublic: false,
        callFriend: false,
      },
      currentQuestion: null,
      loading: true,
      error: null,
      hiddenOptions: [],
      lastResult: null,
    });
    setAskedQuestions([]);
    loadQuestion(0);
  };

  const currentPrize = PRIZE_LADDER.find(p => p.level === gameState.currentQuestionIndex + 1)?.amount || "0 MT";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-900/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-8 border-b border-blue-900/50 pb-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.4)]">
            <i className="fa-solid fa-star text-slate-900 text-lg md:text-xl"></i>
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-black text-white leading-tight">QUEM QUER SER MILIONÁRIO</h1>
            <p className="text-yellow-500 text-[10px] md:text-xs font-bold tracking-[0.2em]">EDIÇÃO MOÇAMBIQUE</p>
          </div>
        </div>

        <div className="bg-slate-900/80 px-3 md:px-4 py-1 md:py-2 rounded-full border border-blue-500/30 flex items-center gap-2">
          <span className="text-blue-400 text-[10px] md:text-xs font-bold hidden sm:inline">PRÉMIO ATUAL:</span>
          <span className="text-yellow-500 font-black text-sm md:text-base">{currentPrize}</span>
        </div>
      </header>

      <main className="w-full max-w-6xl flex flex-col md:flex-row gap-8 flex-grow z-10">
        <div className="flex-grow flex flex-col">
          {/* Lifelines section */}
          <Lifelines 
            used={gameState.livesUsed} 
            onUse={handleUseLifeline} 
            disabled={gameState.loading || !!gameState.lastResult} 
          />

          {/* Feedback/Help display */}
          {lifelineFeedback && !gameState.loading && (
            <div className="mb-6 bg-blue-900/30 border border-blue-500/50 p-4 rounded-xl text-blue-100 flex gap-4 animate-in slide-in-from-top duration-300">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-lightbulb"></i>
              </div>
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase mb-1">Dica de Especialista</p>
                <p className="text-sm italic">{lifelineFeedback}</p>
                <button 
                  onClick={() => setLifelineFeedback(null)}
                  className="mt-2 text-xs text-blue-400 hover:text-white transition-colors"
                >
                  Fechar [x]
                </button>
              </div>
            </div>
          )}

          {gameState.loading ? (
            <div className="flex-grow flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-400 animate-pulse font-bold tracking-widest uppercase text-sm">Preparando pergunta...</p>
            </div>
          ) : gameState.error ? (
            <div className="flex-grow flex flex-col items-center justify-center">
              <p className="text-red-500 mb-4">{gameState.error}</p>
              <button onClick={() => loadQuestion(gameState.currentQuestionIndex)} className="bg-blue-600 px-6 py-2 rounded">Tentar Novamente</button>
            </div>
          ) : gameState.currentQuestion ? (
            <QuestionBox 
              question={gameState.currentQuestion} 
              onAnswer={handleAnswer}
              disabled={gameState.loading || !!gameState.lastResult}
              hiddenOptions={gameState.hiddenOptions}
              lastResult={gameState.lastResult}
              selectedKey={selectedKey}
            />
          ) : null}
        </div>

        {/* Desktop Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <PrizeLadder currentIndex={gameState.currentQuestionIndex} />
        </div>
      </main>

      {/* Game Over Modal */}
      {gameState.isGameOver && (
        <GameOver 
          score={gameState.score} 
          hasWon={gameState.hasWon} 
          onRestart={restartGame}
          explanation={gameState.lastResult === 'wrong' ? gameState.currentQuestion?.explicacao : undefined}
          stats={stats}
        />
      )}

      {/* Mobile Footer ladder hint */}
      <div className="mt-8 md:hidden text-center">
        <p className="text-blue-500 text-[10px] font-bold">PERGUNTA {gameState.currentQuestionIndex + 1} DE 15</p>
        <div className="flex gap-1 justify-center mt-2">
           {[...Array(15)].map((_, i) => (
             <div key={i} className={`h-1 w-4 rounded-full ${i <= gameState.currentQuestionIndex ? 'bg-yellow-500' : 'bg-slate-800'}`}></div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default App;
