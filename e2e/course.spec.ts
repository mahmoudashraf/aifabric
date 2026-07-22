import { expect, test } from "@playwright/test";

test("course hub opens the reviewed quickstart", async ({ page }) => {
  await page.goto("/course");
  await expect(page.getByRole("heading", { name: /Build AI-Enabled Applications/ })).toBeVisible();
  await expect(page.getByText("QS-01: First Useful Result")).toBeVisible();
  await page.getByRole("link", { name: "Start Quickstart" }).click();
  await expect(page).toHaveURL(/\/course\/quickstart$/);
  await expect(page.getByRole("heading", { name: "First Useful Result" })).toBeVisible();
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
});
