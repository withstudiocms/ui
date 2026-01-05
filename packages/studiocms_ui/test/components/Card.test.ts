import { describe, expect } from 'vitest';
import Card from '../../src/components/Card/Card.astro';
import { test } from '../fixtures/vitest/AstroContainer';

const lorem =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

describe('Card Component', () => {
	test('renders Card component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Card, 'Card', { slots: { default: lorem } });
		expect(result).toMatchSnapshot();
	});

	test.for([
		{ fullWidth: true },
		{ fullHeight: true },
		{ variant: 'default' },
		{ variant: 'filled' },
	])('renders Card with props %s', async (props, { renderComponent }) => {
		const result = await renderComponent(Card, 'Card', {
			props,
			slots: { default: lorem },
		});
		expect(result).toMatchSnapshot();
	});

	test.for([
		{ name: 'default', content: 'Default Slot' },
		{ name: 'header', content: 'Header Slot' },
		{ name: 'footer', content: 'Footer Slot' },
	])('renders Card with %s slot', async (slot, { renderComponent }) => {
		const result = await renderComponent(Card, 'Card', {
			slots: { [slot.name]: slot.content, default: lorem },
		});
		expect(result).toMatchSnapshot();
	});
});
