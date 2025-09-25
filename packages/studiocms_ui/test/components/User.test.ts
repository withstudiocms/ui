import { describe, expect } from 'vitest';
import User from '../../src/components/User/User.astro';
import { test } from '../fixtures/vitest/AstroContainer';

describe('User Component', () => {
	test('renders User component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(User, 'User', {
			props: {
				name: 'John Doe',
				description: 'Administrator',
			},
		});
		expect(result).toMatchSnapshot();
	});

	test('renders User component with image correctly', async ({ renderComponent }) => {
		const result = await renderComponent(User, 'User', {
			props: {
				name: 'Jane Smith',
				description: 'Editor',
				avatar: 'https://seccdn.libravatar.org/static/img/mm/80.png',
			},
		});
		expect(result).toMatchSnapshot();
	});
});
