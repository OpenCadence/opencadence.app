# Contributing to the OpenCadence website

Thanks for helping improve the OpenCadence marketing website.

## Local development

Requirements:

- Node.js 22.13 or newer
- pnpm

Install dependencies and start the development server:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open the local address shown in your terminal, normally <http://127.0.0.1:3000>.

The site does not require environment variables, accounts, or external services for local development.

## Checks

Run the full check suite before opening a pull request:

```bash
pnpm check
```

Individual checks are also available:

```bash
pnpm format:check
pnpm typecheck
pnpm build
pnpm test
```

Browser tests start a local production server at `127.0.0.1:3101` and use Playwright-managed browser binaries. If the browsers are not installed, run `pnpm exec playwright install`.

## Pull requests

1. Create a focused branch from `main`.
2. Make the smallest clear change that solves the problem.
3. Run `pnpm check`.
4. Describe the change and include screenshots for visual updates.
