# Trends Tab

Chart-based trends across recent runs (the 15 most recent by default). Trends require **server mode** — standalone offline reports show a notice for the pass-rate and duration charts, while the step-category composition of the current run is still rendered.

All three trend views include interactive Recharts visualizations synchronized with collapsible historical data tables supporting CSV export.

---

## Pass Rate Trend

A line chart of the run pass rate (0–100%) across the most recent runs (displaying up to 15 runs).

- **Hover Inspection**: Hovering a chart point shows the test run name, ISO date/time, and exact pass rate percentage. Hovering synchronously highlights the corresponding run in the table below.
- **Expandable Data Table**: A collapsible section labeled "Show run history" / "Hide run history" embeds a data table with the following columns:
  - **Run Name**: Test run name or ID.
  - **Branch**: Git branch with tooltip showing branch and commit.
  - **Commit**: 7-character Git commit SHA with tooltip showing the full commit SHA.
  - **Date**: Localized start timestamp (`started_at`).
  - **Tests**: Total test executions.
  - **Status Breakdown**: Passed, Flaky, Failed, Timed Out, Interrupted, and Skipped counts.
  - **Pass Rate**: Color-coded pass rate badge.
- **CSV Export**: The **Export to CSV** button exports the full filtered tabular history to a CSV file.
- **Empty State**: When fewer than two runs are recorded, the section shows an empty state suggesting to run `npx zr history report` after future executions (see the [CLI guide](../cli.md)).

**Learn more** opens the pass rate guide modal.

---

## Duration Trend

A multi-line chart of execution duration in seconds, one line per Playwright project across recent runs.

- **Metric Definition**: Duration reflects sequential effort duration (sum of test durations in seconds per project).
- **Interactive Line Inspection**: Each project is assigned a distinct palette color and appears in the chart legend. Hovering over data points or lines highlights that project across runs and displays a tooltip with the run name, timestamp, and formatted durations per project. Hovering synchronously highlights the corresponding row in the table below.
- **Expandable Data Table**: A collapsible table showing:
  - **Run Context**: Run Name, Git Branch, and 7-character Git Commit hash.
  - **Date**: Local start timestamp.
  - **Project Breakdown**: Dedicated, color-coded column per project matching the chart palette with formatted duration values.
- **CSV Export**: Download all historical duration metrics via the **Export to CSV** button.

**Learn more** opens the duration guide modal.

---

## Step Category Composition & Trend

Breaks every recorded test step into categories — **Assertions**, **Hooks & Setup**, **Network & API**, **User Actions**, **Waits**, and **Others** — and charts how the mix shifts across runs.

| Element               | Behavior                                                                                                                                                                          |
| :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| View mode toggle      | `% Normalized` (proportional view, default) or `Step Count` (absolute counts).                                                                                                    |
| Stacked bar chart     | One stacked bar per recent run, colored by category with interactive hover highlighting and tooltips breaking down category counts and percentages.                               |
| Legend toggles        | Clicking a category in the legend hides or shows that category across the chart (at least one category remains visible).                                                          |
| Expandable Data Table | Collapsible table detailing Run Name, Git Branch, 7-character Commit SHA, Total Steps, and dynamic category columns showing percentages/counts depending on the active view mode. |
| CSV Export            | Download historical step category metrics via the **Export to CSV** button.                                                                                                       |

**Learn more** opens the step category guide modal.

When neither the current run nor historical runs recorded any steps, an empty state explains that no step data is available.
