import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { GameMode, Language, LevelConfig } from '../../types';

interface VictoryModalProps {
  isOpen: boolean;
  score: number;
  stars: number;
  pairsMatched: number;
  mode: GameMode;
  currentLevel?: LevelConfig;
  onNextLevel: () => void;
  onRestart: () => void;
  onOpenLevelSelect: () => void;
  lang: Language;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  score,
  stars,
  pairsMatched,
  mode,
  currentLevel,
  onNextLevel,
  onRestart,
  onOpenLevelSelect,
  lang,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        // Fire confetti celebratory burst
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#ec4899', '#eab308', '#10b981', '#3b82f6'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasNextLevel = mode === 'levels' && currentLevel && currentLevel.id < 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div
        id="modal-victory"
        className="w-full max-w-sm bg-[#121214] border border-zinc-800/90 rounded-3xl p-6 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col items-center text-center text-zinc-100 relative overflow-hidden"
      >
        {/* Subtle ambient background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Trophy & Stars */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-3xl bg-zinc-800 border border-amber-500/40 flex items-center justify-center shadow-lg">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-300 animate-spin" />
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          {lang === 'ru' ? 'Победа! Отличная игра!' : 'Victory! Great Job!'}
        </h3>
        <p className="text-xs text-zinc-400 font-medium mb-4">
          {mode === 'levels' && currentLevel
            ? (lang === 'ru' ? `Уровень ${currentLevel.id} успешно пройден!` : `Level ${currentLevel.id} completed!`)
            : mode === 'daily'
            ? (lang === 'ru' ? 'Ежедневная головоломка решена!' : 'Daily challenge solved!')
            : (lang === 'ru' ? 'Поле полностью очищено!' : 'Board cleared completely!')}
        </p>

        {/* Stars Display (for Levels mode) */}
        {mode === 'levels' && (
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map(starNum => (
              <div
                key={starNum}
                className={`p-2 rounded-2xl transition-all duration-300 ${
                  starNum <= stars
                    ? 'bg-amber-500/15 border border-amber-500/50 scale-110'
                    : 'bg-zinc-900 border border-zinc-800 opacity-35'
                }`}
              >
                <Star
                  className={`w-6 h-6 ${
                    starNum <= stars
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-zinc-600 fill-zinc-800'
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Score & Stats Pill */}
        <div className="w-full bg-zinc-900/80 rounded-2xl p-3.5 border border-zinc-800 mb-5 grid grid-cols-2 gap-2 text-center">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              {lang === 'ru' ? 'Набрано очков' : 'Score'}
            </div>
            <div className="text-xl font-bold text-indigo-400">
              {score.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              {lang === 'ru' ? 'Собрано пар' : 'Pairs Matched'}
            </div>
            <div className="text-xl font-bold text-zinc-200">
              {pairsMatched}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2">
          {hasNextLevel && (
            <button
              id="btn-victory-next-level"
              onClick={onNextLevel}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
            >
              <span>{lang === 'ru' ? 'Следующий уровень' : 'Next Level'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="flex gap-2 w-full">
            <button
              id="btn-victory-restart"
              onClick={onRestart}
              className="flex-1 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-zinc-700/50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Снова' : 'Replay'}</span>
            </button>

            {mode === 'levels' && (
              <button
                id="btn-victory-levels"
                onClick={onOpenLevelSelect}
                className="flex-1 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-all border border-zinc-700/50"
              >
                {lang === 'ru' ? 'К уровням' : 'All Levels'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
