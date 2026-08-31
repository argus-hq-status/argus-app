# Unify the dashboard into a professional operations-console system

Written against: 660dce4

## Evidence chain

- Surface: `src/routes/_dashboard.tsx` and all `/_dashboard` child routes
- Problem: the dashboard mixes shared semantic primitives with route-local `zinc`, `gray`, and default `blue` utilities, one-off buttons, and unrelated surface treatments; the result is inconsistent hierarchy, color, focus, density, and dark-mode behavior.
- Design evidence: `src/styles/app.css`, `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/data-table.tsx`, `src/components/page-header.tsx`, and the rendered composition traced from `src/routes/_dashboard.tsx`.
- Owner: semantic tokens in `src/styles/app.css` and reusable primitives in `src/components/ui/`.
- Scope and affected surfaces: the authenticated dashboard shell, overview, monitors, incidents, status pages, alert channels, billing, and their shared non-auth components.
- Uncertainty: no formal DESIGN.md exists; current product behavior, content, and route structure are treated as binding while visual styling is refined.

## Design decision

Use a compact, dark-first operations-console language with calm neutral surfaces and a distinctive iris-blue primary family. Route all recurring controls and containers through semantic tokens and shadcn-style primitives, strengthen type hierarchy, and reserve color for selection, action, and system status.

## Reuse

- `Button`, `ActionButton`, `Card`, `Badge`, `Input`, `Select`, `Tabs`, `DataTable`, and existing Radix-based dropdown/drawer primitives.
- Exemplar: `src/components/ui/button.tsx`
- Add only reusable semantic design tokens and a small dashboard-specific surface primitive where existing owners cannot express the repeated pattern.

## Changes

1. `src/styles/app.css`
   - Change: add a dashboard-scoped font stack, iris-blue brand tokens, four-level text/surface hierarchy, control tokens, focus treatment, selection, scrollbar, and restrained motion defaults.
   - Preserve: Clerk/auth overrides and public authentication appearance.
   - Verify: dashboard light and dark themes share one semantic system while auth pages remain visually unchanged.
2. `src/components/ui/*`
   - Change: normalize buttons, cards, fields, tabs, tables, menus, badges, and drawers to the shared tokens, 4px spacing grid, concentric radii, explicit focus, and named transitions.
   - Preserve: component APIs and behavior.
   - Verify: existing call sites inherit consistent states without route-level restyling.
3. `src/routes/_dashboard.tsx` and shared dashboard components
   - Change: rebuild the shell hierarchy around semantic surfaces, a calmer 240px sidebar, a compact page frame, reusable icon controls, and intentional iris-blue active/action states.
   - Preserve: navigation, organization switching, onboarding progress, account menu, and theme behavior.
   - Verify: active navigation, collapsed navigation, onboarding progress, and user menu remain obvious at desktop and narrow widths.
4. Dashboard child routes and non-auth components
   - Change: replace repeated hardcoded neutral/blue styling with tokens and primitives; align page headers, action rows, data surfaces, empty/loading states, and forms.
   - Preserve: data fetching, business rules, copy, charts, and interactions.
   - Verify: overview, list, detail, create, incidents, status pages, alert channels, and billing form one coherent product family.

## Scope

- Inherit: all authenticated dashboard consumers of shared UI primitives.
- Verify: public status pages only where they consume a shared primitive; retain their intentional public theme.
- Exclude: `src/routes/_auth*`, `src/components/auth-*`, Clerk auth styling, onboarding, and public marketing/auth content.

## Validation

- Product: navigate among all dashboard routes and complete primary create/edit/open actions without behavior changes.
- Interface: verify default, hover, focus-visible, active, disabled, loading, and empty states at desktop and mobile widths in both themes.
- System: confirm repeated controls use shared primitives and no parallel default-blue dashboard pattern remains.
- Repository: `yarn typecheck && yarn lint && yarn build` → all commands succeed.

## Stop conditions

- Stop if a visual edit requires changing API behavior, authentication flow, product copy, or public status-page identity.

## Design documentation

- After acceptance and validation: save the dashboard direction, token palette, density, depth strategy, typography, and reusable component measurements to `.interface-design/system.md` if requested.
