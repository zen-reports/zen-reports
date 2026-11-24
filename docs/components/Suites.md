# Suites Tab

The drill-down view of the run: a hierarchical tree of test suites containing every individual test case, with filtering, search, and per-test detail inspection. This is where you find specific failing tests, read their execution steps, and inspect errors, attachments, and logs.

---

## Summary Stats

Three stat cards at the top of the tab:

| Card        | Meaning                                                                                                                                                                                                                                                 |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Files       | Total test spec files executed in the run.                                                                                                                                                                                                              |
| Suites      | Total number of top-level describe suites across all spec files (if a spec file contains root describe blocks, those are counted individually; if a spec file has no root describe suites or only standalone tests, the file itself counts as 1 suite). |
| Total Tests | Total test cases executed across all suites.                                                                                                                                                                                                            |

---

## Filter & Search Bar

A control bar above the suite tree:

| Control | Behavior                                                                                                                                                                       |
| :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search  | Filters suites by test title, file name, or path. Press <kbd>F</kbd> to focus it from anywhere.                                                                                |
| Status  | Multi-select dropdown for statuses: Passed, Flaky, Failed, Skipped, Timed Out, Interrupted.                                                                                    |
| Project | Multi-select dropdown of all Playwright projects present in the run.                                                                                                           |
| Tags    | If 5 or fewer tags exist, an inline multi-select dropdown; otherwise a **tag cloud modal** with search, Select All, and Clear. A count badge shows how many tags are selected. |
| Reset   | Appears when any filter is active; clears all filters at once.                                                                                                                 |

Suites (and nested suites) that contain no tests matching the active filters are hidden from the tree.

---

## Suite Tree

- A header row shows `Showing N top-level suites` plus **Expand All** (<kbd>X</kbd>) and **Collapse All** (<kbd>S</kbd>) buttons.
- Each suite renders as a collapsible panel whose header shows:
  - Suite title with an expand chevron.
  - Test count, cumulative duration, and pass rate.
  - Status chips for any non-zero outcomes: `skipped`, `interrupted`, `timed out`, `failed`, `flaky`, `passed`.
- Test cases appear inside the panel, and nested suites are listed under a **Nested Suites** heading, indented with a guide border.

When no suites remain after filtering, an empty state explains that no suites match the selected criteria.

---

## Test Case Cards

Every test case is a compact card showing:

- A status icon and the test title.
- A status chip (Passed, Flaky, Failed, Skipped, Timed Out, Interrupted).
- A retry badge (`N Retries`) when the test needed more than one attempt.
- The test duration.
- Tag chips for any tags applied to the test.

Clicking the card (or its chevron button) expands the full detail view. If the report was saved without step/error/attachment payloads, expanding triggers an on-demand fetch from the server (a spinner shows while loading); if no server data is available, whatever detail is embedded in the report is shown.

### Test Case Detail

The expanded section contains, in order:

| Section                      | What it shows                                                                                                                                                                                                      |
| :--------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Annotations & Description    | User-supplied test annotations and descriptions, each with its annotation type.                                                                                                                                    |
| Attempt selector             | Tabs for each attempt when the test was retried; the latest attempt is selected by default.                                                                                                                        |
| Execution Steps              | Numbered steps with titles, parameters, durations, and sub-steps, plus a filter box to narrow steps by title or argument.                                                                                          |
| Attachments                  | Clickable attachment thumbnails/items that open in the [Universal Preview Modal](./UniversalPreview.md).                                                                                                           |
| Error alert                  | The error message, stack trace, and code snippet for the selected attempt's failure.                                                                                                                               |
| Visual Regression Comparison | Side-by-side actual/expected/diff viewer with 4 interactive view modes (Slider, 2-Up, Diff Overlay, Onion Skin) when visual regression screenshots are attached (see [Visual Diff Viewer](./VisualDiffViewer.md)). |
| Standard Output              | `stdout` and `stderr` blocks; lines are clickable and open in the [Universal Preview Modal](./UniversalPreview.md).                                                                                                |

If an attempt has no recorded details at all, a fallback message states that no detailed steps or errors were recorded.

---

## Keyboard Shortcuts

Press <kbd>X</kbd> or <kbd>S</kbd> to expand or collapse all suites from anywhere. See the [Keyboard Shortcuts Guide](../keyboard-shortcuts.md) for the full list.
