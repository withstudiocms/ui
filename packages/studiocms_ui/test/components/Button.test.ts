import { describe, expect } from 'vitest';
import Button from '../../src/components/Button/Button.astro';
import { test } from '../fixtures/vitest/AstroContainer';

describe('Button Component', () => {
	test('renders Button component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Button, 'Button', { slots: { default: 'Test Button' } });
		expect(result).toMatchSnapshot();
	});

	test.for([
		// sizes
		{ size: 'sm' },
		{ size: 'md' },
		{ size: 'lg' },
		// colors
		{ color: 'primary' },
		{ color: 'default' },
		{ color: 'success' },
		{ color: 'danger' },
		{ color: 'warning' },
		{ color: 'info' },
		{ color: 'mono' },
		// variants
		{ variant: 'solid' },
		{ variant: 'outlined' },
		{ variant: 'flat' },
		// misc
		{ fullWidth: true },
		{ disabled: true },
		{ as: 'a', href: 'https://example.com' },
	])('renders Button with props %#', async (props, { renderComponent }) => {
		const result = await renderComponent(Button, 'Button', {
			props,
			slots: { default: 'Test Button' },
		});
		expect(result).toMatchSnapshot();
	});

	test.for([
		{ name: 'default', content: 'Default Slot' },
		{ name: 'start-content', content: 'Prefix Slot' },
		{ name: 'end-content', content: 'Suffix Slot' },
	])('renders Button with %s slot', async (slot, { renderComponent }) => {
		const result = await renderComponent(Button, 'Button', {
			slots: { [slot.name]: slot.content },
		});
		expect(result).toMatchSnapshot();
	});
});
