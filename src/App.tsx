import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  ChevronRight, 
  Eye, 
  EyeOff,
  Brain,
  History,
  Zap
} from 'lucide-react';
import { 
  ANGLES, 
  FUNCTIONS, 
  TRIG_TABLE, 
  ALL_QUESTIONS, 
  UNIQUE_VALUES,
  TrigRatio 
} from './constants';

type GameState = 'START' | 'QUIZ' | 'RESULTS' | 'TABLE';

interface Attempt {
  question: TrigRatio;
  userAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [questions, setQuestions] = useState<TrigRatio[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [showTable, setShowTable] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; answer: string } | null>(null);

  const startQuiz = () => {
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setAttempts([]);
    setGameState('QUIZ');
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setFeedback(null);
  };

  const handleAnswer = (answer: string) => {
    if (feedback) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = answer === currentQuestion.value;
    const now = Date.now();
    const timeTaken = now - questionStartTime;

    const newAttempt: Attempt = {
      question: currentQuestion,
      userAnswer: answer,
      isCorrect,
      timeTaken
    };

    setAttempts(prev => [...prev, newAttempt]);
    setFeedback({ isCorrect, answer: currentQuestion.value });

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setQuestionStartTime(Date.now());
      } else {
        setGameState('RESULTS');
      }
    }, 1000);
  };

  const totalTime = useMemo(() => {
    if (attempts.length === 0) return 0;
    return attempts.reduce((acc, curr) => acc + curr.timeTaken, 0);
  }, [attempts]);

  const correctCount = attempts.filter(a => a.isCorrect).length;
  const accuracy = attempts.length > 0 ? (correctCount / attempts.length) * 100 : 0;
  const avgTime = attempts.length > 0 ? totalTime / attempts.length / 1000 : 0;

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans selection:bg-[#5A5A40] selection:text-white">
      <header className="border-b border-[#141414]/10 p-6 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-[#5A5A40] p-2 rounded-lg">
            <Brain className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight italic serif">TrigMaster</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowTable(!showTable)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#141414]/20 hover:bg-[#141414]/5 transition-colors text-sm font-medium"
          >
            {showTable ? <EyeOff size={16} /> : <Eye size={16} />}
            {showTable ? 'Hide Table' : 'View Table'}
          </button>
          {gameState !== 'START' && (
            <button 
              onClick={() => setGameState('START')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414] text-white hover:opacity-90 transition-opacity text-sm font-medium"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 pt-12">
        <AnimatePresence mode="wait">
          {showTable && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-12 bg-white rounded-3xl p-8 shadow-xl shadow-[#141414]/5 border border-[#141414]/5 overflow-x-auto"
            >
              <h2 className="text-2xl font-bold mb-6 italic serif">Trigonometry Table</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 border-b border-[#141414]/10 text-left opacity-50 text-xs uppercase tracking-widest">Function</th>
                    {ANGLES.map(angle => (
                      <th key={angle} className="p-4 border-b border-[#141414]/10 text-center font-mono text-lg">{angle}°</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FUNCTIONS.map(func => (
                    <tr key={func} className="hover:bg-[#F5F5F0]/50 transition-colors">
                      <td className="p-4 border-b border-[#141414]/5 font-bold italic serif text-lg">{func} θ</td>
                      {ANGLES.map(angle => (
                        <td key={angle} className="p-4 border-b border-[#141414]/5 text-center font-mono text-md">
                          {TRIG_TABLE[func][angle]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {gameState === 'START' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center py-20"
            >
              <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#5A5A40]/10 text-[#5A5A40]">
                <Zap size={48} />
              </div>
              <h2 className="text-5xl font-bold mb-4 italic serif tracking-tight">Ready to test your memory?</h2>
              <p className="text-[#141414]/60 mb-12 max-w-md mx-auto text-lg">
                We'll ask you all 30 trigonometric ratios from 0° to 90°. 
                Speed and accuracy both count.
              </p>
              <button 
                onClick={startQuiz}
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#141414] text-white rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-2xl shadow-[#141414]/20"
              >
                Start Training
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {gameState === 'QUIZ' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Question</span>
                  <div className="text-4xl font-bold italic serif">
                    {currentIndex + 1} <span className="text-lg opacity-30 font-sans not-italic">/ {questions.length}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Accuracy</span>
                  <div className="text-2xl font-mono font-bold">
                    {Math.round(accuracy)}%
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-12 shadow-2xl shadow-[#141414]/5 border border-[#141414]/5 text-center relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="relative z-10"
                  >
                    <h3 className="text-7xl font-bold italic serif mb-4">
                      {questions[currentIndex].func}({questions[currentIndex].angle}°)
                    </h3>
                    <p className="text-[#141414]/40 text-lg">What is the value?</p>
                  </motion.div>
                </AnimatePresence>

                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute inset-0 flex items-center justify-center z-20 backdrop-blur-sm ${feedback.isCorrect ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      {feedback.isCorrect ? (
                        <CheckCircle2 size={120} className="text-emerald-500" />
                      ) : (
                        <XCircle size={120} className="text-rose-500" />
                      )}
                      <div className={`text-3xl font-bold ${feedback.isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {feedback.isCorrect ? 'Correct!' : `Wrong! It's ${feedback.answer}`}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {UNIQUE_VALUES.map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(val)}
                    disabled={!!feedback}
                    className="p-6 bg-white rounded-2xl border border-[#141414]/5 hover:border-[#141414]/20 hover:bg-[#F5F5F0] transition-all font-mono text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'RESULTS' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 pb-20"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 mb-6">
                  <Trophy size={40} />
                </div>
                <h2 className="text-5xl font-bold italic serif mb-4">Test Complete!</h2>
                <p className="text-[#141414]/60 text-xl">Here's how you performed today.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-[#141414]/5 shadow-lg shadow-[#141414]/5">
                  <div className="flex items-center gap-3 mb-4 opacity-50 uppercase tracking-widest text-xs font-bold">
                    <CheckCircle2 size={16} />
                    Accuracy
                  </div>
                  <div className="text-5xl font-bold italic serif">{Math.round(accuracy)}%</div>
                  <div className="mt-2 text-sm text-[#141414]/40">{correctCount} out of {questions.length} correct</div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-[#141414]/5 shadow-lg shadow-[#141414]/5">
                  <div className="flex items-center gap-3 mb-4 opacity-50 uppercase tracking-widest text-xs font-bold">
                    <Timer size={16} />
                    Total Time
                  </div>
                  <div className="text-5xl font-bold italic serif">{(totalTime / 1000).toFixed(1)}s</div>
                  <div className="mt-2 text-sm text-[#141414]/40">Across all 30 questions</div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-[#141414]/5 shadow-lg shadow-[#141414]/5">
                  <div className="flex items-center gap-3 mb-4 opacity-50 uppercase tracking-widest text-xs font-bold">
                    <Zap size={16} />
                    Avg. Speed
                  </div>
                  <div className="text-5xl font-bold italic serif">{avgTime.toFixed(2)}s</div>
                  <div className="mt-2 text-sm text-[#141414]/40">Per question response</div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-[#141414]/5 shadow-lg shadow-[#141414]/5 overflow-hidden">
                <div className="p-8 border-b border-[#141414]/5 flex justify-between items-center">
                  <h3 className="text-2xl font-bold italic serif flex items-center gap-3">
                    <History className="opacity-50" />
                    Error Analysis
                  </h3>
                  <span className="px-4 py-1 bg-rose-500/10 text-rose-600 rounded-full text-xs font-bold uppercase tracking-widest">
                    {attempts.filter(a => !a.isCorrect).length} Errors
                  </span>
                </div>
                <div className="divide-y divide-[#141414]/5">
                  {attempts.filter(a => !a.isCorrect).length === 0 ? (
                    <div className="p-12 text-center text-[#141414]/40 italic">
                      Perfect score! No errors to analyze.
                    </div>
                  ) : (
                    attempts.filter(a => !a.isCorrect).map((attempt, i) => (
                      <div key={i} className="p-6 flex items-center justify-between hover:bg-[#F5F5F0]/50 transition-colors">
                        <div className="flex items-center gap-6">
                          <div className="text-2xl font-bold italic serif w-32">
                            {attempt.question.func}({attempt.question.angle}°)
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Your Answer</span>
                            <span className="text-rose-500 font-mono font-bold line-through">{attempt.userAnswer}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Correct</span>
                            <span className="text-emerald-600 font-mono font-bold">{attempt.question.value}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-widest font-bold opacity-30 block">Time</span>
                          <span className="font-mono opacity-50">{(attempt.timeTaken / 1000).toFixed(2)}s</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button 
                  onClick={startQuiz}
                  className="flex items-center gap-3 px-10 py-5 bg-[#141414] text-white rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-2xl shadow-[#141414]/20"
                >
                  <RotateCcw />
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-4xl mx-auto p-12 text-center text-[#141414]/30 text-sm">
        <p>© {new Date().getFullYear()} TrigMaster. Master the ratios, master the math.</p>
      </footer>
    </div>
  );
}
