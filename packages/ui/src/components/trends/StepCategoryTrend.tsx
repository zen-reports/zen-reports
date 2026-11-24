import LearnMoreButton from '@/components/shared/LearnMoreButton';
import { ColumnDef, DataTable } from '@/components/shared/DataTable';
import {
  countStepCategories,
  formatDateLocal,
  generateExportFilename,
  STEP_CATEGORIES,
  StepCategoryKey,
} from '@zen-reports/zen-core';
import type { HistoryData } from '@zen-reports/zen-core';
import type { TestSuite } from '@zen-reports/zen-core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StepCategoryChart, type StepCategoryChartPoint } from './step-category/StepCategoryChart';

export interface StepCategoryTrendProps {
  suites: TestSuite[];
  history?: HistoryData | null;
  onOpenGuide?: () => void;
}

interface StepCategoryTableRow {
  id: string;
  name: string;
  started_at?: string;
  hasStepData: boolean;
  totalSteps: number;
  counts: Record<StepCategoryKey, number>;
  percentages: Record<StepCategoryKey, number>;
  git_branch?: string;
  git_commit?: string;
  git_commit_full?: string;
}

/**
 * Visualizes step category compositions and historical trends with an interactive toggle and collapsible data table.
 *
 * @param props - Component properties containing test suites, history run data, and guide callback.
 * @returns Step category composition view, trend chart, and collapsible data table.
 */
export default function StepCategoryTrend({
  suites,
  history,
  onOpenGuide,
}: StepCategoryTrendProps) {
  const [viewMode, setViewMode] = useState<'percent' | 'count'>('percent');
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [hoveredRunId, setHoveredRunId] = useState<string | null>(null);
  const viewModeContainerRef = useRef<HTMLDivElement>(null);
  const viewModeButtonsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const [viewModeIndicator, setViewModeIndicator] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }>({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

  useEffect(() => {
    /**
     * Calculates the bounding client rect of the active view mode pill and updates state.
     *
     * @returns {void}
     */
    const updateIndicator = () => {
      const container = viewModeContainerRef.current;
      const activeButton = viewModeButtonsRef.current[viewMode];
      if (!container || !activeButton) return;

      const containerRect = container.getBoundingClientRect();
      const activeRect = activeButton.getBoundingClientRect();

      setViewModeIndicator({
        left: activeRect.left - containerRect.left - container.clientLeft,
        top: activeRect.top - containerRect.top - container.clientTop,
        width: activeRect.width,
        height: activeRect.height,
        opacity: 1,
      });
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [viewMode]);

  const currentCounts = useMemo(() => countStepCategories(suites), [suites]);

  const totalCurrentSteps = useMemo(() => {
    return Object.values(currentCounts).reduce((sum, n) => sum + n, 0);
  }, [currentCounts]);

  const hasHistoricalStepData = useMemo(() => {
    if (!history?.runs || history.runs.length === 0) return false;
    return history.runs.some((run) => {
      if (!run.step_categories) return false;
      return Object.values(run.step_categories).reduce((sum, n) => sum + n, 0) > 0;
    });
  }, [history]);

  const hasAnyStepData = totalCurrentSteps > 0 || hasHistoricalStepData;

  const currentPercentages = useMemo(() => {
    if (totalCurrentSteps === 0) {
      return { assertions: 0, actions: 0, network: 0, hooks: 0, waits: 0, others: 0 };
    }
    const res: Record<StepCategoryKey, number> = {
      assertions: 0,
      actions: 0,
      network: 0,
      hooks: 0,
      waits: 0,
      others: 0,
    };
    for (const cat of STEP_CATEGORIES) {
      res[cat.key] = Math.round((currentCounts[cat.key] / totalCurrentSteps) * 1000) / 10;
    }
    return res;
  }, [currentCounts, totalCurrentSteps]);

  const chartData = useMemo<StepCategoryChartPoint[]>(() => {
    const runsList = history?.runs && history.runs.length > 0 ? history.runs.slice(-15) : [];

    if (runsList.length === 0) {
      const currentPoint: StepCategoryChartPoint = {
        id: 'current',
        name: 'Current Run',
        started_at: '',
        hasStepData: totalCurrentSteps > 0,
      };

      for (const cat of STEP_CATEGORIES) {
        currentPoint[cat.label] =
          viewMode === 'percent' ? currentPercentages[cat.key] : currentCounts[cat.key];
      }

      return [currentPoint];
    }

    return runsList.map((run, idx) => {
      const isLatest = idx === runsList.length - 1;
      const id = isLatest ? 'current' : run.run_id || `run-${idx}`;
      const name =
        run.run_name || (run.started_at ? formatDateLocal(run.started_at) : `Run #${idx + 1}`);

      const item: StepCategoryChartPoint = {
        id,
        name,
        started_at: run.started_at,
        run_total: run.run_total,
        git_branch: run.git_branch,
        git_commit: run.git_commit,
        git_commit_full: run.git_commit_full,
      };

      if (isLatest) {
        item.hasStepData = totalCurrentSteps > 0;
        for (const cat of STEP_CATEGORIES) {
          item[cat.label] =
            viewMode === 'percent' ? currentPercentages[cat.key] : currentCounts[cat.key];
        }
      } else if (run.step_categories) {
        // Use exact recorded step category counts/percentages
        const catCounts = run.step_categories;
        const totalSteps = Object.values(catCounts).reduce((sum, n) => sum + n, 0);
        item.hasStepData = totalSteps > 0;

        for (const cat of STEP_CATEGORIES) {
          const rawCount = catCounts[cat.key] || 0;
          if (viewMode === 'percent') {
            item[cat.label] = totalSteps > 0 ? Math.round((rawCount / totalSteps) * 1000) / 10 : 0;
          } else {
            item[cat.label] = rawCount;
          }
        }
      } else {
        // Historical runs recorded without step category breakdown
        item.hasStepData = false;
        for (const cat of STEP_CATEGORIES) {
          item[cat.label] = 0;
        }
      }

      return item;
    });
  }, [history, currentCounts, currentPercentages, totalCurrentSteps, viewMode]);

  const tableRows = useMemo<StepCategoryTableRow[]>(() => {
    const runsList = history?.runs && history.runs.length > 0 ? history.runs.slice(-15) : [];

    const formatRow = (
      id: string,
      name: string,
      startedAt: string | undefined,
      counts: Record<StepCategoryKey, number>,
      hasData: boolean,
      gitBranch?: string,
      gitCommit?: string,
      gitCommitFull?: string
    ): StepCategoryTableRow => {
      const totalSteps = Object.values(counts).reduce((sum, n) => sum + n, 0);
      const percentages: Record<StepCategoryKey, number> = {
        assertions: 0,
        actions: 0,
        network: 0,
        hooks: 0,
        waits: 0,
        others: 0,
      };
      for (const cat of STEP_CATEGORIES) {
        percentages[cat.key] =
          totalSteps > 0 ? Math.round(((counts[cat.key] || 0) / totalSteps) * 1000) / 10 : 0;
      }
      return {
        id,
        name,
        started_at: startedAt,
        hasStepData: hasData,
        totalSteps,
        counts,
        percentages,
        git_branch: gitBranch,
        git_commit: gitCommit,
        git_commit_full: gitCommitFull,
      };
    };

    if (runsList.length === 0) {
      return [formatRow('current', 'Current Run', undefined, currentCounts, totalCurrentSteps > 0)];
    }

    const rows: StepCategoryTableRow[] = runsList.map((run, idx) => {
      const isLatest = idx === runsList.length - 1;
      const id = isLatest ? 'current' : run.run_id || `run-${idx}`;
      const name =
        run.run_name || (run.started_at ? formatDateLocal(run.started_at) : `Run #${idx + 1}`);

      if (isLatest) {
        return formatRow(
          id,
          name,
          run.started_at,
          currentCounts,
          totalCurrentSteps > 0,
          run.git_branch,
          run.git_commit,
          run.git_commit_full
        );
      }

      if (run.step_categories) {
        const catCounts: Record<StepCategoryKey, number> = {
          assertions: run.step_categories.assertions || 0,
          actions: run.step_categories.actions || 0,
          network: run.step_categories.network || 0,
          hooks: run.step_categories.hooks || 0,
          waits: run.step_categories.waits || 0,
          others: run.step_categories.others || 0,
        };
        const hasData = Object.values(catCounts).reduce((sum, n) => sum + n, 0) > 0;
        return formatRow(
          id,
          name,
          run.started_at,
          catCounts,
          hasData,
          run.git_branch,
          run.git_commit,
          run.git_commit_full
        );
      }

      const emptyCounts: Record<StepCategoryKey, number> = {
        assertions: 0,
        actions: 0,
        network: 0,
        hooks: 0,
        waits: 0,
        others: 0,
      };
      return formatRow(
        id,
        name,
        run.started_at,
        emptyCounts,
        false,
        run.git_branch,
        run.git_commit,
        run.git_commit_full
      );
    });

    return rows.reverse();
  }, [history, currentCounts, totalCurrentSteps]);

  const columns: ColumnDef<StepCategoryTableRow>[] = useMemo(() => {
    const cols: ColumnDef<StepCategoryTableRow>[] = [
      {
        key: 'run_name',
        header: 'Run',
        className: 'font-semibold text-text-ink dark:text-text-on-primary',
        cell: (row) => row.name,
        csvValue: (row) => row.name,
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
        cell: (row) => (row.started_at ? formatDateLocal(row.started_at) : '—'),
        csvValue: (row) => (row.started_at ? formatDateLocal(row.started_at) : ''),
      },
    ];

    STEP_CATEGORIES.forEach((cat) => {
      cols.push({
        key: cat.key,
        header: (
          <span className="flex items-center gap-1.5 justify-end">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span>{cat.label}</span>
          </span>
        ),
        headerLabel: cat.label,
        align: 'right',
        cell: (row) => {
          if (!row.hasStepData) {
            return <span className="text-text-body-mid dark:text-text-muted">—</span>;
          }
          const pct = row.percentages[cat.key];
          const count = row.counts[cat.key];
          if (viewMode === 'percent') {
            return (
              <span className="tabular-nums">
                <span className="font-semibold text-text-ink dark:text-text-on-primary">
                  {pct}%
                </span>{' '}
                <span className="text-[11px] text-text-body-mid dark:text-text-muted">
                  ({count})
                </span>
              </span>
            );
          }
          return (
            <span className="tabular-nums">
              <span className="font-semibold text-text-ink dark:text-text-on-primary">{count}</span>{' '}
              <span className="text-[11px] text-text-body-mid dark:text-text-muted">({pct}%)</span>
            </span>
          );
        },
        csvValue: (row) => {
          if (!row.hasStepData) return '—';
          return viewMode === 'percent'
            ? `${row.percentages[cat.key]}% (${row.counts[cat.key]})`
            : `${row.counts[cat.key]} (${row.percentages[cat.key]}%)`;
        },
      });
    });

    cols.push({
      key: 'total_steps',
      header: 'Total Steps',
      align: 'right',
      cell: (row) =>
        row.hasStepData ? (
          <span className="font-bold tabular-nums text-text-ink dark:text-text-on-primary">
            {row.totalSteps}
          </span>
        ) : (
          <span className="text-text-body-mid dark:text-text-muted">—</span>
        ),
      csvValue: (row) => (row.hasStepData ? row.totalSteps : 0),
    });

    return cols;
  }, [viewMode]);

  return (
    <section className="rounded-md border border-border-default bg-surface-50 p-5 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-text-ink dark:text-text-on-primary">
              Step Category Composition & Trend
            </h2>
            {onOpenGuide && <LearnMoreButton onClick={onOpenGuide} />}
          </div>
          <p className="mt-1 text-xs text-text-body-mid dark:text-text-muted">
            Proportional breakdown of automated step types (Assertions, Actions, Network, Waits)
            across historical runs
          </p>
        </div>

        {/* View Mode Toggle */}
        <div
          ref={viewModeContainerRef}
          className="relative inline-flex items-center rounded-lg border border-border-default bg-surface-100 dark:bg-surface-950/70 p-0.5 text-xs font-semibold shrink-0 shadow-2xs"
        >
          {/* Sliding Active Pill Indicator */}
          <div
            aria-hidden="true"
            style={{
              transform: `translate3d(${viewModeIndicator.left}px, ${viewModeIndicator.top}px, 0)`,
              width: `${viewModeIndicator.width}px`,
              height: `${viewModeIndicator.height}px`,
              opacity: viewModeIndicator.opacity,
            }}
            className="pointer-events-none absolute left-0 top-0 rounded-md bg-canvas shadow-xs ring-1 ring-border-default/80 dark:bg-surface-200 dark:ring-1 dark:ring-white/20 dark:shadow-md transition-all duration-250 ease-[cubic-bezier(0.2,0,0,1)]"
          />

          <button
            ref={(el) => {
              viewModeButtonsRef.current['percent'] = el;
            }}
            type="button"
            onClick={() => setViewMode('percent')}
            className={`relative z-10 px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-150 cursor-pointer ${
              viewMode === 'percent'
                ? 'text-text-ink dark:text-text-on-primary'
                : 'text-text-body-mid hover:text-text-ink hover:bg-surface-200/40 dark:text-text-muted dark:hover:text-text-on-primary'
            }`}
          >
            % Normalized
          </button>
          <button
            ref={(el) => {
              viewModeButtonsRef.current['count'] = el;
            }}
            type="button"
            onClick={() => setViewMode('count')}
            className={`relative z-10 px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-150 cursor-pointer ${
              viewMode === 'count'
                ? 'text-text-ink dark:text-text-on-primary'
                : 'text-text-body-mid hover:text-text-ink hover:bg-surface-200/40 dark:text-text-muted dark:hover:text-text-on-primary'
            }`}
          >
            Step Count
          </button>
        </div>
      </div>

      {/* Recharts Stacked Bar Trend Chart or Empty State */}
      {!hasAnyStepData ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-md border border-dashed border-border-default bg-surface-100/50 p-6 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-surface-200 text-text-muted">
            <svg
              className="h-5 w-5 text-text-body-mid dark:text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.143 2.143L15.75 6"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-text-ink dark:text-text-on-primary">
            No step data available for current run
          </p>
          <p className="mt-1 text-xs text-text-body-mid dark:text-text-muted">
            No test steps were executed or recorded for this run.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <StepCategoryChart
            chartData={chartData}
            viewMode={viewMode}
            hoveredRunId={hoveredRunId}
            onHoverRun={setHoveredRunId}
          />

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
                  {tableRows.length} {tableRows.length === 1 ? 'run' : 'runs'}
                </span>
              </div>
            </summary>
            <div className="border-t border-border-default p-3 pt-2">
              <DataTable
                data={tableRows}
                columns={columns}
                getRowKey={(row) => row.id}
                getRowClassName={(row) =>
                  row.id === hoveredRunId
                    ? 'bg-accent-blue/15 dark:bg-accent-blue/25 ring-1 ring-inset ring-accent-blue/40'
                    : ''
                }
                onRowMouseEnter={(row) => setHoveredRunId(row.id)}
                onRowMouseLeave={() => setHoveredRunId(null)}
                compact
                exportFilename={() => generateExportFilename('step_category_trend')}
              />
            </div>
          </details>
        </div>
      )}
    </section>
  );
}
