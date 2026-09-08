export type NumberValue = number; // 1 to 9

export interface CellData {
  id: string;
  value: number;
  isCleared: boolean;
  row: number;
  col: number;
  index: number;
}

export type GameMode = 'classic' | 'levels' | 'daily' | 'zen';

export type ThemeId = 'modern-dark' | 'notebook' | 'pastel-sunset' | 'emerald';

export interface LevelConfig {
  id: number;
  titleRu: string;
  titleEn: string;
  descriptionRu: string;
  descriptionEn: string;
  initialNumbers: number[];
  targetType: 'clear-all' | 'target-score' | 'target-pairs' | 'target-number';
  targetValue?: number; // e.g. score to reach or number of pairs or specific digit
  targetDigit?: number; // for 'target-number' mode (e.g. match all 7s)
  maxAdds?: number; // optional constraint on '+' additions
  timeLimit?: number; // seconds (optional)
  starThresholds: [number, number, number]; // scores or conditions for 1, 2, 3 stars
}

export interface MatchPairResult {
  cell1: CellData;
  cell2: CellData;
  matchType: 'equal' | 'sum10';
  points: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  totalPairsMatched: number;
  highScore: number;
  maxCombo: number;
  completedLevels: Record<number, number>; // levelId -> stars (1-3)
  dailyCompleted: Record<string, { score: number; date: string }>;
  boosters: {
    hints: number;
    shuffles: number;
    erasers: number;
    bombs: number;
  };
}

export interface MoveHistory {
  cells: CellData[];
  score: number;
  activeBooster: string | null;
  pairsMatched: number;
}

export type Language = 'ru' | 'en';
