import * as Avatar from '@radix-ui/react-avatar';
import { cn } from './cn';

export type PlayerAccent = 'cyan' | 'magenta';

export interface PlayerAvatarProps {
  accent: PlayerAccent;
  initials: string;
  label: string;
}

export function PlayerAvatar({ accent, initials, label }: PlayerAvatarProps) {
  return (
    <Avatar.Root
      aria-label={label}
      className={cn(
        'grid size-16 shrink-0 place-items-center border bg-void font-display text-xl font-black tracking-[-0.04em] sm:size-20 sm:text-2xl',
        accent === 'cyan'
          ? 'border-clash-cyan text-clash-cyan shadow-[5px_5px_0_rgba(31,232,255,0.18)]'
          : 'border-clash-magenta text-clash-magenta shadow-[5px_5px_0_rgba(255,54,209,0.18)]',
      )}
    >
      <Avatar.Fallback delayMs={0}>{initials}</Avatar.Fallback>
    </Avatar.Root>
  );
}
