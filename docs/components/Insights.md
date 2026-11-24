# Insights Tab

Deep cross-run analytics computed from the history database. It surfaces three lists: flaky tests, regressions, and the slowest tests. Insights are only available in **server mode**; standalone offline reports show a notice explaining that flaky, regression, and slowest-test analytics require the project database.

> **Note:** If history recording is disabled in the configuration, a banner at the top of the tab explains that analytics are unavailable.

---

## Flaky Tests

Tests that have failed on the first attempt but passed on a retry, aggregated across runs.

- Columns: Suite, Test, Project, Last Flaky Date, Failed Runs, Passed Runs, Recovered by Retry, Total Runs.
- **Date range filter** (based on the last flaky date), **search** by test title, suite, or project, **Export CSV**, and pagination (10 rows per page by default).
- **Learn more** opens the Flaky Test Analytics guide modal.

---

## Regressions

Tests that passed in a prior run but failed in a subsequent run.

- Columns: Test, Suite, Project, Regressed In (when the regression was detected), Last Run, and Last Run Status (a status pill with a tooltip explaining the current state).
- **Date range filter**, **search** by test title, suite, or project, **Export CSV**, and pagination (10 rows per page by default).
- **Learn more** opens the Test Regressions guide modal.

---

## Slowest Tests

The top 5 tests with the highest average execution duration across historical runs.

- Columns: Suite, Test, Project, Runs Count, Average Duration, Max Duration, Last Run Duration, Last Run, Last Run Status.
- **Export CSV** of the table.
- **Learn more** opens the Slowest Tests guide modal.
- When no duration data exists, the section shows a "No test duration data" message.

---

## Guides

Each section's **Learn more** button opens a [guide modal](./GuideModal.md) with metric definitions, targets, and diagnostic guidelines for that insight type.
