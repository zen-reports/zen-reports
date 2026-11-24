# Files Tab

Aggregated metrics per spec file for the current run. This tab answers questions like "which file is failing the most?", "which file takes the longest?", and "how many files are completely clean?".

---

## KPI Cards

Five cards at the top of the tab (each with an info tooltip):

| Card                  | Meaning                                                                                       |
| :-------------------- | :-------------------------------------------------------------------------------------------- |
| Total Spec Files      | Number of spec files executed, with the total test case count as subtext.                     |
| Clean Spec Files      | Files where every test passed (no failures, timeouts, or interruptions), with the percentage. |
| Failing Spec Files    | Files containing at least one failed, timed-out, or interrupted test.                         |
| Files with Retries    | Files containing at least one flaky test (passed only after a retry).                         |
| Failure Concentration | Share of all run failures that originate from the single worst file.                          |

---

## File Density & Distribution

A grid of four sub-metrics:

| Sub-metric           | Meaning                                                           |
| :------------------- | :---------------------------------------------------------------- |
| Avg Tests per File   | Total tests ÷ total files.                                        |
| Avg Spec Duration    | Cumulative sequential test time ÷ total files.                    |
| Highest Test Density | The spec file with the most individual test cases.                |
| Total Test Duration  | Sum of all individual test durations (sequential execution time). |

---

## Longest Execution Spec Files

A horizontal bar chart of the top 5 (or fewer) spec files ranked by cumulative duration, with the test count and duration per file. This surfaces the heaviest execution bottlenecks regardless of worker allocation.

---

## Test Results by File Table

A paginated table with one row per spec file:

- **Search** box to filter files by name or path.
- A **Run** badge showing which test run the table belongs to.
- **Export CSV** button for the current (filtered) view.
- Columns: File, Total, Passed, Flaky, Failed, Timed Out, Interrupted, Skipped, Pass Rate (status counts rendered as colored badges).
- A pagination footer with page navigation and a page-size selector (10 files per page by default).

When no file data exists for the run, an empty state is shown.
