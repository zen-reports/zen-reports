# History Tab

The cross-run audit log. It shows every recorded test run, plus per-file and per-test history aggregated across runs. History data is only available in **server mode** (local history database or remote server); standalone offline reports show a notice explaining that history requires server mode instead.

> **Note:** If history recording is disabled in the configuration, a banner at the top of the tab explains that history analytics are unavailable.

---

## Execution Runs History

The main audit log table, newest run first, one row per run:

| Column                                                      | Content                                                                                                                                                                        |
| :---------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Run Name                                                    | Name of the run.                                                                                                                                                               |
| Branch                                                      | Git branch (with commit SHA in the tooltip).                                                                                                                                   |
| Mode                                                        | `Serial` or `Parallel, N workers`.                                                                                                                                             |
| Start Time                                                  | Local start time. A "Filtered" badge appears in the header when a date filter is active.                                                                                       |
| Duration                                                    | Wall-clock run duration.                                                                                                                                                       |
| Time Saved                                                  | Parallel speedup vs the sequential estimate: `⚡ Xs (Nx)` when faster, `⚠️ +Xs` when parallel added overhead.                                                                  |
| Files                                                       | Number of spec files executed.                                                                                                                                                 |
| Tests                                                       | Total test count.                                                                                                                                                              |
| Passed / Flaky / Failed / Skipped / Timed Out / Interrupted | Outcome counts rendered as status badges.                                                                                                                                      |
| Pass Rate                                                   | Color-coded pass rate badge.                                                                                                                                                   |
| Report                                                      | A **switch-to-run** button that loads that run into the whole report (see [Run Switcher](./RunSwitcher.md)). The currently viewed run shows an eye icon and a highlighted row. |

Controls above the table:

- **Date range filter** (from/to pickers) with quick presets; a "Filtered" badge marks the Start Time column while active.
- **Search** by run name, branch, or commit.
- **Export CSV** of the filtered runs.
- **Pagination** (10 runs per page by default) with page-size selector.

When a run is selected from anywhere in the app, the table automatically jumps to the page containing that run.

Each section on this tab has a **Learn more** button opening a [guide modal](./GuideModal.md) (Historical Test Runs Guide, File Execution History Guide, Test Execution History Guide).

---

## File Execution History

A per-spec-file aggregation across all recorded runs — see the dedicated [File Execution History](./FileExecutionHistory.md) documentation for column definitions and controls.

---

## Test Execution History

A per-test aggregation across all recorded runs, one row per unique test (project + file + suite + title):

- Columns: Test, Suite, Spec File, Project, Runs, Passed, Flaky, Failed, Timed Out, Interrupted, Skipped, average duration, and Pass Rate.
- **Date range filter**, **search** by test title, suite, file, or project, **Export CSV**, and pagination (10 rows per page by default).
- Rows are sorted by total executions, most-executed first.
