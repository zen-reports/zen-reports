# Run Switcher

The Run Switcher lets you move the entire dashboard — all tabs, charts, and tables — between recorded test runs. It is available from three surfaces:

1. The **quick run switcher dropdown** in the header.
2. The full **Switch Execution Run modal**.
3. The **Report column** in the [History tab](./History.md) runs table.

All three are available only when history mode records more than one run.

---

## Quick Run Switcher (Header)

A "Switch Run" button in the header opens a compact dropdown:

- A **Recent Executions** list of the five most recent runs, each showing branch, commit, date, duration, test count, and a pass-rate badge. The run you are currently viewing is pinned at the top with a **Viewing** badge, and the most recent run carries a **Latest** badge.
- A **Jump to Latest Run** entry (labeled with the latest run's name) that appears only when you are not already viewing the latest run; press <kbd>L</kbd> from the dropdown to trigger it.
- While the dropdown is open, pressing <kbd>1</kbd>–<kbd>4</kbd> switches directly to the non-active run shown at that position.
- A **Browse all N runs & search…** entry at the bottom that opens the full modal (<kbd>/</kbd>).

Press <kbd>Q</kbd> anywhere to open this dropdown without a mouse.

---

## Switch Execution Run Modal

The full modal (<kbd>/</kbd> from anywhere, or via the quick switcher) shows every recorded run:

- **Search** by run name, date, branch, or commit.
- One row per run showing: run name, a **Latest** badge on the most recent run (<kbd>L</kbd> jumps to it), branch, commit, start date, duration, test count, worker count, and a color-coded pass-rate badge.
- **Pagination** with <kbd>P</kbd>/<kbd>N</kbd> for previous/next page.
- Number-key shortcuts let you jump directly to a specific run in the current page.
- Selecting a run immediately loads its complete dashboard, suites, failures, and attachments.

---

## Switching From the History Table

Each row in the [Execution Runs History](./History.md) table has a **Report** button that switches the active run. The currently viewed run is highlighted with an eye icon, and the table automatically jumps to the page containing the selected run.

---

## Persisted Selection

The selected run is reflected in the URL (`?runId=`), so a specific run can be deep-linked or shared. Copying the active run's Git metadata is also possible from the header: <kbd>G</kbd> copies the commit SHA and <kbd>B</kbd> copies the branch name (with toast confirmation).

See the [Keyboard Shortcuts Guide](../keyboard-shortcuts.md) for the full shortcut list.
