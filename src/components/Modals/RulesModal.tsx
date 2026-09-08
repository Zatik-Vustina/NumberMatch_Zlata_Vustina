import React from 'react';
import { X, CheckCircle2, Plus, Sparkles, Zap } from 'lucide-react';
import { Language } from '../../types';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-rules"
        className="w-full max-w-md bg-[#121214] border border-zinc-800/90 rounded-3xl p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh] overflow-hidden text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg">
              {lang === 'ru' ? 'Как играть в Числа (Number Match)' : 'How to Play Number Match'}
            </h3>
          </div>
          <button
            id="btn-close-rules"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3.5 text-xs sm:text-sm text-zinc-300 pr-1">
          {/* Rule 1: Match conditions */}
          <div className="bg-zinc-900/70 p-3.5 rounded-2xl border border-zinc-800/80">
            <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ru' ? '1. Условия для пары' : '1. Matching Conditions'}</span>
            </h4>
            <p className="mb-3 text-zinc-300">
              {lang === 'ru'
                ? 'Нажимайте на пары чисел, которые равны между собой или дают в сумме 10:'
                : 'Tap pairs of numbers that are identical or sum up to 10:'}
            </p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-zinc-950 p-2.5 rounded-xl border border-indigo-500/30">
                <span className="text-[11px] font-semibold text-indigo-300 block mb-1">
                  {lang === 'ru' ? 'Одинаковые числа' : 'Identical numbers'}
                </span>
                <div className="flex items-center justify-center gap-2 font-black text-base text-indigo-400">
                  <span className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center border border-indigo-400/40">7</span>
                  <span>=</span>
                  <span className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center border border-indigo-400/40">7</span>
                </div>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-xl border border-emerald-500/30">
                <span className="text-[11px] font-semibold text-emerald-300 block mb-1">
                  {lang === 'ru' ? 'Сумма равна 10' : 'Sum equals 10'}
                </span>
                <div className="flex items-center justify-center gap-2 font-black text-base text-emerald-400">
                  <span className="w-8 h-8 rounded-lg bg-emerald-600/30 flex items-center justify-center border border-emerald-400/40">3</span>
                  <span>+</span>
                  <span className="w-8 h-8 rounded-lg bg-emerald-600/30 flex items-center justify-center border border-emerald-400/40">7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rule 2: Positions / Connectivity */}
          <div className="bg-zinc-900/70 p-3.5 rounded-2xl border border-zinc-800/80">
            <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ru' ? '2. Расположение на поле' : '2. Valid Placements'}</span>
            </h4>
            <ul className="space-y-2 text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100">{lang === 'ru' ? 'По горизонтали:' : 'Horizontally:'}</strong>{' '}
                  {lang === 'ru'
                    ? 'Рядом в одной строке (или между ними только вычеркнутые клетки).'
                    : 'Side-by-side in the same row (or only crossed-out cells between them).'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100">{lang === 'ru' ? 'По вертикали:' : 'Vertically:'}</strong>{' '}
                  {lang === 'ru'
                    ? 'В одном столбце друг над другом (или между ними только зачеркнутые цифры).'
                    : 'In the same column above/below each other (or only cleared cells between).'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100">{lang === 'ru' ? 'По диагонали:' : 'Diagonally:'}</strong>{' '}
                  {lang === 'ru'
                    ? 'Соседние по диагонали клетки.'
                    : 'Diagonally adjacent cells.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100">{lang === 'ru' ? 'Переход строки:' : 'Line Wrap:'}</strong>{' '}
                  {lang === 'ru'
                    ? 'Конец одной строки и начало следующей, если между ними нет активных цифр!'
                    : 'End of one line and start of the next line, if no active numbers exist in between!'}
                </span>
              </li>
            </ul>
          </div>

          {/* Rule 3: Add Numbers */}
          <div className="bg-zinc-900/70 p-3.5 rounded-2xl border border-zinc-800/80">
            <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ru' ? '3. Кнопка «Добавить числа»' : '3. "+ Add Numbers" Button'}</span>
            </h4>
            <p className="text-zinc-300">
              {lang === 'ru'
                ? 'Когда ходы закончились, нажмите кнопку добавления — все оставшиеся активные числа продублируются вниз поля, открывая новые комбинации!'
                : 'When no more moves are available, tap the add button — all remaining active digits will duplicate to the bottom, unlocking fresh combinations!'}
            </p>
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-3 border-t border-zinc-800 shrink-0">
          <button
            id="btn-understand-rules"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg active:scale-98"
          >
            {lang === 'ru' ? 'Всё понятно, играть!' : 'Got it, let\'s play!'}
          </button>
        </div>
      </div>
    </div>
  );
};
