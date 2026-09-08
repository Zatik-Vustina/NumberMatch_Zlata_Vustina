import React from 'react';
import { X, Star, Lock, Sparkles, Play } from 'lucide-react';
import { Language, LevelConfig } from '../../types';
import { GAME_LEVELS } from '../../utils/gameLogic';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLevel: (level: LevelConfig) => void;
  onSelectClassic: () => void;
  completedLevels: Record<number, number>;
  lang: Language;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectLevel,
  onSelectClassic,
  completedLevels,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-level-select"
        className="w-full max-w-md bg-[#121214] border border-zinc-800/90 rounded-3xl p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[88vh] text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {lang === 'ru' ? 'Выбор уровня' : 'Level Selection'}
              </h3>
              <p className="text-[11px] text-zinc-400 font-semibold">
                {lang === 'ru' ? '10 уникальных уровней с заданиями' : '10 unique crafted levels with goals'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-levels"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Classic Mode Banner */}
        <div className="my-3 shrink-0">
          <button
            id="btn-select-classic-mode"
            onClick={() => {
              onSelectClassic();
              onClose();
            }}
            className="w-full p-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-700/60 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-md group-hover:scale-105 transition-transform">
                1-19
              </div>
              <div className="text-left">
                <div className="font-extrabold text-sm text-white">
                  {lang === 'ru' ? 'Классический режим' : 'Classic Mode'}
                </div>
                <div className="text-[11px] text-zinc-400 font-semibold">
                  {lang === 'ru' ? 'Бесконечная игра от 1 до 19' : 'Endless board from 1 to 19'}
                </div>
              </div>
            </div>
            <Play className="w-5 h-5 text-indigo-400 fill-indigo-400" />
          </button>
        </div>

        {/* Level Cards List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {GAME_LEVELS.map((level, idx) => {
            const stars = completedLevels[level.id] || 0;
            // Level 1 is always unlocked; others unlocked if prev level completed
            const isUnlocked = idx === 0 || (completedLevels[GAME_LEVELS[idx - 1].id] !== undefined);

            return (
              <button
                key={level.id}
                id={`level-card-${level.id}`}
                disabled={!isUnlocked}
                onClick={() => {
                  onSelectLevel(level);
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isUnlocked
                    ? 'bg-zinc-900/80 hover:bg-zinc-800/80 border-zinc-800 active:scale-[0.99] cursor-pointer'
                    : 'bg-zinc-950/40 border-zinc-900/40 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      stars > 0
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : isUnlocked
                        ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60'
                        : 'bg-zinc-900 text-zinc-600'
                    }`}
                  >
                    {isUnlocked ? level.id : <Lock className="w-4 h-4 text-zinc-600" />}
                  </div>

                  <div>
                    <div className="font-bold text-xs sm:text-sm text-zinc-100 flex items-center gap-1.5">
                      <span>{lang === 'ru' ? level.titleRu : level.titleEn}</span>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-zinc-400 font-semibold line-clamp-1">
                      {lang === 'ru' ? level.descriptionRu : level.descriptionEn}
                    </div>
                  </div>
                </div>

                {/* Star rating */}
                {isUnlocked && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[1, 2, 3].map(starNum => (
                      <Star
                        key={starNum}
                        className={`w-3.5 h-3.5 ${
                          starNum <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-700 fill-zinc-800'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
