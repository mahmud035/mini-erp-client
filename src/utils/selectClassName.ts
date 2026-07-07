/**
 * Shared class string for native `<select>`s, matched to the `Input` primitive
 * (slate-200 resting border, indigo focus ring). `appearance-none` + `pr-8`
 * hide the OS arrow and leave room for a `ChevronDown` icon rendered on top —
 * the control stays a native `<select>` (no dependency, no behavior change).
 */
export const selectClassName =
  'h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent py-1 pr-8 pl-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30'
