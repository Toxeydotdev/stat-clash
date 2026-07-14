import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from './cn';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 overflow-hidden border font-mono text-xs font-bold uppercase tracking-[0.16em] transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-45 active:translate-y-px',
  {
    variants: {
      intent: {
        primary:
          'border-clash-cyan bg-clash-cyan text-void shadow-[4px_4px_0_var(--color-clash-magenta)] hover:bg-white hover:shadow-[2px_2px_0_var(--color-clash-magenta)] focus-visible:outline-clash-cyan',
        secondary:
          'border-clash-magenta bg-clash-magenta/10 text-clash-magenta hover:bg-clash-magenta hover:text-void focus-visible:outline-clash-magenta',
        ghost:
          'border-white/15 bg-white/[0.03] text-ink-soft hover:border-clash-cyan/60 hover:text-white focus-visible:outline-clash-cyan',
      },
      size: {
        sm: 'min-h-9 px-3 py-2',
        md: 'min-h-11 px-5 py-3',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  intent,
  size,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ intent, size }), className)}
      type={type}
      {...props}
    />
  );
}
