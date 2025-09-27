import { describe, expect } from 'vitest';
import Progress from '../../src/components/Progress/Progress.astro';
import { test } from '../fixtures/vitest/AstroContainer';

describe('Progress Component', () => {
	test('renders Progress component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Progress, 'Progress', {
			props: { id: 'progress-test', value: 50, max: 100, label: "Progress Bar Fixture" },
		});
		expect(result).toMatchSnapshot();
	});
});
