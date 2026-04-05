import { Cell } from '@/lib/sudoku';
import { cn } from '@/lib/utils';

interface SudokuCellProps {
  cell: Cell;
  row: number;
  col: number;
  isSelected: boolean;
  isHighlighted: boolean;
  isError: boolean;
  isSameValue: boolean;
  onClick: () => void;
}

export default function SudokuCell({
  cell, row, col, isSelected, isHighlighted, isError, isSameValue, onClick,
}: SudokuCellProps) {
  const borderR = col === 2 || col === 5 ? 'border-r-2 border-r-grid-border' : 'border-r border-r-grid-border-thin';
  const borderB = row === 2 || row === 5 ? 'border-b-2 border-b-grid-border' : 'border-b border-b-grid-border-thin';

  return (
    <button
      className={cn(
        'aspect-square flex items-center justify-center font-puzzle text-lg sm:text-xl md:text-2xl transition-colors duration-100 relative select-none',
        borderR, borderB,
        isSelected && 'bg-cell-selected',
        !isSelected && isHighlighted && 'bg-cell-highlight',
        !isSelected && !isHighlighted && isSameValue && 'bg-cell-highlight/60',
        isError && 'bg-cell-error',
        cell.given ? 'text-cell-given font-bold' : 'text-cell-input font-medium',
      )}
      onClick={onClick}
      aria-label={`Row ${row + 1}, Column ${col + 1}, value ${cell.value ?? 'empty'}`}
    >
      {cell.value ? (
        cell.value
      ) : cell.notes.size > 0 ? (
        <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5 text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground leading-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <span key={n} className="flex items-center justify-center">
              {cell.notes.has(n) ? n : ''}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
}
