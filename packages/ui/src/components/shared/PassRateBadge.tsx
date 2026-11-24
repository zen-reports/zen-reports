export interface PassRateBadgeProps {
  passRate: number | null;
  className?: string;
}

/**
 * Renders a color-coded percentage badge for test pass rates (Green >= 90%, Amber >= 60%, Red < 60%).
 *
 * @param props - Component properties containing passRate and optional className.
 * @returns Color-coded pass rate badge element or placeholder when null.
 */
export function PassRateBadge({ passRate, className = '' }: PassRateBadgeProps) {
  if (passRate === null) return <span>-</span>;

  const colorClass =
    passRate >= 90
      ? 'bg-success-50 text-success-700 ring-1 ring-success-600/20 dark:bg-success-500/20 dark:text-success-500 dark:ring-1 dark:ring-success-500/30'
      : passRate >= 60
        ? 'bg-warning-50 text-warning-700 ring-1 ring-warning-600/20 dark:bg-warning-500/20 dark:text-warning-500 dark:ring-1 dark:ring-warning-500/30'
        : 'bg-red-50 text-red-700 ring-1 ring-red-600/20 dark:bg-red-500/20 dark:text-red-400 dark:ring-1 dark:ring-red-500/40';

  return (
    <span className={`inline-block px-2 py-0.5 rounded font-bold ${colorClass} ${className}`}>
      {passRate}%
    </span>
  );
}

export default PassRateBadge;
