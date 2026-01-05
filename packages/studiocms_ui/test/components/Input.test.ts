import { describe, expect } from 'vitest';
import Input from '../../src/components/Input/Input.astro';
import { test } from '../fixtures/vitest/AstroContainer';

const mockProps = {
	name: 'input-test',
};

describe('Input Component', () => {
	test('renders Input component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Input, 'Input', {
			props: { ...mockProps },
		});
		expect(result).toMatchSnapshot();
	});

	test.for([
		{ label: 'Input Test' },
		{ description: 'This is a test input' },
		{ placeholder: 'Enter text...' },
		{ isRequired: true },
		{ disabled: true },
		{ defaultValue: 'test-value' },
		{ icon: 'heroicons:academic-cap' },
		{ icon: { name: 'heroicons:academic-cap', position: 'left' } },
		{ icon: { name: 'heroicons:academic-cap', position: 'right' } },
	])('renders Input with "%s"', async (props, { renderComponent }) => {
		const result = await renderComponent(Input, 'Input', {
			props: { ...mockProps, ...props },
		});
		expect(result).toMatchSnapshot();
	});
});
