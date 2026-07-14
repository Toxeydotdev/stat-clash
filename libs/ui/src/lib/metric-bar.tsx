import { cn } from './cn';

export interface MetricBarProps {
  label: string;
  leftLabel: string;
  leftValue: string;
  leftWeight: number;
  rightLabel: string;
  rightValue: string;
  rightWeight: number;
  winner: 'left' | 'right' | 'tie';
}

export function MetricBar({
  label,
  leftLabel,
  leftValue,
  leftWeight,
  rightLabel,
  rightValue,
  rightWeight,
  winner,
}: MetricBarProps) {
  return (
    <div className="grid gap-3 border-t border-white/[0.08] py-5 first:border-t-0">
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <div>
          <span className="sr-only">{leftLabel}: </span>
          <span className="font-display text-xl font-bold text-white sm:text-2xl">
            {leftValue}
          </span>
          {winner === 'left' ? (
            <span className="ml-2 font-mono text-[0.5625rem] font-bold text-clash-cyan">
              EDGE
            </span>
          ) : null}
        </div>
        <h3 className="pb-1 text-center font-mono text-[0.625rem] font-bold uppercase tracking-[0.16em] text-ink-muted">
          {label}
        </h3>
        <div className="text-right">
          {winner === 'right' ? (
            <span className="mr-2 font-mono text-[0.5625rem] font-bold text-clash-magenta">
              EDGE
            </span>
          ) : null}
          <span className="sr-only">{rightLabel}: </span>
          <span className="font-display text-xl font-bold text-white sm:text-2xl">
            {rightValue}
          </span>
        </div>
      </div>

      <div aria-hidden="true" className="grid grid-cols-2 gap-1">
        <div className="flex h-1.5 justify-end bg-white/[0.05]">
          <span
            className={cn(
              'h-full bg-clash-cyan transition-[width] duration-500',
              winner !== 'left' && 'opacity-35',
            )}
            style={{ width: `${leftWeight}%` }}
          />
        </div>
        <div className="h-1.5 bg-white/[0.05]">
          <span
            className={cn(
              'block h-full bg-clash-magenta transition-[width] duration-500',
              winner !== 'right' && 'opacity-35',
            )}
            style={{ width: `${rightWeight}%` }}
          />
        </div>
      </div>
    </div>
  );
}
