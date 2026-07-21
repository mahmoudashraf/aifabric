# AI Fabric Learning Backend

The course and bootcamp experiences use a dedicated Supabase project for learner authentication,
progress, certificate requests, cohort enrollment, and bootcamp communication consent. It is
intentionally separate from the website project that owns registrations, page views, and story
reactions.

## Browser Configuration

Set only the project's public values in the website deployment:

```bash
VITE_COURSE_SUPABASE_URL=https://<course-project-ref>.supabase.co
VITE_COURSE_SUPABASE_PUBLISHABLE_KEY=<course-publishable-key>
```

Never expose a Supabase secret or legacy `service_role` key through a `VITE_` variable.

## Apply Migrations

Link this bounded Supabase workspace once, then apply its migrations:

```bash
supabase --workdir course-backend link --project-ref <course-project-ref>
npm run course:db:push
```

Do not run the root `supabase/migrations` history against the course project. That history belongs
to the existing website project.

## Enable GitHub Login

1. Create a GitHub OAuth app for the deployed website.
2. Set its callback URL to `https://<course-project-ref>.supabase.co/auth/v1/callback`.
3. Enable GitHub under Supabase Authentication providers and store the client ID and secret there.
4. Set the Supabase site URL to the deployed website origin.
5. Allow the deployed `/course/**` callback path and the local development callback path.

The course checks the public Auth settings before enabling its GitHub sign-in controls. A valid
publishable key alone does not make the provider ready.

## Security Verification

Before release, verify with two temporary users that:

- anonymous callers cannot read or write course tables;
- each learner can read and mutate only their own progress;
- one learner cannot read, update, or delete another learner's rows;
- learners can submit only pending certificate requests;
- learners cannot approve, reject, update, or delete certificate requests.

The secret key is suitable only for controlled administration and test cleanup. It must remain
outside the browser bundle and source control.

Run the repeatable two-user proof with shell-only secret variables:

```bash
COURSE_SUPABASE_URL=https://<course-project-ref>.supabase.co \
COURSE_SUPABASE_PUBLISHABLE_KEY=<course-publishable-key> \
COURSE_SUPABASE_SECRET_KEY=<course-secret-key> \
npm run course:verify-rls
```

## Bootcamp Enrollment

The bootcamp migration creates two backend-driven cohorts:

- an active Arabic-taught cohort with one reusable invitation code;
- a coming-soon English-taught cohort with an email interest list and optional WhatsApp contact.

Only the invitation-code hash is stored in the migration. The reusable code must remain in private
operator material and should be rotated by replacing the hash when access needs to change. A code is
accepted only while its bootcamp remains `active`; it has no expiry or usage limit.

The browser can call only narrow RPC functions. It cannot read the bootcamp, enrollment, or interest
tables directly. Enrollment email comes from the authenticated Supabase identity, and WhatsApp
contact requires explicit consent.

Run the bootcamp proof after applying migrations:

```bash
COURSE_SUPABASE_URL=https://<course-project-ref>.supabase.co \
COURSE_SUPABASE_PUBLISHABLE_KEY=<course-publishable-key> \
COURSE_SUPABASE_SECRET_KEY=<course-secret-key> \
BOOTCAMP_INVITATION_CODE=<private-reusable-code> \
npm run bootcamp:verify-rls
```

The proof creates two temporary users, enrolls both with the same invitation code, verifies contact
isolation and invalid-code rejection, registers anonymous English-cohort interest, and removes all
test records afterward.

With the website running locally, verify the authenticated browser flow as well:

```bash
COURSE_SUPABASE_URL=https://<course-project-ref>.supabase.co \
COURSE_SUPABASE_PUBLISHABLE_KEY=<course-publishable-key> \
COURSE_SUPABASE_SECRET_KEY=<course-secret-key> \
BOOTCAMP_INVITATION_CODE=<private-reusable-code> \
BOOTCAMP_UI_BASE_URL=http://127.0.0.1:4181 \
npm run bootcamp:verify-ui
```

This creates a temporary authenticated participant, verifies URL-code capture, submits the WhatsApp
consent flow, reloads the saved enrollment from Supabase, and deletes the temporary user.
