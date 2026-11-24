# Guide Modal

The Guide Modal is the app's built-in contextual help system. Most report sections carry a small **Learn more** button; clicking it opens a modal that explains the metrics, thresholds, and diagnostic intent behind that section — no need to leave the dashboard.

---

## How It Works

- Each section renders a `Learn more` button next to its heading.
- The modal shows a **title**, **subtitle**, and a scrollable body of metric definitions, targets, and interpretation tips, with a **Close Guide** button in the footer.
- Press <kbd>Esc</kbd> (or click outside) to dismiss the modal.

---

## Available Guides

| Section (tab)                 | Guide title                                   |
| :---------------------------- | :-------------------------------------------- |
| Execution Runs History        | Historical Test Runs Guide                    |
| File Execution History        | File Execution History Guide                  |
| Test Execution History        | Test Execution History Guide                  |
| Flaky Tests                   | Flaky Test Analytics Guide                    |
| Regressions                   | Test Regressions Guide                        |
| Slowest Tests                 | Slowest Tests Guide                           |
| Pass Rate Trend               | Pass Rate Trend Guide                         |
| Duration Trend                | Project Duration Trend Guide                  |
| Step Category Composition     | Step Category Composition & Trend Guide       |
| Status Breakdown by Project   | About Status Breakdown by Project             |
| Test Volume & Coverage        | Test Volume & Coverage Density per Project    |
| Duration Spread & P95 Latency | About Duration Spread & P95 Latency Benchmark |
| Flaky Test Count & Retry Rate | Flaky Test Count & Retry Analytics Guide      |
| Project Health & Breakdown    | Project Health & Breakdown Guide              |

---

## Related Help

- Keyboard shortcuts cheatsheet: press <kbd>?</kbd> anywhere — see the [Keyboard Shortcuts Guide](../keyboard-shortcuts.md).
- Configuration options explained in the [Configuration guide](../configuration.md).
- The sidebar's **Config Generator** entry generates a ready-to-paste Playwright config — see [Config Generator](./ConfigGenerator.md).
