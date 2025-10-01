import { describe, expect } from 'vitest';
import Center from '../../src/components/Center/Center.astro';
import { test } from '../fixtures/vitest/AstroContainer';

describe('Center Component', () => {
	test('renders Center component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Center, 'Center', {
			slots: { default: 'Centered Content' },
		});
		expect(result).toMatchSnapshot();
	});
});
