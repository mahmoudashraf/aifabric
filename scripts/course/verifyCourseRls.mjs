import { randomBytes } from "node:crypto";

const baseUrl = process.env.COURSE_SUPABASE_URL?.replace(/\/$/, "");
const publishableKey = process.env.COURSE_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.COURSE_SUPABASE_SECRET_KEY;

if (!baseUrl || !publishableKey || !secretKey) {
  throw new Error(
    "Set COURSE_SUPABASE_URL, COURSE_SUPABASE_PUBLISHABLE_KEY, and COURSE_SUPABASE_SECRET_KEY",
  );
}

const runId = `${Date.now()}-${randomBytes(4).toString("hex")}`;
const courseVersion = `rls-proof-${runId}`;
const password = `Course-${randomBytes(18).toString("base64url")}!7`;
const createdUsers = [];

const call = async (
  path,
  { method = "GET", key = publishableKey, token, body, prefer } = {},
) => {
  const headers = { apikey: key };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (prefer) headers.Prefer = prefer;

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const responseText = await response.text();
  let data = null;
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }
  return { status: response.status, data };
};

const rowCount = (result) => (Array.isArray(result.data) ? result.data.length : -1);

const createUser = async (label) => {
  const result = await call("/auth/v1/admin/users", {
    method: "POST",
    key: secretKey,
    token: secretKey,
    body: {
      email: `course-rls-${runId}-${label}@example.invalid`,
      password,
      email_confirm: true,
      user_metadata: { test_scope: "course-rls-proof" },
    },
  });
  if (![200, 201].includes(result.status)) {
    throw new Error(`Could not create temporary user ${label}: HTTP ${result.status}`);
  }
  createdUsers.push(result.data.id);
  return result.data.email;
};

const signIn = async (email) => {
  const result = await call("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: { email, password },
  });
  if (result.status !== 200) throw new Error(`Temporary user sign-in failed: HTTP ${result.status}`);
  return { id: result.data.user.id, token: result.data.access_token };
};

const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

const run = async () => {
  const proof = {};
  try {
    const [emailA, emailB] = await Promise.all([createUser("a"), createUser("b")]);
    const [userA, userB] = await Promise.all([signIn(emailA), signIn(emailB)]);
    const progressFilter = `user_id=eq.${userA.id}&course_version=eq.${encodeURIComponent(courseVersion)}`;
    const progress = {
      user_id: userA.id,
      course_version: courseVersion,
      lesson_id: "qs-01",
      video_completed_at: new Date().toISOString(),
      questions_answered: 3,
      question_score: 100,
      question_answers: { "qs-01-q1": ["b"] },
      questions_submitted_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    };

    let result = await call("/rest/v1/course_progress?select=user_id", {});
    proof.anonymousReadBlocked = [401, 403].includes(result.status);

    result = await call("/rest/v1/course_progress", {
      method: "POST",
      body: progress,
      prefer: "return=representation",
    });
    proof.anonymousWriteBlocked = [401, 403].includes(result.status);

    result = await call("/rest/v1/course_progress", {
      method: "POST",
      token: userA.token,
      body: progress,
      prefer: "return=representation",
    });
    proof.ownerCanInsert = result.status === 201 && rowCount(result) === 1;

    result = await call(`/rest/v1/course_progress?${progressFilter}&select=user_id,question_score`, {
      token: userA.token,
    });
    proof.ownerCanRead = result.status === 200 && rowCount(result) === 1;

    result = await call(`/rest/v1/course_progress?${progressFilter}&select=user_id`, {
      token: userB.token,
    });
    proof.otherUserCannotRead = result.status === 200 && rowCount(result) === 0;

    result = await call(`/rest/v1/course_progress?${progressFilter}`, {
      method: "PATCH",
      token: userB.token,
      body: { question_score: 0 },
      prefer: "return=representation",
    });
    proof.otherUserCannotUpdate = result.status === 200 && rowCount(result) === 0;

    result = await call(`/rest/v1/course_progress?${progressFilter}`, {
      method: "DELETE",
      token: userB.token,
      prefer: "return=representation",
    });
    proof.otherUserCannotDelete = result.status === 200 && rowCount(result) === 0;

    result = await call(`/rest/v1/course_progress?${progressFilter}&select=question_score`, {
      token: userA.token,
    });
    proof.ownerRowUnchanged =
      result.status === 200 && rowCount(result) === 1 && Number(result.data[0].question_score) === 100;

    result = await call("/rest/v1/course_progress", {
      method: "POST",
      token: userB.token,
      body: { ...progress, lesson_id: "qs-02" },
      prefer: "return=representation",
    });
    proof.otherIdentityInsertBlocked = [401, 403].includes(result.status);

    const certificate = {
      user_id: userA.id,
      course_version: courseVersion,
      display_name: "Course RLS Test",
      contact_email: emailA,
      capstone_url: "https://example.invalid/capstone",
      capstone_commit: "0123456789abcdef0123456789abcdef01234567",
    };
    result = await call("/rest/v1/course_certificate_requests", {
      method: "POST",
      token: userA.token,
      body: certificate,
      prefer: "return=representation",
    });
    proof.ownerCanSubmitPendingCertificate = result.status === 201 && rowCount(result) === 1;

    const certificateFilter = `user_id=eq.${userA.id}&course_version=eq.${encodeURIComponent(courseVersion)}`;
    result = await call(`/rest/v1/course_certificate_requests?${certificateFilter}`, {
      method: "PATCH",
      token: userA.token,
      body: { status: "approved" },
      prefer: "return=representation",
    });
    proof.learnerCannotUpdateCertificate = result.status === 200 && rowCount(result) === 0;

    result = await call(`/rest/v1/course_certificate_requests?${certificateFilter}&select=status`, {
      token: userA.token,
    });
    proof.certificateRemainsPending =
      result.status === 200 && rowCount(result) === 1 && result.data[0].status === "pending";

    result = await call("/rest/v1/course_certificate_requests", {
      method: "POST",
      token: userA.token,
      body: { ...certificate, course_version: `${courseVersion}-approved`, status: "approved" },
      prefer: "return=representation",
    });
    proof.learnerCannotSelfApprove = [401, 403].includes(result.status);

    result = await call(`/rest/v1/course_certificate_requests?${certificateFilter}&select=id`, {
      token: userB.token,
    });
    proof.otherUserCannotReadCertificate = result.status === 200 && rowCount(result) === 0;

    result = await call(`/rest/v1/course_progress?${progressFilter}`, {
      method: "DELETE",
      token: userA.token,
      prefer: "return=representation",
    });
    proof.ownerCanResetProgress = result.status === 200 && rowCount(result) === 1;

    for (const [name, passed] of Object.entries(proof)) {
      expect(passed, `RLS assertion failed: ${name}`);
    }

    console.log(JSON.stringify({ passed: true, proof }, null, 2));
  } finally {
    const cleanupResults = await Promise.all(
      createdUsers.map((id) =>
        call(`/auth/v1/admin/users/${id}`, {
          method: "DELETE",
          key: secretKey,
          token: secretKey,
        }),
      ),
    );
    if (cleanupResults.some(({ status }) => ![200, 204].includes(status))) {
      throw new Error("RLS proof completed, but temporary user cleanup failed");
    }
  }
};

await run();
