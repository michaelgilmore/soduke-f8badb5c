export type Difficulty = 'easy' | 'medium' | 'hard';

export type CellValue = number | null;

export interface Cell {
  value: CellValue;
  given: boolean;
  notes: Set<number>;
}

export type Board = Cell[][];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isValid(grid: (number | null)[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }
  return true;
}

function solve(grid: (number | null)[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === null) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const n of nums) {
          if (isValid(grid, r, c, n)) {
            grid[r][c] = n;
            if (solve(grid)) return true;
            grid[r][c] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function generatePuzzle(difficulty: Difficulty): { board: Board; solution: number[][] } {
  const grid: (number | null)[][] = Array.from({ length: 9 }, () => Array(9).fill(null));
  solve(grid);
  
  const solution = grid.map(row => row.map(v => v!));
  
  const clues: Record<Difficulty, number> = { easy: 42, medium: 32, hard: 24 };
  const totalToRemove = 81 - clues[difficulty];
  
  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9] as [number, number])
  );
  
  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= totalToRemove) break;
    grid[r][c] = null;
    removed++;
  }
  
  const board: Board = grid.map((row, r) =>
    row.map((val, c) => ({
      value: val,
      given: val !== null,
      notes: new Set<number>(),
    }))
  );
  
  return { board, solution };
}

export function checkErrors(board: Board, solution: number[][]): boolean[][] {
  return board.map((row, r) =>
    row.map((cell, c) => {
      if (cell.value === null || cell.given) return false;
      return cell.value !== solution[r][c];
    })
  );
}

export function isBoardComplete(board: Board, solution: number[][]): boolean {
  return board.every((row, r) =>
    row.every((cell, c) => cell.value === solution[r][c])
  );
}
