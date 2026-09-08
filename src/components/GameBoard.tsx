import React, { useRef, useEffect } from 'react';
import { CellData, Language } from '../types';
import { ThemeConfig } from '../utils/theme';
import { COLS } from '../utils/gameLogic';
import { Sparkles, Eraser, Bomb } from 'lucide-react';

interface GameBoardProps {
  cells: CellData[];
  selectedIdx: number | null;
  hintPair: { idx1: number; idx2: number } | null;
  activeBooster: 'eraser' | 'bomb' | null;
  onCellClick: (index: number) => void;
  theme: ThemeConfig;
  lang: Language;
  clearedRows: number[];
  floatingTexts: { id: string; x: number; y: number; text: string; color: string }[];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  cells,
  selectedIdx,
  hintPair,
  activeBooster,
  onCellClick,
  theme,
  lang,
  clearedRows,
  floatingTexts,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const totalRows = Math.ceil(cells.length / COLS);

  // Auto scroll to bottom when new numbers are added if near bottom
  useEffect(() => {
    if (boardRef.current) {
      const el = boardRef.current;
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
      if (isNearBottom) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [cells.length]);

  return (
    <div
      ref={boardRef}
      id="game-board-scroll-container"
      className={`flex-1 w-full overflow-y-auto overflow-x-hidden p-3 sm:p-4 relative select-none scroll-smooth ${theme.boardBg}`}
      style={{
        backgroundImage: theme.isPaper
          ? 'linear-gradient(to right, rgba(180, 200, 220, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(180, 200, 220, 0.25) 1px, transparent 1px)'
          : undefined,
        backgroundSize: theme.isPaper ? '20px 20px' : undefined,
      }}
    >
      {/* Floating Booster Mode Alert Banner */}
      {activeBooster && (
        <div className="sticky top-1 z-30 mb-2 mx-auto max-w-xs px-3 py-1.5 rounded-full bg-zinc-800 border border-amber-500/50 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 shadow-lg animate-pulse">
          {activeBooster === 'eraser' ? (
            <>
              <Eraser className="w-3.5 h-3.5 text-rose-400" />
              <span>{lang === 'ru' ? 'Нажмите на любую цифру, чтобы стереть' : 'Tap any number to erase'}</span>
            </>
          ) : (
            <>
              <Bomb className="w-3.5 h-3.5 text-orange-400" />
              <span>{lang === 'ru' ? 'Нажмите, чтобы взорвать область' : 'Tap to bomb 3x3 area'}</span>
            </>
          )}
        </div>
      )}

      {/* Floating score & combo popup texts */}
      {floatingTexts.map(item => (
        <div
          key={item.id}
          className="pointer-events-none absolute z-40 font-black text-sm sm:text-base animate-float-fade"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            color: item.color,
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}
        >
          {item.text}
        </div>
      ))}

      {/* Rows Container */}
      <div className="flex flex-col gap-1.5 w-full max-w-md mx-auto">
        {Array.from({ length: totalRows }).map((_, rIdx) => {
          const isRowFullyCleared = clearedRows.includes(rIdx);

          return (
            <div
              key={`row-${rIdx}`}
              className={`flex items-center gap-1.5 transition-opacity duration-300 ${
                isRowFullyCleared ? 'opacity-25' : 'opacity-100'
              }`}
            >
              {/* Optional Row Number Sidebar */}
              <div className="w-4 sm:w-5 text-[10px] font-mono text-center text-zinc-600 select-none shrink-0 font-semibold">
                {rIdx + 1}
              </div>

              {/* 9 Grid Cells in this row */}
              <div className="grid grid-cols-9 gap-1 sm:gap-1.5 flex-1">
                {Array.from({ length: COLS }).map((_, cIdx) => {
                  const cellIdx = rIdx * COLS + cIdx;
                  if (cellIdx >= cells.length) {
                    return (
                      <div
                        key={`empty-${rIdx}-${cIdx}`}
                        className="aspect-square rounded-lg opacity-10 border border-dashed border-zinc-700"
                      />
                    );
                  }

                  const cell = cells[cellIdx];
                  const isSelected = selectedIdx === cellIdx;
                  const isHinted =
                    hintPair !== null &&
                    (hintPair.idx1 === cellIdx || hintPair.idx2 === cellIdx);

                  // Cell styling determination
                  let cellClasses =
                    'relative aspect-square rounded-lg flex items-center justify-center text-lg sm:text-xl transition-all duration-150 cursor-pointer ';

                  if (cell.isCleared) {
                    cellClasses += theme.cellCleared;
                  } else if (isSelected) {
                    cellClasses += theme.cellSelected;
                  } else if (isHinted) {
                    cellClasses += theme.cellHint;
                  } else {
                    cellClasses += theme.cellActive;
                  }

                  // Booster targeting style
                  if (activeBooster && !cell.isCleared) {
                    cellClasses += ' ring-2 ring-amber-400 hover:scale-110 ';
                  }

                  return (
                    <button
                      key={cell.id}
                      id={`cell-${cellIdx}`}
                      onClick={() => onCellClick(cellIdx)}
                      disabled={cell.isCleared && !activeBooster}
                      className={cellClasses}
                      style={{ minHeight: '34px' }}
                    >
                      {/* Number Text */}
                      <span
                        className={`font-semibold select-none ${
                          cell.isCleared ? 'opacity-30' : 'opacity-100'
                        }`}
                      >
                        {cell.value}
                      </span>

                      {/* Strikethrough line for cleared cells */}
                      {cell.isCleared && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-4/5 h-[1.5px] bg-zinc-600/60 rounded-full rotate-45" />
                        </div>
                      )}

                      {/* Hint sparkles badge */}
                      {isHinted && !cell.isCleared && (
                        <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-400 fill-amber-300 animate-spin" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
