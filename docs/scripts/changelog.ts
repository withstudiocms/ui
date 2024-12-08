import type { List, Root } from 'mdast';
import { toMarkdown } from 'mdast-util-to-markdown';
import { loadChangelog, semverCategories } from './lib/changelogs';
import { writeFileLines } from './lib/utils';

const changelog = loadChangelog('../packages/studiocms_ui/CHANGELOG.md');

// Generate markdown output
const output: string[] = [];

output.push(
	// Add release notes frontmatter to output
	'---',
	'# Warning: This file is generated automatically. Do not edit!',
	'title: Release Notes',
	'description: Release notes for the @studiocms/ui package.',
	'editUrl: false',
	'---',
	'',
	'This document contains release notes for the `@studiocms/ui` package.',
	'For more information, see the [CHANGELOG file](https://github.com/withstudiocms/ui/blob/main/packages/studiocms_ui/CHANGELOG.md)',
	''
);

const ast: Root = {
	type: 'root',
	children: [],
};

for (const version of changelog.versions) {
	const versionChanges: List = { type: 'list', children: [] };

	for (const semverCategory of semverCategories) {
		for (const listItem of version.changes[semverCategory].children) {
			versionChanges.children.push(listItem);
		}
	}

	if (version.includes.size) {
		versionChanges.children.push({
			type: 'listItem',
			children: [
				{
					type: 'paragraph',
					children: [{ type: 'text', value: `Includes: ${[...version.includes].join(', ')} ` }],
				},
			],
		});
	}

	if (!versionChanges.children.length) continue;

	ast.children.push({
		type: 'heading',
		depth: 2,
		children: [{ type: 'text', value: version.version }],
	});

	ast.children.push(versionChanges);
}

output.push(toMarkdown(ast, { bullet: '-' }));

// Write output to file
writeFileLines('./src/content/docs/docs/changelog.md', output);
