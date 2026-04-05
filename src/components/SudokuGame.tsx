import { useState, useEffect, useCallback } from 'react';
import { generatePuzzle, checkErrors, isBoardComplete, Board, Difficulty, Cell } from '@/lib/sudoku';
import SudokuGrid from './SudokuGrid';
import NumberPad from './NumberPad';
import { cn } from '@/lib/utils';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

function cloneBoard(board: Board): Board {
  return board.map(row => row.map(cell => ({ ...cell, notes: new Set(cell.notes) })));
}

export default function SudokuGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [board, setBoard] = useState<Board>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<boolean[][]>(Array.from({ length: 9 }, () => Array(9).fill(false)));
  const [notesMode, setNotesMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [won, setWon] = useState(false);

  const startNewGame = useCallback((diff: Difficulty) => {
    const { board: b, solution: s } = generatePuzzle(diff);
    setBoard(b);
    setSolution(s);
    setSelectedCell(null);
    setErrors(Array.from({ length: 9 }, () => Array(9).fill(false)));
    setNotesMode(false);
    setTimer(0);
    setIsRunning(true);
    setWon(false);
    setDifficulty(diff);
  }, []);

  useEffect(() => { startNewGame('easy'); }, [startNewGame]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleNumber = useCallback((n: number) => {
    if (!selectedCell || won) return;
    const [r, c] = selectedCell;
    if (board[r][c].given) return;

    const newBoard = cloneBoard(board);
    if (notesMode) {
      newBoard[r][c].value = null;
      const notes = newBoard[r][c].notes;
      if (notes.has(n)) notes.delete(n); else notes.add(n);
    } else {
      newBoard[r][c].value = n;
      newBoard[r][c].notes = new Set();
    }
    setBoard(newBoard);
    setErrors(checkErrors(newBoard, solution));

    if (!notesMode && isBoardComplete(newBoard, solution)) {
      setWon(true);
      setIsRunning(false);
    }
  }, [selectedCell, board, solution, notesMode, won]);

  const handleErase = useCallback(() => {
    if (!selectedCell || won) return;
    const [r, c] = selectedCell;
    if (board[r][c].given) return;
    const newBoard = cloneBoard(board);
    newBoard[r][c].value = null;
    newBoard[r][c].notes = new Set();
    setBoard(newBoard);
    setErrors(checkErrors(newBoard, solution));
  }, [selectedCell, board, solution, won]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const n = parseInt(e.key);
      if (n >= 1 && n <= 9) { handleNumber(n); return; }
      if (e.key === 'Backspace' || e.key === 'Delete') { handleErase(); return; }
      if (e.key === 'n' || e.key === 'N') { setNotesMode(m => !m); return; }
      if (!selectedCell) return;
      const [r, c] = selectedCell;
      if (e.key === 'ArrowUp' && r > 0) setSelectedCell([r - 1, c]);
      if (e.key === 'ArrowDown' && r < 8) setSelectedCell([r + 1, c]);
      if (e.key === 'ArrowLeft' && c > 0) setSelectedCell([r, c - 1]);
      if (e.key === 'ArrowRight' && c < 8) setSelectedCell([r, c + 1]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedCell, handleNumber, handleErase]);

  const counts: Record<number, number> = {};
  for (let n = 1; n <= 9; n++) {
    counts[n] = board.flat().filter(cell => cell.value === n).length;
  }

  if (board.length === 0) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-6 sm:py-10 font-body">
      <h1 className="font-display text-3xl sm:text-4xl text-foreground mb-1">Sudoku</h1>
      <p className="text-muted-foreground text-sm mb-6">A classic number puzzle</p>

      {/* Difficulty + Timer */}
      <div className="flex items-center gap-4 mb-5 flex-wrap justify-center">
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => startNewGame(d)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all',
                d === difficulty
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <span className="font-puzzle text-lg text-foreground tabular-nums">{formatTime(timer)}</span>
      </div>

      {won && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium text-center animate-in fade-in">
          🎉 Congratulations! Solved in {formatTime(timer)}
        </div>
      )}

      <SudokuGrid
        board={board}
        errors={errors}
        selectedCell={selectedCell}
        onCellClick={(r, c) => setSelectedCell([r, c])}
      />

      <div className="mt-5">
        <NumberPad
          onNumber={handleNumber}
          onErase={handleErase}
          onNoteToggle={() => setNotesMode(m => !m)}
          notesMode={notesMode}
          counts={counts}
        />
      </div>

      <button
        onClick={() => startNewGame(difficulty)}
        className="mt-5 px-6 py-2.5 rounded-lg bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity active:scale-95"
      >
        New Game
      </button>
    </div>
  );
}
