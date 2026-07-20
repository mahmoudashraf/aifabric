# AI Fabric Course UI And Progress Implementation Plan

Status: In progress - QS-01 vertical slice implemented

Target repository: `mahmoudashraf/aifabric`

Canonical course source: `Loom-AI-Labs/ai-fabric-framework`, `docs/course`

Initial delivery: One complete QS-01 vertical slice, then incremental lesson rollout

## Current Implementation Status

As of July 20, 2026:

- the five-track course catalog and reviewed QS-01 preview are implemented;
- course source sync, schema validation, path containment, checksums, and build-time verification are implemented;
- the responsive course hub, lesson workspace, deterministic knowledge check, and progress view are implemented;
- the dedicated course Supabase migration is applied to the real course project;
- public and secret keys, direct database access, migration history, and two-user RLS behavior have been verified;
- the repeatable RLS proof creates isolated temporary users and removes all users and rows afterward;
- GitHub OAuth is enabled in the real course project with the production site URL and explicit
  production/local course redirect allowlists; the public provider setting and browser handoff to
  GitHub authorization have been verified;
- completion and certificate application remain closed until reviewed theory media, starter refs,
  solution refs, and the remaining required lessons are published.

## 1. Decision Summary

Build the public course in `aifabric` as a manifest-driven React experience backed directly by a
dedicated course Supabase project. Keep the existing website Supabase project responsible for
registrations, page views, and story reactions.

V1 deliberately stays small:

- Public course and lesson content does not require login.
- GitHub login is required only to save progress and request a certificate.
- A lesson is complete when the learner marks the theory video watched and submits its knowledge
  check according to the course manifest.
- Supabase stores learner-owned progress and certificate requests.
- The learner submits a capstone repository and immutable commit with the certificate request.
- The maintainer reviews and approves the request manually through the Supabase dashboard.
- No custom Java backend, automatic capstone grading, proctoring, public certificate verifier,
  Open Badges integration, or bespoke admin application is required for V1.

Supabase is the backend in this design. The browser uses the Supabase publishable key and the
authenticated learner JWT. PostgreSQL Row Level Security (RLS) is the authorization boundary. The
Supabase secret or legacy `service_role` key must never be bundled into the website.

## 2. Goals

1. Publish a clear course hub with honest track durations, prerequisites, release compatibility,
   and a direct path to the first lesson.
2. Render course content generated from a pinned framework course tag rather than manually copying
   lesson text into React components.
3. Present each lesson in the agreed learning order:
   - outcome;
   - NotebookLM theory explanation;
   - architecture/request flow;
   - manual or coding-assistant path;
   - practical requests and evidence;
   - intentional failure;
   - tests and completion checks;
   - knowledge check;
   - previous/next navigation.
4. Save authenticated learner progress across browsers and devices.
5. Keep knowledge-check scoring deterministic and never claim that an LLM graded learner
   understanding.
6. Accept a capstone-backed certificate request and support manual maintainer approval.
7. Keep framework/course source version, generated website content, video, questions, and progress
   records aligned.
8. Add automated tests before multiplying the UI pattern across the full course.

## 3. Non-Goals For V1

- A secured professional certification exam.
- Automatic verification of local Maven commands or learner GitHub Actions.
- Automatic capstone grading.
- LLM-based answer grading.
- Anti-cheating or video-attention surveillance.
- A standalone Spring Boot course platform backend.
- A custom certificate administration portal.
- Public certificate lookup or revocation APIs.
- A multi-course learning-management system.
- Social features, discussion threads, subscriptions, payments, or instructor dashboards.
- Editing canonical course content from the website repository.

The product wording must remain `AI Fabric Course Certificate of Completion`, not `AI Fabric
Certified Developer`, until a formal certification system exists.

## 4. Current Repository Evidence

The plan builds on the current repository instead of introducing a second frontend stack.

| Current capability | Code evidence | Consequence |
| --- | --- | --- |
| React Router application | [`src/App.tsx`](../../src/App.tsx) imports `BrowserRouter`, `Route`, and `Routes`; current docs begin at `/docs` | Add course routes to the existing router, preferably through a small course route module |
| React Query is already global | [`src/App.tsx`](../../src/App.tsx) wraps the app in `QueryClientProvider`; `@tanstack/react-query` is in [`package.json`](../../package.json) | Use query/mutation hooks for progress and certificate requests |
| Website Supabase client already exists | [`src/integrations/supabase/client.ts`](../../src/integrations/supabase/client.ts) uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for existing website data | Preserve this client and project so course rollout cannot break page views, registrations, or story reactions |
| Course Supabase is a separate trust boundary | [`src/integrations/course-supabase/client.ts`](../../src/integrations/course-supabase/client.ts) uses course-specific public variables and its own Auth storage key | Keep course Auth, learner data, generated types, and migrations isolated from the website project |
| Course migration workspace is bounded | [`course-backend/supabase`](../../course-backend/supabase) contains only course tables and policies | Apply this migration history only to the course project and run explicit two-user RLS verification |
| Markdown rendering exists | [`src/pages/docs/MarkdownGuidePage.tsx`](../../src/pages/docs/MarkdownGuidePage.tsx) already uses `react-markdown`, GFM, and Prism highlighting | Extract reusable Markdown/code rendering rather than duplicating a second implementation |
| Documentation is manually imported | [`src/pages/docs/MarkdownGuidePage.tsx`](../../src/pages/docs/MarkdownGuidePage.tsx) imports many individual `*.md?raw` files | Course content needs a generated manifest and sync command; do not repeat manual imports for 20 lessons |
| Existing docs navigation is large | [`src/components/docs/DocsSidebar.tsx`](../../src/components/docs/DocsSidebar.tsx) includes many documentation and story groups | Build a focused Course layout and sidebar instead of placing course lessons in the docs sidebar |
| Global navigation is already crowded | [`src/components/Navbar.tsx`](../../src/components/Navbar.tsx) contains Live Demos, Capabilities, Java Shape, Getting Started, Webinars, and Consultation | Add Course as a primary destination and simplify the global links |
| Course routes do not exist | [`src/App.tsx`](../../src/App.tsx) contains `/docs`, demo, webinar, and consultation routes but no `/course` route | Course UI is a new bounded feature area |
| Test infrastructure is absent | [`package.json`](../../package.json) defines build and lint scripts but no unit, component, or browser test command | Establish tests in the first course slice, before scaling |
| Useful UI controls already exist | `src/components/ui` includes progress, radio group, checkbox, tabs, accordion, sheet, drawer, button, avatar, and dropdown components | Reuse the current design system for course interaction |

## 5. Blocking Course-Source Dependency

The framework repository currently contains the master curriculum plan, but the website must not
invent lesson content from that plan. Before the first public course lesson can be implemented, the
framework repository must publish a real QS-01 package:

```text
docs/course/course.yml
docs/course/quickstart/01-first-useful-result/
  lesson.md
  knowledge-check.yml
  assistant-prompt.md
  assistant-review-prompt.md
  notebooklm/
    00-lesson-brief.md
    01-concepts-and-request-flow.md
    02-reviewed-code-walk.md
    03-lab-and-expected-results.md
    04-failure-and-troubleshooting.md
    05-glossary.md
    06-video-steering-prompt.md
    source-manifest.yml
```

QS-01 must have:

- reviewed lesson front matter;
- starter and solution refs;
- final commands and expected evidence;
- a reviewed knowledge check;
- a reviewed NotebookLM video URL or explicit unpublished status;
- a transcript path;
- source paths and checksums;
- a course/framework version pin.

Do not hard-code a temporary QS-01 React lesson and later attempt to reconcile it. Build the sync and
renderer against the real source package.

## 6. Target Architecture

### 6.1 Content Flow

```text
Tagged AI Fabric framework course source
  -> course sync script
  -> schema and checksum validation
  -> generated website course bundle
  -> Vite build
  -> static public course pages
```

The deployed website never fetches raw course files from GitHub at runtime. Content is pinned,
validated, and bundled during development/CI so a framework `main` change cannot silently alter a
published course.

### 6.2 Learner Progress Flow

```text
Learner opens public lesson
  -> optionally signs in with GitHub through Supabase Auth
  -> marks theory video watched
  -> submits knowledge check
  -> browser upserts only that learner's course_progress row
  -> RLS checks auth.uid() = user_id
  -> course hub and sidebar refresh through React Query
```

### 6.3 Certificate Flow

```text
All required lesson rows complete
  -> UI unlocks Apply for Certificate
  -> learner submits identity and capstone references
  -> RLS permits only a pending request for the current learner
  -> maintainer reviews progress and capstone in Supabase dashboard
  -> maintainer marks approved/rejected and records certificate details
  -> learner sees the decision in the course progress page
```

The frontend eligibility check improves usability; it is not a secured examination control. The
manual capstone review is the V1 quality gate.

## 7. Proposed File Structure

```text
docs/planning/
  0001-ai-fabric-course-ui-and-progress-plan.md

scripts/course/
  syncCourse.ts
  verifyCourse.ts
  schemas.ts

src/content/course/generated/
  course.json
  source-manifest.json
  lessons/
    <lesson-id>.json

src/pages/course/
  CourseHubPage.tsx
  CourseLessonPage.tsx
  CourseProgressPage.tsx
  CourseCapstonePage.tsx
  CourseTroubleshootingPage.tsx
  routes.tsx
  types.ts
  components/
    CourseLayout.tsx
    CourseSidebar.tsx
    CourseMobileNavigation.tsx
    CourseTrackProgress.tsx
    CourseLessonHeader.tsx
    CourseTheoryVideo.tsx
    CourseRequestFlow.tsx
    CoursePathSelector.tsx
    CourseMarkdown.tsx
    CourseKnowledgeCheck.tsx
    CourseCompletionPanel.tsx
    CourseLessonNavigation.tsx
    CourseSignInButton.tsx
    CertificateRequestForm.tsx
  hooks/
    useCourseCatalog.ts
    useCourseAuth.ts
    useCourseProgress.ts
    useLessonProgress.ts
    useCertificateRequest.ts
  api/
    courseProgressApi.ts
    certificateRequestApi.ts
  lib/
    completion.ts
    knowledgeCheck.ts
    courseRoutes.ts

course-backend/
  README.md
  supabase/
    config.toml
    migrations/
      <timestamp>_course_progress_and_certificates.sql

src/integrations/course-supabase/
  client.ts
  types.ts
```

This follows the repository's existing pattern of keeping complex page-specific components, hooks,
and API adapters beside their owning page feature.

## 8. Course Content Sync

### 8.1 Dependencies

Add build-time dependencies:

- `yaml` for `course.yml`, knowledge checks, and source manifests;
- `gray-matter` for lesson Markdown front matter;
- Node's built-in `crypto` for SHA-256 checksums;
- existing `zod` for explicit schemas and readable validation failures.

Do not parse YAML or front matter through regular expressions.

### 8.2 Sync Command

Add package scripts:

```json
{
  "course:sync": "tsx scripts/course/syncCourse.ts",
  "course:verify": "tsx scripts/course/verifyCourse.ts"
}
```

Supported development inputs:

```bash
npm run course:sync -- --source-dir ../ai-fabric-framework/docs/course
npm run course:sync -- --course-ref ai-fabric-course-v0.3.3.1
```

The local source-directory mode supports coordinated development. The release mode must download or
check out the immutable course tag and record the source commit.

### 8.3 Validation

The sync command must fail when:

- `course.yml` fails schema validation;
- a declared lesson source is missing;
- lesson ID, slug, track, or version differs across manifest, front matter, and knowledge check;
- assistant prompt or source-manifest paths are missing;
- a published lesson lacks a reviewed video URL, transcript, or source manifest;
- question IDs are duplicated;
- an answer key references a missing option;
- required source files fail checksum validation;
- local links escape the approved course source directory;
- an unpublished lesson is marked visible;
- course and framework version pins disagree.

### 8.4 Generated Format

Generate browser-ready JSON instead of parsing YAML in the application runtime:

```ts
interface GeneratedCourse {
  schemaVersion: number;
  courseId: string;
  courseVersion: string;
  frameworkVersion: string;
  sourceTag: string;
  sourceCommit: string;
  title: string;
  subtitle: string;
  tracks: GeneratedTrack[];
}

interface GeneratedLesson {
  id: string;
  slug: string;
  track: string;
  title: string;
  durationMinutes: number;
  published: boolean;
  markdown: string;
  sourceUrl: string;
  video: GeneratedTheoryVideo;
  knowledgeCheck: GeneratedKnowledgeCheck;
  assistant: GeneratedAssistantAssets;
  relatedStories: GeneratedRelatedLink[];
  relatedDemos: GeneratedRelatedLink[];
}
```

`source-manifest.json` records every generated file, source path, source tag, source commit, checksum,
and generation time. The UI displays source/version metadata but does not treat generation time as
framework release time.

## 9. Routing

Add lazy-loaded course routes so 20 lessons, transcripts, and code samples do not inflate the initial
landing-page bundle:

```text
/course
/course/quickstart
/course/core/:lessonSlug
/course/production/:lessonSlug
/course/case-studies/:caseSlug
/course/coding-assistants
/course/troubleshooting
/course/capstone
/course/progress
```

Routing rules:

- `/course` is always public.
- Lesson pages are public.
- `/course/progress` may render a sign-in request when no authenticated session exists.
- Progress mutations prompt GitHub sign-in when necessary.
- Unknown track/slug pairs render a course-scoped not-found state, not the global marketing 404.
- Unpublished lessons are absent from navigation and route resolution.
- Previous/next links come from the generated manifest, not manually maintained arrays.

Create `src/pages/course/routes.tsx` and keep the route declarations out of the already large
`src/App.tsx` beyond one bounded insertion.

## 10. Navigation Changes

Add `Course` as a primary global destination. Recommended desktop order:

```text
Live Demos | Course | Docs | Webinars | Consultation
```

`Capabilities` and `Java Shape` remain useful homepage sections but do not need permanent global-nav
slots once the course is introduced. Apply the same order to mobile navigation.

Add reciprocal navigation:

- Documentation home includes a `Structured Course` entry.
- Course lessons link to canonical docs and reviewed stories as references.
- Course case studies link to their live demos and backend architecture pages.
- Demo `About` pages may link back to their corresponding course case study after publication.

## 11. Course Hub UX

The course hub is a working learner dashboard, not another marketing landing page.

Signed-out state:

- concise course title and outcome;
- framework/course version;
- prerequisites and honest duration;
- `Start Quickstart` as the primary command;
- `Sign in with GitHub to save progress` as a secondary command;
- track list with lesson counts and availability;
- continuing Support Knowledge Assistant architecture;
- clear beta/review status.

Signed-in state:

- learner identity and sign-out menu;
- `Continue lesson` based on the latest incomplete lesson;
- completed/total lesson count per track;
- last activity time;
- certificate eligibility status;
- capstone/certificate request state when applicable.

Use compact progress rows and unframed page sections. Do not turn every lesson or statistic into a
large decorative card.

## 12. Course Layout And Sidebar

Create a dedicated `CourseLayout`; do not reuse `DocsSidebar`, which contains unrelated docs and more
than 40 stories.

Desktop:

- fixed global navbar;
- 280px course sidebar;
- constrained lesson reading column;
- optional narrow lesson-outline rail only when it improves navigation;
- stable video aspect ratio and code-block widths.

Mobile:

- global navbar;
- course-navigation drawer;
- sticky but non-overlapping previous/next controls only when enough viewport space remains;
- horizontally scrollable code blocks;
- no fixed controls covering question or completion buttons.

Sidebar status icons:

- not started;
- in progress;
- complete;
- unpublished/coming later.

Status comes from the manifest plus authenticated progress, never inferred from URL visitation.

## 13. Lesson Page UX

Render this order consistently:

1. Track, lesson number, title, duration, and release badge.
2. Outcome and prerequisite state.
3. `Theory first` video section.
4. Architecture/request-flow visual and ownership summary.
5. Segmented `Build manually` / `Use a coding assistant` path control.
6. Lesson Markdown, files, commands, requests, and expected evidence.
7. Intentional failure and field lesson.
8. Tests and `Done when` checklist.
9. Knowledge check.
10. Completion state and next lesson.

### 13.1 Theory Video

`CourseTheoryVideo` must:

- use a stable 16:9 responsive area;
- show purpose, duration, source tag, review status, transcript, and source-pack link;
- allow only approved video hosts or direct media formats;
- use a user-facing `Mark theory watched` command for V1;
- save `video_completed_at` only after explicit user action;
- explain that login is required to persist completion;
- never claim that playback percentage proves understanding.

NotebookLM video URLs may ultimately be hosted on YouTube or another approved service. Normalize the
embed URL during course sync rather than accepting arbitrary iframe HTML from Markdown.

### 13.2 Manual And Assistant Paths

Use a segmented control, not two nested page-card experiences.

Manual path:

- renders the canonical build steps;
- exposes copyable commands and expected output;
- links starter and solution refs.

Assistant path:

- renders the reviewed lesson-specific implementation prompt;
- renders the independent review prompt separately;
- displays mode, validation status, starter ref, and no-commit/no-deploy boundaries;
- copying a prompt never changes progress.

The selected path may be stored as presentation preference, but it is not certificate evidence.

### 13.3 Markdown Renderer

Extract the safe Markdown/code behavior from `MarkdownGuidePage` into a reusable renderer shared by
docs and course pages where practical.

Requirements:

- GFM tables and lists;
- Prism-highlighted code with copy controls;
- safe external-link handling;
- no raw HTML execution;
- responsive tables and code blocks;
- heading anchors and lesson-outline generation;
- source path and source tag visibility.

## 14. Knowledge Check UX

Support the course's declared question types:

- `single-choice`;
- `multiple-choice`;
- `answer-reveal`;
- `implementation-defense`.

V1 behavior:

- choice questions are scored deterministically from the synced answer key;
- answer explanations appear only after submission;
- answer-reveal and implementation-defense questions require an explicit `Reviewed` acknowledgement;
- the page stores submitted answers, answered count, score, and submission time;
- the learner may retry; the latest submitted score is displayed;
- no LLM grading or semantic score is shown;
- the course manifest determines the configured passing threshold;
- lesson completion uses the manifest rule and never a frontend-only hard-coded threshold.

Question answers are educational, not secret exam material. A learner can inspect the bundled answer
key or directly update their own progress. This is acceptable for a completion course because the
manually reviewed capstone is the quality gate. The UI must not market the knowledge check as a
secured examination.

## 15. Authentication

### 15.1 Provider

Enable GitHub OAuth in the dedicated course Supabase project.

Required Supabase settings:

- GitHub OAuth client ID and secret stored in Supabase, never Vite variables;
- production redirect allowlist for `https://ai-fabric.dev/course`;
- local redirect allowlist for the selected Vite development URL;
- site URL set to the production origin;
- HTTPS in production.

### 15.2 Frontend Session

The dedicated course Supabase client persists and refreshes sessions under a course-specific storage
key. Add a thin course auth context or hook that:

- loads the current session once;
- subscribes to auth-state changes;
- exposes learner ID, GitHub display name/avatar, sign-in, sign-out, and loading state;
- does not copy authorization roles from editable GitHub profile metadata;
- restores the intended lesson after OAuth redirect.

Course reading remains public. Saving progress or submitting a certificate request opens a focused
sign-in dialog and returns the learner to the same task afterward.

Do not add password storage or a second authentication system.

## 16. Supabase Data Model

### 16.1 Progress Table

Recommended SQL shape:

```sql
create table public.course_progress (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  course_version text not null,
  lesson_id text not null,
  video_completed_at timestamptz,
  questions_answered integer not null default 0 check (questions_answered >= 0),
  question_score numeric(5,2) check (question_score between 0 and 100),
  question_answers jsonb not null default '{}'::jsonb,
  questions_submitted_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, course_version, lesson_id),
  check (pg_column_size(question_answers) <= 32768)
);

create index course_progress_user_version_idx
  on public.course_progress (user_id, course_version);
```

The application computes `completed_at` from the pinned lesson completion rule when saving progress.
The manual certificate reviewer treats it as course progress, not tamper-proof exam evidence.

### 16.2 Certificate Request Table

```sql
create table public.course_certificate_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  course_version text not null,
  display_name text not null check (char_length(display_name) between 2 and 120),
  contact_email text not null check (char_length(contact_email) <= 255),
  profile_url text,
  capstone_url text not null,
  capstone_commit text not null check (char_length(capstone_commit) between 7 and 64),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  decision_message text,
  certificate_id text unique,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  issued_at timestamptz
);

create unique index one_pending_course_certificate_request
  on public.course_certificate_requests (user_id, course_version)
  where status = 'pending';
```

The maintainer may approve/reject and add certificate metadata from the Supabase dashboard. V1 does
not need a public certificate table or admin UI.

## 17. Row Level Security

Enable RLS and grant only the required operations.

### 17.1 Progress Policies

```sql
alter table public.course_progress enable row level security;

revoke all on public.course_progress from anon;
grant select, insert, update, delete on public.course_progress to authenticated;

create policy "Learners read own course progress"
on public.course_progress
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Learners insert own course progress"
on public.course_progress
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Learners update own course progress"
on public.course_progress
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Learners reset own course progress"
on public.course_progress
for delete
to authenticated
using ((select auth.uid()) = user_id);
```

### 17.2 Certificate Policies

```sql
alter table public.course_certificate_requests enable row level security;

revoke all on public.course_certificate_requests from anon;
grant select, insert on public.course_certificate_requests to authenticated;

create policy "Learners read own certificate requests"
on public.course_certificate_requests
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Learners submit pending certificate requests"
on public.course_certificate_requests
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'pending'
  and decision_message is null
  and certificate_id is null
  and reviewed_at is null
  and issued_at is null
);
```

Do not create learner update or delete policies for certificate requests. A learner cannot turn
`pending` into `approved`. Maintainer dashboard operations use privileged Supabase access outside the
public application.

### 17.3 RLS Verification

Test with two independent authenticated users:

1. User A can insert/read/update/delete only User A progress.
2. User B cannot select or mutate User A progress by guessing lesson IDs.
3. An anonymous request cannot read or write either course table.
4. User A can insert a pending certificate request for User A.
5. User A cannot insert `approved`, set review fields, or update the request afterward.
6. User B cannot read User A's email, capstone, status, or certificate metadata.
7. The publishable key plus an authenticated JWT respects all policies.
8. No secret or `service_role` key appears in source, generated bundles, logs, or browser requests.

Run Supabase Security Advisor and review every finding before production release.

## 18. Progress API And State

Use small Supabase adapters rather than calling table names from components.

```ts
interface LessonProgress {
  userId: string;
  courseVersion: string;
  lessonId: string;
  videoCompletedAt: string | null;
  questionsAnswered: number;
  questionScore: number | null;
  questionAnswers: Record<string, unknown>;
  questionsSubmittedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
}
```

API functions:

```text
getCourseProgress(courseVersion)
getLessonProgress(courseVersion, lessonId)
markTheoryWatched(courseVersion, lessonId)
submitKnowledgeCheck(courseVersion, lessonId, submission)
resetLessonProgress(courseVersion, lessonId)
getCertificateRequests(courseVersion)
submitCertificateRequest(request)
```

React Query rules:

- query keys always include authenticated user ID and course version;
- clear course queries on sign-out;
- optimistically update only low-risk video completion when rollback is implemented;
- submit questions pessimistically so the displayed completion matches persisted state;
- invalidate course, lesson, and certificate-eligibility queries after mutations;
- do not persist one user's cache into another user's session.

Pure completion function:

```ts
function isLessonComplete(
  lesson: GeneratedLesson,
  progress: LessonProgress | undefined,
): boolean;
```

The function must read the manifest's required video, score, and review conditions. Unit-test it
instead of scattering completion checks across components.

## 19. Course Progress Page

The authenticated progress page shows:

- course and framework version;
- overall completed/required lesson count;
- progress by track;
- per-lesson video and question state;
- latest score and submission date;
- direct resume links;
- capstone requirements;
- certificate request status.

Use clear labels:

- `Not started`;
- `In progress`;
- `Complete`;
- `Certificate request pending`;
- `Approved`;
- `Changes requested` or `Rejected` with a learner-safe decision message.

Do not call ordinary saved progress `verified` or `certified`.

## 20. Certificate Request UX

Unlock the form when all manifest-required lessons are complete. Collect:

- certificate display name;
- contact email;
- GitHub or LinkedIn profile URL;
- capstone repository URL;
- immutable capstone commit SHA;
- consent to use the submitted information for review and certificate delivery.

Before submission, show:

- course version;
- completed lesson count;
- statement that the capstone is reviewed manually;
- statement that this is a course completion credential, not an accredited qualification or formal
  professional certification.

After submission:

- lock duplicate pending submissions;
- show request ID and status;
- allow the learner to return later;
- show only the maintainer's learner-safe decision message;
- instruct rejected learners how to submit a new request after addressing feedback.

Initial operations:

1. Maintainer opens the request in Supabase dashboard.
2. Maintainer reviews learner progress and the capstone repository/commit.
3. Maintainer updates status and decision message.
4. For approval, maintainer assigns certificate ID and issue date and sends the PDF manually.
5. Website reflects the approved status on the next query refresh.

Public verification and automated PDF generation remain future enhancements.

## 21. Security Boundaries

1. **Public key posture:** only `VITE_COURSE_SUPABASE_PUBLISHABLE_KEY` is available to the course
   client. No secret key may use the `VITE_` prefix.
2. **Database authorization:** every exposed course table has RLS enabled and explicit role-scoped
   policies.
3. **Identity:** ownership comes from `auth.uid()`, not a `userId` trusted from a route, form, GitHub
   username, or editable user metadata.
4. **Certificate status:** learners cannot update approval fields.
5. **Content integrity:** course content is synced from an immutable source tag and checked before
   build.
6. **Markdown safety:** do not enable raw HTML; restrict video embeds to approved hosts.
7. **Privacy:** certificate email and capstone data are visible only to the learner and maintainer.
8. **Cache isolation:** clear learner-specific React Query data on sign-out/session change.
9. **OAuth:** restrict redirect origins and use HTTPS in production.
10. **Honest assurance:** acknowledge that learners can manipulate their own progress; the manual
    capstone review is the certificate-quality control.

No AI Fabric module or LLM should be introduced into login, progress scoring, or certificate
approval. These are deterministic application concerns.

## 22. Testing Strategy

### 22.1 Test Foundation

Add:

- Vitest;
- React Testing Library;
- `@testing-library/user-event`;
- `jsdom`;
- Playwright.

Package scripts:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "verify": "npm run course:verify && npm run lint && npm run test && npm run build"
}
```

### 22.2 Unit Tests

- Course and lesson schema validation.
- Checksum mismatch detection.
- Route generation and previous/next ordering.
- Single-choice and multiple-choice scoring.
- Answer-reveal and implementation-defense completion acknowledgement.
- Manifest-driven lesson completion.
- Certificate UI eligibility.
- Course version separation.

### 22.3 Component Tests

- Course hub signed-out and signed-in states.
- Sidebar status rendering.
- Theory video completion with and without login.
- Manual/assistant path switching without marking completion.
- Question submission, explanations, retry, and persisted state.
- Certificate form locked/unlocked states.
- Mobile drawer and long code/table layout.
- Error, loading, and empty-progress states.

### 22.4 Supabase Integration Tests

- Apply migrations against a local/test Supabase project.
- Exercise all RLS cases from Section 17.3.
- Prove users cannot set certificate approval fields.
- Prove progress is separated by user and course version.
- Regenerate `src/integrations/supabase/types.ts` and compile against it.

### 22.5 Browser Tests

Initial QS-01 Playwright flow:

1. Open `/course` signed out.
2. Open QS-01 and verify theory-first ordering.
3. Verify saving progress asks for sign-in.
4. Use a test-auth session.
5. Mark theory watched.
6. Submit the knowledge check.
7. Refresh and confirm progress persists.
8. Reopen `/course` and verify `Continue` and track progress.
9. Test desktop and mobile viewport screenshots.
10. Check no fixed navigation covers answer or completion controls.

Do not use production GitHub identities or production certificate data in automated tests.

## 23. CI And Content Release Gates

Required website CI order:

```text
npm ci
course source sync from pinned tag
npm run course:verify
npm run lint
npm run test
npm run build
Playwright smoke against built application
```

The course gate fails when:

- generated content differs from the pinned source without an intentional sync commit;
- a source checksum or lesson route is missing;
- unpublished content enters navigation;
- course/framework version metadata disagrees;
- knowledge checks are malformed;
- a required theory video is unreviewed or missing;
- progress and question tests fail;
- the production bundle contains a Supabase secret/service key pattern.

Course content updates should be reviewable as generated-data changes plus source-manifest changes,
not hand-edited React text.

## 24. Deployment Configuration

Required course variables:

```text
VITE_COURSE_SUPABASE_URL
VITE_COURSE_SUPABASE_PUBLISHABLE_KEY
```

Never configure:

```text
VITE_SUPABASE_SECRET_KEY
VITE_SUPABASE_SERVICE_ROLE_KEY
VITE_COURSE_SUPABASE_SECRET_KEY
VITE_COURSE_SUPABASE_SERVICE_ROLE_KEY
```

Deployment steps:

1. Create and apply `course-backend/supabase` migrations in the dedicated course project.
2. Regenerate TypeScript database types.
3. Enable GitHub provider in Supabase Auth.
4. Add local and production redirect URLs.
5. Sync QS-01 from the pinned framework course tag.
6. Run the full website verification gate.
7. Deploy the website.
8. Test login, sign-out, progress persistence, cross-user isolation, and certificate submission live.
9. Confirm Supabase Security Advisor has no unexplained course-table findings.
10. Confirm the served frontend bundle contains only the publishable key.

## 25. Implementation Phases

### Phase 0: Canonical QS-01 Source

Framework repository work:

- Create `course.yml`.
- Create complete QS-01 source directory.
- Publish reviewed knowledge check.
- Produce/review the NotebookLM theory video and transcript.
- Publish immutable course source tag.

Done when:

- QS-01 satisfies the framework course lesson contract;
- all referenced files exist;
- a source manifest and checksums are available.

### Phase 1: Course Content Foundation

- Add YAML/front-matter dependencies.
- Implement sync and verify commands.
- Add generated schemas/types.
- Sync QS-01.
- Add CI drift/checksum validation.

Done when:

- `npm run course:sync` and `npm run course:verify` pass from a clean checkout;
- no lesson text is manually duplicated in React.

### Phase 2: Public Course UI Vertical Slice

- Add routes and Course navigation.
- Add Course hub and layout.
- Render QS-01 theory video, Markdown, paths, failure, tests, and navigation.
- Add responsive behavior and source/version labels.
- Add test foundation.

Done when:

- QS-01 is readable and usable without login on desktop and mobile;
- the video precedes implementation content;
- unpublished lessons are not exposed;
- unit/component/browser tests pass.

### Phase 3: GitHub Login And Progress

- Apply Supabase progress migration and RLS.
- Enable GitHub Auth.
- Add auth/session hook.
- Add progress API/hooks.
- Save video and question completion.
- Add course progress page and Continue behavior.

Done when:

- progress survives refresh and a new browser session after login;
- two users cannot access each other's progress;
- sign-out clears learner-specific UI state.

### Phase 4: Certificate Request

- Add request table and RLS.
- Add capstone/certificate form.
- Add pending/approved/rejected learner state.
- Document manual Supabase dashboard review.
- Create initial PDF certificate template and ID convention outside the public frontend.

Done when:

- only course-complete learners see the normal apply path;
- no learner can approve their own request;
- maintainer can approve manually and the learner sees the result.

### Phase 5: External QS-01 Beta

- Invite at least three external Java developers.
- Observe setup, video, lesson, question, login, and resume behavior.
- Record blockers and completion time.
- Fix reproducible problems before creating the next seven lesson pages.

Done when:

- learners complete QS-01 without maintainer intervention;
- progress and auth do not distract from the framework lesson;
- feedback validates the lesson/page template.

### Phase 6: Incremental Course Rollout

- Publish Core lessons one at a time.
- Add Production and Case Study tracks only after Core stability.
- Reuse the same generated model and components.
- Add no per-lesson special-case intelligence or hard-coded completion logic.

## 26. Acceptance Criteria

The V1 course platform is complete when:

- course content is generated from an immutable framework course tag;
- the public Course hub and QS-01 route work without login;
- theory video appears before each implementation path;
- GitHub login saves progress through Supabase;
- RLS prevents cross-user progress and certificate access;
- question scoring is deterministic and source-backed;
- completion survives refresh and sign-in restoration;
- all required lessons can be rendered from the same components;
- certificate application unlocks after required completion;
- capstone approval remains manual and privileged;
- no Supabase secret is shipped to the browser;
- unit, component, RLS, build, and browser gates pass;
- mobile controls do not overlap lesson or question actions;
- course, framework, video, and source versions are visible and aligned.

## 27. Risks And Controls

| Risk | Control |
| --- | --- |
| Website content drifts from framework docs | Pinned tag, generated manifest, checksums, CI verification |
| Course UI is built before real lesson content | Require complete QS-01 package in Phase 0 |
| Supabase direct access leaks learner data | RLS, explicit grants, two-user tests, Security Advisor |
| Secret key reaches frontend | Publishable-key-only rule and bundle scan |
| Learner self-fakes completion | Honest completion-certificate wording and manual capstone review |
| Certificate status is user-editable | No learner update policy; pending-only insert check |
| Video becomes the source of truth | Canonical lesson/source pack remains authoritative |
| NotebookLM invents framework behavior | Reviewed source pack, transcript, and video review status |
| Course bloats initial website bundle | Lazy course routes and generated per-lesson content |
| Current docs renderer is duplicated | Extract/reuse safe Markdown and code components |
| Twenty lessons diverge in behavior | Manifest-driven generic lesson components and tests |
| Mobile navigation covers controls | Stable responsive dimensions and Playwright screenshots |
| Course version upgrade corrupts progress | Composite key includes `course_version`; explicit migration policy later |

## 28. Deferred Enhancements

After V1 proves useful:

- public certificate verification page;
- automated PDF generation;
- Open Badges 3.0 credential issuance;
- maintainer admin UI;
- optional email notification for review decisions;
- capstone gallery with learner consent;
- optional GitHub Actions evidence integration;
- course-version upgrade mapping;
- additional authentication providers;
- transcript search and accessibility improvements;
- richer learner analytics with explicit consent.

None of these should delay QS-01, basic progress, or the manually approved completion certificate.
