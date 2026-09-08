import React from 'react';
import {
  PlusCircle,
  Lightbulb,
  Undo2,
  Shuffle,
  Eraser,
  Bomb,
  Sparkles,
} from 'lucide-react';
import { Language, PlayerStats } from '../types';
import { ThemeConfig } from '../utils/theme';

interface ActionControlsProps {
  activeCount: number;
  availablePairsCount: number;
  onAddNumbers: () => void;
  onHint: () => void;
  onUndo: () => void;
  onShuffle: () => void;
  onSelectBooster: (type: 'eraser' | 'bomb') => void;
  activeBooster: 'eraser' | 'bomb' | null;
  canUndo: boolean;
  maxAdds?: number;
  currentAddsUsed: number;
  stats: PlayerStats;
  lang: Language;
  theme: ThemeConfig;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  activeCount,
  availablePairsCount,
  onAddNumbers,
  onHint,
  onUndo,
  onShuffle,
  onSelectBooster,
  activeBooster,
  canUndo,
  maxAdds,
  currentAddsUsed,
  stats,
  lang,
  theme,
}) => {
  const isAddDisabled = maxAdds !== undefined && currentAddsUsed >= maxAdds;

  return (
    <div className={`w-full px-4 py-3 ${theme.headerBg} flex flex-col gap-2.5 shrink-0 select-none border-t ${theme.gridBorder}`}>
      {/* Primary Big "Add Rows" Button */}
      <button
        id="btn-add-numbers"
        onClick={onAddNumbers}
        disabled={isAddDisabled || activeCount === 0}
        className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between transition-all duration-200 shadow-md ${
          isAddDisabled || activeCount === 0
            ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed opacity-50'
            : availablePairsCount === 0
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-400 ring-2 ring-indigo-400/50 animate-pulse'
            : 'bg-indigo-600/20 hover:bg-indigo-600/30 active:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 active:scale-[0.99]'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center border-2 border-indigo-400/60 rounded-md text-[14px] font-bold">
            +
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="uppercase tracking-wider text-[11px] font-bold">
              {lang === 'ru' ? 'Добавить числа' : 'Add Numbers'}
            </span>
            {availablePairsCount === 0 && activeCount > 0 && (
              <span className="text-[10px] font-semibold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {lang === 'ru' ? 'Нет ходов — добавьте числа!' : 'No moves left — add numbers!'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {maxAdds !== undefined && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-black/40 text-zinc-300 border border-zinc-700/40">
              {maxAdds - currentAddsUsed}/{maxAdds}
            </span>
          )}
          <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
            +{activeCount}
          </span>
        </div>
      </button>

      {/* Boosters & Tools Grid */}
      <div className="grid grid-cols-5 gap-2 pt-0.5">
        {/* Hint Booster */}
        <button
          id="btn-booster-hint"
          onClick={onHint}
          disabled={availablePairsCount === 0}
          className="flex flex-col items-center justify-center py-2 px-1 bg-zinc-800/80 rounded-2xl border border-zinc-700/50 active:bg-zinc-700 hover:bg-zinc-700/60 transition-all text-amber-400 relative disabled:opacity-35"
          title={lang === 'ru' ? 'Подсказка' : 'Hint'}
        >
          <div className="w-6 h-6 mb-1 flex items-center justify-center border-2 border-amber-400/60 rounded-full text-[10px]">
            ★
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            {lang === 'ru' ? 'Подсказка' : 'Hint'}
          </span>
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-zinc-900 border border-amber-500/60 text-amber-300 font-bold text-[9px]">
            {stats.boosters.hints}
          </span>
        </button>

        {/* Undo Button */}
        <button
          id="btn-tool-undo"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex flex-col items-center justify-center py-2 px-1 bg-zinc-800/80 rounded-2xl border border-zinc-700/50 active:bg-zinc-700 hover:bg-zinc-700/60 transition-all text-zinc-300 relative disabled:opacity-30"
          title={lang === 'ru' ? 'Отменить ход' : 'Undo'}
        >
          <div className="w-6 h-6 mb-1 flex items-center justify-center border-2 border-zinc-400 rounded-full text-[10px]">
            ↺
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            {lang === 'ru' ? 'Отмена' : 'Undo'}
          </span>
        </button>

        {/* Shuffle Booster */}
        <button
          id="btn-booster-shuffle"
          onClick={onShuffle}
          disabled={activeCount <= 1}
          className="flex flex-col items-center justify-center py-2 px-1 bg-zinc-800/80 rounded-2xl border border-zinc-700/50 active:bg-zinc-700 hover:bg-zinc-700/60 transition-all text-purple-400 relative disabled:opacity-35"
          title={lang === 'ru' ? 'Перемешать оставшиеся числа' : 'Shuffle active numbers'}
        >
          <div className="w-6 h-6 mb-1 flex items-center justify-center border-2 border-purple-400/60 rounded-full text-[10px]">
            <Shuffle className="w-3 h-3" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            {lang === 'ru' ? 'Микс' : 'Shuffle'}
          </span>
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-zinc-900 border border-purple-500/60 text-purple-300 font-bold text-[9px]">
            {stats.boosters.shuffles}
          </span>
        </button>

        {/* Eraser Booster */}
        <button
          id="btn-booster-eraser"
          onClick={() => onSelectBooster('eraser')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all relative ${
            activeBooster === 'eraser'
              ? 'bg-rose-900/60 text-rose-200 border border-rose-500 ring-2 ring-rose-500/50 shadow-md'
              : 'bg-zinc-800/80 hover:bg-zinc-700/60 text-rose-400 border border-zinc-700/50 active:bg-zinc-700'
          }`}
          title={lang === 'ru' ? 'Ластик: стереть одну цифру' : 'Eraser: remove one number'}
        >
          <div className="w-6 h-6 mb-1 flex items-center justify-center border-2 border-rose-400/60 rounded-full text-[10px]">
            <Eraser className="w-3 h-3" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            {lang === 'ru' ? 'Ластик' : 'Eraser'}
          </span>
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-zinc-900 border border-rose-500/60 text-rose-300 font-bold text-[9px]">
            {stats.boosters.erasers}
          </span>
        </button>

        {/* Bomb Booster */}
        <button
          id="btn-booster-bomb"
          onClick={() => onSelectBooster('bomb')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all relative ${
            activeBooster === 'bomb'
              ? 'bg-orange-900/60 text-orange-200 border border-orange-500 ring-2 ring-orange-500/50 shadow-md'
              : 'bg-zinc-800/80 hover:bg-zinc-700/60 text-orange-400 border border-zinc-700/50 active:bg-zinc-700'
          }`}
          title={lang === 'ru' ? 'Бомба: взорвать область' : 'Bomb: blast area'}
        >
          <div className="w-6 h-6 mb-1 flex items-center justify-center border-2 border-orange-400/60 rounded-full text-[10px]">
            <Bomb className="w-3 h-3" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            {lang === 'ru' ? 'Бомба' : 'Bomb'}
          </span>
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-zinc-900 border border-orange-500/60 text-orange-300 font-bold text-[9px]">
            {stats.boosters.bombs}
          </span>
        </button>
      </div>
    </div>
  );
};
