import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// shadcn's class-name helper: clsx for conditional classes,
// tailwind-merge so later Tailwind classes win on conflict.
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
