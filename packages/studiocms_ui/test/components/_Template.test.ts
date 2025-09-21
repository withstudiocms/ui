import { describe, expect } from 'vitest';
import { test } from '../fixtures/vitest/AstroContainer';

describe('Template Component', () => {
	test('renders Template component correctly', async ({ renderComponent }) => {
		// @ts-expect-error - Template is a placeholder component for testing purposes
		const result = await renderComponent(Template, 'Template');
		expect(result).toMatchSnapshot();
	});
});
