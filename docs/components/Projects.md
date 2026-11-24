# Projects Tab

Project-level analysis of the current run. Each Playwright project target (for example `chromium`, `firefox`, `mobile`) is compared side by side using executive KPI cards, benchmark charts, and per-project health cards.

---

## Executive KPI Cards

Five cards summarize the cross-project picture of the run:

| Card                | Meaning                                                                                           |
| :------------------ | :------------------------------------------------------------------------------------------------ |
| Total Projects      | Number of configured Playwright project profiles in this run.                                     |
| Most Stable Project | Project with the highest pass rate and lowest flakiness, shown with its pass rate and test count. |
| Slowest Project     | Project consuming the highest cumulative execution duration (total and average).                  |
| Parity Variance     | Gap between the highest and lowest project pass rates. Flagged red above 15%.                     |
| Flaky Tests         | Total tests across all projects that required retries to pass.                                    |

Every card has an info tooltip explaining the exact metric.

---

## Benchmark Charts

A 2×2 grid of charts comparing projects against each other. Each chart has a **Learn more** button that opens a contextual guide modal:

| Chart                                      | What it shows                                                           |
| :----------------------------------------- | :---------------------------------------------------------------------- |
| Status Breakdown by Project                | Passed / flaky / failed / skipped / timed-out distribution per project. |
| Test Volume & Coverage Density per Project | Test count and spec-file coverage per project.                          |
| Duration Spread & P95 Latency by Project   | Duration spread and P95 latency benchmarks per project.                 |
| Flaky Test Count & Retry Rate by Project   | Flaky counts and retry rates per project.                               |

---

## Project Health & Breakdown

A card grid with one card per project, plus search and sort controls:

- **Search** projects by name.
- **Sort by** dropdown: Highest Pass Rate (default), Longest Duration, Most Flaky Tests, Most Tests, or Project Name.

Each project card shows:

| Element            | Details                                                                                                          |
| :----------------- | :--------------------------------------------------------------------------------------------------------------- |
| Name + speed badge | Project name with a `⚡ Nx faster/slower than avg` badge comparing its average test duration to the run average. |
| Volume line        | `N Tests executed across M spec files`.                                                                          |
| Pass rate          | Pass rate badge with a progress bar; green ≥ 90%, amber ≥ 75%, red below 75%.                                    |
| Metrics grid       | Key metrics such as total tests, failures, flaky count, duration, and per-file stats.                            |
| Failure breakdown  | Expandable list of that project's failed, timed-out, and interrupted tests, rendered as test case cards.         |

Expanded test cases are fully interactive: click one to open its detail view (steps, errors, attachments, output) exactly like in the [Suites tab](./Suites.md).

When no project data exists for the run (or the search matches nothing), an empty state is shown instead.

---

## Guides

The **Learn more** buttons on the charts and the Project Health section open [Guide modals](./GuideModal.md) with metric definitions, thresholds, and interpretation tips for each chart type.
