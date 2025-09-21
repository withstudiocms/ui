import { icons } from '@iconify-json/heroicons';
import { describe, expect } from 'vitest';
import Icon from '../../src/components/Icon/Icon.astro';
import IconBase from '../../src/components/Icon/IconBase.astro';
import { test } from '../fixtures/vitest/AstroContainer';

describe('Icon Component', () => {
	test('renders Icon component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Icon, 'Icon', {
			props: { name: 'heroicons:academic-cap', height: 24, width: 24 },
		});
		expect(result).toMatchSnapshot();
	});
});

describe('IconBase Component', () => {
	test('renders IconBase component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(IconBase, 'IconBase', {
			props: { iconCollection: icons, name: 'academic-cap', height: 24, width: 24 },
		});
		expect(result).toMatchSnapshot();
	});
});
