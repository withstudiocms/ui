import { describe, expect } from 'vitest';
import Toaster from '../../src/components/Toast/Toaster.astro';
import { test } from '../fixtures/vitest/AstroContainer';

describe('Toaster Component', () => {
	test('renders Toaster component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Toaster, 'Toaster');
		expect(result).toMatchSnapshot();
	});

	test.for([
		{ position: 'top-left' },
		{ position: 'top-center' },
		{ position: 'top-right' },
		{ position: 'bottom-left' },
		{ position: 'bottom-center' },
		{ position: 'bottom-right' },
		{ duration: 5000 },
		{ duration: 10000 },
		{ closeButton: true },
		{ closeButton: false },
		{ offset: 20 },
		{ gap: 15 },
	])('renders Toaster component with props "%s"', async (props, { renderComponent }) => {
		const result = await renderComponent(Toaster, 'Toaster', { props });
		expect(result).toMatchSnapshot();
	});
});
