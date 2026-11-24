import { useMemo, useState } from 'react';
import LearnMoreButton from '@/components/shared/LearnMoreButton';
import { ColumnDef, DataTable } from '@/components/shared/DataTable';
import { PassRateBadge } from '@/components/shared/PassRateBadge';
import { StatusCountBadge } from '@/components/shared/StatusCountBadge';
import { formatDateLocal, formatDateParts, generateExportFilename } from '@zen-reports/zen-core';
import type { HistoryData } from '@zen-reports/zen-core';
import { computePassRate } from '@zen-reports/zen-core';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from 'recharts';
import { renderTrendTick } from './TrendTick';

interface PassRateTrendProps {
  history: HistoryData;
  onOpenGuide?: () => void;
}

const sectionClass = 'rounded-md border border-border-default bg-surface-50 p-5 shadow-xs';
const headingClass = 'text-lg font-bold text-text-ink dark:text-text-on-primary';

/**
 * Renders the tooltip content for the pass rate trend chart.
 *
 * @param props - Tooltip properties provided by Recharts.
 * @returns Formatted tooltip JSX element or null if inactive.
 */
const renderTrendTooltip = (props: TooltipContentProps) => {
  const { active, payload, label } = props;
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const rawItem = payload[0]?.payload as { run_name?: string } | undefined;
  const runName = rawItem?.run_name;
  const [dateLine, timeLine] = formatDateParts(String(label));
  const rate = payload[0]?.value;
  return (
    <div className="p-2.5 text-text-ink dark:text-text-on-primary">
      {runName && <div className="font-bold text-xs">{runName}</div>}
      <div
        className={`text-[11px] text-text-body-mid dark:text-text-muted ${
          runName ? 'mt-0.5' : 'font-bold text-xs'
        }`}
      >
        {dateLine}
        {timeLine ? ` · ${timeLine}` : ''}
      </div>
      <div className="mt-1.5 text-xs font-medium">
        Pass rate:{' '}
        <span className="font-bold text-success-600 dark:text-success-500">
          {rate != null ? `${rate}%` : 'N/A'}
        </span>
      </div>
    </div>
  );
};

/**
 * Visualizes pass rate trends across historical test runs and provides an expandable data table.
 *
 * @param props - Component properties containing history run data and guide toggle.
 * @returns Pass rate trend chart and collapsible tabular data view.
 */
export default function PassRateTrend({ history, onOpenGuide }: PassRateTrendProps) {
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [hoveredRunId, setHoveredRunId] = useState<string | null>(null);

  const chartRuns = useMemo(
    () =>
      (history.runs || []).slice(-15).map((run) => ({
        ...run,
        pass_rate: computePassRate({
          total: run.run_total,
          passed: run.run_passed,
          flaky: run.run_flaky ?? 0,
          failed: run.run_failed,
          timedOut: run.run_timed_out,
          skipped: run.run_skipped,
          interrupted: run.run_interrupted,
          duration: run.run_duration_ms,
        }),
      })),
    [history.runs]
  );

  const tableRuns = useMemo(() => [...chartRuns].reverse(), [chartRuns]);

  const columns: ColumnDef<(typeof chartRuns)[0]>[] = useMemo(
    () => [
      {
        key: 'run_name',
        header: 'Run Name',
        className: 'font-semibold text-text-ink dark:text-text-on-primary',
        cell: (run) => run.run_name || run.run_id,
        csvValue: (run) => run.run_name || run.run_id,
      },
      {
        key: 'branch',
        header: 'Branch',
        className: 'text-text-body-mid dark:text-text-muted',
        cell: (run) =>
          run.git_branch ? (
            <span
              className="block max-w-28 truncate"
              title={`Branch: ${run.git_branch}${run.git_commit ? ` (${run.git_commit})` : ''}`}
            >
              {run.git_branch}
            </span>
          ) : (
            <span className="text-text-muted-soft dark:text-text-muted">—</span>
          ),
        csvValue: (run) => run.git_branch ?? '',
      },
      {
        key: 'commit',
        header: 'Commit',
        className: 'text-text-body-mid dark:text-text-muted',
        cell: (run) =>
          run.git_commit ? (
            <code className="font-mono text-[11px]" title={run.git_commit_full || run.git_commit}>
              {run.git_commit.slice(0, 7)}
            </code>
          ) : (
            <span className="text-text-muted-soft dark:text-text-muted">—</span>
          ),
        csvValue: (run) => run.git_commit ?? '',
      },
      {
        key: 'started_at',
        header: 'Start Time',
        cell: (run) => formatDateLocal(run.started_at),
        csvValue: (run) => formatDateLocal(run.started_at),
      },
      {
        key: 'total',
        header: 'Tests',
        align: 'center',
        cell: (run) => run.run_total,
        csvValue: (run) => run.run_total,
      },
      {
        key: 'passed',
        header: 'Passed',
        align: 'center',
        cell: (run) => <StatusCountBadge count={run.run_passed} type="passed" />,
        csvValue: (run) => run.run_passed,
      },
      {
        key: 'flaky',
        header: 'Flaky',
        align: 'center',
        cell: (run) => <StatusCountBadge count={run.run_flaky ?? 0} type="flaky" />,
        csvValue: (run) => run.run_flaky ?? 0,
      },
      {
        key: 'failed',
        header: 'Failed',
        align: 'center',
        cell: (run) => <StatusCountBadge count={run.run_failed} type="failed" />,
        csvValue: (run) => run.run_failed,
      },
      {
        key: 'skipped',
        header: 'Skipped',
        align: 'center',
        cell: (run) => <StatusCountBadge count={run.run_skipped} type="skipped" />,
        csvValue: (run) => run.run_skipped,
      },
      {
        key: 'timed_out',
        header: 'Timed Out',
        align: 'center',
        cell: (run) => <StatusCountBadge count={run.run_timed_out} type="timedOut" />,
        csvValue: (run) => run.run_timed_out,
      },
      {
        key: 'interrupted',
        header: 'Interrupted',
        align: 'center',
        cell: (run) => <StatusCountBadge count={run.run_interrupted} type="interrupted" />,
        csvValue: (run) => run.run_interrupted,
      },
      {
        key: 'pass_rate',
        header: 'Pass Rate',
        align: 'right',
        cell: (run) => <PassRateBadge passRate={run.pass_rate} />,
        csvValue: (run) => `${run.pass_rate}%`,
      },
    ],
    []
  );

  return (
    <section className={sectionClass}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className={headingClass}>Pass rate trend</h2>
            {onOpenGuide && <LearnMoreButton onClick={onOpenGuide} />}
          </div>
          <p className="mt-1 text-xs text-text-body-mid dark:text-text-muted">
            Track overall test suite pass rate stability and regression trends across historical
            runs
            {history.runs.length > 15 ? ' (showing the 15 most recent runs)' : ''}
          </p>
        </div>
      </div>
      {chartRuns.length < 2 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center rounded-md border border-dashed border-border-default bg-surface-100/50 p-6 space-y-2 mt-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-200 border border-border-default text-text-body-mid dark:text-text-muted">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          </div>
          <p className="text-xs font-semibold text-text-ink dark:text-text-on-primary">
            Historical trend chart requires at least 2 test runs
          </p>
          <p className="text-[11px] text-text-body-mid dark:text-text-muted max-w-md">
            Execute future runs and run{' '}
            <code className="rounded bg-surface-200 px-1.5 py-0.5 font-mono text-[10px] text-text-ink dark:text-text-on-primary border border-border-default">
              npx zr history report
            </code>{' '}
            to visualize pass rate trends across runs over time.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <ResponsiveContainer width="100%" height={256}>
            <LineChart
              data={chartRuns}
              margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
              onMouseMove={(state) => {
                if (state.isTooltipActive && state.activeIndex != null) {
                  const idx = Number(state.activeIndex);
                  if (Number.isInteger(idx) && chartRuns[idx]) {
                    setHoveredRunId(chartRuns[idx].run_id);
                  }
                }
              }}
              onMouseLeave={() => setHoveredRunId(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-chart)" />
              <XAxis
                dataKey="started_at"
                fontSize={11}
                height={48}
                interval={0}
                tick={renderTrendTick}
              />
              <YAxis
                domain={[0, 100]}
                fontSize={11}
                fontWeight={500}
                tick={{ fill: 'var(--color-text-ink)' }}
                unit="%"
              />
              {hoveredRunId && (
                <ReferenceLine
                  x={chartRuns.find((r) => r.run_id === hoveredRunId)?.started_at}
                  stroke="var(--color-accent-blue)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              )}
              <Tooltip
                content={renderTrendTooltip}
                cursor={{
                  stroke: 'var(--color-accent-blue)',
                  strokeWidth: 2,
                  strokeDasharray: '4 4',
                }}
                wrapperStyle={{
                  backgroundColor: 'var(--color-canvas)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: '0.5rem',
                  boxShadow:
                    '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.25)',
                  outline: 'none',
                }}
              />
              <Line
                type="monotone"
                dataKey="pass_rate"
                stroke="var(--color-success-500)"
                strokeWidth={2.5}
                dot={(dotProps) => {
                  const { cx, cy, payload } = dotProps;
                  if (cx == null || cy == null) return <g key={dotProps.key} />;
                  const isHovered = payload?.run_id === hoveredRunId;
                  return (
                    <circle
                      key={dotProps.key}
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 7 : 4}
                      fill="var(--color-success-500)"
                      stroke={isHovered ? 'var(--color-accent-blue)' : 'var(--color-surface-50)'}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      className="transition-all duration-150"
                    />
                  );
                }}
                activeDot={{
                  r: 7,
                  fill: 'var(--color-success-500)',
                  stroke: 'var(--color-surface-50)',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>

          <details
            open={isTableOpen}
            onToggle={(e) => setIsTableOpen(e.currentTarget.open)}
            className="group overflow-hidden rounded-md border border-border-default bg-surface-100/40 transition-colors"
          >
            <summary className="flex cursor-pointer select-none items-center justify-between p-3 text-xs font-semibold text-text-ink transition-colors hover:bg-surface-100 dark:text-text-on-primary">
              <div className="flex items-center gap-2">
                <svg
                  className={`h-4 w-4 text-text-body-mid transition-transform duration-200 ${
                    isTableOpen ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span>{isTableOpen ? 'Hide run history' : 'Show run history'}</span>
                <span className="rounded-full bg-surface-200 px-2 py-0.5 text-[10px] font-medium text-text-body-mid dark:text-text-muted">
                  {chartRuns.length} runs
                </span>
              </div>
            </summary>
            <div className="border-t border-border-default p-3 pt-2">
              <DataTable
                data={tableRuns}
                columns={columns}
                getRowKey={(run) => run.run_id}
                getRowClassName={(run) =>
                  run.run_id === hoveredRunId
                    ? 'bg-accent-blue/15 dark:bg-accent-blue/25 ring-1 ring-inset ring-accent-blue/40'
                    : ''
                }
                onRowMouseEnter={(run) => setHoveredRunId(run.run_id)}
                onRowMouseLeave={() => setHoveredRunId(null)}
                compact
                exportFilename={() => generateExportFilename('pass_rate_trend')}
              />
            </div>
          </details>
        </div>
      )}
    </section>
  );
}
