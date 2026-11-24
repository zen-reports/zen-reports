# Header

The top bar of the dashboard, always visible above the active tab content. It shows where you are (project → run), quick run metadata, the quick run switcher, and the theme controls.

---

## Breadcrumb

The first row of the header shows:

- The **project name** (or "Test Execution Report" when no project name is configured), in bold.
- An arrow separator.
- The **test run name** (or "Playwright Test Reporter" when unnamed).

---

## Run Metadata Strip

The second row lists, separated by dividers:

| Item               | Behavior                                                                                                          |
| :----------------- | :---------------------------------------------------------------------------------------------------------------- |
| Quick run switcher | "Switch Run" dropdown — see [Run Switcher](./RunSwitcher.md). Shown only when history contains more than one run. |
| Execution window   | Start–end date range of the run (with a calendar icon).                                                           |
| Duration           | Total run duration (green).                                                                                       |
| Git branch         | Branch name with a copy button (<kbd>B</kbd> copies it to the clipboard, toast confirmation).                     |
| Git commit         | Short commit SHA (monospaced) with a copy button (<kbd>G</kbd> copies the full SHA).                              |

Branch/commit entries only appear when Git metadata was captured for the run.

---

## Theme Controls

The right side of the header has two segmented groups, each with a sliding active indicator:

- **Theme**: `Sage`, `Lotus`, or `Oasis` (each button shows a color dot preview of the palette).
- **Dark mode**: System (follows the OS), Light, or Dark. The choice is persisted in `localStorage` and survives page reloads.

Unrecognized or legacy theme names safely fall back to `Sage` and surface an amber dashboard toast — see the [Configuration guide](../configuration.md).

---

## Related

- Full keyboard shortcuts for header actions: [Keyboard Shortcuts Guide](../keyboard-shortcuts.md).
- Switching runs from the header: [Run Switcher](./RunSwitcher.md).
