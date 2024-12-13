import { defineEcConfig } from '@astrojs/starlight/expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets';
import ecTwoSlash from 'expressive-code-twoslash';

export default defineEcConfig({
	shiki: {
		transformers: [transformerColorizedBrackets()],
	},
	themes: ['dark-plus', 'light-plus'],
	defaultProps: {
		showLineNumbers: false,
	},
	plugins: [
		ecTwoSlash({
			twoslashOptions: {
				compilerOptions: {
					strict: true,
					moduleResolution: 100,
					target: 99,
					exactOptionalPropertyTypes: true,
					downlevelIteration: true,
					skipLibCheck: true,
					lib: ['ES2022', 'DOM', 'DOM.Iterable', 'dom'],
					noEmit: true,
				},
			},
		}),
		pluginLineNumbers(),
	],
	styleOverrides: {
		frames: {
			editorActiveTabIndicatorBottomColor: 'var(--sl-color-accent)',
		},
		gutterForeground: 'rgba(166, 166, 166, 0.84)',
		twoSlash: {
			cursorColor: '#f8f8f2',
		},
	},
});
