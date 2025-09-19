import { defineEcConfig } from '@astrojs/starlight/expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets';
import ecTwoSlash from 'expressive-code-twoslash';
import ts from 'typescript';

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
					moduleResolution: ts.ModuleResolutionKind.Bundler,
					target: ts.ScriptTarget.ESNext,
					module: ts.ModuleKind.ESNext,
					lib: ['esnext', 'dom'],
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
