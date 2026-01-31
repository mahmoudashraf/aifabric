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
- `src/pages/demos/max-mode/api/client.ts` – fetch helpers (json + ok)
- `src/pages/demos/max-mode/api/conversations.ts` – conversations API wrappers
- `src/pages/demos/max-mode/api/chat.ts` – chat query + suggestions API wrappers
- `src/pages/demos/max-mode/api/cart.ts` – cart API wrappers
- `src/pages/demos/max-mode/hooks/useMaxModePersistence.ts` – sync with `MaxModeContext` (persist + pending attachments)
- `src/pages/demos/max-mode/hooks/useSuggestionsController.ts` – delayed suggestions fetch based on attachments
- `src/pages/demos/max-mode/hooks/useConversationsController.ts` – conversations panel state + CRUD + recent conversation bootstrap
- `src/pages/demos/max-mode/hooks/useCartController.ts` – cart/product details state + cart CRUD helpers
- `src/pages/demos/max-mode/hooks/useChatFlow.ts` – `handleChatQuery` + request/response parsing + per-message debug payload
- `src/pages/demos/max-mode/hooks/useMaxModeViewSync.ts` – scroll sync + doc aggregation + welcome message + AI search outside click
- `src/pages/demos/max-mode/hooks/useAttachmentsController.ts` – attach/reattach/remove helpers (action results + documents)
- `src/pages/demos/max-mode/hooks/useConfirmationFlow.ts` – confirmation message flow (confirm/cancel → chat)
- `src/pages/demos/max-mode/hooks/useSearchControls.ts` – AI search + search tag selection helpers
- `src/pages/demos/max-mode/hooks/useNewDocsPreviewActions.ts` – mobile new-doc preview open/close helpers
- `src/pages/demos/max-mode/components/ActionResultRenderer.tsx` – reusable renderer for action result payloads
- `src/pages/demos/max-mode/components/MaxModeHeader.tsx` – top header (close, debug/test panel)
- `src/pages/demos/max-mode/components/QuickActionsDesktop.tsx` – desktop quick actions bar
- `src/pages/demos/max-mode/components/QuickActionsMobileSheet.tsx` – mobile quick actions sheet
- `src/pages/demos/max-mode/components/DesktopContextPanel.tsx` – desktop right context panel
- `src/pages/demos/max-mode/components/DesktopContextPanel/*` – split views (cart/product/docs)
- `src/pages/demos/max-mode/components/MobileContextSheet.tsx` – mobile context sheet (docs/cart/product)
- `src/pages/demos/max-mode/components/MobileContextSheet/*` – split views (cart/product/docs)
- `src/pages/demos/max-mode/components/MobileFloatingActions.tsx` – mobile floating actions + browse products sheet
- `src/pages/demos/max-mode/components/MobileNewDocsPreviewPanel.tsx` – mobile “New Products” preview panel
- `src/pages/demos/max-mode/components/Chat/MessageBubble.tsx` – chat message bubble (user/AI)
- `src/pages/demos/max-mode/components/Chat/MessageList.tsx` – message list wrapper (scroll area + loading)
- `src/pages/demos/max-mode/components/Chat/Composer.tsx` – chat composer (input + attachments + suggestions)
- `src/pages/demos/max-mode/components/Chat/Composer/*` – split composer sections (attachments/suggestions/input)
- `src/pages/demos/max-mode/components/Chat/types.ts` – shared chat UI types
- `src/pages/demos/max-mode/MaxModePage.tsx` – main demo implementation (now in `max-mode/`)
- `src/pages/demos/MaxMode.tsx` – thin route wrapper
- `src/pages/demos/max-mode/components/MaxModeView.tsx` – view/layout for MAX Mode (pure render)
- `src/pages/demos/max-mode/components/MaxModeView/*` – split view sections (quick actions, main content, composer, overlays, animations)
- `src/pages/demos/max-mode/hooks/useMaxModeController.ts` – MAX Mode state/effects/controller hook

Note: `useMaxModeController` now exposes view-level helper actions (debug open/close, suggestion actions, cart-to-chat attach) to keep `MaxModeView` mostly declarative.
- `src/pages/demos/max-mode/components/Panels/DebugInspectorPanel.tsx` – API debug inspector (request/response + raw JSON modal)
- `src/pages/demos/max-mode/components/Panels/DebugInspector/RawResultJsonModal.tsx` – extracted raw JSON modal
- `src/pages/demos/max-mode/components/Panels/DebugInspector/DebugInspectorContent.tsx` – extracted content renderer
- `src/pages/demos/max-mode/components/Panels/DebugInspector/RequestSection.tsx` – request section UI
- `src/pages/demos/max-mode/components/Panels/DebugInspector/ResponseSection.tsx` – response section UI
- `src/pages/demos/max-mode/components/Panels/DebugInspector/*` – response section subcomponents (RAG status, routing, action, etc.)
- `src/pages/demos/max-mode/components/Conversations/ConversationHistoryPanel.tsx` – chat history panel (list + selection + delete)

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
  - `useMaxModeController.ts` (composition root; delegates to sub-controllers)
  - `useMaxModePersistence.ts` (sync with `MaxModeContext`, pending attachments)
  - `useChatFlow.ts` (chat query flow + parsing)
  - `useConversationsController.ts` (conversation list + open/delete/new)
  - `useCartController.ts` (cart + product details)
  - `useSuggestionsController.ts` (suggestions based on attachments)
  - `useAttachmentsController.ts` (attach/reattach/remove helpers)
  - `useMaxModeViewSync.ts` (message/doc scroll sync + derived docs)
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
- [x] `MessageBubble` (user + AI variants) and keep the logic-free rendering there
- [x] `MessageList` (chat scroll area + loading indicator)
- [x] `Composer` (textarea + send + attachments row) as a focused component
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
- [x] Extract `Chat/MessageBubble` (reduce `MaxMode.tsx` render size)
- [x] Extract `Chat/MessageList` (own file + memoization later)
- [x] Extract `Chat/Composer` (input + attachments + send)
- [x] Extract debug inspector panel (request/response UI)
- [x] Extract conversation history panel (list + selection)
- [x] Add `max-mode/api/*` wrappers for chat/cart/conversations
- [x] Move state/effects into `hooks/useMaxModeController.ts` (still `useState`-based for now)
- [x] Split controller into sub-hooks (chat flow, persistence, conversations, cart, attachments, suggestions, view sync)
- [x] Split `MobileContextSheet.tsx` into `MobileContextSheet/*`
- [x] Split `Chat/Composer.tsx` into `Chat/Composer/*`
- [ ] Convert `useMaxModeController` to a typed `useReducer` (keep actions small and explicit)
- [ ] Move remaining fetch logic into `max-mode/api/*` (if any remains)

## Size snapshot (Jan 31, 2026)

Runtime notes:

- Fixed `ReferenceError: Cannot access 'aiSearchCategories' before initialization` by moving category constants above `useSearchControls(...)` usage in `src/pages/demos/max-mode/hooks/useMaxModeController.ts`.

Largest remaining files by LOC (to consider splitting next):

- `src/pages/demos/max-mode/hooks/useMaxModeController.ts` (~521)
- `src/pages/demos/max-mode/components/MobileFloatingActions.tsx` (~333)
- `src/pages/demos/max-mode/components/Chat/MessageBubble.tsx` (~321)
- `src/pages/demos/max-mode/hooks/useChatFlow.ts` (~316)

Next reasonable refactor targets:

- Split `MobileFloatingActions.tsx` into search row + sheet + FAB cluster
- Split `MessageBubble.tsx` into AI header / attachments / content / confirmations / sources
- Split `useChatFlow.ts` into “request builder” + “response parser” helpers
