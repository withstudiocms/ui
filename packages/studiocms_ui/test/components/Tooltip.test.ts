import { describe, expect } from 'vitest';
import Tooltip from '../../src/components/Tooltip/Tooltip.astro';
import { test } from '../fixtures/vitest/AstroContainer';

describe('Tooltip Component', () => {
	test('renders Tooltip component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Tooltip, 'Tooltip', {
			slots: {
				default: 'Hover me',
				tooltip: 'This is a tooltip',
			},
		});
		expect(result).toMatchSnapshot();
	});
});
