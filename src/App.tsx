/**
 * Number Match - Mobile Logic Puzzle Game
 * @license Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CellData, GameMode, Language, LevelConfig, PlayerStats, MoveHistory, ThemeId } from './types';
import { THEMES } from './utils/theme';
import {
  COLS,
  CLASSIC_NUMBERS,
  buildCellsFromNumbers,
  isValidMatch,
  findAvailablePairs,
  addActiveNumbers,
  shuffleActiveCells,
  getClearedRowIndices,
  isBoardCleared,
  generateDailyBoard,
  GAME_LEVELS,
} from './utils/gameLogic';
import {
  playTap,
  playSelect,
  playMatch,
  playRowClear,
  playAddNumbers,
  playHint,
  playBooster,
  playError,
  playVictory,
  setSoundEnabled,
  isSoundEnabled,
} from './utils/audio';

import { PhoneFrame } from './components/PhoneFrame';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { ActionControls } from './components/ActionControls';
import { RulesModal } from './components/Modals/RulesModal';
import { StatsModal } from './components/Modals/StatsModal';
import { LevelSelectModal } from './components/Modals/LevelSelectModal';
import { DailyModal } from './components/Modals/DailyModal';
import { ThemeModal } from './components/Modals/ThemeModal';
import { VictoryModal } from './components/Modals/VictoryModal';

const STATS_STORAGE_KEY = 'number_match_stats_v1';
const THEME_STORAGE_KEY = 'number_match_theme_v1';
const LANG_STORAGE_KEY = 'number_match_lang_v1';

const DEFAULT_STATS: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  totalPairsMatched: 0,
  highScore: 0,
  maxCombo: 1,
  completedLevels: {},
  dailyCompleted: {},
  boosters: {
    hints: 5,
    shuffles: 3,
    erasers: 3,
    bombs: 2,
  },
};

export default function App() {
  // Persistence states
  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    } catch {
      // Fallback
    }
    return DEFAULT_STATS;
  });

  const [themeId, setThemeId] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
      if (saved && THEMES[saved]) return saved;
    } catch {
      // Fallback
    }
    return 'modern-dark';
  });

  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language;
      if (saved === 'ru' || saved === 'en') return saved;
    } catch {
      // Fallback
    }
    return 'ru';
  });

  // Game Engine States
  const [mode, setMode] = useState<GameMode>('classic');
  const [currentLevel, setCurrentLevel] = useState<LevelConfig | undefined>(undefined);
  const [dailyDate, setDailyDate] = useState<string>('');

  const [cells, setCells] = useState<CellData[]>(() => buildCellsFromNumbers(CLASSIC_NUMBERS));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hintPair, setHintPair] = useState<{ idx1: number; idx2: number } | null>(null);
  const [activeBooster, setActiveBooster] = useState<'eraser' | 'bomb' | null>(null);

  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [lastMatchTimestamp, setLastMatchTimestamp] = useState<number>(0);
  const [pairsMatched, setPairsMatched] = useState<number>(0);
  const [addsUsed, setAddsUsed] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [starsEarned, setStarsEarned] = useState<number>(0);

  const [history, setHistory] = useState<MoveHistory[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<
    { id: string; x: number; y: number; text: string; color: string }[]
  >([]);

  // UI Viewport & Modals States
  const [isPhoneView, setIsPhoneView] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(!isSoundEnabled());
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isLevelsOpen, setIsLevelsOpen] = useState<boolean>(false);
  const [isDailyOpen, setIsDailyOpen] = useState<boolean>(false);
  const [isThemeOpen, setIsThemeOpen] = useState<boolean>(false);

  // Save Stats on change
  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // Ignore storage errors
    }
  }, [stats]);

  // Save Theme on change
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch {
      // Ignore
    }
  }, [themeId]);

  // Save Lang on change
  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore
    }
  }, [lang]);

  // Active uncleared numbers count
  const activeCount = useMemo(() => cells.filter(c => !c.isCleared).length, [cells]);

  // Available valid matching pairs on the board
  const availablePairs = useMemo(() => findAvailablePairs(cells), [cells]);

  // Fully cleared rows
  const clearedRows = useMemo(() => getClearedRowIndices(cells), [cells]);

  // Level target progression computation
  const targetProgress = useMemo(() => {
    if (mode !== 'levels' || !currentLevel) return undefined;

    if (currentLevel.targetType === 'target-score' && currentLevel.targetValue) {
      return {
        current: score,
        target: currentLevel.targetValue,
        label: lang === 'ru' ? 'Цель: Очки' : 'Goal: Score',
      };
    }

    if (currentLevel.targetType === 'target-pairs' && currentLevel.targetValue) {
      return {
        current: pairsMatched,
        target: currentLevel.targetValue,
        label: lang === 'ru' ? 'Цель: Пары' : 'Goal: Pairs',
      };
    }

    return {
      current: cells.length - activeCount,
      target: cells.length,
      label: lang === 'ru' ? 'Очищено' : 'Cleared',
    };
  }, [mode, currentLevel, score, pairsMatched, cells.length, activeCount, lang]);

  // Record history snapshot before a mutation
  const pushHistory = useCallback(() => {
    setHistory(prev => [
      ...prev.slice(-20), // keep last 20 moves
      {
        cells: JSON.parse(JSON.stringify(cells)),
        score,
        activeBooster: null,
        pairsMatched,
      },
    ]);
  }, [cells, score, pairsMatched]);

  // Check victory / level completion
  const checkGameCompletion = useCallback(
    (currentCells: CellData[], currentScore: number, currentPairs: number) => {
      let win = false;
      let stars = 3;

      if (mode === 'levels' && currentLevel) {
        if (currentLevel.targetType === 'clear-all') {
          if (isBoardCleared(currentCells)) win = true;
        } else if (currentLevel.targetType === 'target-score' && currentLevel.targetValue) {
          if (currentScore >= currentLevel.targetValue) win = true;
        } else if (currentLevel.targetType === 'target-pairs' && currentLevel.targetValue) {
          if (currentPairs >= currentLevel.targetValue) win = true;
        }

        if (win) {
          const [s1, s2, s3] = currentLevel.starThresholds;
          if (currentScore >= s3) stars = 3;
          else if (currentScore >= s2) stars = 2;
          else if (currentScore >= s1) stars = 1;
          else stars = 1;
        }
      } else if (mode === 'daily') {
        if (isBoardCleared(currentCells) || currentPairs >= 18) {
          win = true;
        }
      } else {
        // Classic & Zen
        if (isBoardCleared(currentCells)) {
          win = true;
        }
      }

      if (win && !isVictory) {
        setIsVictory(true);
        setStarsEarned(stars);
        playVictory();

        // Update stats
        setStats(prev => {
          const newHigh = Math.max(prev.highScore, currentScore);
          const updatedLevels = { ...prev.completedLevels };
          if (currentLevel) {
            updatedLevels[currentLevel.id] = Math.max(
              updatedLevels[currentLevel.id] || 0,
              stars,
            );
          }

          const updatedDaily = { ...prev.dailyCompleted };
          if (mode === 'daily' && dailyDate) {
            updatedDaily[dailyDate] = { score: currentScore, date: dailyDate };
          }

          return {
            ...prev,
            gamesWon: prev.gamesWon + 1,
            highScore: newHigh,
            completedLevels: updatedLevels,
            dailyCompleted: updatedDaily,
            boosters: {
              ...prev.boosters,
              hints: prev.boosters.hints + 1,
            },
          };
        });
      }
    },
    [mode, currentLevel, dailyDate, isVictory],
  );

  // Initialize Game Modes
  const startClassicGame = useCallback(() => {
    setMode('classic');
    setCurrentLevel(undefined);
    setDailyDate('');
    setCells(buildCellsFromNumbers(CLASSIC_NUMBERS));
    setSelectedIdx(null);
    setHintPair(null);
    setActiveBooster(null);
    setScore(0);
    setCombo(1);
    setPairsMatched(0);
    setAddsUsed(0);
    setHistory([]);
    setIsVictory(false);
    setStats(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    playTap();
  }, []);

  const startLevel = useCallback((level: LevelConfig) => {
    setMode('levels');
    setCurrentLevel(level);
    setDailyDate('');
    setCells(buildCellsFromNumbers(level.initialNumbers));
    setSelectedIdx(null);
    setHintPair(null);
    setActiveBooster(null);
    setScore(0);
    setCombo(1);
    setPairsMatched(0);
    setAddsUsed(0);
    setHistory([]);
    setIsVictory(false);
    setStats(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    playTap();
  }, []);

  const startDailyGame = useCallback((dateStr: string) => {
    setMode('daily');
    setCurrentLevel(undefined);
    setDailyDate(dateStr);
    const numbers = generateDailyBoard(dateStr);
    setCells(buildCellsFromNumbers(numbers));
    setSelectedIdx(null);
    setHintPair(null);
    setActiveBooster(null);
    setScore(0);
    setCombo(1);
    setPairsMatched(0);
    setAddsUsed(0);
    setHistory([]);
    setIsVictory(false);
    setStats(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    playTap();
  }, []);

  // Handle Cell Click (Standard Matching or Booster targeting)
  const handleCellClick = (clickedIdx: number) => {
    const clickedCell = cells[clickedIdx];
    if (!clickedCell) return;

    // 1. Booster Mode: Eraser
    if (activeBooster === 'eraser') {
      if (clickedCell.isCleared) return;
      pushHistory();
      playBooster();

      const newCells = cells.map((c, i) =>
        i === clickedIdx ? { ...c, isCleared: true } : c,
      );
      setCells(newCells);
      setActiveBooster(null);
      setStats(prev => ({
        ...prev,
        boosters: { ...prev.boosters, erasers: Math.max(0, prev.boosters.erasers - 1) },
      }));
      checkGameCompletion(newCells, score + 10, pairsMatched);
      return;
    }

    // 2. Booster Mode: Bomb (clears 3x3 surrounding zone)
    if (activeBooster === 'bomb') {
      pushHistory();
      playBooster();

      const targetRow = clickedCell.row;
      const targetCol = clickedCell.col;

      const newCells = cells.map(c => {
        if (Math.abs(c.row - targetRow) <= 1 && Math.abs(c.col - targetCol) <= 1) {
          return { ...c, isCleared: true };
        }
        return c;
      });

      setCells(newCells);
      setActiveBooster(null);
      setStats(prev => ({
        ...prev,
        boosters: { ...prev.boosters, bombs: Math.max(0, prev.boosters.bombs - 1) },
      }));
      checkGameCompletion(newCells, score + 50, pairsMatched + 2);
      return;
    }

    // Normal Click Flow
    if (clickedCell.isCleared) return;

    // If nothing selected yet -> select this cell
    if (selectedIdx === null) {
      setSelectedIdx(clickedIdx);
      playSelect();
      return;
    }

    // If same cell clicked again -> deselect
    if (selectedIdx === clickedIdx) {
      setSelectedIdx(null);
      playTap();
      return;
    }

    // Second cell selected -> check if match is valid
    const isMatch = isValidMatch(cells, selectedIdx, clickedIdx);

    if (isMatch) {
      pushHistory();

      // Combo streak calculation (< 3.5 seconds = combo increases)
      const now = Date.now();
      let nextCombo = 1;
      if (now - lastMatchTimestamp < 3500) {
        nextCombo = Math.min(combo + 1, 8);
      }
      setCombo(nextCombo);
      setLastMatchTimestamp(now);

      // Points calculation
      const firstCell = cells[selectedIdx];
      const basePoints = firstCell.value === clickedCell.value ? 10 : 15;
      const points = basePoints * nextCombo;
      const newScore = score + points;
      const newPairsMatched = pairsMatched + 1;

      // Update cells
      const prevClearedRowsCount = clearedRows.length;
      const newCells = cells.map((c, i) =>
        i === selectedIdx || i === clickedIdx ? { ...c, isCleared: true } : c,
      );

      // Check if this move completely cleared any new row (+50 bonus)
      const nextClearedRowsCount = getClearedRowIndices(newCells).length;
      let finalScore = newScore;
      if (nextClearedRowsCount > prevClearedRowsCount) {
        const bonusRows = nextClearedRowsCount - prevClearedRowsCount;
        finalScore += bonusRows * 50;
        playRowClear();
      } else {
        playMatch(nextCombo);
      }

      // Add floating popup text
      const floatText = nextCombo > 1 ? `+${points} x${nextCombo}!` : `+${points}`;
      const floatId = Math.random().toString();
      setFloatingTexts(prev => [
        ...prev,
        {
          id: floatId,
          x: Math.min(window.innerWidth - 80, (clickedCell.col * 38) + 30),
          y: Math.max(30, clickedCell.row * 38),
          text: floatText,
          color: nextCombo > 1 ? '#fbbf24' : '#60a5fa',
        },
      ]);
      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(f => f.id !== floatId));
      }, 900);

      setCells(newCells);
      setScore(finalScore);
      setPairsMatched(newPairsMatched);
      setSelectedIdx(null);
      setHintPair(null);

      // Update player stats
      setStats(prev => ({
        ...prev,
        totalPairsMatched: prev.totalPairsMatched + 1,
        highScore: Math.max(prev.highScore, finalScore),
        maxCombo: Math.max(prev.maxCombo, nextCombo),
      }));

      // Check Victory
      checkGameCompletion(newCells, finalScore, newPairsMatched);
    } else {
      // Invalid match -> play soft error tone and switch selection to newly tapped cell
      playError();
      setSelectedIdx(clickedIdx);
    }
  };

  // Add numbers action
  const handleAddNumbers = () => {
    if (activeCount === 0) return;
    pushHistory();
    playAddNumbers();

    const newCells = addActiveNumbers(cells);
    setCells(newCells);
    setAddsUsed(prev => prev + 1);
    setSelectedIdx(null);
    setHintPair(null);
  };

  // Hint action
  const handleHint = () => {
    if (availablePairs.length === 0) {
      playError();
      return;
    }
    pushHistory();
    playHint();

    // Pick first available pair
    const target = availablePairs[0];
    setHintPair(target);
    setSelectedIdx(null);

    setStats(prev => ({
      ...prev,
      boosters: { ...prev.boosters, hints: Math.max(0, prev.boosters.hints - 1) },
    }));
  };

  // Shuffle action
  const handleShuffle = () => {
    if (activeCount <= 1) return;
    pushHistory();
    playBooster();

    const newCells = shuffleActiveCells(cells);
    setCells(newCells);
    setSelectedIdx(null);
    setHintPair(null);

    setStats(prev => ({
      ...prev,
      boosters: { ...prev.boosters, shuffles: Math.max(0, prev.boosters.shuffles - 1) },
    }));
  };

  // Undo action
  const handleUndo = () => {
    if (history.length === 0) return;
    playTap();
    const last = history[history.length - 1];
    setCells(last.cells);
    setScore(last.score);
    setPairsMatched(last.pairsMatched);
    setSelectedIdx(null);
    setHintPair(null);
    setActiveBooster(null);
    setHistory(prev => prev.slice(0, -1));
  };

  // Select booster mode
  const handleSelectBooster = (type: 'eraser' | 'bomb') => {
    if (activeBooster === type) {
      setActiveBooster(null);
      playTap();
      return;
    }

    if (type === 'eraser' && stats.boosters.erasers <= 0) {
      playError();
      return;
    }
    if (type === 'bomb' && stats.boosters.bombs <= 0) {
      playError();
      return;
    }

    setActiveBooster(type);
    setSelectedIdx(null);
    playTap();
  };

  // Sound toggle
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setSoundEnabled(!nextMuted);
  };

  // Lang toggle
  const handleToggleLang = () => {
    setLang(prev => (prev === 'ru' ? 'en' : 'ru'));
  };

  // Next level in Journey
  const handleNextLevel = () => {
    if (mode === 'levels' && currentLevel && currentLevel.id < GAME_LEVELS.length) {
      const nextLvl = GAME_LEVELS.find(l => l.id === currentLevel.id + 1);
      if (nextLvl) {
        startLevel(nextLvl);
      }
    } else {
      startClassicGame();
    }
  };

  const currentTheme = THEMES[themeId] || THEMES['modern-dark'];

  return (
    <div className={`min-h-screen w-full flex items-center justify-center ${currentTheme.bgClass} transition-colors duration-300`}>
      <PhoneFrame
        isPhoneView={isPhoneView}
        onToggleView={() => setIsPhoneView(!isPhoneView)}
        lang={lang}
      >
        {/* Game App Header */}
        <Header
          mode={mode}
          currentLevel={currentLevel}
          score={score}
          highScore={stats.highScore}
          combo={combo}
          targetProgress={targetProgress}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onRestart={() => {
            if (mode === 'levels' && currentLevel) startLevel(currentLevel);
            else if (mode === 'daily' && dailyDate) startDailyGame(dailyDate);
            else startClassicGame();
          }}
          onOpenLevels={() => setIsLevelsOpen(true)}
          onOpenDaily={() => setIsDailyOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenTheme={() => setIsThemeOpen(true)}
          onOpenRules={() => setIsRulesOpen(true)}
          onToggleLang={handleToggleLang}
          lang={lang}
          theme={currentTheme}
        />

        {/* Interactive Game Grid */}
        <GameBoard
          cells={cells}
          selectedIdx={selectedIdx}
          hintPair={hintPair}
          activeBooster={activeBooster}
          onCellClick={handleCellClick}
          theme={currentTheme}
          lang={lang}
          clearedRows={clearedRows}
          floatingTexts={floatingTexts}
        />

        {/* Action Bar (Add rows + Boosters) */}
        <ActionControls
          activeCount={activeCount}
          availablePairsCount={availablePairs.length}
          onAddNumbers={handleAddNumbers}
          onHint={handleHint}
          onUndo={handleUndo}
          onShuffle={handleShuffle}
          onSelectBooster={handleSelectBooster}
          activeBooster={activeBooster}
          canUndo={history.length > 0}
          maxAdds={currentLevel?.maxAdds}
          currentAddsUsed={addsUsed}
          stats={stats}
          lang={lang}
          theme={currentTheme}
        />
      </PhoneFrame>

      {/* Popups & Modals */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        lang={lang}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        lang={lang}
      />

      <LevelSelectModal
        isOpen={isLevelsOpen}
        onClose={() => setIsLevelsOpen(false)}
        onSelectLevel={startLevel}
        onSelectClassic={startClassicGame}
        completedLevels={stats.completedLevels}
        lang={lang}
      />

      <DailyModal
        isOpen={isDailyOpen}
        onClose={() => setIsDailyOpen(false)}
        onStartDaily={startDailyGame}
        stats={stats}
        lang={lang}
      />

      <ThemeModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
        currentThemeId={themeId}
        onSelectTheme={setThemeId}
        lang={lang}
      />

      <VictoryModal
        isOpen={isVictory}
        score={score}
        stars={starsEarned}
        pairsMatched={pairsMatched}
        mode={mode}
        currentLevel={currentLevel}
        onNextLevel={handleNextLevel}
        onRestart={() => {
          if (mode === 'levels' && currentLevel) startLevel(currentLevel);
          else if (mode === 'daily' && dailyDate) startDailyGame(dailyDate);
          else startClassicGame();
        }}
        onOpenLevelSelect={() => {
          setIsVictory(false);
          setIsLevelsOpen(true);
        }}
        lang={lang}
      />
    </div>
  );
}
