# Config Generator

An interactive modal that generates a ready-to-paste Playwright configuration snippet for Zen Reporter. Open it from the sidebar's **Config Generator** entry or by pressing <kbd>c</kbd> anywhere.

---

## Overview

- Title: **Playwright Config Generator** with the subtitle "Customize Zen Reporter options and copy the configuration directly into your `playwright.config.ts`" (or the matching target file for the selected format).
- A status chip shows either **Active configuration** (your current settings, unmodified) or **Modified configuration** with a **Reset all** button that restores the original values.
- A live code preview shows the generated configuration as you change options.

---

## Settings

### General Settings

| Option           | Purpose                                                          |
| :--------------- | :--------------------------------------------------------------- |
| Project Name     | Playwright project/profile name used in the generated config.    |
| Test Run Name    | Name given to the run in the report (e.g. `Nightly Build #{N}`). |
| Output Directory | Where reports are written.                                       |

### Theme & Presentation

| Option                    | Options                                                                                                                                 |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------- |
| Theme                     | Sage (Green / Classic), Lotus (Indigo / Lime), Oasis (Electric Blue / Navy).                                                            |
| Dark Mode State           | Follow OS (system), Dark Mode Always, Light Mode Always.                                                                                |
| Standalone `summary.html` | Toggle (on by default in the generator) to also emit an independent, self-contained `summary.html` — see [Summary](./Summary.md).       |
| Minimal Report            | Toggle that disables run history tracking and produces a lightweight report that hides the heavy analytical and historical trend views. |

### History & Execution

| Option                 | Details                                                                                                                                                          |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| History Recording Mode | **Auto** (SQLite / DuckDB if installed), **Explicitly Enabled** (requires `@duckdb/node-api`), **Disabled** (single-run only), or **Remote SaaS / Team Server**. |
| Server URL             | Required in remote mode.                                                                                                                                         |
| Project Identifier     | Required in remote mode.                                                                                                                                         |
| API key                | The generated remote snippet references `process.env.ZEN_REPORTER_API_KEY`.                                                                                      |
| Advanced (remote)      | Run ID expression (e.g. `process.env.GITHUB_RUN_ID`), request timeout (ms), and "Fallback to local SQLite if remote unreachable" toggle.                         |
| Database File          | Local database path (default `history.db`) for non-remote modes.                                                                                                 |
| Report Runs            | How many runs to keep/report (default 50).                                                                                                                       |
| Retention Limit        | Maximum retained history rows (default 1000).                                                                                                                    |

### Console Progress

| Option           | Options                                                                        |
| :--------------- | :----------------------------------------------------------------------------- |
| Progress style   | Auto (detect TTY), Single Line Ticker, Multi-Line Dot Mode, Disabled (Silent). |
| Auto-Open Report | Never, On Failure Only, or Always.                                             |

---

## Output Format & Copy

- A format selector renders the snippet as **TypeScript (.ts)**, **JavaScript (.js)**, or **JSON (`zen.config.json`)** (the JSON format produces a standalone `zen.config.json` file).
- The **Copy** button copies the full generated configuration to the clipboard and flips to **Copied!** for a moment.

---

## Related

- What each generated option does at runtime: see the [Configuration guide](../configuration.md).
- Opening the modal: <kbd>c</kbd> (see [Keyboard Shortcuts Guide](../keyboard-shortcuts.md)).
