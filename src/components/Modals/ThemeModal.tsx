import React from 'react';
import { X, Check } from 'lucide-react';
import { Language, ThemeId } from '../../types';
import { THEMES } from '../../utils/theme';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
  lang: Language;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-theme"
        className="w-full max-w-md bg-[#121214] border border-zinc-800/90 rounded-3xl p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="font-extrabold text-base sm:text-lg">
            {lang === 'ru' ? 'Темы оформления' : 'Color Themes'}
          </h3>
          <button
            id="btn-close-theme"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme List */}
        <div className="py-4 space-y-2.5">
          {(Object.keys(THEMES) as ThemeId[]).map(themeKey => {
            const t = THEMES[themeKey];
            const isSelected = currentThemeId === themeKey;

            return (
              <button
                key={themeKey}
                id={`theme-btn-${themeKey}`}
                onClick={() => {
                  onSelectTheme(themeKey);
                }}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-indigo-500 ring-2 ring-indigo-500/40 shadow-md'
                    : 'bg-zinc-900/60 hover:bg-zinc-800/60 border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.icon}</span>
                  <div className="text-left">
                    <div className="font-bold text-sm text-white">
                      {lang === 'ru' ? t.nameRu : t.nameEn}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-semibold">
                      {themeKey === 'notebook'
                        ? (lang === 'ru' ? 'Классическая школьная тетрадка' : 'Nostalgic math grid paper')
                        : themeKey === 'modern-dark'
                        ? (lang === 'ru' ? 'Элегантный темный стиль с индиго' : 'Sleek OLED zinc with indigo')
                        : themeKey === 'pastel-sunset'
                        ? (lang === 'ru' ? 'Мягкие теплые розовые тона' : 'Soft warm sunset hues')
                        : (lang === 'ru' ? 'Спокойный изумрудный лес' : 'Calm deep emerald & mint')}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <button
          id="btn-confirm-theme"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg"
        >
          {lang === 'ru' ? 'Применить' : 'Apply'}
        </button>
      </div>
    </div>
  );
};
