# MaxMode demo refactor plan

File currently: `src/pages/demos/MaxMode.tsx` (very large, mixed concerns: UI + API + persistence + cart + debug tooling).

This plan restructures MAX Mode into smaller, reusable pieces while keeping behavior the same and ensuring the project still builds after each step.

## Goals

- Separate **UI components** from **state/effects** and **API calls**
- Reduce the size/complexity of `MaxMode.tsx` without breaking behavior
- Improve reusability (cards, menus, message rendering, panels)
- Keep UI consistent with best practices (a11y, responsive layout, clear component boundaries)

## Current modules extracted (completed)

- `src/pages/demos/max-mode/constants.ts` – API base URL + quick actions/categories data
- `src/pages/demos/max-mode/types.ts` – shared types for the demo page
- `src/pages/demos/max-mode/utils.ts` – formatting + safe message normalization helpers
- `src/pages/demos/max-mode/actionMessage.ts` – action message parsing + icon selection
- `src/pages/demos/max-mode/components/ActionResultRenderer.tsx` – reusable renderer for action result payloads
- `src/pages/demos/max-mode/components/MaxModeHeader.tsx` – top header (close, debug/test panel)
- `src/pages/demos/max-mode/components/QuickActionsDesktop.tsx` – desktop quick actions bar
- `src/pages/demos/max-mode/components/QuickActionsMobileSheet.tsx` – mobile quick actions sheet
- `src/pages/demos/max-mode/components/DesktopContextPanel.tsx` – desktop right context panel
- `src/pages/demos/max-mode/components/MobileContextSheet.tsx` – mobile context sheet (docs/cart/product)
- `src/pages/demos/max-mode/components/MobileFloatingActions.tsx` – mobile floating actions + browse products sheet
- `src/pages/demos/max-mode/components/MobileNewDocsPreviewPanel.tsx` – mobile “New Products” preview panel

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

- [x] `MaxModeHeader` (top-right badge, close button, “Test Panel” button)
- [x] `QuickActionsDesktop` (desktop) + menu subcomponents (search/browse)
- [x] `QuickActionsMobileSheet` (mobile bottom sheet)
- [x] `DesktopContextPanel` + `MobileContextSheet` (documents/product/cart UI)
- [x] `MobileFloatingActions` (mobile AI search row + floating buttons + browse products)
- [x] `MobileNewDocsPreviewPanel` (mobile “New Products” preview panel)
- [ ] `MessageBubble` (user + AI variants) and keep the logic-free rendering there
- [ ] `Composer` (textarea + send + attachments row) as a focused component
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

- [x] Create `src/pages/demos/max-mode/constants.ts` and move:
  - `quickActions`, `searchCategories`, `aiSearchCategories`, `browseProductCategories`
  - `API_BASE_URL`
- [x] Delete the legacy mobile floating actions JSX in `src/pages/demos/MaxMode.tsx` (replaced by `MobileFloatingActions`)
- [x] Extract `MobileNewDocsPreviewPanel` (the “New Products” right-side panel on mobile)
- [ ] Extract `Chat/MessageBubble` and `Chat/MessageList` (reduce `MaxMode.tsx` render size)
- [ ] Extract `Chat/Composer` (input + attachments + send)
- [ ] Introduce `useMaxModeController` reducer (keep actions small and typed)
- [ ] Move fetch logic into `max-mode/api/*` (dedupe + consistent error handling)
