import { describe, expect } from 'vitest';
import Checkbox from '../../src/components/Checkbox/Checkbox.astro';
import { test } from '../fixtures/vitest/AstroContainer';

const recurringProps = {
	label: 'Checkbox Label',
	name: 'checkbox-test',
};

describe('Checkbox Component', () => {
	test('renders Checkbox component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Checkbox, 'Checkbox', {
			props: { ...recurringProps },
		});
		expect(result).toMatchSnapshot();
	});

	test.for([
		{ ...recurringProps, defaultChecked: true },
		{ ...recurringProps, disabled: true },
		{ ...recurringProps, size: 'sm' },
		{ ...recurringProps, size: 'md' },
		{ ...recurringProps, size: 'lg' },
		{ ...recurringProps, color: 'default' },
		{ ...recurringProps, color: 'primary' },
		{ ...recurringProps, color: 'success' },
		{ ...recurringProps, color: 'warning' },
		{ ...recurringProps, color: 'danger' },
		{ ...recurringProps, color: 'info' },
		{ ...recurringProps, color: 'mono' },
		{ ...recurringProps, isRequired: true },
		{ ...recurringProps, value: 'customValue' },
	])('renders Checkbox with props "%s"', async (props, { renderComponent }) => {
		const result = await renderComponent(Checkbox, 'Checkbox', { props });
		expect(result).toMatchSnapshot();
	});
});
