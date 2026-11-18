# Contributing

Zen Reporter is an npm workspaces monorepo — all runtime code lives under `packages/` (`core`, `cli`, `ui`, `reporter-playwright`).

> **Note on `@zen-reports/zen-server`**: The backend ingestion service is maintained in a separate repository ([zen-reports/zen-server](https://github.com/zen-reports/zen-server)) under the restrictive Functional Source License ([FSL-1.1-MIT](https://github.com/zen-reports/zen-server/blob/main/LICENSE)). See [docs/architecture.md](docs/architecture.md) and the [zen-server README](https://github.com/zen-reports/zen-server#readme) for details.

## Prerequisites

- Node.js >= 22 (see `engines` in the root `package.json`)
- npm (the repo uses npm workspaces and `package-lock.json`)

## Setup (fresh clone)

```bash
git clone https://github.com/zen-reports/zen-reports.git
cd zen-reports
npm install
npm run build

# Install Playwright browsers
npx playwright install
```

`npm run build` bootstraps every package in the correct dependency order:

```text
core → cli → ui → reporter:playwright
```

### Why the build order matters

All package `dist/` folders are gitignored, and build dependencies flow as follows:

1. `packages/cli` depends on `@zen-reports/zen-core`.
2. `packages/ui` depends on `@zen-reports/zen-core` and uses `@zen-reports/zen-cli` in dev mode for local API endpoints.
3. `packages/reporter-playwright` depends on `@zen-reports/zen-core` and `@zen-reports/zen-cli`, and copies the built UI bundle (`packages/ui/dist/index.html` + `favicon-*.svg`) into its own `dist/` as the self-contained report template.

The root `build` script resolves this by building in order: `core → cli → ui → reporter:playwright`. If you ever build packages individually, follow this order. See [docs/architecture.md](docs/architecture.md) for the full dependency graph.

## Scripts

| Script                                                                        | Purpose                                              |
| :---------------------------------------------------------------------------- | :--------------------------------------------------- |
| `npm run build`                                                               | Full monorepo build in correct fresh-clone order     |
| `npm run dev`                                                                 | Builds `core` + `cli`, then starts the UI dev server |
| `npm run build:core` / `build:cli` / `build:ui` / `build:reporter:playwright` | Individual package builds                            |
| `npm run typecheck`                                                           | Type-check all packages + the test suite             |
| `npm run lint` / `npm run lint:unused`                                        | ESLint + unused local/parameter checks               |
| `npm run format` / `npm run format:check`                                     | Prettier write / verify                              |
| `npm run spellcheck`                                                          | cspell across code, docs, and comments               |

Prefer these package scripts over invoking `tsc`/`vite`/`prettier` directly.

## Development server

`npm run dev` serves the UI dev server. It reads report data from the report directory (default `<repo-root>/zen-report/`; override with `PW_REPORTER_OUTPUT`) — generate one by running `npm run test`.

## Testing

- The repo's own test suite uses **Playwright only** (`tests/`). No other test runner is configured.
- ⚠️ Some tests **intentionally** fail or time out to produce realistic failure fixtures for the reporter output. Do not attempt to "fix" them.
