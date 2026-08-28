# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Current design direction

The selected visual is the second Product Design concept: a minimal, light operational interface with a strong green accent, generous whitespace, a left-aligned sign-in form, and a compact state-preview column. Authentication and every approved authenticated workflow use real Spring Boot endpoints; never reintroduce mock business data or fake timers.

The authenticated shell extends that direction with a light labeled sidebar on desktop and a collapsed icon rail on tablets. Its management dashboard uses the selected first dashboard concept: shared filters, seven compact KPI cards, paired green trend charts, category/language donut breakdowns, three product/stock tables, and an explicit loading/empty/error state row. Preserve subtle light-gray table headers, Manrope typography, the restrained Maarif green palette, realistic synthetic Moroccan bookstore data, MAD currency, and Africa/Casablanca dates. Do not add dashboard features outside that selected visual and brief.

The product catalogue extends the same approved shell and dense operational table language. Keep its search server-style, its category/language/active-status filters compact, its table headers light gray, and its create/view/edit/disable actions permission-aware. Preserve local table scrolling at narrow breakpoints rather than allowing document-level horizontal overflow.

Create and edit product screens share one responsive editor within the catalogue workflow. Preserve the four-section structure (general information, classification, pricing/stock, supply), inline validation, sticky desktop actions, native active-status checkbox, unsaved-change warning, and success/failure feedback. Do not replace the full page with a modal.

The product details screen extends that workflow with four compact KPI cards, paired bibliographic and supplier panels, recent-sales and stock-movement panels, then paired forecast and reorder-recommendation panels. Keep edit and disable permission-aware, preserve light-gray table headers, and use local table scrolling on mobile instead of document-level overflow.

The inventory screen reuses the catalogue toolbar, table, status, pagination, and modal language. Keep inventory status filters grouped with category and language, place recent movements below the paginated stock table, and preserve local scrolling for both tables on mobile. The stock-movement sheet uses a two-step “saisir → confirmer” flow, supports the six approved movement types, requires a reason, explains the stock equation, and blocks any result below zero.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Use route-level TypeScript pages under `src/pages`, API modules under `src/api`, TanStack Query for server state, React Hook Form with Zod for forms, and the shared session/CSRF client. The legacy single-file prototype remains under `src/legacy` only as a visual reference and must never be imported by the production entry point.
