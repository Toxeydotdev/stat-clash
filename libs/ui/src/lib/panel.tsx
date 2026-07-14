import type { ComponentProps } from 'react';
import { cn } from './cn';

export type PanelProps = ComponentProps<'section'>;

export function Panel({ className, ...props }: PanelProps) {
  return (
    <section
      className={cn(
        'border border-white/12 bg-panel/90 [clip-path:polygon(0_0,calc(100%_-_18px)_0,100%_18px,100%_100%,18px_100%,0_calc(100%_-_18px))]',
        className,
      )}
      {...props}
    />
  );
}
