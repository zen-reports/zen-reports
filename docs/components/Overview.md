# Overview Tab

The default landing tab of the Zen Reporter dashboard. It gives a high-level snapshot of the currently selected test run: overall pass rate, outcome breakdown, execution metadata, and three executive diagnostic cards. Use the other tabs to drill down into individual suites, files, failures, and historical trends.

---

## Test Results Hero

The hero section at the top of the tab is split into two halves:

### Pass Rate Ring

A circular gauge on the left showing the run's pass rate — the share of tests counted as successful (passed plus flaky) out of the total number of executed tests. The ring also reflects the clean-pass and flaky portions of that rate.

### Test Run Info

A metadata strip listing, at a glance:

| Item       | Meaning                                                          |
| :--------- | :--------------------------------------------------------------- |
| Duration   | Total wall-clock time of the run.                                |
| Projects   | Number of Playwright project targets executed.                   |
| Files      | Number of test spec files executed in the report.                |
| Tests      | Total number of test case executions.                            |
| Workers    | Number of parallel workers used (or `1 Worker` for serial runs). |
| Playwright | Playwright version that produced the report (when available).    |
| OS         | Operating system of the machine that ran the tests.              |

### Test Results & Breakdown

Below the metadata strip you get a multi-segmented progress bar (one colored segment per outcome) plus six status cards:

| Card        | Meaning                                                                      |
| :---------- | :--------------------------------------------------------------------------- |
| Passed      | Tests that passed on the first attempt.                                      |
| Flaky       | Tests that failed initially but passed on a retry. Counted toward pass rate. |
| Failed      | Tests that ended in assertion or runtime errors.                             |
| Timed Out   | Tests that exceeded their allotted timeout.                                  |
| Interrupted | Tests stopped by worker crashes or process termination.                      |
| Skipped     | Tests that were intentionally skipped.                                       |

Each card shows the count and its percentage of the total.

---

## Executive Diagnostics

A responsive 1/2/3-column grid of diagnostic cards summarizing run health:

| Card                     | What it shows                                                                                                                                                                                                |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test Speed & Consistency | Median (P50) "typical test speed", a spectrum bar from typical to slow-outlier tail, fastest/typical/slowest metrics, and an `Nx Outlier` badge when the slowest test far exceeds the P95 duration.          |
| Parallel Speedup         | Dual-bar comparison of "if run one-by-one" (sequential estimate) vs "actual run time", a speedup badge (`⚡ Nx Faster`, overhead warning, or serial note), worker count, average pace, and total time saved. |
| Worker Utilization       | Active vs idle worker capacity, a workload-balance callout (balanced / imbalanced / bottlenecked), number of spec files, test density (tests per spec), and the slowest test in the run.                     |

---

## Where to Go Next

| Goal                                   | Tab / feature                                                                         |
| :------------------------------------- | :------------------------------------------------------------------------------------ |
| Compare Playwright project targets     | [Projects tab](./Projects.md)                                                         |
| Browse individual test cases and steps | [Suites tab](./Suites.md)                                                             |
| Find failing tests and their errors    | [Failures tab](./Failures.md)                                                         |
| Inspect per-file metrics               | [Files tab](./Files.md)                                                               |
| Look across historical runs            | [History tab](./History.md), [Insights tab](./Insights.md), [Trends tab](./Trends.md) |
| Switch to a different recorded run     | [Run Switcher](./RunSwitcher.md)                                                      |

> **Tip**: Keyboard shortcuts (tab jumps, expand/collapse, run switching) are documented in the [Keyboard Shortcuts Guide](../keyboard-shortcuts.md).
