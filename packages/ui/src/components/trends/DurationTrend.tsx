import { useMemo, useState } from 'react';
import LearnMoreButton from '@/components/shared/LearnMoreButton';
import { ColumnDef, DataTable } from '@/components/shared/DataTable';
import {
  DISTINCT_PROJECT_COLORS,
  formatDateLocal,
  formatDateParts,
  formatDuration,
  generateExportFilename,
} from '@zen-reports/zen-core';
import type { HistoryData } from '@zen-reports/zen-core';
import {
  CartesianGrid,
  Legend,
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

interface DurationTrendProps {
  history: HistoryData;
  projectColorMap?: Record<string, string>;
  onOpenGuide?: () => void;
}

const sectionClass = 'rounded-md border border-border-default bg-surface-50 p-5 shadow-xs';
const headingClass = 'text-lg font-bold text-text-ink dark:text-text-on-primary';

/**
 * Renders the tooltip content for the duration trend chart displaying project timings.
 *
 * @param props - Tooltip properties provided by Recharts.
 * @returns Formatted tooltip JSX element or null if inactive.
 */
const renderDurationTooltip = (props: TooltipContentProps) => {
  const { active, payload, label } = props;
  if (!active || !payload || payload.length === 0) return null;
  const rawItem = payload[0]?.payload as DurationTableRow | undefined;
  const runName = rawItem?.run_name;
  const [dateLine, timeLine] = formatDateParts(String(label));
  return (
    <div className="p-2.5 text-text-ink dark:text-text-on-primary">
      {runName && <div className="font-bold text-xs">{runName}</div>}
      <div
        className={`text-[11px] text-text-body-mid dark:text-text-muted mb-1.5 ${
          runName ? 'mt-0.5' : 'font-bold text-xs'
        }`}
      >
        {dateLine}
        {timeLine ? ` · ${timeLine}` : ''}
      </div>
      <div className="space-y-1 text-xs">
        {payload.map((entry) => (
          <div
            key={String(entry.name)}
            className="flex items-center justify-between gap-4 font-medium"
          >
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold tabular-nums">
              {formatDuration(Number(entry.value) * 1000)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DurationTableRow {
  run_id: string;
  run_name?: string;
  started_at: string;
  git_branch?: string;
  git_commit?: string;
  git_commit_full?: string;
  [projectName: string]: unknown;
}

/**
 * Visualizes project duration trends across historical test runs and provides an expandable data table.
 *
 * @param props - Component properties containing history run data, color mappings, and guide toggle.
 * @returns Duration trend chart and collapsible tabular data view.
 */
export default function DurationTrend({
  history,
  projectColorMap,
  onOpenGuide,
}: DurationTrendProps) {
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [hoveredRunId, setHoveredRunId] = useState<string | null>(null);

  const { durationChartData, projectNames } = useMemo(() => {
    if (!history || !history.runs.length) {
      return { durationChartData: [], projectNames: [] };
    }

    const recentRuns = history.runs.slice(-15);
    const projectSet = new Set<string>();
    recentRuns.forEach((run) => {
      if (run.project_durations) {
        Object.keys(run.project_durations).forEach((p) => projectSet.add(p));
      }
    });

    if (projectSet.size === 0 && history.project_trends) {
      history.project_trends.forEach((pt) => pt.project && projectSet.add(pt.project));
    }

    if (projectSet.size === 0) {
      (history.flaky || []).forEach((f) => f.project && projectSet.add(f.project));
      (history.slowest || []).forEach((s) => s.project && projectSet.add(s.project));
      (history.regressions || []).forEach((r) => r.project && projectSet.add(r.project));
    }

    const projectsList = Array.from(projectSet);

    const data = recentRuns.map((run) => {
      const item: DurationTableRow = {
        run_id: run.run_id,
        started_at: run.started_at,
        run_name: run.run_name,
        git_branch: run.git_branch,
        git_commit: run.git_commit,
        git_commit_full: run.git_commit_full,
      };

      if (run.project_durations && Object.keys(run.project_durations).length > 0) {
        projectsList.forEach((proj) => {
          item[proj] = run.project_durations?.[proj] ?? 0;
        });
      } else {
        projectsList.forEach((proj) => {
          item[proj] = 0;
        });
      }
      return item;
    });

    return { durationChartData: data, projectNames: projectsList };
  }, [history]);

  const tableRuns = useMemo(() => [...durationChartData].reverse(), [durationChartData]);

  const columns: ColumnDef<DurationTableRow>[] = useMemo(() => {
    const cols: ColumnDef<DurationTableRow>[] = [
      {
        key: 'run_name',
        header: 'Run Name',
        className: 'font-semibold text-text-ink dark:text-text-on-primary',
        cell: (row) => row.run_name || row.run_id,
        csvValue: (row) => row.run_name || row.run_id,
      },
      {
        key: 'branch',
        header: 'Branch',
        className: 'text-text-body-mid dark:text-text-muted',
        cell: (row) =>
          row.git_branch ? (
            <span
              className="block max-w-28 truncate"
              title={`Branch: ${row.git_branch}${row.git_commit ? ` (${row.git_commit})` : ''}`}
            >
              {row.git_branch}
            </span>
          ) : (
            <span className="text-text-muted-soft dark:text-text-muted">—</span>
          ),
        csvValue: (row) => row.git_branch ?? '',
      },
      {
        key: 'commit',
        header: 'Commit',
        className: 'text-text-body-mid dark:text-text-muted',
        cell: (row) =>
          row.git_commit ? (
            <code className="font-mono text-[11px]" title={row.git_commit_full || row.git_commit}>
              {row.git_commit.slice(0, 7)}
            </code>
          ) : (
            <span className="text-text-muted-soft dark:text-text-muted">—</span>
          ),
        csvValue: (row) => row.git_commit ?? '',
      },
      {
        key: 'started_at',
        header: 'Start Time',
        cell: (row) => formatDateLocal(row.started_at),
        csvValue: (row) => formatDateLocal(row.started_at),
      },
    ];

    projectNames.forEach((proj, idx) => {
      const color =
        projectColorMap?.[proj] ?? DISTINCT_PROJECT_COLORS[idx % DISTINCT_PROJECT_COLORS.length];
      cols.push({
        key: proj,
        header: (
          <span className="flex items-center gap-1.5 justify-end">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span>{proj}</span>
          </span>
        ),
        headerLabel: proj,
        align: 'right',
        cell: (row) => {
          const sec = Number(row[proj] ?? 0);
          return formatDuration(sec * 1000);
        },
        csvValue: (row) => {
          const sec = Number(row[proj] ?? 0);
          return formatDuration(sec * 1000);
        },
      });
    });

    return cols;
  }, [projectNames, projectColorMap]);

  return (
    <section className={sectionClass}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className={headingClass}>Duration trend</h2>
            {onOpenGuide && <LearnMoreButton onClick={onOpenGuide} />}
          </div>
          <p className="mt-1 text-xs text-text-body-mid dark:text-text-muted">
            Track sequential effort duration by project across historical runs
            {history.runs.length > 15 ? ' (showing the 15 most recent runs)' : ''}
          </p>
        </div>
      </div>
      {durationChartData.length < 2 ? (
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
            to visualize project duration trends across runs over time.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <ResponsiveContainer width="100%" height={256}>
            <LineChart
              data={durationChartData}
              margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
              onMouseMove={(state) => {
                if (state.isTooltipActive && state.activeIndex != null) {
                  const idx = Number(state.activeIndex);
                  if (Number.isInteger(idx) && durationChartData[idx]) {
                    setHoveredRunId(durationChartData[idx].run_id);
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
                fontSize={11}
                fontWeight={500}
                tick={{ fill: 'var(--color-text-ink)' }}
                unit="s"
              />
              {hoveredRunId && (
                <ReferenceLine
                  x={durationChartData.find((r) => r.run_id === hoveredRunId)?.started_at}
                  stroke="var(--color-accent-blue)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              )}
              <Tooltip
                content={renderDurationTooltip}
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
              <Legend
                iconType="circle"
                formatter={(value: string) => (
                  <span
                    style={{ color: 'var(--color-text-ink)', fontSize: '12px', fontWeight: 500 }}
                  >
                    {value}
                  </span>
                )}
                wrapperStyle={{
                  paddingTop: '8px',
                  textAlign: 'center',
                  width: '100%',
                  fontSize: '12px',
                }}
              />
              {projectNames.map((proj, idx) => {
                const color =
                  projectColorMap?.[proj] ??
                  DISTINCT_PROJECT_COLORS[idx % DISTINCT_PROJECT_COLORS.length];
                return (
                  <Line
                    key={proj}
                    type="monotone"
                    dataKey={proj}
                    name={proj}
                    stroke={color}
                    strokeWidth={2.5}
                    connectNulls={true}
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
                          fill={color}
                          stroke={
                            isHovered ? 'var(--color-accent-blue)' : 'var(--color-surface-50)'
                          }
                          strokeWidth={isHovered ? 2.5 : 1.5}
                          className="transition-all duration-150"
                        />
                      );
                    }}
                    activeDot={{
                      r: 7,
                      fill: color,
                      stroke: 'var(--color-surface-50)',
                      strokeWidth: 2,
                    }}
                  />
                );
              })}
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
                  {durationChartData.length} runs
                </span>
              </div>
            </summary>
            <div className="border-t border-border-default p-3 pt-2">
              <DataTable
                data={tableRuns}
                columns={columns}
                getRowKey={(row) => row.run_id}
                getRowClassName={(row) =>
                  row.run_id === hoveredRunId
                    ? 'bg-accent-blue/15 dark:bg-accent-blue/25 ring-1 ring-inset ring-accent-blue/40'
                    : ''
                }
                onRowMouseEnter={(row) => setHoveredRunId(row.run_id)}
                onRowMouseLeave={() => setHoveredRunId(null)}
                compact
                exportFilename={() => generateExportFilename('duration_trend')}
              />
            </div>
          </details>
        </div>
      )}
    </section>
  );
}
