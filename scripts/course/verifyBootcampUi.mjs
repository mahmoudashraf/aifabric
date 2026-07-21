import { randomBytes } from "node:crypto";

import { chromium } from "playwright";

const supabaseUrl = process.env.COURSE_SUPABASE_URL?.replace(/\/$/, "");
const publishableKey = process.env.COURSE_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.COURSE_SUPABASE_SECRET_KEY;
const invitationCode = process.env.BOOTCAMP_INVITATION_CODE;
const websiteUrl = (process.env.BOOTCAMP_UI_BASE_URL ?? "http://127.0.0.1:4181").replace(/\/$/, "");
const screenshotPath = process.env.BOOTCAMP_UI_SCREENSHOT ?? "/tmp/ai-fabric-bootcamp-enrollment-success.png";

if (!supabaseUrl || !publishableKey || !secretKey || !invitationCode) {
  throw new Error(
    "Set COURSE_SUPABASE_URL, COURSE_SUPABASE_PUBLISHABLE_KEY, COURSE_SUPABASE_SECRET_KEY, and BOOTCAMP_INVITATION_CODE",
  );
}

const runId = `${Date.now()}-${randomBytes(4).toString("hex")}`;
const email = `bootcamp-ui-${runId}@example.invalid`;
const password = `Bootcamp-${randomBytes(18).toString("base64url")}!9`;
let userId;

const authCall = async (path, { method = "POST", key = publishableKey, body } = {}) => {
  const response = await fetch(`${supabaseUrl}${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Supabase Auth HTTP ${response.status}`);
  return data;
};

try {
  const created = await authCall("/auth/v1/admin/users", {
    key: secretKey,
    body: {
      email,
      password,
      email_confirm: true,
      user_metadata: { test_scope: "bootcamp-ui-proof" },
    },
  });
  userId = created.id;

  const session = await authCall("/auth/v1/token?grant_type=password", {
    body: { email, password },
  });

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1360, height: 950 } });
    const browserErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") browserErrors.push(message.text());
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));

    await page.addInitScript(
      (authSession) => localStorage.setItem("ai-fabric-course-auth", JSON.stringify(authSession)),
      session,
    );
    await page.goto(
      `${websiteUrl}/bootcamps/ai-enabled-java-arabic?code=${encodeURIComponent(invitationCode)}`,
      { waitUntil: "domcontentloaded" },
    );

    const accountEmail = page.getByRole("textbox", { name: "Account email", exact: true });
    await accountEmail.waitFor();
    if ((await accountEmail.inputValue()) !== email) {
      throw new Error("Authenticated email was not bound to the enrollment form");
    }
    if (new URL(page.url()).searchParams.has("code")) {
      throw new Error("Invitation code remained in the visible URL");
    }

    await page.getByLabel("WhatsApp phone number").fill("+44 7700 900 321");
    await page.getByText(/I agree that AI Fabric may use my account email/).click();
    await page.getByRole("button", { name: "Join bootcamp" }).click();
    await page.getByRole("heading", { name: "You are registered" }).waitFor();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: screenshotPath, fullPage: true });

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "You are registered" }).waitFor();

    if (browserErrors.length > 0) {
      throw new Error(`Browser errors: ${browserErrors.join(" | ")}`);
    }
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify({ passed: true, proof: { authenticatedEnrollment: true, reloadPersistence: true } }, null, 2));
} finally {
  if (userId) {
    await authCall(`/auth/v1/admin/users/${userId}`, { method: "DELETE", key: secretKey });
  }
}
