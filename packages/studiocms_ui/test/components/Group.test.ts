import { describe, expect } from 'vitest';
import Button from '../../src/components/Button/Button.astro';
import Group from '../../src/components/Group/Group.astro';
import { test } from '../fixtures/vitest/AstroContainer';

describe('Group Component', () => {
	test('renders Group component correctly', async ({ renderComponent }) => {
		const buttons = [];
		for (let i = 1; i <= 3; i++) {
			const button = await renderComponent(Button, 'Button', {
				props: { color: 'primary', variant: 'solid' },
				slots: { default: `Button ${i}` },
			});
			buttons.push(button);
		}

		const content = buttons.join('\n');

		const result = await renderComponent(Group, 'Group', {
			slots: {
				default: content,
			},
		});
		expect(result).toMatchSnapshot();
	});
});
