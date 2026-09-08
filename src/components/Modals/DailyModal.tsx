import React from 'react';
import { X, Calendar as CalendarIcon, CheckCircle2, Trophy, Play } from 'lucide-react';
import { Language, PlayerStats } from '../../types';

interface DailyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDaily: (dateStr: string) => void;
  stats: PlayerStats;
  lang: Language;
}

export const DailyModal: React.FC<DailyModalProps> = ({
  isOpen,
  onClose,
  onStartDaily,
  stats,
  lang,
}) => {
  if (!isOpen) return null;

  // Generate list of recent 7 days
  const today = new Date();
  const days = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() - idx);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = idx === 0;
    const isCompleted = !!stats.dailyCompleted[dateStr];
    const score = stats.dailyCompleted[dateStr]?.score;

    return {
      dateStr,
      formattedDate: d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      isToday,
      isCompleted,
      score,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-daily"
        className="w-full max-w-md bg-[#121214] border border-zinc-800/90 rounded-3xl p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {lang === 'ru' ? 'Ежедневные головоломки' : 'Daily Challenges'}
              </h3>
              <p className="text-[11px] text-zinc-400 font-semibold">
                {lang === 'ru' ? 'Новое поле каждый день!' : 'A fresh puzzle every day!'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-daily"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Days List */}
        <div className="py-4 space-y-2 max-h-[55vh] overflow-y-auto pr-1">
          {days.map(day => (
            <div
              key={day.dateStr}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                day.isToday
                  ? 'bg-zinc-900/90 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  : 'bg-zinc-900/70 border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    day.isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : day.isToday
                      ? 'bg-amber-500 text-zinc-950 font-extrabold'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
                  }`}
                >
                  {day.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <CalendarIcon className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="font-bold text-xs sm:text-sm text-zinc-100 flex items-center gap-2">
                    <span>{day.formattedDate}</span>
                    {day.isToday && (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        {lang === 'ru' ? 'Сегодня' : 'Today'}
                      </span>
                    )}
                  </div>
                  {day.isCompleted && (
                    <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      <span>{day.score} pts</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                id={`btn-play-daily-${day.dateStr}`}
                onClick={() => {
                  onStartDaily(day.dateStr);
                  onClose();
                }}
                className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                  day.isToday
                    ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md active:scale-95'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/50'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{day.isCompleted ? (lang === 'ru' ? 'Снова' : 'Replay') : (lang === 'ru' ? 'Играть' : 'Play')}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
