import { expect, test } from "@playwright/test";

test("course hub opens the reviewed quickstart", async ({ page }) => {
  await page.goto("/course");
  await expect(page.getByRole("heading", { name: /Build Production-Oriented AI Workflows/ })).toBeVisible();
  await expect(page.getByText("QS-01: First Useful Result")).toBeVisible();
  await page.getByRole("link", { name: "Start Quickstart" }).click();
  await expect(page).toHaveURL(/\/course\/quickstart$/);
  await expect(page.getByRole("heading", { name: "First Useful Result" })).toBeVisible();
  await expect(page.getByText(/AI Fabric adds application-level AI capabilities to Spring Boot/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Theory" })).toHaveCount(0);
  await expect(page.getByText("Recording not published yet")).toHaveCount(0);
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
});
