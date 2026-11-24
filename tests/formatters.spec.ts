import { expect, test } from '@playwright/test';
import { normalizeErrorText, sha256Sync } from '@zen-reports/zen-core';
import { truncateMiddlePath } from '@zen-reports/zen-core';

test.describe('Formatters & Windows Path Tests', () => {
  test('truncateMiddlePath truncates POSIX paths with > 3 segments', () => {
    expect(truncateMiddlePath('src/components/shared/Button.tsx')).toBe('src/.../Button.tsx');
    expect(truncateMiddlePath('/usr/local/share/app/main.ts')).toBe('/usr/.../main.ts');
  });

  test('truncateMiddlePath preserves short POSIX paths', () => {
    expect(truncateMiddlePath('')).toBe('');
    expect(truncateMiddlePath('foo.ts')).toBe('foo.ts');
    expect(truncateMiddlePath('src/foo.ts')).toBe('src/foo.ts');
  });

  test('truncateMiddlePath handles Windows backslash paths correctly', () => {
    expect(truncateMiddlePath('C:\\Users\\arpan\\project\\tests\\foo.spec.ts')).toBe(
      'C:\\...\\foo.spec.ts'
    );
    expect(truncateMiddlePath('tests\\nested\\deep\\bar.spec.ts')).toBe('tests\\...\\bar.spec.ts');
    expect(truncateMiddlePath('tests\\bar.spec.ts')).toBe('tests\\bar.spec.ts');
  });
});

test.describe('CryptoUtils Performance Optimizations Tests', () => {
  test('normalizeErrorText masks dynamic tokens with hoisted regexes', () => {
    const rawMsg =
      'Error at 2026-11-01T12:00:00.000Z: failed connecting to localhost:3000 with uuid 12345678-1234-1234-1234-123456789abc after 250ms at ptr 0xdeadbeef at :10:20';
    const rawStack = 'Error: failed\n    at test.spec.ts:15:30\n    at internal/process.js:5:10';

    const normalized = normalizeErrorText(rawMsg, rawStack);
    expect(normalized).toContain('<TIMESTAMP>');
    expect(normalized).toContain('<HOST>');
    expect(normalized).toContain('<UUID>');
    expect(normalized).toContain('<DURATION>');
    expect(normalized).toContain('<PTR>');
    expect(normalized).toContain(':<LINE>:<COL>');
  });

  test('sha256Sync produces correct deterministic hashes with hoisted constants', () => {
    expect(sha256Sync('hello world')).toBe(
      'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'
    );
    expect(sha256Sync('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });
});

test.describe('Range Selection Parser Tests', () => {
  test('parses single numbers, lists, ranges and "all"', async () => {
    const { parseRangeSelection } = await import('../packages/cli/bin/commands/history.js');

    expect(parseRangeSelection('', 10)).toEqual([]);
    expect(parseRangeSelection('all', 5)).toEqual([1, 2, 3, 4, 5]);
    expect(parseRangeSelection('1', 5)).toEqual([1]);
    expect(parseRangeSelection('1, 3, 5', 10)).toEqual([1, 3, 5]);
    expect(parseRangeSelection('2-4', 10)).toEqual([2, 3, 4]);
    expect(parseRangeSelection('2-4, 8, 12-14', 20)).toEqual([2, 3, 4, 8, 12, 13, 14]);
    // Deduplication and ordering
    expect(parseRangeSelection('5, 2-4, 3, 5-6', 10)).toEqual([2, 3, 4, 5, 6]);
    // Out of bounds / invalid inputs return empty
    expect(parseRangeSelection('0', 10)).toEqual([]);
    expect(parseRangeSelection('15', 10)).toEqual([]);
    expect(parseRangeSelection('5-12', 10)).toEqual([]);
    expect(parseRangeSelection('abc', 10)).toEqual([]);
    expect(parseRangeSelection('1-2-3', 10)).toEqual([]);
  });
});

test.describe('Markdown Summary Generator Tests', () => {
  test('generates markdown summary with environment info strip', async () => {
    const { generateMarkdownSummaryFromReport } =
      await import('../packages/cli/bin/commands/summary.js');

    const reportData = {
      testRun: {
        projectName: 'Acme Test Suite',
        testRunName: 'Nightly CI',
        summary: {
          total: 10,
          passed: 10,
          failed: 0,
          flaky: 0,
          skipped: 0,
          timedOut: 0,
          interrupted: 0,
          duration: 45000,
          osName: 'Ubuntu Linux',
          playwrightVersion: '1.50.0',
          workers: 4,
          numberOfProjects: 2,
          gitBranch: 'feature/ci-summary',
          gitCommit: 'abc1234',
        },
        suites: [{ title: 'suite1.spec.ts' }, { title: 'suite2.spec.ts' }],
      },
    };

    const md = generateMarkdownSummaryFromReport(reportData);

    expect(md).toContain('### 📊 Test Run Summary: Acme Test Suite — Nightly CI');
    expect(md).toContain(
      '> **OS:** `Ubuntu Linux` | **Playwright:** `v1.50.0` | **Workers:** `4` | **Projects:** `2` | **Files:** `2` | **Branch:** `feature/ci-summary` (`abc1234`)'
    );
    expect(md).toContain('| Status | Duration | Pass Rate | Total | Passed | Flaky | Failed |');
  });

  test('omits environment info strip gracefully when metadata is missing', async () => {
    const { generateMarkdownSummaryFromReport } =
      await import('../packages/cli/bin/commands/summary.js');

    const reportData = {
      testRun: {
        summary: {
          total: 5,
          passed: 5,
          failed: 0,
          duration: 1200,
        },
      },
    };

    const md = generateMarkdownSummaryFromReport(reportData);
    expect(md).toContain('### 📊 Test Run Summary: Test Automation Project — Test Run');
    expect(md).not.toContain('> **OS:**');
    expect(md).not.toContain('> **Playwright:**');
    expect(md).not.toContain('>');
  });
});
