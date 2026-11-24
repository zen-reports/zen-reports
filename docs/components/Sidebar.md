# Sidebar

The left navigation rail of the dashboard. It contains the app branding, the eight report tabs, and the utility actions (shortcuts, config generator, collapse).

---

## Branding

At the top of the expanded sidebar: **Zen Reporter** with the package version, and the tagline "Beautiful Playwright Reports".

---

## Navigation Tabs

Eight tabs, each rendered as an icon + label button:

| Tab      | Key | Notes                                                                                                  |
| :------- | :-- | :----------------------------------------------------------------------------------------------------- |
| Overview | 1   | Run summary hero and diagnostics.                                                                      |
| Projects | 2   | Project-level comparisons.                                                                             |
| Suites   | 3   | Suite tree and individual test cases.                                                                  |
| Files    | 4   | Per-spec-file metrics.                                                                                 |
| Failures | 5   | Failure list; shows a count badge when failures exist in the run.                                      |
| History  | 6   | Cross-run audit log; shows a disabled badge ("History recording disabled") when history is turned off. |
| Insights | 7   | Flaky / regression / slowest analytics.                                                                |
| Trends   | 8   | Trend charts.                                                                                          |

- The active tab is highlighted with a sliding pill indicator.
- Pressing the digit keys <kbd>1</kbd>–<kbd>8</kbd> jumps directly to a tab; <kbd>[</kbd>/<kbd>]</kbd> step to the previous/next tab.

---

## Utility Actions

At the bottom of the sidebar:

| Action           | Key | Behavior                                                                                                                                                                                                                          |
| :--------------- | :-- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Notifications    | o   | Opens the [Notification Center modal](#notification-center). Shows an amber unread-count badge while unread notifications exist, and a neutral total-count badge once all are read; in collapsed mode the badge renders as a dot. |
| Config Generator | c   | Opens the [Playwright Config Generator modal](./ConfigGenerator.md).                                                                                                                                                              |
| Shortcuts        | ?   | Opens the keyboard shortcuts cheatsheet modal.                                                                                                                                                                                    |
| Collapse         | \   | Collapses the sidebar to icons-only (labels hidden; the Failures badge and History disabled marker remain visible).                                                                                                               |

---

## Notification Center

The **Notifications** entry opens a modal listing everything recorded for the active run: configuration warnings (for example misspelled config keys with did-you-mean suggestions), run-scoped config notices (such as a custom output directory), and system notices/alerts (such as a remote-history ingestion fallback). Each item shows a severity badge (Warning, Error, Success, or Info), a scope badge (Run or System), its title and message, and a read state — keys <kbd>1</kbd>–<kbd>9</kbd> toggle individual items read/unread, and <kbd>R</kbd> marks everything read. When there is nothing to show, the modal displays "All caught up!".

In the standalone [Summary view](./Summary.md) the same notifications are surfaced inline as a banner atop the Overview.

---

## Notes

- The sidebar is hidden in the summary (single-page) report view.
- All keys above also work from the [Keyboard Shortcuts Guide](../keyboard-shortcuts.md).
