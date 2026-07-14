import * as Tooltip from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';

export const HintProvider = Tooltip.Provider;

export interface HintProps {
  children: ReactNode;
  content: ReactNode;
}

export function Hint({ children, content }: HintProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="z-50 max-w-64 border border-clash-cyan/40 bg-void px-3 py-2 font-mono text-[0.6875rem] leading-relaxed text-ink-soft shadow-[4px_4px_0_rgba(31,232,255,0.16)]"
          sideOffset={8}
        >
          {content}
          <Tooltip.Arrow className="fill-clash-cyan/40" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
