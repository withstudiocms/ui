import { describe, expect } from 'vitest';
import Checkmark from '../src/icons/Checkmark.astro';
import ChevronUpDown from '../src/icons/ChevronUpDown.astro';
import User from '../src/icons/User.astro';
import XMark from '../src/icons/X-Mark.astro';
import { test } from './fixtures/vitest/AstroContainer';

describe('Icon Components', () => {
	test('Checkmark component renders correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Checkmark, 'Checkmark');
		expect(result).toMatchSnapshot();
	});

	test('ChevronUpDown component renders correctly', async ({ renderComponent }) => {
		const result = await renderComponent(ChevronUpDown, 'ChevronUpDown');
		expect(result).toMatchSnapshot();
	});

	test('User component renders correctly', async ({ renderComponent }) => {
		const result = await renderComponent(User, 'User');
		expect(result).toMatchSnapshot();
	});

	test('XMark component renders correctly', async ({ renderComponent }) => {
		const result = await renderComponent(XMark, 'XMark');
		expect(result).toMatchSnapshot();
	});
});
