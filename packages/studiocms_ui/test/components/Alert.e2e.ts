import { expect, test } from "../fixtures/playwright/axeAudit";

test.describe("Alert Component", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the test page for this component
    await page.goto("/alert-test");
  });

  test("Basic functionality", async ({ page }) => {
    const alert = page.locator("#basic-test .sui-alert");
    await expect(alert).toBeVisible();
    await expect(alert.locator(".sui-alert-title")).toHaveText("Alert Component Test");
    await expect(alert.locator(".sui-alert-content")).toContainText(
      "This is a basic alert component test.",
    );
  });

  test("Renders all variant alerts", async ({ page }) => {
    const variantSection = page.locator("#variant-test");

    await expect(variantSection.locator('[data-variant="default"] .sui-alert-title')).toHaveText(
      "Default Alert",
    );
    await expect(variantSection.locator('[data-variant="success"] .sui-alert-title')).toHaveText(
      "Success Alert",
    );
    await expect(variantSection.locator('[data-variant="danger"] .sui-alert-title')).toHaveText(
      "Danger Alert",
    );
    await expect(variantSection.locator('[data-variant="info"] .sui-alert-title')).toHaveText(
      "Info Alert",
    );
    await expect(variantSection.locator('[data-variant="warning"] .sui-alert-title')).toHaveText(
      "Warning Alert",
    );
    await expect(variantSection.locator('[data-variant="mono"] .sui-alert-title')).toHaveText(
      "Monochrome Alert",
    );
  });

  test("Renders alert content correctly", async ({ page }) => {
    const variantSection = page.locator("#variant-test");

    await expect(
      variantSection.locator('[data-variant="default"] .sui-alert-content'),
    ).toContainText("This is a default alert message.");
    await expect(
      variantSection.locator('[data-variant="success"] .sui-alert-content'),
    ).toContainText("This is a success alert message.");
    await expect(
      variantSection.locator('[data-variant="danger"] .sui-alert-content'),
    ).toContainText("This is a danger alert message.");
    await expect(variantSection.locator('[data-variant="info"] .sui-alert-content')).toContainText(
      "This is an info alert message.",
    );
    await expect(
      variantSection.locator('[data-variant="warning"] .sui-alert-content'),
    ).toContainText("This is a warning alert message.");
    await expect(variantSection.locator('[data-variant="mono"] .sui-alert-content')).toContainText(
      "This is a monochrome alert message.",
    );
  });

  test("Renders with correct variant icons", async ({ page }) => {
    const variantSection = page.locator("#variant-test");

    await expect(variantSection.locator('[data-variant="default"] .sui-alert-icon')).toBeVisible();
    await expect(variantSection.locator('[data-variant="success"] .sui-alert-icon')).toBeVisible();
    await expect(variantSection.locator('[data-variant="danger"] .sui-alert-icon')).toBeVisible();
    await expect(variantSection.locator('[data-variant="info"] .sui-alert-icon')).toBeVisible();
    await expect(variantSection.locator('[data-variant="warning"] .sui-alert-icon')).toBeVisible();
    await expect(variantSection.locator('[data-variant="mono"] .sui-alert-icon')).toBeVisible();
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

    test(`Test Accessibility - ${label} Styling (Light Mode)`, async ({
      bestPractice,
      wcagA,
      wcagAA,
      wcagAAA,
      takeScreenshot,
      switchToLightMode,
    }) => {
      // Ensure we are in light mode
      await switchToLightMode();

      await takeScreenshot(`Alert - ${key} (Light Mode)`, elmKey);

      await bestPractice(elmKey);
      await wcagA(elmKey);
      await wcagAA(elmKey);
      await wcagAAA(elmKey);
    });
  });
});
