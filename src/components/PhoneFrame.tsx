import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, BatteryMedium, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface PhoneFrameProps {
  children: React.ReactNode;
  isPhoneView: boolean;
  onToggleView: () => void;
  lang: Language;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  isPhoneView,
  onToggleView,
  lang,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 bg-[#09090B] transition-colors duration-300">
      {/* Top Floating Viewport Switcher for desktop users */}
      <div className="w-full max-w-md hidden sm:flex items-center justify-between px-3.5 py-2 mb-3 bg-[#121214]/90 backdrop-blur-md border border-zinc-800/80 rounded-full text-xs text-zinc-400 z-30 shadow-lg">
        <div className="flex items-center gap-1.5 font-medium text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="tracking-wide">Number Match</span>
        </div>
        <button
          id="btn-toggle-phone-frame"
          onClick={onToggleView}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium border border-zinc-700/50 transition-all hover:scale-105 active:scale-95 text-[11px]"
          title={isPhoneView ? 'Переключить на полный экран' : 'Переключить на вид смартфона'}
        >
          {isPhoneView ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'ru' ? 'Полный экран' : 'Full Screen'}</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'ru' ? 'Вид смартфона' : 'Phone Frame'}</span>
            </>
          )}
        </button>
      </div>

      {isPhoneView ? (
        /* Realistic Mobile Phone Case in Elegant Dark style */
        <div
          id="phone-device-shell"
          className="relative w-full sm:w-[380px] md:w-[400px] h-[100dvh] sm:h-[780px] md:h-[820px] max-h-[100dvh] sm:max-h-[94vh] bg-[#121214] sm:rounded-[50px] shadow-[0_0_80px_rgba(0,0,0,0.8)] border-0 sm:border-[10px] sm:border-[#1C1C1F] flex flex-col relative overflow-hidden select-none"
        >
          {/* Phone Dynamic Notch / Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1C1C1F] rounded-b-2xl z-40 flex items-center justify-between px-3 shadow-md pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>

          {/* Top Status Bar */}
          <div className="w-full h-8 px-6 pt-2 flex items-center justify-between text-[11px] font-semibold text-zinc-500 z-30 select-none pointer-events-none">
            <span className="tracking-tight">{currentTime}</span>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Wifi className="w-3 h-3" />
              <BatteryMedium className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Inner Phone Screen Content */}
          <div className="flex-1 flex flex-col h-[calc(100%-2rem)] overflow-hidden relative">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="w-full h-4 flex items-center justify-center pb-1 z-30 pointer-events-none bg-gradient-to-t from-[#121214] to-transparent">
            <div className="w-32 h-1 bg-zinc-800 rounded-full" />
          </div>
        </div>
      ) : (
        /* Full Screen Fluid View */
        <div
          id="fluid-game-container"
          className="w-full max-w-lg h-[100dvh] sm:h-[860px] bg-[#121214] sm:rounded-3xl border border-zinc-800/80 shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative"
        >
          {children}
        </div>
      )}
    </div>
  );
};
