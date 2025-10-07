import { describe, expect } from 'vitest';
import Divider from '../../src/components/Divider/Divider.astro';
import { test } from '../fixtures/vitest/AstroContainer';

describe('Divider Component', () => {
	test('renders Divider component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Divider, 'Divider');
		expect(result).toMatchSnapshot();
	});

	test.for([
		{ background: 'background-base' },
		{ background: 'background-step-1' },
		{ background: 'background-step-2' },
		{ background: 'background-step-3' },
	])('renders Divider with props "%s"', async (props, { renderComponent }) => {
		const result = await renderComponent(Divider, 'Divider', { props });
		expect(result).toMatchSnapshot();
	});

	test('renders Divider with slotted content', async ({ renderComponent }) => {
		const result = await renderComponent(Divider, 'Divider', {
			slots: { default: 'Slotted Content' },
		});
		expect(result).toMatchSnapshot();
	});
});
