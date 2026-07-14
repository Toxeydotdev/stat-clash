import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from './cn';

const badgeVariants = cva(
  'inline-flex min-h-6 items-center gap-1.5 border px-2 py-1 font-mono text-[0.625rem] font-bold uppercase tracking-[0.14em]',
  {
    variants: {
      tone: {
        neutral: 'border-white/15 bg-white/[0.04] text-ink-muted',
        cyan: 'border-clash-cyan/40 bg-clash-cyan/10 text-clash-cyan',
        magenta: 'border-clash-magenta/40 bg-clash-magenta/10 text-clash-magenta',
        acid: 'border-clash-acid/40 bg-clash-acid/10 text-clash-acid',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
);

export interface BadgeProps
  extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
