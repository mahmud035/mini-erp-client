# Mini ERP — Frontend (Client)

Assessment build: React SPA for the Inventory & Sales API. Trustworthy over flashy.

## Stack (pinned)

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · ShadCN
TanStack Query v5 · Axios · React Hook Form + Zod v4 · React Router v7

## Commands

- `npm run build` → MUST be clean
- `npm run typecheck` → `tsc --noEmit`, MUST be clean
- `npm run lint` → ESLint, MUST be clean
- `npm run dev` → Vite dev server

## Structure (strict)

src/
api/ // Axios instance + shared API response types
components/
layout/ // Navbar, Footer, Layout shells
ui/ // dumb, presentational, reusable only
features/ // domain modules — 1:1 with backend (auth, product, customer, sale, role, user, dashboard)
hooks/ // extract ONLY when logic is genuinely reused
pages/ // route-level orchestration only
providers/ routes/ utils/ main.tsx

## Discipline

- Pages orchestrate; features execute.
- Features map 1:1 to backend domains. NO cross-feature imports — if two features share
  something, promote it to components/ui, hooks/, or utils/ first.
- ALL server state via TanStack Query. Local state only for UI behaviour.
- Forms via React Hook Form + Zod. UI components presentational only — no business logic in JSX.
- Frontend types MIRROR the backend response envelope { statusCode, success, message, data }.
  An API contract change must break TypeScript at COMPILE time, not runtime.
- Every data-driven view defines loading, empty, AND error states explicitly. Silence is a bug.
- Skeleton loaders over spinners. Explicit microcopy for external links. Semantic Tailwind tokens.
- Auth is via HTTP-only cookies — Axios instance uses `withCredentials: true`. Never store tokens in JS.
- API base URL from an env var (VITE_API_URL). Never hardcode.

## Working agreement (enforced)

- Work proceeds in GATED BATCHES. Do only the batch given. STOP at its gate. Do NOT run ahead.
- Only make changes directly requested. No extra features, no refactor beyond scope. No gold-plating.
- Use Plan Mode: propose structure, wait for approval, then write.
- After each step, output: ✅ `what was completed`.
- STOP and ask before destructive actions. Surgical edits only — never regenerate unchanged code.
