# Visual Diff Viewer

A specialized modal component for inspecting visual regression test failures. When a test includes visual comparison artifacts (snapshots comparing expected vs actual screen captures), Zen Reporter embeds the **Visual Diff Viewer** inside the [test case detail](./Suites.md#test-case-detail).

---

## Overview

The viewer displays the comparison target name and provides an interactive inspection canvas with four view modes to pinpoint pixel shifts and rendering regressions.

---

## View Modes

Switch between view modes using the toolbar selector or keyboard shortcuts:

| Mode                    | Key          | Behavior                                                                                                                                                          |
| :---------------------- | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Slider**              | <kbd>1</kbd> | An interactive before/after split slider allowing you to drag the divider horizontally to reveal expected vs actual images.                                       |
| **2-Up (Side by Side)** | <kbd>2</kbd> | Displays the expected baseline image and actual test snapshot side by side with synchronized dimensions.                                                          |
| **Diff Overlay**        | <kbd>3</kbd> | Highlights mismatching pixels. If Playwright generated an image diff artifact (`diffUrl`), it renders the diff; otherwise, it applies CSS difference blend modes. |
| **Onion Skin**          | <kbd>4</kbd> | Overlays actual and expected images with an adjustable transparency opacity slider to spot subtle layout shifts.                                                  |

---

## Controls & Keyboard Shortcuts

- <kbd>1</kbd> – Switch to **Slider** mode.
- <kbd>2</kbd> – Switch to **2-Up (Side by Side)** mode.
- <kbd>3</kbd> – Switch to **Diff Overlay** mode (available when diff image or CSS blend mode is applicable).
- <kbd>4</kbd> – Switch to **Onion Skin** mode.
- <kbd>Esc</kbd> – Close the visual diff viewer modal.

---

## Related

- Opening visual regression comparisons from test cases: see the [Suites tab](./Suites.md#test-case-detail).
- Inspecting other test artifacts (logs, videos, screenshots): see [Universal Preview Modal](./UniversalPreview.md).
