# Summary (Standalone `summary.html`)

An executive, single-file view of one test run. When `singleSummaryFile: true` is configured, Zen Reporter writes an independent, self-contained `summary.html` (and `summary.json`) into the output directory — a lightweight page that embeds the run's key results without historical runs or full suite-trace attachments.

---

## What You See

The summary view renders the same content as the [Overview tab](./Overview.md), minus all tab navigation:

- **Notifications banner** (atop the Overview, when notifications exist — see below).
- **Test Results Hero**: pass-rate ring, run metadata (duration, projects, files, tests, workers, Playwright version, OS), and the full outcome breakdown (Passed, Flaky, Failed, Timed Out, Interrupted, Skipped).
- **Executive diagnostic cards**: Test Speed & Consistency, Parallel Speedup, and Worker Utilization (hidden when [Minimal Report](../configuration.md) mode is active).

What is hidden in summary view:

- The [sidebar](./Sidebar.md) and all other tabs (Projects, Suites, Files, Failures, History, Insights, Trends).
- The **Switch Run** quick switcher in the [header](./Header.md), since standalone summaries embed no historical runs to switch between.
- The header still shows the project → run breadcrumb and run metadata.

---

## Notifications Banner

When the run recorded configuration notices or system alerts (for example misspelled config keys, a custom output directory, or a remote-history ingestion fallback), a prominent banner appears at the top of the Overview:

- Headline with the highest-severity notice (warnings take priority over info), its message, and a `(+N more notices)` overflow count.
- An amber appearance when any warning is present; otherwise a blue info styling.
- An unread-count badge and a **View All** button with the <kbd>O</kbd> keycap, which opens the [Notification Center modal](./Sidebar.md#notification-center) for the full list.

---

## Where to Use It

- **CI/CD artifacts**: attach it as a GitHub Actions Job Summary or GitLab artifact.
- **Automated notifications**: embed it in Slack or email test-run reports.
- **Quick handoffs**: share a single file that needs no server, database, or full report payload.

---

## Enabling It

```ts
export default defineConfig({
  reporter: [
    [
      '@zen-reports/zen-reporter-playwright',
      {
        singleSummaryFile: true,
      },
    ],
  ],
});
```

The toggle is also available in the [Config Generator](./ConfigGenerator.md) modal. Full option details are in the [Configuration guide](../configuration.md); the <kbd>O</kbd> shortcut is covered in the [Keyboard Shortcuts Guide](../keyboard-shortcuts.md).
