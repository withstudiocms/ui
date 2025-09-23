import { describe, expect } from 'vitest';
import { test } from '../fixtures/vitest/AstroContainer';

// This is a placeholder test file. Please copy-paste this file when creating new component tests.
// Then replace all instances of "_Template"/"Template" with the name of the component you are testing.
// Finally, update the test cases below to test the functionality of your component.

describe('Template Component', () => {
	test('renders Template component correctly', async ({ renderComponent }) => {
		// @ts-expect-error - Template is a placeholder component for testing purposes
		const result = await renderComponent(Template, 'Template');
		expect(result).toMatchSnapshot();
	});
});
