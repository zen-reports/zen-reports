import { STATUS_BADGE_STYLE_MAP, type StatusType } from '@zen-reports/zen-core';

const STATUS_PILL_LABELS: Record<string, string> = {
  passed: 'Passed',
  failed: 'Failed',
  timedOut: 'Timed Out',
  interrupted: 'Interrupted',
  skipped: 'Skipped',
  flaky: 'Flaky',
};

/**
 * Renders a colored pill for a test status such as passed, failed, timedOut, interrupted, or skipped.
 *
 * @param props - object with `status` (status key to render), optional `tooltip` (tooltip text shown on hover), and optional `className` (extra CSS classes).
 * @returns a colored status pill.
 */
export function StatusPill({
  status,
  tooltip,
  className = '',
}: {
  status: string;
  tooltip?: string;
  className?: string;
}) {
  const label = STATUS_PILL_LABELS[status] ?? status;
  const badgeClass =
    STATUS_BADGE_STYLE_MAP[status as StatusType] ??
    'bg-slate-200/80 text-slate-800 ring-1 ring-slate-300 dark:bg-slate-700/60 dark:text-slate-200 dark:ring-slate-600';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass} ${className}`}
      title={tooltip}
    >
      {label}
    </span>
  );
}
