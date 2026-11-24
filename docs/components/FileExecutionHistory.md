# File Execution History

A section inside the [History tab](./History.md) that aggregates test results per spec file across all recorded runs. It answers "how has this spec file been performing over time?" — useful for spotting files that are consistently failing or gradually regressing.

---

## Table

One row per unique spec file, aggregated across the selected date range:

| Column                                                      | Content                                                                                                                      |
| :---------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| Spec File                                                   | File name/path (truncated with tooltip).                                                                                     |
| Runs                                                        | Number of distinct runs in which the file was executed (with a "Filtered" badge on the header when a date filter is active). |
| Total Tests                                                 | Sum of test executions across runs.                                                                                          |
| Passed / Flaky / Failed / Timed Out / Interrupted / Skipped | Aggregated outcome counts as status badges.                                                                                  |
| Pass Rate                                                   | Aggregated pass rate (passed + flaky over total), color-coded.                                                               |

Rows are sorted by total test count, most-executed files first.

---

## Controls

- **Date range filter** (from/to pickers with quick presets) limiting which runs are aggregated.
- **Search** by file name or path.
- **Export CSV** of the filtered, aggregated rows.
- **Pagination** (10 files per page by default) with a page-size selector.
- **Learn more** button opens the File Execution History guide modal (see [Guide Modal](./GuideModal.md)).

---

## Availability

This section requires server mode. In standalone offline reports the [History tab](./History.md) shows a notice instead of the table.
