import { expect, test } from "@playwright/test";

test("course hub opens the reviewed quickstart", async ({ page }) => {
  await page.goto("/course");
  await expect(page.getByRole("heading", { name: /Build AI-Enabled Applications/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Quickstart + Core path" })).toBeVisible();
  await expect(page.getByText("8 published lessons")).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse learner checkpoints" })).toHaveAttribute(
    "href",
    "https://github.com/Loom-AI-Labs/ai-fabric-course-support-assistant",
  );
  await page.getByRole("link", { name: "Start Quickstart" }).click();
  await expect(page).toHaveURL(/\/course\/quickstart$/);
  await expect(page.getByRole("heading", { name: "First Useful Result" })).toBeVisible();
  await expect(page.getByText("Executable learner checkpoint")).toBeVisible();
  await expect(page.getByRole("link", { name: "Starter checkpoint" })).toHaveAttribute(
    "href",
    /course-0\.3\.3-00-starter$/,
  );
  await expect(page.getByRole("link", { name: "Solution checkpoint" })).toHaveAttribute(
    "href",
    /course-0\.3\.3-01-first-search$/,
  );
  await expect(page.getByText(/AI Fabric adds application-level AI capabilities to Spring Boot/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Theory" })).toHaveCount(0);
  await expect(page.getByText("Recording not published yet")).toHaveCount(0);
});

test("Core 01 presents its complete theory and analysis workspace", async ({ page }) => {
  await page.goto("/course/core/mental-model", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: "What Is AI Fabric? Architecture And Mental Model" })).toBeVisible();
  await expect(page.getByLabel("Assigned theory videos").getByRole("button")).toHaveCount(4);
  await expect(page.getByTitle("What is AI Fabric? lesson video in English")).toHaveAttribute(
    "src",
    /hGEfZQeqHks/,
  );

  await page.getByRole("tab", { name: "Use an assistant" }).click();
  await expect(page.getByRole("heading", { name: "Implementation prompt" })).toBeVisible();
  await page.getByRole("tab", { name: "Analyze manually" }).click();
  await expect(page.getByRole("heading", { name: /Establish The Ownership Boundary/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Check your understanding" })).toBeVisible();
});

test("Core 02 presents the searchable-evidence lifecycle lab", async ({ page }) => {
  await page.goto("/course/core/model-and-index-data", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: "Model And Index Application Data" })).toBeVisible();
  await expect(page.getByLabel("Assigned theory videos").getByRole("button")).toHaveCount(1);
  await expect(page.getByTitle("Searchable evidence lesson video in English")).toHaveAttribute(
    "src",
    /G_qBre7Be1s/,
  );
  await expect(page.getByRole("heading", { name: "Define The Evidence Contract" })).toBeVisible();

  await page.getByRole("tab", { name: "Use an assistant" }).click();
  await expect(
    page.locator("pre").filter({ hasText: "# CORE-02 Coding-Assistant Implementation Prompt" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Build manually" }).click();
  await expect(page.getByRole("heading", { name: "Check your understanding" })).toBeVisible();
});

test("Core 03 presents the evidence-grounded RAG lab", async ({ page }) => {
  await page.goto("/course/core/evidence-grounded-rag", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: "Evidence-Grounded RAG", exact: true })).toBeVisible();
  await expect(page.getByLabel("Assigned theory videos").getByRole("button")).toHaveCount(1);
  await expect(page.getByTitle("Evidence-grounded RAG lesson video in English")).toHaveAttribute(
    "src",
    /T-h-BMjwaXc/,
  );
  await expect(page.getByRole("heading", { name: "Stop On Retrieval Failure Or No Evidence" })).toBeVisible();

  await page.getByRole("tab", { name: "Use an assistant" }).click();
  await expect(
    page.locator("pre").filter({ hasText: "# CORE-03 Coding-Assistant Implementation Prompt" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Build manually" }).click();
  await expect(page.getByRole("heading", { name: "Check your understanding" })).toBeVisible();
});

test("Core 04 presents the governed-action confirmation lab", async ({ page }) => {
  await page.goto("/course/core/governed-actions", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { name: "Governed Actions And Confirmation", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Assigned theory videos").getByRole("button")).toHaveCount(1);
  await expect(
    page.getByTitle("Governed actions and confirmation lesson video in English"),
  ).toHaveAttribute("src", /bTZ08ApmpUQ/);
  await expect(page.getByRole("heading", { name: "Test The Confirmation State Machine" })).toBeVisible();

  await page.getByRole("tab", { name: "Use an assistant" }).click();
  await expect(
    page.locator("pre").filter({ hasText: "# CORE-04 Coding-Assistant Implementation Prompt" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Build manually" }).click();
  await expect(page.getByRole("heading", { name: "Check your understanding" })).toBeVisible();
});

test("Core 05 presents the backend-owned conversation-memory lab", async ({ page }) => {
  await page.goto("/course/core/backend-conversation-memory", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { name: "Backend-Owned Conversation Memory", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Assigned theory videos").getByRole("button")).toHaveCount(1);
  await expect(
    page.getByTitle("Backend-owned conversation memory lesson video in English"),
  ).toHaveAttribute("src", /O1wf-w1Hg0k/);
  await expect(page.getByRole("heading", { name: "Preserve And Consume Pending Confirmation" })).toBeVisible();

  await page.getByRole("tab", { name: "Use an assistant" }).click();
  await expect(
    page.locator("pre").filter({ hasText: "# CORE-05 Coding-Assistant Implementation Prompt" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Build manually" }).click();
  await expect(page.getByRole("heading", { name: "Check your understanding" })).toBeVisible();
});

test("Core 06 presents the tenant-security and privacy boundary lab", async ({ page }) => {
  await page.goto("/course/core/tenant-security-and-privacy", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { name: "Tenant Security And Privacy", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Assigned theory videos").getByRole("button")).toHaveCount(1);
  await expect(
    page.getByTitle("Tenant security and privacy lesson video in English"),
  ).toHaveAttribute("src", /mhO8CrOqpt0/);
  await expect(
    page.getByRole("heading", { name: "Verify Hits Before Building Generation Context" }),
  ).toBeVisible();

  await page.getByRole("tab", { name: "Use an assistant" }).click();
  await expect(
    page.locator("pre").filter({ hasText: "# CORE-06 Coding-Assistant Implementation Prompt" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Build manually" }).click();
  await expect(page.getByRole("heading", { name: "Check your understanding" })).toBeVisible();
});

test("Core 07 presents the complete vertical-slice release gate", async ({ page }) => {
  await page.goto("/course/core/test-and-ship", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { name: "Test And Ship The Vertical Slice", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Assigned theory videos").getByRole("button")).toHaveCount(1);
  await expect(
    page.getByTitle("Testing and shipping AI workflows lesson video in English"),
  ).toHaveAttribute("src", /W_mlsCxAePs/);
  await expect(page.getByRole("heading", { name: "Make The Release Decision" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Verify manually" })).toBeVisible();

  await page.getByRole("tab", { name: "Use an assistant" }).click();
  await expect(page.getByRole("heading", { name: "Verification prompt" })).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "# CORE-07 Coding-Assistant Verification Prompt" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Verify manually" }).click();
  await expect(page.getByRole("heading", { name: "Check your understanding" })).toBeVisible();
});

test("knowledge check grades locally without requiring sign-in", async ({ page }) => {
  await page.goto("/course/quickstart#knowledge-check");
  await page.getByLabel(/Projecting approved content/).check();
  await page.getByLabel(/Support article lifecycle/).check();
  await page.getByLabel(/Stable entity IDs/).check();
  await page.getByLabel(/Verify the records were indexed/).check();
  await page.getByRole("button", { name: "Check my answers" }).click();
  await expect(page.getByText("Checkpoint passed: 100%")).toBeVisible();
  await expect(page.getByText(/Sign in to save across devices/)).toBeVisible();
});

test("course pages do not overflow the viewport", async ({ page }, testInfo) => {
  await page.goto("/course");
  if (testInfo.project.name === "mobile-chromium") {
    await expect(page.getByRole("button", { name: "Lessons" })).toBeVisible();
  } else {
    await expect(page.getByRole("navigation", { name: "Course navigation" })).toBeVisible();
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  await page.goto("/course/core/mental-model", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "What Is AI Fabric? Architecture And Mental Model" })).toBeVisible();
  const lessonOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(lessonOverflow).toBeLessThanOrEqual(1);

  await page.goto("/course/core/model-and-index-data", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Model And Index Application Data" })).toBeVisible();
  const indexingLessonOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(indexingLessonOverflow).toBeLessThanOrEqual(1);

  await page.goto("/course/core/evidence-grounded-rag", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Evidence-Grounded RAG", exact: true })).toBeVisible();
  const ragLessonOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(ragLessonOverflow).toBeLessThanOrEqual(1);

  await page.goto("/course/core/governed-actions", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: "Governed Actions And Confirmation", exact: true }),
  ).toBeVisible();
  const actionLessonOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(actionLessonOverflow).toBeLessThanOrEqual(1);

  await page.goto("/course/core/backend-conversation-memory", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: "Backend-Owned Conversation Memory", exact: true }),
  ).toBeVisible();
  const memoryLessonOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(memoryLessonOverflow).toBeLessThanOrEqual(1);

  await page.goto("/course/core/tenant-security-and-privacy", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: "Tenant Security And Privacy", exact: true }),
  ).toBeVisible();
  const securityLessonOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(securityLessonOverflow).toBeLessThanOrEqual(1);

  await page.goto("/course/core/test-and-ship", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: "Test And Ship The Vertical Slice", exact: true }),
  ).toBeVisible();
  const shippingLessonOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(shippingLessonOverflow).toBeLessThanOrEqual(1);
});
