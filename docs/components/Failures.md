# Failures Tab

A failure-focused view of the run. It collects every failed, timed-out, and interrupted test into a single filterable list, grouped either by spec file or by error signature so you can spot shared root causes.

---

## Stat Cards

Three stat cards at the top of the tab:

| Card        | Meaning                                                 |
| :---------- | :------------------------------------------------------ |
| Failed      | Tests that hit assertion or runtime errors.             |
| Timed Out   | Tests that exceeded their timeout threshold.            |
| Interrupted | Tests stopped by worker crashes or process termination. |

If the run has no failures at all, a green "No failures — all tests passed successfully" banner is shown instead of the filter bar and list.

---

## Filter Bar

| Control  | Behavior                                                                                                                                    |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| Search   | Filters by test title, file name, or suite title/path.                                                                                      |
| Type     | Multi-select: Failed, Timed Out, Interrupted (only types present in the run are offered).                                                   |
| Projects | Multi-select of projects that have failures.                                                                                                |
| Tags     | Inline multi-select when 5 or fewer tags exist; otherwise a **tag cloud modal** with search, Select All, Clear, and per-tag failure counts. |
| Reset    | Clears all active filters.                                                                                                                  |

---

## Failure List

The list can be grouped in two modes using the **Group by** toggle:

| Mode  | Behavior                                                                                                                                                                                                 |
| :---- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File  | Failures grouped under each spec file (default).                                                                                                                                                         |
| Error | Failures clustered by error signature — tests sharing the same underlying error are grouped into one cluster, sorted by impact (most affected tests first), with the representative error message shown. |

Each group header shows the group name and count of failures, and each individual failure is rendered as a test case card that expands into the [test case detail](./Suites.md#test-case-detail): annotations, attempt selector, error alert, attachments, visual regression comparison, and stdout/stderr. Note that on this tab the **Execution Steps** section is omitted from the expanded detail; for the full step-by-step trace, open the same test in the [Suites tab](./Suites.md).

**Expand All** (<kbd>X</kbd>) and **Collapse All** (<kbd>S</kbd>) buttons control every group at once.

### Empty States

- **No matching failures**: shown when active filters eliminate all failures; includes a "Reset filters" button.
- **No failures found**: shown when no tests were executed in the run.
