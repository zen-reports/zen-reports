# Universal Preview Modal

A full-screen modal for inspecting a test attempt's artifacts — logs, code files, screenshots, and videos — with a unified carousel. It opens from the [test case detail](./Suites.md#test-case-detail) when you click an attachment, a stdout/stderr block, or a previewable item.

---

## Preview Items

The modal builds its item list from the selected attempt, in this order:

1. **Standard Output (stdout)** — labeled "Log".
2. **Standard Error (stderr)** — labeled "Error Log".
3. **Attachments** — every file attached to the attempt.

Each item is classified by content type:

| Type             | Rendering                                                             |
| :--------------- | :-------------------------------------------------------------------- |
| Text             | Plain-text logs and code files with per-language syntax highlighting. |
| Image            | Zoomable image viewer (see below).                                    |
| Video            | In-modal video player.                                                |
| Archive / binary | Not rendered inline; available via the Download button.               |

Item titles show the resolved file name, with the extension inferred from the file path or MIME type when the attachment name lacks one.

---

## Image Viewer

Images support a zoom control overlay:

- **Zoom in** (<kbd>+</kbd>) up to 400%.
- **Zoom out** (<kbd>-</kbd>) down to 25%.
- **Reset** back to 100%, with the current zoom percentage displayed.

---

## Navigation & Search

- **Previous / Next** buttons step through items, with a `i of n` counter.
- Keyboard: <kbd>←</kbd> or <kbd>p</kbd> for previous, <kbd>→</kbd> or <kbd>n</kbd> for next.
- **Search** box for text items ("Search log... (f)") filters the visible lines, with a clear button and a "No matching lines found" message when nothing matches. Search and zoom reset when you switch to a different item.
- **Esc** closes the modal.

---

## Download

A **Download** button in the modal footer saves the current item (stdout as `test-stdout.log`, stderr as `test-stderr.log`, or the attachment file with its resolved name).
