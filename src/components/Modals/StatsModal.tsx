import React from 'react';
import { X, Trophy, Flame, Target, Sparkles, Award } from 'lucide-react';
import { Language, PlayerStats } from '../../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  lang: Language;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  lang,
}) => {
  if (!isOpen) return null;

  const totalStars = Object.values(stats.completedLevels).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-stats"
        className="w-full max-w-md bg-[#121214] border border-zinc-800/90 rounded-3xl p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh] text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg">
              {lang === 'ru' ? 'Статистика игрока' : 'Player Statistics'}
            </h3>
          </div>
          <button
            id="btn-close-stats"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800/70 flex flex-col items-center text-center">
              <Trophy className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-xl font-bold text-white">{stats.highScore.toLocaleString()}</span>
              <span className="text-[11px] text-zinc-400 font-semibold">{lang === 'ru' ? 'Рекорд очков' : 'High Score'}</span>
            </div>

            <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800/70 flex flex-col items-center text-center">
              <Award className="w-5 h-5 text-indigo-400 mb-1" />
              <span className="text-xl font-bold text-white">{stats.gamesWon} / {stats.gamesPlayed}</span>
              <span className="text-[11px] text-zinc-400 font-semibold">{lang === 'ru' ? 'Побед / Игр' : 'Wins / Played'}</span>
            </div>

            <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800/70 flex flex-col items-center text-center">
              <Target className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="text-xl font-bold text-white">{stats.totalPairsMatched.toLocaleString()}</span>
              <span className="text-[11px] text-zinc-400 font-semibold">{lang === 'ru' ? 'Собрано пар' : 'Pairs Matched'}</span>
            </div>

            <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800/70 flex flex-col items-center text-center">
              <Flame className="w-5 h-5 text-rose-400 mb-1" />
              <span className="text-xl font-bold text-white">x{stats.maxCombo}</span>
              <span className="text-[11px] text-zinc-400 font-semibold">{lang === 'ru' ? 'Лучшее комбо' : 'Best Combo'}</span>
            </div>
          </div>

          {/* Stars & Boosters */}
          <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-xs sm:text-sm font-bold text-zinc-200">
                {lang === 'ru' ? 'Всего звезд в уровнях' : 'Total Level Stars'}
              </span>
            </div>
            <div className="flex items-center gap-1 font-bold text-amber-400 text-base">
              <span>⭐</span>
              <span>{totalStars}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            id="btn-close-stats-bottom"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm transition-all border border-zinc-700/50"
          >
            {lang === 'ru' ? 'Закрыть' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
