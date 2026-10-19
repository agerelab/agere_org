# Agere DS × Next.js App Router — example venture app

A Server-Component-first venture app that consumes Agere DS straight from source.

```bash
# from the repo root
npm install
npm run tokens
npx next build examples/next-app    # or: npx next dev examples/next-app
```

What it shows:
- `app/layout.tsx` — theme + density from cookies on `<html>` (no flash), global CSS import.
- `app/providers.tsx` — the only client boundary at the root (Tooltip, Toaster).
- `app/w/[list]/[view]/page.tsx` — view in the URL, data fetched on the server (`lib/data.ts`, `server-only`).
- `workspace-client.tsx` — ViewSwitcherBar + FilterBar + TaskList/Kanban/Gantt with `useOptimistic` and a Server Action (`actions.ts`).
- `loading.tsx` / `error.tsx` — Skeleton and Alert states.

Built and verified with Next.js 16 (Turbopack) and React 19. `params`, `searchParams` and `cookies()` are async in Next 15+.
