import { formatDateParts, STEP_CATEGORIES } from '@zen-reports/zen-core';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from 'recharts';
import { renderTrendTick } from '../TrendTick';

export interface StepCategoryChartPoint {
  id?: string;
  name: string;
  started_at?: string;
  run_total?: number;
  hasStepData?: boolean;
  git_branch?: string;
  git_commit?: string;
  git_commit_full?: string;
  [categoryLabel: string]: string | number | boolean | undefined;
}

export interface StepCategoryChartProps {
  chartData: StepCategoryChartPoint[];
  viewMode: 'percent' | 'count';
  hoveredRunId?: string | null;
  onHoverRun?: (runId: string | null) => void;
}

const CATEGORY_LABEL_ORDER = new Map(STEP_CATEGORIES.map((c, i) => [c.label, i]));

/**
 * Renders the tooltip content for the step category distribution chart.
 *
 * @param props - Tooltip properties provided by Recharts.
 * @param viewMode - Currently active view mode ('percent' or 'count').
 * @returns Formatted tooltip JSX element or null if inactive.
 */
const renderCategoryTooltip = (props: TooltipContentProps, viewMode: 'percent' | 'count') => {
  const { active, payload, label } = props;
  if (!active || !payload || payload.length === 0) return null;

  const dataItem = payload[0]?.payload as StepCategoryChartPoint | undefined;
  const hasStepData = dataItem?.hasStepData !== false;
  const runName = dataItem?.name;

  const [dateLine, timeLine] = formatDateParts(String(label));

  const sortedPayload = [...payload].sort((a, b) => {
    const idxA = CATEGORY_LABEL_ORDER.get(String(a.name)) ?? 99;
    const idxB = CATEGORY_LABEL_ORDER.get(String(b.name)) ?? 99;
    return idxA - idxB;
  });

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
      {!hasStepData ? (
        <div className="text-xs italic text-text-body-mid dark:text-text-muted py-1">
          No step category data recorded for this run
        </div>
      ) : (
        <div className="space-y-1 text-xs">
          {sortedPayload.map((entry) => {
            const val = Number(entry.value);
            const formattedVal = viewMode === 'percent' ? `${val}%` : `${val} steps`;
            const catConfig = STEP_CATEGORIES.find((c) => c.label === entry.name);
            const color = catConfig ? catConfig.color : entry.color;
            return (
              <div
                key={String(entry.name)}
                className="flex items-center justify-between gap-4 font-medium"
              >
                <span className="flex items-center gap-1.5 text-text-ink dark:text-text-on-primary">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  {entry.name}:
                </span>
                <span className="font-bold tabular-nums text-text-ink dark:text-text-on-primary">
                  {formattedVal}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * Renders the stacked bar chart for step category breakdown across historical runs.
 *
 * @param props - Component properties containing chart data, active view mode, hovered run id, and hover callbacks.
 * @returns Stacked bar chart visualization.
 */
export function StepCategoryChart({
  chartData,
  viewMode,
  hoveredRunId,
  onHoverRun,
}: StepCategoryChartProps) {
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(() => new Set());

  /**
   * Toggles category visibility in the chart legend when clicked.
   *
   * @param dataKey - The category label key to toggle.
   * @returns {void}
   */
  const handleLegendClick = (dataKey: string) => {
    setHiddenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(dataKey)) {
        next.delete(dataKey);
      } else {
        // Don't allow hiding all categories
        if (next.size < STEP_CATEGORIES.length - 1) {
          next.add(dataKey);
        }
      }
      return next;
    });
  };

  return (
    <div className="h-72 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          onMouseMove={(state) => {
            if (state.isTooltipActive && state.activeIndex != null) {
              const idx = Number(state.activeIndex);
              if (Number.isInteger(idx) && chartData[idx]) {
                onHoverRun?.(chartData[idx].id ?? null);
              }
            }
          }}
          onMouseLeave={() => onHoverRun?.(null)}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--color-border-chart, #e5e7eb)"
          />
          <XAxis
            dataKey="started_at"
            tick={renderTrendTick}
            axisLine={{ stroke: 'var(--color-border-chart, #e5e7eb)' }}
            tickLine={false}
            interval={0}
            height={45}
          />
          <YAxis
            domain={viewMode === 'percent' ? [0, 100] : [0, 'auto']}
            ticks={viewMode === 'percent' ? [0, 30, 60, 100] : undefined}
            tickFormatter={(val) =>
              viewMode === 'percent' ? `${Math.round(Number(val))}%` : `${val}`
            }
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--color-text-body-mid)', fontSize: 11 }}
          />
          <Tooltip
            content={(props) => renderCategoryTooltip(props, viewMode)}
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
            content={() => (
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3 text-xs">
                {STEP_CATEGORIES.map((cat) => {
                  const isHidden = hiddenCategories.has(cat.label);
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => handleLegendClick(cat.label)}
                      className="inline-flex items-center gap-1.5 cursor-pointer select-none font-medium transition-opacity"
                      title={isHidden ? `Show ${cat.label}` : `Hide ${cat.label}`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-xs shrink-0 transition-opacity ${
                          isHidden ? 'opacity-30' : 'opacity-100'
                        }`}
                        style={{ backgroundColor: cat.color }}
                      />
                      <span
                        className={
                          isHidden
                            ? 'line-through text-text-body-mid/40 dark:text-text-muted/40'
                            : 'text-text-body-mid dark:text-text-muted hover:text-text-ink dark:hover:text-text-on-primary'
                        }
                      >
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          />
          {STEP_CATEGORIES.map((cat) => (
            <Bar
              key={cat.key}
              dataKey={cat.label}
              stackId="a"
              fill={cat.color}
              stroke={cat.borderColor}
              strokeWidth={0.5}
              hide={hiddenCategories.has(cat.label)}
            >
              {chartData.map((entry) => {
                const isHovered = hoveredRunId != null && entry.id === hoveredRunId;
                const opacity = hoveredRunId == null || isHovered ? 1 : 0.45;
                return (
                  <Cell
                    key={`cell-${entry.id || entry.name}-${cat.key}`}
                    fill={cat.color}
                    fillOpacity={opacity}
                    stroke={isHovered ? 'var(--color-accent-blue)' : cat.borderColor}
                    strokeWidth={isHovered ? 1.5 : 0.5}
                  />
                );
              })}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
