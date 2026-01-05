import { describe, expect } from 'vitest';
import RadioGroup from '../../src/components/RadioGroup/RadioGroup.astro';
import { test } from '../fixtures/vitest/AstroContainer';

const mockProps = {
	name: 'test-radio-group',
	label: 'Test Radio Group',
	options: [
		{ label: 'Option 1', value: 'option1' },
		{ label: 'Option 2', value: 'option2' },
		{ label: 'Option 3', value: 'option3' },
	],
	defaultValue: 'option2',
};

describe('RadioGroup Component', () => {
	test('renders RadioGroup component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(RadioGroup, 'RadioGroup', { props: mockProps });
		expect(result).toMatchSnapshot();
	});

	test.for([
		{ ...mockProps, disabled: true },
		{ ...mockProps, isRequired: true },
		{ ...mockProps, horizontal: true },
	])('renders RadioGroup with props: "%s"', async (props, { renderComponent }) => {
		const result = await renderComponent(RadioGroup, 'RadioGroup', { props });
		expect(result).toMatchSnapshot();
	});
});
