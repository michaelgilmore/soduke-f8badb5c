import { cn } from '@/lib/utils';

interface NumberPadProps {
  onNumber: (n: number) => void;
  onErase: () => void;
  onNoteToggle: () => void;
  notesMode: boolean;
  counts: Record<number, number>;
}

export default function NumberPad({ onNumber, onErase, onNoteToggle, notesMode, counts }: NumberPadProps) {
  return (
    <div className="w-full max-w-[min(90vw,28rem)] mx-auto space-y-2">
      <div className="grid grid-cols-9 gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button
            key={n}
            onClick={() => onNumber(n)}
            disabled={counts[n] >= 9}
            className={cn(
              'aspect-[3/4] sm:aspect-square rounded-md font-puzzle text-lg sm:text-xl font-semibold transition-all',
              'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground',
              'active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed',
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onErase}
          className="flex-1 py-2.5 rounded-md font-body text-sm font-medium bg-secondary text-secondary-foreground hover:bg-destructive hover:text-primary-foreground transition-all active:scale-95"
        >
          Erase
        </button>
        <button
          onClick={onNoteToggle}
          className={cn(
            'flex-1 py-2.5 rounded-md font-body text-sm font-medium transition-all active:scale-95',
            notesMode
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          Notes {notesMode ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
}
