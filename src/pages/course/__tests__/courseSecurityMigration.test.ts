// @vitest-environment node
import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  fileURLToPath(new URL("../../../../course-backend/supabase/migrations/20260720010000_course_progress_and_certificates.sql", import.meta.url)),
  "utf8",
).toLowerCase();

describe("course Supabase migration", () => {
  it("enables RLS and removes anonymous table access", () => {
    expect(migration).toContain("alter table public.course_progress enable row level security");
    expect(migration).toContain("alter table public.course_certificate_requests enable row level security");
    expect(migration).toContain("revoke all on public.course_progress from anon");
    expect(migration).toContain("revoke all on public.course_certificate_requests from anon");
  });

  it("binds progress reads and writes to auth.uid", () => {
    expect(migration).toContain("grant select, insert, update, delete on public.course_progress to authenticated");
    expect(migration.match(/\(select auth\.uid\(\)\) = user_id/g)?.length).toBeGreaterThanOrEqual(5);
  });

  it("does not grant learners certificate update or delete access", () => {
    expect(migration).toContain("grant select, insert on public.course_certificate_requests to authenticated");
    expect(migration).not.toContain("grant select, insert, update on public.course_certificate_requests");
    expect(migration).toContain("and status = 'pending'");
    expect(migration).toContain("and certificate_id is null");
  });
});
