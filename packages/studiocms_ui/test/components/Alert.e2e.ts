import { expect, test } from "../fixtures/playwright/axeAudit";

test.describe("Alert Component", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the test page for this component
    await page.goto("/alert-test");
  });

  test("Basic functionality", async ({ page }) => {
    const alert = page.locator(".sui-alert").first();
    await expect(alert).toBeVisible();
    await expect(page.getByText("Alert Component Test")).toBeVisible();
    await expect(page.getByText("This is a basic alert component test.")).toBeVisible();
  });

  test("Renders with correct variant icons", async ({ page }) => {
    const defaultAlert = page.locator('[data-variant="default"]');
    const successAlert = page.locator('[data-variant="success"]');
    const dangerAlert = page.locator('[data-variant="danger"]');
    const infoAlert = page.locator('[data-variant="info"]');
    const warningAlert = page.locator('[data-variant="warning"]');
    const monoAlert = page.locator('[data-variant="mono"]');

    await expect(defaultAlert).toBeVisible();
    await expect(successAlert).toBeVisible();
    await expect(dangerAlert).toBeVisible();
    await expect(infoAlert).toBeVisible();
    await expect(warningAlert).toBeVisible();
    await expect(monoAlert).toBeVisible();

    // Verify icons are present
    await expect(defaultAlert.locator(".sui-alert-icon")).toBeVisible();
    await expect(successAlert.locator(".sui-alert-icon")).toBeVisible();
    await expect(dangerAlert.locator(".sui-alert-icon")).toBeVisible();
    await expect(infoAlert.locator(".sui-alert-icon")).toBeVisible();
    await expect(warningAlert.locator(".sui-alert-icon")).toBeVisible();
    await expect(monoAlert.locator(".sui-alert-icon")).toBeVisible();
  });

  test("Renders title correctly", async ({ page }) => {
    await expect(page.getByText("Default Alert")).toBeVisible();
    await expect(page.getByText("Success Alert")).toBeVisible();
    await expect(page.getByText("Danger Alert")).toBeVisible();
    await expect(page.getByText("Info Alert")).toBeVisible();
    await expect(page.getByText("Warning Alert")).toBeVisible();
    await expect(page.getByText("Monochrome Alert")).toBeVisible();
  });

  test("Renders content correctly", async ({ page }) => {
    await expect(page.getByText("This is a default alert message.")).toBeVisible();
    await expect(page.getByText("This is a success alert message.")).toBeVisible();
    await expect(page.getByText("This is a danger alert message.")).toBeVisible();
    await expect(page.getByText("This is an info alert message.")).toBeVisible();
    await expect(page.getByText("This is a warning alert message.")).toBeVisible();
    await expect(page.getByText("This is a monochrome alert message.")).toBeVisible();
  });

  [
    { label: "Basic", key: "basic" },
    { label: "Variant", key: "variant" },
  ].forEach(({ label, key }) => {
    const elmKey = `#${key}-test`;

    test(`Test Accessibility - ${label} Styling (Dark Mode)`, async ({
      bestPractice,
      wcagA,
      wcagAA,
      wcagAAA,
      takeScreenshot,
    }) => {
      await takeScreenshot(`Alert - ${key} (Dark Mode)`, elmKey);
      await bestPractice(elmKey);
      await wcagA(elmKey);
      await wcagAA(elmKey);
      await wcagAAA(elmKey);
    });

    // test(`Test Accessibility - ${label} Styling (Light Mode)`, async ({
    //   bestPractice,
    //   wcagA,
    //   wcagAA,
    //   wcagAAA,
    //   takeScreenshot,
    //   switchToLightMode,
    // }) => {
    //   // Ensure we are in light mode
    //   await switchToLightMode();
    //   await takeScreenshot(`Alert - ${key} (Light Mode)`, elmKey);
    //   await bestPractice(elmKey);
    //   await wcagA(elmKey);
    //   await wcagAA(elmKey);
    //   await wcagAAA(elmKey);
    // });
  });
});
