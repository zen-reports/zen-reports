import { formatDateParts } from '@zen-reports/zen-core';

/**
 * Parses timestamp strings from trend data into formatted date and time parts.
 *
 * @param valStr - Raw timestamp or label string to parse.
 * @returns Tuple of [dateString, timeString] or null if not a parseable timestamp.
 */
export function parseTrendDateParts(valStr: string): [string, string] | null {
  if (!valStr || !/^\d{4}-\d{2}-\d{2}/.test(valStr)) {
    return null;
  }
  const timestamp = Date.parse(valStr);
  if (!isNaN(timestamp)) {
    return formatDateParts(valStr);
  }
  return null;
}

/**
 * Recharts SVG tick component rendering a two-line timestamp label (date and time) on XAxis ticks.
 *
 * @param props - Tick properties provided by Recharts XAxis.
 * @param props.x - X coordinate of the tick.
 * @param props.y - Y coordinate of the tick.
 * @param props.payload - Tick payload containing the raw value.
 * @returns SVG group element rendering date and time text.
 */
export const renderTrendTick = ({
  x,
  y,
  payload,
}: {
  x: number | string;
  y: number | string;
  payload: { value: unknown };
}) => {
  const tickX = Number(x);
  const tickY = Number(y);
  const valStr = String(payload.value);

  const dateParts = parseTrendDateParts(valStr);
  let dateLine: string;
  let timeLine: string;

  if (dateParts) {
    dateLine = dateParts[0] || valStr;
    timeLine = dateParts[1] || '';
  } else if (valStr.includes(' · ')) {
    const parts = valStr.split(' · ');
    dateLine = parts[0] || valStr;
    timeLine = parts[1] || '';
  } else {
    dateLine = valStr;
    timeLine = '';
  }

  const isTruncated = dateLine.length > 14;
  const displayDateLine = isTruncated ? `${dateLine.slice(0, 13)}…` : dateLine;

  return (
    <g>
      {isTruncated && <title>{valStr}</title>}
      <text
        x={tickX}
        y={tickY + 10}
        textAnchor="middle"
        fontSize={11}
        fontWeight={500}
        fill="var(--color-text-ink)"
      >
        {displayDateLine}
      </text>
      {timeLine ? (
        <text
          x={tickX}
          y={tickY + 24}
          textAnchor="middle"
          fontSize={11}
          fill="var(--color-text-body-mid)"
        >
          {timeLine}
        </text>
      ) : null}
    </g>
  );
};
