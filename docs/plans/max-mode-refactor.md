# MaxMode demo refactor plan

File currently: `src/pages/demos/MaxMode.tsx` (very large, mixed concerns: UI + API + persistence + cart + debug tooling).

This plan restructures MAX Mode into smaller, reusable pieces while keeping behavior the same and ensuring the project still builds after each step.

## Goals

- Separate **UI components** from **state/effects** and **API calls**
- Reduce the size/complexity of `MaxMode.tsx` without breaking behavior
- Improve reusability (cards, menus, message rendering, panels)
- Keep UI consistent with best practices (a11y, responsive layout, clear component boundaries)

## Current modules extracted (completed)

- `src/pages/demos/max-mode/types.ts` – shared types for the demo page
- `src/pages/demos/max-mode/utils.ts` – formatting + safe message normalization helpers
- `src/pages/demos/max-mode/actionMessage.ts` – action message parsing + icon selection
- `src/pages/demos/max-mode/components/ActionResultRenderer.tsx` – reusable renderer for action result payloads

## Target structure (end state)

`src/pages/demos/max-mode/`

- `types.ts`
- `constants.ts` (API base URL, quick actions, categories)
- `utils.ts` (formatting + parsing helpers)
- `api/`
  - `client.ts` (fetch wrapper + error handling)
  - `chat.ts` (query, suggestions, conversations CRUD)
  - `cart.ts` (active cart CRUD)
- `hooks/`
  - `useMaxModePersistence.ts` (sync with `MaxModeContext`, pending attachments)
  - `useMaxModeController.ts` (main state machine / reducer + side effects)
  - `useScrollSync.ts` (message-to-doc panel sync)
- `components/`
  - `MaxModeHeader.tsx`
  - `QuickActionsBar.tsx`
  - `QuickActionsSheet.tsx` (mobile)
  - `Chat/MessageList.tsx`
  - `Chat/MessageBubble.tsx`
  - `Chat/Composer.tsx` (textarea + send + attachments row)
  - `Panels/ContextPanel.tsx` (documents/product/cart)
  - `Panels/DebugPanel.tsx`
  - `ActionResultRenderer.tsx`

`src/pages/demos/MaxMode.tsx`

- stays as the route entry but becomes a thin wrapper that renders `MaxModePage` (or similar).

## Phase plan (incremental, build-safe)

### Phase 1: Extract “leaf” utilities + types (low risk)

- [x] Move types to `max-mode/types.ts`
- [x] Move `normalizeMessageContent`, `formatFieldName`, `formatFieldValue` to `max-mode/utils.ts`
- [x] Move action parsing/icon mapping to `max-mode/actionMessage.ts`
- [x] Extract `ActionResultRenderer` to `max-mode/components/ActionResultRenderer.tsx`

Build check: `npm run build`

### Phase 2: Extract UI-only components (medium risk, mostly prop threading)

- [ ] `MaxModeHeader` (top-right badge, close button, “Test Panel” button)
- [ ] `QuickActionsBar` (desktop) + `SearchCategoryMenu` + `BrowseProductsMenu`
- [ ] `QuickActionsSheet` (mobile bottom sheet)
- [ ] `MessageBubble` (user + AI variants) and keep the logic-free rendering there
- [ ] `ContextPanel` + `ProductDetails` + `CartView` into `Panels/`
- [ ] Centralize icon imports per component (avoid 1 giant lucide import list)

Build check after each extraction: `npm run build`

### Phase 3: State + side effects (highest value, higher risk)

Move state/effects out of the page into a controller hook:

- [ ] Replace dozens of `useState` calls with a `useReducer` state machine:
  - domain slices: `chat`, `attachments`, `documents`, `ui`, `debug`, `cart`, `conversations`
  - derived state via memo selectors (e.g., `hasAttachments`, `isLockedConversation`, `hasNewDocuments`)
- [ ] Split effects into focused hooks:
  - persistence sync
  - auto-scroll behavior
  - intersection observer logic
  - suggestions fetch (debounced + cancellation)
- [ ] Introduce an `api/` layer to dedupe fetch logic + normalize errors

Build check: `npm run build`

### Phase 4: UI polish + best practices

- [ ] Keyboard + a11y pass:
  - ensure dialogs/sheets have focus trapping and proper labels
  - ensure icon-only buttons have `aria-label`
  - ensure menus close on `Escape`
- [ ] Performance pass:
  - memoize large lists (`chatMessages`, context docs)
  - isolate expensive renders (result renderer, JSON panels)
  - avoid re-creating large arrays (quick actions, categories) on each render
- [ ] Visual consistency pass:
  - unify spacing/typography tokens across panels
  - reduce “magic” z-index values where possible

## TODO checklist (next concrete tasks)

- [ ] Create `src/pages/demos/max-mode/constants.ts` and move:
  - `quickActions`, `searchCategories`, `aiSearchCategories`, `browseProductCategories`
  - (optional) `API_BASE_URL` (or adopt a single shared config)
- [ ] Extract `MaxModeHeader` + `QuickActionsBar` first (lowest prop coupling)
- [ ] Extract `ContextPanel` next (lots of JSX but mostly presentational)
- [ ] Introduce `useMaxModeController` reducer (keep actions small and typed)
- [ ] Remove the legacy inline renderer block in `src/pages/demos/MaxMode.tsx` after confidence (should become a clean import-only usage)

