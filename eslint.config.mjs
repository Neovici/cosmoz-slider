import cfg from '@neovici/cfg/eslint/index.mjs';

export default [
	...cfg,
	{
		rules: {
			'max-lines-per-function': 'off',
			'no-unused-expressions': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'import/group-exports': 'off',
		},
	},
	{
		files: ['test/**/*.js', 'test/**/*.ts'],
		rules: {
			'mocha/max-top-level-suites': 'off',
			'mocha/no-top-level-hooks': 'off',
			'mocha/no-global-tests': 'off',
		},
	},
	{
		files: ['.storybook/**/*.ts', '.storybook/**/*.js'],
		rules: {
			'require-unicode-regexp': 'off',
		},
	},
	{ ignores: ['coverage/**', 'storybook-static/**'] },
];
