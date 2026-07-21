import { randomBytes } from "node:crypto";

const baseUrl = process.env.COURSE_SUPABASE_URL?.replace(/\/$/, "");
const publishableKey = process.env.COURSE_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.COURSE_SUPABASE_SECRET_KEY;
const invitationCode = process.env.BOOTCAMP_INVITATION_CODE;

if (!baseUrl || !publishableKey || !secretKey || !invitationCode) {
  throw new Error(
    "Set COURSE_SUPABASE_URL, COURSE_SUPABASE_PUBLISHABLE_KEY, COURSE_SUPABASE_SECRET_KEY, and BOOTCAMP_INVITATION_CODE",
  );
}

const runId = `${Date.now()}-${randomBytes(4).toString("hex")}`;
const password = `Bootcamp-${randomBytes(18).toString("base64url")}!8`;
const interestEmail = `bootcamp-interest-${runId}@example.invalid`;
const invalidInterestEmail = `bootcamp-invalid-${runId}@example.invalid`;
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

const createUser = async (label) => {
  const email = `bootcamp-rls-${runId}-${label}@example.invalid`;
  const result = await call("/auth/v1/admin/users", {
    method: "POST",
    key: secretKey,
    token: secretKey,
    body: {
      email,
      password,
      email_confirm: true,
      user_metadata: { test_scope: "bootcamp-rls-proof" },
    },
  });
  if (![200, 201].includes(result.status)) {
    throw new Error(`Could not create temporary user ${label}: HTTP ${result.status}`);
  }
  createdUsers.push(result.data.id);
  return email;
};

const signIn = async (email) => {
  const result = await call("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: { email, password },
  });
  if (result.status !== 200) throw new Error(`Temporary user sign-in failed: HTTP ${result.status}`);
  return { id: result.data.user.id, email, token: result.data.access_token };
};

const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

const rpcBody = (overrides = {}) => ({
  p_bootcamp_slug: "ai-enabled-java-arabic",
  p_invitation_code: invitationCode,
  p_phone: "+447700900123",
  p_whatsapp_consent: true,
  ...overrides,
});

const run = async () => {
  const proof = {};
  try {
    let result = await call("/rest/v1/rpc/list_bootcamps", { method: "POST", body: {} });
    proof.anonymousCanReadSafeCatalog =
      result.status === 200 &&
      Array.isArray(result.data) &&
      result.data.length === 2 &&
      result.data.every((row) => !("invitation_code_hash" in row));

    result = await call("/rest/v1/bootcamps?select=*", {});
    proof.anonymousCannotReadBootcampTable = [401, 403].includes(result.status);

    result = await call("/rest/v1/bootcamp_enrollments?select=*", {});
    proof.anonymousCannotReadEnrollments = [401, 403].includes(result.status);

    const [emailA, emailB] = await Promise.all([createUser("a"), createUser("b")]);
    const [userA, userB] = await Promise.all([signIn(emailA), signIn(emailB)]);

    result = await call("/rest/v1/rpc/redeem_bootcamp_invitation", {
      method: "POST",
      token: userA.token,
      body: rpcBody({ p_invitation_code: "INVALID-CODE" }),
    });
    proof.invalidInvitationRejected = result.status === 400;

    result = await call("/rest/v1/rpc/redeem_bootcamp_invitation", {
      method: "POST",
      token: userA.token,
      body: rpcBody(),
    });
    proof.firstUserCanEnroll =
      result.status === 200 && Array.isArray(result.data) && result.data[0]?.contact_email === emailA;

    result = await call("/rest/v1/rpc/redeem_bootcamp_invitation", {
      method: "POST",
      token: userB.token,
      body: rpcBody({ p_phone: "+447700900456" }),
    });
    proof.sharedCodeSupportsSecondUser =
      result.status === 200 && Array.isArray(result.data) && result.data[0]?.contact_email === emailB;

    result = await call("/rest/v1/rpc/get_my_bootcamp_enrollment", {
      method: "POST",
      token: userA.token,
      body: { p_bootcamp_slug: "ai-enabled-java-arabic" },
    });
    proof.firstUserReadsOnlyOwnEnrollment =
      result.status === 200 &&
      Array.isArray(result.data) &&
      result.data.length === 1 &&
      result.data[0].contact_email === emailA;

    result = await call("/rest/v1/bootcamp_enrollments?select=*", { token: userA.token });
    proof.authenticatedCannotReadContactTableDirectly = [401, 403].includes(result.status);

    result = await call("/rest/v1/rpc/register_bootcamp_interest", {
      method: "POST",
      body: {
        p_bootcamp_slug: "ai-enabled-java-english",
        p_contact_email: interestEmail,
        p_phone: null,
        p_email_consent: true,
        p_whatsapp_consent: false,
        p_website: null,
      },
    });
    proof.anonymousCanRegisterEmailInterest = result.status === 200 && result.data === true;

    result = await call("/rest/v1/rpc/register_bootcamp_interest", {
      method: "POST",
      body: {
        p_bootcamp_slug: "ai-enabled-java-english",
        p_contact_email: invalidInterestEmail,
        p_phone: "+447700900789",
        p_email_consent: true,
        p_whatsapp_consent: false,
        p_website: null,
      },
    });
    proof.phoneWithoutWhatsappConsentRejected = result.status === 400;

    result = await call("/rest/v1/bootcamp_interest?select=*", {});
    proof.anonymousCannotReadInterestContacts = [401, 403].includes(result.status);

    result = await call(
      `/rest/v1/bootcamp_enrollments?user_id=in.(${userA.id},${userB.id})&select=user_id`,
      { key: secretKey, token: secretKey },
    );
    proof.backendContainsTwoDistinctEnrollments =
      result.status === 200 && Array.isArray(result.data) && result.data.length === 2;

    for (const [name, passed] of Object.entries(proof)) {
      expect(passed, `Bootcamp RLS assertion failed: ${name}`);
    }

    console.log(JSON.stringify({ passed: true, proof }, null, 2));
  } finally {
    await call(`/rest/v1/bootcamp_interest?contact_email=eq.${encodeURIComponent(interestEmail)}`, {
      method: "DELETE",
      key: secretKey,
      token: secretKey,
    });
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
      throw new Error("Bootcamp proof completed, but temporary user cleanup failed");
    }
  }
};

await run();
