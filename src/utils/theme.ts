import { ThemeId } from '../types';

export interface ThemeConfig {
  id: ThemeId;
  nameRu: string;
  nameEn: string;
  icon: string;
  bgClass: string;
  boardBg: string;
  cellActive: string;
  cellText: string;
  cellCleared: string;
  cellSelected: string;
  cellHint: string;
  gridBorder: string;
  headerBg: string;
  accentColor: string;
  isPaper?: boolean;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'modern-dark': {
    id: 'modern-dark',
    nameRu: 'Элегантный Тёмный',
    nameEn: 'Elegant Dark',
    icon: '✨',
    bgClass: 'bg-[#09090B] text-zinc-100',
    boardBg: 'bg-[#18181B]/50 border-zinc-800/50 shadow-inner',
    cellActive: 'bg-zinc-800 hover:bg-zinc-700/80 border-zinc-700/50 shadow-sm text-zinc-100 font-semibold',
    cellText: 'text-zinc-100',
    cellCleared: 'bg-zinc-900/40 text-zinc-600 border-zinc-800/50',
    cellSelected: 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] border border-indigo-400 font-bold scale-105',
    cellHint: 'bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.3)] border border-amber-400/50 animate-pulse',
    gridBorder: 'border-zinc-800/60',
    headerBg: 'bg-[#121214]',
    accentColor: 'indigo',
  },
  'notebook': {
    id: 'notebook',
    nameRu: 'Тетрадь в клеточку',
    nameEn: 'Math Notebook',
    icon: '📝',
    bgClass: 'bg-[#f4f1ea] text-slate-800',
    boardBg: 'bg-[#fcfbf9] border-[#d8d3c5] shadow-lg',
    cellActive: 'bg-[#f7f5ed] hover:bg-[#eae6d8] border-[#c9d3df] text-[#1a365d] font-bold shadow-sm',
    cellText: 'text-[#1a365d]',
    cellCleared: 'bg-transparent text-[#b0bec5]/35 border-transparent line-through decoration-[#ef4444]/60 decoration-2',
    cellSelected: 'bg-[#2563eb] text-white ring-3 ring-[#3b82f6]/40 shadow-md scale-105',
    cellHint: 'bg-[#fef08a] text-[#854d0e] ring-2 ring-[#eab308] animate-pulse',
    gridBorder: 'border-[#cdd6e0]',
    headerBg: 'bg-[#ede8dc] border-b border-[#d8d3c5]',
    accentColor: 'blue',
    isPaper: true,
  },
  'pastel-sunset': {
    id: 'pastel-sunset',
    nameRu: 'Закат & Пастель',
    nameEn: 'Pastel Sunset',
    icon: '🌸',
    bgClass: 'bg-[#181320] text-pink-50',
    boardBg: 'bg-[#241a30]/80 border-[#3d2b50] shadow-xl',
    cellActive: 'bg-[#332444] hover:bg-[#43305a] border-[#4e3766] text-pink-100 font-semibold shadow-sm',
    cellText: 'text-pink-100',
    cellCleared: 'bg-[#140f1c]/40 text-pink-400/20 border-[#261b33]/40',
    cellSelected: 'bg-gradient-to-tr from-pink-600 to-rose-600 text-white ring-2 ring-pink-400/50 scale-105 shadow-[0_0_15px_rgba(244,63,94,0.4)]',
    cellHint: 'bg-amber-400/25 text-amber-200 ring-2 ring-amber-300/80 animate-pulse',
    gridBorder: 'border-[#3d2b50]',
    headerBg: 'bg-[#1c1426]',
    accentColor: 'pink',
  },
  'emerald': {
    id: 'emerald',
    nameRu: 'Изумруд',
    nameEn: 'Emerald Forest',
    icon: '🌲',
    bgClass: 'bg-[#061510] text-emerald-50',
    boardBg: 'bg-[#0c241c]/80 border-[#153e30] shadow-xl',
    cellActive: 'bg-[#12382c] hover:bg-[#184838] border-[#1d5743] text-emerald-100 font-semibold shadow-sm',
    cellText: 'text-emerald-100',
    cellCleared: 'bg-[#040e0b]/40 text-emerald-500/20 border-[#0a2018]/40',
    cellSelected: 'bg-emerald-600 text-white ring-2 ring-emerald-400/50 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    cellHint: 'bg-lime-400/20 text-lime-200 ring-2 ring-lime-300/80 animate-pulse',
    gridBorder: 'border-[#153e30]',
    headerBg: 'bg-[#091d16]',
    accentColor: 'emerald',
  },
};
