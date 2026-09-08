import React from 'react';
import {
  Trophy,
  HelpCircle,
  BarChart2,
  Palette,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Layers,
  Calendar,
  Flame,
} from 'lucide-react';
import { GameMode, Language, LevelConfig } from '../types';
import { ThemeConfig } from '../utils/theme';

interface HeaderProps {
  mode: GameMode;
  currentLevel?: LevelConfig;
  score: number;
  highScore: number;
  combo: number;
  targetProgress?: { current: number; target: number; label: string };
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
  onOpenLevels: () => void;
  onOpenDaily: () => void;
  onOpenStats: () => void;
  onOpenTheme: () => void;
  onOpenRules: () => void;
  onToggleLang: () => void;
  lang: Language;
  theme: ThemeConfig;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  currentLevel,
  score,
  highScore,
  combo,
  targetProgress,
  isMuted,
  onToggleMute,
  onRestart,
  onOpenLevels,
  onOpenDaily,
  onOpenStats,
  onOpenTheme,
  onOpenRules,
  onToggleLang,
  lang,
  theme,
}) => {
  const getModeTitle = () => {
    if (mode === 'levels' && currentLevel) {
      return lang === 'ru' ? currentLevel.titleRu : currentLevel.titleEn;
    }
    if (mode === 'daily') {
      return lang === 'ru' ? 'Ежедневный вызов' : 'Daily Puzzle';
    }
    if (mode === 'zen') {
      return lang === 'ru' ? 'Режим Дзен' : 'Zen Relax';
    }
    return lang === 'ru' ? 'Классика (1-19)' : 'Classic 1-19';
  };

  return (
    <header className={`w-full px-4 pt-1 pb-3 ${theme.headerBg} flex flex-col gap-3 shrink-0 select-none transition-colors`}>
      {/* Top Utility Icons Bar */}
      <div className="flex items-center justify-between gap-1">
        {/* Mode Selector & Reset */}
        <div className="flex items-center gap-1.5">
          <button
            id="header-btn-levels"
            onClick={onOpenLevels}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/50 transition-all active:scale-95 shadow-sm"
            title={lang === 'ru' ? 'Выбрать уровень' : 'Select Level'}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xs:inline">{lang === 'ru' ? 'Уровни' : 'Levels'}</span>
          </button>

          <button
            id="header-btn-daily"
            onClick={onOpenDaily}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/50 transition-all active:scale-95 shadow-sm"
            title={lang === 'ru' ? 'Ежедневная игра' : 'Daily Challenge'}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">{lang === 'ru' ? 'День' : 'Daily'}</span>
          </button>
        </div>

        {/* Title Center Badge */}
        <div className="text-center font-bold text-xs sm:text-sm tracking-wide truncate max-w-[120px] sm:max-w-[160px] text-zinc-300">
          <span className="text-indigo-400 font-extrabold mr-1">#</span>
          <span>{getModeTitle()}</span>
        </div>

        {/* Quick Settings & Help */}
        <div className="flex items-center gap-1">
          <button
            id="header-btn-lang"
            onClick={onToggleLang}
            className="px-1.5 py-1 rounded-lg text-xs font-bold bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/40 text-zinc-300 hover:text-white transition-all"
            title={lang === 'ru' ? 'English' : 'Русский'}
          >
            {lang === 'ru' ? 'RU' : 'EN'}
          </button>

          <button
            id="header-btn-mute"
            onClick={onToggleMute}
            className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/40 text-zinc-400 hover:text-white transition-all"
            title={isMuted ? 'Включить звук' : 'Выключить звук'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            id="header-btn-theme"
            onClick={onOpenTheme}
            className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/40 text-zinc-400 hover:text-white transition-all"
            title={lang === 'ru' ? 'Темы оформления' : 'Themes'}
          >
            <Palette className="w-3.5 h-3.5 text-purple-400" />
          </button>

          <button
            id="header-btn-stats"
            onClick={onOpenStats}
            className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/40 text-zinc-400 hover:text-white transition-all"
            title={lang === 'ru' ? 'Статистика' : 'Stats'}
          >
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            id="header-btn-rules"
            onClick={onOpenRules}
            className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/40 text-zinc-400 hover:text-white transition-all"
            title={lang === 'ru' ? 'Правила игры' : 'Rules'}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button
            id="header-btn-restart"
            onClick={onRestart}
            className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-rose-500/20 border border-zinc-700/40 text-zinc-400 hover:text-rose-400 transition-all"
            title={lang === 'ru' ? 'Начать заново' : 'Restart'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Score & Objective Banner - Elegant Dark Design Pattern */}
      <div className="flex justify-between items-start pt-1">
        {/* Current Score */}
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
            {lang === 'ru' ? 'Текущий счёт' : 'Current Score'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-indigo-400">
              {score.toLocaleString()}
            </span>
            {combo > 1 && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 font-bold text-[10px] tracking-wider uppercase">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>x{combo}</span>
              </span>
            )}
          </div>
        </div>

        {/* Goal Progress or High Score */}
        {targetProgress ? (
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
              {targetProgress.label}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-medium text-zinc-200">
                {targetProgress.current} / {targetProgress.target}
              </span>
              <div className="w-14 h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/40">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (targetProgress.current / targetProgress.target) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold flex items-center gap-1">
              <Trophy className="w-3 h-3 text-zinc-500" />
              <span>{lang === 'ru' ? 'Рекорд' : 'Best'}</span>
            </span>
            <span className="text-xl font-medium text-zinc-200">
              {highScore.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
