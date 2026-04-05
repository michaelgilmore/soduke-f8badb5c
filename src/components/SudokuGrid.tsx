import { Board } from '@/lib/sudoku';
import SudokuCell from './SudokuCell';

interface SudokuGridProps {
  board: Board;
  errors: boolean[][];
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
}

export default function SudokuGrid({ board, errors, selectedCell, onCellClick }: SudokuGridProps) {
  const selectedValue = selectedCell ? board[selectedCell[0]][selectedCell[1]].value : null;

  return (
    <div className="border-2 border-grid-border rounded-lg overflow-hidden shadow-lg w-full max-w-[min(90vw,28rem)] aspect-square mx-auto">
      <div className="grid grid-cols-9 grid-rows-9 w-full h-full">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
            const isHighlighted = selectedCell !== null && (
              selectedCell[0] === r || selectedCell[1] === c ||
              (Math.floor(selectedCell[0] / 3) === Math.floor(r / 3) &&
               Math.floor(selectedCell[1] / 3) === Math.floor(c / 3))
            );
            const isSameValue = selectedValue !== null && cell.value === selectedValue;

            return (
              <SudokuCell
                key={`${r}-${c}`}
                cell={cell}
                row={r}
                col={c}
                isSelected={isSelected}
                isHighlighted={isHighlighted && !isSelected}
                isError={errors[r][c]}
                isSameValue={isSameValue && !isSelected && !isHighlighted}
                onClick={() => onCellClick(r, c)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
