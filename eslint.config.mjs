import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
	{
		files: ['**/*.js'],
		languageOptions: {
			sourceType: 'module', // Cambiar a "module" para permitir import/export
		},
	},
	{
		languageOptions: {
			globals: globals.browser,
		},
	},
	pluginJs.configs.recommended,
];
