import { expect, test } from '../fixtures/playwright/axeAudit';

// This is a placeholder test file. Please copy-paste this file when creating new component tests.
// component tests page files are located in the
// 'packages/studiocms_ui/test/fixtures/test-server/src/pages/' directory.
// Then replace all instances of "_Template"/"Template" with the name of the component you are testing.
// Finally, update the test cases below to test the functionality of your component.

test.describe('Template Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/template-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByText('Template Component Test')).toBeVisible();
	});

	[{ label: 'Basic', key: 'basic' }].forEach(({ label, key }) => {
		const elmKey = `#${key}-test`;
		test(`Test Accessibility - ${label} Styling (Dark Mode)`, async ({
			bestPractice,
			wcagA,
			wcagAA,
			wcagAAA,
			takeScreenshot,
		}) => {
			await takeScreenshot(`Template - ${key} (Dark Mode)`, elmKey);

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

			await takeScreenshot(`Template - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
