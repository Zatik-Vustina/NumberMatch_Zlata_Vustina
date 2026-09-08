import { CellData, LevelConfig, MatchPairResult } from '../types';

export const COLS = 9;

/**
 * Classic initial numbers 1-19 without zero:
 * 1 2 3 4 5 6 7 8 9
 * 1 1 1 2 1 3 1 4 1 5
 * 1 6 1 7 1 8 1 9
 * (Total 27 cells)
 */
export const CLASSIC_NUMBERS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,
  1, 1, 1, 2, 1, 3, 1, 4, 1, 5,
  1, 6, 1, 7, 1, 8, 1, 9,
];

/**
 * Converts a raw list of numbers into CellData array
 */
export function buildCellsFromNumbers(numbers: number[]): CellData[] {
  return numbers.map((val, idx) => ({
    id: `cell-${idx}-${val}-${Math.random().toString(36).substr(2, 6)}`,
    value: val,
    isCleared: false,
    row: Math.floor(idx / COLS),
    col: idx % COLS,
    index: idx,
  }));
}

/**
 * Re-indexes cells after additions or removals to maintain row/col consistency
 */
export function reindexCells(cells: CellData[]): CellData[] {
  return cells.map((cell, idx) => ({
    ...cell,
    row: Math.floor(idx / COLS),
    col: idx % COLS,
    index: idx,
  }));
}

/**
 * Checks if two cells have matching values (equal or sum to 10)
 */
export function areValuesMatch(val1: number, val2: number): boolean {
  return val1 === val2 || val1 + val2 === 10;
}

/**
 * Checks if two cells are validly adjacent on the Number Match board:
 * 1. 1D Reading Order (Horizontal & Line wrap-around)
 * 2. Vertical Column alignment
 * 3. Diagonal alignment
 */
export function isValidMatch(cells: CellData[], idx1: number, idx2: number): boolean {
  if (idx1 === idx2) return false;
  if (idx1 < 0 || idx1 >= cells.length || idx2 < 0 || idx2 >= cells.length) return false;

  const cell1 = cells[idx1];
  const cell2 = cells[idx2];

  if (!cell1 || !cell2) return false;
  if (cell1.isCleared || cell2.isCleared) return false;

  // Check value condition
  if (!areValuesMatch(cell1.value, cell2.value)) return false;

  const minIdx = Math.min(idx1, idx2);
  const maxIdx = Math.max(idx1, idx2);

  // 1. Reading Order Check (1D sequence with only cleared cells in between)
  let isSeqClear = true;
  for (let i = minIdx + 1; i < maxIdx; i++) {
    if (!cells[i].isCleared) {
      isSeqClear = false;
      break;
    }
  }
  if (isSeqClear) return true;

  // 2. Vertical Column Check
  const col1 = cell1.col;
  const col2 = cell2.col;
  const row1 = cell1.row;
  const row2 = cell2.row;

  if (col1 === col2) {
    const minRow = Math.min(row1, row2);
    const maxRow = Math.max(row1, row2);
    let isVertClear = true;

    for (let r = minRow + 1; r < maxRow; r++) {
      const intermediateIdx = r * COLS + col1;
      if (intermediateIdx < cells.length && !cells[intermediateIdx].isCleared) {
        isVertClear = false;
        break;
      }
    }
    if (isVertClear) return true;
  }

  // 3. Diagonal Check
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);

  if (rowDiff === colDiff && rowDiff > 0) {
    const rowStep = row2 > row1 ? 1 : -1;
    const colStep = col2 > col1 ? 1 : -1;
    let isDiagClear = true;

    for (let step = 1; step < rowDiff; step++) {
      const curRow = row1 + step * rowStep;
      const curCol = col1 + step * colStep;
      const intermediateIdx = curRow * COLS + curCol;

      if (intermediateIdx < cells.length && !cells[intermediateIdx].isCleared) {
        isDiagClear = false;
        break;
      }
    }
    if (isDiagClear) return true;
  }

  return false;
}

/**
 * Finds all available valid matching pairs on the current board
 */
export function findAvailablePairs(cells: CellData[]): { idx1: number; idx2: number }[] {
  const pairs: { idx1: number; idx2: number }[] = [];
  const activeIndices: number[] = [];

  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].isCleared) {
      activeIndices.push(i);
    }
  }

  for (let i = 0; i < activeIndices.length; i++) {
    for (let j = i + 1; j < activeIndices.length; j++) {
      const idx1 = activeIndices[i];
      const idx2 = activeIndices[j];

      if (isValidMatch(cells, idx1, idx2)) {
        pairs.push({ idx1, idx2 });
      }
    }
  }

  return pairs;
}

/**
 * Adds numbers: Duplicates all currently active (uncleared) numbers
 * and appends them to the bottom of the board
 */
export function addActiveNumbers(cells: CellData[]): CellData[] {
  const activeValues = cells.filter(c => !c.isCleared).map(c => c.value);
  if (activeValues.length === 0) return cells;

  const currentLength = cells.length;
  const newCells: CellData[] = activeValues.map((val, i) => {
    const newIdx = currentLength + i;
    return {
      id: `cell-add-${newIdx}-${val}-${Math.random().toString(36).substr(2, 6)}`,
      value: val,
      isCleared: false,
      row: Math.floor(newIdx / COLS),
      col: newIdx % COLS,
      index: newIdx,
    };
  });

  return [...cells, ...newCells];
}

/**
 * Shuffles only the active numbers on the board
 */
export function shuffleActiveCells(cells: CellData[]): CellData[] {
  const activeCells = cells.filter(c => !c.isCleared);
  const activeValues = activeCells.map(c => c.value);

  // Fisher-Yates shuffle
  for (let i = activeValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [activeValues[i], activeValues[j]] = [activeValues[j], activeValues[i]];
  }

  let activeValIdx = 0;
  return cells.map(cell => {
    if (cell.isCleared) return cell;
    const newVal = activeValues[activeValIdx++];
    return {
      ...cell,
      value: newVal,
    };
  });
}

/**
 * Checks for completely cleared rows
 */
export function getClearedRowIndices(cells: CellData[]): number[] {
  const totalRows = Math.ceil(cells.length / COLS);
  const clearedRows: number[] = [];

  for (let r = 0; r < totalRows; r++) {
    const startIdx = r * COLS;
    const endIdx = Math.min(startIdx + COLS, cells.length);
    let rowAllCleared = true;

    for (let i = startIdx; i < endIdx; i++) {
      if (!cells[i].isCleared) {
        rowAllCleared = false;
        break;
      }
    }

    if (rowAllCleared && endIdx > startIdx) {
      clearedRows.push(r);
    }
  }

  return clearedRows;
}

/**
 * Checks if the board is completely cleared
 */
export function isBoardCleared(cells: CellData[]): boolean {
  return cells.length > 0 && cells.every(c => c.isCleared);
}

/**
 * Generates a random daily puzzle seed based on a date string YYYY-MM-DD
 */
export function generateDailyBoard(dateStr: string): number[] {
  // Simple deterministic PRNG from date string
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed * 31 + dateStr.charCodeAt(i)) % 2147483647;
  }

  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const numbers: number[] = [];

  // Generate 27-36 balanced numbers
  const count = 27;
  for (let i = 0; i < count; i++) {
    const val = Math.floor(random() * 9) + 1;
    numbers.push(val);
  }

  // Ensure some guaranteed pairs exist in sequence
  for (let i = 0; i < 4; i++) {
    const pos = Math.floor(random() * (numbers.length - 1));
    if (random() > 0.5) {
      numbers[pos + 1] = numbers[pos]; // equal pair
    } else {
      numbers[pos + 1] = 10 - numbers[pos]; // sum to 10 pair
    }
  }

  return numbers;
}

/**
 * Curated levels for Journey / Levels mode
 */
export const GAME_LEVELS: LevelConfig[] = [
  {
    id: 1,
    titleRu: 'Уровень 1: Первые пары',
    titleEn: 'Level 1: First Pairs',
    descriptionRu: 'Найдите одинаковые числа и пары, дающие в сумме 10',
    descriptionEn: 'Match identical numbers or pairs that sum to 10',
    initialNumbers: [
      1, 1, 2, 8, 3, 7, 4, 6, 5,
      5, 9, 1, 8, 2, 7, 3, 6, 4,
    ],
    targetType: 'clear-all',
    starThresholds: [200, 350, 500],
  },
  {
    id: 2,
    titleRu: 'Уровень 2: Диагонали и переходы',
    titleEn: 'Level 2: Diagonals & Wraps',
    descriptionRu: 'Соединяйте числа по вертикали и через конец строки',
    descriptionEn: 'Match numbers vertically and across row wraps',
    initialNumbers: [
      1, 2, 3, 4, 5, 6, 7, 8, 9,
      9, 8, 7, 6, 5, 4, 3, 2, 1,
      5, 5, 4, 6, 3, 7, 2, 8, 1,
    ],
    targetType: 'clear-all',
    starThresholds: [350, 550, 750],
  },
  {
    id: 3,
    titleRu: 'Уровень 3: Счастливая Семерка',
    titleEn: 'Level 3: Lucky Sevens',
    descriptionRu: 'Очистите поле, найдя все семерки и тройки',
    descriptionEn: 'Clear the board by finding 7s and 3s',
    initialNumbers: [
      7, 3, 7, 3, 7, 3, 7, 3, 7,
      3, 7, 3, 7, 3, 7, 3, 7, 3,
      1, 9, 2, 8, 4, 6, 5, 5, 7,
    ],
    targetType: 'target-pairs',
    targetValue: 12,
    starThresholds: [300, 500, 700],
  },
  {
    id: 4,
    titleRu: 'Уровень 4: Классический 1-19',
    titleEn: 'Level 4: Classic 1-19',
    descriptionRu: 'Легендарная раскладка от 1 до 19',
    descriptionEn: 'The legendary standard 1 to 19 layout',
    initialNumbers: CLASSIC_NUMBERS,
    targetType: 'clear-all',
    starThresholds: [500, 800, 1200],
  },
  {
    id: 5,
    titleRu: 'Уровень 5: Охота на десятки',
    titleEn: 'Level 5: Ten Masters',
    descriptionRu: 'Соберите 15 пар, дающих в сумме 10',
    descriptionEn: 'Collect 15 pairs that sum to 10',
    initialNumbers: [
      1, 9, 2, 8, 3, 7, 4, 6, 5,
      5, 6, 4, 7, 3, 8, 2, 9, 1,
      2, 8, 4, 6, 1, 9, 3, 7, 5,
      5, 1, 9, 2, 8, 3, 7, 4, 6,
    ],
    targetType: 'target-score',
    targetValue: 800,
    starThresholds: [500, 800, 1200],
  },
  {
    id: 6,
    titleRu: 'Уровень 6: Зеркальный лабиринт',
    titleEn: 'Level 6: Mirror Maze',
    descriptionRu: 'Симметричные ряды цифр: найдите скрытые ходы',
    descriptionEn: 'Symmetrical rows of digits: find hidden moves',
    initialNumbers: [
      9, 1, 8, 2, 5, 2, 8, 1, 9,
      7, 3, 6, 4, 5, 4, 6, 3, 7,
      3, 7, 2, 8, 5, 8, 2, 7, 3,
      1, 9, 4, 6, 5, 6, 4, 9, 1,
    ],
    targetType: 'clear-all',
    starThresholds: [600, 950, 1400],
  },
  {
    id: 7,
    titleRu: 'Уровень 7: Шахматный порядок',
    titleEn: 'Level 7: Checkerboard',
    descriptionRu: 'Чередующиеся нечетные и четные числа',
    descriptionEn: 'Alternating odd and even numbers',
    initialNumbers: [
      1, 2, 1, 2, 1, 2, 1, 2, 1,
      9, 8, 9, 8, 9, 8, 9, 8, 9,
      3, 4, 3, 4, 3, 4, 3, 4, 3,
      7, 6, 7, 6, 7, 6, 7, 6, 7,
    ],
    targetType: 'clear-all',
    starThresholds: [700, 1100, 1600],
  },
  {
    id: 8,
    titleRu: 'Уровень 8: Магическая пятерка',
    titleEn: 'Level 8: High Five',
    descriptionRu: 'Множество пятерок создают быстрые цепочки',
    descriptionEn: 'Abundance of 5s creates rapid chains',
    initialNumbers: [
      5, 5, 5, 5, 5, 5, 5, 5, 5,
      1, 9, 2, 8, 3, 7, 4, 6, 5,
      5, 4, 6, 3, 7, 2, 8, 1, 9,
      5, 5, 5, 5, 5, 5, 5, 5, 5,
    ],
    targetType: 'target-score',
    targetValue: 1000,
    starThresholds: [600, 1000, 1500],
  },
  {
    id: 9,
    titleRu: 'Уровень 9: Пирамида чисел',
    titleEn: 'Level 9: Number Pyramid',
    descriptionRu: 'Очистите пирамиду с минимальным числом добавлений',
    descriptionEn: 'Clear the pyramid with minimum additions',
    initialNumbers: [
      1, 2, 3, 4, 5, 4, 3, 2, 1,
      2, 3, 4, 5, 6, 5, 4, 3, 2,
      3, 4, 5, 6, 7, 6, 5, 4, 3,
      4, 5, 6, 7, 8, 7, 6, 5, 4,
    ],
    targetType: 'clear-all',
    starThresholds: [800, 1300, 1800],
  },
  {
    id: 10,
    titleRu: 'Уровень 10: Гранд-Мастер',
    titleEn: 'Level 10: Grand Master',
    descriptionRu: 'Большое испытание для истинного мастера чисел',
    descriptionEn: 'A grand challenge for the true numbers master',
    initialNumbers: [
      9, 8, 7, 6, 5, 4, 3, 2, 1,
      1, 1, 2, 2, 3, 3, 4, 4, 5,
      5, 6, 6, 7, 7, 8, 8, 9, 9,
      1, 9, 2, 8, 3, 7, 4, 6, 5,
      5, 4, 6, 3, 7, 2, 8, 1, 9,
    ],
    targetType: 'clear-all',
    starThresholds: [1000, 1600, 2400],
  },
];
